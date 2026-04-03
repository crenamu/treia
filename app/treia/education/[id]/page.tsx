"use client";
import {
	AlertTriangle,
	ArrowLeft,
	Bookmark,
	Clock,
	GraduationCap,
	Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";

const FALLBACK: Record<string, string> = {
	"CFD 기초": "https://images.unsplash.com/photo-1611974717482-58a00f7484d0?w=1600&q=80",
	"골드 특화": "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1600&q=80",
	"기술적 분석": "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1600&q=80",
	"리스크 관리": "https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=1600&q=80",
	"자동매매": "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1600&q=80",
	"브로커": "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1600&q=80",
	"카피트레이딩": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
	"사기 예방": "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1600&q=80",
};

interface Article {
	id: string;
	title: string;
	category: string;
	content: string;
	thumbnail: string;
	createdAt?: { seconds: number; _seconds?: number } | string | null;
	source?: string;
	difficulty?: string;
}

export default function EducationDetailPage() {
	const { id } = useParams();
	const [article, setArticle] = useState<Article | null>(null);
	const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(true);
	const [imageError, setImageError] = useState(false);

	const backgroundImage = useMemo(() => {
		if (!article) return "";
		if (article.thumbnail && !imageError) return article.thumbnail;
		return FALLBACK[article.category] || FALLBACK["CFD 기초"];
	}, [article, imageError]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(`/api/education/${id}`);
				const data = await res.json();
				setArticle(data);

				// 연관 기사 불러오기 (최신 4개 중 현재 게시물 제외 2개 선택)
				const relRes = await fetch("/api/education");
				const relData = await relRes.json();
				if (Array.isArray(relData)) {
					setRelatedArticles(relData.filter((a) => a.id !== id).slice(0, 2));
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		if (id) fetchData();
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
			</div>
		);
	}

	if (!article) {
		return (
			<div className="min-h-screen bg-[#0A0B0F] text-white flex flex-col items-center justify-center gap-4">
				<h1 className="text-2xl font-bold">글을 찾을 수 없습니다.</h1>
				<Link href="/" className="text-amber-500 flex items-center gap-2">
					<ArrowLeft size={16} /> 홈으로 돌아가기
				</Link>
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-[#0A0B0F] text-white pb-24">
			{/* Hero Header Selection */}
			<div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden bg-[#0A0B0F]">
				<div className="absolute inset-0 z-0 select-none pointer-events-none">
					<img
						src={backgroundImage}
						alt=""
						className="w-full h-full object-cover opacity-30 transition-opacity duration-1000 scale-110"
						onError={() => setImageError(true)}
						loading="lazy"
					/>
				</div>
				<div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0A0B0F] to-transparent z-10" />
				<div className="absolute inset-0 bg-[#0A0B0F]/40 z-10" />

				<div className="absolute bottom-0 left-0 w-full z-20">
					<div className="container mx-auto px-6 pb-16 max-w-4xl">
						<Link
							href="/treia/education"
							className="inline-flex items-center gap-2 text-amber-500 hover:text-white mb-8 transition-all font-bold group"
						>
							<ArrowLeft
								size={18}
								className="group-hover:-translate-x-1 transition-transform"
							/>
							<span className="text-sm">Back to Insights</span>
						</Link>

						<div className="flex items-center gap-3 mb-4">
							<span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
								{article.category}
							</span>
						</div>

						<h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-6 [word-break:keep-all]">
							{article.title}
						</h1>

						<div className="flex items-center gap-6">
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-black text-xs">
									T
								</div>
								<span className="text-xs font-bold text-gray-300">
									{article.source || "Treia Official"}
								</span>
							</div>
							<div className="h-4 w-px bg-gray-800"></div>
							<div className="flex gap-4">
								<button 
									onClick={() => {
										navigator.clipboard.writeText(window.location.href);
										alert("링크가 복사되었습니다.");
									}}
									className="group/share flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
								>
									<Share2 size={18} />
									<span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Share</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="container mx-auto px-6 mt-12 max-w-4xl">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
					{/* Main Content */}
					<div className="lg:col-span-8">
						<article className="prose prose-invert prose-amber max-w-none">
							<ReactMarkdown
								components={{
									h3: ({ ...props }) => (
										<h3
											className="text-2xl md:text-3xl font-black text-white mt-20 mb-10 border-l-8 border-amber-500 pl-6 leading-tight tracking-tighter"
											{...props}
										/>
									),
									p: ({ ...props }) => (
										<p
											className="text-gray-400 leading-[1.8] text-lg md:text-xl mb-10 font-medium tracking-tight opacity-90"
											{...props}
										/>
									),
									li: ({ ...props }) => (
										<li
											className="text-gray-300 mb-4 text-base md:text-lg leading-relaxed list-disc marker:text-amber-500"
											{...props}
										/>
									),
									strong: ({ ...props }) => (
										<strong
											className="text-amber-400 font-black px-1"
											{...props}
										/>
									),
									ul: ({ ...props }) => (
										<ul className="mb-10 pl-6 space-y-4" {...props} />
									),
								}}
							>
								{article.content}
							</ReactMarkdown>
						</article>

						{/* Bottom Disclaimer 보정: 면책 고지 -> 투자 유의사항 */}
						<div className="mt-20 p-8 rounded-3xl bg-[#14161B] border border-gray-800 flex gap-5 shadow-2xl shadow-black/40 outline outline-1 outline-amber-500/10">
							<AlertTriangle
								className="text-amber-500 shrink-0 mt-1"
								size={28}
							/>
							<div>
								<h4 className="text-lg font-black text-white mb-3 tracking-tight">
									투자 유의사항 (Investment Disclaimer)
								</h4>
								<p className="text-sm text-gray-500 leading-relaxed font-medium [word-break:keep-all] opacity-80">
									트레이아에서 제공하는 모든 인사이트는 정보 제공 및 교육 목적을
									위해 작성되었으며, 특정 금융 상품의 매수·매도를 권유하지
									않습니다. 모든 투자의 책임은 투자자 본인에게 있으며, 과거의
									실적이 미래의 수익을 보장하지 않습니다. 금융 거래는 원금
									손실의 위험이 크므로 본인의 판단 하에 신중하게 접근하시기
									바랍니다.
								</p>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<aside className="lg:col-span-4 space-y-8">
						<div className="sticky top-24">
							<div className="p-8 rounded-3xl border border-gray-800 bg-[#14161B] shadow-lg shadow-black/20">
								<h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-8 border-b border-gray-800/50 pb-4">
									Related Insights
								</h4>
								<div className="flex flex-col gap-8">
									{relatedArticles.length > 0 ? (
										relatedArticles.map((rel) => (
											<Link
												key={rel.id}
												href={`/treia/education/${rel.id}`}
												className="group/item flex flex-col gap-2 transition-all"
											>
												<span className="text-[9px] font-black text-amber-500/70 uppercase tracking-widest group-hover/item:text-amber-500 transition-colors">
													{rel.category}
												</span>
												<span className="text-[15px] font-bold text-gray-400 group-hover/item:text-white leading-snug transition-all line-clamp-2 [word-break:keep-all] tracking-tight">
													{rel.title}
												</span>
											</Link>
										))
									) : (
										<p className="text-xs text-gray-500 font-bold py-2">
											관련 내용이 없습니다.
										</p>
									)}
								</div>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</main>
	);
}
