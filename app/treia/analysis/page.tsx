"use client";
import { ArrowUpRight, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import AdminAnalysisEditor from "@/components/AdminAnalysisEditor";
import AiAnalysisDashboard from "@/components/AiAnalysisDashboard";
import EducationalPerspectiveCard from "@/components/EducationalPerspectiveCard";
import PriceLevelMap from "@/components/PriceLevelMap";
import TradingViewChart from "@/components/TradingViewChart";
import {
	type PageAnalysis,
	subscribePageAnalysis,
} from "@/lib/analysis-service";

const defaultMarketLevels = [
	{ price: 5315, label: "March Target Zone", type: "major" as const },
	{ price: 5280, label: "Resistance Wall", type: "major" as const },
	{ price: 5278.4, label: "Institutional POC", type: "major" as const },
	{ price: 5205, label: "Session Box High", type: "minor" as const },
	{ price: 5184, label: "Standard Pivot", type: "minor" as const },
	{ price: 5130, label: "Liquidity Capture", type: "major" as const },
];

const defaultScenarios = [
	{
		title: "Price Discovery Phase",
		desc: "역사적 신고가 $5,300 돌파 시도는 단순한 상승을 넘어 새로운 가치 영역을 탐색하는 프로세스입니다.",
		color: "bg-cyan-400",
	},
	{
		title: "Institutional Flush",
		desc: "주요 POC 이탈 시 하단 유동성 거점($5,130)까지의 급격한 가격 이동(Flash)이 빈번하게 관찰됩니다.",
		color: "bg-red-500",
	},
];

const defaultAnalysisText =
	"목요일 저점($5,130)에서의 강력한 V자 반등은 단순한 상승이 아닌 기관의 대량 매집 신호로 해석됩니다. 현재 $5,278 부근의 주간 POC 안착 여부가 다음 세션의 방향성을 결정짓는 핵심 관찰 포인트입니다.";

export default function AnalysisPage() {
	const [data, setData] = useState<PageAnalysis | null>(null);

	useEffect(() => {
		const unsubscribe = subscribePageAnalysis((newData) => {
			setData(newData);
		});
		return () => unsubscribe();
	}, []);

	const marketLevels = data?.marketLevels || defaultMarketLevels;
	const scenarios = data?.scenarios || defaultScenarios;
	const analysisText = data?.mainText || defaultAnalysisText;

	return (
		<div className="container mx-auto px-4 py-12 flex flex-col gap-12">
			<header className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
						<BarChart3 size={20} />
					</div>
					<h1 className="text-3xl font-outfit font-extrabold text-white tracking-tight">
						AI 시장 분석 및 교육 관점
					</h1>
				</div>
				<p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
					과거 틱데이터 및 멀티 타임프레임(MTF) 분석을 통해 시장의{" "}
					<b>구조적 결함</b>과 <b>세력의 매집 흔적</b>을 찾아냅니다. <br />본
					정보는 투자 권유가 아닌 시장 이해를 돕기 위한 교육적 데이터입니다.
				</p>
			</header>

			<div className="flex flex-col gap-8 w-full">
				<AiAnalysisDashboard />

				<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
					<div className="xl:col-span-3 w-full min-h-[500px] xl:aspect-[21/9] rounded-[32px] bg-[#0F1115] border border-gray-800/80 overflow-hidden relative group shadow-2xl">
						<TradingViewChart levels={marketLevels} />
					</div>
					<div className="xl:col-span-1 h-full xl:min-h-[500px]">
						<PriceLevelMap levels={marketLevels} />
					</div>
				</div>

				<EducationalPerspectiveCard
					levels={marketLevels}
					scenarios={scenarios}
					analysis={analysisText}
				/>

				<div className="p-5 md:p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mt-4">
					<div className="flex items-center gap-2 shrink-0">
						<ArrowUpRight size={16} className="text-blue-500" />
						<h4 className="font-bold text-[11px] md:text-xs text-blue-400 uppercase tracking-widest">
							분석 가이드
						</h4>
					</div>
					<p className="text-[11px] md:text-xs text-gray-400 leading-relaxed font-medium">
						모든 데이터는 실시간 브로커 서버와 99.9% 동기화됩니다. 차트상의
						레벨은 교육적 관점 공유를 일목요연하게 파악하기 위한 참고
						자료입니다.
					</p>
				</div>
			</div>

			{/* 관리자 데이터 입력 UI 추가 */}
			<AdminAnalysisEditor />
		</div>
	);
}
