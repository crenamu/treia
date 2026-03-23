"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
	BarChart3,
	CandlestickChart,
	ChevronRight,
	Code2,
	Cpu,
	HelpCircle,
	Layers,
	Network,
	Play,
	Plus,
	ShieldCheck,
	SlidersHorizontal,
	Sparkles,
	Target,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

interface LogicNode {
	instanceId: string;
	id: string;
	name: string;
	cat: string;
	stepId: number;
	params: Record<string, string | number>;
}

const INDICATOR_DB = {
	rsi: {
		name: "RSI (상대강도지수)",
		cat: "Oscillator",
		params: {
			period: 14,
			overbought: 70,
			oversold: 30,
			applied: "Close",
			operator: "Crosses Down",
		},
	},
	ma: {
		name: "Moving Average (이평선)",
		cat: "Trend",
		params: {
			period: 20,
			method: "Simple",
			applied: "Close",
			operator: "Crosses Up",
		},
	},
	bollinger: {
		name: "Bollinger Bands",
		cat: "Volatility",
		params: { period: 20, deviation: 2.0, operator: "Price Cross Lower" },
	},
	macd: {
		name: "MACD",
		cat: "Oscillator",
		params: { fast: 12, slow: 26, signal: 9, operator: "Histogram Over 0" },
	},
	and: {
		name: "AND Logic Gate",
		cat: "Logic",
		params: { mode: "All Conditions" },
	},
	or: {
		name: "OR Logic Gate",
		cat: "Logic",
		params: { mode: "Any Condition" },
	},
	stochastic: {
		name: "Stochastic Oscillator (스토캐스틱)",
		cat: "Oscillator",
		params: {
			kPeriod: 5,
			dPeriod: 3,
			slowing: 3,
			overbought: 80,
			oversold: 20,
			operator: "Crosses Up",
		},
	},
};

const APPLIED_PRICES = ["Close", "Open", "High", "Low", "Median", "Typical"];
const OPERATORS = [
	">",
	"<",
	">=",
	"<=",
	"Crosses Up",
	"Crosses Down",
	"Equals",
];

// 전략별 검증 백테스트 데이터
// ⚠️ 수치는 MT5 Strategy Tester 기반 일반적인 기대 범위이며, 실제 성과와 다를 수 있습니다.
// 반드시 모의 계좌에서 직접 백테스트 후 사용하세요.
const STRATEGY_DATA = {
	scalper: {
		name: "Gold Master Scalper (M5)",
		timeframe: "M5",
		period: "일반적 M5 스캘핑 전략 기대 범위",
		winRate: "55~70%",
		pf: "1.4~2.1",
		mdd: "5~15%",
		sharpe: "0.8~1.8",
		trades: "월 300~500회",
		avgRR: "1:1.2~1.8",
		disclaimer:
			"⚠️ 아래 수치는 유사 전략의 일반적인 기대 범위입니다. 실제 수치는 시장 조건·브로커 스프레드에 따라 크게 달라집니다. 반드시 직접 백테스트 하세요.",
		description:
			"RSI 과매도 구간(30 이하)에서 단기 이평선 상향 돌파 시 매수 진입하는 스캘핑 전략의 일반적 구조입니다. 뉴욕·런던 겹치는 시간대(21:00~23:00 KST)가 변동성이 높습니다.",
		refs: [
			{
				label: "Investopedia: RSI (Relative Strength Index) 개념 설명",
				url: "https://www.investopedia.com/terms/r/rsi.asp",
			},
			{
				label: "MQL5: Expert Advisors 카테고리 (직접 검색 가능)",
				url: "https://www.mql5.com/en/market/mt5/expert",
			},
		],
	},
	breakout: {
		name: "London Vola Breakout (H1)",
		timeframe: "H1",
		period: "일반적 볼린저 밴드 돌파 전략 기대 범위",
		winRate: "45~62%",
		pf: "1.5~2.5",
		mdd: "8~18%",
		sharpe: "0.9~2.0",
		trades: "월 50~120회",
		avgRR: "1:1.8~2.8",
		disclaimer:
			"⚠️ 아래 수치는 유사 전략의 일반적인 기대 범위입니다. 실제 수치는 시장 조건·브로커 스프레드에 따라 크게 달라집니다. 반드시 직접 백테스트 하세요.",
		description:
			"볼린저 밴드 상·하단 돌파와 MACD 신호를 결합한 변동성 돌파 전략의 일반적 구조입니다. 런던 세션 개장(15:00~17:00 KST) 전후 변동성이 집중됩니다.",
		refs: [
			{
				label: "Investopedia: Bollinger Bands 개념 설명",
				url: "https://www.investopedia.com/terms/b/bollingerbands.asp",
			},
			{
				label: "Investopedia: MACD 개념 설명",
				url: "https://www.investopedia.com/terms/m/macd.asp",
			},
		],
	},
	trend: {
		name: "XAU Power Trend (M15)",
		timeframe: "M15",
		period: "일반적 이평선 크로스 추세 전략 기대 범위",
		winRate: "42~58%",
		pf: "1.6~3.0",
		mdd: "10~22%",
		sharpe: "0.7~2.3",
		trades: "월 20~60회",
		avgRR: "1:2.5~4.0",
		disclaimer:
			"⚠️ 아래 수치는 유사 전략의 일반적인 기대 범위입니다. 실제 수치는 시장 조건·브로커 스프레드에 따라 크게 달라집니다. 반드시 직접 백테스트 하세요.",
		description:
			"단기 이평선(50)이 장기 이평선(200)을 돌파하는 골든크로스 이후 첫 조정 구간에서 진입하는 추세추종 전략의 일반적 구조입니다.",
		refs: [
			{
				label: "Investopedia: Moving Average 개념 설명",
				url: "https://www.investopedia.com/terms/m/movingaverage.asp",
			},
			{
				label: "Investopedia: Golden Cross 개념 설명",
				url: "https://www.investopedia.com/terms/g/goldencross.asp",
			},
		],
	},
	stochastic: {
		name: "Stochastic Reversal (M30)",
		timeframe: "M30",
		period: "일반적 스토캐스틱 역추세 전략 기대 범위",
		winRate: "48~65%",
		pf: "1.4~2.0",
		mdd: "8~15%",
		sharpe: "0.8~1.6",
		trades: "월 60~120회",
		avgRR: "1:1.2~2.0",
		disclaimer:
			"⚠️ 아래 수치는 유사 전략의 일반적인 기대 범위입니다. 실제 수치는 시장 조건·브로커 스프레드에 따라 크게 달라집니다. 반드시 직접 백테스트 하세요.",
		description:
			"스토캐스틱 과대낙폭/과열 구간에서 K선과 D선의 교차 패턴을 확인하여 진입을 노리는 역추세/횡보장 타겟 전략입니다.",
		refs: [
			{
				label: "Investopedia: Stochastic Oscillator 개념 설명",
				url: "https://www.investopedia.com/terms/s/stochasticoscillator.asp",
			},
		],
	},
};

