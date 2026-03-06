'use client'
import { useEffect, useState, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { getEconomicCalendar } from "@/lib/finnhub";

interface TickerItem {
  label: string;
  value: string;
  isImpact?: boolean;
  isUpcoming?: boolean;
}

export default function Ticker() {
  const [calendarItems, setCalendarItems] = useState<TickerItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. TradingView Widget Load
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        { "proName": "FOREXCOM:SPX500", "title": "S&P 500" },
        { "proName": "FOREXCOM:NSXUSD", "title": "NAS100 (CFD)" },
        { "proName": "FX_IDC:XAUUSD", "title": "GOLD/USD" },
        { "proName": "BITSTAMP:BTCUSD", "title": "BTC/USD" },
        { "proName": "BITSTAMP:ETHUSD", "title": "ETH/USD" }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "kr"
    });
    
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
    }

    // 2. Fetch Real Economic Calendar (Internal API - Gemini Translated)
    async function fetchCalendar() {
      try {
        const res = await fetch('/api/calendar');
        const json = await res.json();
        
        if (json.success && Array.isArray(json.data)) {
          const upcoming = json.data.map((item: any) => ({
            label: `${item.country} ${item.title}`,
            value: `${new Date(item.date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })} ${new Date(item.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`,
            isImpact: true,
            isUpcoming: true,
            time: new Date(item.date)
          }));
          setCalendarItems(upcoming);
        }
      } catch (err) {
        console.error("Ticker Calendar Error:", err);
      }
    }

    fetchCalendar();
    const interval = setInterval(fetchCalendar, 600000); // 10분마다 갱신 (너무 잦은 호출 방지)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#12141a] border-b border-gray-800 flex flex-col relative z-50">
      {/* Prices Row (TradingView - Top Quality Data) */}
      <div className="h-10 border-b border-gray-900 overflow-hidden" ref={containerRef}>
        {/* TradingView Widget Inject */}
      </div>

      {/* Events Row (Custom - Only if upcoming high impact) */}
      {calendarItems.length > 0 && (
        <div className="h-8 bg-[#0a0a0c] flex items-center overflow-hidden">
          <div className="flex animate-ticker whitespace-nowrap gap-12 px-6 items-center">
            {[...calendarItems, ...calendarItems].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-[10px] font-bold tracking-tighter uppercase font-outfit">
                {item.isImpact && <AlertCircle size={10} className="text-red-500" />}
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-gray-500">{item.label}</span>
                <span className="text-white bg-gray-800 px-1.5 py-0.5 rounded opacity-80">{item.value} KST</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
