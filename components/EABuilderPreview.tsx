'use client'
import { motion } from "framer-motion";
import { Zap, Cpu, ChevronRight, Code2 } from "lucide-react";
import Link from "next/link";

export default function EABuilderPreview() {
  return (
    <section className="w-full py-12">
      <div className="bg-gradient-to-br from-[#14161B] to-[#0B0D10] border border-gray-800 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl group">
        {/* Animated Background Gradients */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full group-hover:bg-amber-500/20 transition-all duration-1000"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full"></div>

        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          {/* Left: Content */}
          <div className="flex flex-col gap-6 lg:w-1/2">
            <div className="flex items-center gap-2 text-amber-500">
              <Zap size={16} className="fill-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">No-Code Studio</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
              나만의 <span className="text-amber-500 italic">EA</span>를<br />
              코딩 없이 디자인하세요
            </h2>
            
            <p className="text-gray-400 font-medium leading-relaxed text-lg max-w-lg">
              복잡한 MQL5 코딩은 트레이아가 대신합니다. 지표 노드를 드래그 앤 드롭하여 전략을 짜고, AI 컨설턴트의 검증을 거쳐 즉시 실행 가능한 봇을 만드세요.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <Link href="/ea/builder" className="px-8 py-4 bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl shadow-amber-500/10 flex items-center gap-2 group/btn">
                빌더 시작하기 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gray-900/50 border border-gray-800 text-gray-400 font-bold text-sm">
                <Cpu size={18} className="text-amber-500/50" />
                AI 분석 엔진 탑재
              </div>
            </div>
          </div>

          {/* Right: Visual Mockup/Teaser */}
          <div className="lg:w-1/2 w-full">
            <div className="relative aspect-square md:aspect-video lg:aspect-square bg-[#0B0D10] rounded-3xl border border-gray-800 shadow-inner flex items-center justify-center overflow-hidden p-8">
              {/* Fake Node UI */}
              <div className="flex items-center gap-6 relative">
                 <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="p-5 rounded-2xl bg-[#1C2128] border border-amber-500/30 shadow-2xl min-w-[140px]"
                 >
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block mb-1">Oscillator</span>
                    <h4 className="font-black text-sm text-white">RSI (14)</h4>
                    <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                       <div className="bg-amber-500 h-full w-2/3"></div>
                    </div>
                 </motion.div>

                 <div className="flex flex-col gap-2 items-center">
                    <div className="h-px w-8 bg-gray-800"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
                       <PlusIcon size={14} className="text-gray-600" />
                    </div>
                    <div className="h-px w-8 bg-gray-800"></div>
                 </div>

                 <motion.div 
                   animate={{ y: [0, 10, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   className="p-5 rounded-2xl bg-[#1C2128] border border-blue-500/30 shadow-2xl min-w-[140px]"
                 >
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Trend</span>
                    <h4 className="font-black text-sm text-white">MA Cross</h4>
                    <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                       <div className="bg-blue-400 h-full w-1/2"></div>
                    </div>
                 </motion.div>

                 {/* Floating Badges */}
                 <div className="absolute -top-12 -right-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                   Profit Factor 1.84
                 </div>
                 <div className="absolute -bottom-10 -left-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <Code2 size={12} /> Auto MQ5
                 </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlusIcon({ size, className }: { size: number, className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
  );
}
