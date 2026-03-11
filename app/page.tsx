'use client'
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import Link from "next/link";
import TradingViewChart from "@/components/TradingViewChart";
import EconomicCalendar from "@/components/EconomicCalendar";
import TelegramSignals from "@/components/TelegramSignals";
import ArticleCard from '@/components/ArticleCard';
import InsightCarousel from "@/components/InsightCarousel";



interface InsightArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  thumbnail?: string;
  createdAt: { seconds: number };
  difficulty?: "입문" | "중급" | "고급";
  source?: string;
}

export default function Home() {
  const [insightArticles, setInsightArticles] = useState<InsightArticle[]>([]);

  useEffect(() => {
    // 교육 인사이트 로드
    fetch('/api/education')
      .then(res => res.json())
      .then((data: InsightArticle[]) => {
        if (Array.isArray(data)) setInsightArticles(data);
      })
      .catch(console.error);

    // Scroll reveal logic
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('opacity-100', 'translate-y-0'), i * 80);
          entry.target.classList.remove('opacity-0', 'translate-y-6');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const marketLevels = [
    { price: 5377.1, label: "Day High (Resistance)", type: 'major' as const },
    { price: 5373.1, label: "Session POC", type: 'major' as const },
    { price: 5363.6, label: "Volume Node", type: 'minor' as const },
    { price: 5352.6, label: "Early Support", type: 'minor' as const },
    { price: 5341.1, label: "Liquidity Sweep", type: 'major' as const },
  ];

  return (
    <div className="w-full bg-[#09090b] text-[#eeeae0] font-sans break-keep overflow-x-hidden selection:bg-[#c8a84b] selection:text-black">
      {/* ═══ LANDING ZONE ═══ */}

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center items-start px-6 md:px-12 pt-32 pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 55% 60% at 85% 40%, rgba(200,168,75,0.07) 0%, transparent 65%), radial-gradient(ellipse 35% 40% at 5% 85%, rgba(200,168,75,0.04) 0%, transparent 60%)'
        }}></div>
        <div className="absolute inset-0 pointer-events-none opacity-25" style={{
          backgroundImage: 'linear-gradient(#1e2230 1px, transparent 1px), linear-gradient(90deg, #1e2230 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 0%, transparent 100%)'
        }}></div>

        <div className="w-full max-w-7xl mx-auto flex flex-col items-start relative z-10">
          <div className="font-mono text-[13px] text-[#c8a84b] tracking-[3px] uppercase mb-7 reveal opacity-0 translate-y-6 transition-all duration-700">
            For CFD / GOLD Traders
          </div>
          <h1 className="font-outfit text-5xl md:text-7xl lg:text-[88px] leading-[1.1] tracking-[2px] max-w-[900px] reveal opacity-0 translate-y-6 transition-all duration-700">
            남들은 자는 동안에도<br className="md:hidden" />
            <em className="not-italic text-[#c8a84b]"> 매매가 된다</em>고요?
          </h1>
          <p className="mt-9 text-[18px] text-[#a8adb8] max-w-[500px] leading-[1.8] reveal opacity-0 translate-y-6 transition-all duration-700">
            그게 <strong className="text-white font-medium">EA</strong>입니다.<br />
            한 번 설정해두면 24시간 골드 시장을 자동으로 매매하는 프로그램.<br /><br />
            어떻게 시작하는지, 트레이아가 순서대로 안내합니다.
          </p>
          <div className="flex flex-wrap gap-4 items-center mt-12 reveal opacity-0 translate-y-6 transition-all duration-700">
            <a href="#pain" className="bg-[#c8a84b] hover:bg-[#e8c96a] hover:-translate-y-0.5 text-[#09090b] px-10 py-4 text-[15px] font-bold tracking-[2px] rounded-sm transition-all inline-block">
              EA가 뭔지 알아보기
            </a>
            <a href="#tier" className="text-[#a8adb8] hover:text-white border-b border-[#2a2f40] hover:border-[#7a7f8e] pb-[2px] text-[15px] transition-all">
              바로 시작하기 &rarr;
            </a>
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, #1e2230, transparent)' }}></div>

      {/* BEFORE / AFTER */}
      <section id="ba" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="font-mono text-[13px] text-[#c8a84b] tracking-[3px] uppercase mb-4 reveal opacity-0 translate-y-6 transition-all duration-700">수동 매매 vs 자동 매매</div>
        <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl tracking-[2px] leading-tight reveal opacity-0 translate-y-6 transition-all duration-700">
          하루가<br />달라집니다
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] bg-[#1e2230] border border-[#1e2230] mt-14 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="bg-[#0f1117] p-10 md:p-12 flex flex-col">
            <div className="font-mono text-[12px] tracking-[3px] uppercase mb-8 flex items-center gap-3 text-[#e05252]">
              <div className="w-6 h-px bg-[#e05252]"></div> 수동 매매 — 지금
            </div>
            <div className="flex flex-col gap-5 flex-1">
              <div className="flex items-start gap-4 text-[16px] text-[#a8adb8] leading-[1.6]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#e05252] opacity-60 mt-2 shrink-0"></div>
                <div>매일 아침 차트 켜고 어제 포지션부터 확인</div>
              </div>
              <div className="flex items-start gap-4 text-[16px] text-[#a8adb8] leading-[1.6]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#e05252] opacity-60 mt-2 shrink-0"></div>
                <div>뉴스 체크하고 진입 타이밍 고민하다 놓침</div>
              </div>
              <div className="flex items-start gap-4 text-[16px] text-[#a8adb8] leading-[1.6]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#e05252] opacity-60 mt-2 shrink-0"></div>
                <div>손절 눌러야 하는데 손이 안 가서 버팀</div>
              </div>
              <div className="flex items-start gap-4 text-[16px] text-[#a8adb8] leading-[1.6]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#e05252] opacity-60 mt-2 shrink-0"></div>
                <div>자리 비울 수가 없어 여행도 제대로 못 감</div>
              </div>
              <div className="flex items-start gap-4 text-[16px] text-[#a8adb8] leading-[1.6]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#e05252] opacity-60 mt-2 shrink-0"></div>
                <div>잘 때도 포지션 신경 쓰여 잠을 못 잠</div>
              </div>
            </div>
            <div className="mt-8 pt-7 border-t border-[#1e2230] text-[15px] italic text-[#7a7f8e]">
              감정이 매매를 망칩니다
            </div>
          </div>
          
          <div className="bg-[#0f1117] p-10 md:p-12 flex flex-col">
            <div className="font-mono text-[12px] tracking-[3px] uppercase mb-8 flex items-center gap-3 text-[#34c97a]">
              <div className="w-6 h-px bg-[#34c97a]"></div> EA 자동 매매 — 이후
            </div>
            <div className="flex flex-col gap-5 flex-1">
              <div className="flex items-start gap-4 text-[16px] text-[#a8adb8] leading-[1.6]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34c97a] mt-2 shrink-0"></div>
                <div>기상 후 수익/손실 확인, 그게 전부</div>
              </div>
              <div className="flex items-start gap-4 text-[16px] text-[#a8adb8] leading-[1.6]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34c97a] mt-2 shrink-0"></div>
                <div>진입 조건 충족되면 EA가 알아서 진입</div>
              </div>
              <div className="flex items-start gap-4 text-[16px] text-[#a8adb8] leading-[1.6]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34c97a] mt-2 shrink-0"></div>
                <div>손절·익절 룰대로만, 감정 개입 없음</div>
              </div>
              <div className="flex items-start gap-4 text-[16px] text-[#a8adb8] leading-[1.6]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34c97a] mt-2 shrink-0"></div>
                <div>여행 중에도 VPS가 24시간 돌아감</div>
              </div>
              <div className="flex items-start gap-4 text-[16px] text-[#a8adb8] leading-[1.6]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34c97a] mt-2 shrink-0"></div>
                <div>리스크는 내가 설정한 비중이 전부</div>
              </div>
            </div>
            <div className="mt-8 pt-7 border-t border-[#1e2230] text-[15px] italic text-[#7a7f8e]">
              리스크는 내가 조절합니다
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, #1e2230, transparent)' }}></div>

      {/* PAIN */}
      <section id="pain" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="font-mono text-[13px] text-[#c8a84b] tracking-[3px] uppercase mb-4 reveal opacity-0 translate-y-6 transition-all duration-700">처음이라면 당연한 질문들</div>
        <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl tracking-[2px] leading-tight reveal opacity-0 translate-y-6 transition-all duration-700">
          이 질문들,<br />해본 적 있으세요?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#1e2230] border border-[#1e2230] mt-14 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="bg-[#0f1117] p-10 hover:bg-[#14171f] transition-colors">
            <div className="font-outfit text-6xl text-[#2a2f40] leading-none mb-4">01</div>
            <div className="text-[18px] font-medium text-white mb-3">EA가 뭔지 모르겠어요</div>
            <div className="text-[16px] text-[#7a7f8e] leading-[1.8]">자동매매, EA, 카피트레이딩이 다 다른 건가요? 유튜브마다 말이 달라서 헷갈립니다.</div>
          </div>
          <div className="bg-[#0f1117] p-10 hover:bg-[#14171f] transition-colors">
            <div className="font-outfit text-6xl text-[#2a2f40] leading-none mb-4">02</div>
            <div className="text-[18px] font-medium text-white mb-3">어떤 EA를 믿어야 하나요?</div>
            <div className="text-[16px] text-[#7a7f8e] leading-[1.8]">사기 EA도 많다는데 뭘 보고 판단해야 할지 기준이 없어요. 수익률 그래프만 봐선 모르겠고요.</div>
          </div>
          <div className="bg-[#0f1117] p-10 hover:bg-[#14171f] transition-colors">
            <div className="font-outfit text-6xl text-[#2a2f40] leading-none mb-4">03</div>
            <div className="text-[18px] font-medium text-white mb-3">어디서부터 시작할지 막막해요</div>
            <div className="text-[16px] text-[#7a7f8e] leading-[1.8]">MT5, 브로커, 셋파일, VPS… 용어부터 낯섭니다. 순서를 잡아줄 사람이 없어요.</div>
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, #1e2230, transparent)' }}></div>

      {/* TIER */}
      <section id="tier" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="font-mono text-[13px] text-[#c8a84b] tracking-[3px] uppercase mb-4 reveal opacity-0 translate-y-6 transition-all duration-700">트레이아 카피트레이딩</div>
        <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl tracking-[2px] leading-tight reveal opacity-0 translate-y-6 transition-all duration-700">
          내 상황에 맞는<br />티어를 고르세요
        </h2>
        <p className="mt-5 text-[#7a7f8e] text-[17px] max-w-[560px] leading-[1.9] reveal opacity-0 translate-y-6 transition-all duration-700">
          같은 전략, 같은 타이밍.<br />
          차이는 리스크 비중뿐입니다. 처음이라면 저위험부터.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14 reveal opacity-0 translate-y-6 transition-all duration-700">
          {/* Low Risk */}
          <div className="bg-[#14171f] border border-[#1e2230] hover:border-[#2a2f40] hover:-translate-y-1 transition-all rounded p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#34c97a]"></div>
            <div className="font-mono text-[12px] tracking-[2px] uppercase mb-5 inline-block px-2.5 py-1 rounded-sm text-[#34c97a] bg-[#34c97a]/10">저위험</div>
            <div className="font-outfit text-6xl tracking-[1px] leading-none mb-2 text-[#34c97a]">$1,000</div>
            <div className="text-[14px] text-[#7a7f8e] font-mono mb-7">최소 권장 시드</div>
            <div className="text-[16px] text-[#a8adb8] leading-[1.8] mb-7">EA가 처음인 분들을 위한 입문 티어. 소액으로 구조를 먼저 이해하고, 실제 체결이 어떻게 이뤄지는지 경험합니다.</div>
            <div className="flex flex-col gap-2 pt-5 border-t border-[#1e2230] font-mono text-[14px]">
              <div className="flex justify-between"><span className="text-[#7a7f8e]">리스크 비중</span><span className="text-white">각 TF 1% 이하</span></div>
              <div className="flex justify-between"><span className="text-[#7a7f8e]">타임프레임</span><span className="text-white">M2 ~ M30 전체</span></div>
              <div className="flex justify-between"><span className="text-[#7a7f8e]">적합한 분</span><span className="text-white">EA 첫 입문자</span></div>
            </div>
          </div>
          
          {/* Medium Risk */}
          <div className="bg-[#14171f] border border-[#1e2230] hover:border-[#2a2f40] hover:-translate-y-1 transition-all rounded p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c8a84b]"></div>
            <div className="font-mono text-[12px] tracking-[2px] uppercase mb-5 inline-block px-2.5 py-1 rounded-sm text-[#c8a84b] bg-[#c8a84b]/10">중위험</div>
            <div className="font-outfit text-6xl tracking-[1px] leading-none mb-2 text-[#c8a84b]">$3,000+</div>
            <div className="text-[14px] text-[#7a7f8e] font-mono mb-7">최소 권장 시드</div>
            <div className="text-[16px] text-[#a8adb8] leading-[1.8] mb-7">저위험으로 충분히 검증하고 본격적으로 운용하고 싶은 분. 특정 타임프레임의 비중을 높여 수익 체감을 키웁니다.</div>
            <div className="flex flex-col gap-2 pt-5 border-t border-[#1e2230] font-mono text-[14px]">
              <div className="flex justify-between"><span className="text-[#7a7f8e]">리스크 비중</span><span className="text-white">특정 TF 5%</span></div>
              <div className="flex justify-between"><span className="text-[#7a7f8e]">타임프레임</span><span className="text-white">M2 ~ M30 전체</span></div>
              <div className="flex justify-between"><span className="text-[#7a7f8e]">적합한 분</span><span className="text-white">검증 끝, 본격 시작</span></div>
            </div>
          </div>
          
          {/* High Risk */}
          <div className="bg-[#14171f] border border-[#1e2230] hover:border-[#2a2f40] hover:-translate-y-1 transition-all rounded p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e05252]"></div>
            <div className="font-mono text-[12px] tracking-[2px] uppercase mb-5 inline-block px-2.5 py-1 rounded-sm text-[#e05252] bg-[#e05252]/10">고위험</div>
            <div className="font-outfit text-6xl tracking-[1px] leading-none mb-2 text-[#e05252]">$10,000+</div>
            <div className="text-[14px] text-[#7a7f8e] font-mono mb-7">최소 권장 시드</div>
            <div className="text-[16px] text-[#a8adb8] leading-[1.8] mb-7">시드 여유가 있고 수익 극대화를 원하는 분. 변동성이 크므로 EA 구조를 충분히 이해한 후 진입을 권장합니다.</div>
            <div className="flex flex-col gap-2 pt-5 border-t border-[#1e2230] font-mono text-[14px]">
              <div className="flex justify-between"><span className="text-[#7a7f8e]">리스크 비중</span><span className="text-white">TF별 최대 10%</span></div>
              <div className="flex justify-between"><span className="text-[#7a7f8e]">타임프레임</span><span className="text-white">M2 ~ M30 전체</span></div>
              <div className="flex justify-between"><span className="text-[#7a7f8e]">적합한 분</span><span className="text-white">수익 극대화</span></div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-[14px] text-[#7a7f8e] font-mono reveal opacity-0 translate-y-6 transition-all duration-700">
          ⚠️ 트랙레코드 축적 중 (2026년 4월 실계좌 오픈 예정) — 현재는 모의 프론트테스트 단계입니다
        </p>
      </section>

      {/* FLOW */}
      <section id="guide" className="w-full bg-[#0f1117] border-y border-[#1e2230] py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="font-mono text-[13px] text-[#c8a84b] tracking-[3px] uppercase mb-4 reveal opacity-0 translate-y-6 transition-all duration-700">시작하는 순서</div>
          <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl tracking-[2px] leading-tight reveal opacity-0 translate-y-6 transition-all duration-700">
            몰라도 됩니다,<br />순서대로만 오세요
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 mt-16 relative reveal opacity-0 translate-y-6 transition-all duration-700">
            {/* Desktop Line */}
            <div className="hidden lg:block absolute top-[31px] left-[12%] right-[12%] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #c8a84b, transparent)' }}></div>

            <div className="flex flex-col items-center text-center px-5 group">
              <div className="w-[62px] h-[62px] rounded-full border border-[#c8a84b] bg-[#09090b] flex items-center justify-center font-outfit text-[22px] text-[#c8a84b] mb-6 relative z-10 group-hover:bg-[#c8a84b] group-hover:text-black transition-colors">01</div>
              <div className="text-[16px] font-bold text-white mb-2.5">EA 개념 잡기</div>
              <div className="text-[15px] text-[#7a7f8e] leading-[1.8]">자동매매·카피트레이딩·EA의 차이. 용어가 정리되면 나머지가 쉬워집니다.</div>
            </div>

            <div className="flex flex-col items-center text-center px-5 group">
              <div className="w-[62px] h-[62px] rounded-full border border-[#c8a84b] bg-[#09090b] flex items-center justify-center font-outfit text-[22px] text-[#c8a84b] mb-6 relative z-10 group-hover:bg-[#c8a84b] group-hover:text-black transition-colors">02</div>
              <div className="text-[16px] font-bold text-white mb-2.5">검증된 EA 고르는 법</div>
              <div className="text-[15px] text-[#7a7f8e] leading-[1.8]">마틴게일·그리드 구별법, 트랙레코드 읽는 법, 사기 EA 피하는 기준.</div>
            </div>

            <div className="flex flex-col items-center text-center px-5 group">
              <div className="w-[62px] h-[62px] rounded-full border border-[#c8a84b] bg-[#09090b] flex items-center justify-center font-outfit text-[22px] text-[#c8a84b] mb-6 relative z-10 group-hover:bg-[#c8a84b] group-hover:text-black transition-colors">03</div>
              <div className="text-[16px] font-bold text-white mb-2.5">모의계좌로 먼저</div>
              <div className="text-[15px] text-[#7a7f8e] leading-[1.8]">MT5 설치부터 셋파일 로딩까지. 실계좌 전 반드시 거쳐야 할 단계.</div>
            </div>

            <div className="flex flex-col items-center text-center px-5 group">
              <div className="w-[62px] h-[62px] rounded-full border border-[#c8a84b] bg-[#09090b] flex items-center justify-center font-outfit text-[22px] text-[#c8a84b] mb-6 relative z-10 group-hover:bg-[#c8a84b] group-hover:text-black transition-colors">04</div>
              <div className="text-[16px] font-bold text-white mb-2.5">EA 제작 자립</div>
              <div className="text-[15px] text-[#7a7f8e] leading-[1.8]">남의 EA를 이해하게 되면 내 전략을 코드로 옮기는 단계가 열립니다.</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="font-mono text-[13px] text-[#c8a84b] tracking-[3px] uppercase mb-4 reveal opacity-0 translate-y-6 transition-all duration-700">트레이아의 원칙</div>
        <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl tracking-[2px] leading-tight reveal opacity-0 translate-y-6 transition-all duration-700">
          검증하지 않은 것은<br />올리지 않습니다
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="border border-[#1e2230] bg-[#0f1117] rounded p-9">
            <div className="text-2xl mb-4 text-[#c8a84b]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div className="text-[17px] font-bold text-white mb-2.5">리스크 유형 표기 의무</div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.8]">모든 EA 소개에 마틴게일·그리드 여부를 반드시 명시합니다. 숨기는 정보가 없습니다.</div>
          </div>
          <div className="border border-[#1e2230] bg-[#0f1117] rounded p-9">
            <div className="text-2xl mb-4 text-[#c8a84b]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div className="text-[17px] font-bold text-white mb-2.5">실거래 트랙레코드 기반</div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.8]">백테스트 수치가 아닌 실거래 데이터를 기반으로 소개합니다. 기간과 시드가 명확해야 합니다.</div>
          </div>
          <div className="border border-[#1e2230] bg-[#0f1117] rounded p-9">
            <div className="text-2xl mb-4 text-[#c8a84b]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div className="text-[17px] font-bold text-white mb-2.5">투자 권유 없음</div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.8]">모든 콘텐츠는 교육 목적입니다. 특정 브로커나 EA를 직접 추천하지 않으며, 판단은 본인이 합니다.</div>
          </div>
        </div>
      </section>

      {/* ═══ DASHBOARD ZONE ═══ */}
      <div className="bg-[#0f1117] border-y border-[#1e2230] py-8 px-6 md:px-12 flex items-center gap-5">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-5">
          <div className="flex-1 h-px bg-[#1e2230]"></div>
          <div className="font-mono text-[13px] text-[#7a7f8e] tracking-[3px] uppercase whitespace-nowrap">
            ▼ &nbsp; 실시간 인사이트 & 분석 &nbsp; ▼
          </div>
          <div className="flex-1 h-px bg-[#1e2230]"></div>
        </div>
      </div>

      {/* INSIGHTS */}
      <section id="insights" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col gap-12">
        <h3 className="font-outfit text-3xl tracking-[2px] flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[#34c97a] animate-pulse"></div>
          오늘의 인사이트 & 실시간 데이터
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-stretch reveal opacity-0 translate-y-6 transition-all duration-700">
           {/* Telegram Signals */}
           <div className="w-full">
              <TelegramSignals />
           </div>
           {/* Chart */}
           <div className="w-full h-[580px] rounded-2xl bg-[#0f1117] border border-[#1e2230] overflow-hidden relative shadow-2xl">
              <TradingViewChart levels={marketLevels} interval="3" />
           </div>
        </div>

        {/* 교육 인사이트 카루셀 */}
        <div className="mt-8">
           <div className="flex items-center justify-between mb-6 reveal opacity-0 translate-y-6 transition-all duration-700">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                 최신 브리핑 모아보기
              </h4>
              <Link href="/education" className="text-xs font-bold text-[#7a7f8e] hover:text-[#c8a84b] transition-colors flex items-center gap-1 group">
                 전체 보기 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
           <div className="reveal opacity-0 translate-y-6 transition-all duration-700">
             <InsightCarousel>
                {insightArticles.length > 0 ? (
                  insightArticles.map((article) => (
                    <div key={article.id} className="min-w-[300px] w-[300px] md:min-w-[350px] md:w-[350px] snap-start shrink-0">
                      <Link href={`/education/${article.id}`} className="block h-full">
                        <ArticleCard 
                          title={article.title}
                          category={article.category}
                          summary={article.excerpt}
                          imageUrl={article.thumbnail}
                          date={article.createdAt ? new Date(article.createdAt.seconds * 1000).toLocaleDateString() : ''}
                          source={article.source || "Treia Official"}
                          difficulty={(article.difficulty as "입문" | "중급" | "고급") || "입문"}
                        />
                      </Link>
                    </div>
                  ))
                ) : (
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className="min-w-[300px] w-[300px] md:min-w-[350px] md:w-[350px] shrink-0 bg-[#0f1117]/40 border border-[#1e2230] rounded-3xl h-[400px] animate-pulse"></div>
                  ))
                )}
             </InsightCarousel>
           </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, #1e2230, transparent)' }}></div>

      {/* INDICATORS */}
      <section id="indicators" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 reveal opacity-0 translate-y-6 transition-all duration-700">
        <h3 className="font-outfit text-3xl tracking-[2px] mb-8">핵심 경제지표 캘린더</h3>
        <EconomicCalendar />
      </section>

      <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, #1e2230, transparent)' }}></div>

      {/* EA REVIEW */}
      <section id="ea-review" className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
        <h3 className="font-outfit text-3xl tracking-[2px] mb-8">EA 리뷰</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="bg-[#14171f] border border-[#1e2230] p-7 rounded hover:border-[#2a2f40] hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[17px] font-bold text-white">GoldPulse EA v4.2</div>
                <div className="font-mono text-[13px] text-[#7a7f8e] mt-1">전략유형: 브레이크아웃 · XAUUSD 전용</div>
              </div>
              <span className="font-mono text-[12px] bg-[#34c97a]/10 text-[#34c97a] px-2.5 py-1 rounded-sm tracking-[1px] flex items-center gap-1"><CheckCircle2 size={12}/>통과</span>
            </div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.8] mb-4">H1 매물대 기반 브레이크아웃 전략. 마틴게일·그리드 없음. 고정 랏 방식으로 리스크 예측 가능. 6개월 실거래 트랙레코드 확인.</div>
            <div className="flex gap-5">
              <div className="flex flex-col gap-1"><span className="font-mono text-[12px] text-[#7a7f8e]">MDD</span><span className="text-[16px] font-bold text-[#34c97a]">8.3%</span></div>
              <div className="flex flex-col gap-1"><span className="font-mono text-[12px] text-[#7a7f8e]">수익팩터</span><span className="text-[16px] font-bold text-white">1.84</span></div>
              <div className="flex flex-col gap-1"><span className="font-mono text-[12px] text-[#7a7f8e]">기간</span><span className="text-[16px] font-bold text-white">6개월</span></div>
            </div>
          </div>

          <div className="bg-[#14171f] border border-[#1e2230] p-7 rounded hover:border-[#2a2f40] hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[17px] font-bold text-white">SuperGrid Pro</div>
                <div className="font-mono text-[13px] text-[#7a7f8e] mt-1">전략유형: 그리드 · 멀티심볼</div>
              </div>
              <span className="font-mono text-[12px] bg-[#e05252]/10 text-[#e05252] px-2.5 py-1 rounded-sm tracking-[1px] flex items-center gap-1"><AlertTriangle size={12} />위험</span>
            </div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.8] mb-4">그리드 전략 사용 확인. 추세 역행 시 포지션이 기하급수적으로 늘어나는 구조. 특정 구간에서 대규모 드로다운 이력 존재.</div>
            <div className="flex gap-5">
              <div className="flex flex-col gap-1"><span className="font-mono text-[12px] text-[#7a7f8e]">MDD</span><span className="text-[16px] font-bold text-[#e05252]">67.2%</span></div>
              <div className="flex flex-col gap-1"><span className="font-mono text-[12px] text-[#7a7f8e]">수익팩터</span><span className="text-[16px] font-bold text-white">2.11</span></div>
              <div className="flex flex-col gap-1"><span className="font-mono text-[12px] text-[#7a7f8e]">기간</span><span className="text-[16px] font-bold text-white">14개월</span></div>
            </div>
          </div>
          
          <div className="bg-[#14171f] border border-[#1e2230] p-7 rounded hover:border-[#2a2f40] hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[17px] font-bold text-white">NightScalper X</div>
                <div className="font-mono text-[13px] text-[#7a7f8e] mt-1">전략유형: 야간 스캘핑 · EURUSD</div>
              </div>
              <span className="font-mono text-[12px] bg-[#c8a84b]/10 text-[#c8a84b] px-2.5 py-1 rounded-sm tracking-[1px] flex items-center gap-1">검토중</span>
            </div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.8] mb-4">아시아 세션 저변동성 구간을 활용하는 스캘핑 EA. 마틴게일 미사용 확인. 단, 최근 6개월 스프레드 확대 구간에서 성과 저하 패턴 발견.</div>
            <div className="flex gap-5">
              <div className="flex flex-col gap-1"><span className="font-mono text-[12px] text-[#7a7f8e]">MDD</span><span className="text-[16px] font-bold text-[#c8a84b]">12.7%</span></div>
              <div className="flex flex-col gap-1"><span className="font-mono text-[12px] text-[#7a7f8e]">수익팩터</span><span className="text-[16px] font-bold text-white">1.42</span></div>
              <div className="flex flex-col gap-1"><span className="font-mono text-[12px] text-[#7a7f8e]">기간</span><span className="text-[16px] font-bold text-white">11개월</span></div>
            </div>
          </div>
          
          <div className="bg-[#14171f] border border-[#1e2230] p-7 rounded hover:border-[#2a2f40] hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[17px] font-bold text-white">Martingale King v2</div>
                <div className="font-mono text-[13px] text-[#7a7f8e] mt-1">전략유형: 마틴게일 · XAUUSD</div>
              </div>
              <span className="font-mono text-[12px] bg-[#e05252]/10 text-[#e05252] px-2.5 py-1 rounded-sm tracking-[1px] flex items-center gap-1"><XCircle size={12} />비추천</span>
            </div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.8] mb-4">마틴게일 전략 사용 확인. 손실 시 랏 사이즈 2배 증가 구조. 단기 수익 곡선은 매력적이나 구조적으로 계좌 청산 위험 내포. 입문자 금지.</div>
            <div className="flex gap-5">
              <div className="flex flex-col gap-1"><span className="font-mono text-[12px] text-[#7a7f8e]">MDD</span><span className="text-[16px] font-bold text-[#e05252]">91.4%</span></div>
              <div className="flex flex-col gap-1"><span className="font-mono text-[12px] text-[#7a7f8e]">수익팩터</span><span className="text-[16px] font-bold text-white">3.22</span></div>
              <div className="flex flex-col gap-1"><span className="font-mono text-[12px] text-[#7a7f8e]">기간</span><span className="text-[16px] font-bold text-white">8개월</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-[#0f1117] border-t border-[#1e2230] py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,168,75,0.06) 0%, transparent 70%)' }}></div>
        <div className="relative z-10">
          <h2 className="font-outfit text-5xl md:text-7xl lg:text-[80px] tracking-[2px] mb-6">몰라도 됩니다</h2>
          <p className="text-[18px] text-[#a8adb8] mb-12">EA가 처음이어도 괜찮습니다. 저위험 티어부터 순서대로 따라오면 됩니다.</p>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <a href="#tier" className="bg-[#c8a84b] hover:bg-[#e8c96a] hover:-translate-y-0.5 text-[#09090b] px-10 py-4 text-[15px] font-bold tracking-[2px] rounded-sm transition-all inline-block">
              티어 선택하러 가기
            </a>
            <a href="#guide" className="text-[#a8adb8] hover:text-white border-b border-[#2a2f40] hover:border-[#7a7f8e] pb-[2px] text-[15px] transition-all flex items-center gap-1">
              입문 가이드 보기 &rarr;
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
