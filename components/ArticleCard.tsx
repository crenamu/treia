"use client";
import { ArrowUpRight, Bookmark, Clock, Sparkles } from "lucide-react";
import { useState } from "react";

interface ArticleCardProps {
	title: string;
	source: string;
	summary: string;
	difficulty: "입문" | "중급" | "고급";
	category: string;
	imageUrl?: string;
	date?: string;
	isAI?: boolean;
}

const FALLBACK: Record<string, string> = {
	"CFD 기초":
		"https://images.unsplash.com/photo-1611974717482-58a00f7484d0?w=800&q=80",
	"골드 특화":
		"https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80",
	"기술적 분석":
		"https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&q=80",
	"리스크 관리":
		"https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=800&q=80",
	자동매매:
		"https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80",
	브로커:
		"https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80",
	카피트레이딩:
		"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
	"사기 예방":
		"https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80",
};

export default function ArticleCard({
	title,
	source,
	summary,
	difficulty,
	category,
	imageUrl,
	date,
	isAI = false,
}: ArticleCardProps) {
	const [err, setErr] = useState(false);
	const src =
		!err && imageUrl ? imageUrl : FALLBACK[category] || FALLBACK["CFD 기초"];
	const dc =
		difficulty === "입문"
			? "bg-emerald-500/5 text-emerald-500"
			: difficulty === "중급"
				? "bg-blue-500/5 text-blue-500"
				: "bg-rose-500/5 text-rose-500";
	return (
		<div className="group relative bg-[#14161B] border border-gray-800/50 hover:border-amber-500/30 rounded-3xl overflow-hidden transition-all duration-500 flex flex-col h-full shadow-2xl shadow-black/20">
			<div className="relative aspect-[16/10] overflow-hidden bg-[#1D2129]">
				<img
					src={src}
					alt={title}
					className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[20%] group-hover:grayscale-0"
					onError={() => setErr(true)}
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#14161B] via-transparent to-transparent opacity-80"></div>
				<div className="absolute top-5 left-5">
					<div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/5 text-[9px] font-black text-amber-500 uppercase tracking-widest">
						{category}
					</div>
				</div>
			</div>
			<div className="p-7 flex flex-col flex-grow gap-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
							{source}
						</span>
						{isAI && (
							<div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-[9px] font-bold text-amber-500 uppercase tracking-tighter">
								<Sparkles size={10} /> AI
							</div>
						)}
					</div>
					</div>
				</div>
				<div className="flex flex-col gap-3.5">
					<h3 className="font-bold text-lg text-white leading-[1.4] group-hover:text-amber-500 transition-colors line-clamp-2 tracking-tight [word-break:keep-all]">
						{title}
					</h3>
					<p className="text-xs text-gray-500 leading-relaxed line-clamp-3 font-medium opacity-80 [word-break:keep-all]">
						{summary}
					</p>
				</div>
				<div className="mt-auto pt-7 flex items-center justify-between border-t border-gray-800/60">
					<div className="flex items-center gap-5 text-[10px] font-bold text-gray-600">
						<span
							className={`px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-tighter ${dc}`}
						>
							{difficulty}
						</span>
					</div>
					<div className="w-9 h-9 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-600 group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-500 transition-all duration-300">
						<ArrowUpRight size={18} />
					</div>
				</div>
			</div>
		</div>
	);
}
