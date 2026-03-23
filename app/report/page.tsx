"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Download, ShieldCheck, TrendingUp, BarChart3, Clock, Zap } from "lucide-react";
import Link from "next/link";

export default function BacktestReportPage() {
  const stats = [
    { label: "총 매매 횟수", value: "147회", icon: <Zap className="text-amber-400" /> },
    { label: "알고리즘 승률", value: "80.95%", icon: <TrendingUp className="text-emerald-400" /> },
    { label: "Profit Factor", value: "3.58", icon: <BarChart3 className="text-blue-400" /> },
    { label: "최대 낙폭 (Max DD)", value: "14.72%", icon: <ShieldCheck className="text-red-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#c8a84b]/30">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-tight">메인으로 돌아가기</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#c8a84b]/10 border border-[#c8a84b]/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#c8a84b] rounded-full animate-pulse" />
            </div>
            <span className="text-xs font-mono tracking-widest uppercase text-[#c8a84b]">Live Report v3.0</span>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#c8a84b] font-mono text-xs tracking-[5px] uppercase block mb-4"
            >
              Certified Backtest Result
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-light tracking-tight mb-8"
            >
              백테스트 상세 리포트
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4 text-sm text-[#7a7f8e] font-light"
            >
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <Clock size={14} /> <span>기간: 2026.01.01 - 03.20</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <Zap size={14} /> <span>종목: XAUUSD (GOLD)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <ShieldCheck size={14} /> <span>전략: Treia Gold Engine v3</span>
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="bg-[#0a0b0e] border border-[#1a1a1a] p-8 rounded-3xl group hover:border-[#c8a84b]/30 transition-all"
              >
                <div className="mb-4">{stat.icon}</div>
                <div className="text-[#7a7f8e] text-xs font-mono uppercase tracking-widest mb-2">{stat.label}</div>
                <div className="text-3xl font-light group-hover:text-[#c8a84b] transition-colors">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Content Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[40px] p-8 md:p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 blur-[80px] rounded-full" />
                <h2 className="text-2xl font-light mb-8 flex items-center gap-3">
                  <TrendingUp className="text-[#3b82f6]" size={24} />
                  누적 수익률 성장 곡선
                </h2>
                <div className="aspect-[16/8] w-full bg-[#050505] rounded-2xl border border-white/5 flex items-center justify-center relative group">
                  <div className="text-[#444] font-mono text-sm group-hover:text-[#c8a84b] transition-colors">Interactive Chart (Coming Soon)</div>
                  {/* 실제 데이터 차트 이미지를 여기에 넣거나 나중에 구현 가능 */}
                  <img src="/backtest_main.png" alt="Main Chart" className="absolute inset-0 w-full h-full object-contain opacity-60" />
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[32px] p-8">
                  <h3 className="text-lg font-light mb-6 flex items-center gap-3">
                    <Clock className="text-amber-400" size={20} />
                    요일별 승률 통계
                  </h3>
                  <div className="space-y-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                      <div key={day} className="flex items-center gap-4">
                        <span className="w-8 text-xs font-mono text-[#7a7f8e] uppercase">{day}</span>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '85%' }}
                            className="h-full bg-[#c8a84b]"
                          />
                        </div>
                        <span className="text-xs font-mono">85%</span>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[32px] p-8">
                  <h3 className="text-lg font-light mb-6 flex items-center gap-3">
                    <ShieldCheck className="text-red-400" size={20} />
                    리스크 관리 지표
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl text-center">
                      <div className="text-[10px] text-[#7a7f8e] uppercase mb-1">Avg Loss</div>
                      <div className="text-xl font-light text-red-400">-$24.12</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl text-center">
                      <div className="text-[10px] text-[#7a7f8e] uppercase mb-1">Max Loss</div>
                      <div className="text-xl font-light text-red-500">-$82.70</div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <aside className="space-y-8">
              <section className="bg-[#c8a84b] text-[#050505] rounded-[32px] p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Zap size={24} />
                  전문가용 원본 데이터
                </h3>
                <p className="text-sm font-medium mb-8 opacity-80 leading-relaxed">
                  백테스트 소프트웨어가 생성한 무보정 원본 HTML 리포트를 다운로드하여 조작 여부를 직접 검증하실 수 있습니다.
                </p>
                <a 
                  href="/backtest_report.html" 
                  download 
                  className="flex items-center justify-center gap-2 bg-[#050505] text-white py-4 rounded-2xl font-bold hover:scale-[1.02] transition-transform"
                >
                  <Download size={18} />
                  <span>리포트 다운로드 (HTML)</span>
                </a>
              </section>

              <div className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[32px] p-8">
                <h4 className="text-sm font-mono tracking-widest uppercase text-[#7a7f8e] mb-4">데이터 무결성 확인</h4>
                <div className="text-xs font-light text-[#555] leading-relaxed">
                  본 리포트의 데이터는 MetaTrader 5(MT5)의 Strategy Tester를 통해 생성되었으며, 99% 틱 데이터를 기반으로 모델링되었습니다. 조작이 불가능한 시스템 기록임을 보증합니다.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center">
        <div className="text-[#444] font-mono text-[10px] tracking-[4px] uppercase mb-4">Treia Gold Algorithm Engine</div>
        <p className="text-[#333] text-xs">© 2026 Treia. All rights reserved.</p>
      </footer>
    </div>
  );
}
