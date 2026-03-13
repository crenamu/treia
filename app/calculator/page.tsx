'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Calculator as CalcIcon, 
  TrendingUp, 
  Target, 
  ArrowRight, 
  Info, 
  CheckCircle2, 
  Coins, 
  Calendar,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Building2,
  Rocket
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function CalculatorPage() {
  const [type, setType] = useState<'deposit' | 'saving'>('deposit')
  const [amount, setAmount] = useState(10000000)
  const [trm, setTrm] = useState(12)
  const [rate, setRate] = useState(3.5)
  const [isCompound, setIsCompound] = useState(false)
  const [isTaxFree, setIsTaxFree] = useState(false)

  // Calculations
  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12
    let totalInterest = 0
    let principal = amount

    if (type === 'deposit') {
      if (isCompound) {
        totalInterest = amount * (Math.pow(1 + monthlyRate, trm) - 1)
      } else {
        totalInterest = amount * (rate / 100) * (trm / 12)
      }
    } else {
      // Savings calculation
      if (isCompound) {
        totalInterest = amount * ((Math.pow(1 + monthlyRate, trm) - 1) / monthlyRate) * (1 + monthlyRate) - (amount * trm)
      } else {
        totalInterest = amount * (trm * (trm + 1) / 2) * monthlyRate
      }
      principal = amount * trm
    }

    const tax = isTaxFree ? 0 : totalInterest * 0.154
    const netInterest = totalInterest - tax
    const total = principal + netInterest

    // Monthly data for chart
    const monthlyData = []
    for (let i = 1; i <= Math.min(trm, 12); i++) {
        const ratio = i / trm;
        monthlyData.push({ month: i, value: principal + (netInterest * ratio) });
    }

    return { principal, totalInterest, tax, netInterest, total, monthlyData }
  }, [type, amount, trm, rate, isCompound, isTaxFree])

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] pb-24 selection:bg-green-100">
      <main className="container mx-auto max-w-6xl px-4 md:px-8 py-12 md:py-20">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center md:text-left"
        >
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/10 text-green-600 rounded-2xl border border-green-600/10 mb-6">
              <Sparkles size={16} className="fill-green-600" />
              <span className="text-[10px] font-black uppercase tracking-[2px]">Premium Financial Intelligence</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-outfit font-black text-gray-900 leading-[0.95] tracking-tighter mb-6">
             미래를 위한<br/>
             <span className="text-green-600">완벽한 수치</span>
           </h1>
           <p className="text-gray-500 font-medium max-w-md text-lg leading-relaxed mx-auto md:mx-0">
             단순한 계산을 넘어, 당신의 자산이 성장하는 과정을<br/>
             가장 정교한 시뮬레이션으로 시각화합니다.
           </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           
           {/* Left: Input Panel */}
           <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-[48px] p-8 md:p-10 shadow-2xl shadow-gray-200/50 border border-gray-100">
                 
                 {/* Type Switch */}
                 <div className="flex p-1.5 bg-gray-100 rounded-[28px] mb-10">
                    <button 
                      onClick={() => setType('deposit')}
                      className={`flex-1 py-4 rounded-[22px] text-sm font-black transition-all ${type === 'deposit' ? 'bg-white text-gray-900 shadow-xl shadow-gray-200/50' : 'text-gray-400'}`}
                    >
                      정기예금
                    </button>
                    <button 
                      onClick={() => setType('saving')}
                      className={`flex-1 py-4 rounded-[22px] text-sm font-black transition-all ${type === 'saving' ? 'bg-white text-gray-900 shadow-xl shadow-gray-200/50' : 'text-gray-400'}`}
                    >
                      정기적금
                    </button>
                 </div>

                 {/* Inputs */}
                 <div className="space-y-10">
                    <InputGroup 
                      label={type === 'deposit' ? '예치 금액' : '월 납입액'} 
                      value={amount} 
                      onChange={setAmount} 
                      unit="원" 
                      step={100000}
                      marks={['100만', '500만', '1000만', '5000만']}
                    />
                    
                    <div className="grid grid-cols-2 gap-8">
                       <InputGroup label="기간" value={trm} onChange={setTrm} unit="개월" step={1} />
                       <InputGroup label="금리" value={rate} onChange={setRate} unit="%" step={0.1} />
                    </div>

                    <div className="pt-8 border-t border-gray-50 space-y-4">
                       <ToggleRow label="월 복리 적용" active={isCompound} onClick={() => setIsCompound(!isCompound)} />
                       <ToggleRow label="세금 우대 (비과세)" active={isTaxFree} onClick={() => setIsTaxFree(!isTaxFree)} />
                    </div>
                 </div>
              </div>

              {/* Quick AI Insight */}
              <div className="bg-gray-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 bg-green-600 rounded-xl"><Target size={20} /></div>
                       <h5 className="font-bold">AI 자산 컨설팅</h5>
                    </div>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">현재 설정하신 {rate}% 금리는 시중 은행 상위 5% 수준입니다. 비과세 혜택 적용 시 실질 수익률이 약 0.7%p 상승합니다.</p>
                    <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                       최고 금리 상품 보러가기 <ChevronRight size={14} />
                    </Link>
                 </div>
              </div>
           </div>

           {/* Right: Results Panel */}
           <div className="lg:col-span-7 space-y-6">
              
              {/* Dynamic Result Hero */}
              <div className="bg-white rounded-[60px] p-10 md:p-14 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
                 <div className="flex-1 space-y-8 w-full">
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-4">만기 시 총 수령액</p>
                       <div className="flex items-baseline gap-1">
                          <span className="text-6xl md:text-7xl font-outfit font-black text-gray-900 tracking-tighter tabular-nums drop-shadow-sm">
                             {results.total.toLocaleString()}
                          </span>
                          <span className="text-xl font-bold text-gray-400">원</span>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                       <ResultItem label="원금" value={results.principal} />
                       <ResultItem label="세후 이자" value={results.netInterest} highlight />
                       <ResultItem label="이자과세 (15.4%)" value={results.tax} isNegative />
                       <ResultItem label="실효 수익률" value={`${(results.netInterest / results.principal * 100 / (trm/12)).toFixed(2)}%`} raw />
                    </div>
                 </div>

                 {/* Visualization */}
                 <div className="w-full md:w-48 flex flex-col items-center gap-6">
                    <div className="relative w-40 h-40">
                       <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-50" strokeWidth="3" />
                          <motion.circle 
                            cx="18" cy="18" r="16" fill="none" className="stroke-green-600" strokeWidth="3"
                            strokeDasharray="100 100"
                            initial={{ strokeDashoffset: 100 }}
                            animate={{ strokeDashoffset: 100 - (results.netInterest / (results.principal + results.netInterest) * 400) }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            strokeLinecap="round"
                          />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-[9px] font-black text-gray-400 uppercase">Interest Ratio</p>
                          <p className="text-xl font-outfit font-black text-green-600">{(results.netInterest / results.total * 100).toFixed(1)}%</p>
                       </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold text-center leading-relaxed">수익금이 원금의<br/>일부분을 구성합니다.</p>
                 </div>
              </div>

              {/* Progress Chart & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm flex flex-col">
                    <h6 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Asset Growth Flow</h6>
                    <div className="flex-1 flex items-end gap-2 min-h-[120px]">
                       {results.monthlyData.map((d, i) => (
                         <motion.div 
                            key={i} 
                            initial={{ height: 0 }} 
                            animate={{ height: `${(d.value / results.total) * 100}%` }}
                            className="flex-1 bg-green-500/10 rounded-t-lg border-x border-t border-green-500/20 hover:bg-green-500/30 transition-colors"
                         />
                       ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-black text-gray-300">
                       <span>START</span>
                       <span>END ({trm}m)</span>
                    </div>
                 </div>

                 <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm space-y-6">
                    <h6 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recommended Products</h6>
                    <div className="space-y-3">
                       <RecommendedLink title="신한 My플러스 정기예금" rate="연 3.85%" />
                       <RecommendedLink title="우리 첫거래 우대 예금" rate="연 4.10%" />
                       <RecommendedLink title="KB Star 정기적금" rate="연 4.50%" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}

function InputGroup({ label, value, onChange, unit, step, marks }: { label: string, value: number, onChange: (v: number) => void, unit: string, step: number, marks?: string[] }) {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
          <div className="flex items-center gap-1">
             <input 
               type="text" 
               value={value.toLocaleString()} 
               onChange={e => onChange(Number(e.target.value.replace(/[^0-9]/g, '')))}
               className="text-right font-outfit font-black text-xl text-gray-900 outline-none w-32"
             />
             <span className="text-sm font-bold text-gray-400">{unit}</span>
          </div>
       </div>
       <div className="relative h-1 bg-gray-100 rounded-full">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-green-600 rounded-full" 
            style={{ width: `${Math.min((value / (label.includes('금리') ? 10 : 100000000)) * 100, 100)}%` }}
          />
       </div>
       {marks && (
          <div className="flex justify-between">
             {marks.map(m => (
               <button key={m} className="text-[9px] font-bold text-gray-300 hover:text-green-600 transition-colors" onClick={() => onChange(Number(m.replace(/[^0-9]/g, '')) * (m.includes('만') ? 10000 : 1))}>{m}</button>
             ))}
          </div>
       )}
    </div>
  )
}

function ToggleRow({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer" onClick={onClick}>
       <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
       <div className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${active ? 'bg-green-600' : 'bg-gray-200'}`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
       </div>
    </div>
  )
}

function ResultItem({ label, value, highlight, isNegative, raw }: { label: string, value: any, highlight?: boolean, isNegative?: boolean, raw?: boolean }) {
  return (
    <div className="space-y-1">
       <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{label}</p>
       <p className={`text-lg font-outfit font-black ${highlight ? 'text-green-600' : isNegative ? 'text-pink-500' : 'text-gray-900'}`}>{raw ? value : `${Number(value).toLocaleString()}원`}</p>
    </div>
  )
}

function RecommendedLink({ title, rate }: { title: string, rate: string }) {
  return (
    <Link href="/" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group border border-transparent hover:border-green-100 hover:bg-white transition-all shadow-sm">
       <div className="min-w-0">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">BEST RECOMMEND</p>
          <p className="text-xs font-bold text-gray-900 truncate">{title}</p>
       </div>
       <div className="text-right shrink-0">
          <p className="text-sm font-black text-green-600">{rate}</p>
          <p className="text-[9px] font-bold text-gray-300 flex items-center justify-end">Apply <ChevronRight size={10} /></p>
       </div>
    </Link>
  )
}
