import { getQuote } from './lib/finnhub';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  const symbols = ['XAUUSD', 'FOREX:XAU/USD', 'OANDA:XAU_USD', 'GC=F', 'QQQ', 'BTCUSD'];
  for (const sym of symbols) {
    const quote = await getQuote(sym);
    if (quote) {
      console.log(`${sym}: ${quote.c}`);
    } else {
      console.log(`${sym}: FAILED`);
    }
  }
}
test();
