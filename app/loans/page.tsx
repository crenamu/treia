'use client'

import { useState, useEffect } from 'react'
import { Landmark, Info, CreditCard } from 'lucide-react'
import { getLoans, LoanProduct } from '@/app/actions/loan'
import HorizontalFilterBar from '@/components/HorizontalFilterBar'
import CompactLoanCard from '@/components/CompactLoanCard'
import { AnimatePresence } from 'framer-motion'

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState<'credit' | 'mortgage' | 'rent'>('credit')
  const [products, setProducts] = useState<LoanProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMock, setIsMock] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [tier, setTier] = useState<'all' | '1'>('all')

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
      const { products: data, isMock: mockStatus } = await getLoans(activeTab, selectedFilters, tier)
      setProducts(data)
      setIsMock(mockStatus)
      setIsLoading(false)
    }
    load()
  }, [activeTab, selectedFilters, tier])

  const toggleFilter = (id: string) => {
    if (selectedFilters.includes(id)) {
      setSelectedFilters(selectedFilters.filter(f => f !== id))
    } else {
      setSelectedFilters([...selectedFilters, id])
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
           <div className="flex flex-wrap p-2 bg-white rounded-[32px] border border-gray-100 shadow-sm w-fit gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'credit' | 'mortgage' | 'rent')}
                  className={`flex items-center gap-3 px-6 md:px-10 py-4 md:py-5 rounded-[24px] text-sm font-black transition-all ${
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
        </div>

        <div className="mb-12">
           <HorizontalFilterBar 
             tier={tier}
             onTierChange={setTier}
             selectedFilters={selectedFilters}
             onToggleFilter={toggleFilter}
             onReset={() => {
               setSelectedFilters([]);
               setTier('all');
             }}
             categories={[
               {
                 id: 'type',
                 label: '대출 특성',
                 options: PRESET_FILTERS
               }
             ]}
           />
        </div>

        <div className="flex-1">
           {isLoading ? (
             <div className="flex flex-col gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-24 bg-gray-100 rounded-3xl animate-pulse" />
                ))}
             </div>
           ) : (
             <AnimatePresence mode="popLayout">
               <div className="flex flex-col gap-3">
                  {products.length === 0 ? (
                    <div className="py-40 text-center bg-white rounded-[56px] border border-gray-100 shadow-sm">
                       <p className="text-xl font-bold text-gray-300">검색 결과가 없습니다.</p>
                       <p className="text-sm text-gray-400 mt-2">필터를 조정하거나 초기화해주세요.</p>
                       <button onClick={() => setSelectedFilters([])} className="mt-8 text-sm font-black text-gray-900 underline underline-offset-8">필터 전체 해제</button>
                    </div>
                  ) : (
                    products.map((p) => (
                      <div key={p.fin_prdt_cd}>
                        <CompactLoanCard product={p} />
                      </div>
                    ))
                  )}
               </div>
             </AnimatePresence>
           )}
        </div>
      </div>
    </div>
  )
}
