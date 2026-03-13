'use client'

import { useState } from 'react'
import { 
  Calculator as CalcIcon, 
  TrendingUp, 
  Coins, 
  Scale,
  RefreshCw,
  Info,
  ShieldCheck,
  Dot,
  ArrowUpRight,
  Target
} from 'lucide-react'
import Link from 'next/link'

export default function CalculatorPage() {
  const [calcType, setCalcType] = useState('deposit') // 'deposit' or 'savings'
  const [amount, setAmount] = useState(10000000)
  const [term, setTerm] = useState(12)
  const [rate, setRate] = useState(4.0)
  const [taxFree, setTaxFree] = useState(false)

  // Calculation Logic
  const getResult = () => {
    const r = rate / 100
    const t = term / 12
    let interest = 0
    
    if (calcType === 'deposit') {
      // Periodic compound or simple
      interest = amount * r * t
    } else {
      // Savings
      interest = amount * r * term * (term + 1) / 24
    }

    const taxRate = taxFree ? 0 : 0.154
    const tax = interest * taxRate
    const finalInterest = interest - tax
    const total = (calcType === 'deposit' ? amount : amount * term) + finalInterest
    const goalProb = Math.min(98, Math.floor((rate / 5) * 100))

    return {
      total: Math.floor(total),
      interest: Math.floor(finalInterest),
      tax: Math.floor(tax),
      grossInterest: Math.floor(interest),
      goalProb
    }
  }

  const result = getResult()

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] py-12 md:py-20">
      <main className="container mx-auto max-w-5xl px-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left: Input Sidebar */}
          <div className="w-full lg:w-[400px] flex flex-col gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 text-white rounded-full mb-6">
                <CalcIcon size={12} />
                <span className="text-[10px] font-black uppercase tracking-wider">금융 계산기</span>
              </div>
              <h1 className="text-4xl font-outfit font-black text-gray-900 tracking-tighter leading-tight">
                이자 계산기
              </h1>
            </div>

            <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm space-y-8">
              {/* Type Toggle */}
              <div className="flex p-1 bg-gray-50 rounded-2xl">
                <button 
                  onClick={() => setCalcType('deposit')}
                  className={`flex-1 py-4 rounded-xl text-sm font-bold transition-all ${
                    calcType === 'deposit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
                  }`}
                >
                  예금 (목돈 굴리기)
                </button>
                <button 
                  onClick={() => setCalcType('savings')}
                  className={`flex-1 py-4 rounded-xl text-sm font-bold transition-all ${
                    calcType === 'savings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
                  }`}
                >
                  적금 (목돈 모으기)
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Coins size={14} /> {calcType === 'deposit' ? '예치 금액' : '월 납입액'}
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full text-2xl font-black text-gray-900 pb-2 border-b-2 border-gray-100 focus:border-gray-900 outline-none transition-colors"
                  />
                  <span className="absolute right-0 bottom-2 text-xl font-bold text-gray-400">원</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                   {[100, 500, 1000].map(v => (
                     <button 
                       key={v}
                       onClick={() => setAmount(v * 10000)}
                       className="px-4 py-2 bg-gray-50 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all"
                     >
                       {v >= 1000 ? `${v/1000}천` : v}만
                     </button>
                   ))}
                </div>
              </div>

              {/* Term & Rate */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">예치 기간</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={term}
                      onChange={(e) => setTerm(Number(e.target.value))}
                      className="w-full text-2xl font-black text-gray-900 pb-2 border-b-2 border-gray-100 focus:border-gray-900 outline-none transition-colors"
                    />
                    <span className="absolute right-0 bottom-2 text-xl font-bold text-gray-400">개월</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">연 이자율</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-full text-2xl font-black text-gray-900 pb-2 border-b-2 border-gray-100 focus:border-gray-900 outline-none transition-colors"
                    />
                    <span className="absolute right-0 bottom-2 text-xl font-bold text-gray-400">%</span>
                  </div>
                </div>
              </div>

              {/* Tax Free Toggle */}
              <div className="pt-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">비과세 적용 (ISA 등)</span>
                  <span className="text-[10px] text-gray-400 font-medium">15.4% 세제 혜택 여부</span>
                </div>
                <button 
                  onClick={() => setTaxFree(!taxFree)}
                  className={`w-14 h-8 rounded-full transition-all relative ${taxFree ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${taxFree ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Results Content */}
          <div className="flex-1 space-y-12">
            <div className="bg-white rounded-[48px] p-8 md:p-16 shadow-xl shadow-gray-200/50 border border-gray-100">
               <div className="flex flex-col items-center text-center mb-12">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-[2px]">만기 예상 수령액</span>
                  </div>
                  <h2 className="text-5xl md:text-8xl font-outfit font-black text-gray-900 tracking-tighter leading-none mb-6">
                    {result.total.toLocaleString()} <span className="text-3xl md:text-4xl text-gray-400">원</span>
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-2xl border border-green-100">
                       <TrendingUp size={16} />
                       <span className="text-sm font-black">순수자산 +{result.interest.toLocaleString()}원 증가</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
                       <Target size={16} />
                       <span className="text-sm font-black">목표 달성 가능성 {result.goalProb}%</span>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResultCard 
                     label="원금 합계" 
                     value={((calcType === 'deposit' ? amount : amount * term)).toLocaleString() + '원'} 
                     icon={<ShieldCheck className="text-blue-500" />}
                  />
                  <ResultCard 
                     label="세전 이자" 
                     value={result.grossInterest.toLocaleString() + '원'} 
                     icon={<RefreshCw className="text-orange-500" />}
                  />
                  <ResultCard 
                     label="이자소득세" 
                     value={taxFree ? '0원' : `-${result.tax.toLocaleString()}원`} 
                     icon={<Scale className="text-red-500" />}
                     sub={taxFree ? '비과세 혜택 적용됨' : '일반과세 15.4%'}
                  />
                  <ResultCard 
                     label="세후 이자" 
                     value={result.interest.toLocaleString() + '원'} 
                     icon={<TrendingUp className="text-green-500" />}
                     highlight
                  />
               </div>
            </div>

            {/* Recommended Products based on calculation */}
            <div className="space-y-6">
               <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 pl-2">
                  <Dot className="text-blue-500 scale-[2]" />
                  조건에 맞는 추천 상품
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RecommendedCard 
                    title="SC제일은행 e-그린세이브예금" 
                    rate="최고 4.05%" 
                    desc="공시 금리 기준 1위"
                    link="/deposits"
                  />
                  <RecommendedCard 
                    title="카카오뱅크 정기예금" 
                    rate="최고 3.80%" 
                    desc="사용자 선호도 1위"
                    link="/deposits"
                  />
               </div>
            </div>

            {/* Hint Banner */}
            <div className="bg-gray-900 rounded-[40px] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="space-y-2 text-center md:text-left">
                  <h4 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
                     <ShieldCheck className="text-green-400" />
                     ISA 계좌를 활용해 보셨나요?
                  </h4>
                  <p className="text-gray-400 text-sm font-medium">
                     ISA 계좌는 일정 금액까지 비과세 혜택을 제공하여 수익을 극대화할 수 있습니다.
                  </p>
               </div>
               <Link href="/isa" className="px-8 py-5 bg-white text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-white/10 hover:scale-105 transition-all w-full md:w-auto text-center">
                  ISA 혜택 자세히 보기
               </Link>
            </div>

            {/* Notice */}
            <div className="p-8 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-start gap-4">
               <Info size={24} className="text-blue-500 shrink-0 mt-1" />
               <div className="space-y-1">
                  <h5 className="text-sm font-bold text-blue-900">계산기 유의사항</h5>
                  <p className="text-xs text-blue-800/60 leading-relaxed font-medium">
                    본 계산 결과는 단리 방식을 기준으로 한 예시이며 가입 시기 및 이자 지급 방식(복리 등), 실제 공시 금리에 따라 소폭 차이가 있을 수 있습니다.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function ResultCard({ label, value, icon, sub, highlight }: { label: string, value: string, icon: React.ReactNode, sub?: string, highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-3xl border border-gray-100 ${highlight ? 'bg-green-50/30 ring-2 ring-green-500/10' : 'bg-gray-50/50'}`}>
       <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
             {icon}
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
       </div>
       <p className={`text-2xl font-outfit font-black ${highlight ? 'text-green-700' : 'text-gray-900'}`}>{value}</p>
       {sub && <p className="mt-2 text-[10px] text-gray-400 font-medium">{sub}</p>}
    </div>
  )
}

function RecommendedCard({ title, rate, desc, link }: { title: string, rate: string, desc: string, link: string }) {
  return (
    <Link href={link} className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
       <div className="flex items-start justify-between mb-6">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest py-1 px-3 bg-blue-50 rounded-lg">{desc}</p>
          <ArrowUpRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
       </div>
       <h4 className="text-lg font-bold text-gray-900 mb-2 truncate">{title}</h4>
       <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400">최고 금리</span>
          <span className="text-xl font-black text-gray-900">{rate}</span>
       </div>
    </Link>
  )
}
