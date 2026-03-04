'use client'
import { useEffect, useState } from "react";
import { Bot, BarChart3, LayoutDashboard, ChevronRight, Target, Users, Globe } from "lucide-react";
import Link from "next/link";
import TradingViewChart from "@/components/TradingViewChart";
import EducationalPerspectiveCard from "@/components/EducationalPerspectiveCard";
import VolumeProfileBox from "@/components/VolumeProfileBox";
import EconomicCalendar from "@/components/EconomicCalendar";
import TelegramSignals from "@/components/TelegramSignals";

interface CuratedNews {
  id: number;
  headline: string;
  summary: string;
  url: string;
}
export default function Home() {
  const [marketNews, setMarketNews] = useState<CuratedNews[]>([]);

  useEffect(() => {
    fetch('/api/news/gold')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setMarketNews(res.data);
        }
      })
      .catch(console.error);
  }, []);

  // Today's Chart Levels based on actual MT5 History
  const marketLevels = [
    { price: 5377.1, label: "Day High (Resistance)", type: 'major' as const },
    { price: 5373.1, label: "Session POC", type: 'major' as const },
    { price: 5363.6, label: "Volume Node", type: 'minor' as const },
    { price: 5352.6, label: "Early Support", type: 'minor' as const },
    { price: 5341.1, label: "Liquidity Sweep", type: 'major' as const },
  ];

  const scenarios = [
    { title: "상방 브레이크아웃 시나리오", desc: "$5,377 저항선 돌파 시, 강한 숏스퀴즈와 함께 새로운 상승 채널을 형성할 확률이 높습니다.", color: "bg-cyan-400" },
    { title: "하단 유동성 흡수 시나리오", desc: "$5,360 이탈 시, 기관은 $5,341 부근의 손절 물량을 흡수한 뒤 반등을 시도할 수 있습니다.", color: "bg-amber-500" },
  ];

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col gap-12 max-w-7xl">


      {/* Top Dashboards: Telegram & Calendar */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-stretch">
         <TelegramSignals />
         <EconomicCalendar />
      </section>


      {/* Today's Chart (M3) & Setup */}
      <section className="flex flex-col gap-6 w-full mt-4">
         <div className="flex items-center gap-3 mb-2">
            <Target className="text-[var(--accent-gold)]" size={24} />
            <h2 className="text-2xl font-bold text-white tracking-tight">오늘의 차트 (M3 데이트레이딩)</h2>
         </div>
         
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
            <div className="xl:col-span-2 w-full h-[580px] rounded-3xl bg-[#0F1115] border border-gray-800 overflow-hidden relative group shadow-2xl">
               <TradingViewChart levels={marketLevels} interval="3" />
            </div>
            <div className="xl:col-span-1 h-[580px] flex flex-col gap-6 text-left">
               <div className="flex-1 overflow-hidden">
                  <VolumeProfileBox />
               </div>
               <div className="flex-1 overflow-hidden">
                  <EducationalPerspectiveCard 
                     levels={marketLevels}
                     scenarios={scenarios}
                     analysis="분석 데이터에 기반한 핵심 지지/저항 레벨입니다. 3분봉(M3) 기준 매물대가 집중된 $5,373 및 $5,352 구간에서의 프라이스 액션(Price Action)이 오늘 데이트레이딩의 핵심입니다."
                  />
               </div>
            </div>
         </div>
      </section>

      {/* Global Trading News */}
      <section className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 flex flex-col gap-6">
         <div className="flex items-center gap-3 mb-2">
            <Globe className="text-blue-400" size={20} />
            <h2 className="text-xl font-bold text-white tracking-tight">글로벌 실시간 외환/골드 뉴스</h2>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {marketNews.length > 0 ? marketNews.map((news) => (
              <a key={news.id} href={news.url} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl border border-gray-800 hover:border-blue-500/30 bg-[#1A1D24] transition-all group flex flex-col gap-2">
                 <h4 className="text-sm font-bold text-gray-200 group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">{news.headline}</h4>
                 <span className="text-[12px] text-gray-500 font-medium leading-relaxed">{news.summary}</span>
              </a>
            )) : (
              <div className="col-span-1 lg:col-span-2 p-4 text-center text-gray-500 text-sm">실시간 뉴스를 번역 및 큐레이션 중입니다... (10~20초 소요)</div>
            )}
         </div>
      </section>

      {/* AI Trading Journal Banner */}
      <section className="w-full">
         <div className="bg-gradient-to-r from-[#1A1D24] to-[#0F1115] border border-amber-500/30 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col gap-4 relative z-10 w-full md:w-2/3">
               <h2 className="text-3xl lg:text-4xl font-black text-white italic uppercase flex items-center gap-4 tracking-tighter">
                  <span className="text-amber-500 bg-amber-500/10 p-3 rounded-xl">
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8V6a2 2 0 0 1 2-2h2"/><path d="M4 16v2a2 2 0 0 0 2 2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M16 20h2a2 2 0 0 0 2-2v-2"/><path d="M12 11v8l3-3m-6 0l3 3"/></svg>
                  </span>
                  AI Trade Journal
               </h2>
               <p className="text-gray-400 font-medium leading-relaxed mt-2 text-sm lg:text-base">
                  방금 끝낸 트레이딩, 길게 적을 필요 없습니다. MT4/MT5 피씨나 모바일 내역 화면을 스크린샷 캡처한 후 <span className="text-amber-500 font-bold bg-amber-500/10 px-1 rounded">Ctrl+V</span>로 붙여넣어 보세요.<br className="hidden md:block" /> AI가 브로커 시간을 한국 시간으로 완벽히 변환하고 상세한 매매 통계표를 1초 만에 완성해 줍니다.
               </p>
            </div>
            <div className="relative z-10 w-full md:w-auto">
               <Link href="/journal" className="inline-flex w-full md:w-auto items-center justify-center px-8 py-5 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-amber-500 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,191,0,0.4)]">
                  매매일지 자동 생성하기
               </Link>
            </div>
         </div>
      </section>

      {/* Main Service Cards (4 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full opacity-80 hover:opacity-100 transition-opacity">
        <ServiceCard 
          href="/curation"
          title="AI 정보 큐레이션"
          desc="실시간 전략과 뉴스를 AI가 한국어로 집약해 드립니다."
          icon={<Bot size={24} />}
          accentColor="rgba(255, 193, 7, 0.4)"
          stat="오늘 15건 분석"
        />
        <ServiceCard 
          href="/analysis"
          title="시장 분석"
          desc="TradingView 및 틱데이터 분석으로 진입 타점을 포착하세요."
          icon={<BarChart3 size={24} />}
          accentColor="rgba(59, 130, 246, 0.4)"
          stat="변동성 경보"
        />
        <ServiceCard 
          href="/ea"
          title="EA 스토어"
          desc="검증된 EA와 프리미엄 인디케이터를 선정해 드립니다."
          icon={<LayoutDashboard size={24} />}
          accentColor="rgba(168, 85, 247, 0.4)"
          stat="신규 2종"
        />
        <ServiceCard 
          href="/community"
          title="트레이더 광장"
          desc="CFD 트레이더들과 전략을 공유하고 집단 지성을 경험하세요."
          icon={<Users size={24} />}
          accentColor="rgba(34, 197, 94, 0.4)"
          stat="42명 접속"
        />
      </div>
    </div>
  );
}

function ServiceCard({ href, title, desc, icon, accentColor, stat }: { href: string; title: string; desc: string; icon: React.ReactNode; accentColor: string; stat: string }) {
  return (
    <Link href={href} className="group relative bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 overflow-hidden hover:border-amber-500/20 transition-all hover:-translate-y-1">
       {/* Background Glow */}
       <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-all pointer-events-none" style={{ backgroundColor: accentColor }}></div>
       
       <div className="w-12 h-12 rounded-2xl bg-[#2D3340] flex items-center justify-center text-gray-400 mb-6 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-all">
          {icon}
       </div>
       
       <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-500 transition-colors tracking-tight">{title}</h3>
       <p className="text-sm text-gray-500 leading-relaxed font-medium mb-6">{desc}</p>
       
       <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500/80 uppercase tracking-tighter">
          {stat} <ChevronRight size={14} />
       </div>
    </Link>
  );
}




