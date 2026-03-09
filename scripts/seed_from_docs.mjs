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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'treia');

// 카테고리별 썸네일 및 이미지 매핑 (금융 분야에 특화된 이미지)
const categoryMeta = {
  "CFD 기초": {
    thumbnail: "https://images.unsplash.com/photo-1611974714658-058f4c529944?q=80&w=800",
    defaultDifficulty: "입문",
  },
  "골드 특화": {
    thumbnail: "https://images.unsplash.com/photo-1610375461246-83df8dfb01d5?q=80&w=800",
    defaultDifficulty: "중급",
  },
  "기술적 분석": {
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800",
    defaultDifficulty: "중급",
  },
  "리스크 관리": {
    thumbnail: "https://images.unsplash.com/photo-1549421263-5ec394a5ad4c?q=80&w=800",
    defaultDifficulty: "초급",
  },
  "자동매매": {
    thumbnail: "https://images.unsplash.com/photo-1551288049-bbbda546697c?q=80&w=800",
    defaultDifficulty: "중급",
  },
  "카피트레이딩": {
    thumbnail: "https://images.unsplash.com/photo-1543286386-713bdd5486d3?q=80&w=800",
    defaultDifficulty: "입문",
  },
  "브로커": {
    thumbnail: "https://images.unsplash.com/photo-1590283603914-723bfca46917?q=80&w=800",
    defaultDifficulty: "입문",
  },
  "사기 예방": {
    thumbnail: "https://images.unsplash.com/photo-1554224155-1696413575b9?q=80&w=800",
    defaultDifficulty: "초급",
  },
};

// 섹션 번호와 주제에 따른 전문적인 이미지 매핑
// ─── 이미지 풀 설정 (고품질 트레이딩 & 금융 썸네일) ─────────────────────────
const unsplashIds = [
  "1611974789855-9c2a0a7236a3", "1590283603385-17ffb3a7f29f", "1620641788421-7a1c342ea42e", "1535320903710-d993d3d77d29",
  "1642543492481-44e81e3914a7", "1611974714658-058f4c529944", "1450101499163-c8848c66ca85", "1554224155-6726b3ff858f",
  "1611095777215-ed39a7b97c8d", "1460925895917-afdab827c52f", "1579621970795-87f9aed197b1", "1580519542036-c47de6196ba5",
  "1590283603905-2465e9d9b433", "1610375461246-83df8dfb01d5", "1508921234172-73891048f766", "1517245386807-bb43f82c33c4",
  "1518186285589-2f7649de83e0", "1526628952-b2d10c47f27a", "1551288049-bbbda546697c", "1605792657660-596af9009e82",
  "1452378174528-3090a4bba7b2", "1543286386-713bdd5486d3", "1454165833767-027ffea9e77b", "1549421263-5ec394a5ad4c",
  "1526628953301-3e589a6a8b74", "1554224155-1696413575b9", "1579532566591-943b1e2ca493", "1590283603914-723bfca46917",
  "1512428559087-560fa5ceab42", "1550751827-4bd374c3f58b", "1502481851512-e9e2529bfbf9", "1518186285589-2f7649de83e0",
  "1524341517789-548773950fb2", "1534078362425-387b1c3e3906", "1550426743-f119e7cf9e46"
];

// 간단한 문자열 해시 함수로 sectionId에 맞는 고정 인덱스 추출 (재시딩해도 동일 썸네일 유지되도록)
function getImageUrlForSection(sectionId) {
  let hash = 0;
  for (let i = 0; i < sectionId.length; i++) {
    hash = sectionId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % unsplashIds.length;
  return `https://images.unsplash.com/photo-${unsplashIds[idx]}?q=80&w=800&auto=format&fit=crop`;
}

/**
 * MD 파일을 읽어 ## 섹션별로 분리
 */
function parseMarkdownSections(filePath, categoryName, catPrefix) {
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
        const excerpt = extractExcerpt(body);
        articles.push({
          sectionId: currentId,
          title: `[${categoryName}] ${currentTitle}`,
          category: categoryName,
          content: body,
          excerpt,
          thumbnail: getImageUrlForSection(currentId),
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
    const excerpt = extractExcerpt(body);
    articles.push({
      sectionId: currentId,
      title: `[${categoryName}] ${currentTitle}`,
      category: categoryName,
      content: body,
      excerpt,
      thumbnail: getImageUrlForSection(currentId),
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
            allArticles.push({
              sectionId: currentId,
              title: `[${currentCat}] ${currentTitle}`,
              category: currentCat,
              content: body,
              excerpt: extractExcerpt(body),
              thumbnail: getImageUrlForSection(currentId),
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
        const catNum = currentId.split("-")[0];
        const cat = currentCat || catNumberToName[catNum] || "기타";
        allArticles.push({
          sectionId: currentId,
          title: `[${cat}] ${currentTitle}`,
          category: cat,
          content: body,
          excerpt: extractExcerpt(body),
          thumbnail: getImageUrlForSection(currentId),
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
