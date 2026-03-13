'use client'

import { useState } from 'react'
import { Home, Search, MapPin, Building2, Calendar, ChevronRight, Info } from 'lucide-react'

// Dummy data for Housing to show UI first
const MOCK_HOUSING = [
  {
    id: '1',
    title: '동탄2 A-94블록 장기전세주택 예비입원 모집',
    location: '경기도 화성시',
    org: 'LH 경기남부지역본부',
    status: '접수중',
    date: '2026.03.10 ~ 2026.03.20',
    type: '장기전세',
    size: '59㎡ ~ 84㎡'
  },
  {
    id: '2',
    title: '서울양원 S1블록 국민임대주택 입주자 모집',
    location: '서울특별시 중랑구',
    org: 'LH 서울지역본부',
    status: '공고중',
    date: '2026.03.15 ~ 2026.03.25',
    type: '국민임대',
    size: '26㎡ ~ 46㎡'
  },
  {
    id: '3',
    title: '인천검단 AA10-1블록 행복주택 추가 모집',
    location: '인천광역시 서구',
    org: 'LH 인천지역본부',
    status: '접수마감',
    date: '2026.03.01 ~ 2026.03.07',
    type: '행복주택',
    size: '16㎡ ~ 36㎡'
  }
]

export default function HousingPage() {
  const [filter, setFilter] = useState('전체')

  return (
    <div className="min-h-screen bg-[var(--bg-beige)]">
      <main className="container mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded">LH / SH / GH</span>
            <p className="text-xs text-gray-500 font-medium tracking-tight">공공데이터포털 실시간 공고</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-black text-gray-900 leading-[1.1] mb-4 tracking-tighter">
            내 집 마련의 첫걸음,<br />
            임대주택 공고를 한눈에
          </h1>
          <p className="text-gray-500 font-medium max-w-lg">
            지역별, 유형별 공공임대주택 모집 공고를 실시간으로 확인하세요.<br/>
            복잡한 자격 요건도 핀테이블이 쉽게 정리해 드립니다.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-10 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text" 
              placeholder="관심 지역이나 아파트명을 검색하세요"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm"
            />
          </div>
          <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl overflow-x-auto scrollbar-hide max-w-full">
            {['전체', '서울', '경기', '인천', '기타'].map(loc => (
              <button 
                key={loc}
                onClick={() => setFilter(loc)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  filter === loc ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Notice List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_HOUSING.map(notice => (
            <div 
              key={notice.id}
              className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  notice.status === '접수중' ? 'bg-blue-50 text-blue-600' : 
                  notice.status === '공고중' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {notice.status}
                </span>
                <span className="text-[11px] text-gray-400 font-bold">{notice.type}</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors leading-snug">
                {notice.title}
              </h3>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <MapPin size={14} className="text-gray-300" />
                  {notice.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <Building2 size={14} className="text-gray-300" />
                  {notice.org}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <Calendar size={14} className="text-gray-300" />
                  {notice.date}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between group-hover:border-blue-50 transition-colors">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-black uppercase mb-1">전용면적</span>
                  <span className="text-sm text-gray-900 font-bold">{notice.size}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-12 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4">
          <Info className="text-blue-500 shrink-0 mt-1" size={20} />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-blue-900">임대주택 청약 안내</h4>
            <p className="text-xs text-blue-800/70 font-medium leading-relaxed">
              각 공고는 소득, 자산, 거주지 등 세부 자격 요건이 다릅니다. 관심 있는 공고의 상세 내역을 반드시 확인하시고, 
              청약 홈(LH 청약플러스 등)을 통해 접수하시기 바랍니다. 핀테이블은 정보 제공을 목적으로 하며 법적 책임을 지지 않습니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
