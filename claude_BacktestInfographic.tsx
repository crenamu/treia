'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Script from 'next/script'

const TARGET = {
  profit: 5965.67, pct: 59.66, pf: 2.38, sr: 14.28, dd: 10.59,
  total: 398, win: 348, loss: 50, buy: 88.28, sell: 86.16,
  winRate: 87.44,
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function ease(t: number) { return 1 - Math.pow(1 - t, 3) }
function easeInOut(t: number) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

function generateCurve() {
  const labels: string[] = []
  const data: number[] = []
  const months = ['Jan', 'Feb', 'Mar']
  const n = 80
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const mo = Math.floor(t * 3)
    const day = Math.floor((t * 3 - mo) * 28) + 1
    labels.push(`${months[Math.min(mo, 2)]} ${day}`)
    const growth = Math.pow(t, 0.72) * (17002 - 10000)
    const noise = (Math.sin(i * 1.3) * 40 + Math.cos(i * 2.1) * 25) * (1 - t * 0.4)
    let bal = 10000 + growth + noise
    if (i === n) bal = 15965.67
    data.push(Math.round(bal))
  }
  return { labels, data }
}

// 개별 요소마다 IntersectionObserver 연결
function useScrollReveal(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTriggered(true)
        observer.disconnect()
      }
    }, { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, triggered }
}

// 숫자 카운트업 훅
function useCountUp(target: number, triggered: boolean, duration = 1400, decimals = 0) {
  const [val, setVal] = useState(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!triggered) return
    const start = Date.now()
    function tick() {
      const p = ease(Math.min((Date.now() - start) / duration, 1))
      setVal(lerp(0, target, p))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [triggered, target, duration])

  return decimals === 0 ? Math.round(val) : parseFloat(val.toFixed(decimals))
}

