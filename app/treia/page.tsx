"use client";
import { useEffect, useState } from "react";
import { Layers, Lock, Target, ArrowUpRight, Globe, CheckCircle2, Clock, ShieldCheck, Activity } from "lucide-react";

export default function TreiaFunnelPage() {
  const [formData, setFormData] = useState({ name: "", email: "", reason: "", inquiry: "사전 예약: 개인용 자동매매 소프트웨어 라이선스" });
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
      { threshold: 0.15 },
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
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

  const chartData = [0.97, 1.57, 33.46, 33.77, 66.85, 67.41, 81.86, 113.39, 115.27, 116.26, 116.86, 130.48, 144.1, 159.12, 174.05, 187.36, 151.14, 115.57, 87.55, 59.53, 36.71, 19.76, 20.32, 20.92, 11.76, 5.03, 3.08, 15.13, 15.71, 16.31, 22.47, 23.09, 23.69, 24.29, 24.98, 30.72, 36.75, 47.77, 58.01, 57.98, 57.49, 55.2, 53.28, 56.1, 20.14, -15.92, -49.27, -82.7, -65.65, -59.97, -66.87, -65.91, -64.95, -64.35, -63.75, -62.89, -62.29, -56.56, -50.12, -43.68, -43.08, -42.48, -41.88, -41.28, -40.69, -40.09, -39.49, -38.89, -38.29, -37.69, -30.53, -23.37, -16.21, -7.89, 3.89, 15.67, 27.45, 39.23, 54.84, 70.45, 86.06, 102.86, 121.72, 142.45, 163.18, 170.14, 177.14, 186.14, 189.88, 191.55, 193.29, 182.99, 172.76, 165.06, 157.38, 152.65, 149.87, 148.55, 147.29, 147.35, 145.85, 144.64, 147.37, 151.82, 157.52, 169.41, 181.21, 208.3, 235.39, 285.71, 337.05, 360.62, 384.19, 429.67, 475.15, 497.38, 519.61, 562.77, 605.93, 626.64, 647.35, 648.73, 658.92, 669.36, 669.97, 704.29, 767.28, 776.59, 792.86, 802.17, 818.44, 827.75, 837.06, 853.33, 869.6, 879.19, 888.78, 897.96, 907.14, 917.89, 928.64, 939.37, 950.1, 959.14, 968.18, 977.24, 986.3];
  
  // Create SVG path string dynamically
  const width = 800;
  const height = 200;
  const minVal = -100; // a bit below -82.7
  const maxVal = 1000; // a bit above 986.3
  const range = maxVal - minVal;
  const stepX = width / (chartData.length - 1);
  
  const generatePath = (data: number[]) => {
    return data.map((val, i) => {
      const x = i * stepX;
      const y = height - ((val - minVal) / range) * height;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  };
  const dPath = generatePath(chartData);
  const dFill = `${dPath} L${width},${height} L0,${height} Z`;

  return (
    <div className="w-full bg-[#050505] text-[#f2f2f2] font-sans break-keep overflow-x-hidden selection:bg-[#c8a84b] selection:text-[#050505]">
      
      {/* Screen 1: The Vision */}
      <section className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-6">
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
            시장을 예측하려 하지 않습니다. <br/> <span className="bg-[#c8a84b] text-[#0a0a0a] px-3 py-1 font-bold inline-block mt-2">철저하게 대응</span>할 뿐입니다.
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
            여기에 상승과 하락 모든 방향에서 유연하게 대응할 수 있는 CFD(차액결제거래) 환경을 결합하여, <br className="hidden md:block"/>
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

      {/* Screen 5: Benefit 1 - Time Freedom */}
      <section className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-6 border-t border-[#111] bg-[#030303]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0a0b0e] border border-[#1e2028] flex items-center justify-center shadow-2xl">
              <Clock className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
            </div>
          </div>
          <span className="text-blue-400 font-mono text-sm tracking-[4px] uppercase block mb-6">Benefit 1. 시간의 자유</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-10 leading-[1.4]">
            당신의 <span className="bg-[#c8a84b] text-[#0a0a0a] px-3 py-1 font-bold inline-block mb-1">낮과 밤</span>을 돌려드립니다.
          </h2>
          <p className="text-[17px] md:text-[22px] text-[#7a7f8e] max-w-3xl mx-auto leading-[1.9] font-light">
            회의 중에 주식 창을 몰래 보며 땀 흘릴 필요가 없습니다. <br className="hidden md:block"/>
            트레이아 골드 알고리즘 엔진은 당신이 본업에 집중하고, 가족과 저녁을 먹고, <br className="hidden md:block"/>
            깊은 잠에 빠진 순간에도 <strong className="text-white font-medium">24시간 당신의 계좌를 모니터링</strong>합니다.<br/><br/>
            당신은 아침에 일어나 밤새 엔진이 지켜낸 결과만 확인하십시오.
          </p>
        </div>
      </section>

      {/* Screen 6: Benefit 2 - Psychological Peace */}
      <section className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-6 border-t border-[#111] bg-[#050505] overflow-hidden">
        
        {/* Abstract Whipsaw Chart Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
           <svg viewBox="0 0 1000 400" className="w-[150%] h-auto stroke-[#ef4444]" preserveAspectRatio="none" fill="none" strokeWidth="1">
             <path d="M0,200 L100,190 L120,250 L140,150 L160,280 L180,100 L200,350 L220,50 L240,300 L260,150 L280,250 L300,190 L1000,190" strokeDasharray="5,5" />
           </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0a0b0e] border border-[#1e2028] flex items-center justify-center shadow-2xl relative">
              <ShieldCheck className="w-10 h-10 text-[#10B981]" strokeWidth={1.5} />
            </div>
          </div>
          <span className="text-[#10B981] font-mono text-sm tracking-[4px] uppercase block mb-6">Benefit 2. 심리적 평온</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-10 leading-[1.4]">
            FOMC 금리 발표의 밤, <br/> <span className="bg-[#c8a84b] text-[#0a0a0a] px-3 py-1 font-bold inline-block mt-2">숙면을 취하십시오.</span>
          </h2>
          <p className="text-[17px] md:text-[22px] text-[#7a7f8e] max-w-3xl mx-auto leading-[1.9] font-light">
            어제 새벽 미장 금리 발표로 시장이 요동칠 때, <br className="hidden md:block"/>
            수동 매매자들은 공포에 질려 뜬눈으로 밤을 새웠습니다. <br/><br/>
            하지만 트레이아 유저들은 평온하게 숙면을 취했습니다. <br className="hidden md:block"/>
            <strong className="text-white font-medium">감정이 없는 엔진이 칼같이 위험을 차단하고, 수익 구간만 온전히 취했기 때문입니다.</strong>
          </p>
        </div>
      </section>

      {/* Screen 7: Benefit 3 - Account Survival */}
      <section className="relative min-h-[100svh] flex justify-center items-center px-6 py-20 border-t border-[#111] bg-[#030303]">
        
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="reveal opacity-0 translate-y-12 transition-all duration-1000 text-center lg:text-left">
            <span className="text-[#c8a84b] font-mono text-sm tracking-[4px] uppercase block mb-6">Benefit 3. 계좌의 생존</span>
            <h2 className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-light tracking-tight text-white mb-8 leading-[1.4]">
              <span className="bg-[#c8a84b] text-[#0a0a0a] px-3 py-1 font-bold inline-block mb-2">잃지 않는 자만이</span><br/>
              결국 복리를 누립니다.
            </h2>
            <p className="text-[17px] md:text-[21px] text-[#7a7f8e] leading-[1.8] font-light max-w-xl mx-auto lg:mx-0">
              수익 극대화보다 중요한 것은 <strong>&apos;계좌의 생존&apos;</strong>입니다. <br/>
              -50% 손실을 입으면 원금을 복구하기 위해 +100%의 수익을 내야 합니다. <br/><br/>
              트레이아 엔진의 최우선 목표는 화려한 대박이 아닙니다. <br className="hidden lg:block"/>
              <strong className="text-white font-medium">철저한 기계적 손절로 치명상을 막고, 잃지 않는 매매를 누적시켜 거대한 복리의 마법을 완성하는 것</strong>입니다.
            </p>
          </div>
          
          {/* Visual Data Representation - Refined */}
          <div className="reveal opacity-0 translate-y-12 transition-all duration-1000 delay-200 w-full">
            <div className="bg-[#0a0b0e] border border-[#1e2028] rounded-[32px] p-10 md:p-14 shadow-2xl relative overflow-visible">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ef4444]/5 blur-[80px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
               
               <h3 className="text-[#a1a1aa] font-mono text-sm tracking-widest uppercase mb-16 text-center lg:text-left relative z-10">THE TRAP OF DRAWDOWN</h3>
               
               <div className="flex flex-col gap-12 relative z-10">
                 {/* -50% Loss */}
                 <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                   <div className="text-5xl font-light text-[#ef4444] w-32 shrink-0">-50%</div>
                   <div className="flex-1 w-full">
                     <div className="h-4 w-1/2 bg-[#ef4444] rounded-full relative shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        <span className="absolute top-8 left-0 text-[13px] text-[#7a7f8e] md:whitespace-nowrap font-medium tracking-wide">계좌 반토막</span>
                     </div>
                   </div>
                 </div>

                 {/* +100% Need */}
                 <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mt-4 md:mt-0">
                   <div className="text-5xl font-light text-[#10B981] w-32 shrink-0">+100%</div>
                   <div className="flex-1 w-full">
                     <div className="h-4 w-full bg-[#10B981] rounded-full relative shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <span className="absolute top-8 right-0 md:right-auto md:left-full md:-ml-[120px] text-[13px] text-white font-bold md:whitespace-nowrap tracking-wide drop-shadow-md">원금 복구에 필요한 수익률</span>
                     </div>
                   </div>
                 </div>
               </div>
               
            </div>
          </div>

        </div>
      </section>

      {/* Screen 8: The Proof (Infographic Dashboard) */}
      <section className="relative min-h-[100svh] flex flex-col justify-center items-center px-6 py-20 border-t border-[#111]">
        <div className="max-w-6xl w-full mx-auto relative z-10 flex flex-col items-center flex-1">
          
          <div className="text-center mb-16 reveal opacity-0 translate-y-12 transition-all duration-1000">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-[1.4] tracking-tight">
              실제 데이터로 증명된 <br className="md:hidden"/> <span className="font-normal text-[#c8a84b]">시스템의 방어력.</span>
            </h2>
            <p className="text-[17px] md:text-[22px] text-[#7a7f8e] leading-[1.8] font-light max-w-4xl mx-auto">
              방향이 어긋났을 때는 <strong className="text-white">설정된 최소한의 방어선(-3.6%)에서 안전하게 끊어내고</strong>, 기회를 포착했을 때는 <strong className="text-white">그 수 배에 달하는 수익(+6.3%)을 온전히 추적해 낸</strong> 투명한 실제 기록입니다.
            </p>
          </div>

          <div className="w-full bg-[#0d0e12] border border-[#22242e] rounded-[32px] p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-12 lg:gap-16 reveal opacity-0 translate-y-12 transition-all duration-1000 delay-200">
            
            {/* Context Info */}
            <div className="flex flex-col md:flex-row justify-between items-center text-sm font-mono tracking-widest text-[#7a7f8e] uppercase border-b border-[#22242e] pb-6 gap-4">
               <div>Data Source: <span className="text-[#c8a84b]">MT5 데모 운용 서버 (실 구동 테스트)</span></div>
               <div>기간: 1개월 (총 147회 매매)</div>
               <div>초기 자본: $1,000.00</div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#22242e]">
              <div className="flex flex-col items-center pt-6 md:pt-0">
                <div className="text-[#a1a1aa] font-mono text-[12px] uppercase tracking-[2px] mb-4">라이브 포워드 테스트</div>
                <div className="text-5xl md:text-6xl font-light text-white">147<span className="text-2xl text-[#c8a84b] ml-1">회</span></div>
              </div>
              <div className="flex flex-col items-center pt-6 md:pt-0">
                <div className="text-[#a1a1aa] font-mono text-[12px] uppercase tracking-[2px] mb-4">알고리즘 승률</div>
                <div className="text-5xl md:text-6xl font-light text-white">80.95<span className="text-2xl text-[#c8a84b] font-outfit ml-1">%</span></div>
              </div>
              <div className="flex flex-col items-center pt-6 md:pt-0">
                <div className="text-[#a1a1aa] font-mono text-[12px] uppercase tracking-[2px] mb-4">수익 창출 지표 (Profit Factor)</div>
                <div className="text-5xl md:text-6xl font-light text-white font-outfit">3.58</div>
              </div>
            </div>

            {/* Dashboard Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* MT5 Actual Data Chart */}
              <div className="lg:col-span-3 bg-[#13151b] border border-[#23252d] rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3b82f6]/5 blur-[80px] rounded-full point-events-none transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="text-left text-sm font-mono text-[#a1a1aa] tracking-widest uppercase">실제 운용 계좌 성장 곡선 ($1,000 기준)</div>
                  <div className="text-right">
                     <span className="block text-[#3b82f6] font-outfit text-2xl md:text-3xl font-light">+$986.30</span>
                     <span className="text-[#7a7f8e] text-xs uppercase tracking-widest">Net Profit Flow</span>
                  </div>
                </div>
                {/* SVG Area */}
                <div className="flex-1 w-full min-h-[160px] relative flex md:items-end mt-4">
                  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" preserveAspectRatio="none">
                    <path d={dFill} fill="url(#gradient-blue-real)" opacity="0.3" />
                    <path d={dPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                    <circle cx={width} cy={height - ((chartData[chartData.length-1] - minVal) / range) * height} r="5" fill="#60a5fa" className="animate-pulse" />
                    <defs>
                      <linearGradient id="gradient-blue-real" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 border-b border-l border-[#2a2d36] pointer-events-none"></div>
                  
                  {/* Annotation for DD */}
                  <div className="absolute bottom-[20%] left-[25%] hidden md:flex flex-col items-center">
                    <div className="w-px h-8 bg-dashed bg-[#ef4444]/50 border-l border-dashed border-[#ef4444]"></div>
                    <span className="text-[10px] text-[#ef4444] font-mono mt-1 whitespace-nowrap">방어선 (Max DD: -$82.70)</span>
                  </div>
                </div>
              </div>

              {/* Profit vs Loss */}
              <div className="lg:col-span-2 bg-[#13151b] border border-[#23252d] rounded-2xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] bg-[#10B981]/5 blur-[60px] rounded-full point-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="text-center mb-6 relative z-10">
                   <span className="text-sm font-mono text-[#a1a1aa] tracking-widest uppercase">Profit Ratio</span>
                </div>
                
                <div className="flex gap-4 items-center justify-between w-full h-full relative z-10">
                   
                   <div className="flex flex-col items-center shrink-0">
                     <span className="text-[#10B981] font-outfit text-xl md:text-2xl font-light mb-1">+$1,370</span>
                     <span className="text-[#a1a1aa] text-[10px] uppercase tracking-widest">Gross Profit</span>
                   </div>

                   {/* Using authentic 1370 / 384 ratio */}
                   {/* 1370 / (1370+384) = ~78.1% */}
                   <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0 mx-auto">
                     <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-2xl">
                       <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="3" className="opacity-80" />
                       <path strokeDasharray="78.1, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeWidth="3" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                       <span className="text-[#f2f2f2] text-xl md:text-2xl font-light font-outfit">+$986</span>
                       <span className="text-[10px] text-[#7a7f8e] uppercase tracking-widest mt-1">Net Flow</span>
                     </div>
                   </div>

                   <div className="flex flex-col items-center shrink-0">
                     <span className="text-[#ef4444] font-outfit text-xl md:text-2xl font-light mb-1">-$384</span>
                     <span className="text-[#a1a1aa] text-[10px] uppercase tracking-widest">Gross Loss</span>
                   </div>

                </div>
              </div>

            </div>
          </div>
          
        </div>
      </section>

      {/* Screen 8.5: What is MT5 Investor Password? */}
      <section className="relative flex flex-col justify-center items-center px-6 py-24 md:py-32 border-t border-[#111] bg-[#050505]">
        <div className="max-w-4xl w-full mx-auto reveal opacity-0 translate-y-12 transition-all duration-1000">
          <div className="bg-[#0a0b0e] border border-[#22242e] rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8a84b] to-transparent"></div>
            
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-6 leading-[1.4]">
              왜 <span className="bg-[#c8a84b] text-[#0a0a0a] px-3 py-1 font-bold inline-block rounded-sm mb-2 md:mb-0">MT5 관전자 계정</span> 인가요?
            </h3>
            
            <p className="text-[16px] md:text-[19px] text-[#a1a1aa] leading-[1.8] font-light">
              단순한 엑셀 기반의 백테스트 결과나 부분적으로 캡처된 수익 인증샷은 누구나 쉽게 가장할 수 있습니다.<br/><br/>
              하지만 글로벌 표준 금융 트레이딩 플랫폼인 MT5(MetaTrader 5)의 <strong className="text-white font-medium">&apos;관전자 계정(Investor Password)&apos;</strong>은 조작이 원천적으로 불가능합니다. 오직 거래 서버 시스템에 실시간으로 기록되는 <strong className="text-white font-medium">실시간 체결 내역, 현재 보유 중인 포지션 비율, 그리고 정확한 계좌 잔고</strong>만을 제3자가 100% 투명하게 &apos;조회만&apos; 할 수 있도록 권한을 열어주는 시스템입니다.<br/><br/>
              이를 통해 당신은 엔진이 약속한 방어선이 진짜로 지켜지고 있는지, 가감 없는 생생한 민낯을 직접 검증할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Screen 9: The Invite (CTA) */}
      <section className="relative min-h-[100svh] flex flex-col justify-center items-center px-6 py-20 border-t border-[#333] bg-gradient-to-t from-[#0a0a0d] to-[#040404]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-[#c8a84b] to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#c8a84b]/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl w-full mx-auto relative z-10 text-center flex flex-col items-center reveal opacity-0 translate-y-12 transition-all duration-1000">
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-8 tracking-tight leading-[1.3]">
            투명한 &apos;현재&apos;를 당신의 <br className="hidden md:block"/> 눈으로 직접 확인하십시오.
          </h2>
          <p className="text-[17px] md:text-[22px] text-[#a1a1aa] leading-[1.8] font-light max-w-3xl mb-16">
            모든 분들께 무분별하게 제공하지 않습니다. <br/>
            알고리즘 시스템의 가치와 필요성을 깊이 공감하고, 직접 검증을 통해 본인의 투자 원칙을 세우고자 하는 <strong className="text-white font-medium">소수의 분들에게만 2주간 정중하게 개방해 드립니다.</strong> <br/><br/>
            과거의 가공된 수익률보다 중요한 것, 지금 이 순간 알고리즘의 흔들림 없는 원칙이 만들어내는 일상을 가장 맑은 시선으로 경험해 보십시오.
          </p>

          <div className="w-full bg-[#0a0b0e]/80 backdrop-blur-xl border border-[#c8a84b]/20 p-8 md:p-12 lg:p-16 rounded-[32px] shadow-[0_0_80px_rgba(200,168,75,0.05)] text-left">
             {!isSubmitted ? (
               <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="flex flex-col gap-3">
                     <label htmlFor="name" className="text-[14px] text-[#a1a1aa] ml-2 tracking-widest uppercase font-medium">성함</label>
                     <input 
                       id="name"
                       type="text" 
                       required 
                       placeholder="성함을 입력해주세요"
                       className="w-full bg-[#13151a] border border-[#2a2d36] text-white px-6 py-5 rounded-xl focus:outline-none focus:border-[#c8a84b]/70 focus:ring-1 focus:ring-[#c8a84b]/50 transition-all font-light text-[16px]"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                     />
                   </div>
                   <div className="flex flex-col gap-3">
                     <label htmlFor="email" className="text-[14px] text-[#a1a1aa] ml-2 tracking-widest uppercase font-medium">이메일</label>
                     <input 
                       id="email"
                       type="email" 
                       required 
                       placeholder="example@gmail.com"
                       className="w-full bg-[#13151a] border border-[#2a2d36] text-white px-6 py-5 rounded-xl focus:outline-none focus:border-[#c8a84b]/70 focus:ring-1 focus:ring-[#c8a84b]/50 transition-all font-light text-[16px]"
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                     />
                   </div>
                 </div>

                 <div className="flex flex-col gap-3">
                   <label htmlFor="reason" className="text-[14px] text-[#a1a1aa] ml-2 tracking-widest uppercase font-medium">알고리즘 검증 신청 사유 (선택)</label>
                   <textarea 
                     id="reason"
                     rows={3}
                     placeholder="현재 겪고 계신 투자의 어려움이나, 관전자 계정을 통해 어떤 부분을 확인하고 싶으신지 솔직하게 남겨주시면 감사하겠습니다."
                     className="w-full bg-[#13151a] border border-[#2a2d36] text-white px-6 py-5 rounded-xl focus:outline-none focus:border-[#c8a84b]/70 focus:ring-1 focus:ring-[#c8a84b]/50 transition-all font-light text-[16px] resize-none"
                     value={formData.reason}
                     onChange={(e) => setFormData({...formData, reason: e.target.value})}
                   />
                 </div>

                 {errorMsg && <p className="text-red-400 text-sm ml-2">{errorMsg}</p>}

                 <button 
                   type="submit" 
                   disabled={isLoading}
                   className="w-full mt-2 bg-[#c8a84b] hover:bg-[#d4b55c] text-black text-[18px] font-bold py-6 rounded-xl hover:cursor-pointer transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                 >
                   {isLoading ? "접수 중..." : "관전자 계정 신청하기 (2주 체험권)"} 
                   {!isLoading && <ArrowUpRight size={24} />}
                 </button>
               </form>
             ) : (
               <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                 <div className="text-5xl md:text-6xl mb-8 animate-bounce">
                   👏
                 </div>
                 <h3 className="text-3xl text-white font-medium mb-6 tracking-tight">신청이 완료되었습니다!</h3>
                 <p className="text-[#a1a1aa] leading-[1.8] font-light text-[17px] md:text-[19px] break-keep max-w-xl mx-auto">
                   남겨주신 사유를 꼼꼼히 검토한 후, 개방 대상자로 선정되신 분들께 한해 <br className="hidden md:block"/>
                   입력하신 이메일(또는 텔레그램)로 <strong className="text-white font-medium">[관전자 계정 접속 ID/PW]</strong>와 <strong className="text-white font-medium">[3분 만에 끝나는 접속 가이드 링크]</strong>를 안전하게 발송해 드릴 예정입니다.<br/><br/>
                   잠시만 기다려주시면 감사하겠습니다.
                 </p>
               </div>
             )}
              
             {/* Legal Disclaimer */}
             <div className="mt-20 pt-10 border-t border-[#1a1a1a] text-left">
               <h4 className="text-[#c8a84b] text-[13px] font-mono tracking-widest uppercase mb-6">시스템 운용 특성 및 리스크 안내</h4>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] text-[#7a7f8e] font-light leading-[1.8] break-keep">
                 
                 <div className="flex flex-col gap-2">
                   <strong className="text-white font-medium block">1. 살아있는 시장을 위한 지속적인 알고리즘 진화</strong>
                   <p>Treia 엔진은 과거에 머물러 있는 고정된 기계가 아닙니다. 시장의 새로운 변동성 패턴에 대응하고 방어력을 극대화하기 위해, 시스템은 작은 세부 설정(Parameter)부터 핵심 로직까지 지속적인 테스트와 업데이트를 거칩니다. 이 과정에서 알고리즘의 매매 템포나 진입 기준은 더 나은 생존을 위해 사전 예고 없이 유연하게 조정될 수 있습니다.</p>
                 </div>

                 <div className="flex flex-col gap-2">
                   <strong className="text-white font-medium block">2. 브로커 및 물리적 환경에 따른 체결 오차 (슬리피지)</strong>
                   <p>Treia 코어 엔진에서 동일한 진입/청산 신호가 발생하더라도, 실제 체결 결과는 사용자가 이용하는 브로커의 서버 상태, 네트워크 지연 속도(Ping), 해당 시점의 시장 유동성에 따라 달라질 수 있습니다. 이로 인해 마스터 계좌와 완전히 동일한 가격에 체결되지 않는 &apos;슬리피지(Slippage)&apos;나 &apos;스프레드(Spread) 벌어짐&apos; 현상이 발생할 수 있으며, 이는 자동매매의 자연스러운 물리적 특성입니다.</p>
                 </div>

                 <div className="flex flex-col gap-2">
                   <strong className="text-white font-medium block">3. 통제 불가능한 거시적 충격 (블랙스완) 대응 한계</strong>
                   <p>시스템은 철저한 기계적 손절선(방어선)을 구축하고 있으나, 전쟁, 자연재해, 혹은 시장에 극단적인 충격을 주는 예측 불가능한 뉴스(블랙스완) 발생 시에는 금융 시장 자체가 마비될 수 있습니다. 브로커의 호가가 비어버리거나 거래소의 주문 접수가 거부되는 등, 물리적으로 체결이 불가능한 극한의 상황에서 발생하는 손실은 알고리즘이 통제할 수 없는 영역입니다.</p>
                 </div>

                 <div className="flex flex-col gap-2">
                   <strong className="text-white font-medium block">4. 최종 운용 결정권과 자산의 귀속</strong>
                   <p>본 알고리즘 소프트웨어는 투자의 확률적 우위를 점하기 위한 강력한 보조 도구일 뿐, 어떠한 경우에도 100%의 절대 수익이나 무손실을 보장하는 마법이 아닙니다. 소프트웨어의 가동 및 중지, 자금 투입 규모의 결정권은 전적으로 사용자 본인에게 있으며, 모든 금융 거래의 최종적인 결과와 책임은 사용자에게 귀속됩니다. 본 서비스는 알고리즘 기술 검증 목적의 소프트웨어 라이선스 체험에 한합니다.</p>
                 </div>

               </div>
               
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}
