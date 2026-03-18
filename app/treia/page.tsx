"use client";
import { useEffect } from "react";
import { ArrowRight, ShieldCheck, Activity, Maximize2 } from "lucide-react";
import TelegramSignals from "@/components/TelegramSignals";

export default function TreiaFunnelPage() {
  useEffect(() => {
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

  return (
    <div className="w-full bg-[#080808] text-[#f2f2f2] font-sans break-keep overflow-x-hidden selection:bg-[#10B981] selection:text-[#0a0a0a]">
      {/* SECTION 1. Hero (최상단 훅) */}
      <section className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-6 pt-20 pb-32">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981]/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="text-[#10B981]" size={32} strokeWidth={1.5} />
          </div>
          <h1 className="font-outfit text-[clamp(32px,5vw,64px)] font-medium leading-[1.1] tracking-tight text-white mb-8">
            하루 100% 수익? <br />
            <span className="text-[#a1a1aa] font-light">사기꾼들의 달콤한 거짓말에 지친 분들만 모십니다.</span>
          </h1>
          <p className="text-[17px] md:text-[20px] text-[#7a7f8e] max-w-2xl leading-[1.8] font-light">
            MDD(최대 낙폭) 10% 이내 강력 통제.<br />
            철저하게 <span className="text-white font-medium">잃지 않는 것에만 집중</span>하는 단일 타임프레임(STF) XAUUSD 알고리즘, Treia.
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#3f3f46]">scroll down</span>
          <div className="w-px h-14 bg-[#1e1e1e] overflow-hidden relative">
            <div className="absolute inset-0 bg-[#10B981] animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* SECTION 2. Story (감정 동기화) */}
      <section className="w-full bg-[#0a0a0a] border-y border-[#1e1e1e] py-32 px-6">
        <div className="max-w-4xl mx-auto text-center reveal opacity-0 translate-y-6 transition-all duration-700">
          <h2 className="font-outfit text-3xl md:text-5xl font-medium tracking-tight text-white mb-8">
            야수의 심장으로 버티는 뇌동매매,<br />
            언제까지 하실 겁니까?
          </h2>
          <p className="text-[18px] text-[#7a7f8e] leading-[1.9] font-light mx-auto max-w-3xl">
            화려한 수익률을 1/5로 깎아냈습니다.<br />
            대신, <span className="text-white font-medium">'밤에 발 뻗고 잘 수 있는 절대적 안정성'</span>을 얻었습니다.<br />
            기계는 감정 없이, 오직 원칙대로만 손실을 짧게 끊어냅니다.
          </p>
        </div>
      </section>

      {/* SECTION 3. Proof (데이터 증명) */}
      <section className="w-full max-w-6xl mx-auto py-32 px-6">
        <div className="text-center mb-16 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="font-mono text-[13px] text-[#10B981] tracking-[3px] uppercase mb-4">
            System Core Principles
          </div>
          <h2 className="font-outfit text-3xl md:text-5xl font-medium tracking-tight text-white">
            검증되지 않은 기계에 돈을 맡기지 마십시오.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="bg-[#0f1117] border border-[#1e1e1e] p-10 hover:border-[#10B981]/40 transition-all group rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-6">
              <ShieldCheck size={24} />
            </div>
            <div className="text-[20px] font-bold text-white mb-4">원칙 1. <br />마틴게일, 물타기 절대 금지</div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.7]">
              수익을 위해 포지션을 무한정 늘리는 위험한 로직을 완전히 배제했습니다. 한 번의 방향성 틀림이 청산으로 이어지지 않습니다.
            </div>
          </div>
          <div className="bg-[#0f1117] border border-[#1e1e1e] p-10 hover:border-[#10B981]/40 transition-all group rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-6">
              <Maximize2 size={24} />
            </div>
            <div className="text-[20px] font-bold text-white mb-4">원칙 2. <br />철저한 손절선(SL) 고정</div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.7]">
              1회 진입 시 리스크를 확정 짓습니다. 시장이 아무리 미쳐 날뛰어도, 우리가 잃을 수 있는 최대 금액은 미리 정해져 있습니다.
            </div>
          </div>
          <div className="bg-[#0f1117] border border-[#1e1e1e] p-10 hover:border-[#10B981]/40 transition-all group rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-6">
              <Activity size={24} />
            </div>
            <div className="text-[20px] font-bold text-white mb-4">원칙 3. <br />단일 타임프레임 방어 로직</div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.7]">
              복잡하게 꼬인 지표 대신, 단일 타임프레임의 추세와 매물대에 집중하여 갑작스러운 휩쏘(Whipsaw)를 효과적으로 방어합니다.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4. Offer & Gate (미끼 투척) */}
      <section id="offer" className="w-full bg-[#0a0a0a] border-y border-[#1e1e1e] py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal opacity-0 translate-y-6 transition-all duration-700">
          <div>
            <h2 className="font-outfit text-3xl md:text-4xl font-medium tracking-tight text-white mb-6 leading-[1.3]">
              내 돈을 넣기 전,<br />
              기계가 어떻게 위기를 방어하는지<br />
              <span className="text-[#10B981]">직접 감시하십시오.</span>
            </h2>
            <p className="text-[16px] text-[#7a7f8e] leading-[1.8] mb-8">
              투자 권유는 하지 않습니다. 4월 실계좌 공식 오픈 전,<br />
              현재 딱 10분에게만 Treia 봇의 실시간 매매 타점을<br />
              텔레그램으로 무료 공개하고 있습니다.
            </p>
            <div className="flex items-center gap-4 text-[14px] font-medium text-white bg-[#1e2230] p-4 rounded-xl inline-flex mb-8 lg:mb-0">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              현재 라이브 모니터링 중
            </div>
          </div>
          
          <div className="w-full">
            <TelegramSignals />
          </div>
        </div>
      </section>

      {/* SECTION 5. CTA (행동 유도) */}
      <section className="w-full py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(16,185,129,0.05) 0%, transparent 60%)" }}></div>
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
          <h2 className="font-outfit text-3xl md:text-5xl font-medium tracking-tight text-white mb-12">
            준비되셨습니까?
          </h2>
          <a
            href="https://www.notion.so/treia_guide_placeholder"
            target="_blank"
            rel="noreferrer"
            className="w-full md:w-auto bg-[#10B981] hover:bg-[#0ea5e9] text-white px-8 md:px-14 py-6 rounded-2xl text-[18px] md:text-[20px] font-bold tracking-wide transition-all shadow-[0_10px_40px_rgba(16,185,129,0.25)] hover:shadow-[0_10px_40px_rgba(14,165,233,0.4)] flex items-center justify-center gap-3 group"
          >
            14일 무료 관전방 입장 가이드 보기 
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="text-[13px] text-[#52525b] mt-6">
            모든 입장은 노션 가이드 페이지를 통해 진행됩니다. (가입 및 결제 요구 없음)
          </p>
        </div>
      </section>
    </div>
  );
}
