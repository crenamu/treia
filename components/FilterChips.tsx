"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface FilterChipsProps {
	filters: { id: string; label: string }[];
	onRemove: (id: string) => void;
	onClearAll: () => void;
}

export default function FilterChips({
	filters,
	onRemove,
	onClearAll,
}: FilterChipsProps) {
	if (filters.length === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-3 mb-8">
			<AnimatePresence>
				{filters.map((filter) => (
					<motion.button
						key={filter.id}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						onClick={() => onRemove(filter.id)}
						className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-full text-xs font-bold shadow-sm hover:bg-[#059669] transition-all group"
					>
						{filter.label}
						<X size={14} className="opacity-60 group-hover:opacity-100" />
					</motion.button>
				))}
			</AnimatePresence>

			{filters.length > 1 && (
				<button
					onClick={onClearAll}
					className="text-xs font-bold text-gray-400 hover:text-gray-900 ml-2 transition-colors underline underline-offset-4 decoration-gray-200"
				>
					초기화
				</button>
			)}
		</div>
	);
}
