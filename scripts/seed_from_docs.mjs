/**
 * seed_from_docs.mjs
 * _docs_backup 폴더의 MD 파일을 직접 파싱하여 Firestore에 전체 내용 주입
 * 실행: node scripts/seed_from_docs.mjs
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ─── 데이터베이스 초기화 ─────────────────────────
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'treia');


// ─── 이미지 풀 설정 (사용자 요청에 따라 부적절한 이미지 배제 및 트레이딩 특화) ─────────────────────────
// ─── 이미지 풀 설정 (사용자 요청에 따라 부수적인 이미지 배제 및 트레이딩 특화) ─────────────────────────
const tradingUnsplashIds = [
  "tL9NpBM0KhY", "wOZrO7b4Ln0", "tcJ6sJTtTWI", "vFhsyAMbHkE", "zcAgxLryKe4", 
  "GnWfl_nnZro", "RIQa-DDmC70", "AWXIZmzOrQo", "3PyBkxgTiL0", "wKmUYWs9SjU", 
  "5o7ctLp7rwE", "Am7fjB3xTKE", "INLOCRTv7Es", "I8Gfv244hzA", "H5Rk4BMWJ9U", 
  "fiXLQXAhCfk", "sM4r-swmcoY", "vBCVcWUyvyM", "oqStl2L5oxI", "sm3Ub_IJKQg", 
  "D4LDw5eXhgg", "AUZC0Fybqu8", "z0gszFk1tYk", "9rz5x8LGBb8", "N__BnvQ_w18", 
  "VTKtPMDouBw", "Q_vhJv5im-8", "RxbkUG80Rag", "eNStVITP_10", "x07ELaNFt34", 
  "mswEr8ji6BQ", "Wb63zqJ5gnE", "oSmxBx08YJw", "yBIvVaFNWjU", "O5yeor6_3sc", 
  "XqvAjEJGOO4", "AA5sf7WTv10", "UKVTkmdjva0", "InWI1lteYfU", "MyRHFbfRI0Q", 
  "LWD60a5a15I", "pqo44QZBKbo", "i09DzZkwnuY", "tGJiVNlMOYI", "XihAgOYNHn4", 
  "nbWW-5XdKvE", "VM_6EtTAfDQ", "SGrjUUtEIng", "44ls9V31hPc", "b-qYIqLTif0"
];

// 전문 시각화 SVG 매핑 (세분화)
const PATTERN_IMAGES = {
  // 캔들 패턴
  "캔들스틱 기초": "/images/patterns/candle-ohlc.svg",
  "주요 캔들 패턴": "/images/patterns/candle-ohlc.svg",
  "도지": "/images/patterns/doji.svg",
  "망치형": "/images/patterns/hammer.svg",
  "샛별형": "/images/patterns/morning-star.svg",
  "장악형": "/images/patterns/bullish-engulfing.svg",
  
  // 거래 기초
  "CFD": "/images/patterns/cfd.svg",
  "레버리지": "/images/patterns/leverage.svg",
  "마진": "/images/patterns/margin.svg",
  "증거금": "/images/patterns/margin.svg",
  "스프레드": "/images/patterns/spread.svg",
  "수수료": "/images/patterns/spread.svg",
  "스왑": "/images/patterns/spread.svg",
  
  // 분석 및 도구
  "피보나치": "/images/patterns/fibonacci.svg",
  "추세": "/images/patterns/tech-analysis.svg",
  "이동평균선": "/images/patterns/golden-cross.svg",
  "지지와 저항": "/images/patterns/breakout-up.svg",
  "매물대": "/images/patterns/tech-analysis.svg",
  
  // 리스크 및 자동매매
  "리스크": "/images/patterns/risk-management.svg",
  "자금 관리": "/images/patterns/risk-management.svg",
  "손절": "/images/patterns/stoploss.svg",
  "스탑로스": "/images/patterns/stoploss.svg",
  "자동매매(EA)란": "/images/patterns/ea-logic.svg",
  "로직": "/images/patterns/ea-logic.svg",
  "백테스트": "/images/patterns/ea-logic.svg",
  
  // 기타전문
  "골드": "/images/patterns/gold-spec.svg",
  "카피트레이딩": "/images/patterns/copytrading.svg",
  "브로커": "/images/patterns/margin.svg",
  "사기": "/images/patterns/scam-prevention.svg",
  "주의사항": "/images/patterns/scam-prevention.svg"
};

/**
 * 아티클 본문 내 SVG 자동 삽입 로직
 */
