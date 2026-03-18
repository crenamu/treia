'use client'

import { useState, useEffect } from 'react'
import { Landmark, Info, CreditCard } from 'lucide-react'
import { getLoans, LoanProduct } from '@/app/actions/loan'
import HorizontalFilterBar from '@/components/HorizontalFilterBar'
import CompactLoanCard from '@/components/CompactLoanCard'
import BankSelectionModal from '@/components/BankSelectionModal'
import LoanDiagnosticFlow from '@/components/LoanDiagnosticFlow'
import { AnimatePresence } from 'framer-motion'

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState<'credit' | 'mortgage' | 'rent'>('credit')
  const [products, setProducts] = useState<LoanProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMock, setIsMock] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [tier, setTier] = useState<'all' | '1'>('all')

  // New States: Bank Selection
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [selectedBanks, setSelectedBanks] = useState<string[]>([])
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false)

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
      const { products: data, isMock: mockStatus } = await getLoans(activeTab, selectedFilters, tier, selectedBanks)
      setProducts(data)
      setIsMock(mockStatus)
      setIsLoading(false)
    }
    load()
  }, [activeTab, selectedFilters, tier, selectedBanks])

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

      <main className="container mx-auto px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-xl">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.2] tracking-tight mb-4">
                    대출 상품 테이블
                </h1>
                <p className="text-lg font-bold text-gray-400 leading-relaxed">
                    전 금융권 데이터를 분석하여 실질적인 금리 혜택을 찾아드립니다.
                </p>
            </div>
            
            <button 
              onClick={() => setIsDiagnosticOpen(true)}
              className="px-8 py-5 bg-emerald-500 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-[0.98] flex items-center gap-3 shrink-0"
            >
              내 맞춤 금리 진단하기 ⚡️
            </button>
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
               setSelectedBanks([]);
             }}
             onBankSelectClick={() => setIsBankModalOpen(true)}
             selectedBanksCount={selectedBanks.length}
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
                       <button onClick={() => {
                         setSelectedFilters([]);
                         setSelectedBanks([]);
                       }} className="mt-8 text-sm font-black text-gray-900 underline underline-offset-8">필터 전체 해제</button>
                    </div>
                  ) : (
                    products.map((p, idx) => (
                      <div key={p.fin_prdt_cd}>
                        <CompactLoanCard product={p} rank={idx + 1} />
                      </div>
                    ))
                  )}
               </div>
             </AnimatePresence>
           )}
        </div>
        </div>
      </main>

      <BankSelectionModal 
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        selectedBanks={selectedBanks}
        onSelectBanks={setSelectedBanks}
      />

      <AnimatePresence>
        {isDiagnosticOpen && (
          <>
            <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md" onClick={() => setIsDiagnosticOpen(false)} />
            <LoanDiagnosticFlow 
              onClose={() => setIsDiagnosticOpen(false)} 
              onComplete={() => setIsDiagnosticOpen(false)} 
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
