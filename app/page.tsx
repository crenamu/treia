'use client'

import { useState, useEffect } from 'react'
import { 
  Sparkles,
  ChevronDown,
  ArrowRight,
  Calculator,
  Home,
  Rocket
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getProducts, type Product } from '@/app/actions/finance'

const TERMS = [
  { label: '전체', value: '0' },
  { label: '6개월', value: '6' },
  { label: '12개월', value: '12' },
  { label: '24개월', value: '24' },
  { label: '36개월', value: '36' },
]

const SORTS = [
  { label: '최고금리 높은순', value: 'rate2_desc' },
  { label: '기본금리 높은순', value: 'rate_desc' },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'saving'>('deposit')
  const [trm, setTrm] = useState('0')
  const [sort, setSort] = useState('rate2_desc')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const data = await getProducts(activeTab, trm)
        setProducts(data.products || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [activeTab, trm])

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'rate2_desc') return (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0)
    if (sort === 'rate_desc') return (b.bestOption?.intr_rate || 0) - (a.bestOption?.intr_rate || 0)
    return 0
  })

  const bestBase = products.length > 0 ? [...products].sort((a, b) => (b.bestOption?.intr_rate || 0) - (a.bestOption?.intr_rate || 0))[0] : null
  const bestMax = products.length > 0 ? [...products].sort((a, b) => (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0))[0] : null

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] pb-32">
      <main className="container mx-auto max-w-5xl px-6 pt-16 md:pt-24">
        
        {/* Title Group - Design Adjusted to Image */}
        <div className="mb-14">
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-[2px] mb-6">FINTABLE</p>
            <h1 className="text-5xl md:text-[56px] font-black text-gray-900 leading-[1.15] tracking-tight mb-5">
                지금 가장 좋은 금리,<br/>
                한눈에 비교하세요
            </h1>
            <p className="text-[17px] font-medium text-gray-500 opacity-80">금융감독원 공시 기준 · 실시간 데이터</p>
        </div>

        {/* Restore Content: AI Prediction Tool Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 relative group"
        >
           <div className="relative bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col md:flex-row items-center gap-10 overflow-hidden">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-[32px] flex items-center justify-center text-blue-600 shrink-0">
                 <Sparkles size={40} />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                 <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter mb-4">
                    이번 달 3기 신도시 사전청약,<br/>
                    <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">가장 유리한 예적금 매칭 전략</span>
                 </h2>
                 <p className="text-gray-500 font-medium leading-relaxed max-w-lg">
                    핀테이블 AI가 현재 LH 모집 공고와 시중 368개 상품을 실시간 매칭했습니다. 
                    당첨 점수 부족 시, 이자를 극대화하여 보증금을 마련하는 **&apos;청약 브릿지 상품&apos;**을 추천합니다.
                 </p>
              </div>

              <Link href="/housing" className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-black text-[13px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10 flex items-center gap-3">
                 리포트 받기 <ArrowRight size={18} />
              </Link>
           </div>
        </motion.div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
            <MetricCard 
                label="최고 기본금리" 
                value={bestBase ? `연 ${bestBase.bestOption?.intr_rate.toFixed(2)}%` : '—'} 
                sub={bestBase ? `${bestBase.kor_co_nm} · ${bestBase.fin_prdt_nm}` : ''}
            />
            <MetricCard 
                label="최고 우대금리" 
                value={bestMax ? `연 ${bestMax.bestOption?.intr_rate2.toFixed(2)}%` : '—'} 
                sub={bestMax ? `${bestMax.kor_co_nm} · ${bestMax.fin_prdt_nm}` : ''}
            />
            <MetricCard 
                label="비교 상품 수" 
                value={loading ? '...' : `${products.length}개`} 
                sub={`금감원 공시 기준 202603`}
            />
        </div>

        {/* Filters and List */}
        <div className="space-y-10">
            <div className="flex items-center gap-10 border-b border-gray-100 mb-2">
                <button 
                    onClick={() => setActiveTab('deposit')}
                    className={`pb-5 text-[19px] font-black transition-all relative ${activeTab === 'deposit' ? 'text-gray-900' : 'text-gray-400'}`}
                >
                    예금
                    {activeTab === 'deposit' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-900 rounded-full" />}
                </button>
                <button 
                    onClick={() => setActiveTab('saving')}
                    className={`pb-5 text-[19px] font-black transition-all relative ${activeTab === 'saving' ? 'text-gray-900' : 'text-gray-400'}`}
                >
                    적금 (준비중)
                    {activeTab === 'saving' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-900 rounded-full" />}
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2.5">
                    {TERMS.map(t => (
                        <button 
                            key={t.value}
                            onClick={() => setTrm(t.value)}
                            className={`px-7 py-3 rounded-full text-base font-bold border transition-all ${trm === t.value ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <select 
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-xl px-7 py-3.5 pr-14 text-base font-bold text-gray-700 outline-none cursor-pointer shadow-sm focus:border-gray-300"
                    >
                        {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="py-24 flex flex-col items-center gap-5">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                            <p className="text-base font-bold text-gray-400 uppercase tracking-widest">실시간 데이터 분석 중</p>
                        </div>
                    ) : (
                        sortedProducts.map((p, idx) => (
                            <ProductRow key={p.fin_prdt_cd} product={p} index={idx} tab={activeTab} />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* Benefits Section */}
        <section className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard 
                title="맞춤형 청약 진단" 
                desc="내 점수로 당첨 가능한 집을 찾아드려요." 
                icon={<Home size={28} />} 
                href="/housing"
                tag="NEW"
            />
            <BenefitCard 
                title="지능형 이자 계산" 
                desc="만기 수령액부터 세금까지 한눈에." 
                icon={<Calculator size={28} />} 
                href="/calculator"
            />
            <BenefitCard 
                title="AI 포트폴리오" 
                desc="Treia 엔진의 최적 자산 배분 전략." 
                icon={<Rocket size={28} />} 
                href="/treia"
            />
        </section>
      </main>
    </div>
  )
}

function MetricCard({ label, value, sub }: { label: string, value: string, sub: string }) {
    return (
        <div className="bg-[#F7F6F2] rounded-2xl p-9 border border-[#F1F0EC] transition-all hover:shadow-2xl hover:shadow-gray-200/50">
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">{label}</p>
            <p className="text-[32px] font-black text-gray-900 mb-5 leading-none">{value}</p>
            <p className="text-base font-bold text-gray-500 leading-snug">{sub}</p>
        </div>
    )
}

function ProductRow({ product, index, tab }: { product: Product, index: number, tab: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
        >
            <Link 
                href={`/${tab === 'deposit' ? 'deposits' : 'savings'}/${product.fin_prdt_cd}`}
                className="group flex flex-col md:flex-row items-center justify-between p-10 bg-white border border-gray-100 rounded-[32px] hover:border-gray-200 hover:shadow-2xl transition-all relative"
            >
                <div className="flex-1 w-full md:w-auto mb-8 md:mb-0">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-base font-bold text-gray-400">{product.kor_co_nm}</span>
                        {product.bestOption && product.bestOption.intr_rate2 > 4.0 && (
                            <span className="bg-[#EBF7F1] text-[#10B981] text-[11px] font-black px-3 py-1 rounded-lg">우대조건</span>
                        )}
                        <span className="bg-[#FFF8F1] text-[#FF5A1F] text-[11px] font-black px-3 py-1 rounded-lg">비대면</span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors tracking-tight">
                        {product.fin_prdt_nm}
                    </h3>

                    <div className="flex flex-wrap items-center gap-5 text-[15px] font-medium text-gray-500">
                        <div className="flex items-center gap-2">
                           <span className="text-gray-400">기간</span> <span className="font-bold text-gray-800">{product.bestOption?.save_trm}개월</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-gray-400">단리/복리</span> <span className="font-bold text-gray-800">{product.bestOption?.intr_rate_type_nm}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-gray-400">가입</span> <span className="font-bold text-gray-800">{product.join_way.split(',')[0]}</span>
                        </div>
                    </div>

                    <div className="mt-7">
                         <span className="inline-flex items-center justify-center px-5 py-2 bg-[#F0F5FF] text-blue-600 text-xs font-black rounded-xl border border-blue-100 italic">
                            {product.bestOption?.save_trm}개월
                         </span>
                    </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-10">
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">기본금리</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-outfit font-black text-gray-900 leading-none">
                            {product.bestOption?.intr_rate.toFixed(2)}
                        </span>
                        <span className="text-2xl font-bold text-gray-400 uppercase">%</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

function BenefitCard({ title, desc, icon, href, tag }: { title: string, desc: string, icon: React.ReactNode, href: string, tag?: string }) {
    return (
        <Link href={href} className="group bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative">
            {tag && (
                <span className="absolute top-10 right-10 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-blue-500/20">{tag}</span>
            )}
            <div className="w-16 h-16 rounded-[20px] bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all mb-10">
                {icon}
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{title}</h4>
            <p className="text-base font-medium text-gray-500 leading-relaxed mb-8">{desc}</p>
            <div className="flex items-center gap-3 text-xs font-black text-gray-300 group-hover:text-gray-900 transition-colors uppercase tracking-[2px]">
                Explore <ArrowRight size={16} />
            </div>
        </Link>
    )
}
