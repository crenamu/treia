async function test() {
  const symbols = ['XAUUSD=X', '^NDX', 'BTC-USD'];
  console.log('--- Yahoo Finance Test ---');
  for (const sym of symbols) {
    try {
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1m&range=1d`);
      const data = await res.json();
      const meta = data.chart.result[0].meta;
      console.log(`${sym}: ${meta.regularMarketPrice} (${meta.previousClose})`);
    } catch (e) {
      console.error(`Error for ${sym}:`, e);
    }
  }
  console.log('--- End ---');
}

test();
