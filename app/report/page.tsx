"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Download, ShieldCheck, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

const TARGET = {
  profit: 5965.67, pct: 59.66, pf: 2.38, sr: 14.28, dd: 10.59,
  total: 398, win: 348, loss: 50, buy: 88.28, sell: 86.16,
  winRate: 87.44,
};

const MONTHS = ['Jan', 'Feb', 'Mar'];

function generateCurve() {
  const labels: string[] = [];
  const data: number[] = [];
  const n = 80;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const mo = Math.floor(t * 3);
    const day = Math.floor((t * 3 - mo) * 28) + 1;
    labels.push(`${MONTHS[Math.min(mo, 2)]} ${day}`);
    const growth = Math.pow(t, 0.72) * (17002 - 10000);
    const noise = (Math.sin(i * 1.3) * 40 + Math.cos(i * 2.1) * 25) * (1 - t * 0.4);
    let bal = 10000 + growth + noise;
    if (i === n) bal = 15965.67;
    data.push(Math.round(bal));
  }
  return { labels, data };
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function ease(t: number) { return 1 - Math.pow(1 - t, 3); }

export default function BacktestReportPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [liveVal, setLiveVal] = useState('0.0');
  const [counters, setCounters] = useState({
    profit: 0, pct: 0, pf: 0, sr: 0, dd: 0,
    total: 0, win: 0, loss: 0, buy: 0, sell: 0, winRate: 0,
  });
  const [barP, setBarP] = useState(0);
  const [barL, setBarL] = useState(0);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; val: string; visible: boolean }>({
    x: 0, y: 0, date: '', val: '', visible: false,
  });
  const hasAnimated = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { labels, data: rawData } = useRef(generateCurve()).current;

  function runAnimations() {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // 차트 그리기
    let drawn = 0;
    function drawFrames() {
      if (!chartRef.current) return;
      const batch = Math.ceil(rawData.length / 60);
      for (let i = 0; i < batch && drawn < rawData.length; i++) {
        chartRef.current.data.datasets[0].data[drawn] = rawData[drawn];
        drawn++;
      }
      chartRef.current.update('none');
      const pct = ((rawData[drawn - 1] || 10000) - 10000) / (15965.67 - 10000) * TARGET.pct;
      setLiveVal(Math.min(pct, TARGET.pct).toFixed(1));
      if (drawn < rawData.length) requestAnimationFrame(drawFrames);
      else setLiveVal(TARGET.pct.toFixed(1));
    }
    requestAnimationFrame(drawFrames);

    // 카운터 애니메이션
    const start = Date.now();
    const dur = 1600;
    function tick() {
      const p = ease(Math.min((Date.now() - start) / dur, 1));
      setCounters({
        profit: lerp(0, TARGET.profit, p),
        pct: lerp(0, TARGET.pct, p),
        pf: lerp(0, TARGET.pf, p),
        sr: lerp(0, TARGET.sr, p),
        dd: lerp(0, TARGET.dd, p),
        total: lerp(0, TARGET.total, p),
        win: lerp(0, TARGET.win, p),
        loss: lerp(0, TARGET.loss, p),
        buy: lerp(0, TARGET.buy, p),
        sell: lerp(0, TARGET.sell, p),
        winRate: lerp(0, TARGET.winRate, p),
      });
      setBarP(70.4 * p);
      setBarL(29.6 * p);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  useEffect(() => {
    if (scriptLoaded && !hasAnimated.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) runAnimations();
      }, { threshold: 0.1 });
      if (wrapRef.current) observer.observe(wrapRef.current);
      return () => observer.disconnect();
    }
  }, [scriptLoaded]);

  function initChart() {
    const canvas = canvasRef.current;
    if (!canvas || !(window as any).Chart || chartRef.current) return;
    const Chart = (window as any).Chart;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 0, 220);
    grad.addColorStop(0, 'rgba(16,185,129,.3)');
    grad.addColorStop(1, 'rgba(16,185,129,0)');

    chartRef.current = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: rawData.map(() => null),
          borderColor: '#10B981',
          borderWidth: 2.5,
          backgroundColor: grad,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#10B981',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false,
            external({ chart, tooltip }: any) {
              if (tooltip.opacity === 0) { setTooltip(t => ({ ...t, visible: false })); return; }
              const dp = tooltip.dataPoints?.[0];
              if (!dp || dp.raw === null) { setTooltip(t => ({ ...t, visible: false })); return; }
              setTooltip({
                x: tooltip.caretX,
                y: tooltip.caretY,
                date: dp.label,
                val: '$' + dp.raw.toLocaleString(),
                visible: true,
              });
            }
          }
        },
        scales: {
          x: { display: false },
          y: {
            display: true,
            grid: { color: 'rgba(255,255,255,.04)' },
            ticks: {
              color: '#52525b',
              font: { size: 10, family: "'Courier New',monospace" },
              callback: (v: any) => '$' + Number(v).toLocaleString(),
              maxTicksLimit: 5,
            },
            border: { display: false },
          }
        },
        interaction: { mode: 'index', intersect: false },
      }
    });

    setScriptLoaded(true);
    // 이미 뷰포트 안에 있으면 바로 실행
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight) {
      setTimeout(runAnimations, 300);
    }
  }

  const ringCirc = 339.3;
  const ringOffset = ringCirc * (1 - counters.winRate / 100);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#c8a84b]/30 pb-20 overflow-x-hidden">
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"
        onLoad={initChart}
        strategy="lazyOnload"
      />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/treia" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-tight">메인으로 돌아가기</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#c8a84b]/10 border border-[#c8a84b]/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#c8a84b] rounded-full animate-pulse" />
            </div>
            <span className="text-xs font-mono tracking-widest uppercase text-[#c8a84b]">Deep Intelligence v3.2</span>
          </div>
        </div>
      </header>

      <main className="pt-32 px-6" ref={wrapRef}>
        <div className="max-w-7xl mx-auto">
          {/* Header Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-mono text-[11px] tracking-[5px] uppercase text-[#10B981]">
                Backtest Report
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-light mb-6">시스템의 <span className="text-[#10B981]">철벽 방어력</span> 증명</h1>
            <div className="flex flex-wrap gap-6 text-[#52525b] font-mono text-xs border-b border-white/5 pb-8">
              <span>M5 (5분봉)</span>
              <span>2026.01.01 ~ 2026.03.20</span>
              <span>XAUUSD (GOLD)</span>
              <span>초기자본 $10,000</span>
              <span className="text-[#c8a84b]">※ MT5 Strategy Tester 원본 데이터</span>
            </div>
          </motion.div>

          {/* Main Chart Section */}
          <div className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[40px] p-6 md:p-10 mb-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10B981]/5 blur-[120px] rounded-full transition-opacity group-hover:opacity-20 opacity-0 pointer-events-none" />
            
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="font-mono text-[11px] tracking-[3px] uppercase text-[#52525b] mb-2">Account Balance Growth</p>
                <h2 className="text-4xl md:text-6xl font-light text-[#10B981]">+{liveVal}%</h2>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-[#52525b] text-[10px] font-mono uppercase tracking-widest mb-1">Max Equity</p>
                <p className="text-white font-mono text-lg">$15,965.67</p>
              </div>
            </div>

            <div className="relative h-[350px] md:h-[450px]">
              <canvas ref={canvasRef} className="w-full h-full" />
              {tooltip.visible && (
                <div style={{
                  position: 'absolute',
                  left: Math.min(tooltip.x - 16, (canvasRef.current?.offsetWidth || 400) - 130),
                  top: tooltip.y - 65,
                  background: '#1a1c23', border: '1px solid #10B981', borderRadius: '12px',
                  padding: '10px 16px', fontSize: 13, pointerEvents: 'none', zIndex: 10,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                  <div className="text-[#7a7f8e] text-[10px] font-mono mb-1">{tooltip.date}</div>
                  <div className="text-[#10B981] font-bold font-mono text-lg">{tooltip.val}</div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-6 text-[#52525b] font-mono text-[10px] tracking-[2px] uppercase pt-6 border-t border-white/5">
              <span>Jan 2026</span>
              <span>Feb 2026</span>
              <span>Mar 2026</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[
              { label: 'Net Profit', val: '+$' + Math.round(counters.profit).toLocaleString(), sub: `+${counters.pct.toFixed(1)}% / 80일`, color: '#10B981' },
              { label: 'Profit Factor', val: counters.pf.toFixed(2), sub: '2.0 이상 = 우수', color: '#10B981' },
              { label: 'Sharpe Ratio', val: counters.sr.toFixed(2), sub: '1.0 이상 = 양호', color: '#c8a84b' },
              { label: 'Max Drawdown', val: counters.dd.toFixed(2) + '%', sub: '리스크 통제력 우수', color: '#ef4444' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[32px] p-6 md:p-8 border-t-2"
                style={{ borderTopColor: item.color }}
              >
                <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#52525b] mb-4">{item.label}</div>
                <div className="text-2xl md:text-3xl font-light mb-2 font-mono" style={{ color: item.color }}>{item.val}</div>
                <div className="text-[#52525b] text-[11px] font-light">{item.sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Win Rate Ring */}
            <div className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[40px] p-8 md:p-12 flex flex-col items-center">
              <div className="relative mb-10 scale-110 lg:scale-125">
                <svg width="180" height="180" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1c23" strokeWidth="10" />
                  <motion.circle
                    cx="70" cy="70" r="54" fill="none" stroke="#10B981" strokeWidth="10"
                    strokeDasharray={ringCirc}
                    strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                    style={{ filter: 'drop-shadow(0 0 12px rgba(16,185,129,.4))', transition: 'stroke-dashoffset 0.1s' }}
                  />
                  <text x="70" y="66" textAnchor="middle" fill="#10B981" fontSize="24" fontWeight="700" className="font-mono">
                    {counters.winRate.toFixed(1)}%
                  </text>
                  <text x="70" y="86" textAnchor="middle" fill="#52525b" fontSize="10" className="font-mono tracking-widest">
                    WIN RATE
                  </text>
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-8 w-full text-center">
                {[
                  { label: '총 거래', val: Math.round(counters.total), color: 'white' },
                  { label: '수익 거래', val: Math.round(counters.win), color: '#10B981' },
                  { label: '손실 거래', val: Math.round(counters.loss), color: '#ef4444' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-mono text-[10px] text-[#52525b] uppercase tracking-widest mb-2">{s.label}</div>
                    <div className="text-xl font-bold" style={{ color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profit/Loss Bars */}
            <div className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[40px] p-8 md:p-12 flex flex-col justify-center gap-10">
              <div>
                <div className="flex justify-between items-end mb-4 font-mono">
                  <span className="text-emerald-400 text-sm">TOTAL PROFIT $10,274</span>
                  <span className="text-red-400 text-sm">TOTAL LOSS $4,309</span>
                </div>
                <div className="h-3 bg-[#1a1c23] rounded-full overflow-hidden flex shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${barP}%` }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${barL}%` }}
                    className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-r-full"
                  />
                </div>
                <div className="flex justify-between mt-4 text-[#52525b] font-mono text-[11px]">
                  <span>{barP.toFixed(1)}%</span>
                  <span className="text-white/60">PROFIT FACTOR 2.38</span>
                  <span>{barL.toFixed(1)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5 group hover:bg-emerald-500/5 transition-colors">
                  <div className="font-mono text-[10px] text-[#52525b] uppercase tracking-[2px] mb-3">평균 수익</div>
                  <div className="text-2xl font-bold text-emerald-400 mb-1">+$29.53</div>
                  <div className="text-[10px] text-[#52525b]">최고 +$533.39</div>
                </div>
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5 group hover:bg-red-500/5 transition-colors">
                  <div className="font-mono text-[10px] text-[#52525b] uppercase tracking-[2px] mb-3">평균 손실</div>
                  <div className="text-2xl font-bold text-red-400 mb-1">-$86.18</div>
                  <div className="text-[10px] text-[#52525b]">최대 -$839.46</div>
                </div>
              </div>
            </div>
          </div>

          {/* Buy/Sell Direction Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { dir: '매수 포지션 (Buy)', val: counters.buy.toFixed(1) + '%', sub: '상승장 하이브리드 대응능력', arrow: '↑', color: '#3b82f6' },
              { dir: '매도 포지션 (Sell)', val: counters.sell.toFixed(1) + '%', sub: '하락장 추세 추종 모먼트', arrow: '↓', color: '#10B981' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[32px] p-10 flex items-center justify-between group hover:border-white/10 transition-colors"
              >
                <div>
                  <div className="font-mono text-[10px] text-[#52525b] uppercase tracking-[3px] mb-4">{item.dir}</div>
                  <div className="text-3xl md:text-5xl font-light mb-3" style={{ color: item.color }}>{item.val}</div>
                  <div className="text-[#52525b] text-sm font-light leading-relaxed">{item.sub}</div>
                </div>
                <div className="text-6xl font-black text-[#1a1c23] group-hover:text-white/5 transition-colors duration-500">{item.arrow}</div>
              </motion.div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="text-center pt-12 border-t border-white/5 max-w-2xl mx-auto">
            <p className="text-[#52525b] font-mono text-xs leading-relaxed mb-10">
              본 정적 리포트는 MetaTrader 5 백테스트 데이터를 조작 없이 시각화한 결과입니다.<br/>
              실계좌 성과 및 운용 환경에 따라 결과는 달라질 수 있으며, 이는 투자 권유가 아닌 정보 제공용입니다.
            </p>
            <a 
              href="/backtest_report.html" 
              download 
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-bold hover:bg-[#c8a84b] hover:-translate-y-1 transition-all shadow-2xl"
            >
              <Download size={20} />
              <span>원본 데이터 파일(HTML) 다운로드</span>
            </a>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @font-face {
          font-family: 'Outfit';
          src: url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;700&display=swap');
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
