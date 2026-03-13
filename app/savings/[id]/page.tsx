'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DepositProduct } from '@/types/deposit'
import { 
  ArrowLeft,
  Building2, 
  Calendar, 
  Smartphone,
  CheckCircle2,
  TrendingUp,
  PiggyBank,
  Gift,
  HelpCircle,
} from 'lucide-react'
import ShareSaveButtons from '@/app/components/ShareSaveButtons'

export default function SavingsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<DepositProduct | null>(null)
  const [loading, setLoading] = useState(true)

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
    <div className="min-h-screen bg-[var(--bg-beige)] py-6 md:py-12 pb-32 md:pb-12">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors group"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-gray-50 flex items-center justify-center">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm md:text-base">목록으로</span>
          </button>
          <ShareSaveButtons 
            id={product.fin_prdt_cd} 
            title={product.fin_prdt_nm} 
            type="product" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-400 font-bold">{product.kor_co_nm}</span>
                <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                <span className="text-xs text-blue-600 font-black tracking-widest uppercase">목돈적금</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-outfit font-black text-gray-900 mb-8 leading-tight">
                {product.fin_prdt_nm}
              </h1>

              {/* Toss Style Benefit Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <BenefitCard 
                  icon={<Gift size={20} className="text-pink-500" />}
                  title="강력한 우대금리"
                  desc={product.spcl_cnd.split('\n')[0].substring(0, 40) + '...'}
                />
                <BenefitCard 
                  icon={<PiggyBank size={20} className="text-orange-500" />}
                  title="차곡차곡 적립식"
                  desc={product.bestOption.rsrv_type_nm === '자유적립식' ? '원할 때 언제든 입금 가능한 자유적립식 상품입니다.' : '매달 일정 금액을 꾸준히 모으는 정액적립식 상품입니다.'}
                />
              </div>

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

            {/* BankSalad Style Rate Simulator */}
            <RateSimulator product={product} />

            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 space-y-10">
              <DetailSection title="우대 조건" content={product.spcl_cnd} />
              <DetailSection title="만기 후 이율" content={product.mtrt_int} />
              <DetailSection title="가입 제한" content={product.join_deny === '1' ? '제한 없음' : product.join_deny === '2' ? '서민전용' : '일부 제한'} />
              <DetailSection title="유의사항" content={product.etc_note} />
            </div>
          </div>

          {/* Sticky Bottom Bar for Mobile */}
          <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 lg:hidden flex items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-500">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">최고 금리</span>
              <span className="text-xl font-outfit font-black text-blue-600 leading-none">연 {product.bestOption.intr_rate2.toFixed(2)}%</span>
            </div>
            <button className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
              가입하기
            </button>
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

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4 hover:border-blue-100 transition-all shadow-sm">
      <div className="shrink-0 p-3 bg-gray-50 rounded-xl">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-xs text-gray-400 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function RateSimulator({ product }: { product: DepositProduct }) {
  const [checked, setChecked] = useState(false)
  const baseRate = product.bestOption.intr_rate
  const maxRate = product.bestOption.intr_rate2
  
  return (
    <div className="bg-[var(--bg-beige)] border-2 border-white rounded-[32px] p-8 shadow-inner">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl text-blue-700">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">금리 시뮬레이터</h3>
            <p className="text-xs text-gray-500 font-medium">우대 조건을 만족하면 얼마를 받을까요?</p>
          </div>
        </div>
        <HelpCircle size={18} className="text-gray-300" />
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => setChecked(!checked)}
          className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${checked ? 'bg-white border-blue-500 shadow-md shadow-blue-500/5' : 'bg-white/50 border-white hover:bg-white hover:border-gray-200'}`}
        >
          <div className="flex items-start gap-4 text-left">
            <div className={`mt-1 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-200'}`}>
              {checked && <Check size={14} strokeWidth={4} />}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">모든 우대 조건 충족 시</p>
              <p className="text-[10px] text-gray-400 font-medium mt-1">급여 이체, 첫 거래, 마케팅 동의 등 포함</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-blue-600">+{ (maxRate - baseRate).toFixed(2) }% p</span>
          </div>
        </button>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">예상 적용 금리</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-outfit font-black transition-colors ${checked ? 'text-blue-600' : 'text-gray-900'}`}>
              {(checked ? maxRate : baseRate).toFixed(2)}
            </span>
            <span className="text-xl font-bold text-gray-400">%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Check({ size, strokeWidth }: { size: number, strokeWidth: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
