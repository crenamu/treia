'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DepositProduct } from '@/types/deposit'
import { 
  ArrowLeft,
  Building2, 
  Calendar, 
  ShieldCheck, 
  Smartphone,
  CheckCircle2,
  TrendingUp,
  Gift,
  HelpCircle,
  Calculator as CalcIcon,
  Plus,
  ArrowUpRight,
  Rocket
} from 'lucide-react'
import ShareSaveButtons from '@/app/components/ShareSaveButtons'
import Link from 'next/link'

export default function SavingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<DepositProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  useEffect(() => {
    fetch(`/api/savings?id=${params.id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data.product || null)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-beige)] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-[var(--bg-beige)] flex flex-col items-center justify-center gap-4">
      <p className="text-gray-400 font-bold">상품 정보를 찾을 수 없습니다.</p>
      <button onClick={() => router.back()} className="text-purple-600 font-bold flex items-center gap-2">
        <ArrowLeft size={16} /> 뒤로가기
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] py-6 md:py-12 pb-32 md:pb-12">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold group">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-gray-50 flex items-center justify-center">
              <ArrowLeft size={18} />
            </div>
            <span>목록으로</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsCompareOpen(true)} className="px-4 py-2 bg-white rounded-xl border border-gray-100 text-xs font-black text-gray-600 hover:bg-gray-50 transition-all">
              <Plus size={14} /> 비교하기
            </button>
            <ShareSaveButtons id={product.fin_prdt_cd} title={product.fin_prdt_nm} type="product" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-400 font-bold">{product.kor_co_nm}</span>
                <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                <span className="text-xs text-purple-600 font-black tracking-widest uppercase">정기적금</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-outfit font-black text-gray-900 mb-8 leading-tight">{product.fin_prdt_nm}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <BenefitCard icon={<Rocket size={20} className="text-purple-500" />} title="목돈 만들기 최적" desc="적은 금액부터 차근차근 목표를 달성하세요." />
                <BenefitCard icon={<TrendingUp size={20} className="text-blue-500" />} title="최고 금리 반영" desc="우대 조건 충족 시 업계 최고 수준의 이자를 제공합니다." />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <InfoItem icon={<ShieldCheck size={16} className="text-blue-500" />} label="보호 여부" value="예금자보호 대상" />
                <InfoItem icon={<Building2 size={16} className="text-purple-500" />} label="가입 대상" value={product.join_member} />
                <InfoItem icon={<Calendar size={16} className="text-orange-500" />} label="공시 시작일" value={product.dcls_strt_day} />
                <InfoItem icon={<Smartphone size={16} className="text-green-500" />} label="가입 방법" value={product.join_way} />
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp size={20} className="text-purple-600" /> 기간별 적금 금리
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      <th className="py-4 px-4 text-left">기간</th>
                      <th className="py-4 px-4 text-left">금리유형</th>
                      <th className="py-4 px-4 text-right">기본</th>
                      <th className="py-4 px-4 text-right">최고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.options.map((opt, i) => (
                      <tr key={i} className={`border-b border-gray-50 last:border-none ${opt.save_trm === '12' ? 'bg-purple-50/30' : ''}`}>
                        <td className="py-5 px-4 font-bold text-gray-900">{opt.save_trm}개월</td>
                        <td className="py-5 px-4 font-medium text-gray-500">{opt.intr_rate_type_nm}</td>
                        <td className="py-5 px-4 text-right font-outfit font-black text-gray-900">연 {opt.intr_rate}%</td>
                        <td className="py-5 px-4 text-right font-outfit font-black text-purple-600">연 {opt.intr_rate2}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <RateSimulator product={product} color="purple" />

            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 space-y-10">
              <DetailSection title="우대 조건" content={product.spcl_cnd} />
              <DetailSection title="만기 후 이자율" content={product.mtrt_int} />
              <DetailSection title="기타 유의사항" content={product.etc_note} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-900 rounded-[32px] p-8 text-white shadow-2xl shadow-purple-900/20 sticky top-24">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-purple-400">Monthly Savings</span>
              <p className="text-sm font-medium text-purple-300 mb-4">최대 우대 적용 시</p>
              <div className="text-5xl font-outfit font-black text-white mb-8">연 {product.bestOption.intr_rate2}%</div>
              
              <button className="w-full py-5 bg-white text-purple-900 font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-purple-50 transition-all shadow-xl">상품 가입하기</button>
              <Link href="/calculator" className="mt-4 w-full py-5 bg-white/10 hover:bg-white/20 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2">
                <CalcIcon size={16} /> 예상 수령액 확인
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isCompareOpen && <ComparisonDrawer product={product} onClose={() => setIsCompareOpen(false)} />}
    </div>
  )
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-5 bg-gray-50 rounded-[24px] border border-gray-100 flex items-start gap-4">
      <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-xs text-gray-400 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{icon} {label}</div>
      <p className="text-xs font-bold text-gray-900 truncate">{value}</p>
    </div>
  )
}

function DetailSection({ title, content }: { title: string, content: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-[2px] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
        {title}
      </h3>
      <div className="text-sm text-gray-500 leading-relaxed pl-4 border-l-2 border-gray-50 whitespace-pre-wrap">{content || '데이터가 없습니다.'}</div>
    </div>
  )
}

function RateSimulator({ product, color }: { product: DepositProduct, color: string }) {
  const [checked, setChecked] = useState(false)
  const base = product.bestOption.intr_rate
  const max = product.bestOption.intr_rate2
  
  return (
    <div className={`bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm`}>
      <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
        <CalcIcon size={20} className={color === 'purple' ? 'text-purple-600' : 'text-green-600'} /> 금리 시뮬레이션
      </h3>
      <div className="space-y-4">
        <button onClick={() => setChecked(!checked)} className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${checked ? 'border-purple-500 bg-purple-50/50' : 'border-gray-50 bg-gray-50'}`}>
          <div className="flex items-center gap-4">
             <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${checked ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300 bg-white'}`}>
                {checked && <CheckCircle2 size={16} />}
             </div>
             <p className="text-sm font-bold text-gray-900">모든 우대 조건 충족 시</p>
          </div>
          <span className="text-xs font-black text-purple-600">+{ (max - base).toFixed(2) }%p</span>
        </button>
        <div className="p-8 bg-gray-900 rounded-[24px] text-center">
           <p className="text-[10px] text-purple-400 font-black uppercase tracking-[2px] mb-2">예상 적용 금리</p>
           <div className="text-5xl font-outfit font-black text-white">연 {checked ? max : base}%</div>
        </div>
      </div>
    </div>
  )
}

function ComparisonDrawer({ product, onClose }: { product: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
       <div className="w-full max-w-2xl bg-white rounded-t-[48px] p-10 shadow-2xl animate-in slide-in-from-bottom duration-500">
          <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-10"></div>
          <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">비교함에 담았습니다</h3>
          <p className="text-gray-500 font-medium mb-10">최대 3개의 상품을 한눈에 비교하고 최고의 수익률을 선택하세요.</p>
          
          <div className="space-y-4 mb-10">
             <div className="flex items-center gap-4 p-5 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 font-black border border-purple-100">1</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-purple-600 font-black uppercase">담긴 상품</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{product.fin_prdt_nm}</p>
                </div>
             </div>
             <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-dashed border-gray-200 opacity-60">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 font-black border border-gray-100">+</div>
                <p className="text-sm font-bold text-gray-400">비교할 상품을 더 선택하세요</p>
             </div>
          </div>
          
          <div className="flex gap-4">
             <button onClick={onClose} className="flex-1 py-5 bg-gray-100 text-gray-600 rounded-[20px] font-black text-xs uppercase tracking-widest">계속 둘러보기</button>
             <button className="flex-[2] py-5 bg-purple-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/20">비교하기 (1/3)</button>
          </div>
       </div>
    </div>
  )
}
