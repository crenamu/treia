'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  MapPin, 
  Building2, 
  Sparkles,
  Map as MapIcon,
  Filter as FilterIcon,
  TrendingDown,
  Bell,
  ChevronRight,
  Info,
  Rocket,
  ArrowRight
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import DiagnosticTool from './DiagnosticTool'
import ShareSaveButtons from '@/app/components/ShareSaveButtons'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

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
  isMock?: boolean
}

const REGIONS = ['전체', '서울', '경기', '인천', '충청', '경상', '전라', '강원', '제주'];

export default function HousingPage() {
  const params = useParams()
  const router = useRouter()
  const [notices, setNotices] = useState<HousingNotice[]>([])
  const [loading, setLoading] = useState(true)
  const [regionFilter, setRegionFilter] = useState('전체')
  const [showMap, setShowMap] = useState(false)
  const [diagnosed, setDiagnosed] = useState(false)

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

  const filteredNotices = notices.filter(n => 
    regionFilter === '전체' || n.location.includes(regionFilter)
  )

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] pb-24 selection:bg-blue-100">
      <main className="container mx-auto max-w-6xl px-4 md:px-8 py-12 md:py-20">
        
        {/* Premium Header Container */}
        <div className="flex flex-col lg:flex-row gap-16 mb-24 items-center">
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex-[1.2] space-y-8"
           >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-600 rounded-2xl border border-blue-600/10">
                 <Sparkles size={16} className="fill-blue-600" />
                 <span className="text-[10px] font-black uppercase tracking-[2px]">AI Real Estate Engine</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-outfit font-black text-gray-900 leading-[0.95] tracking-tighter">
                당신의 <span className="text-blue-600">첫 안식처</span>를<br/>
                가장 완벽하게 제안합니다
              </h1>
              <p className="text-gray-500 font-medium max-w-md text-lg leading-relaxed">
                복잡한 청약 제도와 쏟아지는 공고들.<br/>
                핀테이블의 AI가 당신의 조건에 맞는 1%의 기회를 찾습니다.
              </p>
              <div className="flex items-center gap-4 pt-4">
                 <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/10">
                    실시간 알림 신청 <Bell size={16} className="ml-2 inline" />
                 </button>
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-[var(--bg-beige)] bg-gray-200 overflow-hidden" key={i}><img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" /></div>)}
                    <div className="w-10 h-10 rounded-full border-4 border-[var(--bg-beige)] bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">+2k</div>
                 </div>
                 <p className="text-[10px] text-gray-400 font-bold">진단받은 예비입주자</p>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8 }}
             className="flex-1 w-full"
           >
              <div className="bg-white rounded-[60px] p-2 shadow-2xl shadow-blue-500/10 border border-gray-100 relative overflow-hidden">
                 <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-blue-200/20 blur-[60px] rounded-full"></div>
                 <DiagnosticTool onComplete={() => setDiagnosed(true)} />
              </div>
           </motion.div>
        </div>

        {/* Dashboard Control Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[48px] p-4 md:p-6 shadow-2xl shadow-gray-200/50 border border-white flex flex-col md:flex-row gap-4 mb-16 items-center sticky top-20 z-40 transition-all duration-500">
           <div className="flex-1 w-full relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="관심 지역, 아파트, 공고 키워드..."
                className="w-full pl-16 pr-6 py-5 bg-gray-50/50 rounded-[32px] border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-base transition-all"
              />
           </div>
           <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
              {['공공임대', '국민임대', '영구임대', '행복주택', '장기전세'].map(type => (
                 <button key={type} className="whitespace-nowrap px-6 py-4 bg-gray-50 border border-transparent hover:border-blue-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-900 transition-all active:scale-95">{type}</button>
              ))}
           </div>
           <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setShowMap(!showMap)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${showMap ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
              >
                 <MapIcon size={20} />
              </button>
              <button className="w-14 h-14 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all">
                 <FilterIcon size={20} />
              </button>
           </div>
        </div>

        {/* Interactive Map Section (Animated Overlay) */}
        <AnimatePresence>
           {showMap && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="mb-16 bg-white rounded-[60px] p-8 border border-blue-100/50 shadow-2xl shadow-blue-500/5 overflow-hidden min-h-[500px] flex flex-col md:flex-row gap-12"
             >
                <div className="flex-1 relative bg-blue-50/30 rounded-[48px] p-12 flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>
                   <KoreaMap onRegionSelect={setRegionFilter} currentRegion={regionFilter} />
                </div>
                <div className="w-full md:w-[380px] space-y-6 flex flex-col">
                   <div className="p-6 bg-blue-600 rounded-[32px] text-white">
                      <h4 className="text-xl font-black mb-2 tracking-tight">지도로 찾는 스마트 청약</h4>
                      <p className="text-xs font-medium text-blue-100 leading-relaxed">지도의 마커를 클릭하거나 좌측의 행정구역을 선택하면 해당 지역의 실시간 공고를 즉시 필터링합니다.</p>
                   </div>
                   <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                      {REGIONS.map(reg => (
                        <button 
                          key={reg}
                          onClick={() => setRegionFilter(reg)}
                          className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border ${regionFilter === reg ? 'bg-blue-50 border-blue-200 text-blue-600 font-black' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-white hover:border-gray-200 font-bold'}`}
                        >
                           {reg === '전체' ? '대한민국 전체' : reg}
                           <ChevronRight size={14} className={regionFilter === reg ? 'opacity-100' : 'opacity-20'} />
                        </button>
                      ))}
                   </div>
                </div>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Dynamic Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {loading ? (
             Array(6).fill(0).map((_, i) => <NoticeSkeleton key={i} />)
           ) : filteredNotices.length === 0 ? (
             <div className="col-span-full py-32 text-center text-gray-400 font-black uppercase tracking-[4px]">No Matching Announcements</div>
           ) : (
             filteredNotices.map((notice, idx) => (
                <NoticeCard key={notice.id} notice={notice} delay={idx * 0.05} diagnosed={diagnosed} router={router} />
             ))
           )}
        </div>

        {/* Global Statistics Banner */}
        <div className="mt-24 bg-gray-900 rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full group-hover:bg-blue-600/30 transition-all duration-700"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                 <div className="w-20 h-20 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-500/40">
                    <Info size={40} />
                 </div>
                 <h2 className="text-4xl md:text-5xl font-outfit font-black leading-tight">주거 데이터 분석실</h2>
                 <p className="text-gray-400 font-medium text-lg leading-relaxed">핀테이블은 매일 2,400개 이상의 공공기관 데이터를 수집하여 분석합니다. 단순한 공고 전달을 넘어 당첨 가점, 주변 시세, 인프라 평점까지 제공하는 유일한 플랫폼입니다.</p>
                 <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-800">
                    <div>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">분석된 누적 공고</p>
                       <p className="text-3xl font-outfit font-black">128,495+</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">실시간 지원자 추이</p>
                        <p className="text-3xl font-outfit font-black">14,209 / day</p>
                    </div>
                 </div>
              </div>
              <div className="flex-1 w-full max-w-sm">
                 <div className="bg-white/5 backdrop-blur-md rounded-[40px] p-10 border border-white/10 space-y-6">
                    <h5 className="text-xl font-bold mb-4">새로운 기회를 놓치지 마세요</h5>
                    <input type="email" placeholder="이메일 주소 입력" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                    <button className="w-full py-5 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">레포트 정기 구독</button>
                    <p className="text-center text-[10px] text-gray-500 font-bold">핀테이블은 당신의 개인정보를 소중히 다룹니다.</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}

function NoticeCard({ notice, delay, diagnosed, router }: { notice: HousingNotice, delay: number, diagnosed: boolean, router: any }) {
  const prob = 72;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group bg-white rounded-[48px] p-1 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-700 cursor-pointer flex flex-col border border-gray-100 h-full relative"
      onClick={() => router.push(`/housing/${notice.id}`)}
    >
       <div className="p-8 pb-10 flex flex-col h-full bg-white rounded-[47px]">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white ${notice.status === '접수중' ? 'bg-blue-600' : 'bg-gray-400'}`}>{notice.status}</span>
                <span className="px-3 py-1.5 rounded-xl bg-gray-50 text-gray-400 text-[9px] font-black uppercase tracking-widest">{notice.provider}</span>
             </div>
             <ShareSaveButtons id={`housing_${notice.id}`} title={notice.title} type="housing" />
          </div>

          <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-[1.3] mb-8 line-clamp-3 min-h-[3.9rem] tracking-tighter">
             {notice.title}
          </h3>

          <div className="flex-1 space-y-4 mb-10">
             <InfoRow icon={<MapPin size={16} />} label="Location" value={notice.location} />
             <InfoRow icon={<Building2 size={16} />} label="Category" value={notice.type} />
             <InfoRow icon={<TrendingDown size={16} />} label="Predicted Competition" value={`${(Math.random() * 8 + 1.2).toFixed(1)} : 1`} isPoint />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
             <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Closing Date</span>
                <p className="text-sm font-black text-gray-900">{notice.date.split('~')[1]?.trim() || '상시'}</p>
             </div>
             {diagnosed ? (
               <div className="text-right">
                  <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1.5 flex items-center justify-end gap-1"><Sparkles size={10} /> Winning Prob</span>
                  <p className="text-2xl font-outfit font-black text-blue-600 leading-none">{prob}%</p>
               </div>
             ) : (
                <div className="text-right">
                   <p className="text-[9px] text-gray-300 font-bold leading-tight">진단 완료 시<br/>당첨 확률 공개</p>
                </div>
             )}
          </div>
       </div>
    </motion.div>
  )
}

function InfoRow({ icon, label, value, isPoint }: { icon: React.ReactNode, label: string, value: string, isPoint?: boolean }) {
  return (
    <div className="flex items-center gap-4 group/row">
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isPoint ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover/row:bg-white border border-transparent group-hover/row:border-blue-100'}`}>
          {icon}
       </div>
       <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5 leading-none">{label}</p>
          <p className={`text-sm font-bold truncate ${isPoint ? 'text-blue-600' : 'text-gray-900 group-hover/row:text-blue-600 transition-colors'}`}>{value}</p>
       </div>
    </div>
  )
}

