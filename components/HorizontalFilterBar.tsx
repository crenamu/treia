'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

interface FilterOption {
  id: string
  label: string
}

interface HorizontalFilterBarProps {
  categories: { id: string; label: string; options: FilterOption[] }[]
  selectedFilters: string[]
  onToggleFilter: (id: string) => void
  tier: 'all' | '1'
  onTierChange: (tier: 'all' | '1') => void
  onReset: () => void
}

export default function HorizontalFilterBar({
  categories,
  selectedFilters,
  onToggleFilter,
  tier,
  onTierChange,
  onReset
}: HorizontalFilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 mb-6 -mx-4 px-4 sm:mx-0">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Tier Toggle & Global Actions */}
        <div className="flex items-center justify-between">
          <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => onTierChange('1')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                tier === '1' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
              }`}
            >
              1금융권
            </button>
            <button
              onClick={() => onTierChange('all')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                tier === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
              }`}
            >
              전체
            </button>
          </div>
          
          <button 
            onClick={onReset}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-all active:rotate-180 duration-500"
            title="필터 초기화"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        {/* Categories & Chips (Horizontal Scroll) */}
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1"
          >
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 pr-4 first:pl-0 border-r border-gray-100 last:border-0">
                <span className="text-xs font-bold text-gray-400 whitespace-nowrap">{cat.label}</span>
                {cat.options.map((opt) => {
                  const isActive = selectedFilters.includes(opt.id)
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onToggleFilter(opt.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                        isActive 
                          ? 'bg-[#10B981] border-[#10B981] text-white' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
          
          {/* Fading Edges for Scroll Suggestion */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity" />
        </div>
      </div>
    </div>
  )
}
