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


// ─── 이미지 관리 로직 ─────────────────────────

// 카테고리별 이미지 (실제 확인된 Unsplash Public ID)
// picsum.photos 기반으로 전환 - 무조건 로드 보장, ID = 이미지 번호, 중복 없음
let uniqueImageId = Math.floor(Math.random() * 10000);

function getImageUrlForSection(category) {
  uniqueImageId++;
  return `https://picsum.photos/seed/treia_edu_${uniqueImageId}/800/500`;
}

const PATTERN_BODY_VISUALS = [
  { key: "장악형", path: "/images/patterns/bullish-engulfing.svg", alt: "상승 장악형 패턴" },
  { key: "하락 장악", path: "/images/patterns/bearish-engulfing.svg", alt: "하락 장악형 패턴" },
  { key: "돌파", path: "/images/patterns/breakout-up.svg", alt: "저항선 상향 돌파 시나리오" },
  { key: "캔들", path: "/images/patterns/candle-ohlc.svg", alt: "캔들 구조 분석" },
  { key: "CFD", path: "/images/patterns/cfd.svg", alt: "CFD의 구조" },
  { key: "카피", path: "/images/patterns/copytrading.svg", alt: "카피트레이딩 알고리즘" },
  { key: "도지", path: "/images/patterns/doji.svg", alt: "도지(Doji) 패턴" },
  { key: "자동", path: "/images/patterns/ea-logic.svg", alt: "EA 자동매매 로직" },
  { key: "피보나치", path: "/images/patterns/fibonacci.svg", alt: "피보나치 되돌림" },
  { key: "골드", path: "/images/patterns/gold-spec.svg", alt: "XAUUSD 골드 특성" },
  { key: "크로스", path: "/images/patterns/golden-cross.svg", alt: "골든크로스" },
  { key: "망치", path: "/images/patterns/hammer.svg", alt: "망치형 패턴" },
  { key: "레버리지", path: "/images/patterns/leverage.svg", alt: "레버리지 원리" },
  { key: "마진", path: "/images/patterns/margin.svg", alt: "마진 콜 기준" },
  { key: "샛별", path: "/images/patterns/morning-star.svg", alt: "샛별형 캔들" },
  { key: "리스크", path: "/images/patterns/risk-management.svg", alt: "리스크 관리 기법" },
  { key: "사기", path: "/images/patterns/scam-prevention.svg", alt: "스캠 방지책" },
  { key: "스프레드", path: "/images/patterns/spread.svg", alt: "스프레드 메커니즘" },
  { key: "스탑", path: "/images/patterns/stoploss.svg", alt: "스탑로스 설정" },
  { key: "RSI", path: "/images/patterns/tech-analysis.svg", alt: "기술적 분석 지표" }
];

const usedSvgs = new Set();

function injectInlineVisuals(body, title) {
  // 1순위: 가장 정확한 매칭 (문서의 제목에 핵심 키워드가 있는 경우 최우선 할당)
  for (const v of PATTERN_BODY_VISUALS) {
    if (!usedSvgs.has(v.path) && title.includes(v.key)) {
      usedSvgs.add(v.path);
      return applyVisual(body, v);
    }
  }

  // 2순위: 문맥 매칭 (본문 내 키워드가 여러 번(최소 2번 이상) 쓰인 핵심 주제인 경우)
  for (const v of PATTERN_BODY_VISUALS) {
    const occurCount = (body.split(v.key).length - 1);
    if (!usedSvgs.has(v.path) && occurCount >= 2) {
      usedSvgs.add(v.path);
      return applyVisual(body, v);
    }
  }

  return body;
}

function applyVisual(body, v) {
  const p = body.split("\n\n");
  if (p.length >= 2) {
    p[1] = `${p[1]}\n\n![${v.alt}](${v.path})\n`; 
    return p.join("\n\n");
  }
  return body + `\n\n![${v.alt}](${v.path})\n`;
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
          thumbnail: getImageUrlForSection(categoryName),
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
      thumbnail: getImageUrlForSection(categoryName),
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
                thumbnail: getImageUrlForSection(),
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
          thumbnail: getImageUrlForSection(),
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