function injectInlineVisuals(body, title) {
  let finalBody = body;
  const visuals = [
    { key: "캔들", path: "/images/patterns/candle-ohlc.svg", alt: "캔들 구조 분석" },
    { key: "돌파", path: "/images/patterns/breakout-up.svg", alt: "저항선 상향 돌파 시나리오" },
    { key: "교차", path: "/images/patterns/golden-cross.svg", alt: "이평선 골든크로스 시그널" },
    { key: "RSI", path: "/images/patterns/tech-analysis.svg", alt: "RSI 과매수/과매도 지표" },
    { key: "리스크", path: "/images/patterns/risk-management.svg", alt: "리스크 관리 매트릭스" },
    { key: "골드", path: "/images/patterns/gold-spec.svg", alt: "XAUUSD 거래 사양" }
  ];

  for (const v of visuals) {
    if (body.includes(v.key) || title.includes(v.key)) {
      const paragraphs = body.split("\n\n");
      if (paragraphs.length >= 2) {
        paragraphs[1] = `${paragraphs[1]}\n\n![${v.alt}](${v.path})\n`;
        finalBody = paragraphs.join("\n\n");
        break;
      }
    }
  }
  return finalBody;
}

function getImageUrlForSection(title, categoryName, sectionId) {
  // 제목에 정확히 매칭되는 패턴이 있는지 먼저 확인
  for (const [key, path] of Object.entries(PATTERN_IMAGES)) {
    if (title.includes(key)) return path;
  }

  // 중복을 완전히 피하기 위해 sectionId를 해시 시드에 포함
  let hash = 0;
  const seed = title + categoryName + sectionId + "premium_v2";
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const idx = Math.abs(hash) % tradingUnsplashIds.length;
  const photoId = tradingUnsplashIds[idx];
  return `https://images.unsplash.com/photo-${photoId}?q=80&w=800&auto=format&fit=crop`;
}

/**
 * MD 파일을 읽어 ## 섹션별로 분리
 */
function parseMarkdownSections(filePath, categoryName) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const articles = [];
  let currentId = null;
  let currentTitle = null;
  let currentLines = [];

  for (const line of lines) {
    // ## X-X. 제목 패턴 매칭
    const match = line.match(/^##\s+(\d+-\d+)\.\s+(.+)/);
    if (match) {
      // 이전 섹션 저장
      if (currentId && currentTitle && currentLines.length > 0) {
        const body = currentLines.join("\n").trim();
        const finalBody = injectInlineVisuals(body, currentTitle);
        const excerpt = extractExcerpt(body);
        articles.push({
          sectionId: currentId,
          title: `[${categoryName}] ${currentTitle}`,
          category: categoryName,
          content: finalBody,
          excerpt,
          thumbnail: getImageUrlForSection(currentTitle, categoryName, currentId),
          difficulty: inferDifficulty(currentId),
        });
      }
      currentId = match[1];
      currentTitle = match[2].trim();
      currentLines = [];
    } else if (currentId) {
      // 푸터 라인 제외
      if (line.startsWith("*© 2026") || line.startsWith("---") && currentLines.length === 0) continue;
      currentLines.push(line);
    }
  }

  // 마지막 섹션 저장
  if (currentId && currentTitle && currentLines.length > 0) {
    const body = currentLines.join("\n").trim();
    const finalBody = injectInlineVisuals(body, currentTitle);
    const excerpt = extractExcerpt(body);
    articles.push({
      sectionId: currentId,
      title: `[${categoryName}] ${currentTitle}`,
      category: categoryName,
      content: finalBody,
      excerpt,
      thumbnail: getImageUrlForSection(currentTitle, categoryName, currentId),
      difficulty: inferDifficulty(currentId),
    });
  }

  return articles;
}

function extractExcerpt(content) {
  // 첫 번째 단락 텍스트 추출 (코드블록, 헤더 제외)
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("```") && !trimmed.startsWith(">") && !trimmed.startsWith("|") && trimmed.length > 20) {
      return trimmed.slice(0, 120) + (trimmed.length > 120 ? "..." : "");
    }
  }
  return "트레이아 아카데미 전문 교육 콘텐츠";
}

function inferDifficulty(sectionId) {
  const catNum = parseInt(sectionId.split("-")[0]);
  const secNum = parseInt(sectionId.split("-")[1]);
  if (catNum === 8) return "초급";
  if (catNum === 4 && secNum <= 3) return "초급";
  if (catNum === 1 && secNum <= 5) return "입문";
  if (catNum === 6 && secNum <= 2) return "입문";
  if (catNum === 7 && secNum <= 2) return "입문";
  if (secNum >= 5) return "고급";
  return "중급";
}

