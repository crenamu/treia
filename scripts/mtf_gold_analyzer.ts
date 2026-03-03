import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, doc, setDoc } from 'firebase/firestore';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'treia');

interface TFData {
  file: string;
  label: string;
}

const FILES: TFData[] = [
  { file: "treia_gold_d_history.csv", label: "Daily" },
  { file: "treia_gold_h1_history.csv", label: "H1" },
  { file: "treia_gold_m2_history.csv", label: "M2" },
  { file: "treia_gold_m1_history.csv", label: "M1" },
];

async function processMTF() {
  console.log("💎 Treia Multi-Timeframe Gold 딥 분석 시작...");

  const summaryResults: any[] = [];

  for (const tf of FILES) {
    const filePath = path.resolve(process.cwd(), tf.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ ${tf.file} 파일이 없습니다.`);
      continue;
    }

    console.log(`📊 ${tf.label} 데이터 파싱 중...`);
    const fileContent = fs.readFileSync(filePath, 'utf-16le'); // MT5 Export는 보통 UTF-16LE
    
    // 탭 구분자 처리 및 파싱
    const records = parse(fileContent, {
      delimiter: '\t',
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true
    });

    // 매물대 분석
    const volumeProfile: Record<number, number> = {};
    records.forEach((row: any) => {
      const close = parseFloat(row["<CLOSE>"]);
      const vol = parseInt(row["<TICKVOL>"]) || 1;
      if (!isNaN(close)) {
        const rounded = Math.round(close);
        volumeProfile[rounded] = (volumeProfile[rounded] || 0) + vol;
      }
    });

    // 상위 10개 레벨 추출
    const topLevels = Object.entries(volumeProfile)
      .map(([price, vol]) => ({ price: parseFloat(price), volume: vol }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);

    const lastRecord = records[records.length - 1] as Record<string, any>;
    const result = {
      tf: tf.label,
      poc: topLevels[0]?.price || 0,
      levels: topLevels,
      count: records.length,
      lastDate: lastRecord ? (lastRecord["<DATE>"] || "Unknown") : "Unknown"
    };
    
    summaryResults.push(result);
  }

  // Firestore에 "전방위 매물대 지도" 저장
  try {
    await setDoc(doc(db, 'treia_market_intelligence', 'gold_mtf_analysis'), {
      asset: "XAUUSD",
      analysis: summaryResults,
      updatedAt: Timestamp.now(),
      status: "COMPLETED"
    });
    console.log("🚀 Multi-TF 분석 결과 Firestore 전송 완료!");
  } catch (e) {
    console.error("❌ 저장 실패:", e);
  }

  process.exit(0);
}

processMTF();
