'use client'

import { Bookmark, Inbox, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function SavedPage() {
  // Static placeholder for now
  const savedCount = 0

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] py-12">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Bookmark className="text-green-600" size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-outfit font-black text-gray-900 tracking-tighter">나의 저장 목록</h1>
              <p className="text-sm text-gray-500 font-medium">관심 상품을 한 곳에서 관리하세요.</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <span className="text-xs font-bold text-gray-400 uppercase mr-2">총 저장</span>
            <span className="text-lg font-outfit font-black text-gray-900">{savedCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
          {savedCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                <Inbox size={40} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">저장된 상품이 없습니다</h2>
                <p className="text-sm text-gray-400 font-medium max-w-xs">
                  비교 목록에서 관심 있는 상품의 북마크 아이콘을 눌러 저장해보세요.
                </p>
              </div>
              <Link 
                href="/"
                className="px-8 py-4 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center gap-2 group"
              >
                금융상품 둘러보기
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
               {/* Saved items will go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
