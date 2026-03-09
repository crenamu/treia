import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'patterns');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Helper to create an SVG structure
const createSvg = (content) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" style="background-color: transparent;">
  <!-- Grid -->
  <line x1="0" y1="100" x2="200" y2="100" stroke="#334155" stroke-width="1" stroke-dasharray="4" opacity="0.5" />
  <line x1="100" y1="0" x2="100" y2="200" stroke="#334155" stroke-width="1" stroke-dasharray="4" opacity="0.5" />
  ${content}
</svg>`;

// Colors
const UP_COLOR = '#10B981'; // Tailwind emerald-500
const DOWN_COLOR = '#EF4444'; // Tailwind red-500

const patterns = {
  'doji.svg': createSvg(`
    <!-- Doji (Open and Close are almost identical) -->
    <!-- Wick -->
    <line x1="100" y1="40" x2="100" y2="160" stroke="#F59E0B" stroke-width="3" />
    <!-- Body -->
    <rect x="85" y="98" width="30" height="4" fill="#F59E0B" />
  `),
  'bullish-engulfing.svg': createSvg(`
    <!-- Small Bearish Candle -->
    <line x1="60" y1="80" x2="60" y2="130" stroke="${DOWN_COLOR}" stroke-width="2" />
    <rect x="50" y="90" width="20" height="30" fill="${DOWN_COLOR}" />
    
    <!-- Large Bullish Candle engulfing the previous one -->
    <line x1="140" y1="40" x2="140" y2="150" stroke="${UP_COLOR}" stroke-width="2" />
    <rect x="125" y="50" width="30" height="90" fill="${UP_COLOR}" />
  `),
  'bearish-engulfing.svg': createSvg(`
    <!-- Small Bullish Candle -->
    <line x1="60" y1="70" x2="60" y2="120" stroke="${UP_COLOR}" stroke-width="2" />
    <rect x="50" y="80" width="20" height="30" fill="${UP_COLOR}" />
    
    <!-- Large Bearish Candle engulfing the previous one -->
    <line x1="140" y1="30" x2="140" y2="140" stroke="${DOWN_COLOR}" stroke-width="2" />
    <rect x="125" y="40" width="30" height="90" fill="${DOWN_COLOR}" />
  `),
  'hammer.svg': createSvg(`
    <!-- Hammer (Long lower wick, small body at the top) -->
    <line x1="100" y1="50" x2="100" y2="150" stroke="${UP_COLOR}" stroke-width="3" />
    <rect x="85" y="50" width="30" height="25" fill="${UP_COLOR}" />
  `),
  'morning-star.svg': createSvg(`
    <!-- Large Bearish Candle -->
    <line x1="40" y1="40" x2="40" y2="130" stroke="${DOWN_COLOR}" stroke-width="2" />
    <rect x="25" y="50" width="30" height="70" fill="${DOWN_COLOR}" />
    
    <!-- Small Doji/Star at the bottom -->
    <line x1="100" y1="140" x2="100" y2="170" stroke="#F59E0B" stroke-width="2" />
    <rect x="90" y="152" width="20" height="6" fill="#F59E0B" />
    
    <!-- Large Bullish Candle -->
    <line x1="160" y1="50" x2="160" y2="140" stroke="${UP_COLOR}" stroke-width="2" />
    <rect x="145" y="60" width="30" height="70" fill="${UP_COLOR}" />
  `),
};

Object.entries(patterns).forEach(([filename, content]) => {
  const filePath = path.join(OUT_DIR, filename);
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log('Created ' + filePath);
});
