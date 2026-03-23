"use client";
import { motion } from "framer-motion";
import React, { memo, useEffect, useRef } from "react";

interface Level {
	price: number;
	label: string;
	type: "major" | "minor";
}

interface ChartProps {
	levels?: Level[];
	interval?: string;
}

function TradingViewChart({ levels, interval = "H1" }: ChartProps) {
	const container = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const currentContainer = container.current;
		if (!currentContainer) return;

		// Clear existing content to avoid duplicate charts
		const widgetContainer = currentContainer.querySelector(
			".tradingview-widget-container__widget",
		);
		if (widgetContainer) widgetContainer.innerHTML = "";

		const script = document.createElement("script");
		script.src =
			"https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
		script.type = "text/javascript";
		script.async = true;
		script.innerHTML = JSON.stringify({
			autosize: true,
			symbol: "FPMARKETS:XAUUSD",
			interval: interval,
			timezone: "Asia/Seoul",
			theme: "dark",
			style: "1",
			locale: "kr",
			enable_publishing: false,
			allow_symbol_change: true,
			calendar: false,
			support_host: "https://www.tradingview.com",
			backgroundColor: "#0F1115",
			gridColor: "rgba(42, 46, 57, 0.06)",
			hide_top_toolbar: false,
			save_image: false,
			details: false,
			hotlist: false,
			container_id: "tv_chart_container",
		});

		if (widgetContainer) widgetContainer.appendChild(script);
	}, [interval]);

	// 차트 박스 범위 계산 (화면상 높이 조절)
	const maxP = 5330;
	const minP = 5080;
	const range = maxP - minP;

	return (
		<div className="relative w-full h-full group" ref={container}>
			{/* Volume Profile Overlay (Directly over the candles) */}
			<div className="absolute inset-x-0 inset-y-12 pointer-events-none z-10 overflow-hidden">
				{levels
					?.filter((l) => l.type === "major")
					.map((level, i) => {
						const top = ((maxP - level.price) / range) * 100;
						return (
							<motion.div
								key={i}
								initial={{ opacity: 0, scaleX: 0 }}
								animate={{ opacity: 0.15, scaleX: 1 }}
								className="absolute left-0 right-16 h-8 -mt-4 bg-cyan-400 border-y border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
								style={{ top: `${top}%` }}
							/>
						);
					})}
			</div>

			<div
				className="tradingview-widget-container__widget w-full h-full"
				id="tv_chart_container"
			></div>
		</div>
	);
}

export default memo(TradingViewChart);
