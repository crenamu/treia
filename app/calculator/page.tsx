'use client'

import { useState } from 'react'
import { Calculator as CalcIcon, RefreshCw, Info } from 'lucide-react'

export default function CalculatorPage() {
  const [amount, setAmount] = useState<number>(10000000) // 1000만원
  const [term, setTerm] = useState<number>(12) // 12개월
  const [rate, setRate] = useState<number>(3.5) // 3.5%
  const [isCompound, setIsCompound] = useState(false) // 단리/복리

  // 계산 결과
  const totalInterest = isCompound 
    ? amount * (Math.pow(1 + (rate / 100 / 12), term) - 1)
    : amount * (rate / 100) * (term / 12)
  
  const tax = totalInterest * 0.154 // 이자소득세 15.4%
  const netInterest = totalInterest - tax
  const totalAmount = amount + netInterest

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] py-12">
      <div className="container mx-auto max-w-2xl px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <CalcIcon className="text-green-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-outfit font-black text-gray-900 tracking-tighter">금융 계산기</h1>
            <p className="text-sm text-gray-500 font-medium">세후 수령액을 미리 확인해보세요.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">예치 금액 (원)</label>
              <input 
                type="number" 
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full text-2xl font-outfit font-black p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
              <div className="flex gap-2">
                {[100, 500, 1000, 5000].map(v => (
                  <button 
                    key={v}
                    onClick={() => setAmount(prev => prev + v * 10000)}
                    className="text-[10px] font-bold px-3 py-1 bg-white border border-gray-100 rounded-lg text-gray-500 hover:border-green-200 hover:text-green-600 transition-all"
                  >
                    +{v}만
                  </button>
                ))}
                <button 
                  onClick={() => setAmount(0)}
                  className="text-[10px] font-bold px-3 py-1 bg-white border border-gray-100 rounded-lg text-red-400 hover:bg-red-50 transition-all"
                >
                  초기화
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">예치 기간 (개월)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={term}
                    onChange={e => setTerm(Number(e.target.value))}
                    className="w-full text-xl font-outfit font-black p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">개월</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">연 이자율 (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    value={rate}
                    onChange={e => setRate(Number(e.target.value))}
                    className="w-full text-xl font-outfit font-black p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50/50 rounded-2xl border border-green-100">
              <div className="flex-1">
                <p className="text-xs font-bold text-green-800 uppercase tracking-widest mb-1">이자 계산 방식</p>
                <p className="text-xs text-green-700/70 font-medium">단리는 원금에만, 복리는 이자에도 이자가 붙습니다.</p>
              </div>
              <div className="flex bg-white p-1 rounded-xl shadow-sm">
                <button 
                  onClick={() => setIsCompound(false)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${!isCompound ? 'bg-green-600 text-white' : 'text-gray-400'}`}
                >
                  단리
                </button>
                <button 
                  onClick={() => setIsCompound(true)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${isCompound ? 'bg-green-600 text-white' : 'text-gray-400'}`}
                >
                  복리
                </button>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Results */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <p className="text-sm font-bold text-gray-500">만기 시 수령액 (세후)</p>
              <div className="text-right">
                <span className="text-4xl font-outfit font-black text-green-600">{Math.floor(totalAmount).toLocaleString()}</span>
                <span className="text-xl font-bold text-green-600 ml-1">원</span>
              </div>
            </div>

            <div className="space-y-3 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">원금</span>
                <span className="text-gray-700 font-bold">{amount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">세전 이자</span>
                <span className="text-gray-700 font-bold">{Math.floor(totalInterest).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">이자소득세 (15.4%)</span>
                <span className="text-red-400 font-bold">-{Math.floor(tax).toLocaleString()}원</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-blue-50/30 rounded-2xl border border-blue-50">
              <Info size={14} className="text-blue-400 shrink-0" />
              <p className="text-[10px] text-blue-500/80 font-medium leading-relaxed">
                위 결과는 참고용이며 실제 수령액은 가입 시점의 금리와 세제 혜택(비과세 등)에 따라 다를 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
