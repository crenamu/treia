'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  MapPin, 
  Building2, 
  Sparkles,
  Filter as FilterIcon,
  TrendingDown,
  ArrowRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import ShareSaveButtons from '@/app/components/ShareSaveButtons'
import { motion, AnimatePresence } from 'framer-motion'
import { getHousingNotices, type HousingNotice } from '@/app/actions/housing'

const REGIONS = ['전체', '서울', '경기', '인천', '충청', '경상', '전라', '강원', '제주'];

export default function HousingPage() {
  const router = useRouter()
  const [notices, setNotices] = useState<HousingNotice[]>([])
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState('전체')
  const [diagnosed, setDiagnosed] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const data = await getHousingNotices()
        setNotices(data.notices || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = notices.filter(n => region === '전체' || n.location.includes(region));

  return (
    <div className="min-h-screen bg-[var(--bg-beige)]">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-100 pt-12 md:pt-20 pb-12">
        <div className="container mx-auto max-w-5xl px-6">
           <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-blue-600" />
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest">AI Real Estate Engine</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tighter mb-8">
             당신의 <span className="text-blue-600">첫 안식처</span>를<br/>
             가장 완벽하게 분석합니다
           </h1>
           
           <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="지역, 아파트명, 단지명을 입력하세요"
                  className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:bg-white rounded-3xl py-5 pl-16 pr-8 text-base font-bold outline-none transition-all shadow-sm"
                />
              </div>
              <button className="px-10 py-5 bg-gray-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-3">
                 <FilterIcon size={18} /> 정밀 필터링
              </button>
           </div>
        </div>
      </div>

      <main className="container mx-auto max-w-5xl px-6 py-16">
        {/* Region Selector */}
        <div className="flex flex-wrap gap-2 mb-12">
            {REGIONS.map(r => (
                <button 
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all ${region === r ? 'bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-900/10' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
                >
                  {r}
                </button>
            ))}
        </div>

        <div className="flex justify-between items-center mb-10">
           <h2 className="text-2xl font-black text-gray-900 tracking-tight">실시간 모집 공고</h2>
           <p className="text-sm font-bold text-gray-400">총 {filtered.length}개의 분석 결과</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
           <AnimatePresence>
              {loading ? (
                [1,2,3,4].map(i => <NoticeSkeleton key={i} />)
              ) : (
                filtered.map((n, idx) => (
                  <NoticeCard key={n.id} notice={n} delay={idx * 0.05} diagnosed={diagnosed} router={router} />
                ))
              )}
           </AnimatePresence>
        </div>

        {/* Diagnostic CTA */}
        {!diagnosed && (
          <div className="mt-24 bg-blue-600 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-500/30">
             <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 blur-[100px] rounded-full"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-center md:text-left">
                   <h3 className="text-3xl font-black mb-4 leading-tight">나의 당첨 확률이 궁금하신가요?</h3>
                   <p className="text-blue-100 font-medium text-lg leading-relaxed max-w-lg">
                      LH/SH 청약은 점수 싸움입니다. 3분 만에 끝나는 AI 진단으로 
                      내가 당첨될 수 있는 공고와 최적의 브릿지 금융 상품을 매칭받으세요.
                   </p>
                </div>
                <button 
                  onClick={() => setDiagnosed(true)}
                  className="px-10 py-5 bg-white text-blue-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-3 shadow-xl"
                >
                   무료 진단하기 <ArrowRight size={18} />
                </button>
             </div>
          </div>
        )}
      </main>

      {/* Analytics Insight Footer */}
      <div className="bg-gray-900 py-32 text-white mt-16">
        <div className="container mx-auto max-w-5xl px-6">
           <div className="flex flex-col md:flex-row items-center gap-20">
              <div className="flex-1 space-y-8">
                 <div className="w-16 h-1 bg-blue-600"></div>
                 <h2 className="text-4xl md:text-5xl font-black leading-tight">주거 데이터 분석실</h2>
                 <p className="text-gray-400 font-medium text-lg leading-relaxed">
                    핀테이블은 매일 2,400개 이상의 공공데이터를 수집합니다. 
                    단순 공고 전달을 넘어 당첨 가점, 주변 시세, 인프라 평점까지 
                    제공하는 국내 유일의 리얼데이터 큐레이션 플랫폼입니다.
                 </p>
                 <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-800">
                    <div>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">분석된 누적 공고</p>
                       <p className="text-3xl font-black">128,495+</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">오늘의 진단 건수</p>
                        <p className="text-3xl font-black">14,209+</p>
                    </div>
                 </div>
              </div>
              <div className="w-full max-w-sm">
                 <div className="bg-white/5 backdrop-blur-md rounded-[40px] p-10 border border-white/10 space-y-8">
                    <h5 className="text-xl font-bold">새로운 기회를 놓치지 마세요</h5>
                    <input type="email" placeholder="이메일 주소 입력" className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-600" />
                    <button className="w-full py-5 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all">실시간 리포트 구독</button>
                    <p className="text-center text-[10px] text-gray-500 font-bold opacity-50 uppercase tracking-widest">FinTable Intelligence Team</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function NoticeCard({ notice, delay, diagnosed, router }: { notice: HousingNotice, delay: number, diagnosed: boolean, router: { push: (url: string) => void } }) {
  const prob = 72;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer flex flex-col h-full relative"
      onClick={() => router.push(`/housing/${notice.id}`)}
    >
       <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
             <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white ${notice.status === '접수중' ? 'bg-blue-600' : 'bg-gray-400'}`}>{notice.status}</span>
             <span className="px-3 py-1.5 rounded-xl bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">{notice.provider}</span>
          </div>
          <ShareSaveButtons id={`housing_${notice.id}`} title={notice.title} type="housing" />
       </div>

       <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-[1.3] mb-8 line-clamp-2 min-h-[3.2rem] tracking-tighter">
          {notice.title}
       </h3>

       <div className="flex-1 space-y-6 mb-10">
          <InfoRow icon={<MapPin size={18} />} label="Location" value={notice.location} />
          <InfoRow icon={<Building2 size={18} />} label="Category" value={notice.type} />
          <InfoRow icon={<TrendingDown size={18} />} label="Analysis" value="주변 대비 35% 저렴" isPoint />
       </div>

       <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-100">
          <div className="flex flex-col">
             <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Closing Date</span>
             <p className="text-base font-black text-gray-900">{notice.date.split('~')[1]?.trim() || '상시 모집'}</p>
          </div>
          {diagnosed ? (
            <div className="text-right flex flex-col items-end">
               <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-2 flex items-center gap-1"><Sparkles size={12} /> Prob</span>
               <p className="text-3xl font-black text-blue-600 leading-none">{prob}%</p>
            </div>
          ) : (
             <div className="text-right flex flex-col items-end">
                <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-2">Prob</span>
                <p className="text-sm text-gray-300 font-bold leading-tight">진단 시 공개</p>
             </div>
          )}
       </div>
    </motion.div>
  )
}

function InfoRow({ icon, label, value, isPoint }: { icon: React.ReactNode, label: string, value: string, isPoint?: boolean }) {
  return (
    <div className="flex items-center gap-5">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isPoint ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-white group-hover:shadow-lg border border-transparent'}`}>
          {icon}
       </div>
       <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 leading-none">{label}</p>
          <p className={`text-base font-bold truncate ${isPoint ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600 transition-colors'}`}>{value}</p>
       </div>
    </div>
  )
}

function NoticeSkeleton() {
  return <div className="bg-gray-100 rounded-[40px] h-[450px] animate-pulse"></div>
}
