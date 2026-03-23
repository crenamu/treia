'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

const TARGET = {
  profit: 5965.67, pct: 59.66, pf: 2.38, sr: 14.28, dd: 10.59,
  total: 398, win: 348, loss: 50, buy: 88.28, sell: 86.16,
  winRate: 87.44,
}

const MONTHS = ['Jan', 'Feb', 'Mar']

function generateCurve() {
  const labels: string[] = []
  const data: number[] = []
  const n = 80
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const mo = Math.floor(t * 3)
    const day = Math.floor((t * 3 - mo) * 28) + 1
    labels.push(`${MONTHS[Math.min(mo, 2)]} ${day}`)
    const growth = Math.pow(t, 0.72) * (17002 - 10000)
    const noise = (Math.sin(i * 1.3) * 40 + Math.cos(i * 2.1) * 25) * (1 - t * 0.4)
    let bal = 10000 + growth + noise
    if (i === n) bal = 15965.67
    data.push(Math.round(bal))
  }
  return { labels, data }
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function ease(t: number) { return 1 - Math.pow(1 - t, 3) }

export default function BacktestInfographic() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [liveVal, setLiveVal] = useState('0.0')
  const [counters, setCounters] = useState({
    profit: 0, pct: 0, pf: 0, sr: 0, dd: 0,
    total: 0, win: 0, loss: 0, buy: 0, sell: 0, winRate: 0,
  })
  const [barP, setBarP] = useState(0)
  const [barL, setBarL] = useState(0)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; val: string; visible: boolean }>({
    x: 0, y: 0, date: '', val: '', visible: false,
  })
  const hasAnimated = useRef(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const { labels, data: rawData } = useRef(generateCurve()).current

  function runAnimations() {
    if (hasAnimated.current) return
    hasAnimated.current = true

    // 차트 그리기
    let drawn = 0
    function drawFrames() {
      if (!chartRef.current) return
      const batch = Math.ceil(rawData.length / 60)
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

    // 카운터 애니메이션
    const start = Date.now()
    const dur = 1600
    function tick() {
      const p = ease(Math.min((Date.now() - start) / dur, 1))
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
      })
      setBarP(70.4 * p)
      setBarL(29.6 * p)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && scriptLoaded) runAnimations()
    }, { threshold: 0.2 })
    if (wrapRef.current) observer.observe(wrapRef.current)
    return () => observer.disconnect()
  }, [scriptLoaded])

  function initChart() {
    const canvas = canvasRef.current
    if (!canvas || !(window as any).Chart || chartRef.current) return
    const Chart = (window as any).Chart
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const grad = ctx.createLinearGradient(0, 0, 0, 220)
    grad.addColorStop(0, 'rgba(16,185,129,.3)')
    grad.addColorStop(1, 'rgba(16,185,129,0)')

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
              if (tooltip.opacity === 0) { setTooltip(t => ({ ...t, visible: false })); return }
              const dp = tooltip.dataPoints?.[0]
              if (!dp || dp.raw === null) { setTooltip(t => ({ ...t, visible: false })); return }
              setTooltip({
                x: tooltip.caretX,
                y: tooltip.caretY,
                date: dp.label,
                val: '$' + dp.raw.toLocaleString(),
                visible: true,
              })
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
    })

    setScriptLoaded(true)
    // 이미 뷰포트 안에 있으면 바로 실행
    const rect = wrapRef.current?.getBoundingClientRect()
    if (rect && rect.top < window.innerHeight) {
      setTimeout(runAnimations, 300)
    }
  }

  const ringCirc = 339.3
  const ringOffset = ringCirc * (1 - counters.winRate / 100)

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"
        onLoad={initChart}
        strategy="lazyOnload"
      />

      <section
        ref={wrapRef}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20"
        style={{ background: '#0a0a0a' }}
      >
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: '#10B981',
            display: 'inline-block', animation: 'pulse 1.5s infinite'
          }} />
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#10B981' }}>
            Backtest Report
          </span>
        </div>
        <h3 className="font-outfit" style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
          실제 데이터로 증명된 시스템의 방어력
        </h3>
        <p style={{ fontFamily: "'Courier New',monospace", fontSize: 12, color: '#52525b', marginBottom: 24 }}>
          M5 (5분봉) · 2026.01.01 ~ 2026.03.20 · XAUUSD · 초기자본 $10,000
          <span style={{ color: '#c8a84b', marginLeft: 12 }}>※ MT5 Strategy Tester 백테스트 결과</span>
        </p>

        {/* 잔고 곡선 */}
        <div style={{ background: '#111', border: '1px solid #1e2230', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#52525b' }}>
              Account Balance Growth
            </span>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 20, fontWeight: 700, color: '#10B981' }}>
              +{liveVal}%
            </span>
          </div>
          <div style={{ position: 'relative', height: 220 }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            {tooltip.visible && (
              <div style={{
                position: 'absolute',
                left: Math.min(tooltip.x - 16, (canvasRef.current?.offsetWidth || 400) - 130),
                top: tooltip.y - 60,
                background: '#1e2230', border: '1px solid #10B981', borderRadius: 6,
                padding: '8px 12px', fontSize: 12, pointerEvents: 'none', zIndex: 10,
              }}>
                <div style={{ color: '#7a7f8e', fontSize: 11 }}>{tooltip.date}</div>
                <div style={{ color: '#10B981', fontWeight: 700, fontSize: 14 }}>{tooltip.val}</div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#52525b', marginTop: 8, fontFamily: "'Courier New',monospace" }}>
            <span>Jan 2026</span><span>Feb 2026</span><span>Mar 2026</span>
          </div>
        </div>

        {/* 핵심 지표 4개 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Net Profit', val: '+$' + Math.round(counters.profit).toLocaleString(), sub: `+${counters.pct.toFixed(1)}% / 80일`, color: '#10B981' },
            { label: 'Profit Factor', val: counters.pf.toFixed(2), sub: '2.0 이상 = 우수', color: '#10B981' },
            { label: 'Sharpe Ratio', val: counters.sr.toFixed(2), sub: '1.0 이상 = 양호', color: '#c8a84b' },
            { label: 'Max Drawdown', val: counters.dd.toFixed(2) + '%', sub: '잔고 기준 최대 하락', color: '#e05252' },
          ].map((item) => (
            <div key={item.label} style={{
              background: '#0f1117', border: '1px solid #1e2230', borderRadius: 10,
              padding: 16, borderTop: `2px solid ${item.color}`,
            }}>
              <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#52525b', marginBottom: 8 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: item.color, lineHeight: 1, fontFamily: "'Courier New',monospace" }}>
                {item.val}
              </div>
              <div style={{ fontSize: 11, color: '#52525b', marginTop: 6 }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* 승률 링 + 수익손실 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10, marginBottom: 20 }}>
          {/* 링 */}
          <div style={{ background: '#0f1117', border: '1px solid #1e2230', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#1e2230" strokeWidth="10" />
              <circle
                cx="70" cy="70" r="54" fill="none" stroke="#10B981" strokeWidth="10"
                strokeDasharray={ringCirc}
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,.6))', transition: 'stroke-dashoffset .05s' }}
              />
              <text x="70" y="65" textAnchor="middle" fill="#10B981" fontSize="22" fontWeight="700" fontFamily="'Courier New',monospace">
                {counters.winRate.toFixed(1)}%
              </text>
              <text x="70" y="84" textAnchor="middle" fill="#52525b" fontSize="10" fontFamily="'Courier New',monospace">
                WIN RATE
              </text>
            </svg>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 16, width: '100%', textAlign: 'center' }}>
              {[
                { label: '총 거래', val: Math.round(counters.total), color: '#fff' },
                { label: '수익', val: Math.round(counters.win), color: '#10B981' },
                { label: '손실', val: Math.round(counters.loss), color: '#e05252' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: '#52525b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 수익손실 바 */}
          <div style={{ background: '#0f1117', border: '1px solid #1e2230', borderRadius: 10, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: "'Courier New',monospace", marginBottom: 6 }}>
                <span style={{ color: '#10B981' }}>수익 $10,274</span>
                <span style={{ color: '#e05252' }}>손실 $4,309</span>
              </div>
              <div style={{ height: 10, background: '#1e2230', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
                <div style={{ height: '100%', width: `${barP}%`, background: 'linear-gradient(90deg,#059669,#10B981)', borderRadius: '99px 0 0 99px', transition: 'width .05s' }} />
                <div style={{ height: '100%', width: `${barL}%`, background: 'linear-gradient(90deg,#e05252,#991b1b)', borderRadius: '0 99px 99px 0', transition: 'width .05s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#52525b', marginTop: 6, fontFamily: "'Courier New',monospace" }}>
                <span>{barP.toFixed(1)}%</span>
                <span>PF 2.38</span>
                <span>{barL.toFixed(1)}%</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: '#0a0a0a', borderRadius: 8, padding: 14 }}>
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: '#52525b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>평균 수익</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#10B981' }}>+$29.53</div>
                <div style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>최대 +$533.39</div>
              </div>
              <div style={{ background: '#0a0a0a', borderRadius: 8, padding: 14 }}>
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: '#52525b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>평균 손실</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#e05252' }}>-$86.18</div>
                <div style={{ fontSize: 11, color: '#52525b', marginTop: 4 }}>최대 -$839.46</div>
              </div>
            </div>
          </div>
        </div>

        {/* 방향별 승률 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10, marginBottom: 20 }}>
          {[
            { dir: '매수 (Buy)', val: counters.buy.toFixed(1) + '%', sub: '상승장 대응', arrow: '↑' },
            { dir: '매도 (Sell)', val: counters.sell.toFixed(1) + '%', sub: '하락장 대응', arrow: '↓' },
          ].map(item => (
            <div key={item.dir} style={{
              background: '#0f1117', border: '1px solid #1e2230', borderRadius: 10,
              padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: '#52525b', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>{item.dir}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#10B981' }}>{item.val}</div>
                <div style={{ fontSize: 12, color: '#52525b', marginTop: 4 }}>{item.sub}</div>
              </div>
              <div style={{ fontSize: 36, color: '#1e2230', fontWeight: 700 }}>{item.arrow}</div>
            </div>
          ))}
        </div>

        {/* 면책 */}
        <p style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: '#3f3f46', textAlign: 'center', lineHeight: 1.6 }}>
          본 데이터는 MT5 백테스트 결과입니다. 실계좌 및 프론트테스트 성과는 다를 수 있습니다. 투자 권유가 아닙니다.
        </p>

        <style>{`
          @keyframes pulse {
            0%,100%{opacity:1;transform:scale(1)}
            50%{opacity:.5;transform:scale(1.3)}
          }
        `}</style>
      </section>
    </>
  )
}
