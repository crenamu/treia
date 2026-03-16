'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Product } from '@/app/actions/finance'
import { BANK_LOGOS } from '@/app/actions/constants'
import Image from 'next/image'

interface CompactProductCardProps {
  product: Product
  rank?: number
}

export default function CompactProductCard({ product, rank }: CompactProductCardProps) {
  const logoUrl = BANK_LOGOS[product.kor_co_nm.replace('주식회사 ', '')] || 
                  BANK_LOGOS[product.kor_co_nm.replace('은행', '')]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="group bg-white rounded-3xl p-5 md:p-6 border border-gray-100 flex items-center gap-4 hover:shadow-xl hover:shadow-gray-200/40 transition-all cursor-pointer"
    >
      {/* Rank & Logo */}
      <div className="flex flex-col items-center gap-1 min-w-[56px] shrink-0">
        {rank && (
          <span className={`text-sm font-black ${rank <= 3 ? 'text-amber-500' : 'text-gray-300'}`}>
            {rank}
          </span>
        )}
        <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-50 shadow-sm overflow-hidden group-hover:border-green-100 transition-colors">
          {logoUrl ? (
            <img src={logoUrl} alt={product.kor_co_nm} className="w-8 h-8 object-contain" />
          ) : (
            <span className="text-[10px] font-black text-gray-400 text-center leading-tight">
              {product.kor_co_nm.slice(0, 2)}
            </span>
          )}
        </div>
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold text-gray-400 truncate">{product.kor_co_nm}</span>
        </div>
        <h3 className="text-base md:text-lg font-black text-gray-900 mb-2 truncate group-hover:text-[#10B981] transition-colors">
          {product.fin_prdt_nm}
        </h3>
        <div className="flex flex-wrap gap-1">
          {product.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-50 text-[10px] font-bold text-gray-400 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="text-right shrink-0 px-4 border-r border-gray-50 mr-2">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">최고 금리</p>
        <div className="flex items-baseline justify-end gap-1">
          <span className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-[#10B981] transition-colors">
            {product.bestOption?.intr_rate2}%
          </span>
        </div>
        <p className="text-[10px] font-bold text-gray-400">기본 {product.bestOption?.intr_rate}%</p>
      </div>

      <ChevronRight size={20} className="text-gray-200 group-hover:text-[#10B981] transition-all group-hover:translate-x-1" />
    </motion.div>
  )
}