function NoticeSkeleton() {
  return <div className="bg-white rounded-[48px] h-[450px] animate-pulse border border-gray-50"></div>
}

function KoreaMap({ onRegionSelect, currentRegion }: { onRegionSelect: (reg: string) => void, currentRegion: string }) {
  const regions = [
    { name: '서울', top: '25%', left: '25%', count: 12 },
    { name: '경기', top: '26%', left: '35%', count: 45 },
    { name: '인천', top: '22%', left: '15%', count: 8 },
    { name: '충청', top: '45%', left: '30%', count: 22 },
    { name: '경상', top: '65%', left: '70%', count: 31 },
    { name: '전라', top: '75%', left: '25%', count: 18 },
    { name: '강원', top: '15%', left: '65%', count: 5 },
  ];

  return (
    <div className="relative w-full h-full">
       <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 100 120" className="w-[80%] h-[80%] opacity-10 text-gray-900 stroke-current fill-transparent stroke-[1px]">
             <path d="M40,5 C45,10 55,5 60,10 L70,20 L80,15 L90,30 L85,50 L95,70 L80,100 L60,115 L40,110 L20,115 L10,95 L15,70 L5,50 L20,20 Z" />
          </svg>
       </div>
       {regions.map(r => (
         <button 
           key={r.name}
           onClick={() => onRegionSelect(r.name)}
           className={`absolute flex flex-col items-center gap-2 group transition-all duration-500 ${currentRegion === r.name ? 'z-20 scale-125' : 'z-10'}`}
           style={{ top: r.top, left: r.left }}
         >
            <div className={`px-4 py-2 rounded-2xl text-[10px] font-black shadow-2xl border transition-all ${currentRegion === r.name ? 'bg-blue-600 text-white border-blue-500 scale-110 shadow-blue-500/40' : 'bg-white text-gray-900 border-gray-100 hover:border-blue-200'}`}>
               {r.name}
            </div>
            <div className={`w-3 h-3 rounded-full border-2 border-white transition-all ${currentRegion === r.name ? 'bg-blue-600 scale-150 shadow-lg shadow-blue-500/50' : 'bg-blue-200 group-hover:bg-blue-500'}`}></div>
         </button>
       ))}
    </div>
  )
}
