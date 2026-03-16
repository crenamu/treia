'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { LoanProduct } from '@/app/actions/loan'

interface CompactLoanCardProps {
  product: LoanProduct
}

export default function CompactLoanCard({ product }: CompactLoanCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-3xl p-5 md:p-6 border border-gray-100 flex items-center gap-4 hover:shadow-xl hover:shadow-gray-200/40 transition-all cursor-pointer"
    >
      {/* Brand Logo */}
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors shrink-0">
        <span className="text-[10px] font-black text-gray-400 text-center leading-tight">
          {product.kor_co_nm.slice(0, 2)}
        </span>
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold text-gray-400 truncate">{product.kor_co_nm}</span>
        </div>
        <h3 className="text-base md:text-lg font-black text-gray-900 mb-2 truncate group-hover:text-amber-600 transition-colors">
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

      {/* Stats - Horizontal alignment for density */}
      <div className="flex items-center gap-8 md:gap-12 px-4 border-r border-gray-50 mr-2">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">최대 한도</p>
          <p className="text-base font-black text-gray-700">{product.loan_lmt.split(' ')[1] || product.loan_lmt}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">최저 금리</p>
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-amber-600 transition-colors">
              연 {product.bestOption?.lend_rate_min}%
            </span>
          </div>
        </div>
      </div>

      <ChevronRight size={20} className="text-gray-200 group-hover:text-amber-600 transition-all" />
    </motion.div>
  )
}
