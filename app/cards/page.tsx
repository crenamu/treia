'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Coffee, 
  Car, 
  Wifi, 
  Utensils, 
  ArrowRight, 
  CreditCard,
  Truck,
  MonitorPlay,
  Zap,
  Star
} from 'lucide-react'
import { getCards, CardProduct } from '@/app/actions/card'
import Badge from '@/components/Badge'
import FilterChips from '@/components/FilterChips'

export default function CardsPage() {
  const [products, setProducts] = useState<CardProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState<{id: string, label: string}[]>([])

  const categories = [
    { id: 'shopping', label: '쇼핑', icon: <ShoppingBag size={18} /> },
    { id: 'food', label: '외식', icon: <Utensils size={18} /> },
    { id: 'coffee', label: '카페', icon: <Coffee size={18} /> },
    { id: 'delivery', label: '배달', icon: <Truck size={18} /> },
    { id: 'gas', label: '주유', icon: <Car size={18} /> },
    { id: 'telecom', label: '통신', icon: <Wifi size={18} /> },
    { id: 'streaming', label: '스트리밍', icon: <MonitorPlay size={18} /> },
    { id: 'energy', label: '공과금', icon: <Zap size={18} /> }
  ]

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      const filterIds = selectedFilters.map(f => f.id)
      const { products: data } = await getCards(filterIds)
      setProducts(data)
      setIsLoading(false)
    }
    load()
  }, [selectedFilters])

  const toggleFilter = (id: string, label: string) => {
    if (selectedFilters.find(f => f.id === id)) {
      setSelectedFilters(selectedFilters.filter(f => f.id !== id))
    } else {
      setSelectedFilters([...selectedFilters, { id, label }])
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] pb-32">
      <div className="bg-white border-b border-gray-100 pt-20 pb-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
             <div className="w-16 h-16 rounded-[24px] bg-amber-50 flex items-center justify-center text-amber-500 shadow-xl shadow-amber-500/10">
                <CreditCard size={32} />
             </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-8">
             어디서 가장 많이 쓰세요? <br/>
             <span className="text-gray-400">맞춤 혜택 카드</span> 찾기
          </h1>
          <p className="text-xl font-bold text-gray-400 max-w-2xl mx-auto leading-relaxed">
             당신의 주소바(Shopping, Dining, Lifestyle) 패턴을 분석하여 <br/>
             매월 돌려받을 수 있는 최대 금액을 계산해 드립니다.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-20">
        {/* Horizontal Scroll / Wrap Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-20 max-w-5xl mx-auto">
           {categories.map(cat => (
             <button
               key={cat.id}
               onClick={() => toggleFilter(cat.id, cat.label)}
               className={`flex items-center gap-4 px-10 py-5 rounded-[32px] text-sm font-black transition-all border ${
                 selectedFilters.find(f => f.id === cat.id)
                 ? 'bg-gray-900 text-white border-gray-900 shadow-2xl scale-105'
                 : 'bg-white border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-900'
               }`}
             >
               <span className={selectedFilters.find(f => f.id === cat.id) ? 'text-amber-400' : 'text-gray-300'}>
                  {cat.icon}
               </span>
               {cat.label}
             </button>
           ))}
        </div>

        <div className="max-w-6xl mx-auto">
          <FilterChips 
            filters={selectedFilters}
            onRemove={(id) => setSelectedFilters(selectedFilters.filter(f => f.id !== id))}
            onClearAll={() => setSelectedFilters([])}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="h-80 bg-gray-100 rounded-[56px] animate-pulse" />
               ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {products.length === 0 ? (
                    <div className="col-span-full py-40 text-center bg-white rounded-[56px] border border-gray-100 shadow-sm">
                       <p className="text-xl font-bold text-gray-300">해당 카테고리의 베스트 카드가 없습니다.</p>
                       <button onClick={() => setSelectedFilters([])} className="mt-8 text-sm font-black text-gray-900 underline underline-offset-8">전체 보기</button>
                    </div>
                 ) : (
                   products.map((card, idx) => (
                     <motion.div
                       layout
                       key={card.id}
                       initial={{ opacity: 0, y: 30 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       transition={{ delay: idx * 0.1 }}
                       className="group bg-white rounded-[64px] p-10 md:p-14 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all relative overflow-hidden h-full flex flex-col"
                     >
                       <div className="flex flex-col xl:flex-row gap-12 relative z-10 flex-1">
                          {/* Card Plate Visual */}
                          <div className="relative shrink-0">
                             <div className="w-full xl:w-40 h-56 xl:h-24 bg-gradient-to-br from-gray-800 to-gray-950 rounded-[20px] shadow-2xl flex items-center justify-center text-white font-black text-2xl rotate-0 xl:-rotate-90 origin-center transition-transform group-hover:scale-110 group-hover:rotate-0 xl:group-hover:-rotate-[100deg]">
                                {card.imageText}
                                <div className="absolute top-4 left-4 w-6 h-6 bg-amber-400/20 border border-amber-400/30 rounded-full blur-xl animate-pulse"></div>
                             </div>
                          </div>

                          <div className="flex-1 space-y-8">
                             <div className="space-y-3">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{card.company}</p>
                                <h2 className="text-3xl font-black text-gray-900 group-hover:text-amber-600 transition-colors">{card.name}</h2>
                             </div>

                             <div className="flex flex-wrap gap-3">
                                {card.benefits.map(b => (
                                   <Badge key={b} variant="outline" className="px-4 py-2 border-gray-200 text-gray-500 font-bold">{b}</Badge>
                                ))}
                             </div>

                             <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                                <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">연회비</p>
                                   <p className="text-base font-black text-gray-900">{card.annualFee}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">전월 실적</p>
                                   <p className="text-base font-black text-gray-900">{card.prevMonthRecord}</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="mt-12 flex items-center justify-between bg-amber-50 rounded-[40px] p-8 group-hover:bg-amber-100 transition-all border border-amber-100/50">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm">
                                <Star size={24} fill="currentColor" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-amber-900/40 uppercase tracking-widest mb-1">Pick up Benefit</p>
                                <p className="text-lg font-black text-amber-900">{card.bestBenefit}</p>
                             </div>
                          </div>
                          <ArrowRight size={24} className="text-amber-400 group-hover:translate-x-3 transition-transform" />
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
  )
}
