'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Trophy,
  Bookmark,
  Plus
} from 'lucide-react'
import ShareSaveButtons from '@/app/components/ShareSaveButtons'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Info } from 'lucide-react'
import Link from 'next/link'


interface PremiumProductTemplateProps {
  type: 'deposit' | 'saving' | 'card' | 'loan'
  product: {
    fin_prdt_cd?: string;
    id?: string;
    fin_prdt_nm?: string;
    name?: string;
    kor_co_nm?: string;
    company?: string;
  }
  bankLogo?: string
  externalLink?: string
  ranking?: {
    rank: number
    total: number
    topProducts: {
      fin_prdt_cd?: string;
      id?: string;
      fin_prdt_nm?: string;
      name?: string;
      kor_co_nm?: string;
      company?: string;
      effectiveRate?: number;
      bestBenefit?: string;
    }[]
  }
  allOptions?: {
    period: string
    rate: number
    rate2: number
    type: string
  }[]
  primaryRate: {
    label: string
    value: string | number
    suffix: string
    subLabel?: string
    subValue?: string | number
  }
  tags: string[]
  metrics: {
    label: string
    value: string
    icon?: React.ReactNode
  }[]
  simulator: React.ReactNode
  details: {
    label: string
    value: string
    isText?: boolean
  }[]
  actionLabel?: string
  onAction?: () => void
}

