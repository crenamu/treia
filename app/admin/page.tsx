"use client";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import {
	CheckCircle2,
	ChevronDown,
	Clock,
	Loader2,
	Mail,
	Send,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { db } from "@/lib/firebase";

export default function AdminDashboardPage() {
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [password, setPassword] = useState("");

	// 인증 처리
	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		if (password === "treia1234!") {
			setIsAuthorized(true);
		} else {
			alert("비밀번호가 일치하지 않습니다.");
		}
	};

	if (!isAuthorized) {
		return (
			<LayoutWrapper>
				<div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
					<form
						className="bg-[#0a0a0e] border border-[#1a1a1a] p-8 rounded-2xl w-full max-w-sm text-center"
						onSubmit={handleLogin}
					>
						<h2 className="text-xl text-white font-medium mb-6">
							Admin Dashboard
						</h2>
						<input
							type="password"
							placeholder="비밀번호 입력"
							className="w-full bg-[#111] border border-[#333] text-white p-3 rounded-lg mb-4 text-center"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button className="w-full bg-[#c8a84b] text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition">
							접속하기
						</button>
					</form>
				</div>
			</LayoutWrapper>
		);
	}

	return (
		<LayoutWrapper>
			<AdminContent />
		</LayoutWrapper>
	);
}

function AdminContent() {
	const [leads, setLeads] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [sendingId, setSendingId] = useState<string | null>(null);

	const fetchLeads = async () => {
		setIsLoading(true);
		try {
			const q = query(
				collection(db, "treia_leads"),
				orderBy("createdAt", "desc"),
			);
			const snapshot = await getDocs(q);
			const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			setLeads(data);
		} catch (e) {
			console.error(e);
			alert("데이터를 불러오지 못했습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchLeads();
	}, []);

	const handleSendEmail = async (
		leadId: string,
		email: string,
		name: string,
	) => {
		if (
			!confirm(
				`${name}님(${email})에게 관전자 계정을 템플릿 이메일로 발송하시겠습니까?`,
			)
		)
			return;

		setSendingId(leadId);
		try {
			const res = await fetch("/api/admin/send-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					leadId,
					email,
					name,
					notionUrl: window.location.origin + "/treia/guide",
				}),
			});

			const result = await res.json();
			if (result.success) {
				alert("발송 완료!");
				fetchLeads(); // 새로고침
			} else {
				alert("발송 실패: " + result.message);
			}
		} catch (e) {
			alert("네트워크 오류");
		} finally {
			setSendingId(null);
		}
	};

	return (
		<div className="min-h-screen bg-[#050505] py-20 px-6">
			<div className="max-w-6xl mx-auto">
				<header className="flex justify-between items-end mb-8 border-b border-[#222] pb-6">
					<div>
						<h1 className="text-3xl text-white font-light tracking-tight mb-2">
							Treia Leads Admin
						</h1>
						<p className="text-[#a1a1aa] text-sm">
							신청자 목록 및 이메일 발송 관리
						</p>
					</div>
					<button
						onClick={fetchLeads}
						className="bg-[#111] hover:bg-[#222] text-[#ccc] px-4 py-2 rounded-lg border border-[#333] transition flex items-center gap-2 text-sm"
					>
						<ChevronDown size={16} /> 새로고침
					</button>
				</header>

				{isLoading ? (
					<div className="flex justify-center py-20">
						<Loader2 className="animate-spin text-[#c8a84b]" size={40} />
					</div>
				) : (
					<div className="bg-[#0a0a0e] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl">
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="bg-[#111] border-b border-[#222]">
										<th className="p-4 text-[#777] font-medium text-sm">
											Date
										</th>
										<th className="p-4 text-[#777] font-medium text-sm">
											Name
										</th>
										<th className="p-4 text-[#777] font-medium text-sm">
											Email
										</th>
										<th className="p-4 text-[#777] font-medium text-sm">
											Reason / Inquiry
										</th>
										<th className="p-4 text-[#777] font-medium text-sm text-center">
											Status
										</th>
										<th className="p-4 text-[#777] font-medium text-sm text-center">
											Action
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-[#1a1a1a]">
									{leads.map((lead) => {
										const dateObj = lead.createdAt?.toDate
											? lead.createdAt.toDate()
											: new Date();
										const dateStr =
											dateObj.toLocaleDateString() +
											" " +
											dateObj.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											});
										const isApproved = lead.status === "approved";

										return (
											<tr
												key={lead.id}
												className="hover:bg-[#111]/50 transition"
											>
												<td className="p-4 text-sm text-[#888]">{dateStr}</td>
												<td className="p-4 text-white font-medium">
													{lead.name}
												</td>
												<td className="p-4 text-[#a1a1aa] font-mono text-sm flex items-center gap-2">
													<Mail size={14} className="text-[#555]" />{" "}
													{lead.contact}
												</td>
												<td
													className="p-4 text-[#aaa] text-sm max-w-xs truncate"
													title={lead.reason || lead.inquiry}
												>
													{lead.reason || lead.inquiry || "-"}
												</td>
												<td className="p-4 text-center">
													{isApproved ? (
														<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10b981]/10 text-[#10b981] rounded-full text-xs font-medium">
															<CheckCircle2 size={12} /> Approved
														</span>
													) : (
														<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-medium">
															<Clock size={12} /> Pending
														</span>
													)}
												</td>
												<td className="p-4 text-center">
													<button
														disabled={isApproved || sendingId === lead.id}
														onClick={() =>
															handleSendEmail(lead.id, lead.contact, lead.name)
														}
														className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 mx-auto
                               ${
                                                                isApproved
                                                                    ? "bg-[#222] text-[#555] cursor-not-allowed"
                                                                    : "bg-[#c8a84b] text-black hover:bg-yellow-600"
                                                            }`}
													>
														{sendingId === lead.id ? (
															<Loader2 size={16} className="animate-spin" />
														) : (
															<Send size={16} />
														)}
														{isApproved ? "발송됨" : "이메일 쏘기"}
													</button>
												</td>
											</tr>
										);
									})}
									{leads.length === 0 && (
										<tr>
											<td colSpan={6} className="p-10 text-center text-[#555]">
												등록된 신청자가 없습니다.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
