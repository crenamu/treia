"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { CardProduct } from "@/app/actions/card";

interface CompactCardItemProps {
	product: CardProduct;
}

export default function CompactCardItem({ product }: CompactCardItemProps) {
	return (
		<Link href={`/cards/${product.id}`} className="block">
			<motion.div
				layout
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				className="group bg-white rounded-3xl p-5 md:p-6 border border-gray-100 flex items-center gap-4 hover:shadow-xl hover:shadow-gray-200/40 transition-all cursor-pointer"
			>
				{/* Card Plate Minimal or Image */}
				<div className="w-16 h-10 md:w-20 md:h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-[10px] font-black text-white/30 tracking-widest overflow-hidden shrink-0 shadow-lg relative">
					{product.imageUrl ? (
						<img
							src={product.imageUrl}
							alt={product.name}
							className="w-full h-full object-cover"
						/>
					) : (
						product.imageText
					)}
				</div>

				{/* Main Info */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<span className="text-[11px] font-bold text-gray-400 truncate">
							{product.company}
						</span>
					</div>
					<h3 className="text-base md:text-lg font-black text-gray-900 mb-1 truncate group-hover:text-amber-600 transition-colors">
						{product.name}
					</h3>
					<p className="text-xs font-bold text-amber-500 line-clamp-1">
						{product.bestBenefit}
					</p>
				</div>

				{/* Stats */}
				<div className="text-right shrink-0 px-4 border-l border-gray-50 ml-2 hidden sm:block">
					<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
						연회비
					</p>
					<p className="text-sm font-black text-gray-700">
						{product.annualFee}
					</p>
					<p className="text-[10px] font-bold text-gray-400 mt-0.5">
						{product.prevMonthRecord}
					</p>
				</div>

				<ChevronRight
					size={20}
					className="text-gray-200 group-hover:text-amber-600 transition-all"
				/>
			</motion.div>
		</Link>
	);
}
