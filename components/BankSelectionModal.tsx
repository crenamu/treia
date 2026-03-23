"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { BANK_LIST_TIER_1, BANK_LIST_TIER_2 } from "@/app/actions/constants";

interface BankSelectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedBanks: string[];
	onSelectBanks: (banks: string[]) => void;
}

export default function BankSelectionModal({
	isOpen,
	onClose,
	selectedBanks,
	onSelectBanks,
}: BankSelectionModalProps) {
	const [activeTab, setActiveTab] = useState<"tier1" | "tier2">("tier1");
	const currentBankList =
		activeTab === "tier1" ? BANK_LIST_TIER_1 : BANK_LIST_TIER_2;

	const toggleBank = (name: string) => {
		if (selectedBanks.includes(name)) {
			onSelectBanks(selectedBanks.filter((b) => b !== name));
		} else {
			onSelectBanks([...selectedBanks, name]);
		}
	};

	const toggleAll = () => {
		const currentBankNames = currentBankList.map((b) => b.name);
		const isAllSelected = currentBankNames.every((name) =>
			selectedBanks.includes(name),
		);

		if (isAllSelected) {
			onSelectBanks(
				selectedBanks.filter((name) => !currentBankNames.includes(name)),
			);
		} else {
			const newSelected = Array.from(
				new Set([...selectedBanks, ...currentBankNames]),
			);
			onSelectBanks(newSelected);
		}
	};

	const isAllSelected = currentBankList
		.map((b) => b.name)
		.every((name) => selectedBanks.includes(name));

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
					/>
					<motion.div
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white rounded-t-[40px] z-[101] overflow-hidden shadow-2xl h-[85vh] flex flex-col"
					>
						{/* Header */}
						<div className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0">
							<h2 className="text-2xl font-black text-gray-900">금융사</h2>
							<button
								onClick={onClose}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X size={24} className="text-gray-400" />
							</button>
						</div>

						{/* Tabs */}
						<div className="px-8 flex gap-8 border-b border-gray-100 mb-6 shrink-0">
							<button
								onClick={() => setActiveTab("tier1")}
								className={`pb-4 text-sm font-black transition-all relative ${
									activeTab === "tier1" ? "text-gray-900" : "text-gray-300"
								}`}
							>
								1금융권
								{activeTab === "tier1" && (
									<motion.div
										layoutId="modalTab"
										className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
									/>
								)}
							</button>
							<button
								onClick={() => setActiveTab("tier2")}
								className={`pb-4 text-sm font-black transition-all relative ${
									activeTab === "tier2" ? "text-gray-900" : "text-gray-300"
								}`}
							>
								2금융권
								{activeTab === "tier2" && (
									<motion.div
										layoutId="modalTab"
										className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
									/>
								)}
							</button>
						</div>

						{/* List Header */}
						<div className="px-8 flex items-center justify-between mb-4 shrink-0">
							<span className="text-base font-black text-gray-900">
								{activeTab === "tier1" ? "1금융권" : "2금융권"}
							</span>
							<button
								onClick={toggleAll}
								className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
							>
								<Check
									size={14}
									className={isAllSelected ? "text-green-500" : ""}
								/>
								전체 선택
							</button>
						</div>

						{/* Grid List */}
						<div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide">
							<div className="grid grid-cols-3 gap-2">
								{currentBankList.map((bank) => {
									const isSelected = selectedBanks.includes(bank.name);
									return (
										<button
											key={bank.id}
											onClick={() => toggleBank(bank.name)}
											className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all border ${
												isSelected
													? "bg-amber-50 border-amber-200 shadow-sm"
													: "bg-white border-transparent hover:bg-gray-50"
											}`}
										>
											{/* Bank Logo Placeholder with initial */}
											<div
												className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center font-black text-xs shadow-sm ${
													isSelected
														? "bg-amber-400 text-white"
														: "bg-gray-50 text-gray-400 border border-gray-100"
												}`}
											>
												{bank.name.substring(0, 2)}
											</div>
											<span
												className={`text-[11px] font-bold text-center leading-tight ${isSelected ? "text-amber-800" : "text-gray-500"}`}
											>
												{bank.name}
											</span>
										</button>
									);
								})}
							</div>
						</div>

						{/* Footer Action */}
						<div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
							<button
								onClick={onClose}
								className="w-full py-5 bg-[#00B464] hover:bg-[#009E58] text-white rounded-[20px] font-black text-base shadow-xl active:scale-[0.98] transition-all"
							>
								금융사 상품 찾아보기
							</button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
