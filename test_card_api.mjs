const API_KEY =
	"2bb8598d5b4ef8adba2cff0deba81e882b560351ddb6987d2d933945af968b32";

async function testIBK() {
	console.log("--- Testing IBK Card Info ---");
	const url = `http://apis.data.go.kr/1210000/CardInfoService/getCardInfo?serviceKey=${API_KEY}&pageNo=1&numOfRows=5&_type=json`;
	try {
		const res = await fetch(url);
		const data = await res.json();
		console.log("IBK Result:", JSON.stringify(data).substring(0, 500));
	} catch (e) {
		console.error("IBK Error:", e.message);
	}
}

async function testKDB() {
	console.log("\n--- Testing KDB Card Info ---");
	const url = `http://apis.data.go.kr/15085690/v1/cardProductInfo?serviceKey=${API_KEY}&pageNo=1&perPage=5`;
	try {
		const res = await fetch(url);
		const data = await res.json();
		console.log("KDB Result:", JSON.stringify(data).substring(0, 500));
	} catch (e) {
		console.error("KDB Error:", e.message);
	}
}

async function run() {
	await testIBK();
	await testKDB();
}

run();
