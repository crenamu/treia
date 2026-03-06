import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const posts = [
  {
    title: "[CFD 기초] 스왑(Swap) 이자: 보유만 해도 돈이 나간다?",
    category: "CFD 기초",
    excerpt: "포지션을 다음 날로 넘길 때 발생하는 '오버나이트 이자'의 정체를 밝히고, 수익을 낼 수도 있는 스왑 거래의 원리를 배웁니다.",
    content: `### 1. 스왑(Swap)이란 무엇인가?

CFD는 두 나라 통화나 자산의 가치를 거래하는 것입니다. 이때 각 자산에는 서로 다른 **'금리'**가 붙어있습니다. 포지션을 당일 청산하지 않고 다음 날로 넘길 때(Roll-over), 이 금리 차이만큼 비용을 내거나 받게 되는데 이를 스왑 이자라고 합니다.

### 2. 마이너스 스왑 vs 플러스 스왑

1.  **마이너스 스왑:** 내가 산 통화의 금리보다 판 통화의 금리가 높을 때 발생합니다. 매일 일정 금액이 이자로 차감됩니다.
2.  **플러스 스왑:** 반대로 내가 산 통화의 금리가 더 높을 때입니다. 가만히 있어도 계좌에 이자가 들어옵니다.

### 3. 수요일의 '3배 스왑' 주의보

외환 시장은 보통 주말 이틀 치 이자를 **수요일에서 목요일로 넘어오는 시점**에 한꺼번에 정산합니다. 이날은 평소보다 3배나 많은 스왑이 발생하므로, 장기 보유자라면 반드시 체크해야 할 구간입니다.

장기 투자를 계획한다면 진입 시점의 가격뿐만 아니라, 매일 쌓이는 이 비용(Swap)이 내 수익률을 얼마나 깎아 먹을지 미리 계산해두는 지혜가 필요합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[골드분석] 골드 가격의 4대 엔진: 무엇이 금값을 움직이나?",
    category: "골드 분석",
    excerpt: "골드는 단순한 금속이 아닙니다. 금리, 달러, 전쟁, 그리고 인플레이션이라는 4가지 거대한 힘이 골드의 항로를 결정합니다.",
    content: `### 1. 실질 금리 (가장 강력한 엔진)

금은 이자를 주지 않습니다. 따라서 은행 금리가 올라가면 금의 매력은 떨어집니다. 반대로 금리가 낮아지면 투자자들은 이자가 없는 대신 가치가 보존되는 금으로 몰려듭니다.

### 2. 달러 인덱스 (역상관 관계)

골드는 전 세계적으로 '달러'로 결제됩니다. 달러 가치가 상승하면 상대적으로 금 가격은 낮아 보이는 효과가 발생합니다. 달러와 골드는 보통 **시소 게임**을 한다고 이해하면 쉽습니다.

### 3. 인플레이션 (헤지 수단)

화폐 가치가 떨어지는 인플레이션 시대에 금은 실물 가치를 지키는 최고의 수단입니다. 물가가 미친 듯이 오를 때 골드가 역사적 고점을 경신하는 이유입니다.

### 4. 지정학적 리스크 (전쟁과 위기)

세상이 불안할 때 사람들은 가장 안전한 자산인 금을 찾습니다. 전쟁이나 국가 부도 위기 소식이 들리면 골드 차트는 수직 상승하는 경향이 있습니다. 

흐름을 읽고 싶다면 오늘 아침 뉴스에서 이 4가지 키워드를 먼저 찾아보십시오.`,
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[골드분석] 골드 시장의 시간표: 아시아-유럽-뉴욕 세션별 특징",
    category: "골드 분석",
    excerpt: "어느 시간대에 거래하느냐가 승률을 결정합니다. 골드의 폭풍이 몰아치는 뉴욕 장과 고요한 아시아 장의 매매 전략을 공개합니다.",
    content: `### 1. 아시아 세션 (오전 9시 ~ 오후 3시)

보통 '박스권 횡보'가 많은 시간입니다. 큰 추세보다는 일정한 범위 안에서 움직이므로, 이 시기에 추세 돌파 매매를 시도했다가는 속임수에 당하기 쉽습니다.

### 2. 런던/유럽 세션 (오후 4시 ~ 오후 10시)

전 세계 거래량의 중심인 런던 장이 열리면 골드가 본격적으로 방향을 잡기 시작합니다. 이때 형성된 방향이 밤늦게까지 이어지는 경우가 많으므로 매우 중요한 시간대입니다.

### 3. 뉴욕 세션 (오후 10시 30분 ~ 새벽 4시)

가장 위험하고 가장 수익 기회가 많은 **'골든 타임'**입니다. 미 주요 경제지표 발표가 집중되어 있으며, 상상 이상의 변동성이 터집니다. 초보자라면 가급적 이 시간대의 초반 1시간은 관망하는 것이 시드를 지키는 길입니다.

자신이 매매하는 환경이 어떤 세션에 속해 있는지 알아야, 시장의 속임수와 진짜 움직임을 구분할 수 있습니다.`,
    thumbnail: "https://images.unsplash.com/photo-1508921334172-b68ec33e390c?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[골드분석] 지표 발표 대응 전략: CPI, FOMC, NFP 완벽 가이드",
    category: "골드 분석",
    excerpt: "경제지표 발표 때마다 춤추는 골드 차트. 실전에서 살아남기 위한 데이터 해석법과 대응 시나리오를 설명합니다.",
    content: `### 1. 비농업 고용지표 (NFP) - 매달 첫째 주 금요일

골드 트레이더들에게 '성탄절'과 같은 날입니다. 미국의 고용 상태가 예상보다 좋으면 달러가 강세가 되며 골드는 급락하고, 반대면 급등합니다. 

### 2. 소비자물가지수 (CPI)

인플레이션을 측정하는 지표입니다. 물가가 높게 나오면 연준(Fed)이 금리를 올릴 가능성이 커지므로 골드에게는 악재로 작용하는 경우가 많습니다.

### 3. FOMC 금리 결정 및 성명서 발표

단순히 금리 수치뿐만 아니라, 연준 의장의 발언 한마디에 골드 차트가 위아래로 수백 핍씩 흔들립니다.

### 4. 실전 대응 팁

*   **발표 직전 퇴장:** 결과가 나오기 전 홀짝 게임을 하지 마십시오.
*   **슬리피지 대비:** 시장가가 아닌 지정가 주문도 지표 발표 시에는 크게 밀려 체결될 수 있음을 인정해야 합니다.
*   **30분 원칙:** 지표 발표 후 30분 정도 시장이 방향을 충분히 소화한 뒤에 진입하는 것이 훨씬 안전합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1611974714652-960205d8bc11?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "고급",
    source: "Treia Official",
    createdAt: new Date()
  }
];

async function seed() {
  const colRef = collection(db, "treia_education");
  for (const post of posts) {
    const q = query(colRef, where("title", "==", post.title));
    const snap = await getDocs(q);
    if (snap.empty) {
      await addDoc(colRef, { ...post, createdAt: serverTimestamp() });
      console.log(`✅ ${post.title} 완료`);
    }
  }
}
seed().catch(console.error);
