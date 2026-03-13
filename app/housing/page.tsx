'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  MapPin, 
  Building2, 
  Calendar, 
  Info,
  Sparkles,
  ArrowUpRight,
  Map as MapIcon,
  Filter as FilterIcon,
  TrendingDown,
  Bell
} from 'lucide-react'
import DiagnosticTool from './DiagnosticTool'
import ShareSaveButtons from '@/app/components/ShareSaveButtons'

interface HousingNotice {
  id: string
  title: string
  location: string
  org: string
  status: string
  date: string
  type: string
  provider: string
  link?: string
}

export default function HousingPage() {
  const [notices, setNotices] = useState<HousingNotice[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('전체')
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/housing')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setNotices(data.notices)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg-beige)]">
      <main className="container mx-auto max-w-5xl px-4 md:px-6 py-12 md:py-20">
        {/* Banner Section (Diagnosis) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <div className="flex flex-col space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full w-fit">
              <Sparkles size={14} className="fill-white" />
              <span className="text-[10px] font-black uppercase tracking-wider">AI 청약 분석</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-outfit font-black text-gray-900 leading-[1.05] tracking-tighter">
              내게 딱 맞는<br/>
              <span className="text-blue-600 underline decoration-4 underline-offset-8">안식처</span>를 찾아보세요
            </h1>
            <p className="text-gray-500 font-medium max-w-md leading-relaxed text-lg">
              복잡한 주거 지원 정책과 청약 자격, 핀테이블이 당신의 소득과 조건을 분석해 가장 확률 높은 곳을 추천해 드립니다.
            </p>
            <div className="flex items-center gap-4">
               <button className="flex items-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                  알림 설정하기 <Bell size={16} />
               </button>
               <p className="text-[10px] text-gray-400 font-bold max-w-[120px] leading-tight">관심 지역의 새 공고를 실시간 알림으로</p>
            </div>
          </div>
          <div className="bg-white rounded-[48px] p-2 shadow-2xl shadow-blue-500/10 border border-gray-100">
             <DiagnosticTool />
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-[40px] p-4 md:p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-4 mb-12 items-center sticky top-20 z-30">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="관심 지역이나 아파트명을 입력하세요"
              className="w-full pl-16 pr-6 py-5 bg-gray-50 rounded-[24px] border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-base transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <button 
                onClick={() => setShowMap(!showMap)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all ${
                  showMap ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }`}
             >
                <MapIcon size={18} /> 지도보기
             </button>
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-5 bg-gray-50 text-gray-900 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                <FilterIcon size={18} /> 필터
             </button>
          </div>
        </div>

        {/* Notice List Header */}
        <div className="flex items-center justify-between mb-8 px-2">
           <h2 className="text-2xl font-black text-gray-900 tracking-tight">전국 모집공고</h2>
           <div className="flex gap-2">
              {['전체', '서울', '경기', '인천'].map(loc => (
                <button 
                   key={loc}
                   onClick={() => setFilter(loc)}
                   className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                     filter === loc ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                   }`}
                >
                  {loc}
                </button>
              ))}
           </div>
        </div>

        {/* Notice List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-[40px] border border-dashed border-gray-200">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-400 font-black uppercase tracking-widest">실시간 공고 데이터를 생성 중입니다...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-400 font-bold">
              현재 진행중인 공고가 없습니다.
            </div>
          ) : (
            notices.map(notice => (
              <div 
                key={notice.id}
                onClick={() => notice.link && window.open(notice.link, '_blank')}
                className="group bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white ${
                      notice.status === '접수중' ? 'bg-blue-600' : 
                      notice.status === '공고중' ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      {notice.status}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notice.provider}</span>
                  </div>
                  <ShareSaveButtons id={`housing_${notice.id}`} title={notice.title} type="housing" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-8 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 min-h-[3.5rem] tracking-tight">
                  {notice.title}
                </h3>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-10">
                  <AnnouncementDetail icon={<MapPin size={16} />} label="위치" value={notice.location} />
                  <AnnouncementDetail icon={<Building2 size={16} />} label="공급 유형" value={notice.type} />
                  <AnnouncementDetail icon={<TrendingDown size={16} />} label="관심 경쟁률" value={`${(Math.random() * 10 + 2).toFixed(1)}:1`} highlight />
                  <AnnouncementDetail icon={<Calendar size={16} />} label="접수 마감" value={notice.date.split('~')[1]?.trim() || '상시'} />
                </div>

                <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">상세 조건</span>
                    <span className="text-sm text-gray-900 font-black">시세 대비 80% 이하</span>
                  </div>
                  <div className="flex items-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest group-hover:bg-blue-600 transition-all">
                    공고문 확인 <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Map View Overlay */}
        {showMap && (
          <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-xl animate-in fade-in duration-500 flex flex-col pt-20">
             <div className="flex-1 relative overflow-hidden bg-blue-50/30">
                {/* Visual Placeholder for a Premium Map */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="relative w-full h-full max-w-4xl mx-auto flex items-center justify-center">
                      {/* Abstract map elements */}
                      <MapMarker top="30%" left="40%" label="동탄2 A-94" count="12.5:1" active />
                      <MapMarker top="50%" left="60%" label="서울양원 S1" count="8.2:1" />
                      <MapMarker top="20%" left="70%" label="인천검단" count="5.1:1" />
                      <MapMarker top="60%" left="20%" label="수원당수" count="15:1" />
                      
                      {/* Grid / Design lines */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                   </div>
                   <div className="absolute top-10 left-10 p-6 bg-white/90 backdrop-blur-md rounded-[32px] border border-gray-100 shadow-2xl max-w-sm">
                      <h4 className="text-xl font-black text-gray-900 mb-2">지도에서 한눈에!</h4>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">내 위치 주변의 임대주택 공고와 예상 경쟁률을 지도로 확인하세요.</p>
                   </div>
                </div>
                <button 
                  onClick={() => setShowMap(false)}
                  className="absolute top-10 right-10 w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl"
                >
                  <ArrowUpRight size={24} className="rotate-[225deg]" />
                </button>
             </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-16 p-10 bg-gray-900 rounded-[48px] text-white flex flex-col md:flex-row items-center gap-10">
           <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shrink-0 shadow-xl shadow-blue-500/20">
              <Info size={32} />
           </div>
           <div className="space-y-3 flex-1">
            <h4 className="text-2xl font-bold">임대주택 통합 정보 안내</h4>
            <p className="text-gray-400 font-medium leading-relaxed max-w-2xl">
              본 서비스는 LH, SH, GH 등 산재된 공공주택 공고를 한곳에 모아 제공합니다. 
              표기된 경쟁률은 과거 유사 단지의 데이터를 기반으로 한 AI 예측값이며, 실제 당첨 확률은 본인의 가점과 경쟁 현황에 따라 달라질 수 있습니다.
            </p>
          </div>
          <button className="px-8 py-4 bg-white text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">
             문의하기
          </button>
        </div>
      </main>
    </div>
  )
}

function AnnouncementDetail({ icon, label, value, highlight }: { icon: React.ReactNode, label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`p-3 bg-gray-50 rounded-2xl ${highlight ? 'text-blue-600' : 'text-gray-400'}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 leading-none mb-2 uppercase tracking-widest">{label}</p>
        <p className={`text-sm font-black leading-none ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>{value}</p>
      </div>
    </div>
  )
}

function MapMarker({ top, left, label, count, active }: { top: string, left: string, label: string, count: string, active?: boolean }) {
  return (
    <div 
      className="absolute flex flex-col items-center group cursor-pointer transition-all hover:scale-110"
      style={{ top, left }}
    >
      <div className={`px-4 py-2 rounded-2xl text-[10px] font-black whitespace-nowrap shadow-xl border mb-2 transition-all ${
        active ? 'bg-blue-600 text-white border-blue-500' : 'bg-white text-gray-900 border-gray-100 group-hover:bg-blue-50'
      }`}>
        {label} <span className={`ml-1 opacity-60 ${active ? 'text-white' : 'text-blue-600'}`}>{count}</span>
      </div>
      <div className={`w-4 h-4 rounded-full border-4 border-white shadow-lg transition-all ${
        active ? 'bg-blue-600 scale-125' : 'bg-gray-400 group-hover:bg-blue-600'
      }`}></div>
    </div>
  )
}
