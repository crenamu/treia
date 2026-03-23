"use client";
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function UserProfile() {
	const { user, logout, loading, setAuthModalOpen } = useAuth();
	const [isOpen, setIsOpen] = useState(false);

	if (loading)
		return (
			<div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
		);

	if (!user) {
		return (
			<button
				onClick={() => setAuthModalOpen(true)}
				className="px-4 py-2 bg-[var(--accent-gold)] text-black rounded-lg text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg"
			>
				Sign In
			</button>
		);
	}

	return (
		<div className="relative">
			<div
				onClick={() => setIsOpen(!isOpen)}
				className="w-10 h-10 rounded-full border border-gray-700 overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all active:scale-95"
			>
				{user.photoURL ? (
					<Image
						src={user.photoURL}
						alt={user.displayName || ""}
						width={40}
						height={40}
					/>
				) : (
					<div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
						<User size={18} />
					</div>
				)}
			</div>

			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-40"
						onClick={() => setIsOpen(false)}
					></div>
					<div className="absolute right-0 mt-3 w-56 bg-[#12141a] border border-gray-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
						<div className="p-4 border-b border-gray-800 mb-2">
							<p className="text-sm font-bold text-white truncate">
								{user.displayName}
							</p>
							<p className="text-[10px] text-gray-500 truncate font-medium">
								{user.email}
							</p>
						</div>

						<button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left">
							<LayoutDashboard size={16} /> 대시보드
						</button>
						<button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left">
							<Settings size={16} /> 계정 설정
						</button>

						<div className="h-px bg-gray-800 my-2 mx-2"></div>

						<button
							onClick={() => {
								logout();
								setIsOpen(false);
							}}
							className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-400/5 rounded-xl transition-all text-left"
						>
							<LogOut size={16} /> 로그아웃
						</button>
					</div>
				</>
			)}
		</div>
	);
}
