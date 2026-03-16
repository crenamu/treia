'use client'

import { useRef } from 'react'
import { RotateCcw, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

interface HorizontalFilterBarProps {
  tier: 'all' | '1'
  onTierChange: (tier: 'all' | '1') => void
  selectedFilters: string[]
  onToggleFilter: (id: string) => void
  onReset: () => void
  categories: {
    id: string
    label: string
    options: { id: string; label: string }[]
  }[]
  // New Props for Sorting and Bank Selection
  sortBy?: 'highest' | 'base'
  onSortChange?: (sort: 'highest' | 'base') => void
  onBankSelectClick?: () => void
  selectedBanksCount?: number
}

export default function HorizontalFilterBar({
  tier,
  onTierChange,
  selectedFilters,
  onToggleFilter,
  onReset,
  categories,
  sortBy = 'highest',
  onSortChange,
  onBankSelectClick,
  selectedBanksCount = 0
}: HorizontalFilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="sticky top-0 z-40 bg-[var(--bg-beige)]/80 backdrop-blur-md pt-4 pb-6 -mx-6 px-6 border-b border-gray-100 mb-8">
      <div className="container mx-auto">
        {/* Tier 1 / All Toggle & Bank Select */}
        <div className="flex items-center justify-between mb-6">
           <div className="flex p-1 bg-white rounded-2xl border border-gray-100 shadow-sm w-fit">
              <button
                onClick={() => onTierChange('1')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                  tier === '1' ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-300 hover:text-gray-500'
                }`}
              >
                1금융권
              </button>
              <button
                onClick={() => onTierChange('all')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                  tier === 'all' ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-300 hover:text-gray-500'
                }`}
              >
                전체
              </button>
           </div>

           {onBankSelectClick && (
             <button 
               onClick={onBankSelectClick}
               className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.97]"
             >
                <span className="text-xs font-black text-gray-900">
                  {selectedBanksCount > 0 ? `금융사 선택 (${selectedBanksCount})` : '은행 선택'}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
             </button>
           )}
        </div>

        {/* Filter Categories & Options (Scrollable) */}
        <div className="flex items-center gap-4">
          <div 
            ref={scrollRef}
            className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide py-1 pr-12"
          >
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mr-2">{cat.label}</span>
                {cat.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onToggleFilter(opt.id)}
                    className={`px-4 py-2.5 rounded-2xl text-[11px] font-bold transition-all border whitespace-nowrap flex items-center gap-1.5 ${
                      selectedFilters.includes(opt.id)
                      ? 'bg-amber-100 border-amber-200 text-amber-900 shadow-sm shadow-amber-200/40'
                      : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                    }`}
                  >
                    {opt.label}
                    {selectedFilters.includes(opt.id) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </button>
                ))}
                <div className="w-4" /> {/* Spacer between categories */}
              </div>
            ))}
          </div>

          <div className="h-8 w-px bg-gray-200 mx-2 shrink-0" />

          <button
            onClick={onReset}
            className="p-3 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-gray-900 transition-all shadow-sm active:rotate-[-45deg] shrink-0"
            title="필터 초기화"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Sorting & Advanced Filter Indicators */}
        <div className="mt-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => onSortChange?.('highest')}
                className={`text-[13px] font-black transition-colors ${sortBy === 'highest' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-400'}`}
              >
                최고금리순
              </button>
              <button 
                onClick={() => onSortChange?.('base')}
                className={`text-[13px] font-black transition-colors ${sortBy === 'base' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-400'}`}
              >
                기본금리순
              </button>
           </div>

           <button className="flex items-center gap-1.5 text-[13px] font-black text-gray-900 group">
              기간·금액
              <ChevronDown size={14} className="text-gray-400 group-hover:translate-y-0.5 transition-transform" />
           </button>
        </div>

        {/* Active Filter Indicator Chips (Optional) */}
        {selectedFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedFilters.map(id => (
              <motion.span 
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={id} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-xl text-[11px] font-black"
              >
                {id} <button onClick={() => onToggleFilter(id)}>×</button>
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
