'use client'
import { useState } from "react";
import { Bot, ShieldCheck, Download, Monitor, Filter, Star, Info, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

interface EADevice {
  id: string;
  name: string;
  category: string;
  returns: string;
  drawdown: string;
  isFree: boolean;
  description: string;
  tags: string[];
  stars: number;
  author: string;
}

const EA_DATA: EADevice[] = [
  {
    id: "1",
    name: "Quantum Valkyrie (XAUUSD)",
    category: "돌파매매",
    returns: "+1,240% (Tracked)",
    drawdown: "14.2%",
    isFree: false,
    description: "MQL5 프리미엄 등급. 마틴게일과 그리드를 철저히 배제하고 순수 가격 액션(Price Action)과 뉴스 필터로 골드의 변동성을 공략합니다.",
    tags: ["No-Martingale", "Gold", "Premium"],
    stars: 5.0,
    author: "ValeryTrading"
  },
  {
    id: "2",
    name: "ORB Revolution (NASDAQ)",
    category: "추세추종",
    returns: "+320% (1Y)",
    drawdown: "11.5%",
    isFree: false,
    description: "나스닥 시가 돌파(Opening Range Breakout) 전략의 정점. 5분/15분 본장 시작 직후의 강력한 모멘텀을 자동으로 포착합니다.",
    tags: ["Nasdaq", "Breakout", "Intraday"],
    stars: 4.8,
    author: "QuantPro"
  },
  {
    id: "3",
    name: "Satoshium AI (Bitcoin)",
    category: "돌파매매",
    returns: "+580% (2Y)",
    drawdown: "19.8%",
    isFree: false,
    description: "강화학습(Reinforcement Learning) 기반의 비트코인 전용 EA. SMC(Smart Money Concepts) 유동성 분석 로직이 탑재되어 있습니다.",
    tags: ["BTC", "AI", "SMC"],
    stars: 4.9,
    author: "AlphaAlgo"
  },
  {
    id: "4",
    name: "Scalping Sniper Indicator",
    category: "인디케이터",
    returns: "N/A",
    drawdown: "N/A",
    isFree: true,
    description: "RSI와 ATR 변동성을 결합하여 골드와 나스닥의 단기 타점을 화살표로 제공합니다. 수동 트레이더들의 진입 근거로 활용도가 높습니다.",
    tags: ["Scalping", "Free", "Indicator"],
    stars: 4.5,
    author: "TradingFlow"
  }
];

export default function EAPage() {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filteredEAs = activeCategory === "전체" 
    ? EA_DATA 
    : EA_DATA.filter(ea => ea.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-12 max-w-7xl">
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
               <Bot size={20} />
             </div>
             <h1 className="text-3xl font-outfit font-extrabold text-white tracking-tight italic uppercase">EA 프리미엄 스토어</h1>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl">
             <Filter size={14} className="text-gray-500" />
             <div className="flex gap-2">
                {["전체", "추세추종", "돌파매매", "그리드", "인디케이터"].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md transition-all ${activeCategory === cat ? 'bg-amber-500 text-black' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
        </div>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed font-medium">
           엄격한 백테스트와 실거래 인증을 통과한 선별된 EA와 트레이딩 도구를 만나보세요. <br />
           모든 도구는 한국어 매뉴얼과 AI의 성능 분석 요약본을 함께 제공합니다.
        </p>
      </header>

      {/* Main Grid: EA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEAs.map(ea => (
          <EACard key={ea.id} {...ea} />
        ))}
      </div>

      {/* EA Builder Banner */}
      <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-amber-600 to-amber-400 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 group shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-all cursor-pointer" onClick={() => window.location.href = '/ea/builder'}>
         <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/20 blur-[120px] rounded-full pointer-events-none group-hover:bg-white/30 transition-all"></div>
         <div className="z-10 flex flex-col gap-4 text-black max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black font-outfit tracking-tight uppercase leading-none">
               Build Your Own EA
            </h2>
            <p className="text-sm md:text-base font-bold opacity-80 leading-relaxed">
               코딩을 몰라도 괜찮습니다. TREIA의 노코드 EA 제작 도구를 사용해 나만의 트레이딩 전략(지표, 캔들패턴, 지지/저항 등)을 자동화된 봇으로 만들어보세요.
            </p>
         </div>
         <div className="z-10">
            <Link href="/ea/builder" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-900 hover:scale-105 transition-all w-full md:w-auto justify-center">
               제작 도구 열기 <Zap size={18} className="text-amber-500" />
            </Link>
         </div>
      </div>

      {/* Verification & Guide Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-7 p-10 rounded-[40px] bg-gradient-to-br from-[#1E222D] to-[#12141A] border border-gray-800/50 flex flex-col gap-8 relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none"></div>
            
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <ShieldCheck size={28} />
               </div>
               <div className="flex flex-col">
                  <h4 className="font-outfit font-black text-2xl text-white tracking-tight uppercase">TREIA 검증 시스템</h4>
                  <p className="text-[10px] text-gray-500 font-bold tracking-[.2em] uppercase italic">Verified by AI Analysis</p>
               </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed font-medium">
               수익률 조작으로 가득한 마켓에서, 트레이아는 실제 MyFxBook 실거래 인증이 완료된 자료만을 게재합니다. 
               우리는 단순히 수익률만 보지 않습니다. 낙폭(DD), 이익 보존율, 그리고 마틴게일 여부를 가려냅니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
               <VerifBadge icon={<Zap size={14} />} title="REAL ACCOUNT" desc="실거래 인증 완료" />
               <VerifBadge icon={<Zap size={14} />} title="3Y DATA" desc="3년 이상 백테스트" />
               <VerifBadge icon={<Zap size={14} />} title="NO MARTINGALE" desc="안전한 매매 로직" />
            </div>
         </div>

         <div className="lg:col-span-5 p-10 rounded-[40px] bg-[#14161B] border border-gray-800 flex flex-col gap-8">
            <div className="flex items-center gap-3">
               <Monitor size={20} className="text-gray-400" />
               <h4 className="font-outfit font-black text-xl text-white uppercase tracking-tight">퀵 스타트 가이드</h4>
            </div>
            
            <div className="flex flex-col gap-6">
               <StepItem num="01" title="MT5 터미널 설치" desc="메타트레이더 5 설치 및 계좌 연결" />
               <StepItem num="02" title="파일 경로 설정" desc="MQL5/Experts 폴더 내 파일 복사" />
               <StepItem num="03" title="AI 최적화 세팅" desc="트레이아 제공 셋파일 로드 및 활성화" />
            </div>

            <button className="mt-4 w-full py-5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl flex items-center justify-center gap-2">
               초보자 마스터 가이드 (PDF) <Download size={16} />
            </button>
         </div>
      </div>
    </div>
  );
}

function EACard(ea: EADevice) {
  return (
    <div className="group relative bg-[#181B21] border border-[#2D3340] rounded-[32px] p-6 overflow-hidden hover:border-amber-500/20 transition-all hover:-translate-y-1">
       {/* Top Meta */}
       <div className="flex items-center justify-between mb-6">
          <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest bg-gray-900/50 px-2 py-1 rounded">{ea.category}</span>
          <div className="flex items-center gap-1">
             <Star size={10} className="text-amber-500 fill-amber-500" />
             <span className="text-[10px] font-black text-white">{ea.stars}</span>
          </div>
       </div>

       {/* Title & Desc */}
       <div className="flex flex-col gap-3 mb-6">
          <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors leading-tight line-clamp-1">{ea.name}</h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-medium">{ea.description}</p>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-2 gap-4 border-y border-gray-800/50 py-5 mb-6">
          <div className="flex flex-col gap-1">
             <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">수익률</span>
             <span className="text-sm font-outfit font-black text-green-500 tracking-tighter">{ea.returns}</span>
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">DD</span>
             <span className="text-sm font-outfit font-black text-red-500/80 tracking-tighter">{ea.drawdown}</span>
          </div>
       </div>

       {/* Bottom Actions */}
       <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">PUBLISHED BY</span>
             <span className="text-[10px] font-bold text-gray-400">{ea.author}</span>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${ea.isFree ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
             {ea.isFree ? 'Get Free' : 'Premium'}
          </div>
       </div>

       {/* Hover Overlay */}
       <div className="absolute inset-0 bg-[#0F1115]/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-8 text-center gap-4">
          <Info size={32} className="text-amber-500 opacity-50 mb-2" />
          <p className="text-xs text-gray-300 font-medium leading-relaxed">
             상세 실적 차트와 사용자 리뷰를 확인하고 <br /> 즉시 다운로드하세요.
          </p>
          <button className="w-full py-4 bg-amber-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">
             View Details <ChevronRight size={14} className="inline ml-1" />
          </button>
       </div>
    </div>
  );
}

function VerifBadge({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-1">
       <div className="flex items-center gap-2 text-amber-500">
          {icon} <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
       </div>
       <p className="text-[11px] text-gray-500 font-medium">{desc}</p>
    </div>
  );
}

function StepItem({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
       <span className="text-2xl font-outfit font-black text-gray-800 leading-none">{num}</span>
       <div className="flex flex-col gap-1">
          <h5 className="text-sm font-bold text-gray-200">{title}</h5>
          <p className="text-[11px] text-gray-600 leading-relaxed font-medium">{desc}</p>
       </div>
    </div>
  );
}
