'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CardProduct } from '@/app/actions/card'
import PremiumProductTemplate from '@/components/PremiumProductTemplate'
import { BANK_LOGOS, BANK_URLS, getSmartLandingUrl } from '@/app/actions/constants'
import { CreditCard, History, Percent, Star, Wallet } from 'lucide-react'
import { useMemo } from 'react'

export default function CardDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<CardProduct | null>(null)
  const [loading, setLoading] = useState(true)

  const [extraData, setExtraData] = useState<{
    rank: number;
    total: number;
    top5: any[];
  } | null>(null)

  useEffect(() => {
    fetch(`/api/cards?id=${params.id}`)
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
    const bankKey = Object.keys(BANK_LOGOS).find(key => product.company.includes(key));
    return bankKey ? BANK_LOGOS[bankKey] : null;
  }, [product]);

  const externalLink = useMemo(() => {
    if (!product) return undefined;
    const bankKey = Object.keys(BANK_URLS).find(key => product.company.includes(key));
    return bankKey ? BANK_URLS[bankKey] : 'https://www.shinhancard.com';
  }, [product]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-gray-400 font-bold">카드 정보를 찾을 수 없습니다.</p>
    </div>
  )

  return (
    <PremiumProductTemplate
      type="card"
      product={product}
      bankLogo={bankLogo || ""} 
      primaryRate={{
        label: "최대 혜택",
        value: product.bestBenefit.match(/\d+/)?.[0] || "HOT",
        suffix: product.bestBenefit.includes('%') ? "%" : "만",
        subLabel: "연회비",
        subValue: product.annualFee.replace(/[^0-9]/g, '').slice(0, -3) || "0",
      }}
      tags={product.tags}
      metrics={[
        { label: '카드 종류', value: product.type === 'credit' ? '신용카드' : '체크카드', icon: <CreditCard size={14} /> },
        { label: '전월 실적', value: product.prevMonthRecord, icon: <History size={14} /> },
        { label: '연회비', value: product.annualFee, icon: <Wallet size={14} /> },
        { label: '주요 혜택', value: product.benefits[0], icon: <Star size={14} /> }
      ]}
      simulator={<CardBenefitSimulator product={product} />}
      details={[
        { label: '주요 혜택', value: product.benefits.join(', ') },
        { label: '전월 이용실적', value: product.prevMonthRecord },
        { label: '연회비 상세', value: product.annualFee },
        { label: '상세 혜택 안내', value: '전 가맹점 결제 시 포인트 적립 및 업종별 맞춤 할인 혜택을 제공합니다.', isText: true }
      ]}
      externalLink={getSmartLandingUrl(product.company, product.name)}
      ranking={{
        rank: extraData?.rank || 0,
        total: extraData?.total || 0,
        topProducts: extraData?.top5 || []
      }}
      onAction={() => window.open(externalLink, '_blank')}
    />
  )
}

function CardBenefitSimulator({ product }: { product: CardProduct }) {
  const [spent, setSpent] = useState(1000000)
  
  const estimatedSaving = useMemo(() => {
    // 단순화된 계산 로직 (실제로는 혜택별 계산 필요)
    return Math.floor(spent * 0.03); 
  }, [spent]);

  return (
    <div className="bg-white">
      <div className="mb-10 px-4">
        <label className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-4 block">한 달 평균 소비 금액</label>
        <input 
          type="range" 
          min="100000" 
          max="5000000" 
          step="100000"
          value={spent}
          onChange={(e) => setSpent(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between mt-4 text-lg font-black text-gray-900">
          <span>{ (spent / 10000).toLocaleString() }만원</span>
          <span className="text-gray-300">소비 시</span>
        </div>
      </div>

      <div className="bg-indigo-50/50 rounded-[40px] p-10 text-center border border-indigo-100 mb-8">
        <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">매달 챙기는 예상 혜택</p>
        <h3 className="text-4xl md:text-5xl font-black text-indigo-900 tracking-tighter">
          약 {estimatedSaving.toLocaleString()}<span className="text-xl ml-1">원</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {product.benefits.map((b, i) => (
           <div key={i} className="flex items-center gap-4 p-5 bg-white border border-gray-50 rounded-3xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                 <Percent size={18} />
              </div>
              <div className="flex-1">
                 <p className="text-sm font-bold text-gray-900">{b} 혜택</p>
                 <p className="text-xs text-gray-400 font-bold">월 최대 1.5만원 할인/적립</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  )
}

