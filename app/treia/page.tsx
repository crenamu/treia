"use client";
import { useEffect, useState } from "react";
import { Layers, Lock, Target, ArrowUpRight, Globe, CheckCircle2 } from "lucide-react";

export default function TreiaFunnelPage() {
  const [formData, setFormData] = useState({ name: "", contact: "", inquiry: "사전 예약: MT5 실시간 관전자 계정" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-12");
          }
        });
      },
      { threshold: 0.2 },
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
    <div className="w-full bg-[#050505] text-[#f2f2f2] font-sans break-keep overflow-x-hidden selection:bg-[#c8a84b] selection:text-[#050505]">
      
      {/* Screen 1: The Vision */}
      <section className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c8a84b]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center reveal opacity-0 translate-y-12 transition-all duration-[1500ms]">
          <div className="font-mono text-[12px] md:text-[15px] text-[#c8a84b] tracking-[6px] uppercase mb-10">
            Treia Gold Algorithm Engine
          </div>
          <h1 className="font-outfit text-4xl md:text-6xl lg:text-[76px] font-light leading-[1.3] tracking-tighter text-white mb-10">
            투자는 당신의 일상을 <br className="hidden md:block"/> 지키기 위한 수단이어야 합니다.
          </h1>
          <p className="text-[17px] md:text-[24px] text-[#7a7f8e] max-w-3xl leading-[1.8] font-light">
            모니터 앞에서 보내는 긴장된 시간들, 이제는 본업과 가족에게 돌려주십시오. <br className="hidden lg:block"/>
            감정의 소모 없이, 24시간 정교한 원칙으로 작동하는 생존형 자산 관리 알고리즘.
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 reveal opacity-0 translate-y-12 transition-all duration-1000 delay-500">
          <span className="font-mono text-[11px] tracking-[5px] uppercase text-[#444]">Scroll</span>
          <div className="w-px h-16 bg-[#1a1a1a] overflow-hidden relative">
            <div className="absolute inset-0 bg-[#c8a84b] animate-[pulse_2s_infinite]"></div>
          </div>
        </div>
      </section>

      {/* Screen 2: The Philosophy */}
      <section className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-6 border-t border-[#111]">
        <div className="absolute bottom-0 w-full h-[50vh] bg-gradient-to-t from-[#c8a84b]/5 to-transparent z-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-10 leading-[1.4]">
            시장을 예측하려 하지 않습니다. <br/> 철저하게 <span className="text-[#c8a84b] italic pr-2">대응</span>할 뿐입니다.
          </h2>
          <p className="text-[17px] md:text-[22px] text-[#7a7f8e] max-w-3xl mx-auto leading-[1.9] font-light">
            위대한 투자자들도 시장의 거대한 파도 앞에서는 겸손합니다. <br className="hidden md:block"/>
            Treia는 시장을 이기려는 오만을 버렸습니다. <br/><br/>
            대신, 어떤 변동성 속에서도 미리 설정된 방어선을 지키고 살아남는 <br className="hidden md:block"/>
            <strong className="text-white font-medium">&apos;생존의 원칙&apos;</strong>을 기술로 구현했습니다. <br/>
            예측할 수 없는 내일도, 시스템 안에서는 통제 가능한 데이터가 됩니다.
          </p>
        </div>
      </section>

      {/* Screen 3: The Canvas */}
      <section className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-6 border-t border-[#111] overflow-hidden">
        {/* Subtle Gold Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8a84b]/10 blur-[150px] mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 border border-[#c8a84b]/30 rounded-full flex items-center justify-center text-[#c8a84b] shadow-[0_0_50px_rgba(200,168,75,0.15)] relative">
              <div className="absolute inset-2 border border-[#c8a84b]/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <Globe size={40} strokeWidth={1} />
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-10 leading-[1.4]">
            알고리즘이 가장 완벽하게 작동하는 무대, <br/> 순수한 실물 자산 <span className="text-[#c8a84b] font-normal">&apos;금(Gold)&apos;</span>
          </h2>
          <p className="text-[17px] md:text-[22px] text-[#7a7f8e] max-w-3xl mx-auto leading-[1.9] font-light">
            개별 기업의 훌륭한 비전과 내재 가치를 평가하는 주식 시장과 달리, <br className="hidden md:block"/>
            전 세계 자금이 모이는 금(XAUUSD) 시장은 외부 노이즈에 강하고 일정한 거시적 파동을 그립니다.<br/><br/>
            여기에 상승과 하락 모든 방향에서 유연하게 대응할 수 있는 CFD 환경을 결합하여, <br className="hidden md:block"/>
            <strong className="text-white font-medium">시장의 흐름에 가장 순응하는 투자 모델</strong>을 완성했습니다.
          </p>
        </div>
      </section>

      {/* Screen 4: The Mechanism */}
      <section className="relative min-h-[100svh] flex flex-col justify-center items-center px-6 py-32 border-t border-[#111]">
        <div className="relative z-10 text-center mb-24 reveal opacity-0 translate-y-12 transition-all duration-1000">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.4]">
            리스크를 통제하는 <br className="md:hidden"/> <span className="text-[#c8a84b]">3가지 견고한 안전장치</span>
          </h2>
        </div>

        <div className="relative w-full max-w-3xl mx-auto flex flex-col gap-16 md:gap-24 z-10">
          <div className="absolute left-[39px] md:left-[59px] top-10 bottom-10 w-px bg-[#1a1a1a]"></div>

          {/* Item 1 */}
          <div className="flex gap-8 md:gap-12 items-start relative reveal opacity-0 translate-y-12 transition-all duration-1000">
            <div className="relative z-10 flex-shrink-0 w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#0a0a0a] border border-[#c8a84b]/30 flex items-center justify-center text-[#c8a84b] shadow-[0_0_30px_rgba(200,168,75,0.1)]">
              <Layers size={32} strokeWidth={1.5} className="md:w-12 md:h-12" />
            </div>
            <div className="pt-2 md:pt-6">
              <h3 className="text-2xl md:text-4xl font-normal text-white mb-4">합리적인 자산 배분</h3>
              <p className="text-[17px] md:text-[21px] text-[#7a7f8e] leading-[1.8] font-light">
                극단적인 배수 진입(마틴게일)을 전면 차단하고, <strong className="text-white font-medium">계좌가 감당할 수 있는 철저한 예산 안에서만</strong> 움직입니다.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex gap-8 md:gap-12 items-start relative reveal opacity-0 translate-y-12 transition-all duration-1000 delay-100">
            <div className="relative z-10 flex-shrink-0 w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#0a0a0a] border border-[#c8a84b]/30 flex items-center justify-center text-[#c8a84b] shadow-[0_0_30px_rgba(200,168,75,0.1)]">
              <Lock size={32} strokeWidth={1.5} className="md:w-12 md:h-12" />
            </div>
            <div className="pt-2 md:pt-6">
              <h3 className="text-2xl md:text-4xl font-normal text-white mb-4">흔들림 없는 방어선</h3>
              <p className="text-[17px] md:text-[21px] text-[#7a7f8e] leading-[1.8] font-light">
                진입과 동시에 리스크의 한계를 명확히 설정하여, <strong className="text-white font-medium">단 한 번의 방향성 오류가 치명상으로 이어지는 것을 방지</strong>합니다.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex gap-8 md:gap-12 items-start relative reveal opacity-0 translate-y-12 transition-all duration-1000 delay-200">
            <div className="relative z-10 flex-shrink-0 w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#0a0a0a] border border-[#c8a84b]/30 flex items-center justify-center text-[#c8a84b] shadow-[0_0_30px_rgba(200,168,75,0.1)]">
              <Target size={32} strokeWidth={1.5} className="md:w-12 md:h-12" />
            </div>
            <div className="pt-2 md:pt-6">
              <h3 className="text-2xl md:text-4xl font-normal text-white mb-4">탄력적인 수익 추적</h3>
              <p className="text-[17px] md:text-[21px] text-[#7a7f8e] leading-[1.8] font-light">
                강력한 추세가 형성되면 <strong className="text-white font-medium">익절 구간을 유연하게 확장(Trailing)</strong>하여, 시장이 허락하는 기회를 온전히 담아냅니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screen 5: The Proof */}
      <section className="relative min-h-[100svh] flex flex-col justify-center items-center px-6 py-32 border-t border-[#111]">
        <div className="max-w-6xl w-full mx-auto relative z-10 flex flex-col items-center flex-1">
          
          <div className="text-center mb-16 reveal opacity-0 translate-y-12 transition-all duration-1000">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-[1.4] tracking-tight">
              극단적인 변동성, <br className="md:hidden"/> 그 속에서 증명된 <span className="font-normal text-[#c8a84b]">시스템의 평온함.</span>
            </h2>
            <p className="text-[17px] md:text-[22px] text-[#7a7f8e] leading-[1.8] font-light max-w-4xl mx-auto">
              최근 글로벌 금리 발표(FOMC) 등 시장이 거칠게 요동치는 구간에서도 Treia 엔진은 평정심을 잃지 않았습니다. <br className="hidden md:block"/>
              방향이 어긋났을 때는 <strong className="text-white">-$36 선에서 안전하게 끊어내고</strong>, 기회를 포착했을 때는 <strong className="text-white">+$63까지 수익을 온전히 추적해 낸</strong> 실제 기록입니다.
            </p>
          </div>

          <div className="w-full bg-[#0d0e12] border border-[#22242e] rounded-[32px] p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-16 reveal opacity-0 translate-y-12 transition-all duration-1000 delay-200">
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#22242e]">
              <div className="flex flex-col items-center pt-6 md:pt-0">
                <div className="text-[#a1a1aa] font-mono text-[12px] uppercase tracking-[4px] mb-4">최근 실거래 검증</div>
                <div className="text-5xl md:text-6xl font-light text-white">147<span className="text-2xl text-[#c8a84b] ml-1">회</span></div>
              </div>
              <div className="flex flex-col items-center pt-6 md:pt-0">
                <div className="text-[#a1a1aa] font-mono text-[12px] uppercase tracking-[4px] mb-4">알고리즘 승률</div>
                <div className="text-5xl md:text-6xl font-light text-white">80.95<span className="text-2xl text-[#c8a84b] font-outfit ml-1">%</span></div>
              </div>
              <div className="flex flex-col items-center pt-6 md:pt-0">
                <div className="text-[#a1a1aa] font-mono text-[12px] uppercase tracking-[4px] mb-4">수익 창출 지표 (Profit Factor)</div>
                <div className="text-5xl md:text-6xl font-light text-white font-outfit">3.58</div>
              </div>
            </div>

            {/* Dashboard Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Chart Mockup */}
              <div className="lg:col-span-3 bg-[#13151b] border border-[#23252d] rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3b82f6]/5 blur-[80px] rounded-full point-events-none transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="text-left text-sm font-mono text-[#a1a1aa] tracking-widest uppercase">Growth Curve ($1,000 기준)</div>
                  <div className="text-right">
                     <span className="block text-[#3b82f6] font-outfit text-3xl font-light">+$992.90</span>
                     <span className="text-[#7a7f8e] text-xs uppercase tracking-widest">+99.2% Growth</span>
                  </div>
                </div>
                {/* SVG Area */}
                <div className="flex-1 w-full min-h-[160px] relative flex items-end">
                  <svg viewBox="0 0 400 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" preserveAspectRatio="none">
                    <path d="M0,80 L50,80 L80,70 L100,75 L150,75 L180,90 L200,90 L250,50 L300,50 L350,15 L400,10 L400,100 L0,100 Z" fill="url(#gradient-blue)" opacity="0.3" />
                    <path d="M0,80 L50,80 L80,70 L100,75 L150,75 L180,90 L200,90 L250,50 L300,50 L350,15 L400,10" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                    <circle cx="400" cy="10" r="4" fill="#60a5fa" className="animate-pulse" />
                    <defs>
                      <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 border-b border-l border-[#2a2d36] pointer-events-none"></div>
                </div>
              </div>

              {/* Profit vs Loss */}
              <div className="lg:col-span-2 bg-[#13151b] border border-[#23252d] rounded-2xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] bg-[#10B981]/5 blur-[60px] rounded-full point-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="text-center mb-6 relative z-10">
                   <span className="text-sm font-mono text-[#a1a1aa] tracking-widest uppercase">Profit Ratio</span>
                </div>
                
                <div className="flex gap-4 items-center justify-between w-full h-full relative z-10">
                   
                   <div className="flex flex-col items-center">
                     <span className="text-[#10B981] font-outfit text-2xl font-light mb-1">+$1,372</span>
                     <span className="text-[#a1a1aa] text-[10px] uppercase tracking-widest">Gross Profit</span>
                   </div>

                   <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 mx-auto">
                     <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-2xl">
                       <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="3" className="opacity-80" />
                       <path strokeDasharray="78.1, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeWidth="3" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                       <span className="text-[#f2f2f2] text-2xl font-light font-outfit">+$989</span>
                       <span className="text-[12px] text-[#7a7f8e] uppercase tracking-widest mt-1">Net Flow</span>
                     </div>
                   </div>

                   <div className="flex flex-col items-center">
                     <span className="text-[#ef4444] font-outfit text-2xl font-light mb-1">-$383</span>
                     <span className="text-[#a1a1aa] text-[10px] uppercase tracking-widest">Gross Loss</span>
                   </div>

                </div>
              </div>

            </div>
          </div>
          
        </div>
      </section>

      {/* Screen 6: The Invite (CTA) */}
      <section className="relative min-h-[100svh] flex flex-col justify-center items-center px-6 py-32 border-t border-[#333] bg-gradient-to-t from-[#0a0a0d] to-[#040404]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-[#c8a84b] to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#c8a84b]/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl w-full mx-auto relative z-10 text-center flex flex-col items-center reveal opacity-0 translate-y-12 transition-all duration-1000">
          
          <h2 className="text-4xl md:text-6xl font-light text-white mb-8 tracking-tight leading-[1.3]">
            투명한 &apos;현재&apos;를 당신의 <br className="hidden md:block"/> 눈으로 직접 확인하십시오.
          </h2>
          <p className="text-[17px] md:text-[22px] text-[#a1a1aa] leading-[1.8] font-light max-w-2xl mb-16">
            과거의 가공된 데이터보다 중요한 것은, 지금 이 순간 어떻게 작동하고 있는가입니다. <br/>
            Treia 엔진의 심장부인 <strong className="text-white font-medium">&apos;MT5 실시간 관전자 계정(Investor Password)&apos;</strong>을 한정된 분들께 우선 공개합니다. <br/><br/>
            기계의 차가운 원칙이 만들어내는 일상을 직접 경험해 보십시오.
          </p>

          <div className="w-full bg-[#0a0b0e]/80 backdrop-blur-xl border border-[#c8a84b]/20 p-8 md:p-12 rounded-[32px] shadow-[0_0_80px_rgba(200,168,75,0.05)]">
             {!isSubmitted ? (
               <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                     <label className="text-[13px] text-[#a1a1aa] ml-2 tracking-widest uppercase">성함</label>
                     <input 
                       type="text" 
                       required 
                       placeholder="성함을 입력해주세요"
                       className="w-full bg-[#13151a] border border-[#2a2d36] text-white px-6 py-5 rounded-2xl focus:outline-none focus:border-[#c8a84b]/50 focus:ring-1 focus:ring-[#c8a84b]/50 transition-all font-light"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                     />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-[13px] text-[#a1a1aa] ml-2 tracking-widest uppercase">연락처</label>
                     <input 
                       type="tel" 
                       required 
                       placeholder="010-0000-0000"
                       className="w-full bg-[#13151a] border border-[#2a2d36] text-white px-6 py-5 rounded-2xl focus:outline-none focus:border-[#c8a84b]/50 focus:ring-1 focus:ring-[#c8a84b]/50 transition-all font-light"
                       value={formData.contact}
                       onChange={(e) => setFormData({...formData, contact: e.target.value})}
                     />
                   </div>
                 </div>

                 {errorMsg && <p className="text-red-400 text-sm mt-2 ml-2">{errorMsg}</p>}

                 <button 
                   type="submit" 
                   disabled={isLoading}
                   className="w-full mt-4 bg-gradient-to-r from-[#c8a84b] to-[#a38531] text-white text-[18px] font-medium py-6 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50 shadow-[0_10px_30px_rgba(200,168,75,0.2)]"
                 >
                   {isLoading ? "접수 중..." : "MT5 관전자 계정 접속 정보 받기"} 
                   {!isLoading && <ArrowUpRight size={24} />}
                 </button>
               </form>
             ) : (
               <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
                 <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center text-[#10B981] mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                   <CheckCircle2 size={40} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-2xl text-white font-medium mb-4">계정 신청이 완료되었습니다.</h3>
                 <p className="text-[#a1a1aa] leading-relaxed font-light">
                   입력하신 연락처로 MT5 관전자 계정 로그인 정보(ID, Password, Server)를 발송해 드릴 예정입니다.<br/> 잠시만 기다려주시면 감사하겠습니다.
                 </p>
               </div>
             )}
          </div>
        </div>
      </section>

    </div>
  );
}
