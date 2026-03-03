'use client';
import { useState } from "react";
import { Calendar } from "lucide-react";

export default function EconomicCalendar() {
  const [calType, setCalType] = useState('day'); // 'day', 'tomorrow', 'week', 'nextWeek'

  return (
    <div className="flex flex-col gap-4 p-4 rounded-3xl bg-[#14161B] border border-gray-800 h-full min-h-[500px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 px-2">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#FFC107]" />
          <h4 className="font-bold text-xs uppercase tracking-widest text-gray-300">오늘의 관전 포인트 (경제지표)</h4>
        </div>
        
        {/* 기간 선택 탭 */}
        <div className="flex bg-[#0a0a0c] border border-gray-800 rounded-lg p-1 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setCalType('day')}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest transition-all whitespace-nowrap ${calType === 'day' ? 'bg-[#2D3340] text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            오늘 (일별)
          </button>
          <button 
            onClick={() => setCalType('tomorrow')}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest transition-all whitespace-nowrap ${calType === 'tomorrow' ? 'bg-[#2D3340] text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            내일
          </button>
          <button 
            onClick={() => setCalType('week')}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest transition-all whitespace-nowrap ${calType === 'week' ? 'bg-[#2D3340] text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            이번주
          </button>
          <button 
            onClick={() => setCalType('nextWeek')}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest transition-all whitespace-nowrap ${calType === 'nextWeek' ? 'bg-[#2D3340] text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            다음주
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full rounded-2xl overflow-hidden border border-gray-800/50 bg-black/20">
        <iframe 
          key={calType} // key를 바꿔서 iframe을 리로드
          src={`https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&category=_unemployment,6,5,1,2,7,3,25,8,30,31,4,10,32,12,33,35,36,37,13,14,15,38,16,11,40,17,41,42,43,44,18,19,20,45,21,22,23,46,24,26,47,27,28,29,48,49,50,51,52,53,138,150,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,131,135,134,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,132,133,136,137,139,140,141,142,143,144,145,146,147,148,149&countries=5,37&calType=${calType}&timeZone=88&lang=18`}
          width="100%" 
          height="100%" 
          frameBorder="0" 
        ></iframe>
      </div>
    </div>
  );
}
