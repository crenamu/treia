'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { DepositProduct } from '@/types/deposit'
import PremiumProductTemplate from '@/components/PremiumProductTemplate'
import { BANK_LOGOS } from '@/app/actions/constants'
import { ShieldCheck, Building2, Calendar, Smartphone, TrendingUp, ChevronDown, Info, ArrowRight } from 'lucide-react'

export default function DepositDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<DepositProduct | null>(null)
  const [loading, setLoading] = useState(true)

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
      <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-gray-400 font-bold">상품 정보를 찾을 수 없습니다.</p>
    </div>
  )

  return (
    <PremiumProductTemplate
      type="deposit"
      product={product}
      bankLogo={bankLogo || "/images/banks/savingsbank.png"}
      primaryRate={{
        label: "최고 금리",
        value: product.bestOption?.intr_rate2 || 0,
        suffix: "%",
        subLabel: "기본 금리",
        subValue: product.bestOption?.intr_rate || 0
      }}
      tags={['정기예금', '비대면', product.max_limit ? `${Math.floor(product.max_limit / 10000)}만원 한도` : '한도제한 없음']}
      metrics={[
        { label: '보호여부', value: '예금자보호', icon: <ShieldCheck size={14} /> },
        { label: '가입대상', value: product.join_member, icon: <Building2 size={14} /> },
        { label: '가입방법', value: product.join_way, icon: <Smartphone size={14} /> },
        { label: '유형', value: '정기예금', icon: <Calendar size={14} /> }
      ]}
      simulator={<DepositRateSimulator product={product} />}
      details={[
        { label: '가입 금액', value: product.max_limit ? `최소 1만원 ~ 최대 ${Math.floor(product.max_limit / 10000)}만원` : '금액 제한 없음' },
        { label: '가입 대상', value: product.join_member },
        { label: '가입 방법', value: product.join_way },
        { label: '우대 조건', value: product.spcl_cnd, isText: true },
        { label: '만기 후 이율', value: product.mtrt_int, isText: true },
        { label: '기타 유의사항', value: product.etc_note, isText: true }
      ]}
      onAction={() => window.open('https://portal.fss.or.kr', '_blank')}
    />
  )
}

function DepositRateSimulator({ product }: { product: DepositProduct }) {
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
