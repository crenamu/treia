'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Coffee, 
  Car, 
  Wifi, 
  Utensils, 
  CreditCard,
  Truck,
  MonitorPlay,
  Zap,
  AlertCircle
} from 'lucide-react'
import { getCards, CardProduct } from '@/app/actions/card'
import HorizontalFilterBar from '@/components/HorizontalFilterBar'
import CompactCardItem from '@/components/CompactCardItem'

export default function CardsPage() {
  const [products, setProducts] = useState<CardProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [tier, setTier] = useState<'all' | '1'>('all')

  const categoryOptions = [
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
      const { products: data } = await getCards(selectedFilters, tier)
      setProducts(data)
      setIsLoading(false)
    }
    load()
  }, [selectedFilters, tier])

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
       <div className="py-3 px-6 text-center bg-amber-50 text-amber-700">
          <div className="container mx-auto flex items-center justify-center gap-3">
             <AlertCircle size={14} />
             <p className="text-[10px] font-black uppercase tracking-widest">
                카드 혜택 데이터는 실제 카드사 공시와 다를 수 있습니다.
             </p>
          </div>
       </div>

      <div className="bg-white border-b border-gray-100 pt-20 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-12 h-12 rounded-[20px] bg-amber-500 flex items-center justify-center text-white shadow-xl">
                <CreditCard size={24} />
             </div>
             <span className="text-xs font-black uppercase tracking-widest text-gray-400">Card Intelligence</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
             가장 큰 <br/>
             <span className="text-amber-500">포인트백</span> 테이블
          </h1>
          <p className="text-xl font-bold text-gray-400 max-w-2xl leading-relaxed">
             당신의 소비 패턴을 분석하여 매월 돌려받을 수 있는 <br/>
             최적의 맞춤 혜택 카드를 찾아드립니다.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-16">
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
                id: 'benefit',
                label: '주요 혜택',
                options: categoryOptions.map(o => ({ id: o.id, label: o.label }))
              }
            ]}
          />
        </div>

        <div className="max-w-4xl mx-auto">
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
                       <p className="text-xl font-bold text-gray-300">해당 조건에 맞는 카드가 없습니다.</p>
                       <button onClick={() => setSelectedFilters([])} className="mt-8 text-sm font-black text-gray-900 underline underline-offset-8">전체 보기</button>
                    </div>
                 ) : (
                   products.map((card) => (
                     <div key={card.id}>
                       <CompactCardItem product={card} />
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
