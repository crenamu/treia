'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  MapPin, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  TrendingUp,
  Sparkles,
  Info,
  Rocket,
  Globe,
  ArrowRight
} from 'lucide-react'
import ShareSaveButtons from '@/app/components/ShareSaveButtons'
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
  description?: string
}

export default function HousingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [notice, setNotice] = useState<HousingNotice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/housing?id=${params.id}`)
      .then(r => r.json())
      .then(data => {
        setNotice(data.notice || null)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-beige)] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  )

  if (!notice) return (
    <div className="min-h-screen bg-[var(--bg-beige)] flex flex-col items-center justify-center gap-4">
      <p className="text-gray-400 font-bold">공고 정보를 찾을 수 없습니다.</p>
      <button onClick={() => router.back()} className="text-blue-600 font-bold flex items-center gap-2">
        <ArrowLeft size={16} /> 뒤로가기
      </button>
    </div>
  )

  const prob = 72; // Mock AI Probability

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] py-12 pb-32">
      <div className="container mx-auto max-w-5xl px-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-12">
           <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold group">
             <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-gray-50 flex items-center justify-center transition-all">
               <ArrowLeft size={18} />
             </div>
             <span>공고 목록으로</span>
           </button>
           <ShareSaveButtons id={notice.id} title={notice.title} type="housing" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Main Content */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* Header Card */}
              <div className="bg-white rounded-[48px] p-10 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 blur-3xl opacity-50"></div>
                 <div className="flex items-center gap-3 mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${notice.status === '접수중' ? 'bg-blue-600' : 'bg-gray-400'}`}>
                      {notice.status}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-gray-50 text-gray-400 text-[9px] font-black uppercase tracking-widest">
                       {notice.provider}
                    </span>
                 </div>
                 <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 leading-tight tracking-tighter">
                    {notice.title}
                 </h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-gray-50 rounded-[32px] border border-gray-100/50">
                    <InfoItem icon={<MapPin size={18} className="text-blue-500" />} label="지역" value={notice.location} />
                    <InfoItem icon={<Building2 size={18} className="text-purple-500" />} label="공급 유형" value={notice.type} />
                    <InfoItem icon={<Calendar size={18} className="text-orange-500" />} label="모집 기간" value={notice.date} />
                    <InfoItem icon={<ShieldCheck size={18} className="text-green-500" />} label="공급 기관" value={notice.org} />
                 </div>
              </div>

              {/* AI Analysis Section */}
              <div className="bg-gray-900 rounded-[48px] p-10 md:p-12 text-white shadow-2xl shadow-blue-900/10 relative overflow-hidden">
                 <div className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full"></div>
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                       <Sparkles size={24} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black tracking-tight">AI 심층 분석 리포트</h2>
                       <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">FinTable Intelligence v2.0</p>
                    </div>
                 </div>

                 <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <p className="text-sm font-bold text-gray-400">당첨 가점 예측</p>
                          <div className="flex items-baseline gap-2">
                             <span className="text-5xl font-outfit font-black text-white">74.2</span>
                             <span className="text-xl font-bold text-blue-500">pts</span>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">과거 유사 공고의 커트라인과 현재 유입 데이터를 기반으로 산출된 예상 점수입니다.</p>
                       </div>
                       <div className="space-y-4">
                          <p className="text-sm font-bold text-gray-400">주변 시세 대비</p>
                          <div className="flex items-baseline gap-2">
                             <span className="text-5xl font-outfit font-black text-green-400">35</span>
                             <span className="text-xl font-bold text-green-500">% 저렴</span>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">반경 1km 이내 유사 평형 아파트 전세가 평균 대비 실질 혜택 비율입니다.</p>
                       </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                       <h4 className="flex items-center gap-2 text-sm font-bold mb-4">
                          <Info size={16} className="text-blue-500" /> AI 총평
                       </h4>
                       <p className="text-sm text-gray-400 leading-relaxed font-medium italic">
                          &quot;본 공고는 {notice.location} 지역의 핵심 인프라를 누릴 수 있는 최적의 기회입니다. 
                          특히 일반 공급 대비 우대 대상 조건이 완화되어 있어, 
                          청년/신혼부부 계층의 전략적 지원 시 당첨 가능성이 매우 높을 것으로 분석됩니다.&quot;
                       </p>
                    </div>
                 </div>
              </div>

              {/* Housing Tips / Details */}
              <div className="bg-white rounded-[48px] p-10 md:p-12 shadow-sm border border-gray-100 space-y-12">
                 <DetailSection 
                   title="공고 상세 설명" 
                   content={notice.description || '이 공고는 LH와 SH의 통합 정보를 기반으로 FinTable AI가 재구성한 내용입니다. 실제 신청 시 모집공고문을 반드시 확인하시기 바랍니다.'} 
                 />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <TipCard icon={<TrendingUp size={20} />} title="경쟁률 분석" desc="실시간 1.2:1" />
                    <TipCard icon={<Globe size={20} />} title="주변 인프라" desc="A+ 등급" />
                    <TipCard icon={<ShieldCheck size={20} />} title="보증금 보호" desc="100% 보장" />
                 </div>
              </div>
           </div>

           {/* Sidebar */}
           <div className="space-y-8">
              <div className="bg-blue-600 rounded-[48px] p-8 text-white shadow-2xl shadow-blue-500/20 sticky top-24">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-6">
                    <Sparkles size={12} className="fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Winning Probability</span>
                 </div>
                 <p className="text-sm font-medium text-blue-100 mb-2">나의 예상 당첨 확률</p>
                 <div className="text-6xl font-outfit font-black text-white mb-4">{prob}%</div>
                 <p className="text-[10px] text-blue-200 font-bold mb-10 leading-relaxed">
                    * 진단 도구를 통한 고객님의 정보를 바탕으로 AI가 계산한 수치입니다.
                 </p>
                 
                 <div className="space-y-3">
                    <button 
                      onClick={() => notice.link && window.open(notice.link, '_blank')}
                      className="w-full py-5 bg-white text-blue-600 font-black text-sm uppercase tracking-widest rounded-3xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                    >
                       청약 신청하러 가기 <ArrowRight size={18} />
                    </button>
                    <button className="w-full py-5 bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-3xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3">
                       <Calendar size={18} /> 일정 알림 받기
                    </button>
                 </div>
              </div>

              <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm text-center">
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">Related Bridge Strategy</p>
                 <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                    <Rocket size={28} />
                 </div>
                 <h4 className="text-lg font-black text-gray-900 mb-3 tracking-tight">청약 브릿지 상품</h4>
                 <p className="text-xs text-gray-500 font-medium mb-8 leading-relaxed">
                    본 공고 당첨 시 보증금 마련을 돕는<br/>최적의 금융 상품을 확인하세요.
                 </p>
                 <Link href="/savings" className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center justify-center gap-2 hover:gap-4 transition-all">
                    View Matching Products <ArrowRight size={14} />
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col gap-2">
       <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {icon}
          {label}
       </div>
       <p className="text-base font-bold text-gray-900">{value}</p>
    </div>
  )
}

function DetailSection({ title, content }: { title: string, content: string }) {
  return (
    <div className="space-y-6">
       <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
          {title}
       </h3>
       <div className="text-base text-gray-600 leading-relaxed pl-5 whitespace-pre-wrap font-medium">
          {content}
       </div>
    </div>
  )
}

function TipCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col items-center text-center gap-3 hover:bg-white hover:shadow-xl transition-all duration-500">
       <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm border border-gray-100">{icon}</div>
       <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-sm font-black text-gray-900">{desc}</p>
       </div>
    </div>
  )
}
