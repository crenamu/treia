import { BarChart3, Zap, Calendar, ArrowUpRight, Download } from "lucide-react";
import TradingViewChart from "@/components/TradingViewChart";
import AiAnalysisDashboard from "@/components/AiAnalysisDashboard";
import EducationalPerspectiveCard from "@/components/EducationalPerspectiveCard";
import PriceLevelMap from "@/components/PriceLevelMap";

export default function AnalysisPage() {
  // 실제 분석 기반 교육용 데이터 (POC/Major/Minor)
  const marketLevels = [
    { price: 5315, label: "March Target Zone", type: 'major' as const },
    { price: 5280, label: "Resistance Wall", type: 'major' as const },
    { price: 5278.4, label: "Institutional POC", type: 'major' as const },
    { price: 5205, label: "Session Box High", type: 'minor' as const },
    { price: 5184, label: "Standard Pivot", type: 'minor' as const },
    { price: 5130, label: "Liquidity Capture", type: 'major' as const },
  ];

  const scenarios = [
    { title: "Price Discovery Phase", desc: "역사적 신고가 $5,300 돌파 시도는 단순한 가격 상승을 넘어 새로운 가치 영역을 탐색하는 프로세스입니다.", color: "bg-cyan-400" },
    { title: "Institutional Flush", desc: "주요 POC 이탈 시 하단 유동성 거점($5,130)까지의 급격한 가격 이동(Flash)이 빈번하게 관찰됩니다.", color: "bg-red-500" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
             <BarChart3 size={20} />
           </div>
           <h1 className="text-3xl font-outfit font-extrabold text-white tracking-tight">AI 시장 분석 및 교육 관점</h1>
        </div>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
           과거 틱데이터 및 멀티 타임프레임(MTF) 분석을 통해 시장의 <b>구조적 결함</b>과 <b>세력의 매집 흔적</b>을 찾아냅니다. <br />
           본 정보는 투자 권유가 아닌 시장 이해를 돕기 위한 교육적 데이터입니다.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
           {/* Real-time AI Analysis Dashboard */}
           <AiAnalysisDashboard />

           {/* Chart & Price Map Layout */}
           <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3 w-full aspect-video rounded-3xl bg-[#0F1115] border border-gray-800 overflow-hidden relative group shadow-2xl">
                 <TradingViewChart levels={marketLevels} />
              </div>
              <div className="xl:col-span-1 h-full min-h-[400px]">
                 <PriceLevelMap levels={marketLevels} />
              </div>
           </div>
           
           {/* High-End Educational Perspective (Infographic) */}
           <EducationalPerspectiveCard 
              levels={marketLevels}
              scenarios={scenarios}
              analysis="목요일 저점($5,130)에서의 강력한 V자 반등은 단순한 상승이 아닌 기관의 대량 매집 신호로 해석됩니다. 현재 $5,278 부근의 주간 POC 안착 여부가 다음 세션의 방향성을 결정짓는 핵심 관찰 포인트입니다."
           />
        </div>

        <div className="flex flex-col gap-6">
            {/* Economic Calendar Widget */}
            <div className="flex flex-col gap-4 p-4 rounded-3xl bg-[#14161B] border border-gray-800 h-full min-h-[500px]">
               <div className="flex items-center justify-between mb-2 px-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#FFC107]" />
                    <h4 className="font-bold text-xs uppercase tracking-widest text-gray-300">경제 캘린더</h4>
                  </div>
               </div>
               <div className="flex-1 w-full rounded-2xl overflow-hidden border border-gray-800/50 bg-black/20">
                  <iframe 
                    src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&category=_unemployment,6,5,1,2,7,3,25,8,30,31,4,10,32,12,33,35,36,37,13,14,15,38,16,11,40,17,41,42,43,44,18,19,20,45,21,22,23,46,24,26,47,27,28,29,48,49,50,51,52,53,138,150,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,131,135,134,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,132,133,136,137,139,140,141,142,143,144,145,146,147,148,149&countries=5,37&calType=day&timeZone=88&lang=18" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                  ></iframe>
               </div>
            </div>

            {/* Educational Note */}
            <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex flex-col gap-3">
               <div className="flex items-center gap-2">
                  <ArrowUpRight size={14} className="text-blue-500" />
                  <h4 className="font-bold text-[10px] text-blue-400 uppercase tracking-widest">분석 가이드</h4>
               </div>
               <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                  모든 데이터는 실시간 브로커 서버와 99.9% 동기화됩니다. <br />
                  차트상의 레벨은 교육적 관점 공유를 위한 참고 자료입니다.
               </p>
            </div>
        </div>
      </div>
    </div>
  );
}
