'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Landmark, ShieldCheck, ChevronRight, Info, Filter, ArrowUpDown, CreditCard } from 'lucide-react'
import { getLoans, LoanProduct } from '@/app/actions/loan'
import Badge from '@/components/Badge'
import FilterChips from '@/components/FilterChips'

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState<'credit' | 'mortgage' | 'rent'>('credit')
  const [products, setProducts] = useState<LoanProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMock, setIsMock] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<{id: string, label: string}[]>([])

  const tabs = [
    { id: 'credit', label: '신용대출', icon: <CreditCard size={18} /> },
    { id: 'mortgage', label: '주택담보대출', icon: <Landmark size={18} /> },
    { id: 'rent', label: '전세대출', icon: <Info size={18} /> }
  ]

  const PRESET_FILTERS = [
    { id: '방문없이가입', label: '방문 없이 가입' },
    { id: '무서류', label: '무서류' },
    { id: '직장인', label: '직장인 전용' },
    { id: '무직자가능', label: '무직자 가능' },
    { id: 'LTV우대', label: 'LTV 우대' }
  ]

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      const filterIds = selectedFilters.map(f => f.id)
      const { products: data, isMock: mockStatus } = await getLoans(activeTab, filterIds)
      setProducts(data)
      setIsMock(mockStatus)
      setIsLoading(false)
    }
    load()
  }, [activeTab, selectedFilters])

  const toggleFilter = (id: string, label: string) => {
    if (selectedFilters.find(f => f.id === id)) {
      setSelectedFilters(selectedFilters.filter(f => f.id !== id))
    } else {
      setSelectedFilters([...selectedFilters, { id, label }])
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] pb-32">
      {/* Top Status Bar */}
      <div className={`py-3 px-6 text-center transition-colors ${isMock ? 'bg-amber-50 text-amber-700' : 'bg-gray-900 text-white'}`}>
         <div className="container mx-auto flex items-center justify-center gap-3">
            <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               {isMock ? 'Simulation Mode: 데이터 분석 중' : 'Live Data: 실시간 금리 연동 중'}
            </p>
         </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-20 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-12 h-12 rounded-[20px] bg-gray-900 flex items-center justify-center text-white shadow-xl">
                <Landmark size={24} />
             </div>
             <span className="text-xs font-black uppercase tracking-widest text-gray-400">Premium Comparison</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
             가장 가벼운 <br/>
             <span className="text-gray-400">대출 금리</span> 테이블
          </h1>
          <p className="text-xl font-bold text-gray-400 max-w-2xl leading-relaxed">
             전 금융권 데이터를 분석하여 고객님의 신용 점수와 상황에 맞는 <br/>
             실질적인 금리 혜택을 찾아드립니다.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16">
        {/* Tabs Control */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
           <div className="flex p-2 bg-white rounded-[32px] border border-gray-100 shadow-sm w-fit gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'credit' | 'mortgage' | 'rent')}
                  className={`flex items-center gap-3 px-10 py-5 rounded-[24px] text-sm font-black transition-all ${
                    activeTab === tab.id 
                    ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20' 
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
           </div>

           <div className="flex items-center gap-4">
              <button className="flex items-center gap-3 text-sm font-black text-gray-900 bg-white px-8 py-5 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                 <ArrowUpDown size={16} /> 최저금리순
              </button>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filter Menu */}
          <div className="w-full lg:w-72 shrink-0 space-y-12">
             <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-60 px-4 flex items-center gap-2">
                  <Filter size={12} /> Search Filters
                </h3>
                <div className="flex flex-col gap-2">
                   {PRESET_FILTERS.map(f => (
                     <button
                       key={f.id}
                       onClick={() => toggleFilter(f.id, f.label)}
                       className={`flex items-center justify-between px-6 py-5 rounded-[24px] text-sm font-bold transition-all border ${
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

          {/* List Area */}
          <div className="flex-1">
             <FilterChips 
               filters={selectedFilters} 
               onRemove={(id) => setSelectedFilters(selectedFilters.filter(f => f.id !== id))}
               onClearAll={() => setSelectedFilters([])}
             />

             {isLoading ? (
               <div className="space-y-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-gray-100 rounded-[56px] animate-pulse" />
                  ))}
               </div>
             ) : (
               <AnimatePresence mode="popLayout">
                 <div className="space-y-8">
                    {products.length === 0 ? (
                      <div className="py-40 text-center bg-white rounded-[56px] border border-gray-100 shadow-sm">
                         <p className="text-xl font-bold text-gray-300">검색 결과가 없습니다.</p>
                         <p className="text-sm text-gray-400 mt-2">필터를 조정하거나 초기화해주세요.</p>
                         <button onClick={() => setSelectedFilters([])} className="mt-8 text-sm font-black text-gray-900 underline underline-offset-8">필터 전체 해제</button>
                      </div>
                    ) : (
                      products.map((p, idx) => (
                        <motion.div
                          layout
                          key={p.fin_prdt_cd}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group bg-white rounded-[56px] p-8 md:p-12 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-pointer relative"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                            <div className="flex-1">
                               <div className="flex flex-wrap items-center gap-3 mb-6">
                                  <Badge variant="solid" className="bg-gray-900">{p.kor_co_nm}</Badge>
                                  {p.tags?.slice(0, 3).map(tag => (
                                    <Badge key={tag} variant="outline" className="text-gray-500 border-gray-200">{tag}</Badge>
                                  ))}
                               </div>
                               <h2 className="text-3xl font-black text-gray-900 group-hover:text-green-600 transition-colors mb-4 leading-tight">
                                  {p.fin_prdt_nm}
                               </h2>
                               <div className="flex items-center gap-6 text-sm font-bold text-gray-400">
                                  <div className="flex items-center gap-2">
                                     <span className="w-1 h-1 rounded-full bg-gray-200" />
                                     {p.loan_lmt}
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <span className="w-1 h-1 rounded-full bg-gray-200" />
                                     {p.bestOption?.rpay_type_nm}
                                  </div>
                               </div>
                            </div>

                            <div className="flex items-center gap-12 bg-gray-50 group-hover:bg-green-50 rounded-[48px] px-10 py-8 transition-all border border-transparent group-hover:border-green-100">
                               <div className="text-right">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">최저 금리</p>
                                  <p className="text-4xl font-black text-gray-900 group-hover:text-green-600 transition-colors">
                                     {p.bestOption?.lend_rate_min}%
                                  </p>
                                  <p className="text-xs font-bold text-gray-400 mt-1">{p.bestOption?.lend_rate_type_nm}</p>
                               </div>
                               <ChevronRight size={28} className="text-gray-300 group-hover:text-green-600 group-hover:translate-x-2 transition-all" />
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                 </div>
               </AnimatePresence>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
