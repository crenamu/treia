'use client'

import { useState, useEffect } from 'react'
import { DepositProduct } from '@/types/deposit'
import { Filter, ChevronDown, Rocket, ShieldCheck, TrendingUp, Sparkles, Star, ArrowRight, Home, Calculator } from 'lucide-react'
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

export default function FinTableHome() {
  const [products, setProducts] = useState<DepositProduct[]>([])
  const [savingProducts, setSavingProducts] = useState<DepositProduct[]>([])
  const [activeTab, setActiveTab] = useState<'deposit' | 'saving'>('deposit')
  const [loading, setLoading] = useState(true)
  const [trm, setTrm] = useState('12')
  const [sort, setSort] = useState('rate2_desc')

  useEffect(() => {
    setLoading(true)
    const url = activeTab === 'deposit' ? `/api/deposits?trm=${trm}` : `/api/savings?trm=${trm}`
    
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (activeTab === 'deposit') setProducts(data.products || [])
        else setSavingProducts(data.products || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [trm, activeTab])

  const currentProducts = activeTab === 'deposit' ? products : savingProducts
  
  // Sorted products
  const sortedProducts = [...currentProducts].sort((a, b) => {
    if (sort === 'rate2_desc') return (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0)
    if (sort === 'rate_desc') return (b.bestOption?.intr_rate || 0) - (a.bestOption?.intr_rate || 0)
    return 0
  })

  // Metric calculation
  const bestBase = currentProducts.length > 0 ? [...currentProducts].sort((a, b) => (b.bestOption?.intr_rate || 0) - (a.bestOption?.intr_rate || 0))[0] : null
  const bestMax = currentProducts.length > 0 ? [...currentProducts].sort((a, b) => (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0))[0] : null

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] selection:bg-green-100 pb-24">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-200/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-200/20 blur-[100px] rounded-full"></div>
      </div>

      <main className="container mx-auto max-w-5xl px-6 pt-12 md:pt-20 relative z-10">
        {/* AI Prediction Tool - Our Unique Weapon */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16 relative group"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[48px] opacity-0 group-hover:opacity-5 blur-2xl transition-all duration-700"></div>
           <div className="relative bg-white rounded-[48px] p-8 md:p-12 border border-blue-100 shadow-2xl shadow-blue-500/5 flex flex-col md:flex-row items-center gap-10 overflow-hidden">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-[32px] flex items-center justify-center text-blue-600 shrink-0 relative">
                 <div className="absolute inset-0 bg-blue-400/20 rounded-[32px] animate-ping opacity-20"></div>
                 <Sparkles size={40} className="relative z-10" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full mb-4 uppercase tracking-widest">
                    Next Big Opportunity
                 </div>
                 <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter mb-4">
                    이번 달 3기 신도시 사전청약,<br/>
                    <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">가장 유리한 예적금 매칭 전략</span>
                 </h2>
                 <p className="text-gray-500 font-medium leading-relaxed max-w-lg mb-6">
                    핀테이블 AI가 현재 LH 모집 공고와 시중 368개 상품을 실시간 매칭했습니다. 
                    당첨 점수 부족 시, 이자를 극대화하여 보증금을 마련하는 **&apos;청약 브릿지 상품&apos;** 3종을 추천합니다.
                 </p>
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-[11px] font-bold border border-gray-100">#3기신도시</span>
                    <span className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-[11px] font-bold border border-gray-100">#보증금마련전략</span>
                    <span className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-[11px] font-bold border border-gray-100">#최적금리브릿지</span>
                 </div>
              </div>

              <Link href="/housing" className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3">
                 리포트 받기 <ArrowRight size={18} />
              </Link>
           </div>
        </motion.div>

        {/* Global Market Insight (Glass style) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <GlassMetricCard 
            label="최고 우대금리" 
            value={bestMax ? `연 ${bestMax.bestOption.intr_rate2.toFixed(2)}%` : '—'} 
            sub={bestMax?.kor_co_nm || ''}
            icon={<TrendingUp size={20} />}
            color="green"
          />
          <GlassMetricCard 
            label="최고 기본금리" 
            value={bestBase ? `연 ${bestBase.bestOption.intr_rate.toFixed(2)}%` : '—'} 
            sub={bestBase?.kor_co_nm || ''}
            icon={<ShieldCheck size={20} />}
            color="blue"
          />
          <GlassMetricCard 
            label="분석된 상품 수" 
            value={loading ? '...' : `${currentProducts.length}개`} 
            sub="금감원 정식 등록"
            icon={<Rocket size={20} />}
            color="purple"
          />
          <div className="hidden md:flex bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white items-center justify-center group cursor-pointer hover:bg-white/60 transition-all">
             <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">My Page</p>
                <div className="p-3 bg-white rounded-2xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                   <Star size={20} className="text-yellow-500" />
                </div>
                <p className="text-xs font-bold text-gray-900">저장 목록</p>
             </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="bg-white rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Header & Tabs */}
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-between mb-8">
               <div className="flex p-1.5 bg-gray-100 rounded-2xl gap-1">
                  <button 
                    onClick={() => setActiveTab('deposit')}
                    className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'deposit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    정기예금
                  </button>
                  <button 
                    onClick={() => setActiveTab('saving')}
                    className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'saving' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    정기적금
                  </button>
               </div>
               <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl">
                     {TERMS.map(t => (
                        <button 
                          key={t.value}
                          onClick={() => setTrm(t.value)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${trm === t.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                        >
                          {t.label}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center mb-6">
               <p className="text-xs font-medium text-gray-400">
                  <span className="font-black text-gray-900">{sortedProducts.length}개</span>의 상품이 검색되었습니다.
               </p>
               <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                  <Filter size={14} />
                  <select 
                    value={sort} 
                    onChange={e => setSort(e.target.value)}
                    className="bg-transparent outline-none appearance-none cursor-pointer pr-4"
                  >
                    {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <ChevronDown size={14} />
               </div>
            </div>
          </div>

          {/* List Area */}
          <div className="px-4 pb-12">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-32 gap-6"
                  >
                    <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-400 font-black uppercase tracking-widest">분석 중...</p>
                  </motion.div>
                ) : (
                  sortedProducts.map((p, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={p.fin_prdt_cd}
                    >
                      <Link 
                        href={`/${activeTab === 'deposit' ? 'deposits' : 'savings'}/${p.fin_prdt_cd}`}
                        className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white border border-gray-100 rounded-[32px] hover:border-green-200 hover:bg-green-50/10 hover:shadow-2xl hover:shadow-green-500/5 transition-all duration-300"
                      >
                        <div className="flex items-center gap-6 flex-1 w-full md:w-auto">
                           <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-xl font-bold text-gray-300 group-hover:bg-white transition-colors border border-transparent group-hover:border-green-100">
                              {p.kor_co_nm.substring(0, 2)}
                           </div>
                           <div className="flex flex-col gap-1.5 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                 <span className="text-[11px] font-black text-gray-400 uppercase tracking-tight">{p.kor_co_nm}</span>
                                 {p.bestOption?.intr_rate2 > p.bestOption?.intr_rate * 1.2 && (
                                   <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded-full">
                                      <Sparkles size={10} className="fill-current" /> 파격금리
                                   </span>
                                 )}
                              </div>
                              <h3 className="text-lg md:text-xl font-black text-gray-900 group-hover:text-green-700 transition-colors truncate">
                                 {p.fin_prdt_nm}
                              </h3>
                              <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                 <span>{p.bestOption?.save_trm}개월</span>
                                 <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                                 <span>{p.bestOption?.intr_rate_type_nm}</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-8 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                           <div className="text-right flex flex-col items-end">
                              <div className="flex items-center gap-1.5 mb-1">
                                 <span className="text-[9px] font-black bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                   세후 이자
                                 </span>
                                 <p className="text-[10px] text-gray-400 font-black uppercase">1천만원 기준</p>
                              </div>
                              <div className="flex items-baseline gap-0.5">
                                 <span className="text-sm font-bold text-gray-400 mr-2">연</span>
                                 <span className="text-3xl font-outfit font-black text-gray-900 group-hover:text-green-600 transition-colors leading-none">
                                    {p.bestOption?.intr_rate2.toFixed(2)}
                                 </span>
                                 <span className="text-sm font-bold text-gray-900/60">%</span>
                              </div>
                              <p className="text-[11px] font-bold text-green-600 mt-1">
                                 약 {Math.floor(10000000 * (p.bestOption?.intr_rate2 / 100) * (Number(p.bestOption?.save_trm) / 12) * 0.846).toLocaleString()}원
                              </p>
                           </div>
                           <div className="flex items-center gap-2">
                             <ShareSaveButtons id={p.fin_prdt_cd} title={p.fin_prdt_nm} type="product" />
                             <div className="p-3 bg-gray-50 rounded-2xl text-gray-300 group-hover:text-green-600 group-hover:bg-white transition-all shadow-sm border border-transparent group-hover:border-green-100">
                                <ArrowRight size={20} />
                             </div>
                           </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Toss-style Benefit Section */}
        <section className="mt-24 space-y-12">
           <div className="text-center">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">금융 생활의 모든 것</h2>
              <p className="text-gray-500 font-medium">단 하나의 앱으로 쉽고 빠른 금융 관리를 경험하세요.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BenefitCard 
                title="맞춤형 청약 진단" 
                desc="내 점수로 당첨 가능한 집을 찾아드려요." 
                icon={<Home size={24} />} 
                href="/housing" 
                color="blue"
              />
              <BenefitCard 
                title="지능형 이자 계산" 
                desc="만기 수령액부터 세금까지 한눈에." 
                icon={<Calculator size={24} />} 
                href="/calculator"
                color="green"
              />
              <BenefitCard 
                title="AI 포트폴리오" 
                desc="Treia의 엔진이 최적의 자산 배분을 추천해요." 
                icon={<Rocket size={24} />} 
                href="/treia"
                color="purple"
              />
           </div>
        </section>
      </main>
    </div>
  )
}

function GlassMetricCard({ label, value, sub, icon, color }: { label: string, value: string, sub: string, icon: React.ReactNode, color: 'green' | 'blue' | 'purple' }) {
  const colorMap = {
    green: 'text-green-600 bg-green-50 shadow-green-500/10',
    blue: 'text-blue-600 bg-blue-50 shadow-blue-500/10',
    purple: 'text-purple-600 bg-purple-50 shadow-purple-500/10'
  }
  
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-6 border border-white shadow-xl shadow-gray-200/20 hover:bg-white transition-all duration-500 group">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 ${colorMap[color]}`}>
          {icon}
       </div>
       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
       <p className={`text-2xl font-outfit font-black leading-tight mb-1 truncate ${color === 'green' ? 'text-green-600' : 'text-gray-900'}`}>{value}</p>
       <p className="text-[10px] text-gray-500 font-bold truncate opacity-60">{sub || '검색 기록 없음'}</p>
    </div>
  )
}

function BenefitCard({ title, desc, icon, href, color }: { title: string, desc: string, icon: React.ReactNode, href: string, color: string }) {
  return (
    <Link href={href} className="group bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
       <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 blur-3xl pointer-events-none ${color === 'green' ? 'bg-green-600' : color === 'blue' ? 'bg-blue-600' : 'bg-purple-600'}`}></div>
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-gray-50 text-gray-400 group-hover:text-white transition-all duration-500 ${color === 'green' ? 'group-hover:bg-green-600' : color === 'blue' ? 'group-hover:bg-blue-600' : 'group-hover:bg-purple-600'}`}>
          {icon}
       </div>
       <h4 className="text-xl font-black text-gray-900 mb-2">{title}</h4>
       <p className="text-sm font-medium text-gray-400 leading-relaxed mb-8">{desc}</p>
       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-gray-900 transition-colors">
          Explore Now <ArrowRight size={14} />
       </div>
    </Link>
  )
}