// ── 차트 섹션 ──
function ChartSection({ scriptLoaded }: { scriptLoaded: boolean }) {
  const { ref, triggered } = useScrollReveal(0.15)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)
  const [liveVal, setLiveVal] = useState('0.0')
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, date: '', val: '', visible: false })
  const animDone = useRef(false)
  const { labels, data: rawData } = useRef(generateCurve()).current

  const runChart = useCallback(() => {
    if (animDone.current || !chartRef.current) return
    animDone.current = true
    let drawn = 0
    function drawFrames() {
      if (!chartRef.current) return
      const batch = Math.ceil(rawData.length / 55)
      for (let i = 0; i < batch && drawn < rawData.length; i++) {
        chartRef.current.data.datasets[0].data[drawn] = rawData[drawn]
        drawn++
      }
      chartRef.current.update('none')
      const pct = ((rawData[drawn - 1] || 10000) - 10000) / (15965.67 - 10000) * TARGET.pct
      setLiveVal(Math.min(pct, TARGET.pct).toFixed(1))
      if (drawn < rawData.length) requestAnimationFrame(drawFrames)
      else setLiveVal(TARGET.pct.toFixed(1))
    }
    requestAnimationFrame(drawFrames)
  }, [rawData])

  // Chart.js 초기화
  useEffect(() => {
    if (!scriptLoaded || !canvasRef.current || chartRef.current) return
    const Chart = (window as any).Chart
    if (!Chart) return
    const ctx = canvasRef.current.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 0, 220)
    grad.addColorStop(0, 'rgba(16,185,129,.28)')
    grad.addColorStop(1, 'rgba(16,185,129,0)')
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: rawData.map(() => null),
          borderColor: '#10B981', borderWidth: 2.5,
          backgroundColor: grad, fill: true, tension: 0.4,
          pointRadius: 0, pointHoverRadius: 6,
          pointHoverBackgroundColor: '#10B981',
          pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: { duration: 0 },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false,
            external({ chart, tooltip }: any) {
              if (tooltip.opacity === 0) { setTooltip(t => ({ ...t, visible: false })); return }
              const dp = tooltip.dataPoints?.[0]
              if (!dp || dp.raw === null) { setTooltip(t => ({ ...t, visible: false })); return }
              setTooltip({ x: tooltip.caretX, y: tooltip.caretY, date: dp.label, val: '$' + dp.raw.toLocaleString(), visible: true })
            }
          }
        },
        scales: {
          x: { display: false },
          y: {
            display: true,
            grid: { color: 'rgba(255,255,255,.04)' },
            ticks: { color: '#52525b', font: { size: 10 }, callback: (v: any) => '$' + Number(v).toLocaleString(), maxTicksLimit: 5 },
            border: { display: false },
          }
        },
        interaction: { mode: 'index', intersect: false },
      }
    })
    if (triggered) runChart()
  }, [scriptLoaded])

  useEffect(() => {
    if (triggered && chartRef.current) runChart()
  }, [triggered])

  const opacity = triggered ? 1 : 0
  const ty = triggered ? 0 : 32

  return (
    <div ref={ref} style={{ transition: 'opacity .7s ease, transform .7s ease', opacity, transform: `translateY(${ty}px)`, background: '#111', border: '1px solid #1e2230', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#52525b' }}>Account Balance Growth</span>
        <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: '#10B981' }}>+{liveVal}%</span>
      </div>
      <div style={{ position: 'relative', height: 220 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        {tooltip.visible && (
          <div style={{ position: 'absolute', left: Math.min(tooltip.x - 16, 300), top: tooltip.y - 60, background: '#1e2230', border: '1px solid #10B981', borderRadius: 6, padding: '8px 12px', fontSize: 12, pointerEvents: 'none', zIndex: 10 }}>
            <div style={{ color: '#7a7f8e', fontSize: 11 }}>{tooltip.date}</div>
            <div style={{ color: '#10B981', fontWeight: 700, fontSize: 14 }}>{tooltip.val}</div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#52525b', marginTop: 8, fontFamily: 'monospace' }}>
        <span>Jan 2026</span><span>Feb 2026</span><span>Mar 2026</span>
      </div>
    </div>
  )
}

// ── 지표 카드 하나 ──
function StatCard({ label, val, sub, color, delay = 0 }: { label: string; val: string; sub: string; color: string; delay?: number }) {
  const { ref, triggered } = useScrollReveal(0.25)
  const [show, setShow] = useState(false)
  useEffect(() => { if (triggered) setTimeout(() => setShow(true), delay) }, [triggered])
  return (
    <div ref={ref} style={{ background: '#0f1117', border: '1px solid #1e2230', borderTop: `2px solid ${color}`, borderRadius: 10, padding: 16, transition: `opacity .6s ${delay}ms ease, transform .6s ${delay}ms ease`, opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(24px)' }}>
      <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#52525b', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1, fontFamily: 'monospace' }}>{val}</div>
      <div style={{ fontSize: 11, color: '#52525b', marginTop: 6 }}>{sub}</div>
    </div>
  )
}

// ── 카운트업 카드 ──
function CountCard({ label, target, prefix = '', suffix = '', decimals = 0, sub, color, delay = 0 }: {
  label: string; target: number; prefix?: string; suffix?: string; decimals?: number; sub: string; color: string; delay?: number
}) {
  const { ref, triggered } = useScrollReveal(0.25)
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(false)
  useEffect(() => {
    if (triggered) {
      setTimeout(() => setShow(true), delay)
      setTimeout(() => setActive(true), delay + 50)
    }
  }, [triggered])
  const val = useCountUp(target, active, 1400, decimals)
  const display = `${prefix}${decimals === 0 ? Number(val).toLocaleString() : val}${suffix}`
  return (
    <div ref={ref} style={{ background: '#0f1117', border: '1px solid #1e2230', borderTop: `2px solid ${color}`, borderRadius: 10, padding: 16, transition: `opacity .6s ${delay}ms ease, transform .6s ${delay}ms ease`, opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(24px)' }}>
      <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#52525b', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1, fontFamily: 'monospace' }}>{display}</div>
      <div style={{ fontSize: 11, color: '#52525b', marginTop: 6 }}>{sub}</div>
    </div>
  )
}

// ── 승률 링 ──
function WinRing() {
  const { ref, triggered } = useScrollReveal(0.3)
  const [active, setActive] = useState(false)
  useEffect(() => { if (triggered) setTimeout(() => setActive(true), 100) }, [triggered])
  const rate = useCountUp(TARGET.winRate, active, 1600, 1) as number
  const total = useCountUp(TARGET.total, active, 1400)
  const win = useCountUp(TARGET.win, active, 1400)
  const loss = useCountUp(TARGET.loss, active, 1400)
  const circ = 339.3
  const offset = circ * (1 - Number(rate) / 100)
  return (
    <div ref={ref} style={{ background: '#0f1117', border: '1px solid #1e2230', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, transition: 'opacity .7s ease, transform .7s ease', opacity: triggered ? 1 : 0, transform: triggered ? 'translateY(0)' : 'translateY(32px)' }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#1e2230" strokeWidth="10" />
        <circle cx="70" cy="70" r="54" fill="none" stroke="#10B981" strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 70 70)"
          style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,.6))', transition: 'stroke-dashoffset .04s' }} />
        <text x="70" y="65" textAnchor="middle" fill="#10B981" fontSize="22" fontWeight="700" fontFamily="monospace">{String(rate).replace(/(\.\d).*/, '$1')}%</text>
        <text x="70" y="84" textAnchor="middle" fill="#52525b" fontSize="10" fontFamily="monospace">WIN RATE</text>
      </svg>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 16, width: '100%', textAlign: 'center' }}>
        {[['총 거래', total, '#fff'], ['수익', win, '#10B981'], ['손실', loss, '#e05252']].map(([l, v, c]) => (
          <div key={l as string}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#52525b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: c as string }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 수익/손실 바 ──
function ProfitBar() {
  const { ref, triggered } = useScrollReveal(0.3)
  const [active, setActive] = useState(false)
  useEffect(() => { if (triggered) setTimeout(() => setActive(true), 200) }, [triggered])
  const [barPct, setBarPct] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = Date.now()
    function tick() {
      const p = ease(Math.min((Date.now() - start) / 1200, 1))
      setBarPct(p)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active])
  const pp = (70.4 * barPct).toFixed(1)
  const lp = (29.6 * barPct).toFixed(1)
  return (
    <div ref={ref} style={{ background: '#0f1117', border: '1px solid #1e2230', borderRadius: 10, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16, transition: 'opacity .7s .1s ease, transform .7s .1s ease', opacity: triggered ? 1 : 0, transform: triggered ? 'translateY(0)' : 'translateY(32px)' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'monospace', marginBottom: 6 }}>
          <span style={{ color: '#10B981' }}>수익 $10,274</span>
          <span style={{ color: '#e05252' }}>손실 $4,309</span>
        </div>
        <div style={{ height: 10, background: '#1e2230', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
          <div style={{ height: '100%', width: `${pp}%`, background: 'linear-gradient(90deg,#059669,#10B981)', borderRadius: '99px 0 0 99px', transition: 'width .04s' }} />
          <div style={{ height: '100%', width: `${lp}%`, background: 'linear-gradient(90deg,#e05252,#991b1b)', borderRadius: '0 99px 99px 0', transition: 'width .04s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#52525b', marginTop: 6, fontFamily: 'monospace' }}>
          <span>{pp}%</span><span>PF 2.38</span><span>{lp}%</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ background: '#0a0a0a', borderRadius: 8, padding: 14 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#52525b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>평균 수익</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#10B981' }}>+$29.53</div>
          <div style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>최대 +$533.39</div>
        </div>
        <div style={{ background: '#0a0a0a', borderRadius: 8, padding: 14 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#52525b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>평균 손실</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#e05252' }}>-$86.18</div>
          <div style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>최대 -$839.46</div>
        </div>
      </div>
    </div>
  )
}

// ── 방향 카드 ──
function DirCard({ dir, target, sub, arrow, delay = 0 }: { dir: string; target: number; sub: string; arrow: string; delay?: number }) {
  const { ref, triggered } = useScrollReveal(0.3)
  const [active, setActive] = useState(false)
  useEffect(() => { if (triggered) setTimeout(() => setActive(true), delay) }, [triggered])
  const val = useCountUp(target, active, 1200, 1)
  return (
    <div ref={ref} style={{ background: '#0f1117', border: '1px solid #1e2230', borderRadius: 10, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: `opacity .6s ${delay}ms ease, transform .6s ${delay}ms ease`, opacity: triggered ? 1 : 0, transform: triggered ? 'translateY(0)' : 'translateY(24px)' }}>
      <div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#52525b', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>{dir}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#10B981', fontFamily: 'monospace' }}>{val}%</div>
        <div style={{ fontSize: 12, color: '#52525b', marginTop: 4 }}>{sub}</div>
      </div>
      <div style={{ fontSize: 36, color: '#1e2230', fontWeight: 700 }}>{arrow}</div>
    </div>
  )
}

// ── 헤더 ──
function Header() {
  const { ref, triggered } = useScrollReveal(0.1)
  return (
    <div ref={ref} style={{ transition: 'opacity .8s ease, transform .8s ease', opacity: triggered ? 1 : 0, transform: triggered ? 'translateY(0)' : 'translateY(20px)', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'treiaP 1.5s infinite' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#10B981' }}>Backtest Report</span>
      </div>
      <h3 className="font-outfit" style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 6 }}>실제 데이터로 증명된 시스템의 방어력</h3>
      <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#52525b' }}>
        M5 (5분봉) · 2026.01.01 ~ 2026.03.20 · XAUUSD · 초기자본 $10,000
        <span style={{ color: '#c8a84b', marginLeft: 12 }}>※ MT5 Strategy Tester 백테스트 결과</span>
      </p>
    </div>
  )
}

export default function BacktestInfographic() {
  const [scriptLoaded, setScriptLoaded] = useState(false)

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js" onLoad={() => setScriptLoaded(true)} strategy="lazyOnload" />

      <section style={{ background: '#0a0a0a', width: '100%' }}>
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
          <Header />
          <ChartSection scriptLoaded={scriptLoaded} />

          {/* 핵심 지표 — 각각 개별 observer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10, marginBottom: 20 }}>
            <CountCard label="Net Profit" target={TARGET.profit} prefix="+$" sub={`+${TARGET.pct.toFixed(1)}% / 80일`} color="#10B981" delay={0} />
            <CountCard label="Profit Factor" target={TARGET.pf} decimals={2} sub="2.0 이상 = 우수" color="#10B981" delay={120} />
            <CountCard label="Sharpe Ratio" target={TARGET.sr} decimals={2} sub="1.0 이상 = 양호" color="#c8a84b" delay={240} />
            <CountCard label="Max Drawdown" target={TARGET.dd} decimals={2} suffix="%" sub="잔고 기준 최대 하락" color="#e05252" delay={360} />
          </div>

          {/* 승률 + 수익손실 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10, marginBottom: 20 }}>
            <WinRing />
            <ProfitBar />
          </div>

          {/* 방향별 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10, marginBottom: 20 }}>
            <DirCard dir="매수 (Buy)" target={TARGET.buy} sub="상승장 대응" arrow="↑" delay={0} />
            <DirCard dir="매도 (Sell)" target={TARGET.sell} sub="하락장 대응" arrow="↓" delay={150} />
          </div>

          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#3f3f46', textAlign: 'center', lineHeight: 1.6 }}>
            본 데이터는 MT5 백테스트 결과입니다. 실계좌 및 프론트테스트 성과는 다를 수 있습니다. 투자 권유가 아닙니다.
          </p>
        </div>
      </section>

      <style>{`
        @keyframes treiaP {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.5;transform:scale(1.3)}
        }
      `}</style>
    </>
  )
}
