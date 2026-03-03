// test_symbols.js
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

async function testSymbols() {
    const symbols = [
        'OANDA:XAU_USD', // Gold
        'FX:XAUUSD',     // Gold Alt
        'BINANCE:BTCUSDT', // Bitcoin
        'QQQ',           // Nasdaq Proxy (ETF)
        'AAPL'           // Stock Test
    ];

    console.log(`Testing with API Key: ${API_KEY ? 'Present' : 'Missing'}`);

    for (const symbol of symbols) {
        try {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
            const data = await response.json();
            console.log(`Symbol: ${symbol} ->`, data.c ? `Price: ${data.c}` : `Error/No Data: ${JSON.stringify(data)}`);
        } catch (err) {
            console.error(`Failed to fetch ${symbol}:`, err.message);
        }
    }
}

testSymbols();
