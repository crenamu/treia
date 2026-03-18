'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, ChevronRight, Building, User, ShieldCheck } from 'lucide-react'

interface Step {
  id: number
  title: string
  subtitle: string
  icon?: React.ReactNode
}

const STEPS: Step[] = [
  { id: 1, title: '약관 동의', subtitle: '대출을 찾아오기 위해 꼭 필요한 동의만 받아요', icon: <ShieldCheck className="text-emerald-500" /> },
  { id: 2, title: '직업 선택', subtitle: '정확한 금리 비교를 위해 지금 하고 계신 일을 알려주세요', icon: <User className="text-blue-500" /> },
  { id: 3, title: '분석 시작', subtitle: '금융기관 120여 곳에서 당신을 위한 최고의 조건을 찾는 중입니다' }
]

const TERMS = [
  '핀테이블 약관 및 개인(신용)정보 처리 동의',
  '금융기관 개인(신용)정보 처리 동의',
  '대안신용점수(핀테이블 스코어) 서비스 이용 동의',
  '본인확인 동의',
  '신용관리 서비스 동의'
]

const JOBS = [
  { id: 'office', label: '직장인', desc: '4대 보험 가입자' },
  { id: 'business', label: '개인사업자', desc: '사업자등록증 소지자' },
  { id: 'public', label: '공무원', desc: '기관 소속 정규직' },
  { id: 'prep', label: '무직 (주부 등)', desc: '소득 증빙이 어려운 분' },
  { id: 'freelance', label: '기타 (프리랜서, 아르바이트)', desc: '비정형 소득' }
]

export default function LoanDiagnosticFlow({ onClose, onComplete }: { onClose: () => void, onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [checkedTerms, setCheckedTerms] = useState<boolean[]>(new Array(TERMS.length).fill(false))
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(prev => prev + 1)
    } else {
      setIsAnalyzing(true)
      setTimeout(() => {
        onComplete()
      }, 3000)
    }
  }

  const toggleTerm = (idx: number) => {
    const next = [...checkedTerms]
    next[idx] = !next[idx]
    setCheckedTerms(next)
  }

  const toggleAllTerms = () => {
    const allChecked = checkedTerms.every(Boolean)
    setCheckedTerms(new Array(TERMS.length).fill(!allChecked))
  }

  const currentStep = STEPS[stepIndex]

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[480px] md:h-[800px] md:rounded-[40px] md:shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <div 
              key={s.id} 
              className={`h-1 rounded-full transition-all duration-500 ${i <= stepIndex ? 'w-8 bg-black' : 'w-2 bg-gray-100'}`} 
            />
          ))}
        </div>
        {!isAnalyzing && (
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900">
            <X size={24} />
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-10">
        <AnimatePresence mode="wait">
          {!isAnalyzing ? (
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center">
                      {currentStep.icon || <Building className="text-gray-400" />}
                   </div>
                   <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Step {currentStep.id}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight whitespace-pre-wrap">
                  {currentStep.title} <br />
                  <span className="text-base text-gray-400 font-bold">{currentStep.subtitle}</span>
                </h2>
              </div>

              {stepIndex === 0 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {TERMS.map((term, i) => (
                      <div 
                        key={i} 
                        onClick={() => toggleTerm(i)}
                        className="flex items-center justify-between group cursor-pointer"
                      >
                        <span className={`text-base font-bold transition-colors ${checkedTerms[i] ? 'text-gray-900' : 'text-gray-300 group-hover:text-gray-500'}`}>
                          {term}
                        </span>
                        <CheckCircle2 size={24} className={`transition-colors ${checkedTerms[i] ? 'text-emerald-500' : 'text-gray-100'}`} />
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={toggleAllTerms}
                    className="w-full py-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    필수 약관 모두 동의하기
                  </button>
                </div>
              )}

              {stepIndex === 1 && (
                <div className="grid grid-cols-1 gap-3">
                  {JOBS.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJob(job.id)}
                      className={`flex flex-col text-left px-6 py-5 rounded-3xl border-2 transition-all ${selectedJob === job.id ? 'bg-black border-black text-white shadow-xl' : 'bg-white border-gray-50 text-gray-400 hover:border-gray-200'}`}
                    >
                      <span className={`text-lg font-black ${selectedJob === job.id ? 'text-white' : 'text-gray-900'}`}>{job.label}</span>
                      <span className="text-xs font-medium opacity-60">{job.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="relative">
                <div className="w-24 h-24 border-8 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingIcon />
                </div>
              </div>
              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-black text-gray-900">당신에게 가장 맞는 금리를 <br />계산하고 있어요</h2>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-black text-emerald-500 animate-pulse">우리은행 심사 중...</p>
                  <p className="text-xs text-gray-400">금융감독원 정식 위탁 라이선스를 보유한 서비스입니다.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      {!isAnalyzing && (
        <footer className="p-8 bg-white border-t border-gray-50">
          <button
            onClick={handleNext}
            disabled={(stepIndex === 0 && !checkedTerms.every(Boolean)) || (stepIndex === 1 && !selectedJob)}
            className="w-full py-5 bg-black text-white rounded-3xl font-black text-lg shadow-xl hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {stepIndex === STEPS.length - 1 ? '모두 동의하고 진행하기' : '다음으로'}
            <ChevronRight size={20} />
          </button>
        </footer>
      )}
    </div>
  )
}

function LoadingIcon() {
  return (
    <motion.div 
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <Building size={32} className="text-emerald-500" />
    </motion.div>
  )
}
