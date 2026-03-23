"use client";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, RefreshCw, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
	getMtfAnalysis,
	MtfAnalysis,
	PageAnalysis,
	subscribePageAnalysis,
	subscribeTickAnalysis,
	type TickAnalysis,
} from "@/lib/analysis-service";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";

export default function AdminAnalysisEditor() {
	const { user } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	// Form States
	const [marketLevels, setMarketLevels] = useState<
		{ price: number; label: string; type: "major" | "minor" }[]
	>([
		{ price: 5315, label: "March Target Zone", type: "major" },
		{ price: 5280, label: "Resistance Wall", type: "major" },
		{ price: 5278.4, label: "Institutional POC", type: "major" },
		{ price: 5205, label: "Session Box High", type: "minor" },
		{ price: 5184, label: "Standard Pivot", type: "minor" },
		{ price: 5130, label: "Liquidity Capture", type: "major" },
	]);
	const [scenarios, setScenarios] = useState<
		{ title: string; desc: string; color: string }[]
	>([
		{
			title: "Price Discovery Phase",
			desc: "역사적 신고가 돌파 시도는 단순한 상승을 넘어 가치를 구하는 프로세스입니다.",
			color: "bg-cyan-400",
		},
		{
			title: "Institutional Flush",
			desc: "차익 실현 시 하단 유동성 거점까지의 급격한 가격 이동이 관찰됩니다.",
			color: "bg-red-500",
		},
	]);
	const [mainText, setMainText] = useState(
		"목요일 저점 볼륨이 급증하며 상승 모멘텀을 주도하고 있습니다.",
	);

	// RT Analysis
	const [tickAnalysis, setTickAnalysis] = useState<Partial<TickAnalysis>>({
		signal: "BUY",
		phase: "London Open",
		intensity: 85,
		reason: "강력한 매수세 지속 유입",
	});

	// POC Data
	const [pocData, setPocData] = useState({ M1: 0, M2: 0, H1: 0, Daily: 0 });

	useEffect(() => {
		if (isOpen) {
			subscribePageAnalysis((data) => {
				if (data) {
					setMarketLevels(data.marketLevels || []);
					setScenarios(data.scenarios || []);
					setMainText(data.mainText || "");
				}
			});
			subscribeTickAnalysis((data) => {
				if (data) setTickAnalysis(data);
			});
			getMtfAnalysis().then((data) => {
				if (data) {
					const pocMap: any = { M1: 0, M2: 0, H1: 0, Daily: 0 };
					data.analysis.forEach((a) => (pocMap[a.tf] = a.poc));
					setPocData(pocMap);
				}
			});
		}
	}, [isOpen]);

	// 해당 컴포넌트는 오직 로그인한 사용자에게만 노출됨 (MVP이므로 바로 보임)
	if (!user) return null;

	const handleUpdate = async () => {
		if (
			!confirm(
				"실서버의 모든 시장 분석 데이터를 즉시 갱신하시겠습니까? (사용자 화면 반영)",
			)
		)
			return;
		setLoading(true);

		try {
			// 1. Page Analysis (트레이딩뷰 차트 및 분석 문자열)
			const pageRef = doc(collection(db, "treia_analysis_page"), "latest");
			await setDoc(pageRef, {
				marketLevels,
				scenarios,
				mainText,
				updatedAt: serverTimestamp(),
			});

			// 2. Tick Analysis (순간 수급 대시보드)
			const tickRef = doc(collection(db, "treia_tick_analysis"), "latest");
			await setDoc(tickRef, {
				...tickAnalysis,
				timestamp: serverTimestamp(),
			});

			// 3. MTF Analysis (순간 매매 POC) -- 간이 형태
			const mtfRef = doc(collection(db, "treia_market_intelligence"), "latest");
			await setDoc(mtfRef, {
				asset: "XAUUSD",
				updatedAt: serverTimestamp(),
				analysis: [
					{
						tf: "Daily",
						poc: pocData.Daily,
						count: 100,
						levels: [{ price: pocData.Daily, volume: 1000 }],
						lastDate: new Date().toISOString(),
					},
					{
						tf: "H1",
						poc: pocData.H1,
						count: 100,
						levels: [{ price: pocData.H1, volume: 800 }],
						lastDate: new Date().toISOString(),
					},
					{
						tf: "M2",
						poc: pocData.M2,
						count: 100,
						levels: [{ price: pocData.M2, volume: 500 }],
						lastDate: new Date().toISOString(),
					},
					{
						tf: "M1",
						poc: pocData.M1,
						count: 100,
						levels: [{ price: pocData.M1, volume: 200 }],
						lastDate: new Date().toISOString(),
					},
				],
			});

			alert("성공적으로 라이브 서버에 반영되었습니다.");
			setIsOpen(false);
		} catch (err) {
			console.error(err);
			alert("업데이트 중 오류가 발생했습니다.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="fixed bottom-6 right-6 z-50 bg-amber-500 hover:bg-amber-400 text-black px-4 py-3 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)] font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
			>
				<Edit size={16} /> 일일 분석 DB 에디터 (Admin)
			</button>

			<AnimatePresence>
				{isOpen && (
					<div className="fixed inset-0 z-[100] flex justify-end">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
							className="absolute inset-0 bg-black/80 backdrop-blur-sm"
						/>
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="relative w-full max-w-2xl bg-[#0f1115] h-full shadow-2xl border-l border-gray-800 flex flex-col"
						>
							<div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#14161b]">
								<div>
									<h2 className="text-xl font-black text-amber-500 flex items-center gap-2">
										<RefreshCw size={18} /> Market Analysis Live DB
									</h2>
									<p className="text-xs text-gray-500">
										이 폼에서 업데이트된 데이터는 즉시 전 사용자 화면에
										반영됩니다.
									</p>
								</div>
								<button
									onClick={() => setIsOpen(false)}
									className="text-gray-500 hover:text-white"
								>
									<X size={24} />
								</button>
							</div>

							<div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
								{/* Section: Live Tick Analysis */}
								<div className="space-y-4">
									<h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">
										1. 실시간 수급 현황 (좌측 상단 박스)
									</h3>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="text-xs text-gray-400">Signal</label>
											<select
												value={tickAnalysis.signal}
												onChange={(e) =>
													setTickAnalysis({
														...tickAnalysis,
														signal: e.target.value,
													})
												}
												className="w-full bg-gray-900 border border-gray-800 p-2 rounded text-sm text-white"
											>
												<option value="BUY">BUY</option>
												<option value="SELL">SELL</option>
												<option value="NEUTRAL">NEUTRAL</option>
											</select>
										</div>
										<div>
											<label className="text-xs text-gray-400">Phase</label>
											<input
												type="text"
												value={tickAnalysis.phase}
												onChange={(e) =>
													setTickAnalysis({
														...tickAnalysis,
														phase: e.target.value,
													})
												}
												className="w-full bg-gray-900 border border-gray-800 p-2 rounded text-sm text-white"
											/>
										</div>
										<div>
											<label className="text-xs text-gray-400">
												Intensity (신뢰도 %)
											</label>
											<input
												type="number"
												value={tickAnalysis.intensity}
												onChange={(e) =>
													setTickAnalysis({
														...tickAnalysis,
														intensity: Number(e.target.value),
													})
												}
												className="w-full bg-gray-900 border border-gray-800 p-2 rounded text-sm text-white"
											/>
										</div>
										<div className="col-span-2">
											<label className="text-xs text-gray-400">
												Reason (AI 설명)
											</label>
											<input
												type="text"
												value={tickAnalysis.reason}
												onChange={(e) =>
													setTickAnalysis({
														...tickAnalysis,
														reason: e.target.value,
													})
												}
												className="w-full bg-gray-900 border border-gray-800 p-2 rounded text-sm text-white"
											/>
										</div>
									</div>
								</div>

								{/* Section: MTF POC */}
								<div className="space-y-4">
									<h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">
										2. 멀티 타임프레임 POC (우측 상단 박스)
									</h3>
									<div className="grid grid-cols-4 gap-4">
										{["M1", "M2", "H1", "Daily"].map((tf) => (
											<div key={tf}>
												<label className="text-xs text-gray-400">
													{tf} POC 가격
												</label>
												<input
													type="number"
													value={pocData[tf as keyof typeof pocData]}
													onChange={(e) =>
														setPocData({
															...pocData,
															[tf]: Number(e.target.value),
														})
													}
													className="w-full bg-gray-900 border border-gray-800 p-2 rounded text-sm text-white"
													step="0.01"
												/>
											</div>
										))}
									</div>
								</div>

								{/* Section: Main Text Analysis */}
								<div className="space-y-4">
									<h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">
										3. 핵심 시황 코멘트 (하단 박스 메인)
									</h3>
									<textarea
										value={mainText}
										onChange={(e) => setMainText(e.target.value)}
										className="w-full bg-gray-900 border border-gray-800 p-3 rounded-lg text-sm text-white h-24"
									/>
								</div>

								{/* Section: Market Levels */}
								<div className="space-y-4">
									<div className="flex justify-between items-center border-b border-gray-800 pb-2">
										<h3 className="text-lg font-bold text-white">
											4. 차트 매물대 레벨 (우측 Price Map & 차트 선)
										</h3>
										<button
											onClick={() =>
												setMarketLevels([
													{ price: 0, label: "New Level", type: "minor" },
													...marketLevels,
												])
											}
											className="text-xs bg-gray-800 text-white px-2 py-1 rounded"
										>
											추가 +
										</button>
									</div>
									{marketLevels.map((ml, idx) => (
										<div key={idx} className="flex gap-2 items-center">
											<input
												type="number"
												step="0.01"
												value={ml.price}
												onChange={(e) => {
													const n = [...marketLevels];
													n[idx].price = Number(e.target.value);
													setMarketLevels(n);
												}}
												className="w-24 bg-gray-900 border border-gray-800 p-2 rounded text-sm text-amber-500 font-bold"
											/>
											<input
												type="text"
												value={ml.label}
												onChange={(e) => {
													const n = [...marketLevels];
													n[idx].label = e.target.value;
													setMarketLevels(n);
												}}
												className="flex-1 bg-gray-900 border border-gray-800 p-2 rounded text-sm text-white"
											/>
											<select
												value={ml.type}
												onChange={(e) => {
													const n = [...marketLevels];
													n[idx].type = e.target.value as any;
													setMarketLevels(n);
												}}
												className="w-24 bg-gray-900 border border-gray-800 p-2 rounded text-sm text-white"
											>
												<option value="major">Major</option>
												<option value="minor">Minor</option>
											</select>
											<button
												onClick={() => {
													const n = [...marketLevels];
													n.splice(idx, 1);
													setMarketLevels(n);
												}}
												className="text-red-500 hover:text-white"
											>
												<X size={16} />
											</button>
										</div>
									))}
								</div>
							</div>

							<div className="absolute bottom-0 inset-x-0 p-6 bg-[#14161b] border-t border-gray-800 flex justify-end gap-3">
								<button
									onClick={() => setIsOpen(false)}
									className="px-6 py-3 rounded-xl font-bold text-sm text-gray-400 hover:text-white"
								>
									취소
								</button>
								<button
									onClick={handleUpdate}
									disabled={loading}
									className="px-6 py-3 rounded-xl font-black text-sm bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 active:scale-95 flex items-center gap-2"
								>
									{loading ? (
										"저장 중..."
									) : (
										<>
											<Save size={18} /> 라이브 DB 즉시 반영
										</>
									)}
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}
