"use client";

import { motion } from "framer-motion";
import { Clock, Globe, ShieldCheck, Target, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
	getMtfAnalysis,
	type MtfAnalysis,
	subscribeTickAnalysis,
	type TickAnalysis,
} from "@/lib/analysis-service";

export default function AiAnalysisDashboard() {
	const [analysis, setAnalysis] = useState<TickAnalysis | null>(null);
	const [mtfData, setMtfData] = useState<MtfAnalysis | null>(null);
	const [activeTf, setActiveTf] = useState<string>("H1");
	const [loading, setLoading] = useState(true);

	// 렌더링마다 변하지 않는 히스토그램 데이터 생성
	const barData = useMemo(() => {
		return Array.from({ length: 20 }, (_, i) => ({
			height: 20 + (Math.sin(i * 0.5) + 1) * 30,
			duration: 1 + (i % 3) * 0.5,
		}));
	}, []);

	useEffect(() => {
		// 1. 실시간 틱 분석 구독
		const unsubscribe = subscribeTickAnalysis((data) => {
			setAnalysis(data);
		});

		// 2. 멀티 타임프레임 분석 데이터 가져오기
		getMtfAnalysis().then((data) => {
			setMtfData(data);
			if (data && data.analysis.length > 0) {
				// H1이 있으면 기본값으로, 없으면 첫 번째 TF 선택
				const hasH1 = data.analysis.find((a) => a.tf === "H1");
				setActiveTf(hasH1 ? "H1" : data.analysis[0].tf);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const currentTfData = mtfData?.analysis.find((a) => a.tf === activeTf);

	if (loading)
		return (
			<div className="flex items-center justify-center p-12 bg-gray-900/20 rounded-3xl border border-gray-800 animate-pulse">
				<p className="text-gray-500 font-medium tracking-widest uppercase text-xs">
					AI 실시간 수급 분석 중...
				</p>
			</div>
		);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
			{/* 1. Real-time Sentiment Gauge */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="p-8 rounded-3xl bg-[#0F1115] border border-gray-800 shadow-xl overflow-hidden relative group"
			>
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
							<Zap size={20} />
						</div>
						<div>
							<h4 className="font-bold text-white text-base">
								실시간 수급 모멘텀
							</h4>
							<p className="text-[10px] text-gray-500 uppercase flex items-center gap-1 font-bold">
								<Clock size={10} /> {analysis?.phase || "Trading Session"}
							</p>
						</div>
					</div>
					<motion.div
						animate={{ scale: [1, 1.2, 1] }}
						transition={{ repeat: Infinity, duration: 2 }}
						className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
							analysis?.signal === "BUY"
								? "bg-green-500/10 text-green-500 border border-green-500/20"
								: analysis?.signal === "SELL"
									? "bg-red-500/10 text-red-400 border border-red-500/20"
									: "bg-gray-500/10 text-gray-500 border border-gray-500/20"
						}`}
					>
						{analysis?.signal === "BUY"
							? "매수 관점"
							: analysis?.signal === "SELL"
								? "매도 관점"
								: "관망/중립"}
					</motion.div>
				</div>

				<div className="flex flex-col gap-6">
					<div className="relative h-24 flex items-end gap-1 px-4">
						{barData.map((bar, i) => (
							<motion.div
								key={i}
								initial={{ height: 10 }}
								animate={{ height: bar.height }}
								transition={{
									repeat: Infinity,
									repeatType: "reverse",
									duration: bar.duration,
								}}
								className={`flex-1 rounded-t-sm ${analysis?.signal === "BUY" ? "bg-green-500/40" : "bg-red-500/40"}`}
							/>
						))}
						<div className="absolute inset-x-0 bottom-0 h-px bg-gray-800" />
					</div>

					<div className="flex items-center justify-between">
						<div className="flex flex-col">
							<span className="text-3xl font-black text-white">
								{analysis?.intensity || 0}%
							</span>
							<span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter italic">
								AI 데이터 신뢰도
							</span>
						</div>
						<div className="text-right max-w-[60%]">
							<p className="text-gray-400 text-[10px] leading-relaxed font-medium italic">
								&quot;
								{analysis?.reason || "과거 사례 기반 데이터 분석 대기 중..."}
								&quot;
							</p>
						</div>
					</div>
				</div>
				<p className="mt-4 text-[9px] text-gray-600 font-medium leading-tight">
					※ 본 데이터는 과거 통계와 알고리즘 기반의 <b>학습용 분석 정보</b>이며,
					투자의 책임은 본인에게 있습니다.
				</p>
			</motion.div>

			{/* 2. Institutional MTF Volume Profile */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="p-8 rounded-3xl bg-[#0F1115] border border-gray-800 shadow-xl relative overflow-hidden"
			>
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
							<Target size={20} />
						</div>
						<div>
							<h4 className="font-bold text-white text-base">
								MTF 매물대 (POC)
							</h4>
							<p className="text-[10px] text-gray-500 uppercase flex items-center gap-1 font-bold">
								<Globe size={10} /> Multi-Timeframe Analysis
							</p>
						</div>
					</div>
				</div>

				{/* TF Switcher Tabs */}
				<div className="flex gap-1 p-1 rounded-xl bg-gray-950 border border-gray-800 mb-6">
					{mtfData?.analysis.map((tf) => (
						<button
							key={tf.tf}
							onClick={() => setActiveTf(tf.tf)}
							className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${
								activeTf === tf.tf
									? "bg-blue-600 text-white shadow-lg"
									: "text-gray-500 hover:text-gray-300"
							}`}
						>
							{tf.tf}
						</button>
					))}
				</div>

				<div className="flex flex-col gap-4">
					{currentTfData?.levels.slice(0, 4).map((level, i) => (
						<div key={i} className="flex flex-col gap-2">
							<div className="flex items-center justify-between group cursor-help">
								<div className="flex items-center gap-2">
									<span className="text-[10px] font-bold text-gray-600 bg-gray-900 w-5 h-5 flex items-center justify-center rounded-md">
										{i + 1}
									</span>
									<span className="text-sm font-black text-gray-200 tracking-tight">
										${level.price}
									</span>
								</div>
								<span className="text-[10px] font-mono text-blue-400 opacity-70">
									VOL {level.volume.toLocaleString()}
								</span>
							</div>
							<div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800/50">
								<motion.div
									initial={{ width: 0 }}
									animate={{
										width: `${(level.volume / currentTfData.levels[0].volume) * 100}%`,
									}}
									className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
								/>
							</div>
						</div>
					))}
				</div>

				<div className="mt-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
					<ShieldCheck size={14} className="text-blue-500 mt-1 flex-shrink-0" />
					<p className="text-[10px] text-blue-300 leading-relaxed font-medium">
						<b>{activeTf} 타임프레임</b> 기준 핵심 POC는{" "}
						<b>${currentTfData?.poc}</b>입니다. <br />
						장기(D, H1)와 단기(M1, M2) 매물대가 겹치는 구간을 최우선으로
						분석하세요.
					</p>
				</div>
			</motion.div>
		</div>
	);
}
