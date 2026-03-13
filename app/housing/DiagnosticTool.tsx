'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Users, Wallet, Landmark, Info } from 'lucide-react'

interface Step {
  id: number
  title: string
  question: string
  icon: React.ReactNode
  options: { label: string; value: string; score: number }[]
}

const STEPS: Step[] = [
  {
    id: 1,
    title: '가족 구성',
    question: '현재 가계 구성을 선택해 주세요.',
    icon: <Users size={24} />,
    options: [
      { label: '1인 가구 (독신)', value: 'single', score: 10 },
      { label: '2인 가구 (부부)', value: 'couple', score: 20 },
      { label: '3인 이상 (자녀 포함)', value: 'family', score: 30 },
    ]
  },
  {
    id: 2,
    title: '월평균 소득',
    question: '가구당 월평균 소득 수준은 어느 정도인가요?',
    icon: <Wallet size={24} />,
    options: [
      { label: '350만원 이하 (70% 이하)', value: 'low', score: 30 },
      { label: '500만원 이하 (100% 이하)', value: 'mid', score: 15 },
      { label: '700만원 초과 (120% 초과)', value: 'high', score: 0 },
    ]
  },
  {
    id: 3,
    title: '총 자산',
    question: '보유하신 총 자산(부동산+금융 등) 합계는?',
    icon: <Landmark size={24} />,
    options: [
      { label: '3.6억 이하', value: 'yes', score: 30 },
      { label: '3.6억 초과', value: 'no', score: 0 },
    ]
  }
]

export default function HousingDiagnosticTool({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<null | 'eligible' | 'not-eligible'>(null)

  const handleNext = (value: string, score: number) => {
    const newAnswers = { ...answers, [currentStep]: value }
    setAnswers(newAnswers)
    const newScore = totalScore + score
    setTotalScore(newScore)
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      if (newScore >= 40) {
        setResult('eligible')
      } else {
        setResult('not-eligible')
      }
      // 진단 완료 시 콜백 호출
      if (onComplete) onComplete()
    }
  }

  const reset = () => {
    setCurrentStep(0)
    setTotalScore(0)
    setAnswers({})
    setResult(null)
  }

  if (result) {
    return (
      <div className="bg-white rounded-[40px] p-10 md:p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 shadow-xl ${
          result === 'eligible' ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-red-500 text-white shadow-red-500/20'
        }`}>
          {result === 'eligible' ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}
        </div>
        
        <div className="space-y-4 mb-10">
           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-4 py-1.5 bg-blue-50 rounded-full">AI 진단 점수: {totalScore}점</span>
           <h3 className="text-3xl font-black text-gray-900 tracking-tight">
             {result === 'eligible' ? '청약 당첨이 유망합니다' : '전략적인 접근이 필요합니다'}
           </h3>
           <p className="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
             {result === 'eligible' 
               ? '현재 소득과 자산 기준이 공공임대 정규 모집 공고에 매우 부합합니다. 서류 준비를 시작해 보세요.' 
               : '일부 기준이 현재 공고보다 높게 측정되었습니다. 다른 유형이나 지역의 특별 공고를 확인해 보세요.'}
           </p>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-10">
           <ScoreItem label="소득 적합도" score={totalScore > 40 ? '매우 높음' : '보통'} active />
           <ScoreItem label="자산 유지도" score={totalScore > 50 ? '안전' : '주의'} active={totalScore > 50} />
        </div>

        <button 
          onClick={reset}
          className="flex items-center gap-2 mx-auto px-8 py-4 bg-gray-50 text-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
        >
          <RefreshCw size={16} /> 다시 진단하기
        </button>
      </div>
    )
  }

  const step = STEPS[currentStep]

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-12 relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-2 bg-gray-50 w-full">
        <div 
          className="h-full bg-blue-600 transition-all duration-700 ease-out" 
          style={{ width: `${((currentStep) / STEPS.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between mb-12 mt-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
            {step.icon}
          </div>
          <div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[2px]">Step {step.id} / {STEPS.length}</span>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{step.title}</h3>
          </div>
        </div>
      </div>

      <h4 className="text-2xl md:text-3xl font-black text-gray-900 mb-10 leading-tight tracking-tighter">
        {step.question}
      </h4>

      <div className="grid grid-cols-1 gap-3">
        {step.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleNext(opt.value, opt.score)}
            className="group flex items-center justify-between p-6 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-blue-600 rounded-[24px] transition-all duration-300 text-left shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
          >
            <span className="font-bold text-gray-900 text-base md:text-lg group-hover:text-blue-600 transition-colors">{opt.label}</span>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-200 group-hover:text-blue-600 transition-all group-hover:scale-110">
               <ArrowRight size={20} />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-50 flex items-center gap-3 text-gray-400">
         <Info size={16} />
         <p className="text-[10px] font-medium leading-relaxed">
            입력하신 정보는 진단 후 즉시 파기되며, 핀테이블의 AI가 익명으로 분석을 진행합니다.
         </p>
      </div>
    </div>
  )
}

function ScoreItem({ label, score, active }: { label: string, score: string, active?: boolean }) {
   return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
         <span className="text-xs font-bold text-gray-500">{label}</span>
         <span className={`text-sm font-black ${active ? 'text-blue-600' : 'text-red-500'}`}>{score}</span>
      </div>
   )
}