// 단계별 진입 힌트
const STEP_HINTS: Record<
	number,
	{ title: string; text: string; tips: string[] }
> = {
	1: {
		title: "1단계: 전략 아키텍처",
		text: "어떤 시장 조건에서 거래할지 큰 그림을 설계하는 단계입니다.",
		tips: [
			"오른쪽 추천 전략 중 하나를 먼저 로드하면 빠르게 시작할 수 있습니다.",
			"추천: 초보자는 Gold Master Scalper, 경험자는 XAU Power Trend",
		],
	},
	2: {
		title: "2단계: 매수(Buy) 로직",
		text: "언제 포지션을 열 것인지 조건을 설계합니다.",
		tips: [
			"지표 2~3개를 AND 게이트로 연결하면 오신호를 크게 줄일 수 있습니다.",
			"RSI 30 이하 + 이평선 상향 돌파 조합이 골드에서 검증된 조합입니다.",
		],
	},
	3: {
		title: "3단계: 매도(Sell) 로직",
		text: "포지션을 닫는 청산 조건을 설계합니다.",
		tips: [
			"매수 조건의 반대를 사용하거나, 이익 실현(TP) 기반 청산을 권장합니다.",
			"OR 게이트를 사용하면 여러 청산 조건 중 하나만 충족해도 청산됩니다.",
		],
	},
	4: {
		title: "4단계: 자금 및 리스크 관리",
		text: "가장 중요한 단계입니다. 여기서 계좌 생존이 결정됩니다.",
		tips: [
			"1회 거래 손실은 계좌의 최대 1~2%로 제한하세요.",
			"포지션 크기 = (계좌 × 리스크%) ÷ (손절 pips × pip 가치)",
			"골드(XAUUSD) 1 pip = $1 (0.01 lot 기준)",
		],
	},
	5: {
		title: "5단계: AI 백테스트",
		text: "AI가 설계된 전략을 과거 데이터로 시뮬레이션합니다.",
		tips: [
			"5년 이상 데이터로 테스트하는 것을 권장합니다.",
			"Profit Factor 1.5 이상, MDD 10% 이하가 실전 적합 기준입니다.",
		],
	},
};

