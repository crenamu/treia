import * as dotenv from 'dotenv';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, getDocs, query, limit, deleteDoc, doc } from 'firebase/firestore';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'treia');

const communityPosts = [
  {
    title: "뉴욕 세션 골드(XAUUSD) 하방 압력 분석: DXY 상관관계",
    author: "트레이아 마스터",
    userId: "admin_1",
    content: "최근 연준 위원들의 매파적 발언으로 달러 인덱스(DXY)가 강한 반등을 보이고 있습니다. 골드는 역사적으로 달러와 역상관관계를 가지므로, #2650 지지선 이탈 시 매도 포지션 대응이 유리해 보입니다.",
    category: "정보공유",
    likes: 124,
    comments: 28,
    timestamp: Timestamp.now(),
    verificationStatus: "verified",
    isHot: true
  },
  {
    title: "골드(Gold) 트레이딩의 정석: 달러 인덱스(DXY) 활용법",
    author: "골드헌터",
    userId: "user_gold_1",
    content: "골드만 봐서는 답이 안 나옵니다. 항상 DXY 차트를 옆에 띄우세요. 달러가 저항선에 걸릴 때 골드 매수 타점을 잡는 것이 승률 80% 이상의 노하우입니다.",
    category: "강의/교육",
    likes: 95,
    comments: 32,
    timestamp: Timestamp.now(),
    verificationStatus: "verified",
    isHot: true
  },
  {
    title: "나스닥(Nasdaq) 장 초반 변동성과 골드의 흐름",
    author: "매크로 분석가",
    userId: "user_macro_1",
    content: "미 증시 개장 직후 나스닥의 강한 반등은 위험자산 선호 심리를 자극하여 안전자산인 골드의 일시적 조정으로 이어질 수 있습니다. 나스닥 변동성 지수(VIX)와 함께 체크하세요.",
    category: "정보공유",
    likes: 72,
    comments: 15,
    timestamp: Timestamp.now(),
    verificationStatus: "community"
  },
  {
    title: "실시간 XAUUSD 1시간봉 주요 매물대 체크",
    author: "차트 장인",
    userId: "user_chart_1",
    content: "현재 상단 저항선은 #2685, 하단 지지선은 #2642에 형성되어 있습니다. 박스권 횡보 중이나 DXY가 하락 추세로 전환될 경우 상방 돌파 가능성이 높습니다.",
    category: "정보공유",
    likes: 48,
    comments: 9,
    timestamp: Timestamp.now(),
    verificationStatus: "none"
  },
  {
    title: "비트코인(BTC)과 골드의 '디커플링' 현상 분석",
    author: "투자 전략가",
    userId: "user_strat_1",
    content: "최근 비트코인은 위험자산(나스닥)과 동조화되는 경향이 강한 반면, 골드는 지정학적 리스크에 더 민감하게 반응하고 있습니다. 포트폴리오 헤지 수단으로서의 골드 가치를 재평가해야 합니다.",
    category: "정보공유",
    likes: 64,
    comments: 22,
    timestamp: Timestamp.now(),
    verificationStatus: "none"
  },
  {
    title: "EA 자동매매: 골드(XAUUSD) 전용 세트파일 최적화 팁",
    author: "EA 전문가",
    userId: "user_ea_1",
    content: "골드는 변동성이 크기 때문에 일반적인 통화쌍 세팅으로 돌리면 위험합니다. Spread 필터를 20 이하로 잡고, 뉴욕 개장 전후 30분은 매매를 중단하는 로직을 추가하세요.",
    category: "강의/교육",
    likes: 112,
    comments: 46,
    timestamp: Timestamp.now(),
    verificationStatus: "verified"
  }
];

const articles = [
  {
    title_ko: "달러 인덱스(DXY) 105 돌파 시나리오: 골드 트레이더의 대응 전략",
    summary_ko: "미국의 경제 지표 강세로 달러 인덱스가 105선을 위협하고 있습니다. 이는 골드(XAUUSD)에 강력한 하방 압력으로 작용하며, $2600 중반대 방어 여부가 향후 중기 추세를 결정할 핵심 분기점이 될 것입니다.",
    category: "리스크관리",
    difficulty: "고급",
    source: "Treia Research",
    timestamp: Timestamp.now()
  },
  {
    title_ko: "나스닥 반등과 골드 가격의 역비례 관계: 미 증시 개장 효과 분석",
    summary_ko: "뉴욕 증시 개장 시간대에 나스닥이 강세를 보이면 유동성이 주식 시장으로 쏠리며 골드 가격은 일시적으로 약세를 보이는 경향이 있습니다. 두 자산 간의 유동성 이동 패턴을 활용한 스캘핑 전략을 소개합니다.",
    category: "매매기법",
    difficulty: "중급",
    source: "Fast Bull",
    timestamp: Timestamp.now()
  },
  {
    title_ko: "XAUUSD(골드) 기술적 분석: 주요 Fibonacci 되돌림 구간과 향후 전망",
    summary_ko: "최근 상승 랠리 이후 0.382 구간에서의 지지력을 테스트 중입니다. 인플레이션 헤지 수요와 중앙은행의 매수세가 뒷받침되고 있어, 조정 시 분할 매수 관점이 유효하다는 기술적 분석입니다.",
    category: "시황분석",
    difficulty: "중급",
    source: "Investing.com",
    timestamp: Timestamp.now()
  }
];

async function seed() {
  console.log("🚀 Starting Gold-Centric Content Seed (Direct Init)...");
  
  // 1. 기존 데이터 삭제 (중요: 깔끔한 교체)
  console.log("🧹 Cleaning up old data...");
  const postSnap = await getDocs(query(collection(db, 'treia_community_posts'), limit(20)));
  for (const item of postSnap.docs) {
    await deleteDoc(doc(db, 'treia_community_posts', item.id));
  }
  const artSnap = await getDocs(query(collection(db, 'treia_articles'), limit(20)));
  for (const item of artSnap.docs) {
    await deleteDoc(doc(db, 'treia_articles', item.id));
  }
  console.log("✅ Cleanup complete.");

  // 2. 신규 골드 특화 데이터 삽입
  // Community Posts
  for (const post of communityPosts) {
    try {
      await addDoc(collection(db, 'treia_community_posts'), post);
      console.log(`✅ Added Gold Post: ${post.title}`);
    } catch (e) {
      console.error("❌ Error adding post: ", e);
    }
  }

  // AI Curation Articles
  for (const article of articles) {
    try {
      await addDoc(collection(db, 'treia_articles'), article);
      console.log(`✅ Added Gold Article: ${article.title_ko}`);
    } catch (e) {
      console.error("❌ Error adding article: ", e);
    }
  }

  console.log("✨ Gold-Centric Seed Finished Successfully!");
  process.exit(0);
}

seed();
