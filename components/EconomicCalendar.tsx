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
          src={`https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=5,37&calType=${calType}&timeZone=88&lang=18`}
          width="100%" 
          height="100%" 
          frameBorder="0" 
        ></iframe>
      </div>
    </div>
  );
}
