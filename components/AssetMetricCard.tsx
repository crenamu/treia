import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AssetMetricCardProps {
	title: string;
	value: string;
	trend: string;
	icon: ReactNode;
}

export default function AssetMetricCard({
	title,
	value,
	trend,
	icon,
}: AssetMetricCardProps) {
	const isNegative = trend.includes("-");

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all"
		>
			<div className="flex items-start justify-between mb-6">
				<div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 border border-gray-100">
					{icon}
				</div>
				<div
					className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isNegative ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}
				>
					{trend}
				</div>
			</div>
			<div>
				<p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
					{title}
				</p>
				<p className="text-3xl font-black text-gray-900 tracking-tight">
					{value}
				</p>
			</div>
		</motion.div>
	);
}
