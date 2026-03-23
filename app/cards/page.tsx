"use client";

import { AnimatePresence } from "framer-motion";
import {
	AlertCircle,
	Car,
	Coffee,
	MonitorPlay,
	RotateCcw,
	ShoppingBag,
	Truck,
	Utensils,
	Wifi,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { type CardProduct, getCards } from "@/app/actions/card";
import CompactCardItem from "@/components/CompactCardItem";

export default function CardsPage() {
	const [products, setProducts] = useState<CardProduct[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

	const categoryOptions = [
		{ id: "shopping", label: "쇼핑", icon: <ShoppingBag size={18} /> },
		{ id: "food", label: "외식", icon: <Utensils size={18} /> },
		{ id: "coffee", label: "카페", icon: <Coffee size={18} /> },
		{ id: "delivery", label: "배달", icon: <Truck size={18} /> },
		{ id: "gas", label: "주유", icon: <Car size={18} /> },
		{ id: "telecom", label: "통신", icon: <Wifi size={18} /> },
		{ id: "streaming", label: "스트리밍", icon: <MonitorPlay size={18} /> },
		{ id: "energy", label: "공과금", icon: <Zap size={18} /> },
	];

	useEffect(() => {
		async function load() {
			setIsLoading(true);
			const { products: data } = await getCards(selectedFilters);
			setProducts(data);
			setIsLoading(false);
		}
		load();
	}, [selectedFilters]);

	const toggleFilter = (id: string) => {
		if (selectedFilters.includes(id)) {
			setSelectedFilters(selectedFilters.filter((f) => f !== id));
		} else {
			setSelectedFilters([...selectedFilters, id]);
		}
	};

	return (
		<div className="min-h-screen bg-[var(--bg-beige)] pb-32">
			{/* Top Status Bar */}
			<div className="py-3 px-6 text-center bg-amber-50 text-amber-700">
				<div className="container mx-auto flex items-center justify-center gap-3">
					<AlertCircle size={14} />
					<p className="text-[10px] font-black uppercase tracking-widest">
						카드 혜택 데이터는 실제 카드사 공시와 다를 수 있습니다.
					</p>
				</div>
			</div>

			<main className="container mx-auto px-6 py-12 md:py-20">
				<div className="max-w-4xl mb-16">
					<h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.2] tracking-tight mb-4">
						신용카드 혜택 테이블
					</h1>
					<p className="text-lg font-bold text-gray-400 max-w-2xl leading-relaxed">
						당신의 소비 패턴에 맞는 최적의 혜택 카드를 찾아드립니다.
					</p>
				</div>

				<div className="container mx-auto px-6 mt-16">
					{/* Simplified Filter for Cards */}
					<div className="sticky top-0 z-40 bg-[var(--bg-beige)]/80 backdrop-blur-md py-6 -mx-6 px-6 border-b border-gray-100 mb-12">
						<div className="container mx-auto flex items-center gap-4">
							<div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide py-1">
								{categoryOptions.map((opt) => (
									<button
										type="button"
										key={opt.id}
										onClick={() => toggleFilter(opt.id)}
										className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border whitespace-nowrap flex items-center gap-2 ${
											selectedFilters.includes(opt.id)
												? "bg-gray-900 border-gray-900 text-white shadow-xl"
												: "bg-white border-gray-100 text-gray-400 hover:border-gray-300"
										}`}
									>
										{opt.icon}
										{opt.label}
									</button>
								))}
							</div>
							<button
								type="button"
								onClick={() => setSelectedFilters([])}
								className="p-3 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-gray-900 transition-all shadow-sm shrink-0"
							>
								<RotateCcw size={18} />
							</button>
						</div>
					</div>

					<div className="max-w-4xl mx-auto">
						{isLoading ? (
							<div className="flex flex-col gap-4">
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
										<div className="py-40 text-center bg-white rounded-[56px] border border-gray-100 shadow-sm">
											<p className="text-xl font-bold text-gray-300">
												해당 조건에 맞는 카드가 없습니다.
											</p>
											<button
												type="button"
												onClick={() => setSelectedFilters([])}
												className="mt-8 text-sm font-black text-gray-900 underline underline-offset-8"
											>
												전체 보기
											</button>
										</div>
									) : (
										products.map((card) => (
											<div key={card.id}>
												<CompactCardItem product={card} />
											</div>
										))
									)}
								</div>
							</AnimatePresence>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
