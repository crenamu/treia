"use client";
import {
  Monitor,
  Download,
  Zap,
  ShieldCheck,
  Play,
  ArrowRight,
  Settings,
  Cpu,
} from "lucide-react";

export default function GuidePage() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-16 max-w-5xl">
      {/* Hero Section */}
      <header className="flex flex-col items-center text-center gap-6">
        <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
          Master Class
        </div>
        <h1 className="text-4xl md:text-5xl font-outfit font-black text-white tracking-tight uppercase leading-[1.1]">
          MT5 자동매매 설치 <br />{" "}
          <span className="text-amber-500">완벽 마스터 가이드</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
          12년 경력 트레이더의 노하우를 담았습니다. <br />
          복잡한 설치 과정 없이 AI가 검증한 최적의 세팅으로 즉시 시작하세요.
        </p>
      </header>

      {/* Steps Section */}
      <div className="grid grid-cols-1 gap-8">
        <GuideStep
          num="01"
          title="메타트레이더 5(MT5) 설치"
          desc="전문 알고리즘 매매를 위한 표준 플랫폼입니다. 브로커 홈페이지에서 다운로드 후 설치를 완료하세요."
          icon={<Monitor size={20} />}
        />
        <GuideStep
          num="02"
          title="EA(Expert Advisor) 파일 경로 복사"
          desc="Treia에서 제공하거나 MQL5 마켓에서 구한 .mq5 또는 .ex5 파일을 MT5의 'MQL5 > Experts' 폴더에 복사합니다."
          icon={<Download size={20} />}
          isHighlight
        />
        <GuideStep
          num="03"
          title="알고리즘 트레이딩 활성화"
          desc="MT5 상단 메뉴의 '알고리즘 트레이딩' 버튼을 클릭하여 초록색으로 활성화합니다. (가장 많이 실수하는 단계!)"
          icon={<Zap size={20} />}
        />
        <GuideStep
          num="04"
          title="셋파일(.set) 로딩 및 구동"
          desc="EA 설정창에서 '입력 변수' 탭의 '불러오기' 버튼을 눌러 Treia가 검증한 최적화 세팅값을 로드합니다."
          icon={<Settings size={20} />}
        />
      </div>

      {/* Pro Tips Section */}
      <section className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-gray-900 to-black border border-gray-800 flex flex-col gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Cpu size={120} className="text-white" />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">
            트레이아 PRO의 연구/검증 원칙
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 커뮤니티
              전략 검증 (Audit)
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              커뮤니티에 올라온 아티클은 AI와 운영진이 리스크 요인(마틴게일,
              그리드 여부)을 직접 연구합니다. 검증 배지가 달린 전략만을
              신뢰하세요.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 백테스팅
              & 포워드 테스트
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              모든 추천 EA는 최소 3년 이상의 틱데이터 백테스팅과 6개월 이상의
              실거래 포워드 데이터 분석을 거칩니다.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="flex flex-col items-center gap-6 py-12 border-t border-gray-800">
        <h3 className="text-xl font-bold text-white text-center">
          지금 바로 첫 번째 자동매매를 시작해볼까요?
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 rounded-xl bg-amber-500 text-black font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center gap-2">
            EA 마켓 바로가기 <ArrowRight size={16} />
          </button>
          <button className="px-8 py-4 rounded-xl bg-gray-900 border border-gray-800 text-white font-black text-xs uppercase tracking-widest hover:border-gray-500 transition-all flex items-center gap-2">
            튜토리얼 영상 시청 <Play size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function GuideStep({
  num,
  title,
  desc,
  icon,
  isHighlight,
}: {
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  isHighlight?: boolean;
}) {
  return (
    <div
      className={`p-8 rounded-3xl border transition-all flex flex-col md:flex-row gap-6 md:items-center ${isHighlight ? "bg-amber-500/5 border-amber-500/30" : "bg-gray-900/40 border-gray-800 hover:border-gray-700"}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <span className="text-3xl font-outfit font-black text-gray-800">
          {num}
        </span>
        <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400">
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-medium max-w-lg">
            {desc}
          </p>
        </div>
      </div>
      <button className="px-4 py-2 rounded-lg bg-gray-800 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-gray-700 transition-all whitespace-nowrap">
        자세히 보기
      </button>
    </div>
  );
}
