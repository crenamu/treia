"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { useState } from "react";

interface TaxCalculatorProps {
	baseAmount: number;
	rate: number;
	term: number; // 개월 수
	type: "deposit" | "saving";
}

export default function TaxCalculatorWidget({
	baseAmount,
	rate,
	term,
	type,
}: TaxCalculatorProps) {
	const [isOpen, setIsOpen] = useState(false);

	// 단순 계산 로직 (실제 은행 앱과 유사하게)
	// 예금: 원금 * 금리 * (기간/12)
	// 적금: 월납입액 * 금리 * n(n+1)/2 * (1/12) -> 근사치
	const calculateInterest = () => {
		if (type === "deposit") {
			const gross = baseAmount * (rate / 100) * (term / 12);
			const tax = gross * 0.154;
			return { gross, tax, net: gross - tax };
		} else {
			// 적금 단순화 (월 복리 제외, 단리 근사)
			const totalMonths = term;
			const gross =
				(baseAmount * (rate / 100) * ((totalMonths * (totalMonths + 1)) / 2)) /
				12;
			const tax = gross * 0.154;
			return { gross, tax, net: gross - tax };
		}
	};

	const { gross, tax, net } = calculateInterest();

	return (
		<div className="mt-8 border-t border-gray-100 pt-8">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100/80 rounded-[32px] transition-all group"
			>
				<div className="flex items-center gap-4">
					<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-sm border border-gray-100">
						<Calculator size={18} />
					</div>
					<div>
						<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left mb-1">
							예상 수령액
						</p>
						<p className="text-sm font-black text-gray-900">
							{baseAmount.toLocaleString()}
							{type === "deposit" ? "원 예치 시" : "원 납입 시"} 세후 이자{" "}
							<span className="text-green-600">
								+{Math.floor(net).toLocaleString()}원
							</span>
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2 text-xs font-bold text-gray-400">
					{isOpen ? "닫기" : "상세보기"}
					<ArrowRight
						size={14}
						className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
					/>
				</div>
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="overflow-hidden"
					>
						<div className="p-8 space-y-4">
							<div className="flex justify-between text-sm">
								<span className="text-gray-400 font-bold">세전 이자</span>
								<span className="text-gray-900 font-black">
									{Math.floor(gross).toLocaleString()}원
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<div className="flex items-center gap-2">
									<span className="text-gray-400 font-bold">
										이자 과세 (15.4%)
									</span>
									<Info size={12} className="text-gray-300" />
								</div>
								<span className="text-red-500 font-black">
									-{Math.floor(tax).toLocaleString()}원
								</span>
							</div>
							<div className="pt-4 border-t border-gray-50 flex justify-between items-center">
								<span className="text-base font-black text-gray-900">
									최종 세후 수령액
								</span>
								<span className="text-xl font-black text-green-600">
									{(
										baseAmount * (type === "deposit" ? 1 : term) +
										net
									).toLocaleString()}
									원
								</span>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
