'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { LoanProduct } from '@/app/actions/loan'
import PremiumProductTemplate from '@/components/PremiumProductTemplate'
import { BANK_LOGOS, BANK_URLS, getSmartLandingUrl } from '@/app/actions/constants'
import { ShieldCheck, Calculator, ArrowRight, Percent, History, Star, Wallet } from 'lucide-react'

export default function LoanDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<LoanProduct | null>(null)
  const [loading, setLoading] = useState(true)

  const [extraData, setExtraData] = useState<{
    rank: number;
    total: number;
    top5: LoanProduct[];
  } | null>(null)

  useEffect(() => {
    fetch(`/api/loans?id=${params.id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data.product || null)
        setExtraData({
          rank: data.rank,
          total: data.total,
          top5: data.top5
        })
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

  const externalLink = useMemo(() => {
    if (!product) return undefined;
    const bankKey = Object.keys(BANK_URLS).find(key => product.kor_co_nm.includes(key));
    return bankKey ? BANK_URLS[bankKey] : 'https://portal.fss.or.kr';
  }, [product]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-gray-400 font-bold">대출 정보를 찾을 수 없습니다.</p>
    </div>
  )

  return (
    <PremiumProductTemplate
      type="loan"
      product={product}
      bankLogo={BANK_LOGOS[product.kor_co_nm] || "/images/banks/savingsbank.png"}
      primaryRate={{
        label: "최저 금리",
        value: product.bestOption?.lend_rate_min || 0,
        suffix: "%",
        subLabel: "최대 한도",
        subValue: product.loan_lmt.match(/\d+/)?.[0] || product.loan_lmt,
      }}
      tags={product.tags}
      metrics={[
        { label: '한도', value: '최대 3억원', icon: <Percent size={14} /> },
        { label: '대상', value: '직장인/공무원', icon: <History size={14} /> },
        { label: '기간', value: '최대 10년', icon: <Star size={14} /> },
        { label: '방식', value: '원리금분균등', icon: <Wallet size={14} /> }
      ]}
      simulator={<LoanRepaymentSimulator product={product} />}
      details={[
        { label: '금리 상세', value: `최저 ${product.bestOption?.lend_rate_min}% ~ 최고 ${product.bestOption?.lend_rate_max}% (평균 ${product.bestOption?.lend_rate_avg}%)` },
        { label: '유의사항', value: '대출 금리는 신용점수 및 은행 내부 심사 기준에 따라 차등 적용될 수 있습니다.', isText: true }
      ]}
      externalLink={getSmartLandingUrl(product.kor_co_nm, product.fin_prdt_nm)}
      ranking={{
        rank: extraData?.rank || 0,
        total: extraData?.total || 0,
        topProducts: extraData?.top5 || []
      }}
      onAction={() => window.open(externalLink, '_blank')}
    />
  )
}

function LoanRepaymentSimulator({ product }: { product: LoanProduct }) {
  const [loanAmount, setLoanAmount] = useState(100000000)
  const [period, setPeriod] = useState(360) // 30년
  
  const monthlyRepayment = useMemo(() => {
    const rate = (product.bestOption?.lend_rate_min || 3.5) / 100 / 12;
    const n = period;
    if (rate === 0) return Math.floor(loanAmount / n);
    // 원리금 균등 상환 수식: [P * r * (1+r)^n] / [(1+r)^n - 1]
    const monthly = (loanAmount * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    return Math.floor(monthly);
  }, [loanAmount, period, product.bestOption]);

  return (
    <div className="bg-white">
      <div className="space-y-8 mb-12">
        <div>
          <label className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-4 block">대출 신청 금액</label>
          <div className="flex items-end gap-2 border-b-2 border-rose-100 pb-2">
            <input 
              type="number" 
              value={loanAmount} 
              onChange={(e) => setLoanAmount(parseInt(e.target.value))}
              className="flex-1 text-3xl font-black text-gray-900 bg-transparent outline-none"
            />
            <span className="text-xl font-bold text-gray-400 mb-1">원</span>
          </div>
        </div>

        <div>
           <label className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-4 block">상환 기간 ({period / 12}년)</label>
           <div className="flex gap-2">
              {[12, 60, 120, 240, 360].map(m => (
                <button 
                  key={m}
                  onClick={() => setPeriod(m)}
                  className={`flex-1 py-3 rounded-xl text-xs font-black border-2 transition-all ${period === m ? 'bg-rose-600 border-rose-600 text-white shadow-lg' : 'bg-white border-gray-50 text-gray-400 hover:border-gray-200'}`}
                >
                  {m / 12}년
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-rose-50/50 rounded-[40px] p-10 mb-8 border border-rose-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 text-rose-100 opacity-20 group-hover:scale-110 transition-transform">
           <Calculator size={100} />
        </div>
        <div className="relative z-10">
          <p className="text-xs font-black text-rose-400 uppercase tracking-widest mb-3">매월 예상 상환액 (원리금균등)</p>
          <h3 className="text-4xl md:text-5xl font-black text-rose-900 tracking-tighter">
            약 {monthlyRepayment.toLocaleString()}<span className="text-xl ml-1">원</span>
          </h3>
          <p className="text-[10px] font-bold text-gray-400 mt-4 leading-relaxed">
            * 우대 금리 미적용, 최저 금리 {product.bestOption?.lend_rate_min}% 기준 시뮬레이션 결과입니다.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-6 bg-white border-2 border-rose-50 rounded-[32px] group cursor-pointer hover:border-rose-200 transition-colors">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
               <ShieldCheck size={24} />
            </div>
            <div>
               <p className="text-sm font-black text-gray-900">우리은행 안심 신용대출</p>
               <p className="text-xs text-gray-400 font-bold">비슷한 금리의 다른 상품 더보기</p>
            </div>
         </div>
         <ArrowRight size={20} className="text-gray-200 group-hover:text-rose-600 transition-all" />
      </div>
    </div>
  )
}
