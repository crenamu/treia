import ArticleCard from "@/components/ArticleCard";
import InsightCarousel from "@/components/InsightCarousel";
import { Suspense } from "react";

interface InsightArticle {
	id: string;
	title: string;
	category: string;
	excerpt: string;
	thumbnail?: string;
	createdAt?: { seconds: number; _seconds?: number } | string | null;
	difficulty?: "입문" | "중급" | "고급";
	source?: string;
}

export default function EducationListPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
			</div>
		}>
			<EducationListPageContent />
		</Suspense>
	);
}

function EducationListPageContent() {
	const searchParams = useSearchParams();
	const activeCategory = searchParams.get("category");
	const [articles, setArticles] = useState<InsightArticle[]>([]);
	const [loading, setLoading] = useState(true);

	const categories = useMemo(() => {
		if (activeCategory) return [activeCategory];
		return Array.from(new Set(articles.map((a) => a.category)));
	}, [articles, activeCategory]);

	useEffect(() => {
		// 정식 API를 통해 Firestore의 데이터를 가져옵니다.
		fetch("/api/education")
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					setArticles(data);
				}
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="min-h-screen bg-[#0A0B0F] text-white pb-24">
			{/* Header */}
			<div className="bg-[#14161B] border-b border-gray-800 pt-20 pb-12">
				<div className="container mx-auto px-6 max-w-7xl">
					<Link
						href="/treia"
						className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-500 mb-8 transition-colors text-xs font-mono uppercase tracking-[3px]"
					>
						<ArrowLeft size={14} /> Back to Dashboard
					</Link>

					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
						<div>
							<div className="flex items-center gap-2 text-amber-500 mb-2">
								<GraduationCap size={20} />
								<span className="text-xs font-black uppercase tracking-[0.2em]">
									Treia Academy
								</span>
							</div>
							<h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
								Treia <span className="text-amber-500">Insights</span>
							</h1>
							<p className="text-gray-500 font-medium max-w-xl leading-relaxed break-keep">
								데이터와 통계로 증명하는 프리미엄 트레이딩 전략 및 자산 관리 교육 자료
							</p>
						</div>

						<div className="flex items-center gap-4">
							<div className="relative">
								<Search
									className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
									size={18}
								/>
								<input
									type="text"
									placeholder="관심 있는 주제 검색..."
									className="bg-black/40 border border-gray-800 rounded-2xl py-3 pl-12 pr-6 text-sm focus:border-amber-500 outline-none w-full md:w-[300px] transition-all"
								/>
							</div>
							<button className="p-3 bg-gray-800 rounded-2xl text-gray-400 hover:text-white transition-colors">
								<Filter size={20} />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Categorized Horizontal Scroll Lists */}
			<div className="container mx-auto px-6 py-12 max-w-7xl">
				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={i}
								className="bg-gray-900/40 border border-gray-800 rounded-3xl h-[400px] animate-pulse"
							></div>
						))}
					</div>
				) : articles.length > 0 ? (
					<div className="flex flex-col gap-16">
						{activeCategory && (
							<div className="flex items-center justify-between mb-2">
								<p className="text-amber-500 font-mono text-[11px] uppercase tracking-widest flex items-center gap-2">
									<Filter size={14} /> Filtered by: {activeCategory}
								</p>
								<Link href="/treia/education" className="text-gray-500 hover:text-white text-xs font-bold transition-all underline underline-offset-4">
									Clear Filter
								</Link>
							</div>
						)}
						{categories.map(
							(category) => (
								<CategorySection
									key={category}
									category={category}
									articles={articles.filter((a) => a.category === category)}
								/>
							),
						)}
					</div>
				) : (
					<div className="col-span-full py-20 text-center">
						<p className="text-gray-500 font-bold">
							등록된 교육 자료가 없습니다.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

function CategorySection({
	category,
	articles,
}: {
	category: string;
	articles: InsightArticle[];
}) {
	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-black text-white flex items-center gap-3">
					<span className="w-2 h-8 bg-amber-500 rounded-r-xl inline-block -ml-6"></span>
					{category}
				</h2>
				<div className="flex items-center gap-6">
					<Link
						href={`/treia/education?category=${encodeURIComponent(category)}`}
						className="text-[11px] font-mono uppercase tracking-[3px] text-amber-500/60 hover:text-amber-500 transition-all"
					>
						Explore All
					</Link>
				</div>
			</div>

			{/* Horizontal Scroll Container */}
			<InsightCarousel>
				{articles.map((article) => (
					<div
						key={article.id}
						className="w-[340px] md:w-[400px] shrink-0"
					>
						<Link href={`/treia/education/${article.id}`} className="block h-full">
							<ArticleCard
								title={article.title}
								category={article.category}
								summary={article.excerpt}
								imageUrl={article.thumbnail}
								date={
									article.createdAt
										? (() => {
												const c = article.createdAt as {
													_seconds?: number;
													seconds?: number;
												};
												if (typeof c === "string")
													return new Date(c).toLocaleDateString("ko-KR");
												const sec = c._seconds ?? c.seconds;
												return sec
													? new Date(sec * 1000).toLocaleDateString("ko-KR")
													: "-";
											})()
										: "-"
								}
								source={article.source || "Treia Official"}
								difficulty={
									(article.difficulty as "입문" | "중급" | "고급") || "입문"
								}
							/>
						</Link>
					</div>
				))}
			</InsightCarousel>
		</section>
	);
}
