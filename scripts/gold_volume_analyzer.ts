import { parse } from "csv-parse";
import * as dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import {
	addDoc,
	collection,
	getFirestore,
	Timestamp,
} from "firebase/firestore";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "treia");

const INPUT_FILE =
	"c:/work/AI 리더캠프/projects/treia/treia_gold_m1_history.csv"; // 우선 M1부터 분석
const volumeProfile: Record<number, number> = {};

console.log("📊 골드 매물대(Volume Profile) 분석 시작...");

const stream = fs.createReadStream(INPUT_FILE).pipe(
	parse({
		delimiter: "\t", // 보내주신 데이터가 탭 구분자로 되어 있음
		columns: true,
		skip_empty_lines: true,
	}),
);

let processCount = 0;

stream.on("data", (row: any) => {
	// <CLOSE> 가격 기준으로 1달러 단위 매물대 그룹화
	const price = Math.round(parseFloat(row["<CLOSE>"]));
	const vol = parseInt(row["<TICKVOL>"]) || 1;

	if (!isNaN(price)) {
		volumeProfile[price] = (volumeProfile[price] || 0) + vol;
	}

	processCount++;
	if (processCount % 50000 === 0) {
		console.log(`📈 ${processCount}개 데이터 처리 중...`);
	}
});

stream.on("end", async () => {
	console.log("✅ 데이터 분석 완료! 가장 강력한 매물대(POC) 추출 중...");

	// 상위 20개 핵심 매물대 추출
	const sortedProfile = Object.entries(volumeProfile)
		.map(([price, vol]) => ({ price: parseFloat(price), volume: vol }))
		.sort((a, b) => b.volume - a.volume)
		.slice(0, 20);

	try {
		// Firestore 저장
		await addDoc(collection(db, "treia_volume_profile"), {
			baseAsset: "XAUUSD(Gold)",
			topLevels: sortedProfile,
			analyzedAt: Timestamp.now(),
			dataPeriod: "Latest History (M1)",
			source: "Hantech MT5",
		});

		console.log(
			"🚀 AI 핵심 매물대 데이터를 Firestore에 성공적으로 전송했습니다!",
		);
		console.log("🔥 주력 매물대(TOP 3):");
		sortedProfile.slice(0, 3).forEach((p, i) => {
			console.log(`   ${i + 1}위: $${p.price} (거래량: ${p.volume})`);
		});
		process.exit(0);
	} catch (e) {
		console.error("❌ Firestore 전송 에러:", e);
		process.exit(1);
	}
});