async function deleteAllExisting(db) {
  console.log("🗑️  기존 데이터 삭제 중...");
  const q = query(collection(db, "treia_education"), where("app", "==", "treia"));
  const snap = await getDocs(q);
  const delPromises = snap.docs.map((d) => deleteDoc(doc(db, "treia_education", d.id)));
  await Promise.all(delPromises);
  console.log(`   ${snap.docs.length}개 삭제 완료`);
}

async function main() {
  await deleteAllExisting(db);

  // 파일 목록: [파일경로, 카테고리명]
  const docFiles = [
    ["_docs_backup/cat1_CFD기초.md", "CFD 기초"],
    ["_docs_backup/cat2345_7_나머지콘텐츠.md", "mixed"],
    ["_docs_backup/cat6_카피트레이딩_가이드.md", "카피트레이딩"],
    ["_docs_backup/cat8_사기예방_주의사항.md", "사기 예방"],
    ["_docs_backup/교육컨텐츠_추가콘텐츠_완성.md", "mixed"],
  ];

  // mixed 파일에서 카테고리 자동 감지하는 매핑
  const catNumberToName = {
    "2": "골드 특화",
    "3": "기술적 분석",
    "4": "리스크 관리",
    "5": "자동매매",
    "6": "카피트레이딩",
    "7": "브로커",
    "8": "사기 예방",
  };

  let allArticles = [];
  let totalInserted = 0;

  for (const [relPath, categoryName] of docFiles) {
    const filePath = join(rootDir, relPath);
    let articles;
    
    if (categoryName === "mixed") {
      // mixed 파일은 섹션 번호로 카테고리 자동 감지
      const content = readFileSync(filePath, "utf-8");
      const lines = content.split("\n");
      let currentId = null;
      let currentTitle = null;
      let currentLines = [];
      let currentCat = null;
      
      for (const line of lines) {
        // 카테고리 헤더 감지
        const catMatch = line.match(/^#\s+카테고리\s+(\d+)/);
        if (catMatch) {
          currentCat = catNumberToName[catMatch[1]] || "기타";
          continue;
        }
        
        const match = line.match(/^##\s+(\d+-\d+)\.\s+(.+)/);
        if (match) {
          if (currentId && currentTitle && currentLines.length > 0) {
            const body = currentLines.join("\n").trim();
            const finalBody = injectInlineVisuals(body, currentTitle);
              allArticles.push({
                sectionId: currentId,
                title: `[${currentCat}] ${currentTitle}`,
                category: currentCat,
                content: finalBody,
                excerpt: extractExcerpt(body),
                thumbnail: getImageUrlForSection(currentTitle, currentCat, currentId),
                difficulty: inferDifficulty(currentId),
              });
          }
          // 이전에 섹션 번호로 카테고리 결정
          const catNum = match[1].split("-")[0];
          if (!currentCat) currentCat = catNumberToName[catNum] || "기타";
          currentId = match[1];
          currentTitle = match[2].trim();
          currentLines = [];
        } else if (currentId) {
          if (line.startsWith("*© 2026")) continue;
          currentLines.push(line);
        }
      }
      // 마지막 섹션
      if (currentId && currentTitle && currentLines.length > 0) {
        const body = currentLines.join("\n").trim();
        const finalBody = injectInlineVisuals(body, currentTitle);
        const catNum = currentId.split("-")[0];
        const cat = currentCat || catNumberToName[catNum] || "기타";
        allArticles.push({
          sectionId: currentId,
          title: `[${cat}] ${currentTitle}`,
          category: cat,
          content: finalBody,
          excerpt: extractExcerpt(body),
          thumbnail: getImageUrlForSection(currentTitle, cat, currentId),
          difficulty: inferDifficulty(currentId),
        });
      }
    } else {
      articles = parseMarkdownSections(filePath, categoryName, "");
      allArticles.push(...articles);
    }
  }

  // 중복 제거 (sectionId 기준)
  const seen = new Set();
  const unique = allArticles.filter(a => {
    if (seen.has(a.sectionId)) return false;
    seen.add(a.sectionId);
    return true;
  });

  console.log(`\n📚 총 ${unique.length}개 아티클 삽입 시작...\n`);

  for (const article of unique) {
    await addDoc(collection(db, "treia_education"), {
      title: article.title,
      category: article.category,
      content: article.content,
      excerpt: article.excerpt,
      thumbnail: article.thumbnail,
      difficulty: article.difficulty,
      app: "treia",
      isPublished: true,
      source: "Treia Academy",
      sectionId: article.sectionId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`  ✅ [${article.sectionId}] ${article.title}`);
    totalInserted++;
  }

  console.log(`\n🎉 완료! 총 ${totalInserted}개 아티클이 Firestore에 저장되었습니다.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ 오류:", err);
  process.exit(1);
});
