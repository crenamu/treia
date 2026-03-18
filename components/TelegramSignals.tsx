'use client';
import { useEffect, useState } from "react";
import { Send, Clock } from "lucide-react";

interface TelegramMsg {
  id: number;
  text: string;
  date: number;
  sender: string;
}

export default function TelegramSignals() {
  const [messages, setMessages] = useState<TelegramMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await fetch(`/api/telegram?t=${Date.now()}`);
        const json = await res.json();
        if (json.success && json.data) {
          setMessages(json.data);
        }
        setLastSync(new Date());
      } catch (err) {
        console.error("Failed to fetch Telegram signals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  return (
    <div className="bg-[#0F1115] border border-[#2B303B] rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden h-[580px]">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none rounded-full"></div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Send className="text-blue-400" size={18} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white tracking-tight leading-tight flex items-center gap-2">
              실시간 관점 공유 
              {lastSync && (
                <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">최근 동기화: {lastSync.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              )}
            </h2>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">데이터를 기반으로 공유된 실시간 인사이트</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-center text-gray-500 text-xs py-4 animate-pulse">텔레그램 채널 동기화 중...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 text-xs py-10 bg-black/20 rounded-xl border border-dashed border-gray-800">
            최근 수신된 텔레그램 메시지가 없습니다.<br />(또는 토큰 연동을 확인해주세요)
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={msg.id || index} className="p-4 rounded-2xl bg-[#1A1D24] border border-gray-800 hover:border-blue-500/30 transition-all flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-[#FFC107] bg-[#FFC107]/10 px-2 py-0.5 rounded-sm uppercase">Treia 관점 공유</span>
                <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(msg.date * 1000).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-gray-200 mt-1 whitespace-pre-wrap leading-snug">
                {msg.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
