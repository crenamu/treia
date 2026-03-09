'use client'
import { useState } from "react";
import { Bot, Settings2, CandlestickChart, Database, Network, Play, Save, CheckCircle2, ChevronRight, Zap, Target } from "lucide-react";

export default function EABuilderPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  
  const steps = [
    { id: 1, title: '기본 설정', icon: <Settings2 size={18} /> },
    { id: 2, title: '진입/청산 로직', icon: <CandlestickChart size={18} /> },
    { id: 3, title: '리스크 관리', icon: <Target size={18} /> },
    { id: 4, title: '시뮬레이션', icon: <Play size={18} /> }
  ];

  const logicOptions = [
    { id: 'rsi', name: 'RSI 과매수/과매도', cat: '지표', desc: 'RSI 30 이하 매수, 70 이상 매도' },
    { id: 'ma_cross', name: '이동평균선 교차', cat: '지표', desc: '단기 이평선이 장기 이평선을 상향 돌파 시 매수' },
    { id: 'engulfing', name: '장악형 캔들', cat: '캔들패턴', desc: '하락장악형/상승장악형 출현 시 진입' },
    { id: 'doji', name: '도지 반전', cat: '캔들패턴', desc: '추세 끝단 도지 발생 후 진입' },
    { id: 'snd', name: '매물대 (S&D Zone)', cat: '차트패턴', desc: '강한 지지/저항 구간 도달 시 진입' },
    { id: 'trendline', name: '추세선 터치', cat: '차트패턴', desc: '추세선 터치 시 반등 매수/매도' },
  ];

  const toggleLogic = (id: string) => {
    setSelectedIndicators(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl flex flex-col gap-8 h-[calc(100vh-80px)]">
       {/* Header */}
       <header className="flex items-center justify-between bg-[#14161B] border border-gray-800 p-6 rounded-[32px]">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <Network size={24} />
             </div>
             <div className="flex flex-col">
                <h1 className="text-2xl font-black font-outfit uppercase tracking-tight text-white flex items-center gap-2">
                   EA Studio <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[9px] tracking-widest leading-none">BETA</span>
                </h1>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">No-Code Trading Bot Builder</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="px-5 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-300 font-bold text-xs uppercase hover:bg-white hover:text-black hover:border-white transition-all">
                불러오기
             </button>
             <button className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs uppercase hover:bg-white transition-all flex items-center gap-2 shadow-xl shadow-amber-500/10">
                <Save size={14} /> 저장 후 내보내기 (.mq5)
             </button>
          </div>
       </header>

       {/* Builder Main */}
       <div className="flex flex-col lg:flex-row gap-8 flex-grow overflow-hidden">
          {/* Sidebar / Steps */}
          <div className="w-full lg:w-64 flex flex-col gap-4">
             {steps.map(step => (
                <button 
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl w-full transition-all border ${
                    activeStep === step.id 
                      ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20' 
                      : 'bg-[#181B21] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                  }`}
                >
                   <div className="flex items-center gap-3 font-bold text-sm tracking-tight">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${activeStep === step.id ? 'bg-black/20' : 'bg-gray-800'}`}>
                         {step.id}
                      </span>
                      {step.title}
                   </div>
                   <ChevronRight size={16} className={`opacity-50 ${activeStep === step.id ? 'text-black' : ''}`} />
                </button>
             ))}

             <div className="mt-auto p-5 rounded-2xl bg-gray-900/50 border border-gray-800/50 flex flex-col gap-3">
                <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-1.5"><Zap size={10} className="text-amber-500" /> Builder AI</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">선택된 로직을 AI가 검토하여 상충되거나 위험한 조건이 있는지 분석합니다.</p>
                <div className="w-full bg-gray-800 rounded-full h-1 mt-2 overflow-hidden">
                   <div className="bg-amber-500 h-full w-[10%]"></div>
                </div>
             </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-grow bg-[#14161B] border border-gray-800 rounded-[32px] overflow-hidden flex flex-col">
             {/* Step 2 Content: 진입/청산 로직 */}
             {activeStep === 2 ? (
               <div className="flex flex-col h-full">
                 <div className="p-8 border-b border-gray-800/50">
                    <h2 className="text-xl font-black text-white mb-2">진입 로직 구성</h2>
                    <p className="text-sm text-gray-500 font-medium">조합하고 싶은 지표와 가격 패턴을 선택하세요. 여러 조건을 AND/OR 로 연결할 수 있습니다.</p>
                 </div>
                 
                 <div className="p-8 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                    {logicOptions.map(opt => {
                       const isSelected = selectedIndicators.includes(opt.id);
                       return (
                         <div 
                           key={opt.id}
                           onClick={() => toggleLogic(opt.id)}
                           className={`p-5 rounded-2xl cursor-pointer transition-all border-2 flex gap-4 items-start ${
                             isSelected ? 'bg-amber-500/10 border-amber-500' : 'bg-[#181B21] border-transparent hover:border-gray-700'
                           }`}
                         >
                            <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                               isSelected ? 'bg-amber-500 border-amber-500 text-black' : 'border-gray-600'
                            }`}>
                               {isSelected && <CheckCircle2 size={12} />}
                            </div>
                            <div className="flex flex-col gap-1.5">
                               <div className="flex items-center gap-2">
                                  <span className="text-[9px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-bold uppercase tracking-widest">{opt.cat}</span>
                                  <h4 className={`text-base font-bold ${isSelected ? 'text-amber-500' : 'text-white'}`}>{opt.name}</h4>
                               </div>
                               <p className="text-xs text-gray-500 font-medium leading-relaxed">{opt.desc}</p>
                            </div>
                         </div>
                       )
                    })}
                 </div>

                 {/* Logic Visualizer */}
                 {selectedIndicators.length > 0 && (
                   <div className="p-6 bg-[#0B0D10] border-t border-gray-800 h-1/3 flex flex-col gap-4 overflow-y-auto">
                     <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                       <Database size={12} /> 전략 파이프라인
                     </h3>
                     <div className="flex flex-wrap items-center gap-3">
                        <span className="px-4 py-2 bg-gray-800 rounded-xl text-xs font-bold text-white border border-gray-700">로직 시작</span>
                        {selectedIndicators.map((id) => {
                           const item = logicOptions.find(o => o.id === id);
                           return (
                             <div key={id} className="flex items-center gap-3">
                               <ArrowRight size={14} className="text-gray-600" />
                               <div className="px-4 py-2 border border-amber-500/30 bg-amber-500/10 rounded-xl text-amber-500 font-bold text-xs">
                                 {item?.name}
                               </div>
                             </div>
                           )
                        })}
                        <ArrowRight size={14} className="text-gray-600" />
                        <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-bold uppercase tracking-widest">매수/매도 진입</span>
                     </div>
                   </div>
                 )}
               </div>
             ) : (
               <div className="flex items-center justify-center h-full flex-col gap-4 text-gray-500">
                  <Bot size={48} className="text-gray-800" />
                  <p className="font-bold">이 단계는 준비 중입니다. (진입/청산 로직을 선택하세요)</p>
               </div>
             )}
          </div>
       </div>
    </div>
  )
}

function ArrowRight(props: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  const { size = 24, ...rest } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M5 12h14"/>
      <path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
