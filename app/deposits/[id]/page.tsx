'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DepositProduct } from '@/types/deposit'
import { 
  ArrowLeft,
  Plus,
  ArrowRight,
  ChevronDown,
  Info,
  Trophy,
  Bookmark,
  TrendingUp
} from 'lucide-react'
import ShareSaveButtons from '@/app/components/ShareSaveButtons'
import { BANK_LOGOS } from '@/app/actions/constants'
import { motion, AnimatePresence } from 'framer-motion'

export default function DepositDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<DepositProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCompareOpen, setIsCompareOpen] = useState(false)
  const [isInfoExpanded, setIsInfoExpanded] = useState(false)

  useEffect(() => {
    fetch(`/api/deposits?id=${params.id}`)
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

  const bankLogo = useMemo(() => {
    if (!product) return null;
    const bankKey = Object.keys(BANK_LOGOS).find(key => product.kor_co_nm.includes(key));
    return bankKey ? BANK_LOGOS[bankKey] : '/images/banks/savingsbank.png';
  }, [product]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-gray-400 font-bold">상품 정보를 찾을 수 없습니다.</p>
      <button onClick={() => router.back()} className="text-green-600 font-bold flex items-center gap-2">
        <ArrowLeft size={16} /> 뒤로가기
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Top Header Navigation */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-50 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 -ml-1 text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <button 
             onClick={() => setIsCompareOpen(true)}
             className="p-2 text-gray-400 hover:text-gray-900"
          >
            <Plus size={22} />
          </button>
          <ShareSaveButtons 
            id={product.fin_prdt_cd} 
            title={product.fin_prdt_nm} 
            type="product" 
          />
        </div>
      </div>

      <div className="container mx-auto max-w-2xl">
        {/* Detail Header Section */}
        <header className="px-6 pt-10 pb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100 flex items-center justify-center bg-white shadow-sm ring-4 ring-gray-50/50">
              <img src={bankLogo || "/images/banks/savingsbank.png"} alt={product.kor_co_nm} className="w-9 h-9 object-contain" />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-sm font-bold text-gray-400 mb-1">{product.kor_co_nm}</span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight tracking-tight">
                {product.fin_prdt_nm}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-8 border-y border-gray-50 mt-4">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">최고 금리</span>
              <span className="text-4xl font-outfit font-black text-blue-600 tracking-tighter">
                {product.bestOption.intr_rate2.toFixed(1)}<span className="text-xl ml-0.5">%</span>
              </span>
            </div>
            <div className="flex flex-col items-center md:items-start border-l border-gray-50 pl-4">
              <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">기본 금리</span>
              <span className="text-4xl font-outfit font-black text-gray-900 tracking-tighter">
                {product.bestOption.intr_rate.toFixed(1)}<span className="text-xl ml-0.5">%</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mt-8">
            <Tag label="정기예금" />
            <Tag label="비대면" />
            {product.max_limit ? (
               <Tag label={`${Math.floor(product.max_limit / 10000)}만원 한도`} />
            ) : (
               <Tag label="한도제한 없음" />
            )}
          </div>

          <button className="mt-6 text-xs font-black text-gray-400 flex items-center gap-1.5 hover:text-gray-600 transition-colors mx-auto md:mx-0">
            {product.kor_co_nm} 웹사이트에서 보기 <ArrowRight size={14} />
          </button>
        </header>

        <Divider />

        {/* Disclaimer / Notice */}
        <section className="px-6 py-5 bg-gray-50/50">
          <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
            이 정보는 금융감독원 공시 내용(24.03.17 기준)을 바탕으로 제공되며, 실제 가입 시점의 금리와 상이할 수 있습니다. <br className="hidden md:block" />
            상세 가입 조건 및 우대 이율은 해당 금융기관에서 반드시 재확인하시기 바랍니다.
          </p>
        </section>

        <Divider />

        {/* Main Section: Interest Calculator */}
        <section className="py-12">
          <div className="px-6">
            <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">이자 계산기</h2>
            <p className="text-sm text-gray-400 font-bold mb-10">내 상황에 맞는 예상 이자를 확인해 보세요</p>
            <RateSimulator product={product} />
          </div>
        </section>

        <Divider />

        {/* Ranking Section */}
        <section className="px-6 py-8 flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 transition-colors">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm shadow-amber-200/50">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">예금 상품 랭킹</p>
              <p className="text-lg font-black text-gray-900 tracking-tight">상위 <span className="text-amber-500">5위</span>권 최고 금리 상품</p>
            </div>
          </div>
          <ArrowRight size={22} className="text-gray-200 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
        </section>

        <Divider />

        {/* Product Information Grid */}
        <section className="py-12">
          <div className="px-6 text-left">
            <h2 className="text-2xl font-black text-gray-900 mb-10 tracking-tight">상품 정보</h2>
            <div className="space-y-10">
              <InfoRow label="가입 금액" value={product.max_limit ? `최소 1만원 ~ 최대 ${Math.floor(product.max_limit / 10000)}만원` : '금액 제한 없음'} />
              <InfoRow label="가입 대상" value={product.join_member} />
              <InfoRow label="가입 방법" value={product.join_way} />
              
              <AnimatePresence>
                {isInfoExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-10 pt-10"
                  >
                    <InfoRow label="우대 조건" value={product.spcl_cnd} isText />
                    <InfoRow label="만기 후 이율" value={product.mtrt_int} isText />
                    <InfoRow label="기타 유의사항" value={product.etc_note} isText />
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                className="w-full py-5 flex items-center justify-center gap-2 text-sm font-black text-gray-400 hover:text-gray-700 transition-all border-t border-gray-50 mt-4 group"
              >
                {isInfoExpanded ? '상세 정보 접기' : '정보 더 보기'} 
                <span className={`transition-transform duration-300 ${isInfoExpanded ? 'rotate-180' : ''}`}>
                  <ChevronDown size={18} />
                </span>
              </button>
            </div>
          </div>
        </section>

        <Divider />

        {/* Period Rates List */}
        <section className="py-12 bg-gray-50/30">
          <div className="px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">기간별 금리</h2>
              <span className="text-xs font-bold text-gray-400 group flex items-center gap-1">세전 기준 <Info size={12} /></span>
            </div>
            <div className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between text-[11px] font-black text-gray-300 uppercase tracking-widest mb-6">
                <span>계약 기간</span>
                <span>최고(기본) 이율</span>
              </div>
              <div className="space-y-6">
                {product.options.sort((a,b) => parseInt(a.save_trm) - parseInt(b.save_trm)).map((opt, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-base font-black text-gray-900">{opt.save_trm}개월</span>
                    <div className="text-right">
                      <span className="text-xl font-outfit font-black text-blue-600">
                        {opt.intr_rate2.toFixed(1)}%
                      </span>
                      <span className="text-sm font-bold text-gray-300 ml-1.5">({opt.intr_rate.toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Fixed Bottom Action UI */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 md:p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.08)]">
        <div className="container mx-auto max-w-2xl flex gap-3">
          <button className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl text-gray-400 hover:bg-gray-200 transition-colors active:scale-95">
             <Bookmark size={24} />
          </button>
          <button className="flex-1 py-5 bg-[#10B981] hover:bg-[#059669] text-white font-black text-lg rounded-3xl transition-all shadow-xl shadow-green-500/20 active:scale-[0.98]">
            {product.kor_co_nm}에서 열기
          </button>
        </div>
      </footer>

      {/* Comparison Drawer Placeholder */}
      <AnimatePresence>
        {isCompareOpen && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center"
             onClick={() => setIsCompareOpen(false)}
           >
             <motion.div 
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="w-full max-w-2xl bg-white rounded-t-[48px] p-10 pb-16"
               onClick={e => e.stopPropagation()}
             >
               <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-10"></div>
               <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">비교함에 추가</h3>
               <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 mb-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                     <img src={bankLogo || ""} alt="은행 로고" className="w-7 h-7 object-contain" />
                  </div>
                  <div className="flex-1">
                     <p className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">선택된 상품</p>
                     <p className="text-lg font-bold text-gray-900">{product.fin_prdt_nm}</p>
                  </div>
               </div>
               <button className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-3xl shadow-2xl shadow-blue-500/20 active:scale-95 transition-transform">
                  상품 비교 시작하기
               </button>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Tag({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-[11px] font-black rounded-lg border border-gray-100/50">
      {label}
    </span>
  )
}

function Divider() {
  return <div className="h-[1px] bg-gray-50 w-full" />
}

function InfoRow({ label, value, isText = false }: { label: string, value: string, isText?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">{label}</span>
      <p className={`text-base md:text-lg text-gray-800 font-bold leading-relaxed ${isText ? 'whitespace-pre-wrap' : ''}`}>
        {value}
      </p>
    </div>
  )
}

function RateSimulator({ product }: { product: DepositProduct }) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({})
  const [trmIndex, setTrmIndex] = useState(0)
  
  const defaultIdx = product.options.findIndex(o => o.save_trm === '12');
  useEffect(() => {
    if (defaultIdx !== -1) setTrmIndex(defaultIdx);
  }, [defaultIdx]);

  const currentOption = product.options[trmIndex] || product.bestOption;
  
  const primeConditions = useMemo(() => {
    return product.spcl_cnd
      .split(/\d+\./)
      .map(s => s.trim())
      .filter(s => s.length > 5);
  }, [product.spcl_cnd]);

  const toggleItem = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  }

  const baseRate = currentOption.intr_rate;
  const maxRate = currentOption.intr_rate2;
  const primeTotal = maxRate - baseRate;
  
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const simulatedRate = useMemo(() => {
    if (primeConditions.length === 0) return baseRate;
    const increment = (primeTotal / Math.max(1, primeConditions.length)) * checkedCount;
    return Math.min(maxRate, baseRate + increment);
  }, [baseRate, maxRate, primeTotal, primeConditions.length, checkedCount]);

  const amount = 10000000;
  const months = parseInt(currentOption.save_trm);
  const beforeTaxInterest = Math.floor(amount * (simulatedRate / 100) * (months / 12));
  const afterTaxInterest = Math.floor(beforeTaxInterest * (1 - 0.154));

  return (
    <div className="bg-white">
      {/* Month Selector Tabs */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
        {product.options.sort((a,b) => parseInt(a.save_trm) - parseInt(b.save_trm)).map((opt, i) => (
          <button
            key={i}
            onClick={() => setTrmIndex(i)}
            className={`px-7 py-4 rounded-2xl text-sm font-black transition-all whitespace-nowrap border-2 ${trmIndex === i ? 'bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-900/10' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'}`}
          >
            {opt.save_trm}개월
          </button>
        ))}
      </div>

      <div className="text-center bg-gray-50/50 rounded-[40px] p-10 mb-12 border border-gray-50 shadow-inner">
        <h3 className="text-5xl md:text-6xl font-black text-blue-600 mb-4 font-outfit tracking-tighter">
          {simulatedRate.toFixed(2)}<span className="text-2xl ml-1">%</span>
        </h3>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">
          기본 {baseRate.toFixed(1)}% <span className="mx-2 text-gray-200">|</span> <span className="text-blue-500">우대 +{(simulatedRate - baseRate).toFixed(2)}%p</span>
        </p>
      </div>

      <div className="bg-[#111827] rounded-[32px] p-8 mb-12 flex items-center justify-between shadow-2xl shadow-gray-900/20 group cursor-pointer active:scale-[0.98] transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">1,000만원 예치 시</p>
            <p className="text-xl font-black text-white tracking-tight">세후 이자 <span className="text-blue-400">{afterTaxInterest.toLocaleString()}</span>원</p>
          </div>
        </div>
        <ArrowRight size={20} className="text-gray-700 group-hover:text-blue-400 transition-colors" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-black text-gray-900 uppercase tracking-wider">우대 금리 조건</p>
          <span className="text-[11px] font-bold text-gray-400">항목을 눌러 적용해 보세요</span>
        </div>
        {primeConditions.slice(0, 6).map((cond, i) => (
          <div 
            key={i}
            onClick={() => toggleItem(i)}
            className={`flex items-center justify-between py-5 px-6 rounded-3xl border-2 transition-all cursor-pointer select-none ${checkedItems[i] ? 'bg-blue-50/30 border-blue-500 shadow-lg shadow-blue-500/5' : 'bg-white border-gray-50 hover:border-gray-200'}`}
          >
            <div className="flex-1 pr-6">
              <p className={`text-sm md:text-base font-bold transition-colors ${checkedItems[i] ? 'text-blue-900' : 'text-gray-600'}`}>
                {cond.length > 50 ? cond.substring(0, 50) + '...' : cond}
              </p>
              <button className="text-[10px] font-black text-gray-400 mt-2 flex items-center gap-1 hover:text-gray-600">상세 보기 <ChevronDown size={10} /></button>
            </div>
            <div className={`w-14 h-7 rounded-full transition-all relative shrink-0 ${checkedItems[i] ? 'bg-blue-600' : 'bg-gray-100'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${checkedItems[i] ? 'left-8' : 'left-1'}`}></div>
            </div>
          </div>
        ))}
        {primeConditions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Info size={24} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-400 font-bold">등록된 우대 조건 상세 정보가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