export default function PremiumProductTemplate({
  type,
  product,
  bankLogo,
  externalLink,
  ranking,
  allOptions,
  primaryRate,
  tags,
  metrics,
  simulator,
  details,
  actionLabel,
  onAction
}: PremiumProductTemplateProps) {
  const router = useRouter()
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // 테마 컬러 결정
  const theme = useMemo(() => {
    switch(type) {
      case 'deposit': return { primary: 'text-blue-600', bg: 'bg-blue-50', button: 'bg-[#10B981]', shadow: 'shadow-green-500/20' };
      case 'saving': return { primary: 'text-purple-600', bg: 'bg-purple-50', button: 'bg-purple-600', shadow: 'shadow-purple-500/20' };
      case 'loan': return { primary: 'text-rose-600', bg: 'bg-rose-50', button: 'bg-rose-600', shadow: 'shadow-rose-500/20' };
      case 'card': return { primary: 'text-indigo-600', bg: 'bg-indigo-50', button: 'bg-indigo-600', shadow: 'shadow-indigo-500/20' };
      default: return { primary: 'text-gray-900', bg: 'bg-gray-50', button: 'bg-gray-900', shadow: 'shadow-gray-500/20' };
    }
  }, [type]);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Top Header Navigation */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-50 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 -ml-1 text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <button 
             className="p-2 text-gray-400 hover:text-gray-900"
          >
            <Plus size={22} />
          </button>
          <ShareSaveButtons 
            id={product.fin_prdt_cd || product.id || ''} 
            title={product.fin_prdt_nm || product.name || ''} 
            type="product" 
          />
        </div>
      </div>

      <div className="container mx-auto max-w-2xl text-left">
        {/* Detail Header Section */}
        <header className="px-6 pt-10 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6 text-center md:text-left">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100 flex items-center justify-center bg-white shadow-sm ring-4 ring-gray-50/50">
              <img src={bankLogo || "/images/banks/savingsbank.png"} alt={product.kor_co_nm || product.company} className="w-9 h-9 object-contain" />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-sm font-bold text-gray-400 mb-1">{product.kor_co_nm || product.company}</span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight tracking-tight">
                {product.fin_prdt_nm || product.name}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-8 border-y border-gray-50 mt-4">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">{primaryRate.label}</span>
              <span className={`text-4xl font-outfit font-black ${theme.primary} tracking-tighter`}>
                {primaryRate.value}<span className="text-xl ml-0.5">{primaryRate.suffix}</span>
              </span>
            </div>
            {primaryRate.subLabel && (
              <div className="flex flex-col items-center md:items-start border-l border-gray-50 pl-4">
                <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">{primaryRate.subLabel}</span>
                <span className="text-4xl font-outfit font-black text-gray-900 tracking-tighter">
                  {primaryRate.subValue}<span className="text-xl ml-0.5">{primaryRate.suffix}</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mt-8">
            {tags.map(tag => <Tag key={tag} label={tag} />)}
          </div>

          {externalLink && (
            <div className="mt-8 flex justify-center md:justify-start">
              <button 
                onClick={() => window.open(externalLink, '_blank')}
                className="text-xs font-black text-gray-400 hover:text-gray-900 flex items-center gap-1 group transition-all"
              >
                {product.kor_co_nm || product.company}에서 보기
                <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          )}
        </header>

        <Divider />

        {/* Metrics Grid */}
        <section className="px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50/30">
           {metrics.map((m, i) => (
             <div key={i} className="flex flex-col gap-1.5">
               <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {m.icon} {m.label}
               </div>
               <p className="text-sm font-bold text-gray-900">{m.value}</p>
             </div>
           ))}
        </section>

        <Divider />

        {/* Simulator Section */}
        <section className="py-12">
          <div className="px-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">실시간 분석</h2>
              <button 
                onClick={() => setIsDetailModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-xl text-[11px] font-black hover:bg-gray-100 transition-colors"
              >
                <Info size={14} /> 우대조건 상세보기
              </button>
            </div>
            <p className="text-sm text-gray-400 font-bold mb-10">상품 가입 시 예상되는 혜택을 확인해 보세요</p>
            {simulator}
          </div>
        </section>

        {/* Ranking Section */}
        {ranking && (
          <section 
            onClick={() => setIsRankingModalOpen(true)}
            className="px-6 py-8 flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center gap-5 text-left">
              <div className={`w-12 h-12 ${theme.bg} rounded-2xl flex items-center justify-center ${theme.primary} shadow-sm`}>
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">시장 분석 데이터</p>
                <p className="text-lg font-black text-gray-900 tracking-tight">
                  상위 <span className={theme.primary}>TOP {ranking.rank || 5}</span> 이내 경쟁력 보유
                </p>
              </div>
            </div>
            <ArrowRight size={22} className="text-gray-200 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
          </section>
        )}

        {ranking && <Divider />}

        {/* Rates by Period Table */}
        {allOptions && allOptions.length > 0 && (
          <section className="py-12 border-b border-gray-50">
             <div className="px-6">
                <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">기간별 금리</h2>
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden overflow-x-auto scrollbar-hide">
                   <table className="w-full text-left border-collapse min-w-[300px]">
                      <thead>
                         <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">기간</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">최고금리(기본)</th>
                         </tr>
                      </thead>
                      <tbody>
                         {allOptions.map((opt, i) => (
                           <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/30 transition-colors">
                              <td className="px-6 py-4 text-sm font-bold text-gray-900">{opt.period}개월</td>
                              <td className="px-6 py-4 text-sm font-black text-right">
                                 <span className={theme.primary}>{opt.rate2}%</span>
                                 <span className="text-[11px] text-gray-300 ml-1">({opt.rate}%)</span>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </section>
        )}

        {/* 상세 정보 섹션 */}
        <section className="py-16">
          <div className="px-6">
            <h2 className="text-xl font-black text-gray-900 mb-8 tracking-tight">상품 정보</h2>
            <div className="divide-y divide-gray-100 border-t border-gray-100">
              {details.map((d, i) => (
                <InfoRow key={i} label={d.label} value={d.value} isText={d.isText} />
              ))}
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
          <button 
            onClick={onAction}
            className={`flex-1 py-5 ${theme.button} text-white font-black text-lg rounded-3xl transition-all shadow-xl ${theme.shadow} active:scale-[0.98]`}
          >
            {actionLabel || `${product.kor_co_nm || product.company}에서 보기`}
          </button>
        </div>
      </footer>

      {/* Ranking Modal */}
      <AnimatePresence>
        {isRankingModalOpen && ranking && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRankingModalOpen(false)}
              className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-[40px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-gray-50">
                <div>
                   <h3 className="text-xl font-black text-gray-900">시장 최고 금리 TOP 5</h3>
                   <p className="text-xs text-gray-400 font-bold mt-1">상위 {ranking.rank}위를 차지한 아주 경쟁력 있는 상품입니다.</p>
                </div>
                <button 
                   onClick={() => setIsRankingModalOpen(false)}
                   className="p-3 bg-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors"
                >
                   <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                 {ranking.topProducts.map((p, i) => (
                    <Link 
                      key={p.fin_prdt_cd || p.id} 
                      href={`/${type}s/${p.fin_prdt_cd || p.id}`}
                      className="flex items-center gap-4 p-5 hover:bg-gray-50 rounded-3xl border border-transparent hover:border-gray-100 transition-all group"
                      onClick={() => setIsRankingModalOpen(false)}
                    >
                       <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-black ${i === 0 ? 'bg-amber-400 border-amber-400 text-white' : 'bg-white border-gray-100 text-gray-300'}`}>
                          {i + 1}
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-400">{p.kor_co_nm || p.company}</p>
                          <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{p.fin_prdt_nm || p.name}</p>
                       </div>
                       <div className="text-right">
                          <p className={`text-lg font-black ${i === 0 ? 'text-blue-600' : 'text-gray-900'}`}>{p.effectiveRate || p.bestBenefit || '-'}{!p.bestBenefit && '%'}</p>
                       </div>
                    </Link>
                 ))}
              </div>
              <div className="p-8 bg-gray-50/50">
                 <button 
                   onClick={() => {
                     setIsRankingModalOpen(false);
                     router.push(`/${type}s`);
                   }}
                   className="w-full py-5 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-900 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                 >
                   전체 랭킹 보러가기
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Detail Modal (우대조건 등) */}
      <AnimatePresence>
        {isDetailModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-[40px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-gray-50">
                <div>
                   <h3 className="text-xl font-black text-gray-900">상세 우대 조건</h3>
                   <p className="text-xs text-gray-400 font-bold mt-1">놓치기 쉬운 혜택 조건을 꼼끔하게 확인하세요.</p>
                </div>
                <button 
                   onClick={() => setIsDetailModalOpen(false)}
                   className="p-3 bg-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors"
                >
                   <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
                 {details.filter(d => d.isText || d.label === '우대 조건').map((d, i) => (
                    <div key={i} className="space-y-4">
                       <h4 className="text-lg font-black text-gray-900 flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${theme.button}`} />
                          {d.label}
                       </h4>
                       <div className="p-6 bg-gray-50 rounded-3xl text-sm md:text-base text-gray-600 font-medium leading-relaxed whitespace-pre-wrap border border-gray-100">
                          {d.value}
                       </div>
                    </div>
                 ))}
                 
                 <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 mb-8">
                    <p className="text-[11px] font-bold text-blue-400 mb-2 uppercase tracking-wider">안내사항</p>
                    <p className="text-xs text-blue-700/70 font-medium leading-relaxed">
                       위 데이터는 금융감독원 공시 정보를 바탕으로 제공됩니다. 정확한 금리 및 조건은 가입 시점에 금융기관 홈페이지를 통해 다시 한번 확인해 주시기 바랍니다.
                    </p>
                 </div>
              </div>
              <div className="p-8 bg-white border-t border-gray-50">
                 <button 
                   onClick={() => setIsDetailModalOpen(false)}
                   className={`w-full py-5 ${theme.button} rounded-2xl text-lg font-black text-white shadow-xl ${theme.shadow} active:scale-[0.98] transition-all`}
                 >
                   확인했습니다
                 </button>
              </div>
            </motion.div>
          </>
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
  if (!value || value === '-') return null;
  return (
    <div className="py-7 flex flex-col gap-2">
      <span className="text-sm font-bold text-gray-900">{label}</span>
      <p className={`text-sm md:text-base text-gray-500 font-medium leading-relaxed ${isText ? 'whitespace-pre-wrap' : ''}`}>
        {value}
      </p>
    </div>
  )
}
