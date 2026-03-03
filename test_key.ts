import { getQuote } from './lib/finnhub';
const key = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "";
console.log(`Key loaded: ${key.substring(0, 4)}...`);

async function test() {
  const symbols = ['BINANCE:BTCUSDT', 'GLD', 'QQQ', 'AAPL'];
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
