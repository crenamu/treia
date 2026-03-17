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
import { motion } from 'framer-motion'


interface PremiumProductTemplateProps {
  type: 'deposit' | 'saving' | 'card' | 'loan'
  product: any
  bankLogo?: string
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
  primaryRate,
  tags,
  metrics,
  simulator,
  details,
  actionLabel,
  onAction
}: PremiumProductTemplateProps) {
  const router = useRouter()
  const [isInfoExpanded, setIsInfoExpanded] = useState(false)

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
            id={product.fin_prdt_cd || product.id} 
            title={product.fin_prdt_nm || product.name} 
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
            <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">실시간 분석</h2>
            <p className="text-sm text-gray-400 font-bold mb-10">상품 가입 시 예상되는 혜택을 확인해 보세요</p>
            {simulator}
          </div>
        </section>

        <Divider />

        {/* Ranking Section Placeholder */}
        <section className="px-6 py-8 flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 transition-colors">
          <div className="flex items-center gap-5 text-left">
            <div className={`w-12 h-12 ${theme.bg} rounded-2xl flex items-center justify-center ${theme.primary} shadow-sm`}>
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">시장 분석 데이터</p>
              <p className="text-lg font-black text-gray-900 tracking-tight">상위 <span className={theme.primary}>TOP 5</span> 이내 경쟁력 보유</p>
            </div>
          </div>
          <ArrowRight size={22} className="text-gray-200 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
        </section>

        <Divider />

        {/* Product Information Grid */}
        <section className="py-12">
          <div className="px-6">
            <h2 className="text-2xl font-black text-gray-900 mb-10 tracking-tight">상세 정보</h2>
            <div className="space-y-10">
              {details.slice(0, isInfoExpanded ? undefined : 3).map((d, i) => (
                <InfoRow key={i} label={d.label} value={d.value} isText={d.isText} />
              ))}
              
              <button 
                onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                className="w-full py-5 flex items-center justify-center gap-2 text-sm font-black text-gray-400 hover:text-gray-900 transition-all border-t border-gray-50 mt-4 group"
              >
                {isInfoExpanded ? '상세 정보 접기' : '정보 더 보기'} 
                <span className={`transition-transform duration-300 ${isInfoExpanded ? 'rotate-180' : ''}`}>
                  <ChevronDown size={18} />
                </span>
              </button>
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
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">{label}</span>
      <p className={`text-base md:text-lg text-gray-800 font-bold leading-relaxed ${isText ? 'whitespace-pre-wrap' : ''}`}>
        {value}
      </p>
    </div>
  )
}
