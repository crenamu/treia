'use client'
import { useEffect, useState } from "react";
import { Bot, BarChart3, LayoutDashboard, ChevronRight, Zap, Target, Users, MessageSquare, Flame, Globe } from "lucide-react";
import Link from "next/link";
import TradingViewChart from "@/components/TradingViewChart";
import EducationalPerspectiveCard from "@/components/EducationalPerspectiveCard";
import EconomicCalendar from "@/components/EconomicCalendar";

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
      {/* Hero Section: AI Trading Intelligence Concept */}
      <section className="relative overflow-hidden pt-8 pb-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-amber-500/10 to-transparent blur-[120px] pointer-events-none"></div>
        
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl md:text-6xl font-outfit font-black text-white tracking-tighter leading-[1.1] uppercase italic">
              AI-Driven <br />
              <span className="text-[var(--accent-gold)] gold-glow">CFD Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] font-bold max-w-2xl leading-relaxed mt-2">
              감정이 배제된 수치와 틱데이터 분석의 만남. <br />
              전 세계 CFD 트레이더를 위한 가장 날카로운 트레이딩 정보공유 커뮤니티, Treia.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-2">
             <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-green-500/5 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Global Liquidity: High</span>
             </div>
             <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/20">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Market Phase: Volatile Expension</span>
             </div>
          </div>
        </div>
      </section>

      {/* Main Service Cards (4 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ServiceCard 
          href="/curation"
          title="AI 정보 큐레이션"
          desc="MQL5, Forex Factory의 실시간 전략과 뉴스를 AI가 한국어로 집약해 드립니다."
          icon={<Bot size={24} />}
          accentColor="rgba(255, 193, 7, 0.4)"
          stat="오늘 15건 실시간 분석"
        />
        <ServiceCard 
          href="/analysis"
          title="시장 분석"
          desc="TradingView 차트와 AI 틱데이터 분석으로 최상의 진입 타점을 포착하세요."
          icon={<BarChart3 size={24} />}
          accentColor="rgba(59, 130, 246, 0.4)"
          stat="골드 변동성 경보"
        />
        <ServiceCard 
          href="/ea"
          title="EA 스토어"
          desc="승률 70% 이상의 검증된 EA와 프리미엄 인디케이터를 선정해 드립니다."
          icon={<LayoutDashboard size={24} />}
          accentColor="rgba(168, 85, 247, 0.4)"
          stat="신규 EA 2종 등록"
        />
        <ServiceCard 
          href="/community"
          title="트레이더 광장"
          desc="전 세계 CFD 트레이더들과 전략을 공유하고 집단 지성을 경험하세요."
          icon={<Users size={24} />}
          accentColor="rgba(34, 197, 94, 0.4)"
          stat="현재 42명 접속 중"
        />
      </div>

      {/* Today's Chart (M2) & Setup */}
      <section className="flex flex-col gap-6">
         <div className="flex items-center gap-3 mb-2">
            <Target className="text-[var(--accent-gold)]" size={24} />
            <h2 className="text-2xl font-bold text-white tracking-tight">오늘의 차트 (M2 데이트레이딩)</h2>
         </div>
         
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 w-full aspect-video rounded-3xl bg-[#0F1115] border border-gray-800 overflow-hidden relative group shadow-2xl">
               <TradingViewChart levels={marketLevels} interval="2" />
            </div>
            <div className="xl:col-span-1 h-full min-h-[400px] flex flex-col justify-center text-left">
               <EducationalPerspectiveCard 
                  levels={marketLevels}
                  scenarios={scenarios}
                  analysis="분석 데이터에 기반한 핵심 지지/저항 레벨입니다. 2분봉(M2) 기준 매물대가 집중된 $5,373 및 $5,352 구간에서의 프라이스 액션(Price Action)이 오늘 데이트레이딩의 핵심입니다."
               />
            </div>
         </div>
      </section>

      {/* Community & Market Stats */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Flame className="text-orange-500" size={20} />
                  <h2 className="text-xl font-bold text-white tracking-tight">커뮤니티 실시간 핫 토픽</h2>
               </div>
               <Link href="/community" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-all">JOIN DISCUSSION</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <TopicCard 
                 title="XAU/USD 오늘 저녁 NFP 하방 이탈 가능성?" 
                 author="GoldSniper" 
                 replies={24} 
                 source="Forex Factory"
               />
               <TopicCard 
                 title="나스닥 전용 FVG 자동매매 로직 배포 (MT5)" 
                 author="DevQuant" 
                 replies={56} 
                 source="MQL5"
               />
               <TopicCard 
                 title="프랍 펌 도전하시는 분들 리스크 관리 질문" 
                 author="PropTrader_K" 
                 replies={12} 
                 source="Treia"
               />
               <TopicCard 
                 title="유럽 세션 시작 전 골드 횡보 구간 진입" 
                 author="SessionMaster" 
                 replies={8} 
                 source="Forex Factory"
               />
            </div>
         </div>

         <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-8 flex flex-col gap-6 justify-center text-center">
            <MessageSquare size={48} className="mx-auto text-blue-400 opacity-50 mb-2" />
            <h3 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">CFD 정보공유 중심지</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              복잡한 EA 설정부터 전략 테스트까지,<br />전문 트레이더와 AI가 실시간으로 답변해 드립니다.
            </p>
            <button className="mt-4 w-full py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl">
               질문 던지기
            </button>
         </div>
      </section>

      {/* Content Bottom Grid: Market Highlight & AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Economic Calendar Highlight */}
         <section className="lg:col-span-7 flex flex-col gap-6">
            <EconomicCalendar />

            {/* Global Trading News */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 flex flex-col gap-6">
               <div className="flex items-center gap-3 mb-2">
                  <Globe className="text-blue-400" size={20} />
                  <h2 className="text-xl font-bold text-white tracking-tight">글로벌 실시간 외환/골드 뉴스</h2>
               </div>
               <div className="flex flex-col gap-4">
                  {marketNews.length > 0 ? marketNews.map((news) => (
                    <a key={news.id} href={news.url} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl border border-gray-800 hover:border-blue-500/30 bg-[#1A1D24] transition-all group flex items-start gap-4">
                       <div className="flex-1 flex flex-col gap-2">
                          <h4 className="text-sm font-bold text-gray-200 group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">{news.headline}</h4>
                          <span className="text-[12px] text-gray-500 font-medium leading-relaxed">{news.summary}</span>
                       </div>
                    </a>
                  )) : (
                    <div className="p-4 text-center text-gray-500 text-sm">실시간 뉴스를 번역 및 큐레이션 중입니다... (10~20초 소요)</div>
                  )}
               </div>
            </div>
         </section>

         {/* AI Summary Section Section */}
         <section className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 flex flex-col gap-8 h-full">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Zap className="text-blue-400" size={20} />
                     <h2 className="text-xl font-bold text-white tracking-tight">최신 AI 요약 (NEW)</h2>
                  </div>
                  <Link href="/curation" className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300">SEE ALL</Link>
               </div>

               <div className="flex flex-col gap-6">
                  <SummaryItem 
                     source="MQL5 Articles"
                     time="2시간 전"
                     title="머신러닝을 활용한 그리드 매매 시스템 최적화"
                     category="실전전략"
                  />
                  <SummaryItem 
                     source="Forex Factory"
                     time="5시간 전"
                     title="골드 주봉 차트에서의 하락 다이버전스 포착"
                     category="기술적분석"
                  />
               </div>

               <div className="mt-auto p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-2">
                  <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase italic">AI TIP</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                     &quot;오늘 저녁 NFP 발표 전까지는 횡보세가 예상되므로, 큰 포지션 진입보다는 관망을 추천합니다.&quot;
                  </p>
               </div>
            </div>
         </section>
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

function TopicCard({ title, author, replies, source }: { title: string; author: string; replies: number; source: string }) {
  return (
    <div className="p-4 rounded-2xl bg-[#14161B] border border-gray-800 hover:border-gray-700 transition-all cursor-pointer group">
       <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-2 block">{source}</span>
       <h4 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors mb-4 line-clamp-1">{title}</h4>
       <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
          <span className="flex items-center gap-1"><Users size={10} /> {author}</span>
          <span className="flex items-center gap-1"><MessageSquare size={10} /> {replies}</span>
       </div>
    </div>
  );
}


interface SummaryItemProps {
  source: string;
  time: string;
  title: string;
  category: string;
}

function SummaryItem({ source, time, title, category }: SummaryItemProps) {
  return (
    <article className="p-5 rounded-2xl border border-gray-800 hover:border-amber-500/30 bg-[#22262E]/50 group cursor-pointer transition-all">
       <div className="flex items-center justify-between mb-3">
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest">{source}</span>
          <span className="text-[10px] text-gray-600 font-bold uppercase">{time}</span>
       </div>
       <h3 className="text-sm font-bold text-gray-200 group-hover:text-amber-500 transition-colors leading-snug mb-3">
          [AI 요약] {title}
       </h3>
       <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-gray-800 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">#{category}</span>
          <span className="px-2 py-0.5 rounded-md bg-gray-800 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">#GOLD</span>
       </div>
    </article>
  );
}
