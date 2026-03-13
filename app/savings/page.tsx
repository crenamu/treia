'use client'

import { useState, useEffect } from 'react'
import { DepositProduct } from '@/types/deposit'
import { Filter, ChevronDown, Rocket, ShieldCheck, TrendingUp, PiggyBank } from 'lucide-react'
import Link from 'next/link'

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

function hasSpecial(spcl_cnd: string) {
  return spcl_cnd && !spcl_cnd.includes('해당사항 없음')
}

export default function SavingsPage() {
  const [products, setProducts] = useState<DepositProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [trm, setTrm] = useState('12')
  const [sort, setSort] = useState('rate2_desc')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/savings?trm=${trm}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [trm])

  const bestBase = products.length > 0 ? [...products].sort((a, b) => b.bestOption.intr_rate - a.bestOption.intr_rate)[0] : null
  const bestMax = products.length > 0 ? [...products].sort((a, b) => b.bestOption.intr_rate2 - a.bestOption.intr_rate2)[0] : null

  return (
    <div className="min-h-screen bg-[var(--bg-beige)]">
      <main className="container mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded">Savings</span>
            <p className="text-xs text-gray-500 font-medium tracking-tight">차곡차곡 쌓이는 재미, 적금 금리 비교</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-black text-gray-900 leading-[1.1] mb-4 tracking-tighter">
            목돈 만들기,<br />
            적금으로 시작하세요
          </h1>
          <p className="text-gray-500 font-medium max-w-lg">
            매달 일정 금액을 적립하여 목돈을 만드는 적금 상품입니다.<br/>
            우대 고시 금리를 확인하고 가장 유리한 상품을 골라보세요.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <MetricCard 
            label="최고 기본금리" 
            value={bestBase ? `연 ${bestBase.bestOption.intr_rate.toFixed(2)}%` : '—'} 
            sub={bestBase?.kor_co_nm || '데이터 로딩중'}
            icon={<PiggyBank size={18} className="text-blue-500" />}
          />
          <MetricCard 
            label="최고 우대금리" 
            value={bestMax ? `연 ${bestMax.bestOption.intr_rate2.toFixed(2)}%` : '—'} 
            sub={bestMax?.kor_co_nm || '데이터 로딩중'}
            icon={<TrendingUp size={18} className="text-green-500" />}
            highlight
          />
          <MetricCard 
            label="비교 상품 수" 
            value={loading ? '—' : `${products.length}개`} 
            sub="금감원 등록 기준"
            icon={<Rocket size={18} className="text-purple-500" />}
          />
        </div>

        {/* List Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
           {/* Filters */}
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex gap-2 p-1 bg-gray-50 rounded-xl w-fit">
              {TERMS.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTrm(t.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    trm === t.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium border border-gray-100 rounded-xl px-4 py-2 bg-white">
                <Filter size={14} />
                <select 
                  value={sort} 
                  onChange={e => setSort(e.target.value)}
                  className="bg-transparent outline-none appearance-none pr-4 font-bold"
                >
                  {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-8 h-8 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400 font-bold">실시간 금리 데이터를 불러오고 있습니다...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 text-gray-400 font-medium">검색된 상품이 없습니다.</div>
            ) : (
              products.map(p => (
                <Link 
                  href={`/savings/${p.fin_prdt_cd}`}
                  key={p.fin_prdt_cd} 
                  className="group bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between hover:border-green-200 hover:shadow-lg hover:shadow-green-500/5 transition-all cursor-pointer"
                >
                  <div className="flex flex-col gap-2 flex-1 md:mr-6">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs text-gray-400 font-bold">{p.kor_co_nm}</span>
                      {hasSpecial(p.spcl_cnd) && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold">우대조건</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                      {p.fin_prdt_nm}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">기간</span>
                        <span className="text-sm text-gray-700 font-bold">{p.bestOption.save_trm}개월</span>
                      </div>
                      <div className="w-px h-6 bg-gray-100"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">적립</span>
                        <span className="text-sm text-gray-700 font-bold">{p.bestOption.rsrv_type_nm}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between md:flex-col md:items-end md:gap-1 mt-6 md:mt-0">
                    <div className="md:text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">연 금리 (기본)</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-outfit font-black text-gray-900 leading-none">
                          {p.bestOption.intr_rate.toFixed(2)}
                        </span>
                        <span className="text-base font-bold text-gray-400">%</span>
                      </div>
                    </div>
                    {p.bestOption.intr_rate2 > p.bestOption.intr_rate && (
                      <div className="md:text-right bg-green-50 px-2 py-1 rounded-lg">
                        <p className="text-[10px] text-green-700 font-black uppercase">최고  {p.bestOption.intr_rate2.toFixed(2)}%</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function MetricCard({ label, value, sub, icon, highlight }: { label: string, value: string, sub: string, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4 transition-all hover:-translate-y-1 ${highlight ? 'ring-2 ring-green-500/10' : ''}`}>
      <div className="p-2.5 bg-gray-50 rounded-xl">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-tight mb-1">{label}</p>
        <p className={`text-2xl font-outfit font-black leading-tight mb-1 truncate ${highlight ? 'text-green-600' : 'text-gray-900'}`}>{value}</p>
        <p className="text-[10px] text-gray-500 font-medium truncate">{sub}</p>
      </div>
    </div>
  )
}
