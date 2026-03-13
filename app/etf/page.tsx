'use client'

import { 
  BarChart3, 
  Globe, 
  Zap,
  Star,
  ArrowUpRight,
  Info
} from 'lucide-react'
import Link from 'next/link'

const ETF_CATEGORIES = [
  {
    title: '미국 지수 ETF',
    desc: 'S&P 500, 나스닥 100 등 세계 경제의 중심에 투자하세요.',
    tags: ['#SPY', '#QQQ'],
    icon: <Globe size={24} className="text-blue-500" />,
    color: 'bg-blue-50'
  },
  {
    title: '배당/성장 ETF',
    desc: '꾸준한 배당금과 자산 가치 상승을 동시에 노리는 전략입니다.',
    tags: ['#SCHD', '#DIVO'],
    icon: <Star size={24} className="text-pink-500" />,
    color: 'bg-pink-50'
  },
  {
    title: '테슬라/빅테크 ETF',
    desc: '세상을 바꾸는 혁신 기술주들에 집중 투자합니다.',
    tags: ['#TSLA', '#NVIDIA'],
    icon: <Zap size={24} className="text-orange-500" />,
    color: 'bg-orange-50'
  },
  {
    title: '안전자산/원자재',
    desc: '금, 은, 원유 등 시장 변동성에 대비하는 안전자산 포트폴리오.',
    tags: ['#GOLD', '#OIL'],
    icon: <BarChart3 size={24} className="text-emerald-500" />,
    color: 'bg-emerald-50'
  }
]

export default function ETFPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-beige)]">
      <main className="container mx-auto max-w-5xl px-6 py-12 md:py-20">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-6 mb-20">
          <div className="px-4 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[3px] rounded-full">
            ETF Curation
          </div>
          <h1 className="text-4xl md:text-6xl font-outfit font-black text-gray-900 leading-tight tracking-tighter">
            주식처럼 편하게,<br />
            <span className="text-emerald-600">펀드처럼 골고루</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-xl leading-relaxed">
            어떤 종목을 살지 고민된다면? 시장 전체에 투자하는 ETF가 정답입니다.<br />
            전문가가 큐레이션한 핵심 ETF 테마를 확인하세요.
          </p>
        </div>

        {/* Curation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {ETF_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="group bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
              <div className="flex items-start justify-between mb-8">
                <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  {cat.icon}
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {cat.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-50 text-[10px] font-black text-gray-400 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">{tag}</span>
                  ))}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{cat.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-10">{cat.desc}</p>
              
              <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-600 group-hover:gap-4 transition-all">
                상세 종목 보러가기 <ArrowUpRight size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Treia Integration Banner */}
        <div className="bg-emerald-600 rounded-[48px] p-8 md:p-16 text-white overflow-hidden relative">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Star className="text-yellow-300 fill-yellow-300" size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Treia Special Offer</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-outfit font-black leading-tight mb-8 tracking-tight">
              원자재 ETF 투자가<br />
              어렵게 느껴진다면?
            </h2>
            <p className="text-emerald-50/70 font-medium text-lg leading-relaxed mb-12">
              금(Gold)과 외환 시장의 변동성을 활용한 Treia의 AI 자동매매 시스템으로 스마트하게 대응하세요.
            </p>
            <Link 
              href="/treia"
              className="inline-flex items-center gap-4 px-8 py-5 bg-white text-emerald-700 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all"
            >
              Treia 자동매매 알아보기 <ArrowUpRight size={20} />
            </Link>
          </div>
          
          {/* Abstract blobs for design */}
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[300px] h-[300px] bg-emerald-400 rounded-full blur-[100px] opacity-30"></div>
        </div>

        {/* Info Banner */}
        <div className="mt-12 p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex items-start gap-4">
          <Info className="text-gray-400 shrink-0 mt-1" size={24} />
          <div className="space-y-2">
            <h4 className="text-base font-bold text-gray-900">ETF 투자 유의사항</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              ETF는 실적 배당형 상품으로 예금자보호법에 따라 예금보험공사가 보호하지 않습니다. 
              운용 결과에 따라 원금 손실이 발생할 수 있으니 투자 전 설명서를 반드시 확인하시기 바랍니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
