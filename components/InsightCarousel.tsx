"use client";
import {
	AnimatePresence,
	animate,
	motion,
	type PanInfo,
	useMotionValue,
	useSpring,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface InsightCarouselProps {
	children: React.ReactNode;
}

export default function InsightCarousel({ children }: InsightCarouselProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);

	const [isHovered, setIsHovered] = useState(false);
	const [trackWidth, setTrackWidth] = useState(0);
	const [viewWidth, setViewWidth] = useState(0);
	const [showLeft, setShowLeft] = useState(false);
	const [showRight, setShowRight] = useState(true);

	const x = useMotionValue(0);

	// Spring for "Apple-style" smoothness
	const springConfig = { stiffness: 400, damping: 40, mass: 1 };
	const springX = useSpring(x, springConfig);

	// Resize handling
	useEffect(() => {
		const updateWidths = () => {
			if (trackRef.current && containerRef.current) {
				setTrackWidth(trackRef.current.scrollWidth);
				setViewWidth(containerRef.current.offsetWidth);
			}
		};
		updateWidths();
		window.addEventListener("resize", updateWidths);
		return () => window.removeEventListener("resize", updateWidths);
	}, [children]);

	const maxScroll = useMemo(() => {
		return Math.max(0, trackWidth - viewWidth);
	}, [trackWidth, viewWidth]);

	// Update arrow visibility on x change
	useEffect(() => {
		return x.on("change", (latest) => {
			setShowLeft(latest < -10);
			setShowRight(latest > -maxScroll + 10);
		});
	}, [x, maxScroll]);

	// Auto-scroll logic (Slowly move to the left)
	useEffect(() => {
		if (isHovered || maxScroll <= 0) return;

		const speed = 0.5; // pixels per frame approx
		let frameId: number;

		const move = () => {
			const currentX = x.get();
			let nextX = currentX - speed;

			// Loop back if reached the end
			if (Math.abs(nextX) >= maxScroll) {
				nextX = 0;
			}

			x.set(nextX);
			frameId = requestAnimationFrame(move);
		};

		frameId = requestAnimationFrame(move);
		return () => cancelAnimationFrame(frameId);
	}, [isHovered, maxScroll, x]);

	const handleDrag = (_: any, info: PanInfo) => {
		const newX = x.get() + info.delta.x;
		// Bounds clamping
		const clampedX = Math.min(0, Math.max(-maxScroll, newX));
		x.set(clampedX);
	};

	const scrollHandler = (direction: "left" | "right") => {
		const step = 420; // Card width + gap
		const currentX = x.get();
		let targetX = direction === "left" ? currentX + step : currentX - step;

		// Boundary check
		targetX = Math.min(0, Math.max(-maxScroll, targetX));

		animate(x, targetX, {
			type: "spring",
			...springConfig,
		});
	};

	return (
		<div
			ref={containerRef}
			className="relative w-full overflow-hidden"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Arrows */}
			<AnimatePresence>
				{showLeft && (
					<motion.button
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
						whileHover={{
							scale: 1.1,
							backgroundColor: "#f59e0b",
							color: "#000",
						}}
						onClick={() => scrollHandler("left")}
						className="absolute left-2 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/80 border border-amber-500/50 flex items-center justify-center text-amber-500 shadow-2xl backdrop-blur-md"
					>
						<ChevronLeft size={28} />
					</motion.button>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showRight && (
					<motion.button
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
						whileHover={{
							scale: 1.1,
							backgroundColor: "#f59e0b",
							color: "#000",
						}}
						onClick={() => scrollHandler("right")}
						className="absolute right-2 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/80 border border-amber-500/50 flex items-center justify-center text-amber-500 shadow-2xl backdrop-blur-md"
					>
						<ChevronRight size={28} />
					</motion.button>
				)}
			</AnimatePresence>

			<motion.div
				ref={trackRef}
				drag="x"
				dragConstraints={{ left: -maxScroll, right: 0 }}
				dragElastic={0.1}
				onDrag={handleDrag}
				style={{ x: springX }}
				className="flex gap-8 pb-10 pt-4 px-2 cursor-grab active:cursor-grabbing shrink-0"
			>
				{children}
			</motion.div>
		</div>
	);
}
