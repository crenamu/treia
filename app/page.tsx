'use client'

import { useState, useEffect } from 'react'
import { 
  Sparkles,
  ChevronDown,
  ArrowRight,
  Calculator,
  Home,
  Rocket,
  TrendingUp,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Activity
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
  const [isMock, setIsMock] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const data = await getProducts(activeTab, trm)
        setProducts(data.products || [])
        setIsMock(!!data.isMock)
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

  const bestBase = products.length > 0 && products[0].fin_prdt_cd !== 'FETCH_FAIL' ? [...products].sort((a, b) => (b.bestOption?.intr_rate || 0) - (a.bestOption?.intr_rate || 0))[0] : null
  const bestMax = products.length > 0 && products[0].fin_prdt_cd !== 'FETCH_FAIL' ? [...products].sort((a, b) => (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0))[0] : null

  return (
    <div className="min-h-screen bg-[var(--bg-beige)] pb-32">
      <main className="container mx-auto max-w-5xl px-6 pt-16 md:pt-24">
        
        {/* Title Group */}
        <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
                <p className="text-[13px] font-bold text-blue-600 uppercase tracking-[3px]">FinTable Intelligence</p>
                {isMock ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        <Activity size={10} /> Simulation Mode
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        <Activity size={10} className="animate-pulse" /> Live Data
                    </span>
                )}
            </div>
            <h1 className="text-5xl md:text-[64px] font-black text-gray-900 leading-[1.1] tracking-tight mb-6">
                지금 당신에게<br/>
                <span className="text-blue-600">가장 유리한 금리</span>
            </h1>
            <p className="text-xl font-medium text-gray-400">
                {isMock ? '현재 금융권 데이터 점검 중으로 시뮬레이션 데이터를 표시합니다.' : '전 금융권 실시간 데이터 기반 맞춤형 큐레이션'}
            </p>
        </div>

        {/* Global Market Insight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
            <MarketCard icon={<TrendingUp size={28} />} label="Market: USD/KRW" value="1,342.50" change="+2.10" type="up" />
            <MarketCard icon={<Coins size={28} />} label="Market: Gold Price" value="114,200" change="-0.45" type="down" unit="KRW/G" />
        </div>

        {/* AI Prediction Tool Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-20 relative"
        >
           <div className="relative bg-blue-600 rounded-[56px] p-10 md:p-16 text-white shadow-2xl shadow-blue-500/30 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
              <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-blue-600 shrink-0 shadow-2xl">
                 <Sparkles size={48} className="animate-pulse" />
              </div>
              
              <div className="flex-1 text-center md:text-left z-10">
                 <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter leading-tight">
                    이번 달 3기 신도시 사전청약,<br/>
                    가장 유리한 예적금 <span className="text-blue-200">매칭 전략</span>
                 </h2>
                 <p className="text-blue-100 font-medium text-lg leading-relaxed max-w-xl">
                    현재 LH 공고와 시중 금융 상품을 {isMock ? '시뮬레이션 분석' : '실시간 분석'}했습니다. 
                    당첨 점수 부족 시, 이자를 극대화하여 보증금을 마련하는 **청약 브릿지 상품**을 지금 바로 확인하세요.
                 </p>
              </div>

              <Link href="/housing" className="px-12 py-6 bg-white text-blue-600 rounded-[32px] font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all shadow-2xl flex items-center gap-3 active:scale-95">
                 리포트 받기 <ArrowRight size={20} />
              </Link>
           </div>
        </motion.div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            <MetricCard 
                label="최고 기본금리" 
                value={bestBase ? `연 ${bestBase.bestOption?.intr_rate.toFixed(2)}%` : '—'} 
                sub={bestBase ? `${bestBase.kor_co_nm} · ${bestBase.fin_prdt_nm}` : '데이터 수집 중'}
            />
            <MetricCard 
                label="최고 우대금리" 
                value={bestMax ? `연 ${bestMax.bestOption?.intr_rate2.toFixed(2)}%` : '—'} 
                sub={bestMax ? `${bestMax.kor_co_nm} · ${bestMax.fin_prdt_nm}` : '금융권 통합 분석'}
            />
            <MetricCard 
                label="비교 상품 수" 
                value={loading ? '...' : `${products.length}개`} 
                sub={isMock ? '데이터 연동 모니터링 중' : '전 금융권 실시간 통합'}
            />
        </div>

        {/* Product Selection Interface */}
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-8 gap-10">
                <div className="flex items-center gap-12">
                    <button 
                        onClick={() => setActiveTab('deposit')}
                        className={`text-2xl md:text-3xl font-black transition-all relative ${activeTab === 'deposit' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
                    >
                        정기예금
                        {activeTab === 'deposit' && <motion.div layoutId="t-line" className="absolute -bottom-8 left-0 right-1/2 h-[4px] bg-blue-600 rounded-full" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('saving')}
                        className={`text-2xl md:text-3xl font-black transition-all relative ${activeTab === 'saving' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
                    >
                        정기적금
                        {activeTab === 'saving' && <motion.div layoutId="t-line" className="absolute -bottom-8 left-0 right-1/2 h-[4px] bg-blue-600 rounded-full" />}
                    </button>
                </div>

                <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                    {TERMS.map(t => (
                        <button 
                            key={t.value}
                            onClick={() => setTrm(t.value)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${trm === t.value ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center mb-4 px-2">
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">
                    {loading ? '검색 중...' : `${products.length}개의 상품 ${isMock ? '시뮬레이션' : '실시간'} 분석 완료`}
                 </p>
                 <div className="relative">
                    <select 
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="appearance-none bg-white border border-gray-100 rounded-xl px-6 py-3 pr-12 text-sm font-bold text-gray-600 outline-none cursor-pointer shadow-sm focus:border-blue-100 transition-all"
                    >
                        {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="py-32 flex flex-col items-center gap-6">
                            <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-sm font-black text-gray-300 uppercase tracking-[4px] animate-pulse">Data Synching</p>
                        </div>
                    ) : products.length === 0 || products[0].fin_prdt_cd === 'FETCH_FAIL' ? (
                        <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                             <p className="text-gray-400 font-bold mb-4">현재 데이터를 불러올 수 없습니다.</p>
                             <button onClick={() => window.location.reload()} className="text-blue-600 font-black text-sm uppercase tracking-widest">다시 시도하기</button>
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
        <section className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard 
                title="맞춤형 청약 진단" 
                desc="내 점수와 자산으로 당첨 가능한 공고를 선별해 드려요." 
                icon={<Home size={28} />} 
                href="/housing"
                tag="LH/SH 연동"
            />
            <BenefitCard 
                title="지능형 이자 계산" 
                desc="세금 우대 혜택과 만기 실수령액을 1원 단위로 분석합니다." 
                icon={<Calculator size={28} />} 
                href="/calculator"
            />
            <BenefitCard 
                title="AI 포트폴리오" 
                desc="가장 낮은 리스크로 가장 높은 수익을 만드는 배분 전략." 
                icon={<Rocket size={28} />} 
                href="/treia"
            />
        </section>
      </main>
    </div>
  )
}

function MarketCard({ icon, label, value, change, type, unit }: { icon: React.ReactNode, label: string, value: string, change: string, type: 'up' | 'down', unit?: string }) {
    return (
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-500 ${type === 'up' ? 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white' : 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">{label}</p>
                    <h4 className="text-2xl font-black text-gray-900 tracking-tighter">
                        {value} {unit && <span className="text-[10px] text-gray-400 font-bold ml-1 uppercase">{unit}</span>}
                    </h4>
                </div>
            </div>
            <div className="flex items-center gap-1">
                {type === 'up' ? <ArrowUpRight className="text-green-500" size={16} /> : <ArrowDownRight className="text-red-500" size={16} />}
                <span className={`text-xs font-bold ${type === 'up' ? 'text-green-600' : 'text-red-600'}`}>{change}</span>
            </div>
        </div>
    )
}

function MetricCard({ label, value, sub }: { label: string, value: string, sub: string }) {
    return (
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 transition-all hover:shadow-2xl hover:shadow-gray-200/50 group">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-6 group-hover:text-blue-600 transition-colors">{label}</p>
            <p className="text-[36px] font-black text-gray-900 mb-6 leading-none tracking-tighter">{value}</p>
            <p className="text-sm font-bold text-gray-500 leading-snug opacity-70 truncate">{sub}</p>
        </div>
    )
}

function ProductRow({ product, index, tab }: { product: Product, index: number, tab: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
        >
            <Link 
                href={`/${tab === 'deposit' ? 'deposits' : 'savings'}/${product.fin_prdt_cd}`}
                className="group flex flex-col md:flex-row items-center justify-between p-10 bg-white border border-gray-100 rounded-[48px] hover:border-blue-100 hover:shadow-2xl transition-all relative overflow-hidden"
            >
                <div className="flex-1 w-full md:w-auto mb-8 md:mb-0">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="text-[13px] font-black text-gray-400 uppercase tracking-widest">{product.kor_co_nm}</span>
                        {product.bestOption && product.bestOption.intr_rate2 > 4.2 && (
                            <span className="bg-green-50 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">파격금리</span>
                        )}
                        <span className="bg-gray-50 text-gray-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">비대면</span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-gray-900 mb-5 group-hover:text-blue-600 transition-colors tracking-tighter leading-tight">
                        {product.fin_prdt_nm}
                    </h3>

                    <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-400">
                        <div className="flex items-center gap-2">
                           <span className="opacity-40 font-black uppercase tracking-widest text-[9px]">Term</span> <span className="text-gray-700">{product.bestOption?.save_trm}개월</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="opacity-40 font-black uppercase tracking-widest text-[9px]">Type</span> <span className="text-gray-700">{product.bestOption?.intr_rate_type_nm}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-10 md:border-l md:border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[2px]">Annual Rate</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-outfit font-black text-gray-900 leading-none tracking-tighter">
                            {product.bestOption?.intr_rate.toFixed(2)}
                        </span>
                        <span className="text-2xl font-bold text-gray-300 uppercase">%</span>
                    </div>
                    <p className="text-sm font-black text-blue-600 mt-4 bg-blue-50 px-3 py-1 rounded-lg">최고 연 {product.bestOption?.intr_rate2.toFixed(2)}%</p>
                </div>
            </Link>
        </motion.div>
    )
}

function BenefitCard({ title, desc, icon, href, tag }: { title: string, desc: string, icon: React.ReactNode, href: string, tag?: string }) {
    return (
        <div className="group bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col items-center text-center cursor-pointer">
            {tag && (
                <span className="absolute top-10 right-10 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-xl shadow-blue-500/20">{tag}</span>
            )}
            <div className="w-20 h-20 rounded-[32px] bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 mb-10 shadow-sm">
                {icon}
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter">{title}</h4>
            <p className="text-base font-medium text-gray-500 leading-relaxed mb-10 px-4">{desc}</p>
            <Link href={href} className="text-[11px] font-black text-gray-300 group-hover:text-blue-600 transition-colors uppercase tracking-[3px] flex items-center gap-2">
                Explore Core <ArrowRight size={14} />
            </Link>
        </div>
    )
}
