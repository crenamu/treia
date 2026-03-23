"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	Calendar,
	ChevronRight,
	Home as HomeIcon,
	Landmark,
	Rocket,
	ShieldCheck,
	Sparkles,
	Star,
	Trash2,
	TrendingUp,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";

interface Bookmark {
	id: string;
	itemId: string;
	title: string;
	type: string;
	timestamp: { seconds: number; nanoseconds: number } | null;
}

export default function SavedPage() {
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<User | null>(null);
	const [activeTab, setActiveTab] = useState("전체");

	useEffect(() => {
		const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
			setUser(u);
			if (!u) {
				setLoading(false);
				setBookmarks([]);
			}
		});

		return () => unsubscribeAuth();
	}, []);

	useEffect(() => {
		if (!user) return;

		const q = query(
			collection(db, "fintable_bookmarks"),
			where("userId", "==", user.uid),
		);

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const docs = snapshot.docs.map((d) => ({
					id: d.id,
					...d.data(),
				})) as Bookmark[];
				setBookmarks(
					docs.sort(
						(a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0),
					),
				);
				setLoading(false);
			},
			(error) => {
				console.error("Firestore error:", error);
				setLoading(false);
			},
		);

		return () => unsubscribe();
	}, [user]);

	const removeBookmark = async (id: string) => {
		try {
			await deleteDoc(doc(db, "fintable_bookmarks", id));
		} catch (e) {
			console.error("Delete error:", e);
		}
	};

	const filteredBookmarks = bookmarks.filter((b) => {
		if (activeTab === "전체") return true;
		if (activeTab === "금융") return b.type === "product";
		if (activeTab === "주거") return b.type === "housing";
		return true;
	});

	// Dashboard Stats Mock
	const financialCount = bookmarks.filter((b) => b.type === "product").length;
	const housingCount = bookmarks.filter((b) => b.type === "housing").length;

	if (loading) {
		return (
			<div className="min-h-screen bg-[var(--bg-beige)] flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin"></div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-[var(--bg-beige)] flex flex-col items-center justify-center p-6 text-center">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-10"
				>
					<ShieldCheck size={48} className="text-blue-500" />
				</motion.div>
				<h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tighter uppercase">
					Security Check Required
				</h1>
				<p className="text-gray-500 font-medium max-w-sm mb-12 leading-relaxed text-lg">
					당신의 개인 핀테크 대시보드를 확인하려면
					<br />
					안전한 로그인이 필요합니다.
				</p>
				<button className="px-12 py-5 bg-gray-900 text-white font-black text-xs uppercase tracking-[3px] rounded-2xl shadow-xl shadow-gray-900/10 hover:scale-105 active:scale-95 transition-all">
					Connect Your Account
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[var(--bg-beige)] selection:bg-blue-100 pb-24">
			<main className="container mx-auto max-w-6xl px-6 pt-12 md:pt-20">
				{/* Personal Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="space-y-4"
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100">
							<Star size={14} className="fill-yellow-400 text-yellow-400" />
							<span className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">
								My Financial Folder
							</span>
						</div>
						<h1 className="text-5xl md:text-6xl font-outfit font-black text-gray-900 tracking-tighter leading-none">
							관심 목록 <span className="text-blue-600">대시보드</span>
						</h1>
						<p className="text-gray-500 font-medium text-lg leading-relaxed">
							{user.displayName || "사용자"}님, 엄선하신 {bookmarks.length}개의
							기회들이 이곳에 모였습니다.
						</p>
					</motion.div>

					<div className="flex p-1.5 bg-white/60 backdrop-blur-xl rounded-[28px] border border-white shadow-xl shadow-gray-200/20">
						{["전체", "금융", "주거"].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-8 py-4 rounded-[22px] text-xs font-black transition-all tracking-[1px] uppercase ${
									activeTab === tab
										? "bg-gray-900 text-white shadow-lg"
										: "text-gray-400 hover:text-gray-600"
								}`}
							>
								{tab}
							</button>
						))}
					</div>
				</div>

				{/* Dashboard Insight Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
					<InsightCard
						label="금융 자산 후보"
						value={`${financialCount}개`}
						sub="예적금 상품군"
						icon={<Wallet size={20} />}
						color="green"
					/>
					<InsightCard
						label="주거 지원 공고"
						value={`${housingCount}개`}
						sub="임대주택 통합"
						icon={<HomeIcon size={20} />}
						color="blue"
					/>
					<InsightCard
						label="예상 최대 금리"
						value="연 4.5%"
						sub="찜한 상품 기준"
						icon={<TrendingUp size={20} />}
						color="purple"
					/>
				</div>

				{/* Content Area */}
				<AnimatePresence mode="wait">
					{filteredBookmarks.length === 0 ? (
						<motion.div
							key="empty"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="bg-white rounded-[60px] p-20 md:p-32 text-center border border-gray-100 shadow-2xl shadow-gray-200/50"
						>
							<div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-10">
								<Star size={40} className="text-gray-200" />
							</div>
							<h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
								수집된 폴더가 비어있습니다
							</h3>
							<p className="text-gray-400 font-medium mb-12 text-lg">
								당신에게 필요한 금융과 주거의 기회를 직접 채워보세요.
							</p>
							<Link
								href="/"
								className="inline-flex items-center gap-4 px-10 py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-[20px] hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
							>
								Explore Opportunities <ArrowRight size={18} />
							</Link>
						</motion.div>
					) : (
						<motion.div key="list" className="grid grid-cols-1 gap-4">
							{filteredBookmarks.map((item, idx) => (
								<motion.div
									initial={{ opacity: 0, y: 15 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.05 }}
									key={item.id}
									className="group bg-white rounded-[40px] p-2 hover:p-1 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-500 cursor-pointer overflow-hidden"
								>
									<div className="bg-white rounded-[39px] p-6 flex flex-col md:flex-row md:items-center gap-8">
										<div
											className={`w-16 h-16 rounded-[28px] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform ${
												item.type === "housing"
													? "bg-blue-600 text-white shadow-blue-500/20"
													: "bg-green-500 text-white shadow-green-500/20"
											}`}
										>
											{item.type === "housing" ? (
												<HomeIcon size={28} />
											) : (
												<Landmark size={28} />
											)}
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-3 mb-2">
												<span
													className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white ${item.type === "housing" ? "bg-blue-400" : "bg-green-400"}`}
												>
													{item.type === "housing" ? "HOUSING" : "FINANCE"}
												</span>
												<span className="text-[10px] text-gray-300 font-bold flex items-center gap-1">
													<Calendar size={12} />{" "}
													{item.timestamp
														? new Date(
																item.timestamp.seconds * 1000,
															).toLocaleDateString()
														: "최근"}
												</span>
											</div>
											<h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors truncate tracking-tighter">
												{item.title}
											</h3>
										</div>

										<div className="flex items-center gap-3 ml-auto md:ml-0">
											<Link
												href={
													item.type === "housing"
														? `/housing`
														: `/deposits/${item.itemId}`
												}
												className="px-8 py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-lg"
											>
												View Details
											</Link>
											<button
												onClick={() => removeBookmark(item.id)}
												className="p-4 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
												title="삭제"
											>
												<Trash2 size={20} />
											</button>
										</div>
									</div>
								</motion.div>
							))}
						</motion.div>
					)}
				</AnimatePresence>

				{/* AI Recommendations (Toss Style) */}
				<div className="mt-24 space-y-12">
					<div className="flex items-center justify-between px-2">
						<h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
							<Sparkles size={24} className="text-blue-600" /> AI의 추가 추천
						</h2>
						<Link
							href="/"
							className="text-xs font-bold text-gray-400 hover:text-gray-900"
						>
							모두 보기 <ChevronRight size={14} className="inline" />
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<RecommendCard
							title="나의 주거 사다리 설계"
							desc="저장한 공고들을 분석하여 최적의 청약 시나리오를 제안합니다."
							icon={<Rocket size={24} />}
							color="blue"
						/>
						<RecommendCard
							title="자산 성장 시뮬레이션"
							desc="장바구니에 담은 예적금을 모두 가입했을 때의 3년 뒤 미래."
							icon={<TrendingUp size={24} />}
							color="green"
						/>
					</div>
				</div>
			</main>
		</div>
	);
}

function InsightCard({
	label,
	value,
	sub,
	icon,
	color,
}: {
	label: string;
	value: string;
	sub: string;
	icon: React.ReactNode;
	color: string;
}) {
	return (
		<div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-gray-200/10 flex items-center gap-6 group hover:-translate-y-1 transition-all duration-500">
			<div
				className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${color === "green" ? "bg-green-50 text-green-600" : color === "blue" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}
			>
				{icon}
			</div>
			<div className="min-w-0">
				<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
					{label}
				</p>
				<p className="text-2xl font-outfit font-black text-gray-900 leading-none mb-1.5">
					{value}
				</p>
				<p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
					{sub}
				</p>
			</div>
		</div>
	);
}

function RecommendCard({
	title,
	desc,
	icon,
	color,
}: {
	title: string;
	desc: string;
	icon: React.ReactNode;
	color: "blue" | "green";
}) {
	return (
		<div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl hover:border-blue-100 transition-all group overflow-hidden relative">
			<div
				className={`absolute top-0 right-0 w-32 h-32 opacity-5 blur-3xl ${color === "blue" ? "bg-blue-600" : "bg-green-600"}`}
			></div>
			<div
				className={`w-16 h-16 rounded-[28px] flex items-center justify-center shrink-0 transition-all duration-500 ${color === "blue" ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white"}`}
			>
				{icon}
			</div>
			<div className="text-center md:text-left">
				<h4 className="text-xl font-black text-gray-900 mb-3">{title}</h4>
				<p className="text-sm font-medium text-gray-400 leading-relaxed">
					{desc}
				</p>
			</div>
		</div>
	);
}
