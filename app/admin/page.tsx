"use client";

import {
  collection, getDocs, orderBy, query,
  doc, setDoc, updateDoc, deleteDoc, serverTimestamp
} from "firebase/firestore";
import {
  CheckCircle2, ChevronDown, Clock, Loader2, Mail,
  Send, Plus, Trash2, Shield, ShieldOff, Key, Users
} from "lucide-react";
import { useEffect, useState } from "react";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { db } from "@/lib/firebase";

// ── 타입 ──
interface License {
  id: string;
  accountId: string;      // MT5 계좌번호
  name: string;           // 유저 이름
  maxLot: number;         // 최대 랏
  expireDate: string;     // YYYY-MM-DD
  active: boolean;
  tier: string;           // 'observer' | 'starter' | 'pro'
  note: string;
  investorPassword?: string; // 투자자 비밀번호 (수익금 정산용)
  balance?: number;       // 현재 잔고 (EA 보고용)
  equity?: number;        // 현재 평가금 (EA 보고용)
  profit?: number;        // 누적 수익금 (EA 보고용)
  lastUpdated?: any;
  strategies?: Record<string, { tf: string; profit: number; updatedAt: string }>;
  createdAt?: any;
}

// ── 비밀번호 화면 ──
export default function AdminDashboardPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");

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
            <h2 className="text-xl text-white font-medium mb-6">Admin Dashboard</h2>
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

