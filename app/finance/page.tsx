"use client";

import { AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import BankSelectionModal from "../components/BankSelectionModal";
import CompactProductCard from "../components/CompactProductCard";
import HorizontalFilterBar from "../components/HorizontalFilterBar";
import TaxCalculatorWidget from "../components/TaxCalculatorWidget";
import { getProducts, type Product } from "../api/finance/actions/finance"; // 경로 조정

const PREFERENTIAL_FILTERS = [
	{ id: "카드사용", label: "카드사용" },
	{ id: "급여연동", label: "급여연동" },
	{ id: "공과금연동", label: "공과금연동" },
	{ id: "비대면가입", label: "비대면가입" },
	{ id: "주택청약", label: "주택청약" },
	{ id: "첫거래", label: "첫거래" },
	{ id: "재예치", label: "재예치" },
	{ id: "입출금통장", label: "입출금통장" },
	{ id: "마케팅동의", label: "마케팅동의" },
];

export default function FinancePage() {
	const [activeTab, setActiveTab] = useState<"deposit" | "saving">("deposit");
	const [selectedTerm, setSelectedTerm] = useState<string>("12");
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isMock, setIsMock] = useState(false);
	const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
	const [tier, setTier] = useState<"all" | "1">("all");

	// New States: Sorting and Bank Selection
	const [sortBy, setSortBy] = useState<"highest" | "base">("highest");
	const [isBankModalOpen, setIsBankModalOpen] = useState(false);
	const [selectedBanks, setSelectedBanks] = useState<string[]>([]);

	useEffect(() => {
		async function load() {
			setIsLoading(true);
			const { products: data, isMock: mockStatus } = await getProducts(
				activeTab,
				selectedTerm,
				selectedFilters,
				tier,
				sortBy,
				selectedBanks,
			);
			setProducts(data);
			setIsMock(mockStatus);
			setIsLoading(false);
		}
		load();
	}, [activeTab, selectedTerm, selectedFilters, tier, sortBy, selectedBanks]);

	const toggleFilter = (id: string) => {
		if (selectedFilters.includes(id)) {
			setSelectedFilters(selectedFilters.filter((f) => f !== id));
		} else {
			setSelectedFilters([...selectedFilters, id]);
		}
	};

	return (
		<div className="min-h-screen bg-[var(--bg-beige)]">
			{/* Top Status Bar */}
			<div
				className={`py-3 px-6 text-center transition-colors ${isMock ? "bg-amber-50 text-amber-700" : "bg-gray-900 text-white"}`}
			>
				<div className="container mx-auto flex items-center justify-center gap-3">
					{isMock ? (
						<AlertCircle size={14} />
					) : (
						<CheckCircle2 size={14} className="text-green-400" />
					)}
					<p className="text-[11px] font-black uppercase tracking-widest">
						{isMock
							? "Simulation Mode: 현재 데이터 점검 중입니다"
							: "Live Connected: 금융감독원 공시 실시간 데이터 연동 중"}
					</p>
				</div>
			</div>

			<main className="container mx-auto px-6 py-12 md:py-20">
				<div className="max-w-4xl mb-16">
					<h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.2] tracking-tight mb-4">
						{activeTab === "deposit" ? "정기예금" : "정기적금"}
					</h1>
					<p className="text-lg font-bold text-gray-400 max-w-2xl leading-relaxed">
						시중 은행과 저축은행의 전 금융권 데이터를 실시간 분석합니다.
					</p>
				</div>

				{/* Product Comparison Section */}
				<section className="mb-32">
					<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16 px-4">
						<div>
							<h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">
								금리 비교 분석
							</h2>
							<div className="flex p-2 bg-white rounded-[32px] border border-gray-100 shadow-sm w-fit gap-2">
								<button
									type="button"
									onClick={() => setActiveTab("deposit")}
									className={`px-10 py-4 rounded-[24px] text-sm font-black transition-all ${
										activeTab === "deposit"
											? "bg-gray-900 text-white shadow-xl shadow-gray-900/20"
											: "text-gray-400 hover:text-gray-900"
									}`}
								>
									정기예금
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("saving")}
									className={`px-10 py-4 rounded-[24px] text-sm font-black transition-all ${
										activeTab === "saving"
											? "bg-gray-900 text-white shadow-xl shadow-gray-900/20"
											: "text-gray-400 hover:text-gray-900"
									}`}
								>
									정기적금
								</button>
							</div>
						</div>

						<div className="flex flex-wrap gap-4">
							{["6", "12", "24", "36"].map((trm) => (
								<button
									type="button"
									key={trm}
									onClick={() => setSelectedTerm(trm)}
									className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border ${
										selectedTerm === trm
											? "bg-white border-gray-900 text-gray-900 shadow-sm"
											: "text-gray-400 border-gray-100 hover:text-gray-900"
									}`}
								>
									{trm}개월
								</button>
							))}
						</div>
					</div>

					<div className="mb-12">
						<HorizontalFilterBar
							tier={tier}
							onTierChange={setTier}
							selectedFilters={selectedFilters}
							onToggleFilter={toggleFilter}
							onReset={() => {
								setSelectedFilters([]);
								setTier("all");
								setSelectedTerm("12");
								setSortBy("highest");
								setSelectedBanks([]);
							}}
							sortBy={sortBy}
							onSortChange={setSortBy}
							onBankSelectClick={() => setIsBankModalOpen(true)}
							selectedBanksCount={selectedBanks.length}
							categories={[
								{
									id: "preferential",
									label: "우대 조건",
									options: PREFERENTIAL_FILTERS,
								},
								{
									id: "join",
									label: "가입 방식",
									options: [
										{ id: "방문없이가입", label: "방문없이가입" },
										{ id: "누구나가입", label: "누구나가입" },
									],
								},
							]}
						/>
					</div>

					<div className="flex flex-col gap-12">
						<div className="flex-1">
							{isLoading ? (
								<div className="grid grid-cols-1 gap-4">
									{[1, 2, 3, 4, 5].map((i) => (
										<div
											key={i}
											className="h-24 bg-gray-100 rounded-3xl animate-pulse"
										/>
									))}
								</div>
							) : (
								<AnimatePresence mode="popLayout">
									<div className="flex flex-col gap-3">
										{products.length === 0 ? (
											<div className="py-32 text-center bg-white rounded-[48px] border border-gray-100">
											<p className="text-lg font-bold text-gray-300">
												조건에 맞는 상품이 없습니다.
											</p>
											<button
												type="button"
												onClick={() => {
													setSelectedFilters([]);
													setSelectedBanks([]);
												}}
												className="mt-4 text-sm font-black text-gray-900 underline underline-offset-4"
											>
												필터 전체 해제
											</button>
										</div>
										) : (
											products.map((product, idx) => (
												<div
													key={product.fin_prdt_cd}
													className="flex flex-col gap-2"
												>
													<CompactProductCard
														product={product}
														rank={idx + 1}
														type={activeTab}
													/>
													{idx === 0 && (
														<div className="mx-4 mb-4">
															<TaxCalculatorWidget
																baseAmount={1000000}
																rate={product.bestOption?.intr_rate2 || 0}
																term={parseInt(selectedTerm)}
																type={activeTab}
															/>
														</div>
													)}
												</div>
											))
										)}
									</div>
								</AnimatePresence>
							)}
						</div>
					</div>
				</section>
			</main>

			{/* Bank Selection Modal */}
			<BankSelectionModal
				isOpen={isBankModalOpen}
				onClose={() => setIsBankModalOpen(false)}
				selectedBanks={selectedBanks}
				onSelectBanks={setSelectedBanks}
			/>
		</div>
	);
}
