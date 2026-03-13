"use client";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import Link from "next/link";
import TradingViewChart from "@/components/TradingViewChart";
import EconomicCalendar from "@/components/EconomicCalendar";
import TelegramSignals from "@/components/TelegramSignals";
import ArticleCard from "@/components/ArticleCard";
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
    fetch("/api/education")
      .then((res) => res.json())
      .then((data: InsightArticle[]) => {
        if (Array.isArray(data)) setInsightArticles(data);
      })
      .catch(console.error);

    // Scroll reveal logic
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(
              () => entry.target.classList.add("opacity-100", "translate-y-0"),
              i * 80,
            );
            entry.target.classList.remove("opacity-0", "translate-y-6");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const marketLevels = [
    { price: 5377.1, label: "Day High (Resistance)", type: "major" as const },
    { price: 5373.1, label: "Session POC", type: "major" as const },
    { price: 5363.6, label: "Volume Node", type: "minor" as const },
    { price: 5352.6, label: "Early Support", type: "minor" as const },
    { price: 5341.1, label: "Liquidity Sweep", type: "major" as const },
  ];

  return (
    <div className="dark-theme w-full bg-[#0a0a0a] text-[#f2f2f2] font-sans break-keep overflow-x-hidden selection:bg-[#10B981] selection:text-[#0a0a0a]">
      {/* ═══ LANDING ZONE ═══ */}

      {/* HERO — 중앙 정렬 미니멀 */}
      <div className="relative min-h-[100svh] flex flex-col justify-center items-center overflow-hidden bg-[#080808]">
        {/* 글로우 배경 */}
        <div className="hero-glow absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(16,185,129,0.12) 0%, transparent 70%)' }}></div>
        {/* 미세 그리드 */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 select-none">
          {/* 상단 레이블 */}
          <div className="hero-label font-mono text-[11px] md:text-[12px] tracking-[5px] uppercase text-[#10B981] mb-10">
            AI-POWERED TRADING INTELLIGENCE
          </div>

          {/* 브랜드 타이틀 */}
          <h1 className="hero-title font-serif text-[clamp(80px,18vw,200px)] font-normal leading-[0.9] tracking-[-0.02em] text-[#f5f0e8]" style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}>
            Treia
          </h1>

          {/* 커서 */}
          <div className="hero-title flex items-center gap-2 mt-6 mb-10">
            <span className="hero-cursor inline-block w-[2px] h-8 bg-[#10B981]"></span>
          </div>

          {/* 하단 서브 레이블 */}
          <div className="hero-sub font-mono text-[11px] md:text-[12px] tracking-[5px] uppercase text-[#a1a1aa]">
            FOR CFD / XAUUSD TRADERS
          </div>

          {/* CTA 버튼 */}
          <div className="hero-cta flex flex-wrap gap-4 justify-center items-center mt-14">
            <a href="#ba" className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3.5 text-[13px] font-medium tracking-[2px] uppercase transition-all inline-flex items-center gap-2 hover:shadow-[0_0_24px_rgba(16,185,129,0.35)]">
              시작하기 <ArrowRight size={14} />
            </a>
            <a href="#pain" className="text-[#a1a1aa] hover:text-white border border-[#27272a] hover:border-[#52525b] px-8 py-3.5 text-[13px] tracking-[2px] uppercase transition-all">
              EA란?
            </a>
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#3f3f46]">scroll</span>
          <div className="w-px h-14 bg-[#3f3f46] overflow-hidden relative">
            <div className="hero-scroll-line absolute inset-0 bg-[#10B981]"></div>
          </div>
        </div>
      </div>

      {/* BEFORE / AFTER */}
      <section
        id="ba"
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-[#1e1e1e]"
      >
        <div className="flex items-center gap-3 font-mono text-[13px] text-white tracking-[2px] uppercase mb-4 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="w-4 h-[2px] bg-[#10B981]"></div> 수동 매매 vs 자동
          매매
        </div>
        <h2 className="font-outfit text-4xl md:text-5xl lg:text-5xl font-medium tracking-tight leading-tight reveal opacity-0 translate-y-6 transition-all duration-700 text-white">
          하루가 달라집니다
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#1e1e1e] border border-[#1e1e1e] mt-12 reveal opacity-0 translate-y-6 transition-all duration-700 rounded-sm overflow-hidden">
          <div className="bg-[#0f0f0f] p-10 md:p-12 flex flex-col hover:bg-[#121212] transition-colors">
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
            <div className="mt-8 pt-7 border-t border-[#1e1e1e] text-[15px] text-[#a1a1aa] font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>{" "}
              리스크는 내가 조절합니다
            </div>
          </div>
        </div>
      </section>

      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #1e2230, transparent)",
        }}
      ></div>

      {/* PAIN */}
      <section
        id="pain"
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24"
      >
        <div className="font-mono text-[13px] text-[#c8a84b] tracking-[3px] uppercase mb-4 reveal opacity-0 translate-y-6 transition-all duration-700">
          처음이라면 당연한 질문들
        </div>
        <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl tracking-[2px] leading-tight reveal opacity-0 translate-y-6 transition-all duration-700">
          이 질문들,
          <br />
          해본 적 있으세요?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#1e2230] border border-[#1e2230] mt-14 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="bg-[#0f1117] p-10 hover:bg-[#14171f] transition-colors">
            <div className="font-outfit text-6xl text-[#2a2f40] leading-none mb-4">
              01
            </div>
            <div className="text-[18px] font-medium text-white mb-3">
              EA가 뭔지 모르겠어요
            </div>
            <div className="text-[16px] text-[#7a7f8e] leading-[1.8]">
              자동매매, EA, 카피트레이딩이 다 다른 건가요? 유튜브마다 말이
              달라서 헷갈립니다.
            </div>
          </div>
          <div className="bg-[#0f1117] p-10 hover:bg-[#14171f] transition-colors">
            <div className="font-outfit text-6xl text-[#2a2f40] leading-none mb-4">
              02
            </div>
            <div className="text-[18px] font-medium text-white mb-3">
              어떤 EA를 믿어야 하나요?
            </div>
            <div className="text-[16px] text-[#7a7f8e] leading-[1.8]">
              사기 EA도 많다는데 뭘 보고 판단해야 할지 기준이 없어요. 수익률
              그래프만 봐선 모르겠고요.
            </div>
          </div>
          <div className="bg-[#0f1117] p-10 hover:bg-[#14171f] transition-colors">
            <div className="font-outfit text-6xl text-[#2a2f40] leading-none mb-4">
              03
            </div>
            <div className="text-[18px] font-medium text-white mb-3">
              어디서부터 시작할지 막막해요
            </div>
            <div className="text-[16px] text-[#7a7f8e] leading-[1.8]">
              MT5, 브로커, 셋파일, VPS… 용어부터 낯섭니다. 순서를 잡아줄 사람이
              없어요.
            </div>
          </div>
        </div>
      </section>

      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #1e2230, transparent)",
        }}
      ></div>

      {/* TIER — 4단계 로드맵 (금액 제거) */}
      <section
        id="tier"
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-[#1e1e1e]"
      >
        <div className="flex items-center gap-3 font-mono text-[13px] text-[#10B981] tracking-[2px] uppercase mb-4 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="w-4 h-[2px] bg-[#10B981]"></div> 트레이아 온보딩 로드맵
        </div>
        <h2 className="font-outfit text-4xl md:text-5xl lg:text-5xl font-medium tracking-tight leading-tight reveal opacity-0 translate-y-6 transition-all duration-700 text-white">
          4단계로 시작합니다
        </h2>
        <p className="mt-5 text-[#7a7f8e] text-[17px] max-w-[560px] leading-[1.9] reveal opacity-0 translate-y-6 transition-all duration-700">
          처음부터 모든 걸 알 필요 없습니다.<br />
          단계대로 따라오면 자연스럽게 운용까지 됩니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-14 reveal opacity-0 translate-y-6 transition-all duration-700">

          {/* STEP 01 */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] hover:border-[#10B981]/40 hover:-translate-y-1 transition-all p-8 md:p-9 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#10B981]"></div>
            <div className="font-mono text-[11px] tracking-[4px] text-[#10B981] uppercase mb-8">STEP 01</div>
            <div className="font-outfit text-[22px] font-medium text-white mb-4 leading-tight">EA 개념 이해</div>
            <div className="text-[15px] text-[#a1a1aa] leading-[1.75] font-light mb-8">
              자동매매·카피·EA가 각각 무엇인지 구분합니다. 용어가 정리되면 나머지가 쉬워집니다.
            </div>
            <div className="flex flex-col gap-2.5 pt-6 border-t border-[#1e1e1e] text-[14px]">
              <div className="flex items-center gap-2 text-[#a1a1aa]"><span className="w-1 h-1 rounded-full bg-[#10B981]"></span>EA vs 카피트레이딩 차이</div>
              <div className="flex items-center gap-2 text-[#a1a1aa]"><span className="w-1 h-1 rounded-full bg-[#10B981]"></span>MT5 구조 이해</div>
              <div className="flex items-center gap-2 text-[#a1a1aa]"><span className="w-1 h-1 rounded-full bg-[#10B981]"></span>브로커·스프레드·레버리지</div>
            </div>
          </div>

          {/* STEP 02 */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] hover:border-[#3b82f6]/40 hover:-translate-y-1 transition-all p-8 md:p-9 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#3b82f6]"></div>
            <div className="font-mono text-[11px] tracking-[4px] text-[#3b82f6] uppercase mb-8">STEP 02</div>
            <div className="font-outfit text-[22px] font-medium text-white mb-4 leading-tight">EA 검증 기준</div>
            <div className="text-[15px] text-[#a1a1aa] leading-[1.75] font-light mb-8">
              마틴게일·그리드·브레이크아웃을 구별하고, 트랙레코드를 읽는 법을 배웁니다.
            </div>
            <div className="flex flex-col gap-2.5 pt-6 border-t border-[#1e1e1e] text-[14px]">
              <div className="flex items-center gap-2 text-[#a1a1aa]"><span className="w-1 h-1 rounded-full bg-[#3b82f6]"></span>전략 유형별 리스크 차이</div>
              <div className="flex items-center gap-2 text-[#a1a1aa]"><span className="w-1 h-1 rounded-full bg-[#3b82f6]"></span>MDD·수익팩터 해석</div>
              <div className="flex items-center gap-2 text-[#a1a1aa]"><span className="w-1 h-1 rounded-full bg-[#3b82f6]"></span>사기 EA 판별 체크리스트</div>
            </div>
          </div>

          {/* STEP 03 */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] hover:border-[#a855f7]/40 hover:-translate-y-1 transition-all p-8 md:p-9 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#a855f7]"></div>
            <div className="font-mono text-[11px] tracking-[4px] text-[#a855f7] uppercase mb-8">STEP 03</div>
            <div className="font-outfit text-[22px] font-medium text-white mb-4 leading-tight">모의계좌 실습</div>
            <div className="text-[15px] text-[#a1a1aa] leading-[1.75] font-light mb-8">
              MT5 설치부터 셋파일 로딩까지. 실계좌 전에 반드시 거쳐야 할 단계입니다.
            </div>
            <div className="flex flex-col gap-2.5 pt-6 border-t border-[#1e1e1e] text-[14px]">
              <div className="flex items-center gap-2 text-[#a1a1aa]"><span className="w-1 h-1 rounded-full bg-[#a855f7]"></span>브로커 계좌 개설</div>
              <div className="flex items-center gap-2 text-[#a1a1aa]"><span className="w-1 h-1 rounded-full bg-[#a855f7]"></span>EA 세팅 & 백테스트</div>
              <div className="flex items-center gap-2 text-[#a1a1aa]"><span className="w-1 h-1 rounded-full bg-[#a855f7]"></span>VPS 세팅 기초</div>
            </div>
          </div>

          {/* STEP 04 */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] hover:border-[#fb923c]/40 hover:-translate-y-1 transition-all p-8 md:p-9 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#fb923c]"></div>
            <div className="font-mono text-[11px] tracking-[4px] text-[#fb923c] uppercase mb-8">STEP 04</div>
            <div className="font-outfit text-[22px] font-medium text-white mb-4 leading-tight">실계좌 운용</div>
            <div className="text-[15px] text-[#a1a1aa] leading-[1.75] font-light mb-8">
              리스크 비중을 설정하고 본인 상황에 맞는 티어로 실계좌를 운용합니다.
            </div>
            <div className="flex flex-col gap-2.5 pt-6 border-t border-[#1e1e1e] text-[14px]">
              <div className="flex items-center gap-2 text-[#a1a1aa]"><span className="w-1 h-1 rounded-full bg-[#fb923c]"></span>저위험 → 중위험 단계 진입</div>
              <div className="flex items-center gap-2 text-[#a1a1aa]"><span className="w-1 h-1 rounded-full bg-[#fb923c]"></span>트랙레코드 직접 확인</div>
              <div className="flex items-center gap-2 text-[#a1a1aa]"><span className="w-1 h-1 rounded-full bg-[#fb923c]"></span>카피트레이딩 연동 가능</div>
            </div>
          </div>

        </div>

        <div className="mt-8 flex items-center gap-3 text-[14px] text-[#10B981] font-mono reveal opacity-0 translate-y-6 transition-all duration-700 bg-[#0f0f0f] border border-[#1e1e1e] p-4 rounded-sm inline-flex">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
          트랙레코드 축적 중 (2026년 4월 실계좌 오픈 예정) — 현재는 모의 프론트테스트 단계입니다
        </div>
      </section>

      {/* FLOW */}
      <section
        id="guide"
        className="w-full bg-[#0f1117] border-y border-[#1e2230] py-24 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="font-mono text-[13px] text-[#c8a84b] tracking-[3px] uppercase mb-4 reveal opacity-0 translate-y-6 transition-all duration-700">
            시작하는 순서
          </div>
          <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl tracking-[2px] leading-tight reveal opacity-0 translate-y-6 transition-all duration-700">
            몰라도 됩니다,
            <br />
            순서대로만 오세요
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 mt-16 relative reveal opacity-0 translate-y-6 transition-all duration-700">
            {/* Desktop Line */}
            <div
              className="hidden lg:block absolute top-[31px] left-[12%] right-[12%] h-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #c8a84b, transparent)",
              }}
            ></div>

            <div className="flex flex-col items-center text-center px-5 group">
              <div className="w-[62px] h-[62px] rounded-full border border-[#c8a84b] bg-[#09090b] flex items-center justify-center font-outfit text-[22px] text-[#c8a84b] mb-6 relative z-10 group-hover:bg-[#c8a84b] group-hover:text-black transition-colors">
                01
              </div>
              <div className="text-[16px] font-bold text-white mb-2.5">
                EA 개념 잡기
              </div>
              <div className="text-[15px] text-[#7a7f8e] leading-[1.8]">
                자동매매·카피트레이딩·EA의 차이. 용어가 정리되면 나머지가
                쉬워집니다.
              </div>
            </div>

            <div className="flex flex-col items-center text-center px-5 group">
              <div className="w-[62px] h-[62px] rounded-full border border-[#c8a84b] bg-[#09090b] flex items-center justify-center font-outfit text-[22px] text-[#c8a84b] mb-6 relative z-10 group-hover:bg-[#c8a84b] group-hover:text-black transition-colors">
                02
              </div>
              <div className="text-[16px] font-bold text-white mb-2.5">
                검증된 EA 고르는 법
              </div>
              <div className="text-[15px] text-[#7a7f8e] leading-[1.8]">
                마틴게일·그리드 구별법, 트랙레코드 읽는 법, 사기 EA 피하는 기준.
              </div>
            </div>

            <div className="flex flex-col items-center text-center px-5 group">
              <div className="w-[62px] h-[62px] rounded-full border border-[#c8a84b] bg-[#09090b] flex items-center justify-center font-outfit text-[22px] text-[#c8a84b] mb-6 relative z-10 group-hover:bg-[#c8a84b] group-hover:text-black transition-colors">
                03
              </div>
              <div className="text-[16px] font-bold text-white mb-2.5">
                모의계좌로 먼저
              </div>
              <div className="text-[15px] text-[#7a7f8e] leading-[1.8]">
                MT5 설치부터 셋파일 로딩까지. 실계좌 전 반드시 거쳐야 할 단계.
              </div>
            </div>

            <div className="flex flex-col items-center text-center px-5 group">
              <div className="w-[62px] h-[62px] rounded-full border border-[#c8a84b] bg-[#09090b] flex items-center justify-center font-outfit text-[22px] text-[#c8a84b] mb-6 relative z-10 group-hover:bg-[#c8a84b] group-hover:text-black transition-colors">
                04
              </div>
              <div className="text-[16px] font-bold text-white mb-2.5">
                EA 제작 자립
              </div>
              <div className="text-[15px] text-[#7a7f8e] leading-[1.8]">
                남의 EA를 이해하게 되면 내 전략을 코드로 옮기는 단계가 열립니다.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-[#1e1e1e]">
        <div className="flex items-center gap-3 font-mono text-[13px] text-white tracking-[2px] uppercase mb-4 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="w-4 h-[2px] bg-[#10B981]"></div> 트레이아의 원칙
        </div>
        <h2 className="font-outfit text-4xl md:text-5xl lg:text-5xl font-medium tracking-tight leading-tight reveal opacity-0 translate-y-6 transition-all duration-700 text-white">
          검증하지 않은 것은 올리지 않습니다
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#1e1e1e] border border-[#1e1e1e] mt-12 reveal opacity-0 translate-y-6 transition-all duration-700 rounded-sm overflow-hidden">
          <div className="bg-[#0f0f0f] p-10 hover:bg-[#121212] transition-colors">
            <div className="text-[17px] font-medium text-white mb-3">
              리스크 유형 표기 의무
            </div>
            <div className="text-[15px] text-[#a1a1aa] leading-[1.7] font-light mb-8">
              모든 EA 소개에 마틴게일·그리드 여부를 반드시 명시합니다. 숨기는
              정보가 없습니다.
            </div>
            <div className="w-6 h-[1px] bg-[#10B981]"></div>
          </div>
          <div className="bg-[#0f0f0f] p-10 hover:bg-[#121212] transition-colors">
            <div className="text-[17px] font-medium text-white mb-3">
              실거래 트랙레코드 기반
            </div>
            <div className="text-[15px] text-[#a1a1aa] leading-[1.7] font-light mb-8">
              백테스트 수치가 아닌 실거래 데이터를 기반으로 소개합니다. 기간과
              시드가 명확해야 합니다.
            </div>
            <div className="w-6 h-[1px] bg-[#10B981]"></div>
          </div>
          <div className="bg-[#0f0f0f] p-10 hover:bg-[#121212] transition-colors">
            <div className="text-[17px] font-medium text-white mb-3">
              투자 권유 없음
            </div>
            <div className="text-[15px] text-[#a1a1aa] leading-[1.7] font-light mb-8">
              모든 콘텐츠는 교육 목적입니다. 특정 브로커나 EA를 직접 추천하지
              않으며, 판단은 본인이 합니다.
            </div>
            <div className="w-6 h-[1px] bg-[#10B981]"></div>
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
      <section
        id="insights"
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col gap-12"
      >
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
            <Link
              href="/treia/education"
              className="text-xs font-bold text-[#7a7f8e] hover:text-[#c8a84b] transition-colors flex items-center gap-1 group"
            >
              전체 보기{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          <div className="reveal opacity-0 translate-y-6 transition-all duration-700">
            <InsightCarousel>
              {insightArticles.length > 0
                ? insightArticles.map((article) => (
                    <div
                      key={article.id}
                      className="min-w-[300px] w-[300px] md:min-w-[350px] md:w-[350px] snap-start shrink-0"
                    >
                      <Link
                        href={`/treia/education/${article.id}`}
                        className="block h-full"
                      >
                        <ArticleCard
                          title={article.title}
                          category={article.category}
                          summary={article.excerpt}
                          imageUrl={article.thumbnail}
                          date={
                            article.createdAt
                              ? new Date(
                                  article.createdAt.seconds * 1000,
                                ).toLocaleDateString()
                              : ""
                          }
                          source={article.source || "Treia Official"}
                          difficulty={
                            (article.difficulty as "입문" | "중급" | "고급") ||
                            "입문"
                          }
                        />
                      </Link>
                    </div>
                  ))
                : [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="min-w-[300px] w-[300px] md:min-w-[350px] md:w-[350px] shrink-0 bg-[#0f1117]/40 border border-[#1e2230] rounded-3xl h-[400px] animate-pulse"
                    ></div>
                  ))}
            </InsightCarousel>
          </div>
        </div>
      </section>

      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #1e2230, transparent)",
        }}
      ></div>

      {/* INDICATORS */}
      <section
        id="indicators"
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20 reveal opacity-0 translate-y-6 transition-all duration-700"
      >
        <h3 className="font-outfit text-3xl tracking-[2px] mb-8">
          핵심 경제지표 캘린더
        </h3>
        <EconomicCalendar />
      </section>

      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #1e2230, transparent)",
        }}
      ></div>

      {/* EA REVIEW */}
      <section
        id="ea-review"
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20"
      >
        <h3 className="font-outfit text-3xl tracking-[2px] mb-8">EA 리뷰</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="bg-[#14171f] border border-[#1e2230] p-7 rounded hover:border-[#2a2f40] hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[17px] font-bold text-white">
                  GoldPulse EA v4.2
                </div>
                <div className="font-mono text-[13px] text-[#7a7f8e] mt-1">
                  전략유형: 브레이크아웃 · XAUUSD 전용
                </div>
              </div>
              <span className="font-mono text-[12px] bg-[#34c97a]/10 text-[#34c97a] px-2.5 py-1 rounded-sm tracking-[1px] flex items-center gap-1">
                <CheckCircle2 size={12} />
                통과
              </span>
            </div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.8] mb-4">
              H1 매물대 기반 브레이크아웃 전략. 마틴게일·그리드 없음. 고정 랏
              방식으로 리스크 예측 가능. 6개월 실거래 트랙레코드 확인.
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-[#7a7f8e]">
                  MDD
                </span>
                <span className="text-[16px] font-bold text-[#34c97a]">
                  8.3%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-[#7a7f8e]">
                  수익팩터
                </span>
                <span className="text-[16px] font-bold text-white">1.84</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-[#7a7f8e]">
                  기간
                </span>
                <span className="text-[16px] font-bold text-white">6개월</span>
              </div>
            </div>
          </div>

          <div className="bg-[#14171f] border border-[#1e2230] p-7 rounded hover:border-[#2a2f40] hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[17px] font-bold text-white">
                  SuperGrid Pro
                </div>
                <div className="font-mono text-[13px] text-[#7a7f8e] mt-1">
                  전략유형: 그리드 · 멀티심볼
                </div>
              </div>
              <span className="font-mono text-[12px] bg-[#e05252]/10 text-[#e05252] px-2.5 py-1 rounded-sm tracking-[1px] flex items-center gap-1">
                <AlertTriangle size={12} />
                위험
              </span>
            </div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.8] mb-4">
              그리드 전략 사용 확인. 추세 역행 시 포지션이 기하급수적으로
              늘어나는 구조. 특정 구간에서 대규모 드로다운 이력 존재.
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-[#7a7f8e]">
                  MDD
                </span>
                <span className="text-[16px] font-bold text-[#e05252]">
                  67.2%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-[#7a7f8e]">
                  수익팩터
                </span>
                <span className="text-[16px] font-bold text-white">2.11</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-[#7a7f8e]">
                  기간
                </span>
                <span className="text-[16px] font-bold text-white">14개월</span>
              </div>
            </div>
          </div>

          <div className="bg-[#14171f] border border-[#1e2230] p-7 rounded hover:border-[#2a2f40] hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[17px] font-bold text-white">
                  NightScalper X
                </div>
                <div className="font-mono text-[13px] text-[#7a7f8e] mt-1">
                  전략유형: 야간 스캘핑 · EURUSD
                </div>
              </div>
              <span className="font-mono text-[12px] bg-[#c8a84b]/10 text-[#c8a84b] px-2.5 py-1 rounded-sm tracking-[1px] flex items-center gap-1">
                검토중
              </span>
            </div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.8] mb-4">
              아시아 세션 저변동성 구간을 활용하는 스캘핑 EA. 마틴게일 미사용
              확인. 단, 최근 6개월 스프레드 확대 구간에서 성과 저하 패턴 발견.
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-[#7a7f8e]">
                  MDD
                </span>
                <span className="text-[16px] font-bold text-[#c8a84b]">
                  12.7%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-[#7a7f8e]">
                  수익팩터
                </span>
                <span className="text-[16px] font-bold text-white">1.42</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-[#7a7f8e]">
                  기간
                </span>
                <span className="text-[16px] font-bold text-white">11개월</span>
              </div>
            </div>
          </div>

          <div className="bg-[#14171f] border border-[#1e2230] p-7 rounded hover:border-[#2a2f40] hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[17px] font-bold text-white">
                  Martingale King v2
                </div>
                <div className="font-mono text-[13px] text-[#7a7f8e] mt-1">
                  전략유형: 마틴게일 · XAUUSD
                </div>
              </div>
              <span className="font-mono text-[12px] bg-[#e05252]/10 text-[#e05252] px-2.5 py-1 rounded-sm tracking-[1px] flex items-center gap-1">
                <XCircle size={12} />
                비추천
              </span>
            </div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.8] mb-4">
              마틴게일 전략 사용 확인. 손실 시 랏 사이즈 2배 증가 구조. 단기
              수익 곡선은 매력적이나 구조적으로 계좌 청산 위험 내포. 입문자
              금지.
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-[#7a7f8e]">
                  MDD
                </span>
                <span className="text-[16px] font-bold text-[#e05252]">
                  91.4%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-[#7a7f8e]">
                  수익팩터
                </span>
                <span className="text-[16px] font-bold text-white">3.22</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-[#7a7f8e]">
                  기간
                </span>
                <span className="text-[16px] font-bold text-white">8개월</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-[#0a0a0a] border-t border-[#1e1e1e] py-28 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 70%)",
          }}
        ></div>
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="font-outfit text-5xl md:text-7xl lg:text-[80px] font-medium tracking-tight mb-6 text-white">
            시작해볼까요?
          </h2>
          <p className="text-[18px] text-[#a1a1aa] mb-12 font-light">
            EA가 처음이어도 괜찮습니다. 저위험 티어부터 순서대로 따라오면
            됩니다.
          </p>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <a
              href="#tier"
              className="bg-[#10B981] hover:bg-[#059669] text-white px-10 py-4 text-[15px] font-medium tracking-wide rounded transition-all inline-block hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              티어 선택하러 가기
            </a>
            <a
              href="#guide"
              className="text-[#a1a1aa] hover:text-white border border-[#27272a] hover:border-[#3f3f46] bg-[#0f0f0f] px-6 py-4 rounded text-[15px] transition-all flex items-center gap-2"
            >
              입문 가이드 보기 <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
