"use client";

import { motion } from "framer-motion";

interface Level {
	price: number;
	label: string;
	type: "major" | "minor";
}

export default function PriceLevelMap({ levels }: { levels: Level[] }) {
	const sortedLevels = [...levels].sort((a, b) => b.price - a.price);
	const maxPrice = sortedLevels[0].price;
	const minPrice = sortedLevels[sortedLevels.length - 1].price;
	const range = maxPrice - minPrice;

	return (
		<div className="relative w-full h-[400px] bg-[#0F1115] rounded-3xl border border-gray-800 p-6 overflow-hidden select-none">
			<div
				className="absolute inset-0 opacity-10"
				style={{
					backgroundImage: "radial-gradient(#2A2E39 1px, transparent 1px)",
					backgroundSize: "20px 20px",
				}}
			/>

			<div className="relative h-full w-full">
				{sortedLevels.map((level, i) => {
					// 가격 비중에 따른 위치 계산 (최소 5% 마진 확보)
					const rawTop = ((maxPrice - level.price) / range) * 85 + 5;

					return (
						<motion.div
							key={i}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: i * 0.05 }}
							className="absolute left-0 right-0 flex items-center transition-all duration-300"
							style={{ top: `${rawTop}%` }}
						>
							{/* Box Visualization for Major Levels */}
							{level.type === "major" && (
								<div
									className="absolute left-0 h-10 -top-5 rounded-r-lg bg-cyan-500/10 border-y border-r border-cyan-500/20 pointer-events-none"
									style={{ width: "60%" }}
								/>
							)}

							<div className="flex items-center gap-3 w-full z-10">
								<div
									className={`h-[1px] flex-1 ${level.type === "major" ? "bg-cyan-500/40" : "bg-gray-800 border-t border-dashed"}`}
								/>
								<div
									className={`flex flex-col items-end shrink-0 py-1 px-2 rounded-lg bg-[#0F1115]/80 backdrop-blur-sm border ${
										level.type === "major"
											? "border-cyan-500/30"
											: "border-gray-800"
									}`}
								>
									<span
										className={`text-[9px] font-black uppercase tracking-tighter leading-none mb-1 ${level.type === "major" ? "text-cyan-400" : "text-gray-500"}`}
									>
										{level.label}
									</span>
									<span
										className={`text-xs font-black leading-none ${level.type === "major" ? "text-white" : "text-gray-400"}`}
									>
										${level.price.toLocaleString()}
									</span>
								</div>
							</div>
						</motion.div>
					);
				})}

				{/* Current Price Marker (Mock for visualization) */}
				<div className="absolute right-0 top-[40%] flex items-center gap-2">
					<div className="px-2 py-1 bg-green-500 text-[10px] font-black text-white rounded shadow-lg">
						LIVE $5,278.4
					</div>
					<div className="w-full h-[1px] bg-green-500/50 w-[100px]" />
				</div>
			</div>

			<div className="absolute bottom-4 left-6">
				<p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.2em]">
					Institutional Supply/Demand Map (Educational)
				</p>
			</div>
		</div>
	);
}