// ── 메인 어드민 ──
function AdminContent() {
  const [activeTab, setActiveTab] = useState<"leads" | "licenses">("leads");

  return (
    <div className="min-h-screen bg-[#050505] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <header className="flex justify-between items-end mb-8 border-b border-[#222] pb-6">
          <div>
            <h1 className="text-3xl text-white font-light tracking-tight mb-2">Treia Admin</h1>
            <p className="text-[#a1a1aa] text-sm">신청자 관리 · 라이선스 발급 · EA 권한 제어</p>
          </div>
          {/* 탭 */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("leads")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition border ${
                activeTab === "leads"
                  ? "bg-[#c8a84b] text-black border-[#c8a84b]"
                  : "bg-[#111] text-[#aaa] border-[#333] hover:bg-[#1a1a1a]"
              }`}
            >
              <Users size={15} /> Leads
            </button>
            <button
              onClick={() => setActiveTab("licenses")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition border ${
                activeTab === "licenses"
                  ? "bg-[#10b981] text-black border-[#10b981]"
                  : "bg-[#111] text-[#aaa] border-[#333] hover:bg-[#1a1a1a]"
              }`}
            >
              <Key size={15} /> Licenses
            </button>
          </div>
        </header>

        {activeTab === "leads" ? <LeadsTab /> : <LicensesTab />}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// TAB 1: LEADS (기존)
// ══════════════════════════════════════════
function LeadsTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "treia_leads"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setLeads(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
      alert("데이터를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleSendEmail = async (leadId: string, email: string, name: string) => {
    if (!confirm(`${name}님(${email})에게 관전자 계정을 템플릿 이메일로 발송하시겠습니까?`)) return;
    setSendingId(leadId);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, email, name, notionUrl: window.location.origin + "/guide" }),
      });
      const result = await res.json();
      if (result.success) { alert("발송 완료!"); fetchLeads(); }
      else alert("발송 실패: " + result.message);
    } catch { alert("네트워크 오류"); }
    finally { setSendingId(null); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-[#555] text-sm">{leads.length}명 신청</p>
        <button onClick={fetchLeads} className="bg-[#111] hover:bg-[#222] text-[#ccc] px-4 py-2 rounded-lg border border-[#333] transition flex items-center gap-2 text-sm">
          <ChevronDown size={16} /> 새로고침
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#c8a84b]" size={40} /></div>
      ) : (
        <div className="bg-[#0a0a0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#111] border-b border-[#222]">
                  {["Date", "Name", "Email", "Reason / Inquiry", "Status", "Action"].map(h => (
                    <th key={h} className="p-4 text-[#777] font-medium text-sm">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {leads.map((lead) => {
                  const dateObj = lead.createdAt?.toDate ? lead.createdAt.toDate() : new Date();
                  const dateStr = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  const isApproved = lead.status === "approved";
                  return (
                    <tr key={lead.id} className="hover:bg-[#111]/50 transition">
                      <td className="p-4 text-sm text-[#888]">{dateStr}</td>
                      <td className="p-4 text-white font-medium">{lead.name}</td>
                      <td className="p-4 text-[#a1a1aa] font-mono text-sm">
                        <span className="flex items-center gap-2"><Mail size={14} className="text-[#555]" />{lead.contact}</span>
                      </td>
                      <td className="p-4 text-[#aaa] text-sm max-w-xs truncate" title={lead.reason || lead.inquiry}>
                        {lead.reason || lead.inquiry || "-"}
                      </td>
                      <td className="p-4">
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
                      <td className="p-4">
                        <button
                          disabled={isApproved || sendingId === lead.id}
                          onClick={() => handleSendEmail(lead.id, lead.contact, lead.name)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                            isApproved ? "bg-[#222] text-[#555] cursor-not-allowed" : "bg-[#c8a84b] text-black hover:bg-yellow-600"
                          }`}
                        >
                          {sendingId === lead.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                          {isApproved ? "발송됨" : "이메일 쏘기"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {leads.length === 0 && (
                  <tr><td colSpan={6} className="p-10 text-center text-[#555]">등록된 신청자가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════
// TAB 2: LICENSE MANAGER (신규)
// ══════════════════════════════════════════
const TIERS = ["observer", "starter", "pro"];
const TIER_COLORS: Record<string, string> = {
  observer: "text-[#7a7f8e] bg-[#1e2230]",
  starter:  "text-[#c8a84b] bg-[#c8a84b]/10",
  pro:      "text-[#10b981] bg-[#10b981]/10",
};

const EMPTY_FORM = {
  accountId: "", name: "", maxLot: 0.01,
  expireDate: "", active: true, tier: "observer", note: "",
  investorPassword: ""
};

function LicensesTab() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<License | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const fetchLicenses = async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "treia_licenses"));
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as License));
      data.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      setLicenses(data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchLicenses(); }, []);

  const openNew = () => { setEditTarget(null); setForm({ ...EMPTY_FORM }); setShowForm(true); };
  const openEdit = (lic: License) => {
    setEditTarget(lic);
    setForm({ 
      accountId: lic.accountId, 
      name: lic.name, 
      maxLot: lic.maxLot, 
      expireDate: lic.expireDate, 
      active: lic.active, 
      tier: lic.tier, 
      note: lic.note || "",
      investorPassword: lic.investorPassword || ""
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.accountId.trim()) { alert("MT5 계좌번호를 입력하세요."); return; }
    if (!form.expireDate) { alert("만료일을 입력하세요."); return; }
    setSaving(true);
    try {
      const docId = editTarget ? editTarget.id : form.accountId.trim();
      const payload = { ...form, accountId: form.accountId.trim(), updatedAt: serverTimestamp(), ...(!editTarget && { createdAt: serverTimestamp() }) };
      await setDoc(doc(db, "treia_licenses", docId), payload, { merge: true });
      alert(editTarget ? "수정 완료!" : "라이선스 발급 완료!");
      setShowForm(false);
      fetchLicenses();
    } catch (e) { alert("저장 실패"); console.error(e); }
    finally { setSaving(false); }
  };

  const toggleActive = async (lic: License) => {
    try {
      await updateDoc(doc(db, "treia_licenses", lic.id), { active: !lic.active });
      fetchLicenses();
    } catch { alert("업데이트 실패"); }
  };

  const handleDelete = async (lic: License) => {
    if (!confirm(`[${lic.accountId}] ${lic.name} 라이선스를 삭제하시겠습니까? EA 구동이 즉시 중단됩니다.`)) return;
    try {
      await deleteDoc(doc(db, "treia_licenses", lic.id));
      fetchLicenses();
    } catch { alert("삭제 실패"); }
  };

  const isExpired = (dateStr: string) => dateStr ? new Date(dateStr) < new Date() : false;
  const daysLeft = (dateStr: string) => {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
    return diff;
  };

  return (
    <div>
      {/* 상단 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <p className="text-[#555] text-sm">총 {licenses.length}개 라이선스</p>
          <span className="text-[#555] text-sm">·</span>
          <p className="text-[#10b981] text-sm">{licenses.filter(l => l.active && !isExpired(l.expireDate)).length}개 활성</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchLicenses} className="bg-[#111] text-[#ccc] px-4 py-2 rounded-lg border border-[#333] text-sm flex items-center gap-2 hover:bg-[#1a1a1a]">
            <ChevronDown size={15} /> 새로고침
          </button>
          <button onClick={openNew} className="bg-[#10b981] text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-400">
            <Plus size={15} /> 라이선스 발급
          </button>
        </div>
      </div>

      {/* 발급 폼 */}
      {showForm && (
        <div className="bg-[#0a0a0e] border border-[#10b981]/30 rounded-2xl p-6 mb-6">
          <h3 className="text-white font-medium mb-5 flex items-center gap-2">
            <Key size={16} className="text-[#10b981]" />
            {editTarget ? `라이선스 수정 — ${editTarget.accountId}` : "신규 라이선스 발급"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-[#777] text-xs mb-1 block">MT5 계좌번호 *</label>
              <input
                className="w-full bg-[#111] border border-[#333] text-white p-2.5 rounded-lg text-sm font-mono"
                placeholder="예: 100106281"
                value={form.accountId}
                disabled={!!editTarget}
                onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[#777] text-xs mb-1 block">유저 이름 *</label>
              <input
                className="w-full bg-[#111] border border-[#333] text-white p-2.5 rounded-lg text-sm"
                placeholder="예: 홍길동"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[#777] text-xs mb-1 block">티어</label>
              <select
                className="w-full bg-[#111] border border-[#333] text-white p-2.5 rounded-lg text-sm"
                value={form.tier}
                onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}
              >
                {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#777] text-xs mb-1 block">최대 랏 (Max Lot)</label>
              <input
                type="number" step="0.01" min="0.01"
                className="w-full bg-[#111] border border-[#333] text-white p-2.5 rounded-lg text-sm font-mono"
                placeholder="0.01"
                value={form.maxLot}
                onChange={e => setForm(f => ({ ...f, maxLot: parseFloat(e.target.value) || 0.01 }))}
              />
            </div>
            <div>
              <label className="text-[#777] text-xs mb-1 block">만료일 *</label>
              <input
                type="date"
                className="w-full bg-[#111] border border-[#333] text-white p-2.5 rounded-lg text-sm"
                value={form.expireDate}
                onChange={e => setForm(f => ({ ...f, expireDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[#777] text-xs mb-1 block">활성 여부</label>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${form.active ? "bg-[#10b981] text-black" : "bg-[#333] text-[#888]"}`}
                >
                  {form.active ? "활성" : "비활성"}
                </button>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-[#777] text-xs mb-1 block">투자자 비밀번호 (Investor PW)</label>
              <input
                className="w-full bg-[#111] border border-[#333] text-white p-2.5 rounded-lg text-sm font-mono"
                placeholder="관전자 비번"
                value={form.investorPassword}
                onChange={e => setForm(f => ({ ...f, investorPassword: e.target.value }))}
              />
            </div>
            <div className="col-span-2 md:col-span-2">
              <label className="text-[#777] text-xs mb-1 block">메모</label>
              <input
                className="w-full bg-[#111] border border-[#333] text-white p-2.5 rounded-lg text-sm"
                placeholder="예: 관전자 1개월 체험, 시드 $3,000"
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#10b981] text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-400 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Key size={15} />}
              {editTarget ? "수정 저장" : "발급하기"}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-[#222] text-[#aaa] px-6 py-2.5 rounded-lg text-sm hover:bg-[#333]">
              취소
            </button>
          </div>
        </div>
      )}

      {/* 라이선스 테이블 */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#10b981]" size={40} /></div>
      ) : (
        <div className="bg-[#0a0a0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#111] border-b border-[#222]">
                  {["계좌번호", "이름/비번", "티어", "Max Lot", "수익/잔고", "만료일", "상태", "액션"].map(h => (
                    <th key={h} className="p-4 text-[#777] font-medium text-sm">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {licenses.map((lic) => {
                  const expired = isExpired(lic.expireDate);
                  const days = daysLeft(lic.expireDate);
                  const isLive = lic.active && !expired;

                  return (
                    <tr key={lic.id} className="hover:bg-[#111]/50 transition">
                      <td className="p-4 font-mono text-[#10b981] text-sm">{lic.accountId}</td>
                      <td className="p-4 text-white text-sm">
                        <div>{lic.name}</div>
                        {lic.investorPassword && <div className="text-[#c8a84b] text-[10px] font-mono mt-0.5">PW: {lic.investorPassword}</div>}
                        {lic.note && <div className="text-[#555] text-xs mt-0.5">{lic.note}</div>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-mono ${TIER_COLORS[lic.tier] || "text-[#aaa]"}`}>
                          {lic.tier}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[#c8a84b] text-sm">{lic.maxLot}</td>
                      <td className="p-4 text-sm font-mono">
                         <div className="text-[#10b981] font-bold">${(lic.profit || 0).toLocaleString()}</div>
                         <div className="text-[#555] text-[10px] mb-2">Eq: ${(lic.equity || 0).toLocaleString()}</div>
                         
                         {/* 전략별 타임프레임 수익 현황 */}
                         <div className="flex flex-wrap gap-1 max-w-[150px]">
                           {lic.strategies && Object.entries(lic.strategies).map(([magic, data]) => (
                             <div key={magic} className="text-[9px] px-1.5 py-0.5 bg-[#111] border border-[#222] rounded flex gap-1 items-center">
                               <span className="text-[#777]">{data.tf}</span>
                               <span className={data.profit >= 0 ? "text-[#10b981]" : "text-[#e05252]"}>
                                 {data.profit >= 0 ? "+" : ""}{data.profit.toFixed(0)}
                               </span>
                             </div>
                           ))}
                         </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div className={expired ? "text-[#e05252]" : "text-[#aaa]"}>{lic.expireDate}</div>
                        {days !== null && (
                          <div className={`text-xs mt-0.5 ${expired ? "text-[#e05252]" : days <= 7 ? "text-[#c8a84b]" : "text-[#555]"}`}>
                            {expired ? "만료됨" : `D-${days}`}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10b981]/10 text-[#10b981] rounded-full text-xs font-medium">
                            <Shield size={11} /> Active
                          </span>
                        ) : expired ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e05252]/10 text-[#e05252] rounded-full text-xs font-medium">
                            <ShieldOff size={11} /> Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#333] text-[#777] rounded-full text-xs font-medium">
                            <ShieldOff size={11} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(lic)}
                            className="px-3 py-1.5 bg-[#1a1a1a] text-[#aaa] rounded-lg text-xs hover:bg-[#222] border border-[#333]"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => toggleActive(lic)}
                            className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                              lic.active
                                ? "bg-[#1a1a1a] text-[#e05252] border-[#e05252]/30 hover:bg-[#e05252]/10"
                                : "bg-[#1a1a1a] text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981]/10"
                            }`}
                          >
                            {lic.active ? "비활성화" : "활성화"}
                          </button>
                          <button
                            onClick={() => handleDelete(lic)}
                            className="p-1.5 text-[#555] hover:text-[#e05252] transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {licenses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-[#555]">
                      발급된 라이선스가 없습니다. 위의 "라이선스 발급" 버튼으로 추가하세요.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EA 연동 안내 */}
      <div className="mt-8 bg-[#0a0a0e] border border-[#1e2230] rounded-xl p-5">
        <h4 className="text-[#c8a84b] font-mono text-xs uppercase tracking-widest mb-3">EA 연동 구조</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#555]">
          <div className="bg-[#111] rounded-lg p-4">
            <div className="text-[#10b981] font-mono text-xs mb-2">Firebase DB</div>
            <div className="font-mono text-xs text-[#777]">treia_licenses / {"{accountId}"}</div>
            <div className="mt-2 space-y-1 text-xs">
              <div><span className="text-[#c8a84b]">active</span>: true/false</div>
              <div><span className="text-[#c8a84b]">expireDate</span>: YYYY-MM-DD</div>
              <div><span className="text-[#c8a84b]">maxLot</span>: 0.01</div>
            </div>
          </div>
          <div className="bg-[#111] rounded-lg p-4">
            <div className="text-[#10b981] font-mono text-xs mb-2">API Endpoint</div>
            <div className="font-mono text-xs text-[#777]">GET /api/license/check</div>
            <div className="mt-2 space-y-1 text-xs">
              <div><span className="text-[#c8a84b]">?account=</span>계좌번호</div>
              <div>→ {`{ valid, maxLot, expireDate }`}</div>
            </div>
          </div>
          <div className="bg-[#111] rounded-lg p-4">
            <div className="text-[#10b981] font-mono text-xs mb-2">MQL5 (EA)</div>
            <div className="font-mono text-xs text-[#777]">OnInit() 에서 HTTP 체크</div>
            <div className="mt-2 space-y-1 text-xs">
              <div>valid=false → <span className="text-[#e05252]">EA 중단</span></div>
              <div>expired → <span className="text-[#e05252]">EA 중단</span></div>
              <div>maxLot 초과 → <span className="text-[#e05252]">주문 차단</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
