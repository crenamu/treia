"use client";

import { ArrowLeft, Construction } from "lucide-react";
import Link from "next/link";

export default function PlaceholderPage({
	title = "준비 중인 서비스",
}: {
	title?: string;
}) {
	return (
		<div className="min-h-screen bg-[var(--bg-beige)] flex flex-col items-center justify-center p-6 text-center">
			<div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-8">
				<Construction size={40} className="text-orange-500" />
			</div>
			<h1 className="text-3xl font-outfit font-black text-gray-900 mb-4 tracking-tighter">
				{title}
			</h1>
			<p className="text-gray-500 font-medium max-w-xs mb-10 leading-relaxed">
				더 나은 금융 정보를 제공하기 위해 열심히 준비하고 있습니다. 조금만
				기다려 주세요!
			</p>
			<Link
				href="/"
				className="flex items-center gap-2 text-sm font-bold text-green-600 hover:gap-3 transition-all"
			>
				<ArrowLeft size={16} /> 메인으로 돌아가기
			</Link>
		</div>
	);
}
