"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BANK_LOGOS } from "@/app/actions/constants";
import type { LoanProduct } from "@/app/actions/loan";

interface CompactLoanCardProps {
	product: LoanProduct;
	rank?: number;
}

export default function CompactLoanCard({
	product,
	rank,
}: CompactLoanCardProps) {
	// 기관명 보정 (보이지 않는 문자 및 공백 제거)
	const bankNameRaw = product.kor_co_nm.trim();
	const bankName = bankNameRaw
		.replace(/[^\uAC00-\uD7A3a-zA-Z0-9\s]/g, "")
		.trim();

	// 키워드 기반 로고 매핑 (가장 긴 매칭 우선)
	const logoKey = Object.keys(BANK_LOGOS)
		.sort((a, b) => b.length - a.length)
		.find((key) => bankName.includes(key));

	// 로고 URL 결정 (매칭 없을 시 저축은행 기본 로고 활용)
	const logoUrl = logoKey
		? BANK_LOGOS[logoKey]
		: "/images/banks/savingsbank.png";

	const displayName = bankName.replace("주식회사", "").trim();

	return (
		<Link href={`/loans/${product.fin_prdt_cd}`} className="block">
			<motion.div
				layout
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className="group bg-white rounded-3xl p-5 md:p-6 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-5 hover:shadow-xl hover:shadow-gray-200/40 transition-all cursor-pointer relative"
			>
				{/* Rank & Logo Section */}
				<div className="flex items-center gap-4 shrink-0">
					{rank && (
						<div className="flex flex-col items-center justify-center min-w-[20px]">
							<span
								className={`text-lg font-black ${rank <= 3 ? "text-amber-500" : "text-gray-300"}`}
							>
								{rank}
							</span>
							{rank <= 3 && (
								<div className="w-1 h-1 rounded-full bg-amber-400 mt-1" />
							)}
						</div>
					)}
					<div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-50 shadow-sm overflow-hidden group-hover:border-amber-100 transition-colors">
						{logoUrl ? (
							<Image
								src={logoUrl}
								alt={bankName}
								width={36}
								height={36}
								className="object-contain"
							/>
						) : (
							<span className="text-[10px] font-black text-gray-400 text-center leading-tight">
								{displayName.slice(0, 2)}
								<br />
								{displayName.slice(2, 4)}
							</span>
						)}
					</div>
				</div>

				{/* Main Info */}
				<div className="flex-1 min-w-0">
					<div className="flex flex-col gap-0.5 mb-2">
						<span className="text-[11px] font-bold text-gray-400 truncate">
							{displayName}
						</span>
						<h3 className="text-base md:text-lg font-black text-gray-900 truncate leading-tight group-hover:text-amber-600 transition-colors">
							{product.fin_prdt_nm}
						</h3>
					</div>
					<div className="flex flex-wrap gap-1">
						{product.tags?.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="px-2 py-0.5 bg-gray-50 text-[10px] font-bold text-gray-400 rounded-md"
							>
								{tag}
							</span>
						))}
					</div>
				</div>

				{/* Stats - Horizontal alignment for density */}
				<div className="flex items-center justify-between sm:justify-end gap-8 md:gap-12 px-0 sm:px-4 border-t sm:border-t-0 sm:border-r border-gray-50 pt-4 sm:pt-0 mt-2 sm:mt-0 sm:mr-2 w-full sm:w-auto">
					<div className="text-left sm:text-right">
						<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
							최대 한도
						</p>
						<p className="text-sm sm:text-base font-black text-gray-700">
							{product.loan_lmt.split(" ")[1] || product.loan_lmt}
						</p>
					</div>
					<div className="text-right">
						<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
							최저 금리
						</p>
						<div className="flex items-baseline justify-end gap-1">
							<span className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-amber-600 transition-colors">
								연{" "}
								{product.bestOption?.lend_rate_min
									? `${product.bestOption.lend_rate_min}%`
									: "-%"}
							</span>
						</div>
					</div>
				</div>

				<ChevronRight
					size={20}
					className="hidden sm:block text-gray-200 group-hover:text-amber-600 transition-all"
				/>
			</motion.div>
		</Link>
	);
}
