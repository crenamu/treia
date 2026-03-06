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
    title: "[자동매매] EA의 한계: 왜 자동매매가 '마법의 지팡이'가 아닌가?",
    category: "자동매매",
    excerpt: "무조건 수익이 나는 완벽한 알고리즘은 없습니다. EA의 기술적 한계와 이를 보완하기 위해 트레이더가 해야 할 역할을 알아봅니다.",
    content: `### 1. 과거가 미래를 100% 보장하지 않습니다

EA는 과거 데이터를 학습하여 만든 우위(Edge)입니다. 하지만 시장은 예기치 못한 금리 급등, 전쟁, 블랙 스완과 같은 변수들로 가득합니다. 과거엔 없던 새로운 패턴이 나타날 때 EA는 길을 잃을 수 있습니다.

### 2. EA가 취약한 상황

1.  **비정상적인 변동성:** 지표 발표 직후 0.1초 만에 튀는 캔들은 EA가 정해진 로직을 실행하기도 전에 손절선을 넘겨버릴 수 있습니다.
2.  **추세의 변곡점:** 골든 크로스만 보고 들어가는 EA는 추세가 끝나고 횡보가 시작될 때 잦은 손절을 내며 수익을 갉아먹습니다.

### 3. 운용자의 능력이 핵심입니다

EA는 칼과 같습니다. 명의의 손에 들리면 사람을 살리지만, 서툰 손에 들리면 상처만 냅니다. 시장 상황에 맞춰 EA를 잠시 끄거나, 파라미터를 최적화할 줄 아는 **'관리자로서의 마인드셋'**이 있어야 비로소 지속 가능한 수익이 가능합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1591696208202-731934149231?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[카피트레이딩] 내 잔고에 맞는 로트 비율 설정 가이드",
    category: "카피트레이딩",
    excerpt: "마스터 트레이더와 내 계좌 사이의 금액 차이! 어떻게 설정해야 무리한 진입을 막고 리스크를 똑같이 복사할 수 있는지 배웁니다.",
    content: `### 1. 복사 비율(Copy Ratio)의 원리

마스터 트레이더의 자본금이 1만 불이고 여러분이 1천 불로 복사한다면, 당연히 마스터가 10분의 1로 매매해야 리스크가 동일하게 유지됩니다. MQL5 시스템은 이를 자동으로 계산하지만, 사용자가 직접 수동으로 제어할 수도 있습니다.

### 2. 고위험 vs 저위험 설정 팁

*   **1:1 완벽 복사 (추천):** 마스터가 설정한 리스크 비율과 똑같이 내 잔고가 연동됩니다. 가장 안전한 방식입니다.
*   **고위험 설정 (비추천):** 마스터보다 더 큰 비율로 따라가는 배수 매매 방식입니다. 마스터의 잔고는 살아남아도 내 계좌는 마진콜이 날 수 있어 매우 위험합니다.

### 3. 'Equity Limit' 설정 필수

내 잔고가 일정 금액 이하로 떨어지면 복사를 자동으로 중단하게 하는 안전장치를 반드시 거십시오. 마스터의 실수가 내 전 재산을 앗아가지 못하도록 방패를 세우는 작업입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[브로커] 스탠다드 vs ECN vs 프로: 나는 어떤 계좌를 써야 하나?",
    category: "브로커 가이드",
    excerpt: "브로커마다 제공하는 다양한 계좌 타입의 차이를 분석합니다. 스프레드, 수수료, 체결 방식에 따른 최적의 선택은?",
    content: `### 1. 스탠다드(Standard) 계좌 - 초보자용

수수료가 따로 붙지 않는 대신 스프레드가 비교적 넓습니다. 계산이 간편하여 소액으로 시작하는 초보자들에게 적합합니다.

### 2. ECN (Electronic Communication Network) 계좌 - 실전용

스프레드가 거의 0에 가깝지만, 주문당 고정 수수료가 발생합니다. 체결 속도가 매우 빠르고 투명하여, 단타(Scalping) 트레이더나 고성능 EA 운용자에게 필수입니다.

### 3. 프로(Pro/Zero) 계좌 - 전문가용

가장 유리한 거래 조건을 제공하는 대신, 높은 최소 입금액을 요구하는 경우가 많습니다. 대규모 자산을 운용하는 트레이더들에게 가장 낮은 거래 원가를 보장합니다.

트레이아는 보통 **ECN 계좌**를 권장합니다. 0.1핍 차이로 익절이 되느냐 안 되느냐가 갈리는 시스템 트레이딩 환경에서 가장 정밀한 결과를 보장하기 때문입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1454165833267-033c215839dc?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[브로커] 모의계좌(Demo) 200% 활용법: 실전 전 예행연습",
    category: "브로커 가이드",
    excerpt: "가짜 돈이라고 대충 하지 마세요. 모의계좌를 통해 EA의 성능을 검증하고, 나만의 매매 프로세스를 확립하는 3단계 훈련법.",
    content: `### 1. 모의계좌는 실전 연습의 끝입니다

진짜 내 돈이 걸리기 전, 플랫폼 사용법을 익히고 EA가 내 생각대로 주문을 내는지 확인하는 유일한 창구입니다.

### 2. 모의계좌 필수 체크리스트

1.  **동일한 서버 환경:** 가급적 실시간 실계좌와 같은 데이터 피드를 쓰는 서버를 선택하십시오.
2.  **실제 시드 머니와 동등하게:** 백만 불짜리 모의계좌로 연습하지 마세요. 내가 실제로 입금할 1천 불, 5천 불과 똑같은 금액으로 세팅하여 수익과 손실의 체감을 익혀야 합니다.

### 3. 멘탈 시뮬레이션

모의계좌의 숫자가 깎일 때도 실제 내 돈처럼 느끼며 원칙을 지키는 훈련을 하십시오. 여기서 원칙을 못 지키는 사람은 실전에서는 100% 무너집니다.`,
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
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
