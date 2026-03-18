"use client";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Activity, Maximize2, Layers, Globe, CheckCircle2 } from "lucide-react";
import TelegramSignals from "@/components/TelegramSignals";

export default function TreiaFunnelPage() {
  const [formData, setFormData] = useState({ name: "", contact: "", inquiry: "사전 예약: 실시간 운용 라운지" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) return;
    
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(data.message || '접수에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('서버 오류가 발생했습니다. 잠시 후 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.3] md:leading-[1.4] tracking-tight text-white mb-8">
            투자의 감정을 지우고,<br />원칙만 남기다.
          </h1>
          <p className="text-[17px] md:text-[22px] text-[#7a7f8e] max-w-2xl leading-[1.8] md:leading-[1.9] font-light">
            MDD(최대 낙폭) 10% 이내 강력 통제.<br />
            당신의 계좌가 터지지 않도록 가장 현대적인 &apos;안전벨트&apos;를 제공하는<br />
            <span className="text-white font-medium">생존형 자산 관리 알고리즘, Treia_No1</span>
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] tracking-[4px] uppercase text-[#3f3f46]">scroll down</span>
          <div className="w-px h-14 bg-[#1e1e1e] overflow-hidden relative">
            <div className="absolute inset-0 bg-[#10B981] animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* SECTION 2. Story (공감대 형성) */}
      <section className="w-full bg-[#0a0a0a] border-y border-[#1e1e1e] py-32 px-6">
        <div className="max-w-4xl mx-auto text-center reveal opacity-0 translate-y-6 transition-all duration-700">
          <h2 className="font-outfit text-3xl md:text-5xl font-medium tracking-tight text-white mb-8 leading-[1.4]">
            아직도 밤새 차트를 보며<br className="block md:hidden" /> 기도하는 매매를 하십니까?
          </h2>
          <p className="text-[17px] md:text-[19px] text-[#7a7f8e] leading-[1.9] font-light mx-auto max-w-3xl">
            일확천금을 약속하는 자극적인 문구로 현혹하지 않습니다.<br />
            단기 수익률을 덜어내더라도, <span className="text-white font-medium">&apos;밤에 발 뻗고 잘 수 있는 견고한 안정성&apos;</span>을 설계하는 데 집중했습니다.<br />
            스마트 시스템은 인간의 욕심과 공포 없이, 오직 검증된 원칙대로만 위기를 끊어냅니다.
          </p>
        </div>
      </section>

      {/* SECTION 3. 핵심 차별점 (안전성 증명) */}
      <section className="w-full max-w-6xl mx-auto py-32 px-6 relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#10B981]/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center mb-16 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="font-mono text-[13px] text-[#10B981] tracking-[3px] uppercase mb-4">
            System Core Principles
          </div>
          <h2 className="font-outfit text-3xl md:text-5xl font-medium tracking-tight text-white">
            계좌 청산을 방어하는 3중 안전 로직
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="bg-[#0f1117] border border-[#1e1e1e] p-10 hover:border-[#10B981]/40 transition-all group rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-6">
              <Layers size={24} />
            </div>
            <div className="text-[20px] font-bold text-white mb-4">마틴게일·물타기<br />절대 금지</div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.7]">
              수익 복구를 위해 랏(Lot)을 기하급수적으로 늘리는 도박성 로직을 원천 차단했습니다. 1번의 방향성 틀림이 전체 자산의 붕괴로 이어지지 않습니다.
            </div>
          </div>
          <div className="bg-[#0f1117] border border-[#1e1e1e] p-10 hover:border-[#10B981]/40 transition-all group rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-6">
              <Maximize2 size={24} />
            </div>
            <div className="text-[20px] font-bold text-white mb-4">철저한 손절선<br />시스템 강제 통제</div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.7]">
              진입 직후 리스크가 고정됩니다. 인간은 버티다 손절 타이밍을 놓치지만, 알고리즘은 정해진 수치 도달 시 0.1초의 망설임 없이 기계적으로 청산합니다.
            </div>
          </div>
          <div className="bg-[#0f1117] border border-[#1e1e1e] p-10 hover:border-[#10B981]/40 transition-all group rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-6">
              <Activity size={24} />
            </div>
            <div className="text-[20px] font-bold text-white mb-4 leading-[1.4]">인간의 한계,<br />감정의 완벽한 배제</div>
            <div className="text-[15px] text-[#7a7f8e] leading-[1.8]">
              만약 당신이 세계 초일류 트레이더라면 수동 매매가 시스템보다 우월할 수 있습니다. 하지만 인간은 손실의 공포와 수익의 환희 앞에서 반드시 흔들립니다. 시스템은 예외 없이 정해진 원칙만을 100% 실행합니다.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4. 왜 금(Gold) CFD 인가? */}
      <section className="w-full bg-[#0a0a0a] border-t border-[#1e1e1e] py-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="lg:w-1/2">
            <h2 className="font-outfit text-3xl md:text-5xl font-medium tracking-tight text-white mb-10 leading-[1.4]">
              왜 수많은 자산 중<br />&apos;금(Gold) CFD&apos; 일까요?
            </h2>
            <div className="flex flex-col gap-10">
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#1e1e1e] bg-[#0f1117] flex items-center justify-center text-[#c8a84b] mt-1">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <h4 className="text-[19px] font-bold text-white mb-3">양방향성과 레버리지라는 &apos;양날의 검&apos;</h4>
                  <p className="text-[16px] text-[#7a7f8e] leading-[1.8]">CFD(차액결제거래)는 하락장에서도 매도(Sell) 포지션으로 수익을 낼 수 있으며, 적은 증거금으로도 유연하게 한도를 조절할 수 있습니다. 하지만 이 강력한 자유도는 통제하지 못하면 독이 됩니다. 철저한 매매 원칙의 실천이 수동보다 시스템에서 더 빛을 발하는 이유입니다.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#1e1e1e] bg-[#0f1117] flex items-center justify-center text-[#c8a84b] mt-1">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-[19px] font-bold text-white mb-3">왜 CME(선물)가 아닌 CFD인가?</h4>
                  <p className="text-[16px] text-[#7a7f8e] leading-[1.8]">CME(달러 결제 선물) 시장은 진입 장벽(최소 증거금)이 높고 치명적인 만기일(롤오버)의 제약이 존재합니다. 반면 CFD는 만기일의 압박 없이 전략의 연속성을 유지하며, Micro Lot 단위로 리스크를 극도로 세밀하게 쪼개어 방어할 수 있습니다.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#1e1e1e] bg-[#0f1117] flex items-center justify-center text-[#c8a84b] mt-1">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="text-[19px] font-bold text-white mb-3">노이즈 없는 거대한 실물 기축 자산, 금</h4>
                  <p className="text-[16px] text-[#7a7f8e] leading-[1.8]">금(XAUUSD)은 전 세계 자금이 모이는 가장 무거운 실물 자산입니다. 작전 세력이나 자잘한 노이즈에 쉽게 흔들리지 않고 거대하고 일정한 파동을 형성하기에, 알고리즘이 수학적 통계와 확률을 발휘하기에 가장 정직한 종목입니다.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 w-full h-[540px] border border-[#1e1e1e] rounded-2xl relative overflow-hidden bg-[#0f1117] flex items-center justify-center">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1610315990666-41f221650bfe?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
             <div className="relative z-10 text-center px-8">
               <div className="text-[64px] font-outfit font-light text-[#c8a84b] mb-4 leading-none">XAUUSD</div>
               <div className="text-[15px] text-[#a1a1aa] tracking-[5px] uppercase">The Ultimate Asset for Algorithms</div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 5. 실시간 운용 라운지 (Offer & Gate) */}
      <section id="lounge" className="w-full bg-[#080808] border-y border-[#1e1e1e] py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#3b82f6]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal opacity-0 translate-y-6 transition-all duration-700">
          <div>
            <div className="font-mono text-[13px] text-[#3b82f6] tracking-[3px] uppercase mb-4">
              Live Trading Lounge
            </div>
            <h2 className="font-outfit text-3xl md:text-5xl font-medium tracking-tight text-white mb-6 leading-[1.3]">
              엔진의 의사결정을<br />
              <span className="text-[#3b82f6]">실시간으로 투명하게 감시하십시오.</span>
            </h2>
            <p className="text-[16px] text-[#7a7f8e] leading-[1.8] mb-8">
              도대체 언제 사고, 언제 손절하는가? 수익률 뒤에 숨겨진 진짜 매매 기록을 낱낱이 공개합니다. 우리 파트너들은 봇이 어떻게 위기를 방어하는지 데모 환경(텔레그램)에서 먼저 검증합니다.
            </p>
            <div className="flex items-center gap-4 text-[14px] font-medium text-white bg-[#1e2230] p-4 rounded-xl inline-flex mb-8 lg:mb-0">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              현재 알고리즘 투명성 리포트 배포 중
            </div>
          </div>
          
          <div className="w-full">
            <TelegramSignals />
          </div>
        </div>
      </section>

      {/* SECTION 6. 간편 문의 폼 (Lead Gen) & Legal */}
      <section className="w-full py-32 px-6 relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at bottom, rgba(16,185,129,0.05) 0%, transparent 60%)" }}></div>
        
        <div className="relative z-10 max-w-2xl mx-auto reveal opacity-0 translate-y-6 transition-all duration-700">
          <div className="text-center mb-12">
            <h2 className="font-outfit text-3xl md:text-4xl font-medium tracking-tight text-white mb-4">
              스마트 시스템 신청 및 문의
            </h2>
            <p className="text-[#7a7f8e]">더 자세한 성능 분석이나 라이선스 도입에 대한 궁금증을 남겨주세요.</p>
          </div>

          <div className="bg-[#0f1117] border border-[#1e1e1e] rounded-3xl p-8 md:p-12 mb-16 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-10 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] mx-auto mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">사전 예약이 접수되었습니다.</h3>
                <p className="text-[#a1a1aa] mb-8 leading-[1.8]">
                  현재 실계좌 최적화 및 최종 스트레스 테스트를 진행 중입니다.<br className="hidden md:block"/>
                  시스템 정식 오픈 시점에 맞춰, 남겨주신 이메일/연락처로<br className="hidden md:block"/>
                  <span className="text-white font-medium">가장 먼저 라이브 라운지 초대장을 발송해 드리겠습니다.</span>
                </p>
                <div className="inline-flex items-center justify-center gap-2 bg-[#1e2230] text-[#a1a1aa] px-6 py-3 rounded-full text-[14px] font-medium border border-[#3b82f6]/20">
                  <span className="relative flex h-2.5 w-2.5 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  대기자 명단(Waitlist) 등록 완료
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block text-[13px] font-mono tracking-widest text-[#7a7f8e] uppercase mb-2">Name</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#14171f] border border-[#1e2230] rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#10B981] transition-all" placeholder="성함 또는 닉네임을 입력하세요" />
                </div>
                <div>
                  <label className="block text-[13px] font-mono tracking-widest text-[#7a7f8e] uppercase mb-2">Contact</label>
                  <input required type="text" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full bg-[#14171f] border border-[#1e2230] rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#10B981] transition-all" placeholder="회신받으실 이메일 주소 또는 전화번호" />
                </div>
                <div>
                  <label className="block text-[13px] font-mono tracking-widest text-[#7a7f8e] uppercase mb-2">Inquiry Type</label>
                  <div className="relative">
                    <select value={formData.inquiry} onChange={(e) => setFormData({...formData, inquiry: e.target.value})} className="w-full appearance-none bg-[#14171f] border border-[#1e2230] rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#10B981] transition-all cursor-pointer">
                      <option value="사전 예약: 실시간 운용 라운지">실시간 운용 라운지(데모) 사전 예약</option>
                      <option value="사전 예약: 시스템 라이선스 도입">알고리즘 소프트웨어 도입 사전 예약</option>
                      <option value="기타 제휴 문의">기타 제휴 문의</option>
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-500">
                      ▼
                    </div>
                  </div>
                </div>
                <button disabled={isLoading} type="submit" className="w-full mt-4 bg-[#10B981] hover:bg-[#0ea5e9] text-white py-5 rounded-xl text-[16px] font-bold tracking-wide transition-all flex items-center justify-center gap-2 group shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_14px_rgba(14,165,233,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? '신청 처리 중...' : '문의 남기고 안내 받기'}
                  {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
                {errorMsg && <p className="text-red-400 text-sm text-center mt-2">{errorMsg}</p>}
              </form>
            )}
          </div>

          <div className="text-center md:text-left text-[#52525b] text-[12px] leading-[1.8] bg-[#0f1117]/50 rounded-xl p-6 border border-[#1e2230]/50">
            <h4 className="font-bold text-[#7a7f8e] mb-2 uppercase tracking-widest text-[11px]">법적 고지 (Legal Disclaimer)</h4>
            <div className="flex flex-col gap-2">
              <p>1. <strong>유사수신 및 투자일임 금지</strong>: Treia_No1은 고객의 투자금을 직접 대리 운용하거나 일임받지 않습니다. 우리는 사용자의 개인 계좌 환경에 설치하여 고객의 완전한 통제 하에 활용할 수 있는 &apos;개인용 매매 보조 소프트웨어 라이선스(로직)&apos;만을 구독/판매합니다.</p>
              <p>2. <strong>원금 손실 가능성</strong>: 본 소프트웨어는 차트 로직과 과거 데이터를 기반으로 설계된 보조 도구일 뿐, 알고리즘 매매가 수익을 100% 보장하지 않습니다. 금융 시장(CFD/XAUUSD 등)의 가격 변동 및 레버리지 사용에 따라 원금 손실이 발생할 수 있습니다.</p>
              <p>3. <strong>투자 책임</strong>: 소프트웨어 사용 여부와 설정의 결정권은 전적으로 사용자(고객)에게 있으며, 거래 결과에 따른 최종적인 수익과 손실의 책임은 모두 본인에게 귀속됩니다. 당사는 정보 제공 및 기술적 도구 공급자의 역할만을 수행합니다.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
