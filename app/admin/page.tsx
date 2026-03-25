"use client";

import {
  collection, getDocs, orderBy, query,
  doc, setDoc, updateDoc, deleteDoc, serverTimestamp, getDoc
} from "firebase/firestore";
import {
  CheckCircle2, ChevronDown, Clock, Loader2, Mail, Send,
  Plus, Trash2, Shield, ShieldOff, Key, Users, Activity,
  TrendingUp, TrendingDown, Wifi, WifiOff, RefreshCw
} from "lucide-react";
import { useEffect, useState } from "react";
import LayoutWrapper from "@/app/components/LayoutWrapper";
import { db } from "@/lib/firebase";
import { ThemeToggle } from "@/app/components/ThemeToggle";

interface License {
  id: string;
  accountId: string;
  licenseKey: string; // 고유 라이선스 키 추가
  name: string;
  maxLot: number;
  expireDate: string;
  active: boolean;
  tier: string;
  note: string;
  createdAt?: { seconds: number; nanoseconds: number };
  // 모니터링 필드
  lastSeen?: { seconds: number; nanoseconds: number };
  lastUpdate?: string;
  balance?: number;
  equity?: number;
  profit?: number;
  history?: Array<{
    ts: string;
    balance: number | null;
    equity: number | null;
    profit: number | null;
    magicNumber: number | null;
    timeframe: string | null;
    strategyProfit: number | null;
  }>;
  [key: string]: unknown;
}

interface Lead {
  id: string;
  name?: string;
  contact?: string;
  reason?: string;
  inquiry?: string;
  status?: string;
  createdAt?: { toDate: () => Date };
}

const TIERS = ["observer", "starter", "pro"];
const TIER_COLORS: Record<string, string> = {
  observer: "text-[#7a7f8e] bg-[#1e2230]",
  starter:  "text-[#c8a84b] bg-[#c8a84b]/10",
  pro:      "text-[#10b981] bg-[#10b981]/10",
};
const EMPTY_FORM = {
  accountId: "", licenseKey: "", name: "", maxLot: 0.01,
  expireDate: "", active: true, tier: "observer", note: ""
};

// 고유 키 생성 도구 (새 규칙: treia_No1_계좌뒷4자리)
const generateKey = (accountId: string) => {
  const last4 = accountId.trim().slice(-4) || "0000";
  return `treia_No1_${last4}`;
};

// ── 비밀번호 ──
export default function AdminDashboardPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "treia1234!") setIsAuthorized(true);
    else alert("비밀번호가 일치하지 않습니다.");
  };

  if (!isAuthorized) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen bg-[var(--treia-bg)] flex items-center justify-center p-6">
          <form className="bg-[var(--treia-card)] border border-[var(--treia-card-border)] p-8 rounded-2xl w-full max-w-sm text-center" onSubmit={handleLogin}>
            <div className="flex justify-center mb-6">
              <ThemeToggle />
            </div>
            <h2 className="text-xl text-[var(--treia-text)] font-medium mb-6">Admin Dashboard</h2>
            <input type="password" placeholder="비밀번호 입력"
              className="w-full bg-[var(--treia-bg)] border border-[var(--treia-card-border)] text-[var(--treia-text)] p-3 rounded-lg mb-4 text-center focus:outline-none focus:border-[#c8a84b]"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="w-full bg-[#c8a84b] text-black font-bold py-3 rounded-lg hover:bg-[#d4b55c] transition">접속하기</button>
          </form>
        </div>
      </LayoutWrapper>
    );
  }

  return <LayoutWrapper><AdminContent /></LayoutWrapper>;
}

