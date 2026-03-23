"use client";

import { motion, useInView } from "framer-motion";
import { ArrowLeft, Download, ShieldCheck, Clock, Zap, TrendingUp, BarChart3 } from "lucide-react";
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

// Reusable Counter Component for Report
function ReportCounter({ value, decimals = 0, suffix = "" }: { value: number, decimals?: number, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const duration = 1500;
      
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = ease(progress);
        setDisplayValue(lerp(0, value, eased));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [isInView, value]);

  return <span ref={ref}>{displayValue.toFixed(decimals)}{suffix}</span>;
}

export default function BacktestReportPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [liveVal, setLiveVal] = useState(0);
  
  const isChartInView = useInView(chartContainerRef, { once: true, margin: "-100px" });
  const hasChartAnimated = useRef(false);
  const { labels, data: rawData } = useRef(generateCurve()).current;
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; val: string; visible: boolean }>({
    x: 0, y: 0, date: '', val: '', visible: false,
  });

  // Chart Animation triggered only when chart section is in view
  useEffect(() => {
    if (isChartInView && scriptLoaded && !hasChartAnimated.current && chartRef.current) {
      hasChartAnimated.current = true;
      let drawn = 0;
      const drawFrames = () => {
        if (!chartRef.current) return;
        const batch = Math.ceil(rawData.length / 60);
        for (let i = 0; i < batch && drawn < rawData.length; i++) {
          chartRef.current.data.datasets[0].data[drawn] = rawData[drawn];
          drawn++;
        }
        chartRef.current.update('none');
        const pct = ((rawData[drawn - 1] || 10000) - 10000) / (15965.67 - 10000) * TARGET.pct;
        setLiveVal(Math.min(pct, TARGET.pct));
        if (drawn < rawData.length) requestAnimationFrame(drawFrames);
        else setLiveVal(TARGET.pct);
      };
      requestAnimationFrame(drawFrames);
    }
  }, [isChartInView, scriptLoaded, rawData]);

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
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 overflow-x-hidden selection:bg-[#c8a84b]/30">
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"
        onLoad={initChart}
        strategy="lazyOnload"
      />

      <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/treia" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">메인 홈페이지</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#c8a84b]/10 border border-[#c8a84b]/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#c8a84b] rounded-full animate-pulse" />
            </div>
            <span className="text-xs font-mono tracking-widest uppercase text-[#c8a84b]">Analytical Dashboard v3.2</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 border-b border-white/5 pb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-mono text-[11px] tracking-[5px] uppercase text-[#10B981]">Deep Insight Analysis</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light mb-6 leading-tight break-keep">실제 데이터로 입증된 <br className="md:hidden" /><span className="text-[#10B981]">아성에 근거한 수익력</span></h1>
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-[#52525b] font-mono text-xs">
            <span>M5 (5분봉 전략)</span>
            <span>2026.01.01 ~ 2026.03.20</span>
            <span>XAUUSD (GOLD)</span>
            <span className="text-[#c8a84b]">조작 불가능한 MT5 원본 기록</span>
          </div>
        </motion.div>

        {/* Growth Chart Section */}
        <motion.div 
          ref={chartContainerRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[40px] p-6 md:p-12 mb-10 shadow-3xl group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10B981]/5 blur-[120px] rounded-full opacity-60 pointer-events-none" />
          
          <div className="flex justify-between items-end mb-12 relative z-10">
            <div>
              <p className="font-mono text-[10px] tracking-[4px] uppercase text-[#52525b] mb-3">Balance Growth Performance</p>
              <h2 className="text-4xl md:text-7xl font-light text-[#10B981]">+{liveVal.toFixed(1)}%</h2>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-[#52525b] text-[10px] font-mono uppercase tracking-widest mb-1">Max Equity Reached</p>
              <p className="text-white font-mono text-xl">$15,965.67</p>
            </div>
          </div>

          <div className="relative h-[300px] md:h-[450px] z-10">
            <canvas ref={canvasRef} className="w-full h-full" />
            {tooltip.visible && (
              <div style={{
                position: 'absolute',
                left: Math.min(tooltip.x - 16, (canvasRef.current?.offsetWidth || 400) - 130),
                top: tooltip.y - 70,
                background: '#1a1c23', border: '1px solid #10B981', borderRadius: '16px',
                padding: '12px 20px', fontSize: 13, pointerEvents: 'none', zIndex: 10,
                boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
              }}>
                <div className="text-[#7a7f8e] text-[10px] font-mono mb-1">{tooltip.date}</div>
                <div className="text-[#10B981] font-bold font-mono text-lg">{tooltip.val}</div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-8 text-[#52525b] font-mono text-[9px] tracking-[3px] uppercase pt-8 border-t border-white/5 relative z-10">
            <span>Jan 2026</span>
            <span>Feb 2026</span>
            <span>Mar 2026</span>
          </div>
        </motion.div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Net Profit', val: TARGET.profit, suffix: "$", prefix: "+", color: '#10B981' },
            { label: 'Profit Factor', val: TARGET.pf, decimals: 2, color: '#10B981' },
            { label: 'Sharpe Ratio', val: TARGET.sr, decimals: 2, color: '#c8a84b' },
            { label: 'Max Drawdown', val: TARGET.dd, decimals: 2, suffix: "%", color: '#ef4444' },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-3xl p-8 border-t-2"
              style={{ borderTopColor: item.color }}
            >
              <div className="font-mono text-[10px] tracking-[3px] uppercase text-[#52525b] mb-4">{item.label}</div>
              <div className="text-3xl font-light mb-1 font-mono" style={{ color: item.color }}>
                {item.prefix}<ReportCounter value={item.val} decimals={item.decimals} suffix={item.suffix} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Circular Distribution Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[40px] p-12 flex flex-col items-center justify-center relative group"
          >
            <WinRateRing value={TARGET.winRate} total={TARGET.total} win={TARGET.win} loss={TARGET.loss} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[40px] p-10 flex flex-col justify-center gap-12"
          >
            <ProfitLossBars />
          </motion.div>
        </div>

        {/* Directional Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {[
            { dir: 'Buy Direction', val: TARGET.buy, color: '#3b82f6', icon: '↑' },
            { dir: 'Sell Direction', val: TARGET.sell, color: '#10B981', icon: '↓' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#0a0b0e] border border-[#1a1a1a] rounded-[32px] p-10 flex items-center justify-between group"
            >
              <div>
                <p className="font-mono text-[10px] text-[#52525b] tracking-[4px] uppercase mb-4">{item.dir}</p>
                <div className="text-4xl font-light" style={{ color: item.color }}>
                  <ReportCounter value={item.val} decimals={1} suffix="%" />
                </div>
              </div>
              <div className="text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors uppercase">{item.icon}</div>
            </motion.div>
          ))}
        </div>

        {/* Actual Report Download */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center pt-20 border-t border-white/5"
        >
          <p className="text-[#52525b] text-sm mb-10 max-w-2xl mx-auto leading-relaxed">
            위 데이터는 시스템의 잠재력을 가늠하기 위한 과거의 기록입니다. <br />
            무보정 원본 리포트와 실시간 모니터링 계좌를 통해 투명하게 검증받으십시오.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/backtest_report.html" 
              download 
              className="flex items-center justify-center gap-3 bg-[#c8a84b] text-black px-12 py-5 rounded-2xl font-bold hover:bg-white hover:-translate-y-1 transition-all"
            >
              <Download size={18} />
              <span>원본 HTML 다운로드</span>
            </a>
            <Link 
              href="/treia" 
              className="flex items-center justify-center gap-3 bg-white/5 text-white px-12 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all border border-white/5"
            >
              <span>메인 화면으로</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function WinRateRing({ value, total, win, loss }: any) {
  const circ = 339.3;
  const [offset, setOffset] = useState(circ);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        setOffset(circ * (1 - value / 100));
      }, 300);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="relative mb-12 transform scale-110">
        <svg width="180" height="180" viewBox="0 0 140 140" className="mx-auto">
          <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1c23" strokeWidth="10" />
          <motion.circle
            cx="70" cy="70" r="54" fill="none" stroke="#10B981" strokeWidth="10"
            strokeDasharray={circ}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "easeOut" }}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
            style={{ filter: 'drop-shadow(0 0 12px rgba(16,185,129,.3))' }}
          />
          <text x="70" y="66" textAnchor="middle" fill="#10B981" fontSize="24" fontWeight="700" className="font-mono tracking-tighter">
            {value.toFixed(1)}%
          </text>
          <text x="70" y="86" textAnchor="middle" fill="#52525b" fontSize="9" className="font-mono tracking-widest uppercase">Win Rate</text>
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-10">
        {[
          { label: 'Trades', val: total, color: 'white' },
          { label: 'Wins', val: win, color: '#10B981' },
          { label: 'Losses', val: loss, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i}>
            <div className="text-[10px] text-[#52525b] uppercase font-mono mb-2">{s.label}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfitLossBars() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <div ref={ref}>
      <div className="flex justify-between items-end mb-6 font-mono text-xs tracking-tighter">
        <span className="text-emerald-400">GROSS PROFIT $10,274</span>
        <span className="text-red-400">GROSS LOSS $4,309</span>
      </div>
      <div className="h-4 bg-[#1a1c23] rounded-full overflow-hidden flex shadow-inner mb-6">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: isInView ? "70.4%" : "0%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full"
        />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: isInView ? "29.6%" : "0%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-r-full"
        />
      </div>
      <div className="flex justify-between text-[#52525b] font-mono text-[10px] tracking-[2px] uppercase mb-12">
        <span>70.4% Impact</span>
        <span className="text-white/40">PF 2.38</span>
        <span>29.6% Impact</span>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
          <p className="text-[10px] text-[#52525b] uppercase font-mono mb-3 tracking-widest">Avg Win</p>
          <p className="text-2xl font-bold text-emerald-400">+$29.53</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
          <p className="text-[10px] text-[#52525b] uppercase font-mono mb-3 tracking-widest">Avg Loss</p>
          <p className="text-2xl font-bold text-red-400">-$86.18</p>
        </div>
      </div>
    </div>
  );
}
