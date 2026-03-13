'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DepositProduct } from '@/types/deposit'
import { 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Building2, 
  Calendar, 
  Info, 
  ShieldCheck, 
  Smartphone,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  PiggyBank
} from 'lucide-react'

export default function SavingsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<DepositProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/savings`)
      .then(r => r.json())
      .then(data => {
        const found = data.products?.find((p: DepositProduct) => p.fin_prdt_cd === params.id)
        setProduct(found || null)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-beige)] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-[var(--bg-beige)] flex flex-col items-center justify-center gap-4">
      <p className="text-gray-400 font-bold">상품 정보를 찾을 수 없습니다.</p>
      <button onClick={() => router.back()} className="text-green-600 font-bold flex items-center gap-2">
        <ArrowLeft size={16} /> 뒤로가기
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] py-12">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors group"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-gray-50">
              <ArrowLeft size={18} />
            </div>
            <span>목록으로</span>
          </button>
          <div className="flex gap-3">
             <button className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
               <Share2 size={20} className="text-gray-400" />
             </button>
             <button 
               onClick={() => setIsSaved(!isSaved)}
               className={`p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 transition-colors ${isSaved ? 'bg-green-50 border-green-100' : 'hover:bg-gray-50'}`}
             >
               <Bookmark size={20} className={isSaved ? 'text-green-600' : 'text-gray-400'} fill={isSaved ? 'currentColor' : 'none'} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-400 font-bold">{product.kor_co_nm}</span>
                <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                <span className="text-xs text-blue-600 font-black tracking-widest uppercase">목돈적금</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-outfit font-black text-gray-900 mb-8 leading-tight">
                {product.fin_prdt_nm}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <InfoItem icon={<PiggyBank size={16} className="text-blue-500" />} label="적립 방식" value={product.bestOption.rsrv_type_nm || '정기적립'} />
                <InfoItem icon={<Building2 size={16} className="text-purple-500" />} label="가입 대상" value={product.join_member} />
                <InfoItem icon={<Calendar size={16} className="text-orange-500" />} label="공시 시작일" value={product.dcls_strt_day} />
                <InfoItem icon={<Smartphone size={16} className="text-green-500" />} label="가입 방법" value={product.join_way.includes('인터넷') ? '비대면' : '복합'} />
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp size={20} className="text-green-600" />
                기간별 금리 상세
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-4 px-4 text-left text-gray-400 font-black uppercase tracking-widest text-[10px]">기간</th>
                      <th className="py-4 px-4 text-left text-gray-400 font-black uppercase tracking-widest text-[10px]">적립유형</th>
                      <th className="py-4 px-4 text-right text-gray-400 font-black uppercase tracking-widest text-[10px]">기본금리</th>
                      <th className="py-4 px-4 text-right text-gray-400 font-black uppercase tracking-widest text-[10px]">최고금리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.options.map((opt, i) => (
                      <tr key={i} className={`border-b border-gray-50 last:border-none ${opt.save_trm === '12' ? 'bg-blue-50/20' : ''}`}>
                        <td className="py-5 px-4 font-bold text-gray-900">{opt.save_trm}개월</td>
                        <td className="py-5 px-4 font-medium text-gray-500">{opt.rsrv_type_nm}</td>
                        <td className="py-5 px-4 text-right font-outfit font-black text-gray-900 text-lg">연 {opt.intr_rate.toFixed(2)}%</td>
                        <td className="py-5 px-4 text-right font-outfit font-black text-blue-600 text-lg">연 {opt.intr_rate2.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 space-y-10">
              <DetailSection title="우대 조건" content={product.spcl_cnd} />
              <DetailSection title="만기 후 이율" content={product.mtrt_int} />
              <DetailSection title="가입 제한" content={product.join_deny === '1' ? '제한 없음' : product.join_deny === '2' ? '서민전용' : '일부 제한'} />
              <DetailSection title="유의사항" content={product.etc_note} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 rounded-[32px] p-8 text-white shadow-2xl shadow-gray-900/20 sticky top-24">
              <div className="flex flex-col gap-1 mb-8">
                <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-500">지금 바로 쌓아보기</span>
                <p className="text-sm font-medium text-gray-400">최대 우대율 기준</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-outfit font-black text-blue-400">연 {product.bestOption.intr_rate2.toFixed(2)}%</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <BenefitItem label="안전한 예금자보호" />
                <BenefitItem label="다양한 우대조건 제공" />
                <BenefitItem label="편리한 모바일 가입" />
              </div>

              <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/20">
                적금 가입하러 가기
              </button>
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
      <span className="text-xs font-bold text-gray-900 truncate">{value}</span>
    </div>
  )
}

function DetailSection({ title, content }: { title: string, content: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-[2px] flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
        {title}
      </h3>
      <div className="text-sm text-gray-600 leading-[1.8] font-medium whitespace-pre-wrap pl-4 border-l-2 border-gray-50">
        {content || '정보가 공개되지 않았습니다.'}
      </div>
    </div>
  )
}

function BenefitItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
      <CheckCircle2 size={16} className="text-blue-500" />
      {label}
    </div>
  )
}
