import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';
import { parse } from 'csv-parse/sync';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// 1. Firebase & Gemini 설정
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
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); // 비용 최적화 및 최신 모델 반영

// 2. 파일 경로 설정 (사용자님은 .env.local에 TICK_DATA_PATH를 설정해주세요)
const TICK_FILE_PATH = process.env.TICK_DATA_PATH || "C:/Users/Public/treia_gold_ticks.csv";

console.log(`📡 Treia Tick Bridge 엔진 가동... 감시 중: ${TICK_FILE_PATH}`);

// 3. AI 분석 및 Firestore 전송 함수 (세션 모멘텀 가중치 포함)
async function analyzeAndStore(ticks: any[]) {
  try {
    const kstNow = new Date(new Date().getTime() + (9 * 60 * 60 * 1000)); // KST 기준
    const hour = kstNow.getHours();
    
    // 세션 국면 판별 (대외비 로직 기반, 명칭은 중립적)
    let sessionPhase = "Normal";
    if (hour >= 8 && hour < 10) sessionPhase = "Phase_A_Initial"; // 아시아 시가
    else if (hour >= 15 && hour < 17) sessionPhase = "Phase_Neutral_Gap"; // 유럽 전 휴식기
    else if (hour >= 17 && hour < 19) sessionPhase = "Phase_E_Initial"; // 유럽 시가
    else if (hour >= 21 && hour < 23) sessionPhase = "Phase_U_Initial"; // 미국 시가 (강력)

    const prompt = `
      너는 전 세계에서 가장 정교한 골드(XAUUSD) 트레이딩 분석 AI야. 
      [시장 상황]: 현재 골드는 $5,200~$5,300 사이의 역사적 신고가 부근에서 거래 중임. (초강세장)
      [시장 국면]: ${sessionPhase} (데이터 기반 내부 가중치 적용됨)
      [최근 틱 흐름]:
      ${JSON.stringify(ticks.slice(-30))}

      분석 가이드라인:
      - 현재 $5,200 상단에서의 매수세 유지력과 세력의 이익 실현(Profit Taking) 매물을 감별하라.
      - 틱의 체결 밀도와 가격 변화의 기울기를 확인해라.
      - 5분 이내의 단기 추진력을 예측하라.

      응답 JSON:
      {"sentiment": "매수우위/매도우위/횡보", "intensity": 0~100, "reason": "전문적 분석 근거", "signal": "BUY/SELL/WAIT"}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text().trim();
    const analysisJson = JSON.parse(analysisText.replace(/```json|```/g, ""));

    // Firestore 저장 (프리픽스 적용)
    await addDoc(collection(db, 'treia_tick_analysis'), {
      ...analysisJson,
      phase: sessionPhase,
      rawTicksCount: ticks.length,
      timestamp: Timestamp.now()
    });

    console.log(`🤖 AI [${sessionPhase}] 분석 완료: ${analysisJson.sentiment} (${analysisJson.intensity}%)`);
  } catch (error) {
    console.error("❌ AI 분석 중 에러:", error);
  }
}

// 4. 파일 감시 로직
let isProcessing = false;
chokidar.watch(TICK_FILE_PATH).on('change', async () => {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const fileContent = fs.readFileSync(TICK_FILE_PATH, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    if (records.length % 50 === 0) { // 50틱마다 한 번씩 AI 분석 (성능/비용 조절)
      console.log(`📈 틱 누적됨 (${records.length}개), AI 분석 요청 중...`);
      await analyzeAndStore(records);
    }
  } catch (error) {
    console.error("❌ 파일 읽기 에러:", error);
  } finally {
    isProcessing = false;
  }
});
