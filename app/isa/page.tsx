'use client'

import { 
  ShieldCheck, 
  Percent, 
  Coins, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  Zap
} from 'lucide-react'

const ISA_TYPES = [
  {
    title: '일반형 ISA',
    desc: '누구나 가입 가능하며 기초적인 비과세 혜택을 제공합니다.',
    benefit: '200만원 한도 비과세',
    icon: <ShieldCheck className="text-blue-500" size={24} />,
    color: 'bg-blue-50'
  },
  {
    title: '서민형 ISA',
    desc: '근로소득 5천만원(종합소득 3.8천만원) 이하 대상입니다.',
    benefit: '400만원 한도 비과세',
    icon: <Zap className="text-orange-500" size={24} />,
    color: 'bg-orange-50'
  },
  {
    title: '농어민형 ISA',
    desc: '종합소득 3.8천만원 이하 농어민 대상입니다.',
    benefit: '400만원 한도 비과세',
    icon: <Coins className="text-green-500" size={24} />,
    color: 'bg-green-50'
  }
]

export default function ISAPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-beige)]">
      <main className="container mx-auto max-w-5xl px-6 py-12 md:py-20">
        {/* Hero Section */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-6">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">절세 끝판왕 ISA</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-outfit font-black text-gray-900 leading-[1.1] mb-8 tracking-tighter">
            세금 한 푼도 아쉽다면,<br />
            <span className="text-blue-600">ISA로 시작하세요</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
            이자부터 배송 소득까지 세금 혜택을 극대화하는 투자 필수 통장.<br className="hidden md:block" />
            핀테이블이 복잡한 ISA 혜택을 쉽게 풀어드립니다.
          </p>
        </div>

        {/* ISA Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {ISA_TYPES.map((type, idx) => (
            <div key={idx} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className={`w-14 h-14 ${type.color} rounded-2xl flex items-center justify-center mb-6`}>
                {type.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{type.desc}</p>
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">핵심 혜택</span>
                <span className="text-sm font-bold text-gray-900">{type.benefit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Detail Section */}
        <div className="bg-gray-900 rounded-[40px] p-8 md:p-16 text-white mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
                <Percent className="text-blue-400" />
                강력한 비과세 & 분리과세
              </h2>
              <div className="space-y-8">
                <BenefitRow 
                  title="손익 통산 혜택" 
                  desc="투자해서 번 돈과 잃은 돈을 합쳐서 순이익에 대해서만 세금을 매깁니다." 
                />
                <BenefitRow 
                  title="비과세 한도 초과 시" 
                  desc="비과세 한도를 넘는 수익에 대해서는 15.4%가 아닌 9.9% 분리과세를 적용합니다." 
                />
                <BenefitRow 
                  title="자유로운 운용" 
                  desc="예금, 적금, 펀드, ETF, 국내 주식까지 하나의 통장에서 담을 수 있습니다." 
                />
              </div>
            </div>
            <div className="bg-white/5 rounded-[32px] p-8 md:p-12 border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400">
                <Lock size={20} />
                필수 조건 확인
              </h3>
              <ul className="space-y-6">
                <CheckItem label="만 19세 이상 거주자라면 누구나" />
                <CheckItem label="최소 의무 가입 기간 3년 유지" />
                <CheckItem label="연간 납입 한도 2,000만원 (총 1억원)" />
                <CheckItem label="금융소득종합과세 대상자 제외" />
              </ul>
              <button className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/20">
                나에게 맞는 ISA 찾기
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10 tracking-tight">자주 묻는 질문</h2>
          <FAQItem 
            q="중개형, 신탁형, 일임형 중 무엇을 선택해야 하나요?" 
            a="직접 주식이나 ETF를 매매하고 싶다면 '중개형'을, 전문가에게 맡기고 싶다면 '일임형'을 추천합니다." 
          />
          <FAQItem 
            q="3년이 지나면 무조건 해지해야 하나요?" 
            a="아니요, 3년의 의무 기간이 지나면 언제든 해지하여 비과세 혜택을 받을 수 있으며 만기를 연장할 수도 있습니다." 
          />
          <FAQItem 
            q="원금은 언제든 찾을 수 있나요?" 
            a="중도 해지 없이 납입한 원금 범위 내에서는 언제든 출금할 수 있습니다. 단, 이익금은 의무 기간 유지 시까지 기다려야 합니다." 
          />
        </div>
      </main>
    </div>
  )
}

function BenefitRow({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">
        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
      </div>
      <div>
        <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  )
}

function CheckItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 text-gray-300 font-medium">
      <CheckCircle2 size={18} className="text-blue-500" />
      {label}
    </li>
  )
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{q}</h4>
        <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
      </div>
      <p className="mt-4 text-sm text-gray-500 font-medium leading-relaxed hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-300">
        {a}
      </p>
    </div>
  )
}
