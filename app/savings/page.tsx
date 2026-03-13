'use client'

import { useState, useEffect } from 'react'
import { DepositProduct } from '@/types/deposit'
import { Filter, ChevronDown, Rocket, ShieldCheck, TrendingUp, Sparkles, Star, ArrowRight, Wallet, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ShareSaveButtons from '@/app/components/ShareSaveButtons'

const TERMS = [
  { label: '전체', value: '0' },
  { label: '6개월', value: '6' },
  { label: '12개월', value: '12' },
  { label: '24개월', value: '24' },
  { label: '36개월', value: '36' },
]

const SORTS = [
  { label: '최고금리 높은순', value: 'rate2_desc' },
  { label: '기본금리 높은순', value: 'rate_desc' },
]

export default function SavingsPage() {
  const [products, setProducts] = useState<DepositProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [trm, setTrm] = useState('12')
  const [sort, setSort] = useState('rate2_desc')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/savings?trm=${trm}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [trm])

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'rate2_desc') return (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0)
    if (sort === 'rate_desc') return (b.bestOption?.intr_rate || 0) - (a.bestOption?.intr_rate || 0)
    return 0
  })

  const bestMax = products.length > 0 ? [...products].sort((a, b) => (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0))[0] : null

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] pb-24">
      <main className="container mx-auto max-w-5xl px-6 pt-12 md:pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100">
             <Rocket size={16} className="text-purple-600" />
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">High Yield Savings</p>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-outfit font-black text-gray-900 leading-[0.95] mb-8 tracking-tighter">
            목돈 마련의<br />
            <span className="text-purple-600 underline underline-offset-8 decoration-8 decoration-purple-100">가장 빠른 길</span>
          </h1>
          
          <p className="text-gray-500 font-medium max-w-md text-lg leading-relaxed">
            매월 차곡차곡 쌓이는 즐거움.<br/>
            핀테이블이 찾아낸 최고의 적금 금리를 확인하세요.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-purple-600 rounded-[32px] p-8 text-white flex items-center justify-between shadow-xl shadow-purple-500/20 group overflow-hidden relative">
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[3px] text-purple-200 mb-2">현시점 최고 금리</p>
                <h2 className="text-5xl font-outfit font-black mb-1">연 {bestMax?.bestOption?.intr_rate2.toFixed(2)}%</h2>
                <p className="text-sm font-bold text-purple-100">{bestMax?.kor_co_nm}</p>
             </div>
             <Rocket size={80} className="text-purple-500/30 absolute right-[-10px] bottom-[-10px] rotate-12 group-hover:scale-110 transition-transform" />
          </div>
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col justify-center">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">적금으로 얼마를 모을까요?</p>
             <Link href="/calculator" className="w-full py-5 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center gap-3 text-sm font-black transition-all">
                <Wallet size={18} className="text-purple-600" /> 목표 금액별 월 납입액 계산
             </Link>
          </div>
        </div>

        <div className="bg-white rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="px-8 pt-10 pb-6 border-b border-gray-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
                  {TERMS.map(t => (
                    <button 
                      key={t.value}
                      onClick={() => setTrm(t.value)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${trm === t.value ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {t.label}
                    </button>
                  ))}
               </div>
               <div className="flex items-center gap-4">
                  <p className="text-xs font-bold text-gray-400">총 <span className="text-gray-900">{products.length}개</span> 상품</p>
                  <div className="flex items-center gap-2 text-xs font-black text-gray-500 bg-gray-50 px-4 py-3 rounded-xl">
                     <Filter size={14} />
                     <select value={sort} onChange={e => setSort(e.target.value)} className="bg-transparent outline-none cursor-pointer">
                        {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                     </select>
                  </div>
               </div>
            </div>
          </div>

          <div className="px-4 py-8">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="py-32 flex flex-col items-center justify-center gap-6">
                   <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                   <p className="text-sm font-black text-gray-400 uppercase tracking-widest">데이터 동기화 중...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedProducts.map((p, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={p.fin_prdt_cd}
                    >
                      <Link 
                        href={`/savings/${p.fin_prdt_cd}`}
                        className="group flex flex-col md:flex-row items-center justify-between p-6 md:p-8 bg-white border border-gray-100 rounded-[40px] hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500"
                      >
                         <div className="flex items-center gap-8 flex-1 w-full">
                            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-xl font-bold text-gray-300 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all border border-transparent group-hover:border-purple-100">
                               {p.kor_co_nm.substring(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-[11px] font-black text-gray-400 uppercase tracking-tight mb-1">{p.kor_co_nm}</p>
                               <h3 className="text-xl font-black text-gray-900 group-hover:text-purple-700 transition-colors truncate mb-2">{p.fin_prdt_nm}</h3>
                               <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-gray-400">{p.bestOption?.save_trm}개월</span>
                                  <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                                  <span className="text-xs font-bold text-gray-400">{p.bestOption?.intr_rate_type_nm}</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-12 mt-8 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                               <p className="text-[10px] text-gray-400 font-black uppercase mb-1">최고 연 금리</p>
                               <div className="flex items-baseline gap-1">
                                  <span className="text-4xl font-outfit font-black text-purple-600 leading-none">{p.bestOption?.intr_rate2.toFixed(2)}</span>
                                  <span className="text-sm font-bold text-purple-300">%</span>
                               </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-[24px] text-gray-300 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                               <ArrowRight size={20} />
                            </div>
                         </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}
