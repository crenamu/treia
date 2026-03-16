'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { getProducts, Product } from '@/app/actions/finance'
import AssetMetricCard from '@/components/AssetMetricCard'
import GlobalMarketInsight from '@/components/GlobalMarketInsight'
import FilterChips from '@/components/FilterChips'
import Badge from '@/components/Badge'
import TaxCalculatorWidget from '@/components/TaxCalculatorWidget'

const PREFERENTIAL_FILTERS = [
  { id: '카드사용', label: '카드사용' },
  { id: '급여연동', label: '급여연동' },
  { id: '공과금연동', label: '공과금연동' },
  { id: '비대면가입', label: '비대면가입' },
  { id: '주택청약', label: '주택청약' },
  { id: '첫거래', label: '첫거래' },
  { id: '재예치', label: '재예치' },
  { id: '입출금통장', label: '입출금통장' },
  { id: '마케팅동의', label: '마케팅동의' }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'saving'>('deposit')
  const [selectedTerm, setSelectedTerm] = useState<string>('12')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMock, setIsMock] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<{id: string, label: string}[]>([])

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      const filterIds = selectedFilters.map(f => f.id)
      const { products: data, isMock: mockStatus } = await getProducts(activeTab, selectedTerm, filterIds)
      setProducts(data)
      setIsMock(mockStatus)
      setIsLoading(false)
    }
    load()
  }, [activeTab, selectedTerm, selectedFilters])

  const toggleFilter = (id: string, label: string) => {
    if (selectedFilters.find(f => f.id === id)) {
      setSelectedFilters(selectedFilters.filter(f => f.id !== id))
    } else {
      setSelectedFilters([...selectedFilters, { id, label }])
    }
  }

  const highestRate = products.length > 0 ? Math.max(...products.map(p => p.bestOption?.intr_rate2 || 0)) : 0
  const avgRate = products.length > 0 ? (products.reduce((acc, p) => acc + (p.bestOption?.intr_rate || 0), 0) / products.length).toFixed(2) : 0

  return (
    <div className="min-h-screen bg-[var(--bg-beige)]">
      {/* Top Status Bar */}
      <div className={`py-3 px-6 text-center transition-colors ${isMock ? 'bg-amber-50 text-amber-700' : 'bg-gray-900 text-white'}`}>
         <div className="container mx-auto flex items-center justify-center gap-3">
            {isMock ? <AlertCircle size={14} /> : <CheckCircle2 size={14} className="text-green-400" />}
            <p className="text-[11px] font-black uppercase tracking-widest">
               {isMock ? 'Simulation Mode: 현재 데이터 점검 중입니다' : 'Live Connected: 금융감독원 공시 실시간 데이터 연동 중'}
            </p>
         </div>
      </div>

      <main className="container mx-auto px-6 py-12 md:py-20">
        {/* Hero Section */}
        <div className="max-w-4xl mb-24">
            <div className="flex items-center gap-3 mb-8">
                <Badge variant="solid">v2.1</Badge>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">FinTable Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-[64px] font-black text-gray-900 leading-[1.1] tracking-tight mb-8">
                지금 당신에게<br/>
                <span className="text-gray-900 opacity-30">가장 추천하는</span> 금리
            </h1>
            <p className="text-xl font-bold text-gray-400 max-w-2xl leading-relaxed">
                시중 은행과 저축은행의 {activeTab === 'deposit' ? '예금' : '적금'} 상품 중
                복잡한 우대 조건을 제외한 **실질 수익률**이 가장 높은 상품을 찾았습니다.
            </p>
        </div>

        {/* Market Insight Section */}
        <div className="mb-24">
            <GlobalMarketInsight />
        </div>

        {/* AI Prediction Tool Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-32 relative"
        >
           <div className="relative bg-[#1A1A1A] rounded-[56px] p-10 md:p-16 text-white shadow-2xl shadow-black/10 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
              <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-[40px] flex items-center justify-center text-white shrink-0 shadow-2xl border border-white/10">
                 <Sparkles size={48} className="text-amber-400" />
              </div>
              
              <div className="flex-1 text-center md:text-left z-10">
                 <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter leading-tight">
                    이번 달 3기 신도시 사전청약,<br/>
                    가장 유리한 예적금 <span className="text-amber-400">매칭 전략</span>
                 </h2>
                 <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-xl">
                    현재 LH/SH 통합 공고와 시중 금융 상품을 분석했습니다. 
                    보증금 마련을 위한 **최적의 자산 형성 플랜**을 지금 바로 확인하세요.
                 </p>
              </div>

              <Link href="/housing" className="px-12 py-6 bg-white text-gray-900 rounded-[32px] font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all shadow-2xl flex items-center gap-3 active:scale-95 shrink-0">
                 리포트 받기 <ArrowRight size={20} />
              </Link>
           </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <AssetMetricCard 
            title="최고 우대금리" 
            value={`${highestRate}%`} 
            trend="+0.15% 지난달 대비" 
            icon={<TrendingUp className="text-green-500" />}
          />
          <AssetMetricCard 
            title="평균 기본금리" 
            value={`${avgRate}%`} 
            trend="-0.02% 변동" 
            icon={<TrendingUp className="text-amber-500 rotate-180" />}
          />
          <AssetMetricCard 
            title="분석 상품 수" 
            value={`${products.length}개`} 
            trend="전 금융권 통합" 
            icon={<div className="p-2 bg-gray-100 rounded-lg"><Search size={20} /></div>}
          />
        </div>

        {/* Product Comparison Section */}
        <section className="mb-32">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16 px-4">
             <div>
                <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">금리 테이블 비교</h2>
                <div className="flex p-2 bg-white rounded-[32px] border border-gray-100 shadow-sm w-fit gap-2">
                   <button 
                     onClick={() => setActiveTab('deposit')}
                     className={`px-10 py-4 rounded-[24px] text-sm font-black transition-all ${
                       activeTab === 'deposit' ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20' : 'text-gray-400 hover:text-gray-900'
                     }`}
                   >
                     정기예금
                   </button>
                   <button 
                     onClick={() => setActiveTab('saving')}
                     className={`px-10 py-4 rounded-[24px] text-sm font-black transition-all ${
                       activeTab === 'saving' ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20' : 'text-gray-400 hover:text-gray-900'
                     }`}
                   >
                     정기적금
                   </button>
                </div>
             </div>

             <div className="flex flex-wrap gap-4">
                {['6', '12', '24', '36'].map(trm => (
                  <button
                    key={trm}
                    onClick={() => setSelectedTerm(trm)}
                    className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border ${
                      selectedTerm === trm ? 'bg-white border-gray-900 text-gray-900 shadow-sm' : 'text-gray-400 border-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {trm}개월
                  </button>
                ))}
             </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-72 shrink-0 space-y-12">
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-60 px-2 flex items-center gap-2">
                    <Filter size={12} /> Preferential Conditions
                  </h3>
                  <div className="flex flex-col gap-2">
                     {PREFERENTIAL_FILTERS.map(f => (
                       <button
                         key={f.id}
                         onClick={() => toggleFilter(f.id, f.label)}
                         className={`flex items-center justify-between px-5 py-4 rounded-[24px] text-sm font-bold transition-all border ${
                           selectedFilters.find(sf => sf.id === f.id)
                           ? 'bg-white border-green-500 text-gray-900 shadow-md ring-2 ring-green-500/10'
                           : 'bg-white border-gray-100 text-gray-500 hover:border-gray-900'
                         }`}
                       >
                         {f.label}
                         {selectedFilters.find(sf => sf.id === f.id) && <div className="w-2 h-2 rounded-full bg-green-500" />}
                       </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Product List */}
            <div className="flex-1">
              <FilterChips 
                filters={selectedFilters}
                onRemove={(id) => setSelectedFilters(selectedFilters.filter(f => f.id !== id))}
                onClearAll={() => setSelectedFilters([])}
              />

              {isLoading ? (
                <div className="grid grid-cols-1 gap-8">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="h-64 bg-gray-100 rounded-[48px] animate-pulse" />
                   ))}
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="grid grid-cols-1 gap-8">
                    {products.length === 0 ? (
                      <div className="py-32 text-center bg-white rounded-[48px] border border-gray-100">
                         <p className="text-lg font-bold text-gray-300">조건에 맞는 상품이 없습니다.</p>
                         <button onClick={() => setSelectedFilters([])} className="mt-4 text-sm font-black text-gray-900 underline underline-offset-4">필터 전체 해제</button>
                      </div>
                    ) : (
                      products.map((product, idx) => (
                        <motion.div
                          layout
                          key={product.fin_prdt_cd}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group bg-white rounded-[56px] p-8 md:p-12 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all overflow-hidden relative"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                            <div className="flex-1">
                               <div className="flex flex-wrap items-center gap-3 mb-6">
                                  <Badge variant="outline">{product.kor_co_nm}</Badge>
                                  {product.tags?.slice(0, 3).map(tag => (
                                    <Badge key={tag} variant="blue">{tag}</Badge>
                                  ))}
                               </div>
                               <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                                  {product.fin_prdt_nm}
                               </h3>
                               <p className="text-sm font-bold text-gray-400 line-clamp-1 max-w-xl">
                                  {product.spcl_cnd || product.mtrt_int}
                                </p>
                            </div>

                            <div className="flex items-center gap-12 bg-gray-50 group-hover:bg-green-50 rounded-[40px] px-10 py-8 transition-all border border-transparent group-hover:border-green-100">
                               <div className="text-center">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">최대 금리</p>
                                  <p className="text-4xl font-black text-gray-900 group-hover:text-green-600 transition-colors">
                                     {product.bestOption?.intr_rate2}%
                                  </p>
                                  <p className="text-xs font-bold text-gray-400 mt-1">기본 {product.bestOption?.intr_rate}%</p>
                               </div>
                               <ChevronRight size={24} className="text-gray-300 group-hover:text-green-600" />
                            </div>
                          </div>

                          <TaxCalculatorWidget 
                            baseAmount={1000000} 
                            rate={product.bestOption?.intr_rate2 || 0} 
                            term={parseInt(selectedTerm)} 
                            type={activeTab} 
                          />
                        </motion.div>
                      ))
                    )}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