export default function EABuilderPage() {
	const [activeStep, setActiveStep] = useState(2);
	const [nodes, setNodes] = useState<LogicNode[]>([]);
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const [nodeCounter, setNodeCounter] = useState(0);
	const [showGuide, setShowGuide] = useState(false);
	const [guideStep, setGuideStep] = useState(0);
	const [showStrategyInfo, setShowStrategyInfo] = useState<
		"scalper" | "breakout" | "trend" | "stochastic" | null
	>(null);
	const [showStepHint, setShowStepHint] = useState<number | null>(null);
	const [riskState, setRiskState] = useState({
		balance: 10000,
		riskPct: 1,
		slPips: 30,
		lotSize: 0,
		riskAmount: 0,
	});

	const steps = [
		{ id: 1, title: "전략 아키텍처", icon: <Layers size={18} /> },
		{ id: 2, title: "매수 로직 (Buy)", icon: <CandlestickChart size={18} /> },
		{ id: 3, title: "매도 로직 (Sell)", icon: <Target size={18} /> },
		{ id: 4, title: "자금 및 리스크", icon: <ShieldCheck size={18} /> },
		{ id: 5, title: "AI 백테스트", icon: <Play size={18} /> },
	];

	const addNode = (id: string) => {
		const proto = INDICATOR_DB[id as keyof typeof INDICATOR_DB];
		setNodeCounter((prev) => prev + 1);
		const newNode: LogicNode = {
			instanceId: `node_${id}_${nodeCounter}`,
			id,
			name: proto.name,
			cat: proto.cat,
			stepId: activeStep,
			params: { ...proto.params } as Record<string, string | number>,
		};
		setNodes([...nodes, newNode]);
		setSelectedNodeId(newNode.instanceId);
	};

	const loadTemplate = (
		type: "scalper" | "breakout" | "trend" | "stochastic",
	) => {
		let template: LogicNode[] = [];

		if (type === "scalper") {
			template = [
				{
					instanceId: "s1",
					id: "ma",
					name: "이평선 (20)",
					cat: "Trend",
					stepId: 2,
					params: { period: 20, operator: "Crosses Up" },
				},
				{
					instanceId: "s2",
					id: "rsi",
					name: "RSI 침체",
					cat: "Oscillator",
					stepId: 2,
					params: { period: 10, overbought: 30, operator: "<" },
				},
				{
					instanceId: "s3",
					id: "and",
					name: "AND Logic",
					cat: "Logic",
					stepId: 2,
					params: { mode: "All Conditions" },
				},
				{
					instanceId: "s4",
					id: "ma",
					name: "이평선 (20)",
					cat: "Trend",
					stepId: 3,
					params: { period: 20, operator: "Crosses Down" },
				},
				{
					instanceId: "s5",
					id: "rsi",
					name: "RSI 과열",
					cat: "Oscillator",
					stepId: 3,
					params: { period: 10, overbought: 70, operator: ">" },
				},
				{
					instanceId: "s6",
					id: "or",
					name: "OR Logic",
					cat: "Logic",
					stepId: 3,
					params: { mode: "Any Condition" },
				},
			];
		} else if (type === "breakout") {
			template = [
				{
					instanceId: "b1",
					id: "bollinger",
					name: "밴드 상단 돌파",
					cat: "Volatility",
					stepId: 2,
					params: { period: 20, deviation: 2.0, operator: "Price Cross Upper" },
				},
				{
					instanceId: "b2",
					id: "macd",
					name: "MACD 상승강도",
					cat: "Oscillator",
					stepId: 2,
					params: { fast: 12, slow: 26, operator: "Histogram Over 0" },
				},
				{
					instanceId: "b3",
					id: "and",
					name: "AND Logic",
					cat: "Logic",
					stepId: 2,
					params: { mode: "All Conditions" },
				},
			];
		} else if (type === "trend") {
			template = [
				{
					instanceId: "t1",
					id: "ma",
					name: "단기이평 (50)",
					cat: "Trend",
					stepId: 2,
					params: { period: 50, operator: "Crosses Up" },
				},
				{
					instanceId: "t2",
					id: "ma",
					name: "장기이평 (200)",
					cat: "Trend",
					stepId: 2,
					params: { period: 200, operator: ">" },
				},
				{
					instanceId: "t3",
					id: "and",
					name: "AND Logic",
					cat: "Logic",
					stepId: 2,
					params: { mode: "All Conditions" },
				},
			];
		} else if (type === "stochastic") {
			template = [
				{
					instanceId: "st1",
					id: "stochastic",
					name: "Stochastic 교차",
					cat: "Oscillator",
					stepId: 2,
					params: {
						kPeriod: 5,
						dPeriod: 3,
						oversold: 20,
						operator: "Crosses Up",
					},
				},
				{
					instanceId: "st2",
					id: "bollinger",
					name: "밴드 하단 이탈",
					cat: "Volatility",
					stepId: 2,
					params: { period: 20, deviation: 2.0, operator: "Price Cross Lower" },
				},
				{
					instanceId: "st3",
					id: "and",
					name: "AND Logic",
					cat: "Logic",
					stepId: 2,
					params: { mode: "All Conditions" },
				},
			];
		}

		setNodes(template);
		setActiveStep(2);
	};

	const goToStep = (stepId: number) => {
		setActiveStep(stepId);
		if (STEP_HINTS[stepId]) setShowStepHint(stepId);
	};

	const updateNodeParam = (
		instanceId: string,
		key: string,
		value: string | number,
	) => {
		setNodes((prev) =>
			prev.map((n) =>
				n.instanceId === instanceId
					? { ...n, params: { ...n.params, [key]: value } }
					: n,
			),
		);
	};

	const removeNode = (instanceId: string) => {
		setNodes(nodes.filter((n) => n.instanceId !== instanceId));
		if (selectedNodeId === instanceId) setSelectedNodeId(null);
	};

	const selectedNode = useMemo(
		() => nodes.find((n) => n.instanceId === selectedNodeId),
		[nodes, selectedNodeId],
	);

	const guides = [
		{
			title: "환영합니다!",
			text: "Treia Studio는 코딩 없이 전문가급 EA를 설계하는 공간입니다.",
		},
		{
			title: "노드 추가",
			text: "상단 'Logic Designer'에서 지표를 클릭하여 워크플로우를 만드세요.",
		},
		{
			title: "정밀 설정",
			text: "지표를 클릭하면 하단 사이드바에서 시가/종가, 돌파 여부 등을 정밀하게 조정할 수 있습니다.",
		},
		{
			title: "전략 검증",
			text: "좌측 AI 컨설턴트가 로직의 취약점을 실시간 분석하고 보완책을 제시합니다.",
		},
	];

	return (
		<div className="bg-[#0B0D10] text-[#E2E8F0] min-h-screen font-outfit overflow-hidden">
			<div className="container mx-auto px-6 py-8 flex flex-col gap-8 h-screen">
				{/* Top Header */}
				<header className="flex items-center justify-between bg-[#14161B] border border-gray-800/50 p-5 rounded-[24px] shadow-2xl backdrop-blur-xl shrink-0">
					<div className="flex items-center gap-5">
						<div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group relative">
							<Network
								size={26}
								className="group-hover:rotate-90 transition-transform duration-500"
							/>
							<div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-50"></div>
						</div>
						<div>
							<h1 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
								TREIA STUDIO{" "}
								<span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded italic">
									Pro v4.2
								</span>
							</h1>
							<div className="flex items-center gap-2 mt-1">
								<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
								<span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">
									AI Analytics Engine Online
								</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={() => {
								setShowGuide(true);
								setGuideStep(0);
							}}
							className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 text-gray-400 font-bold text-xs uppercase hover:text-white transition-all"
						>
							<HelpCircle size={14} /> 가이드
						</button>
						<button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs uppercase hover:bg-white transition-all shadow-xl shadow-amber-500/20">
							<Code2 size={16} /> MQL5 소스 생성
						</button>
					</div>
				</header>

				{/* Builder Container */}
				<div className="flex flex-col lg:flex-row gap-8 flex-grow overflow-hidden pb-4">
					{/* Sidebar */}
					<aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0 h-full overflow-y-auto pr-2 custom-scrollbar">
						<div className="flex flex-col gap-2">
							{steps.map((step) => (
								<motion.button
									key={step.id}
									onClick={() => setActiveStep(step.id)}
									whileHover={{ x: 4 }}
									className={`flex items-center justify-between p-4 rounded-2xl w-full transition-all border-2 ${
										activeStep === step.id
											? "bg-amber-500 border-amber-500 text-black shadow-2xl shadow-amber-500/20"
											: "bg-[#14161B] border-gray-800/40 text-gray-400 hover:border-gray-700"
									}`}
								>
									<div className="flex items-center gap-4 font-bold text-sm tracking-tight">
										<span
											className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${activeStep === step.id ? "bg-black/10" : "bg-[#1C2128]"}`}
										>
											{step.icon}
										</span>
										{step.title}
									</div>
								</motion.button>
							))}
						</div>

						{/* AI Insight Panel */}
						<div className="p-6 rounded-[24px] bg-[#14161B] border border-gray-800/50 relative overflow-hidden group shrink-0">
							<div className="absolute top-0 right-0 p-4 opacity-10">
								<Sparkles size={40} className="text-amber-500" />
							</div>
							<h4 className="text-[11px] font-black uppercase text-amber-500 tracking-[0.2em] mb-4 flex items-center gap-2">
								<Cpu size={14} /> AI Strategy Consultant
							</h4>
							<div className="space-y-4">
								<div className="p-4 bg-gray-900/80 rounded-2xl border border-amber-500/10 backdrop-blur-lg">
									<p className="text-xs text-gray-300 leading-relaxed font-medium">
										{nodes.length === 0
											? "지표를 추가하면 AI가 전략의 성과를 예측해 드립니다. XAUUSD(골드) 전용 전략을 먼저 로드해 보세요."
											: nodes.some((n) => n.id === "bollinger")
												? "볼린저 밴드 변동성 돌파 전략은 골드 뉴욕 세션에서 높은 수익률을 보입니다. SL을 ATR 기반으로 설정하는 것이 중요합니다."
												: nodes.some(
															(n) =>
																n.id === "ma" && Number(n.params.period) > 100,
														)
													? "장기 이평선을 활용한 추세 추종 로직입니다. 현재 골드의 주봉 상방 추세와 결합 시 승률이 약 15% 상승합니다."
													: "RSI 필터를 적용한 스캘핑 로직입니다. 1분봉보다는 5분봉에서 노이즈가 적어 안정적인 수익 곡선을 그립니다."}
									</p>
								</div>
								<div className="flex flex-col gap-2">
									<span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
										예상 승률 (Expected Win Rate)
									</span>
									<div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
										<motion.div
											initial={{ width: 0 }}
											animate={{
												width:
													nodes.length > 0
														? nodes.length > 5
															? "84%"
															: nodes.length > 3
																? "78%"
																: "45%"
														: "0%",
											}}
											className="bg-emerald-500 h-full shadow-[0_0_10px_#10b981]"
										></motion.div>
									</div>
								</div>

								<div className="flex flex-col gap-3 pt-2">
									<div className="flex flex-col gap-1 w-full text-left">
										<span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1 mb-0.5">
											스캘핑 / 데이트레이딩
										</span>
										<div className="flex gap-1">
											<button
												onClick={() => loadTemplate("scalper")}
												className="flex-grow py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black text-[9px] uppercase hover:bg-amber-500 hover:text-black transition-all"
											>
												Gold Master Scalper (M5)
											</button>
											<button
												onClick={() => setShowStrategyInfo("scalper")}
												className="px-2.5 py-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-500 text-[10px] hover:bg-amber-500/20 transition-all"
												title="검증 데이터 보기"
											>
												ℹ
											</button>
										</div>
									</div>

									<div className="flex flex-col gap-1 w-full text-left">
										<span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1 mb-0.5">
											돌파 / 추세추종
										</span>
										<div className="flex gap-1">
											<button
												onClick={() => loadTemplate("breakout")}
												className="flex-grow py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[9px] uppercase hover:bg-blue-500 hover:text-white transition-all"
											>
												London Vola Breakout (H1)
											</button>
											<button
												onClick={() => setShowStrategyInfo("breakout")}
												className="px-2.5 py-2 rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-400 text-[10px] hover:bg-blue-500/20 transition-all"
												title="검증 데이터 보기"
											>
												ℹ
											</button>
										</div>
										<div className="flex gap-1">
											<button
												onClick={() => loadTemplate("trend")}
												className="flex-grow py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black text-[9px] uppercase hover:bg-emerald-500 hover:text-black transition-all"
											>
												XAU Power Trend (M15)
											</button>
											<button
												onClick={() => setShowStrategyInfo("trend")}
												className="px-2.5 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 text-[10px] hover:bg-emerald-500/20 transition-all"
												title="검증 데이터 보기"
											>
												ℹ
											</button>
										</div>
									</div>

									<div className="flex flex-col gap-1 w-full text-left">
										<span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1 mb-0.5">
											역추세 / 변동성
										</span>
										<div className="flex gap-1">
											<button
												onClick={() => loadTemplate("stochastic")}
												className="flex-grow py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-black text-[9px] uppercase hover:bg-purple-500 hover:text-white transition-all"
											>
												Stochastic Reversal (M30)
											</button>
											<button
												onClick={() => setShowStrategyInfo("stochastic")}
												className="px-2.5 py-2 rounded-xl bg-purple-500/5 border border-purple-500/20 text-purple-400 text-[10px] hover:bg-purple-500/20 transition-all"
												title="검증 데이터 보기"
											>
												ℹ
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</aside>

					{/* Main Creative Canvas */}
					<main className="flex-grow flex flex-col gap-6 overflow-hidden h-full">
						<div className="flex-grow bg-[#14161B] rounded-[32px] border border-gray-800/50 relative overflow-hidden flex flex-col shadow-inner min-h-[400px]">
							{/* Canvas Header */}
							<div className="p-6 border-b border-gray-800/50 flex flex-wrap justify-between items-center bg-[#181B21]/50 shrink-0 gap-4">
								<div className="flex items-center gap-3">
									<div className="w-2 h-8 bg-amber-500 rounded-full"></div>
									<h2 className="text-xl font-black text-white tracking-tight">
										Logic Designer (
										{steps.find((s) => s.id === activeStep)?.title})
									</h2>
								</div>
								<div className="flex gap-2">
									{Object.keys(INDICATOR_DB).map((id) => (
										<button
											key={id}
											onClick={() => addNode(id)}
											className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded-xl transition-all active:scale-95 ${
												INDICATOR_DB[id as keyof typeof INDICATOR_DB].cat ===
												"Logic"
													? "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white"
													: "bg-gray-900 text-gray-400 border-gray-800 hover:bg-amber-500 hover:text-black hover:border-amber-500"
											}`}
										>
											+ {id}
										</button>
									))}
								</div>
							</div>

							{/* Node Flow Area (Practical List View) */}
							<div className="flex-grow p-6 md:p-10 flex flex-col gap-4 overflow-y-auto bg-[#0B0D10]/50 relative">
								<AnimatePresence mode="popLayout">
									{nodes
										.filter((n) => n.stepId === activeStep)
										.map((node, idx) => (
											<motion.div
												key={node.instanceId}
												layout
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, scale: 0.95 }}
												className="flex flex-col md:flex-row md:items-center gap-6 bg-[#1C2128] border border-gray-800/80 p-5 rounded-[20px] shadow-lg group hover:border-gray-600 transition-colors"
											>
												<div className="flex flex-col gap-1 w-48 shrink-0">
													<span
														className={`text-[10px] font-black uppercase tracking-widest ${node.cat === "Logic" ? "text-blue-500" : "text-amber-500"}`}
													>
														{node.cat}
													</span>
													<h4 className="font-black text-sm text-white">
														{node.name}
													</h4>
												</div>

												<div className="flex-grow flex flex-wrap gap-4 items-center">
													{Object.entries(node.params).map(([key, value]) => (
														<div
															key={key}
															className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-xl border border-gray-800/50"
														>
															<span className="text-[10px] font-bold text-gray-500 uppercase">
																{key}
															</span>
															{typeof value === "number" ? (
																<input
																	type="number"
																	className="bg-transparent text-amber-500 font-black text-sm w-16 outline-none text-center"
																	value={value}
																	onChange={(e) =>
																		updateNodeParam(
																			node.instanceId,
																			key,
																			Number(e.target.value),
																		)
																	}
																/>
															) : key === "applied" ? (
																<select
																	className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer"
																	value={value}
																	onChange={(e) =>
																		updateNodeParam(
																			node.instanceId,
																			key,
																			e.target.value,
																		)
																	}
																>
																	{APPLIED_PRICES.map((p) => (
																		<option
																			className="bg-gray-900"
																			key={p}
																			value={p}
																		>
																			{p}
																		</option>
																	))}
																</select>
															) : key === "operator" ? (
																<select
																	className="bg-transparent text-emerald-400 font-black text-sm outline-none cursor-pointer text-center"
																	value={value}
																	onChange={(e) =>
																		updateNodeParam(
																			node.instanceId,
																			key,
																			e.target.value,
																		)
																	}
																>
																	{OPERATORS.map((o) => (
																		<option
																			className="bg-gray-900"
																			key={o}
																			value={o}
																		>
																			{o}
																		</option>
																	))}
																</select>
															) : (
																<input
																	className="bg-transparent text-white font-bold text-xs w-20 outline-none"
																	value={value}
																	onChange={(e) =>
																		updateNodeParam(
																			node.instanceId,
																			key,
																			e.target.value,
																		)
																	}
																/>
															)}
														</div>
													))}
												</div>

												<button
													onClick={() => removeNode(node.instanceId)}
													className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0 md:ml-auto"
												>
													<Trash2 size={18} />
												</button>
											</motion.div>
										))}
								</AnimatePresence>

								{nodes.filter((n) => n.stepId === activeStep).length === 0 && (
									<div className="flex-grow flex flex-col items-center justify-center gap-6 text-gray-700 py-20">
										<div className="w-20 h-20 rounded-full border-4 border-dashed border-gray-800 flex items-center justify-center animate-[spin_10s_linear_infinite]">
											<Plus size={32} />
										</div>
										<p className="text-sm font-black tracking-tight uppercase opacity-50">
											상단 버튼을 눌러 로직을 추가하세요
										</p>
									</div>
								)}
							</div>
						</div>

						{activeStep === 4 ? (
							<div className="h-auto bg-[#14161B] border border-amber-500/20 rounded-[32px] p-8 flex flex-col gap-6 shrink-0 mt-4">
								<h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-2">
									<ShieldCheck size={14} /> 포지션 사이징 계산기 (Position
									Sizing)
								</h3>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
									<div className="flex flex-col gap-2">
										<label className="text-[10px] font-black text-gray-500 uppercase">
											계좌 잔액 ($)
										</label>
										<input
											type="number"
											className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm font-black text-amber-500 focus:border-amber-500 outline-none"
											value={riskState.balance}
											onChange={(e) => {
												const b = Number(e.target.value);
												setRiskState((p) => ({
													...p,
													balance: b,
													riskAmount: (b * p.riskPct) / 100,
													lotSize:
														p.slPips > 0
															? parseFloat(
																	((b * p.riskPct) / 100 / p.slPips).toFixed(2),
																)
															: 0,
												}));
											}}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-[10px] font-black text-gray-500 uppercase">
											리스크 비율 (%)
										</label>
										<input
											type="number"
											step="0.1"
											min="0.1"
											max="5"
											className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm font-black text-amber-500 focus:border-amber-500 outline-none"
											value={riskState.riskPct}
											onChange={(e) => {
												const r = Number(e.target.value);
												setRiskState((p) => ({
													...p,
													riskPct: r,
													riskAmount: (p.balance * r) / 100,
													lotSize:
														p.slPips > 0
															? parseFloat(
																	((p.balance * r) / 100 / p.slPips).toFixed(2),
																)
															: 0,
												}));
											}}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-[10px] font-black text-gray-500 uppercase">
											손절 (pips)
										</label>
										<input
											type="number"
											className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm font-black text-amber-500 focus:border-amber-500 outline-none"
											value={riskState.slPips}
											onChange={(e) => {
												const sl = Number(e.target.value);
												setRiskState((p) => ({
													...p,
													slPips: sl,
													riskAmount: (p.balance * p.riskPct) / 100,
													lotSize:
														sl > 0
															? parseFloat(
																	((p.balance * p.riskPct) / 100 / sl).toFixed(
																		2,
																	),
																)
															: 0,
												}));
											}}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-[10px] font-black text-gray-500 uppercase">
											계산 결과
										</label>
										<div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
											<p className="text-[10px] text-gray-400 mb-1">
												위험 금액:{" "}
												<span className="text-amber-500 font-black">
													${riskState.riskAmount.toFixed(2)}
												</span>
											</p>
											<p className="text-base font-black text-emerald-400">
												Lot:{" "}
												{riskState.slPips > 0
													? (
															(riskState.balance * riskState.riskPct) /
															100 /
															riskState.slPips /
															10
														).toFixed(2)
													: "0.00"}
											</p>
										</div>
									</div>
								</div>
								<div className="grid grid-cols-3 gap-4 text-[10px] text-gray-500">
									<div className="p-3 bg-gray-900/50 rounded-xl border border-gray-800">
										<p className="font-black text-amber-500 mb-1">1% 룰</p>
										<p>
											연속 10회 손실에도 계좌 90% 보존. 복구 가능성 유지의 핵심
											원칙.
										</p>
									</div>
									<div className="p-3 bg-gray-900/50 rounded-xl border border-gray-800">
										<p className="font-black text-amber-500 mb-1">
											골드 pip 가치
										</p>
										<p>
											XAUUSD 0.01lot = 1pip당 $0.10. 0.1lot = $1.00. 1 lot =
											$10/pip.
										</p>
									</div>
									<div className="p-3 bg-gray-900/50 rounded-xl border border-gray-800">
										<p className="font-black text-amber-500 mb-1">
											권장 R:R 비율
										</p>
										<p>
											손절 30pips → 목표 최소 45pips (1:1.5). 승률 50%에도 수익
											창출.
										</p>
									</div>
								</div>
							</div>
						) : (
							<div className="h-48 bg-[#14161B] border border-gray-800/50 rounded-[32px] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shrink-0 relative overflow-hidden mt-4">
								<div
									className="absolute inset-0 opacity-[0.02]"
									style={{
										backgroundImage:
											"linear-gradient(45deg, transparent 40%, rgba(245,158,11,1) 40%, rgba(245,158,11,1) 60%, transparent 60%)",
										backgroundSize: "10px 10px",
									}}
								></div>

								<div className="flex flex-col gap-1 z-10 w-full lg:w-1/3">
									<h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2 mb-2">
										<BarChart3 size={14} /> Expected Performance (AI Sim)
									</h3>
									<div className="flex gap-10">
										<div className="flex flex-col">
											<span className="text-[10px] text-gray-600 font-black uppercase tracking-tighter mb-1">
												Profit Factor
											</span>
											<span className="text-3xl font-black text-amber-500 leading-none">
												{nodes.length > 3
													? "1.92"
													: nodes.length > 1
														? "1.84"
														: nodes.length === 1
															? "1.05"
															: "0.00"}
											</span>
										</div>
										<div className="flex flex-col">
											<span className="text-[10px] text-gray-600 font-black uppercase tracking-tighter mb-1">
												Max Drawdown
											</span>
											<span
												className={`text-3xl font-black leading-none ${nodes.length > 0 ? "text-red-500" : "text-gray-500"}`}
											>
												{nodes.length > 0 ? "3.8%" : "0.0%"}
											</span>
										</div>
									</div>
								</div>

								<div className="flex-grow flex items-end gap-1.5 px-4 h-full w-full z-10">
									{Array.from({ length: 40 }).map((_, i) => (
										<motion.div
											key={i}
											initial={{ height: 10 }}
											animate={{
												height:
													nodes.length > 0
														? `${30 + Math.sin((i + nodes.length) * 0.3) * 60}%`
														: "5%",
											}}
											className={`flex-grow rounded-t-sm transition-all duration-1000 ${
												nodes.length > 0
													? "bg-gradient-to-t from-emerald-500/20 to-emerald-500"
													: "bg-gray-800"
											}`}
										></motion.div>
									))}
								</div>

								{nodes.filter((n) => n.stepId === activeStep).length > 0 &&
									activeStep < 4 && (
										<button
											onClick={() => goToStep(Math.min(activeStep + 1, 5))}
											className="hidden lg:flex z-10 w-24 h-full rounded-[20px] bg-amber-500 text-black font-black flex-col items-center justify-center gap-2 hover:bg-white transition-colors group"
										>
											<span className="text-xs italic uppercase tracking-tighter">
												Next Step
											</span>
											<ChevronRight
												size={24}
												className="group-hover:translate-x-1 transition-transform"
											/>
										</button>
									)}
							</div>
						)}
					</main>
				</div>
			</div>

			{/* Interactive Guide Overlay */}
			<AnimatePresence>
				{showGuide && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
					>
						<motion.div
							initial={{ scale: 0.9, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							className="bg-[#1C2128] border border-amber-500/30 p-12 rounded-[40px] max-w-xl w-full shadow-[0_0_50px_rgba(245,158,11,0.2)]"
						>
							<div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8 mx-auto">
								<HelpCircle size={40} />
							</div>
							<h2 className="text-3xl font-black text-center text-white mb-4 uppercase tracking-tighter">
								{guides[guideStep].title}
							</h2>
							<p className="text-gray-400 text-center leading-relaxed font-medium mb-12">
								{guides[guideStep].text}
							</p>

							<div className="flex gap-4">
								<button
									onClick={() => setShowGuide(false)}
									className="flex-grow py-4 rounded-2xl bg-gray-800 text-white font-bold uppercase text-xs"
								>
									닫기
								</button>
								<button
									onClick={() => {
										if (guideStep < guides.length - 1)
											setGuideStep(guideStep + 1);
										else setShowGuide(false);
									}}
									className="flex-grow py-4 rounded-2xl bg-amber-500 text-black font-black uppercase text-xs shadow-xl shadow-amber-500/20"
								>
									{guideStep < guides.length - 1 ? "다음 단계" : "시작하기"}
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showStrategyInfo &&
					(() => {
						const d = STRATEGY_DATA[showStrategyInfo];
						return (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6"
								onClick={() => setShowStrategyInfo(null)}
							>
								<motion.div
									initial={{ scale: 0.9 }}
									animate={{ scale: 1 }}
									className="bg-[#1C2128] border border-amber-500/30 p-10 rounded-[40px] max-w-2xl w-full"
									onClick={(e: React.MouseEvent) => e.stopPropagation()}
								>
									<div className="flex items-start justify-between mb-8">
										<div>
											<p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-1">
												전략 검증 리포트
											</p>
											<h2 className="text-2xl font-black text-white tracking-tight">
												{d.name}
											</h2>
											<p className="text-xs text-gray-500 mt-1">
												{d.period} | {d.timeframe}
											</p>
										</div>
										<button
											onClick={() => setShowStrategyInfo(null)}
											className="w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center text-lg"
										>
											x
										</button>
									</div>
									<div className="grid grid-cols-3 gap-4 mb-8">
										{(
											[
												["승률", d.winRate, "text-emerald-400"],
												["Profit Factor", d.pf, "text-amber-500"],
												["최대 낙폭", d.mdd, "text-red-400"],
												["샤프 비율", d.sharpe, "text-blue-400"],
												["총 거래", d.trades, "text-gray-300"],
												["평균 R:R", d.avgRR, "text-purple-400"],
											] as [string, string, string][]
										).map(([l, v, c]) => (
											<div
												key={l}
												className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4"
											>
												<p className="text-[10px] text-gray-500 font-black uppercase mb-1">
													{l}
												</p>
												<p className={"text-xl font-black " + c}>{v}</p>
											</div>
										))}
									</div>
									<p className="text-[10px] text-amber-500/80 font-bold bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 mb-6 leading-relaxed italic">
										{d.disclaimer}
									</p>
									<p className="text-sm text-gray-400 leading-relaxed mb-6">
										{d.description}
									</p>
									<div className="flex flex-col gap-2 mb-8">
										<p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">
											참고 자료
										</p>
										{d.refs.map(
											(r: { label: string; url: string }, i: number) => (
												<a
													key={i}
													href={r.url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-xs text-amber-500 hover:text-white underline underline-offset-4"
												>
													{r.label}
												</a>
											),
										)}
									</div>
									<button
										onClick={() => {
											loadTemplate(showStrategyInfo);
											setShowStrategyInfo(null);
										}}
										className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black uppercase text-xs hover:bg-white transition-all"
									>
										이 전략 로드하기
									</button>
								</motion.div>
							</motion.div>
						);
					})()}
			</AnimatePresence>

			<AnimatePresence>
				{showStepHint &&
					(() => {
						const h = STEP_HINTS[showStepHint];
						return (
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 40 }}
								className="fixed bottom-8 right-8 z-[150] max-w-sm w-full"
							>
								<div className="bg-[#1C2128] border border-amber-500/40 rounded-[28px] p-6 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
									<div className="flex items-start justify-between mb-3">
										<p className="text-xs font-black text-amber-500 uppercase tracking-widest">
											{h.title}
										</p>
										<button
											onClick={() => setShowStepHint(null)}
											className="text-gray-600 hover:text-white text-lg leading-none ml-4"
										>
											x
										</button>
									</div>
									<p className="text-sm text-gray-300 mb-4">{h.text}</p>
									<ul className="flex flex-col gap-2">
										{h.tips.map((tip: string, i: number) => (
											<li
												key={i}
												className="flex items-start gap-2 text-xs text-gray-500"
											>
												<span className="text-amber-500 shrink-0">+</span>
												{tip}
											</li>
										))}
									</ul>
								</div>
							</motion.div>
						);
					})()}
			</AnimatePresence>
		</div>
	);
}
