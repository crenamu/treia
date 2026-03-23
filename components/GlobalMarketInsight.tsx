import { Coins, Globe, TrendingUp, Wallet } from "lucide-react";

export default function GlobalMarketInsight() {
	const metrics = [
		{ label: "KRW/USD", value: "1,324.50", change: "+0.2%", up: true },
		{ label: "Gold (oz)", value: "2,145.20", change: "-0.5%", up: false },
		{ label: "KOSPI", value: "2,680.15", change: "+1.1%", up: true },
	];

	return (
		<div className="flex flex-col md:flex-row items-center gap-12 p-8 md:p-12 bg-white rounded-[56px] border border-gray-100 shadow-sm relative overflow-hidden group">
			<div className="absolute top-0 left-0 w-2 h-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

			<div className="flex items-center gap-6 shrink-0">
				<div className="w-16 h-16 rounded-[24px] bg-gray-900 flex items-center justify-center text-white shadow-xl">
					<Globe size={28} />
				</div>
				<div>
					<h4 className="text-xl font-black text-gray-900 tracking-tight">
						Global Insights
					</h4>
					<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
						Real-time Market Data
					</p>
				</div>
			</div>

			<div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-8">
				{metrics.map((m) => (
					<div key={m.label} className="flex flex-col gap-2">
						<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
							{m.label}
						</p>
						<div className="flex items-end gap-3">
							<span className="text-2xl font-black text-gray-900 tracking-tighter">
								{m.value}
							</span>
							<div
								className={`flex items-center gap-1 text-[11px] font-black ${m.up ? "text-green-500" : "text-red-500"}`}
							>
								{m.up ? (
									<TrendingUp size={12} />
								) : (
									<TrendingUp size={12} className="rotate-180" />
								)}
								{m.change}
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="hidden lg:flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
				<Wallet size={16} className="text-gray-400" />
				<span className="text-xs font-bold text-gray-500 italic">
					Market volatility remains moderate
				</span>
			</div>
		</div>
	);
}
