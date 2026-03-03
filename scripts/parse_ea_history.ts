import fs from 'fs';
import * as cheerio from 'cheerio';

interface TradeRecord {
  time: string;
  orderId: string;
  symbol: string;
  type: string;
  volume: string;
  price: string;
  sl: string;
  tp: string;
  closeTime: string;
  closePrice: string;
  commission: string;
  swap: string;
  profit: string;
  strategy: string; // Hidden EA name
}

function parseMTHistory(filePath: string) {
  // MT5 HTML is typically UTF-16LE with BOM
  const rawHtml = fs.readFileSync(filePath, 'utf16le');
  const $ = cheerio.load(rawHtml);
  
  const trades: TradeRecord[] = [];
  
  // Find all rows with background colors typical of trade records
  $('tr[bgcolor="#FFFFFF"], tr[bgcolor="#F7F7F7"]').each((_, row) => {
    const cells = $(row).find('td');
    
    // We only want rows that have 14 columns (as per MT5 detail rows)
    if (cells.length === 14) {
      const type = $(cells[3]).text().trim();
      
      // Filter out balance/deposit rows, we only want buy/sell
      if (type === 'buy' || type === 'sell') {
        const strategy = $(row).find('td.hidden').text().trim();
        
        trades.push({
          time: $(cells[0]).text().trim(),
          orderId: $(cells[1]).text().trim(),
          symbol: $(cells[2]).text().trim(),
          type: type,
          strategy: strategy,
          volume: $(cells[5]).text().trim(), // Note: column indices shift because of hidden td colspan if we are not careful, but let's simply get it by index
          price: $(cells[6]).text().trim(), 
          sl: $(cells[7]).text().trim(),
          tp: $(cells[8]).text().trim(),
          closeTime: $(cells[9]).text().trim(),
          closePrice: $(cells[10]).text().trim(),
          commission: $(cells[11]).text().trim(),
          swap: $(cells[12]).text().trim(),
          profit: $(cells[13]).text().trim()
        });
      }
    }
  });

  return trades;
}

const historyPath = 'C:/work/AI 리더캠프/projects/treia/2603031330_trade history.html';
if (fs.existsSync(historyPath)) {
  const parsedTrades = parseMTHistory(historyPath);
  console.log(`✅ 파싱 완료: 총 ${parsedTrades.length}개의 거래 내역 추출`);
  console.log('최근 3건 샘플:', parsedTrades.slice(-3));
  
  const outPath = 'C:/work/AI 리더캠프/projects/treia/ea_history_parsed.json';
  fs.writeFileSync(outPath, JSON.stringify(parsedTrades, null, 2), 'utf-8');
  console.log(`💾 JSON 저장 완료: ${outPath}`);
} else {
  console.log('❌ 파일을 찾을 수 없습니다.');
}
