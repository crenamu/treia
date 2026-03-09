'use client'
import { useState, useMemo } from "react";
import { 
  Network, ChevronRight, Zap, Cpu, BarChart3, 
  ShieldCheck, Layers, Filter, Code2, Sparkles, SlidersHorizontal, Trash2, Plus, Play,
  CandlestickChart, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LogicNode {
  instanceId: string;
  id: string;
  name: string;
  cat: string;
  params: Record<string, number | string>;
}

const INDICATOR_DB = {
  rsi: { name: 'RSI (상대강도지수)', cat: 'Oscillator', params: { period: 14, overbought: 70, oversold: 30 } },
  ma: { name: 'Moving Average (이평선)', cat: 'Trend', params: { period: 20, method: 'Simple', applied: 'Close' } },
  bollinger: { name: 'Bollinger Bands', cat: 'Volatility', params: { period: 20, deviation: 2.0 } },
  macd: { name: 'MACD', cat: 'Oscillator', params: { fast: 12, slow: 26, signal: 9 } },
  stoch: { name: 'Stochastic', cat: 'Oscillator', params: { k: 5, d: 3, slowing: 3 } },
  engulfing: { name: 'Engulfing Pattern', cat: 'Candle', params: { minBodySize: 10 } },
  breakout: { name: 'Range Breakout', cat: 'Price Action', params: { lookback: 20 } },
};

export default function EABuilderPage() {
  const [activeStep, setActiveStep] = useState(2);
  const [nodes, setNodes] = useState<LogicNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const steps = [
    { id: 1, title: '전략 아키텍처', icon: <Layers size={18} /> },
    { id: 2, title: '매수 로직 (Buy)', icon: <CandlestickChart size={18} /> },
    { id: 3, title: '매도 로직 (Sell)', icon: <Target size={18} /> },
    { id: 4, title: '자금 및 리스크', icon: <ShieldCheck size={18} /> },
    { id: 5, title: 'AI 백테스트', icon: <Play size={18} /> }
  ];

  const addNode = (id: string) => {
    const proto = INDICATOR_DB[id as keyof typeof INDICATOR_DB];
    const newNode: LogicNode = {
      instanceId: `node_${nodes.length}_${id}_${Math.floor(Math.random() * 1000)}`,
      id,
      name: proto.name,
      cat: proto.cat,
      params: { ...proto.params } as Record<string, number | string>
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNode.instanceId);
  };

  const removeNode = (instanceId: string) => {
    setNodes(nodes.filter(n => n.instanceId !== instanceId));
    if (selectedNodeId === instanceId) setSelectedNodeId(null);
  };

  const selectedNode = useMemo(() => nodes.find(n => n.instanceId === selectedNodeId), [nodes, selectedNodeId]);

  return (
    <div className="bg-[#0B0D10] text-[#E2E8F0] min-h-screen font-outfit">
      <div className="container mx-auto px-6 py-8 flex flex-col gap-8 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="flex items-center justify-between bg-[#14161B] border border-gray-800/50 p-5 rounded-[24px] shadow-2xl backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group relative">
                <Network size={26} className="group-hover:rotate-90 transition-transform duration-500" />
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-50"></div>
             </div>
             <div>
                <h1 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
                   TREIA STUDIO <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded italic">Engine v4.0</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">AI Quantum Integration Active</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-800 bg-gray-900/50 text-gray-400 font-bold text-xs uppercase hover:bg-gray-800 hover:text-white transition-all">
                <Filter size={14} /> 템플릿 로드
             </button>
             <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs uppercase hover:bg-white transition-all shadow-xl shadow-amber-500/20">
                <Code2 size={16} /> MQL5 소스 생성
             </button>
          </div>
        </header>

        {/* Builder Container */}
        <div className="flex flex-col lg:flex-row gap-8 flex-grow overflow-hidden pb-4">
           
           {/* Sidebar */}
           <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0 h-full overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-col gap-2">
                 {steps.map(step => (
                    <motion.button 
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-between p-4 rounded-2xl w-full transition-all border-2 ${
                        activeStep === step.id 
                          ? 'bg-amber-500 border-amber-500 text-black shadow-2xl shadow-amber-500/20' 
                          : 'bg-[#14161B] border-gray-800/40 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                       <div className="flex items-center gap-4 font-bold text-sm tracking-tight">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${activeStep === step.id ? 'bg-black/10' : 'bg-[#1C2128]'}`}>
                             {step.icon}
                          </span>
                          {step.title}
                       </div>
                       {activeStep === step.id && <ChevronRight size={18} />}
                    </motion.button>
                 ))}
              </div>

              {/* AI Insight Panel */}
              <div className="p-6 rounded-[24px] bg-[#14161B] border border-gray-800/50 relative overflow-hidden group shrink-0">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={40} className="text-amber-500" />
                 </div>
                 <h4 className="text-[11px] font-black uppercase text-amber-500 tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Cpu size={14} /> AI Strategy Consultant
                 </h4>
                 <div className="space-y-4">
                    <div className="p-3 bg-gray-900/50 rounded-xl border border-gray-800/50">
                       <p className="text-xs text-gray-400 leading-relaxed italic">
                          &quot;현재 매수 로직은 추세 추종 방식입니다. RSI와 MA 교차를 조합하면 허위 돌파를 24% 더 효과적으로 걸러낼 수 있습니다.&quot;
                       </p>
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">승률 시뮬레이션 (Expectancy)</span>
                       <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: nodes.length > 0 ? '62%' : '0%' }}
                            className="bg-emerald-500 h-full shadow-[0_0_10px_#10b981]"
                          ></motion.div>
                       </div>
                       <div className="flex justify-between text-[10px] font-bold text-gray-500">
                          <span>WIN RATE</span>
                          <span className="text-emerald-500">62.4%</span>
                       </div>
                    </div>
                 </div>
              </div>
           </aside>

           {/* Main Creative Canvas */}
           <main className="flex-grow flex flex-col gap-6 overflow-hidden h-full">
              <div className="flex-grow bg-[#14161B] rounded-[32px] border border-gray-800/50 relative overflow-hidden flex flex-col shadow-inner min-h-[400px]">
                 
                 {/* Canvas Header */}
                 <div className="p-6 border-b border-gray-800/50 flex flex-wrap justify-between items-center bg-[#181B21]/50 shrink-0 gap-4">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
                       <h2 className="text-xl font-black text-white tracking-tight">Logic Designer</h2>
                    </div>
                    <div className="flex gap-2">
                       {Object.keys(INDICATOR_DB).slice(0, 4).map(id => (
                          <button 
                            key={id}
                            onClick={() => addNode(id)}
                            className="px-4 py-2 bg-gray-900 text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-800 rounded-xl hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all active:scale-95"
                          >
                             + {id}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Node Flow */}
                 <div className="flex-grow p-10 flex items-center justify-center gap-8 overflow-x-auto relative custom-scrollbar">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    
                    <div className="flex items-center gap-12 relative z-10 min-w-max">
                       <div className="w-16 h-16 rounded-full border-4 border-gray-800 flex items-center justify-center text-gray-600 bg-[#14161B] shadow-xl shrink-0">
                          <Play size={24} />
                       </div>

                       <AnimatePresence>
                          {nodes.map((node, idx) => (
                             <motion.div 
                               key={node.instanceId}
                               initial={{ opacity: 0, y: 20, scale: 0.8 }}
                               animate={{ opacity: 1, y: 0, scale: 1 }}
                               exit={{ opacity: 0, scale: 0.5 }}
                               onClick={() => setSelectedNodeId(node.instanceId)}
                               className={`group relative p-6 rounded-[24px] border-2 transition-all cursor-pointer min-w-[180px] shadow-2xl ${
                                 selectedNodeId === node.instanceId ? 'bg-amber-500 border-amber-500 text-black scale-105' : 'bg-[#1C2128] border-gray-800 text-white'
                               }`}
                             >
                                <span className={`text-[9px] font-black uppercase mb-2 block ${selectedNodeId === node.instanceId ? 'text-black/60' : 'text-amber-500'}`}>
                                   {node.cat}
                                </span>
                                <h4 className="font-black text-sm tracking-tight mb-2 leading-none">{node.name}</h4>
                                <div className={`flex gap-1 ${selectedNodeId === node.instanceId ? 'text-black/80' : 'text-gray-500'}`}>
                                   {Object.entries(node.params).slice(0, 2).map(([k, v]) => (
                                      <span key={k} className="text-[10px] bg-black/5 px-1.5 py-0.5 rounded leading-none">{k}:{v}</span>
                                   ))}
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); removeNode(node.instanceId); }}
                                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                   <Trash2 size={14} />
                                </button>
                                {idx < nodes.length - 1 && (
                                   <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-gray-600">
                                      <ChevronRight size={24} />
                                   </div>
                                )}
                             </motion.div>
                          ))}
                       </AnimatePresence>

                       {nodes.length === 0 && (
                          <div className="flex flex-col items-center gap-4 text-gray-600">
                             <div className="w-20 h-20 rounded-[32px] border-2 border-dashed border-gray-800 flex items-center justify-center">
                                <Plus size={32} />
                             </div>
                             <p className="text-sm font-bold">지표를 추가하여 전략 설계를 시작하세요</p>
                          </div>
                       )}

                       {nodes.length > 0 && (
                          <div className="flex items-center gap-12 shrink-0">
                             <div className="text-gray-600">
                                <ChevronRight size={24} />
                             </div>
                             <div className="w-16 h-16 rounded-[20px] bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10 font-black text-xs italic">
                                ORDER
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>

              {/* Lower Parameter Panel */}
              <div className="h-1/3 bg-[#14161B] border border-gray-800/50 rounded-[32px] flex overflow-hidden shrink-0 min-h-[160px]">
                 <div className="w-1/3 border-r border-gray-800/50 p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                       <SlidersHorizontal size={14} /> Node Parameters
                    </h3>
                    {selectedNode ? (
                       <div className="space-y-5">
                          {Object.entries(selectedNode.params).map(([key, value]) => (
                             <div key={key} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center px-1">
                                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{key}</label>
                                   <span className="text-[10px] font-black text-amber-500">{value}</span>
                                </div>
                                <input 
                                  readOnly
                                  type="range" 
                                  className="w-full accent-amber-500 bg-gray-800 rounded-lg appearance-none cursor-pointer h-1.5"
                                  min="1" max="100" value={typeof value === 'number' ? value : 20}
                                />
                             </div>
                          ))}
                       </div>
                    ) : (
                       <p className="text-[10px] text-gray-600 font-bold text-center mt-6">지표를 선택하면 세부 설정을 변경할 수 있습니다.</p>
                    )}
                 </div>

                 <div className="w-2/3 p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                          <BarChart3 size={14} /> Performance Outlook
                       </h3>
                       <div className="flex gap-6">
                          <div className="flex flex-col items-end">
                             <span className="text-[9px] text-gray-600 font-black uppercase tracking-tighter">Profit Factor</span>
                             <span className="text-sm font-black text-white">1.84</span>
                          </div>
                          <div className="flex flex-col items-end">
                             <span className="text-[9px] text-gray-600 font-black uppercase tracking-tighter">Drawdown</span>
                             <span className="text-sm font-black text-red-500">4.2%</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex-grow flex items-end gap-1 px-4 mb-2">
                       {[40, 60, 45, 78, 90, 85, 95, 80, 70, 85, 100, 92, 110, 105, 120].map((h, i) => (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            className="flex-grow bg-gradient-to-t from-emerald-500/20 to-emerald-500 rounded-t-sm"
                          ></motion.div>
                       ))}
                    </div>
                 </div>
              </div>
           </main>
        </div>
      </div>
    </div>
  )
}
