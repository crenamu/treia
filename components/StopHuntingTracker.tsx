'use client';
import { useEffect, useState } from "react";
import { Activity, Target, Trash2 } from "lucide-react";

interface Tick {
  time: string;
  price: number;
}

interface HuntData {
  minute: string;
  variance: number;
  tickCount: number;
  volume: number;
  high: number;
  low: number;
  ticks: Tick[];
}

export default function StopHuntingTracker() {
  const [data, setData] = useState<HuntData | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/ticks/hunting');
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          setMsg(json.message);
        } else {
          setMsg(json.message || "데이터를 분석할 수 없습니다.");
        }
      } catch (err) {
        console.error(err);
        setMsg("로딩 에러");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#0F1115] border border-red-500/20 rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden group">
      {/* Background Warning Glow */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-red-500/5 blur-[80px] rounded-full pointer-events-none transition-all group-hover:bg-red-500/10"></div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <Target className="text-red-500" size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight leading-tight">오늘의 세력 사냥 (Stop Hunting) 포착</h2>
            <p className="text-[11px] text-gray-500 font-medium">{msg || "MT5 실시간 틱 데이터 기반 자동 분석 중..."}</p>
          </div>
        </div>
        {!loading && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full font-bold">
            <Activity size={14} className="animate-pulse" />
            LIVE TICK
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col justify-center items-center py-10 uppercase tracking-widest text-xs font-bold text-red-500/70 animate-pulse h-[250px]">
          [ 분석 중 ] 1,000,000개 이상의 틱에서 휩소 패턴을 검출합니다...
        </div>
      ) : data ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-3 bg-[#1A1D24] p-4 rounded-2xl border border-gray-800">
             <div className="flex flex-col gap-1 text-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase">포착 시간대</span>
                <span className="text-sm font-mono font-bold text-gray-200">{data.minute.split(' ')[1]}</span>
             </div>
             <div className="flex flex-col gap-1 text-center border-l border-gray-800">
                <span className="text-[10px] text-gray-500 font-bold uppercase">변동폭(Pips)</span>
                <span className="text-sm font-black text-red-500">{(data.variance * 10).toFixed(1)}</span>
             </div>
             <div className="flex flex-col gap-1 text-center border-l border-gray-800">
                <span className="text-[10px] text-gray-500 font-bold uppercase">발생 틱수</span>
                <span className="text-sm font-mono font-bold text-gray-300">{data.tickCount} Ticks</span>
             </div>
             <div className="flex flex-col gap-1 text-center border-l border-gray-800">
                <span className="text-[10px] text-gray-500 font-bold uppercase">고점 ↔ 저점</span>
                <span className="text-xs font-mono font-bold text-gray-400">{data.high} / {data.low}</span>
             </div>
          </div>
          
          <div className="h-[200px] w-full bg-black/40 rounded-xl border border-gray-800 relative mt-2 pt-4 px-2 overflow-hidden flex items-end">
             {/* Simple SVG Chart */}
             <svg width="100%" height="100%" preserveAspectRatio="none" className="absolute pb-4 px-1" style={{ top: 0, left: 0 }}>
               <defs>
                 <linearGradient id="huntGrad" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="rgba(239, 68, 68, 0.4)" />
                   <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
                 </linearGradient>
               </defs>
               
               {data.ticks && data.ticks.length > 1 && (
                 <>
                   <polyline
                     fill="none"
                     stroke="#ef4444"
                     strokeWidth="2"
                     points={data.ticks.map((t, i) => {
                       const x = (i / (data.ticks.length - 1)) * 100;
                       const y = 100 - ((t.price - data.low) / (data.high - data.low) * 100);
                       return `${x}%,${y}%`;
                     }).join(' ')}
                     className="drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                   />
                 </>
               )}
             </svg>
             <div className="w-full flex justify-between text-[10px] font-mono text-gray-600 mb-1 z-10 px-2 opacity-50">
                <span>{data.ticks[0]?.time}</span>
                <span className="text-red-500/50">"기관의 유동성 사냥(Stop Hunt) 궤적"</span>
                <span>{data.ticks[data.ticks.length-1]?.time}</span>
             </div>
          </div>
        </div>
      ) : (
         <div className="flex-1 flex justify-center items-center text-gray-600 text-sm">
            최근 수집된 틱 데이터가 부족하여 분석할 수 없습니다.
         </div>
      )}
    </div>
  );
}
