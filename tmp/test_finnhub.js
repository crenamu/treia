
const API_KEY = "d6h8d7pr01qnjncnnue0d6h8d7pr01qnjncnnueg";
async function test() {
    const today = new Date()
    const from = today.toISOString().split('T')[0]
    const to = new Date(today.setDate(today.getDate() + 7))
      .toISOString().split('T')[0]
    
    const url = `https://finnhub.io/api/v1/calendar/economic?from=${from}&to=${to}&token=${API_KEY}`;
    console.log("Fetching:", url);
    const res = await fetch(url);
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", JSON.stringify(data, null, 2).substring(0, 1000));
}
test();