// ── 메인 ──
function AdminContent() {
  const [activeTab, setActiveTab] = useState<"leads" | "licenses" | "monitor">("leads");

  const tabs = [
    { id: "leads",    label: "Leads",    icon: <Users size={15} />,    color: "bg-[#c8a84b] text-black border-[#c8a84b]" },
    { id: "licenses", label: "Licenses", icon: <Key size={15} />,      color: "bg-[#10b981] text-black border-[#10b981]" },
    { id: "monitor",  label: "Monitor",  icon: <Activity size={15} />, color: "bg-[#3b82f6] text-black border-[#3b82f6]" },
  ];

  return (
    <div className="min-h-screen bg-[var(--treia-bg)] py-16 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-8 border-b border-[var(--treia-section-border)] pb-6">
          <div>
            <h1 className="text-3xl text-[var(--treia-text)] font-light tracking-tight mb-2">Treia Admin</h1>
            <p className="text-[var(--treia-sub)] text-sm">신청자 관리 · 라이선스 발급 · EA 실시간 모니터링</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex gap-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition border ${
                  activeTab === t.id ? t.color : "bg-[var(--treia-card)] text-[var(--treia-sub)] border-[var(--treia-card-border)] hover:bg-[var(--treia-bg)]"
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
            </div>
          </div>
        </header>
        {activeTab === "leads"    && <LeadsTab />}
        {activeTab === "licenses" && <LicensesTab />}
        {activeTab === "monitor"  && <MonitorTab />}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// TAB 1: LEADS
// ══════════════════════════════════════════
function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "treia_leads"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() } as Lead)));
    } catch (e) { console.error(e); alert("데이터를 불러오지 못했습니다."); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleSendEmail = async (leadId: string, email: string, name: string) => {
    if (!confirm(`${name}님(${email})에게 관전자 계정을 템플릿 이메일로 발송하시겠습니까?`)) return;
    setSendingId(leadId);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
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
        <p className="text-[var(--treia-sub)] text-sm">{leads.length}명 신청</p>
        <button onClick={fetchLeads} className="bg-[var(--treia-card)] text-[var(--treia-sub)] px-4 py-2 rounded-lg border border-[var(--treia-card-border)] text-sm flex items-center gap-2 hover:bg-[var(--treia-bg)]">
          <RefreshCw size={16} /> 새로고침
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#c8a84b]" size={40} /></div>
      ) : (
        <div className="bg-[var(--treia-card)] border border-[var(--treia-card-border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--treia-bg)] border-b border-[var(--treia-card-border)]">
                  {["Date","Name","Email","Reason / Inquiry","Status","Action"].map(h => (
                    <th key={h} className="p-4 text-[var(--treia-sub)] font-medium text-sm">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {leads.map((lead) => {
                  const ts = lead.createdAt as { toDate: () => Date } | undefined;
                  const dateObj = ts?.toDate ? ts.toDate() : new Date();
                  const dateStr = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  const isApproved = lead.status === "approved";
                  return (
                    <tr key={lead.id} className="hover:bg-[var(--treia-sub)]/5 transition">
                      <td className="p-4 text-sm text-[var(--treia-sub)]">{dateStr}</td>
                      <td className="p-4 text-[var(--treia-text)] font-medium">{lead.name}</td>
                      <td className="p-4 text-[var(--treia-sub)] font-mono text-sm">
                        <span className="flex items-center gap-2"><Mail size={14} className="opacity-50" />{lead.contact}</span>
                      </td>
                      <td className="p-4 text-[var(--treia-sub)] text-sm max-w-xs truncate" title={lead.reason || lead.inquiry}>
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
                        <button disabled={isApproved || sendingId === lead.id}
                          onClick={() => handleSendEmail(lead.id, lead.contact || "", lead.name || "")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                            isApproved ? "bg-[var(--treia-bg)] text-[var(--treia-sub)]/50 cursor-not-allowed border border-[var(--treia-card-border)]" : "bg-[#c8a84b] text-black hover:bg-[#d4b55c]"
                          }`}>
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
// TAB 2: LICENSE MANAGER
// ══════════════════════════════════════════
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
      const snap = await getDocs(collection(db, "treia_licenses"));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as License));
      data.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      setLicenses(data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchLicenses(); }, []);

  const openNew = () => { setEditTarget(null); setForm({ ...EMPTY_FORM, licenseKey: "treia_No1_0000" }); setShowForm(true); };
  const openEdit = (lic: License) => {
    setEditTarget(lic);
    setForm({ accountId: lic.accountId, licenseKey: lic.licenseKey || "", name: lic.name, maxLot: lic.maxLot, expireDate: lic.expireDate, active: lic.active, tier: lic.tier, note: lic.note || "" });
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
    try { await updateDoc(doc(db, "treia_licenses", lic.id), { active: !lic.active }); fetchLicenses(); }
    catch { alert("업데이트 실패"); }
  };

  const handleDelete = async (lic: License) => {
    if (!confirm(`[${lic.accountId}] ${lic.name} 라이선스를 삭제하시겠습니까? EA 구동이 즉시 중단됩니다.`)) return;
    try { await deleteDoc(doc(db, "treia_licenses", lic.id)); fetchLicenses(); }
    catch { alert("삭제 실패"); }
  };

  const isExpired = (d: string) => d ? new Date(d) < new Date() : false;
  const daysLeft = (d: string) => d ? Math.ceil((new Date(d).getTime() - Date.now()) / 86400000) : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <p className="text-[#555] text-sm">총 {licenses.length}개</p>
          <p className="text-[#10b981] text-sm">{licenses.filter(l => l.active && !isExpired(l.expireDate)).length}개 활성</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchLicenses} className="bg-[#111] text-[#ccc] px-4 py-2 rounded-lg border border-[#333] text-sm flex items-center gap-2 hover:bg-[#1a1a1a]">
            <RefreshCw size={15} /> 새로고침
          </button>
          <button onClick={openNew} className="bg-[#10b981] text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-400">
            <Plus size={15} /> 라이선스 발급
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-[var(--treia-card)] border border-[var(--treia-card-border)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-white font-medium mb-5 flex items-center gap-2">
            <Key size={16} className="text-[#10b981]" />
            {editTarget ? `라이선스 수정 — ${editTarget.accountId}` : "신규 라이선스 발급"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {[
              { label: "MT5 계좌번호 *", key: "accountId", placeholder: "예: 100106281", mono: true, disabled: !!editTarget },
              { label: "라이선스 키 (Password) *", key: "licenseKey", placeholder: "TREIA-XXXX-XXXX", mono: true },
              { label: "유저 이름 *", key: "name", placeholder: "예: 홍길동" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[var(--treia-sub)] text-xs mb-1 block">{f.label}</label>
                <div className="relative">
                  <input className={`w-full bg-[var(--treia-bg)] border border-[var(--treia-card-border)] text-[var(--treia-text)] p-2.5 rounded-lg text-sm ${f.mono ? "font-mono" : ""} ${f.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    placeholder={f.placeholder} value={(form as any)[f.key]} disabled={f.disabled}
                    onChange={e => {
                      const val = e.target.value;
                      setForm(prev => {
                        const next = { ...prev, [f.key]: val };
                        // 계좌번호 수정 시 라이선스키 자동 업데이트 (신규 발급 시)
                        if (f.key === "accountId" && !editTarget) {
                          next.licenseKey = generateKey(val);
                        }
                        return next;
                      });
                    }} />
                  {f.key === "licenseKey" && (
                    <button type="button" onClick={() => setForm(f => ({ ...f, licenseKey: generateKey(form.accountId) }))} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#555] hover:text-[#10b981] transition">
                      <RefreshCw size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div>
              <label className="text-[var(--treia-sub)] text-xs mb-1 block">티어</label>
              <select className="w-full bg-[var(--treia-bg)] border border-[var(--treia-card-border)] text-[var(--treia-text)] p-2.5 rounded-lg text-sm"
                value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}>
                {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[var(--treia-sub)] text-xs mb-1 block">최대 랏 (Max Lot)</label>
              <input type="number" step="0.01" min="0.01" className="w-full bg-[var(--treia-bg)] border border-[var(--treia-card-border)] text-[var(--treia-text)] p-2.5 rounded-lg text-sm font-mono"
                placeholder="0.01" value={form.maxLot} onChange={e => setForm(f => ({ ...f, maxLot: parseFloat(e.target.value) || 0.01 }))} />
            </div>
            <div>
              <label className="text-[var(--treia-sub)] text-xs mb-1 block">만료일 *</label>
              <input type="date" className="w-full bg-[var(--treia-bg)] border border-[var(--treia-card-border)] text-[var(--treia-text)] p-2.5 rounded-lg text-sm"
                value={form.expireDate} onChange={e => setForm(f => ({ ...f, expireDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-[var(--treia-sub)] text-xs mb-1 block">활성 여부</label>
              <button type="button" onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                className={`mt-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${form.active ? "bg-[#10b981] text-black" : "bg-[#333] text-[#888]"}`}>
                {form.active ? "활성" : "비활성"}
              </button>
            </div>
            <div className="col-span-2 md:col-span-3">
              <label className="text-[var(--treia-sub)] text-xs mb-1 block">메모</label>
              <input className="w-full bg-[var(--treia-bg)] border border-[var(--treia-card-border)] text-[var(--treia-text)] p-2.5 rounded-lg text-sm"
                placeholder="예: 관전자 1개월 체험, 시드 $3,000"
                value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="bg-[#10b981] text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-400 flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Key size={15} />}
              {editTarget ? "수정 저장" : "발급하기"}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-[#222] text-[#aaa] px-6 py-2.5 rounded-lg text-sm hover:bg-[#333]">취소</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#10b981]" size={40} /></div>
      ) : (
        <div className="bg-[var(--treia-card)] border border-[var(--treia-card-border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#111] border-b border-[#222]">
                  {["계좌번호","이름","티어","Max Lot","만료일","상태","액션"].map(h => (
                    <th key={h} className="p-4 text-[var(--treia-sub)] font-medium text-sm">{h}</th>
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
                      <td className="p-4 text-[var(--treia-text)] text-sm">
                        <div>{lic.name}</div>
                        {lic.note && <div className="text-[#555] text-xs mt-0.5">{lic.note}</div>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-mono ${TIER_COLORS[lic.tier] || "text-[#aaa]"}`}>{lic.tier}</span>
                      </td>
                      <td className="p-4 font-mono text-[#c8a84b] text-sm">{lic.maxLot}</td>
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
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10b981]/10 text-[#10b981] rounded-full text-xs font-medium"><Shield size={11} /> Active</span>
                        ) : expired ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e05252]/10 text-[#e05252] rounded-full text-xs font-medium"><ShieldOff size={11} /> Expired</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#333] text-[var(--treia-sub)] rounded-full text-xs font-medium"><ShieldOff size={11} /> Inactive</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(lic)} className="px-3 py-1.5 bg-[#1a1a1a] text-[#aaa] rounded-lg text-xs hover:bg-[#222] border border-[#333]">수정</button>
                          <button onClick={() => toggleActive(lic)}
                            className={`px-3 py-1.5 rounded-lg text-xs border transition ${lic.active ? "bg-[#1a1a1a] text-[#e05252] border-[#e05252]/30 hover:bg-[#e05252]/10" : "bg-[#1a1a1a] text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981]/10"}`}>
                            {lic.active ? "비활성화" : "활성화"}
                          </button>
                          <button onClick={() => handleDelete(lic)} className="p-1.5 text-[#555] hover:text-[#e05252] transition"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {licenses.length === 0 && (
                  <tr><td colSpan={7} className="p-10 text-center text-[#555]">발급된 라이선스가 없습니다.</td></tr>
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
// TAB 3: REAL-TIME MONITOR
// ══════════════════════════════════════════
function MonitorTab() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<License | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, "treia_licenses"));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as License));
      setLicenses(data);
      setLastRefresh(new Date());
      if (selected) {
        const updated = data.find(l => l.id === selected.id);
        if (updated) setSelected(updated);
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 60000); // 1분마다 자동 갱신
    return () => clearInterval(interval);
  }, []);

  const isOnline = (lic: License) => {
    if (!lic.lastUpdate) return false;
    const last = new Date(lic.lastUpdate);
    return Date.now() - last.getTime() < 70 * 60 * 1000; // 70분 이내
  };

  const fmtTime = (iso: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("ko-KR") + " " + d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  // 타임프레임별 전략 수익 파싱
  const getStrategies = (lic: License) => {
    return Object.entries(lic)
      .filter(([k]) => k.startsWith("strategy_"))
      .map(([, v]) => v as any);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <p className="text-[#555] text-sm">마지막 갱신: {lastRefresh.toLocaleTimeString("ko-KR")}</p>
          <span className="text-[#10b981] text-xs animate-pulse">● 1분 자동갱신</span>
        </div>
        <button onClick={fetchAll} className="bg-[#111] text-[#ccc] px-4 py-2 rounded-lg border border-[#333] text-sm flex items-center gap-2 hover:bg-[#1a1a1a]">
          <RefreshCw size={15} /> 새로고침
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#3b82f6]" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 계좌 목록 */}
          <div className="space-y-3">
            {licenses.filter(l => l.active).length === 0 && (
              <p className="text-[#555] text-sm text-center py-10">활성 라이선스가 없습니다.</p>
            )}
            {licenses.map(lic => {
              const online = isOnline(lic);
              const profit = lic.profit ?? 0;
              return (
                <div key={lic.id}
                  onClick={() => setSelected(lic)}
                  className={`bg-[var(--treia-card)] border rounded-xl p-4 cursor-pointer transition ${
                    selected?.id === lic.id ? "border-[#3b82f6]" : "border-[var(--treia-card-border)] hover:border-[var(--treia-sub)]"
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {online
                        ? <Wifi size={13} className="text-[#10b981]" />
                        : <WifiOff size={13} className="text-[#555]" />}
                      <span className="font-mono text-sm text-[var(--treia-text)]">{lic.accountId}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${TIER_COLORS[lic.tier] || ""}`}>{lic.tier}</span>
                  </div>
                  <div className="text-[var(--treia-sub)] text-xs mb-2">{lic.name}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[#555] text-xs">잔고</div>
                      <div className="text-white text-sm font-mono">{lic.balance ? `$${lic.balance.toFixed(0)}` : "-"}</div>
                    </div>
                    <div>
                      <div className="text-[#555] text-xs">수익</div>
                      <div className={`text-sm font-mono ${profit >= 0 ? "text-[#10b981]" : "text-[#e05252]"}`}>
                        {lic.profit !== undefined ? `${profit >= 0 ? "+" : ""}$${profit.toFixed(2)}` : "-"}
                      </div>
                    </div>
                  </div>
                  {lic.lastUpdate && (
                    <div className="text-[#444] text-xs mt-2">{fmtTime(lic.lastUpdate)}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 오른쪽: 상세 */}
          <div className="lg:col-span-2">
            {!selected ? (
              <div className="bg-[var(--treia-card)] border border-[var(--treia-card-border)] rounded-2xl p-10 text-center text-[var(--treia-sub)]">
                왼쪽에서 계좌를 선택하면 상세 정보가 표시됩니다.
              </div>
            ) : (
              <div className="space-y-4">
                {/* 계좌 요약 */}
                <div className="bg-[var(--treia-card)] border border-[var(--treia-card-border)] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[var(--treia-text)] font-medium text-lg">{selected.name}</h3>
                      <p className="font-mono text-[#10b981] text-sm">{selected.accountId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOnline(selected)
                        ? <span className="flex items-center gap-1.5 text-[#10b981] text-xs"><Wifi size={13} /> Online</span>
                        : <span className="flex items-center gap-1.5 text-[#555] text-xs"><WifiOff size={13} /> Offline</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "잔고", value: selected.balance !== undefined ? `$${selected.balance.toFixed(2)}` : "-", color: "text-white" },
                      { label: "평가금", value: selected.equity !== undefined ? `$${selected.equity.toFixed(2)}` : "-", color: "text-white" },
                      { label: "미실현 수익", value: selected.profit !== undefined ? `${selected.profit >= 0 ? "+" : ""}$${selected.profit.toFixed(2)}` : "-", color: (selected.profit ?? 0) >= 0 ? "text-[#10b981]" : "text-[#e05252]" },
                      { label: "Max Lot", value: String(selected.maxLot), color: "text-[#c8a84b]" },
                    ].map(item => (
                      <div key={item.label} className="bg-[var(--treia-bg)] border border-[var(--treia-card-border)] rounded-lg p-3">
                        <div className="text-[var(--treia-sub)] text-xs mb-1">{item.label}</div>
                        <div className={`font-mono text-sm font-bold ${item.color.includes('white') ? 'text-[var(--treia-text)]' : item.color}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[var(--treia-sub)] text-xs mt-3">
                    마지막 업데이트: {fmtTime(selected.lastUpdate || "")} · 만료일: {selected.expireDate}
                  </div>
                </div>

                {/* 타임프레임별 전략 수익 */}
                {getStrategies(selected).length > 0 && (
                  <div className="bg-[var(--treia-card)] border border-[var(--treia-card-border)] rounded-2xl p-6 shadow-sm">
                    <h4 className="text-[#777] text-xs uppercase tracking-widest font-mono mb-4">전략별 수익 (Magic × TF)</h4>
                    <div className="space-y-2">
                      {getStrategies(selected).map((s: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-[var(--treia-bg)] border border-[var(--treia-card-border)] rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-[#c8a84b] bg-[#c8a84b]/10 px-2 py-0.5 rounded">
                              {s.timeframe}
                            </span>
                            <span className="text-[var(--treia-sub)] text-xs font-mono">Magic #{s.magicNumber}</span>
                          </div>
                          <div className={`font-mono text-sm font-bold ${(s.strategyProfit ?? 0) >= 0 ? "text-[#10b981]" : "text-[#e05252]"}`}>
                            {(s.strategyProfit ?? 0) >= 0 ? "+" : ""}${(s.strategyProfit ?? 0).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 히스토리 (최근 10개) */}
                {selected.history && selected.history.length > 0 && (
                  <div className="bg-[var(--treia-card)] border border-[var(--treia-card-border)] rounded-2xl p-6 shadow-sm">
                    <h4 className="text-[#777] text-xs uppercase tracking-widest font-mono mb-4">업데이트 히스토리 (최근 10회)</h4>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {[...selected.history].reverse().slice(0, 10).map((h: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-[var(--treia-section-border)]">
                          <span className="text-[var(--treia-sub)] font-mono">{fmtTime(h.ts || h.updatedAt || "")}</span>
                          <span className="text-[var(--treia-text)] font-mono">${(h.balance ?? 0).toFixed(2)}</span>
                          <span className={`font-mono ${(h.profit ?? 0) >= 0 ? "text-[#10b981]" : "text-[#e05252]"}`}>
                            {(h.profit ?? 0) >= 0 ? "+" : ""}${(h.profit ?? 0).toFixed(2)}
                          </span>
                          <span className="text-[#c8a84b] font-mono">{h.timeframe || "-"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
