/**
 * seed_admin.mjs
 * Firebase Admin SDK로 교육 콘텐츠를 Firestore에 시딩
 * 실행: node scripts/seed_admin.mjs
 * 
 * 필요 파일: 프로젝트 루트에 service-account.json 필요
 *   (Firebase 콘솔 > 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성)
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

// Service Account JSON 로드
const serviceAccountPath = join(rootDir, "service-account.json");
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
} catch (e) {
  console.error("❌ service-account.json 파일을 찾을 수 없습니다.");
  console.error("   Firebase 콘솔 > 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성");
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore("treia"); // named database

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

const catNumberToName = {
  "1": "CFD 기초",
  "2": "골드 특화",
  "3": "기술적 분석",
  "4": "리스크 관리",
  "5": "자동매매",
  "6": "카피트레이딩",
  "7": "브로커",
  "8": "사기 예방",
};

// ─── 유틸 함수 ─────────────────────────────────────────────────────────────────
function extractExcerpt(content) {
  const lines = content.split("\n");
  for (const line of lines) {
    const t = line.trim();
    if (t && !t.startsWith("#") && !t.startsWith("```") && !t.startsWith(">") && !t.startsWith("|") && t.length > 20) {
      return t.slice(0, 120) + (t.length > 120 ? "..." : "");
    }
  }
  return "트레이아 아카데미 전문 교육 콘텐츠";
}

function inferDifficulty(sectionId) {
  const [cat, sec] = sectionId.split("-").map(Number);
  if (cat === 8) return "초급";
  if (cat === 4 && sec <= 3) return "초급";
  if (cat === 1 && sec <= 5) return "입문";
  if (cat === 6 && sec <= 2) return "입문";
  if (cat === 7 && sec <= 2) return "입문";
  if (sec >= 5) return "고급";
  return "중급";
}

function parseMixedFile(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const articles = [];
  let currentId = null, currentTitle = null, currentLines = [], currentCat = null;

  for (const line of lines) {
    const catMatch = line.match(/^#\s+카테고리\s+(\d+)/);
    if (catMatch) { currentCat = catNumberToName[catMatch[1]] || "기타"; continue; }

    const match = line.match(/^##\s+(\d+-\d+)\.\s+(.+)/);
    if (match) {
      if (currentId && currentTitle && currentLines.length > 0) {
        const body = currentLines.join("\n").trim();
        const catNum = currentId.split("-")[0];
        const cat = currentCat || catNumberToName[catNum] || "기타";
        articles.push({ sectionId: currentId, title: currentTitle, category: cat, content: body,
          excerpt: extractExcerpt(body), difficulty: inferDifficulty(currentId),
          thumbnail: getImageUrlForSection(currentId) });
      }
      currentId = match[1]; currentTitle = match[2].trim(); currentLines = [];
      const catNum = match[1].split("-")[0];
      if (!currentCat) currentCat = catNumberToName[catNum] || "기타";
    } else if (currentId) {
      if (line.startsWith("*© 2026")) continue;
      currentLines.push(line);
    }
  }
  if (currentId && currentTitle && currentLines.length > 0) {
    const body = currentLines.join("\n").trim();
    const catNum = currentId.split("-")[0];
    const cat = currentCat || catNumberToName[catNum] || "기타";
    articles.push({ sectionId: currentId, title: currentTitle, category: cat, content: body,
      excerpt: extractExcerpt(body), difficulty: inferDifficulty(currentId),
      thumbnail: getImageUrlForSection(currentId) });
  }
  return articles;
}

function parseSingleCategoryFile(filePath, categoryName) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const articles = [];
  let currentId = null, currentTitle = null, currentLines = [];

  for (const line of lines) {
    const match = line.match(/^##\s+(\d+-\d+)\.\s+(.+)/);
    if (match) {
      if (currentId && currentTitle && currentLines.length > 0) {
        const body = currentLines.join("\n").trim();
        articles.push({ sectionId: currentId, title: currentTitle, category: categoryName, content: body,
          excerpt: extractExcerpt(body), difficulty: inferDifficulty(currentId),
          thumbnail: getImageUrlForSection(currentId) });
      }
      currentId = match[1]; currentTitle = match[2].trim(); currentLines = [];
    } else if (currentId) {
      if (line.startsWith("*© 2026")) continue;
      currentLines.push(line);
    }
  }
  if (currentId && currentTitle && currentLines.length > 0) {
    const body = currentLines.join("\n").trim();
    articles.push({ sectionId: currentId, title: currentTitle, category: categoryName, content: body,
      excerpt: extractExcerpt(body), difficulty: inferDifficulty(currentId),
      thumbnail: getImageUrlForSection(currentId) });
  }
  return articles;
}

// ─── 메인 ──────────────────────────────────────────────────────────────────────
async function main() {
  const colRef = db.collection("treia_education");

  // 기존 데이터 삭제
  console.log("🗑️  기존 treia_education 데이터 삭제 중...");
  const existing = await colRef.where("app", "==", "treia").get();
  const batch = db.batch();
  existing.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`   ${existing.size}개 삭제 완료\n`);

  // 파일 파싱
  const allArticles = [];
  const files = [
    { path: join(rootDir, "_docs_backup/cat1_CFD기초.md"), type: "single", category: "CFD 기초" },
    { path: join(rootDir, "_docs_backup/cat6_카피트레이딩_가이드.md"), type: "single", category: "카피트레이딩" },
    { path: join(rootDir, "_docs_backup/cat8_사기예방_주의사항.md"), type: "single", category: "사기 예방" },
    { path: join(rootDir, "_docs_backup/cat2345_7_나머지콘텐츠.md"), type: "mixed" },
    { path: join(rootDir, "_docs_backup/교육컨텐츠_추가콘텐츠_완성.md"), type: "mixed" },
  ];

  for (const f of files) {
    const articles = f.type === "mixed"
      ? parseMixedFile(f.path)
      : parseSingleCategoryFile(f.path, f.category);
    allArticles.push(...articles);
    console.log(`📄 ${f.path.split("\\").pop()}: ${articles.length}개 파싱`);
  }

  // 중복 제거 (sectionId 기준)
  const seen = new Set();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.sectionId)) return false;
    seen.add(a.sectionId);
    return true;
  });

  console.log(`\n📚 총 ${unique.length}개 아티클 Firestore 저장 시작...\n`);

  let count = 0;
  for (const article of unique) {
    await colRef.add({
      title: `[${article.category}] ${article.title}`,
      category: article.category,
      content: article.content,
      excerpt: article.excerpt,
      thumbnail: article.thumbnail,
      difficulty: article.difficulty,
      sectionId: article.sectionId,
      app: "treia",
      isPublished: true,
      source: "Treia Academy",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✅ [${article.sectionId}] ${article.category} - ${article.title}`);
    count++;
  }

  console.log(`\n🎉 완료! 총 ${count}개 아티클이 Firestore(treia_education)에 저장되었습니다.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ 오류:", err);
  process.exit(1);
});
