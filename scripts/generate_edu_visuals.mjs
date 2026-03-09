import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'public/images/patterns');
mkdirSync(OUTPUT_DIR, { recursive: true });

const COLORS = {
  bull: '#22c55e', // emerald-500
  bear: '#ef4444', // red-500
  neutral: '#94a3b8', // slate-400
  gold: '#f59e0b', // amber-500
  white: '#ffffff',
  bg: '#0f172a'
};

const templates = {
  // 1. CFD (Contract for Difference) - Price difference concept
  'cfd': `
    <rect x="50" y="150" width="100" height="100" fill="${COLORS.neutral}" opacity="0.2" />
    <path d="M50 250 L150 150 L250 200 L350 100" stroke="${COLORS.gold}" stroke-width="8" fill="none" />
    <circle cx="50" cy="250" r="10" fill="${COLORS.gold}" />
    <circle cx="350" cy="100" r="10" fill="${COLORS.gold}" />
    <path d="M370 250 L370 100" stroke="${COLORS.bull}" stroke-width="4" marker-end="url(#arrow)" />
    <text x="380" y="175" fill="${COLORS.bull}" font-family="sans-serif" font-weight="bold" font-size="24">Profit Difference</text>
  `,
  // 2. Leverage (Scale)
  'leverage': `
    <path d="M200 300 L50 350 L350 250 Z" fill="${COLORS.neutral}" opacity="0.3" />
    <path d="M200 300 L100 330 L300 270" stroke="${COLORS.gold}" stroke-width="12" />
    <circle cx="100" cy="330" r="30" fill="${COLORS.white}" opacity="0.8" />
    <text x="85" y="340" fill="black" font-size="12" font-weight="bold">Small Capital</text>
    <rect x="250" y="200" width="80" height="80" fill="${COLORS.gold}" />
    <text x="255" y="245" fill="black" font-size="12" font-weight="bold">Large Exposure</text>
  `,
  // 3. Margin (Vault/Collateral)
  'margin': `
    <rect x="100" y="100" width="200" height="200" rx="20" stroke="${COLORS.gold}" stroke-width="8" fill="none" />
    <circle cx="200" cy="200" r="40" stroke="${COLORS.gold}" stroke-width="4" fill="none" />
    <path d="M180 200 L220 200 M200 180 L200 220" stroke="${COLORS.gold}" stroke-width="4" />
    <rect x="130" y="320" width="140" height="20" fill="${COLORS.neutral}" rx="10" />
    <rect x="130" y="320" width="40" height="20" fill="${COLORS.bear}" rx="10" />
    <text x="130" y="360" fill="${COLORS.bear}" font-size="14">Used Margin</text>
  `,
  // 4. Spread (Bid/Ask Gap)
  'spread': `
    <line x1="50" y1="150" x2="350" y2="150" stroke="${COLORS.bear}" stroke-width="4" stroke-dasharray="8" />
    <text x="50" y="130" fill="${COLORS.bear}" font-weight="bold">Sell (Bid)</text>
    <line x1="50" y1="250" x2="350" y2="250" stroke="${COLORS.bull}" stroke-width="4" stroke-dasharray="8" />
    <text x="50" y="280" fill="${COLORS.bull}" font-weight="bold">Buy (Ask)</text>
    <path d="M300 150 L300 250" stroke="${COLORS.gold}" stroke-width="8" marker-start="url(#arrow)" marker-end="url(#arrow)" />
    <text x="315" y="210" fill="${COLORS.gold}" font-weight="bold">SPREAD</text>
  `,
  // 5. Fibonacci
  'fibonacci': `
    <line x1="50" y1="100" x2="350" y2="300" stroke="${COLORS.white}" stroke-width="2" opacity="0.3" />
    <line x1="50" y1="300" x2="350" y2="300" stroke="${COLORS.gold}" stroke-width="2" />
    <text x="360" y="305" fill="${COLORS.gold}">0%</text>
    <line x1="50" y1="223.6" x2="350" y2="223.6" stroke="${COLORS.gold}" stroke-width="2" opacity="0.8" />
    <text x="360" y="228.6" fill="${COLORS.gold}">38.2%</text>
    <line x1="50" y1="200" x2="350" y2="200" stroke="${COLORS.gold}" stroke-width="4" />
    <text x="360" y="205" fill="${COLORS.gold}" font-weight="bold">50.0%</text>
    <line x1="50" y1="176.4" x2="350" y2="176.4" stroke="${COLORS.gold}" stroke-width="2" opacity="0.8" />
    <text x="360" y="181.4" fill="${COLORS.gold}">61.8%</text>
    <line x1="50" y1="100" x2="350" y2="100" stroke="${COLORS.gold}" stroke-width="2" />
    <text x="360" y="105" fill="${COLORS.gold}">100%</text>
  `,
  // 6. Risk Management (1% Rule)
  'risk-management': `
    <circle cx="200" cy="200" r="150" fill="none" stroke="${COLORS.white}" stroke-width="2" opacity="0.2" />
    <path d="M200 200 L200 50 A150 150 0 0 1 205 51 Z" fill="${COLORS.bear}" />
    <circle cx="200" cy="200" r="10" fill="${COLORS.white}" />
    <text x="210" y="40" fill="${COLORS.bear}" font-weight="bold" font-size="24">1% RISK</text>
    <path d="M120 120 L280 280" stroke="${COLORS.white}" stroke-width="1" opacity="0.5" />
    <text x="150" y="300" fill="${COLORS.neutral}">Capital Preservation</text>
  `,
  // 7. Copy Trading
  'copytrading': `
    <circle cx="200" cy="100" r="40" fill="${COLORS.gold}" />
    <text x="175" y="105" fill="black" font-weight="bold">MASTER</text>
    <path d="M120 250 L180 140" stroke="${COLORS.gold}" stroke-width="2" stroke-dasharray="4" marker-end="url(#arrow)" />
    <path d="M280 250 L220 140" stroke="${COLORS.gold}" stroke-width="2" stroke-dasharray="4" marker-end="url(#arrow)" />
    <circle cx="100" cy="280" r="25" fill="${COLORS.neutral}" />
    <circle cx="200" cy="320" r="25" fill="${COLORS.neutral}" />
    <circle cx="300" cy="280" r="25" fill="${COLORS.neutral}" />
  `,
  // 8. Gold Spec (Gold Bars)
  'gold-spec': `
    <rect x="100" y="200" width="200" height="80" fill="${COLORS.gold}" rx="5" />
    <rect x="120" y="140" width="160" height="60" fill="${COLORS.gold}" opacity="0.8" rx="5" />
    <rect x="150" y="90" width="100" height="50" fill="${COLORS.gold}" opacity="0.6" rx="5" />
    <text x="165" y="245" fill="black" font-weight="bold" font-size="20">999.9 GOLD</text>
  `,
  // 9. Stop Loss
  'stoploss': `
    <path d="M50 100 L150 150 L250 120 L350 180" stroke="${COLORS.neutral}" stroke-width="4" fill="none" />
    <line x1="50" y1="200" x2="350" y2="200" stroke="${COLORS.bear}" stroke-width="6" stroke-dasharray="10" />
    <text x="60" y="230" fill="${COLORS.bear}" font-weight="bold">STOP LOSS EXIT</text>
    <circle cx="350" cy="180" r="10" fill="${COLORS.neutral}" />
    <path d="M350 180 L350 300" stroke="${COLORS.bear}" stroke-width="2" marker-end="url(#arrow)" />
  `,
  // 11. Technical Analysis (Chart/Magnifier)
  'tech-analysis': `
    <rect x="50" y="250" width="80" height="100" fill="${COLORS.bull}" />
    <rect x="150" y="150" width="80" height="200" fill="${COLORS.bull}" />
    <rect x="250" y="200" width="80" height="150" fill="${COLORS.bear}" />
    <circle cx="230" cy="180" r="60" stroke="${COLORS.gold}" stroke-width="6" fill="none" />
    <line x1="270" y1="220" x2="330" y2="280" stroke="${COLORS.gold}" stroke-width="12" stroke-linecap="round" />
  `,
  // 12. Scam Prevention (Shield/Danger)
  'scam-prevention': `
    <path d="M200 50 L320 100 V200 C320 280 200 350 200 350 C200 350 80 280 80 200 V100 L200 50" stroke="${COLORS.bear}" stroke-width="8" fill="none" />
    <text x="180" y="240" fill="${COLORS.bear}" font-size="80" font-weight="bold">!</text>
    <text x="130" y="150" fill="${COLORS.bear}" font-weight="bold">SCAM ALERT</text>
  `,
  // 10. Automated Trading (EA)
  'ea-logic': `
    <rect x="100" y="100" width="200" height="200" rx="20" fill="none" stroke="${COLORS.gold}" stroke-width="4" />
    <path d="M150 150 L250 150 M150 200 L250 200 M150 250 L250 250" stroke="${COLORS.gold}" stroke-width="2" />
    <circle cx="200" cy="150" r="5" fill="${COLORS.gold}" />
    <rect x="120" y="80" width="40" height="20" fill="${COLORS.gold}" />
    <text x="310" y="200" fill="${COLORS.gold}" font-family="monospace">IF (RSI < 30) BUY;</text>
  `
};

function generateSVG(name, content) {
  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="${COLORS.gold}" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="400" height="400" fill="${COLORS.bg}" />
      <g filter="url(#glow)">
        ${content}
      </g>
    </svg>
  `;
  writeFileSync(join(OUTPUT_DIR, `${name}.svg`), svg);
  console.log(`Generated ${name}.svg`);
}

Object.entries(templates).forEach(([name, content]) => generateSVG(name, content));
console.log('All educational SVGs generated in public/images/patterns/');
