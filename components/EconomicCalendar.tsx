'use client';
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

export default function EconomicCalendar() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 자체 API 라우트를 호출하여 Forex Factory 데이터를 Gemini가 번역한 결과로 가져옵니다.
    const fetchCalendar = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/calendar');
        const json = await res.json();
        if (json.success && json.data) {
          // 어제 이전 일정은 제외 (오늘 0시 0분 이후만 남김)
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          
          const filtered = json.data.filter((item: any) => {
             const eventDate = new Date(item.date);
             return eventDate.getTime() >= now.getTime();
          });
          
          setData(filtered);
        }
      } catch (error) {
        console.error("Failed to load calendar", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, []);

  return (
    <div className="bg-[#0F1115] border border-[#2B303B] rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden h-[500px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 px-2">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#FFC107]" />
          <h4 className="font-bold text-xs uppercase tracking-widest text-[#FFC107]">이번 주 핵심 경제지표 (★★★★★)</h4>
        </div>
      </div>
      
      <div className="flex-1 w-full rounded-2xl overflow-y-auto border border-gray-800/50 bg-[#1A1D24] custom-scrollbar p-2">
        {loading ? (
          <div className="flex items-center justify-center h-full text-center text-amber-500 text-xs animate-pulse">
            Gemini AI가 글로벌 경제지표를 번역 및 큐레이션 중입니다...
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 text-xs p-6">
            이번 주 발표 예정인 핵심 지표(별 3개)가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {data.map((item, idx) => {
              const dateObj = new Date(item.date);
              const isToday = dateObj.toDateString() === new Date().toDateString();

              return (
                <div key={idx} className={`p-4 rounded-xl border ${isToday ? 'border-amber-500/50 bg-amber-500/5' : 'border-gray-800/80 bg-black/20'} flex flex-col gap-3 transition-colors hover:border-amber-500/30`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded-sm uppercase ${
                        item.country === 'USD' ? 'text-green-400 bg-green-500/10' : 
                        item.country === 'EUR' ? 'text-blue-400 bg-blue-500/10' : 
                        'text-gray-300 bg-gray-700/30'
                      }`}>
                        {item.country}
                      </span>
                      <span className={`text-xs font-bold flex items-center gap-1 ${isToday ? 'text-amber-400' : 'text-gray-400'}`}>
                        {dateObj.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                        {' '}
                        {dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                    </div>
                    {isToday && <span className="text-[9px] font-black text-amber-500 animate-pulse border border-amber-500/30 px-1.5 py-0.5 rounded uppercase">Today</span>}
                  </div>
                  
                  <h5 className="text-sm font-bold text-gray-200 leading-snug">{item.title}</h5>
                  
                  <div className="grid grid-cols-3 gap-2 mt-1 pt-3 border-t border-gray-800/50">
                    <div className="flex flex-col text-[10px]">
                      <span className="text-gray-500 mb-1">실제 (Actual)</span>
                      <span className={`font-mono font-bold ${item.actual !== '-' && item.actual !== '' ? 'text-cyan-400' : 'text-gray-600'}`}>
                        {item.actual || '-'}
                      </span>
                    </div>
                    <div className="flex flex-col text-[10px]">
                      <span className="text-gray-500 mb-1">예측 (Forecast)</span>
                      <span className="font-mono font-bold text-gray-300">
                        {item.forecast || '-'}
                      </span>
                    </div>
                    <div className="flex flex-col text-[10px] text-right">
                      <span className="text-gray-500 mb-1">이전 (Previous)</span>
                      <span className="font-mono font-bold text-gray-400">
                        {item.previous || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
