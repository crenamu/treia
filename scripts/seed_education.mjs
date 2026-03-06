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
    title: "[리스크 관리] 연속 손실 시 대응법: 계좌가 녹아내릴 때의 응급처치",
    category: "리스크 관리",
    excerpt: "누구에게나 연패의 사슬은 찾아옵니다. 멘탈이 무너지고 시드가 깎일 때, 계좌를 지탱해 줄 3단계 방어 전략을 공개합니다.",
    content: `### 1. 연패는 실력이 아니라 통계입니다

아무리 훌륭한 시스템도 연속 5번, 10번 손절이 날 수 있습니다. 이는 여러분의 실력이 부족해서가 아니라, 단지 **'확률의 골짜기'**를 지나고 있는 것뿐입니다.

### 2. 연속 손실 시 3단계 행동 강령

1.  **강제 휴식 (Cool-off):** 연속 3번 이상 손절이 나면 일단 차트를 끄십시오. 이성적인 판단이 불가능한 상태에서 하는 매매는 '복수 매매'가 될 뿐입니다.
2.  **로트 수 절반 축소:** 심리적 타격을 최소화하기 위해 다음 진입 때는 평소의 절반 로트만 태우십시오. 수익을 내서 복구하기 위함이 아니라 '자신감'을 회복하기 위함입니다.
3.  **시스템 재점검:** 내 매매 일지를 다시 보고, 정의된 로직대로 했는지 아니면 뇌동매매였는지 냉정하게 분석하십시오.

원칙을 지킨 손절은 칭찬받아야 할 일입니다. 진짜 실패는 손실이 아니라 원칙을 어기는 데에서 시작됩니다.`,
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[리스크 관리] 왜 우리는 손절을 못 칠까? 심리의 족쇄 풀기",
    category: "리스크 관리",
    excerpt: "손절 버튼 앞에서의 망설임. 왜 뇌는 손실을 확정 짓는 것을 고통스러워하는지, 그 심리적 함정을 파헤치고 극복법을 제안합니다.",
    content: `### 1. 손실 회피 편향 (Loss Aversion)

인간은 같은 금액이라도 얻었을 때의 기쁨보다 잃었을 때의 고통을 **2배 이상** 크게 느낍니다. "다시 올라오겠지"라는 희망 회로는 뇌가 고통을 피하려는 방어 기제에 불과합니다.

### 2. 손절을 못 치는 3가지 심리적 이유

1.  **실패를 인정하기 싫은 자존심:** "나는 틀리지 않았어"라는 아집이 계좌를 죽입니다.
2.  **매몰 비용의 함정:** 이미 깎인 시드가 아까워 손절 타이밍을 놓치고 결국 더 큰 피해를 봅니다.
3.  **내일의 가격을 안다는 착각:** 시장은 언제든 내 예상과 다르게 갈 수 있음을 부정하기 때문입니다.

### 3. 해결책: 자동화하고 외면하라

손절을 못 하겠다면 진입과 동시에 **'예약 손절선(SL)'**을 차트에서 절대 지우지 마십시오. 그리고 가격이 근처에 오면 차트를 보지 않는 것도 방법입니다. 내 손이 아닌 시스템이 자르게 하십시오.`,
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[자동매매] 백테스트와 프런트테스트: 가짜 수익에 속지 마세요",
    category: "자동매매",
    excerpt: "과거 데이터로 만든 환상적인 수익 곡선, 백테스트. 실제 시장에서 작동하는 프런트테스트와의 차이점과 검증 시 유의사항을 배웁니다.",
    content: `### 1. 백테스트(Backtest)의 함정: 과최적화

과거 10년 치 데이터로 완벽한 수익이 나도록 수치를 맞추는 것은 아주 쉽습니다. 하지만 이를 '과최적화(Curve-fitting)'라고 하며, 이런 EA는 실제 시장에 투입되는 순간 무너집니다.

### 2. 프런트테스트(Forward Test)의 필요성

실제 실시간 데이터를 받아 흐르는 장에서 최소 한 달 이상 모의투자를 돌려보는 것이 프런트테스트입니다. 
*   **슬리피지:** 백테스트엔 없던 체결 지연이 발생합니다.
*   **데이터 퀄리티:** 99.9% 틱 데이터가 아닌 조잡한 무료 데이터로 돌린 백테스트는 쓰레기나 다름없습니다.

### 3. 신뢰할 수 있는 데이터 읽기

최소 10년 이상의 기간, 90% 이상의 모델링 퀄리티, 그리고 무엇보다 **'실기 계좌(Live Account)'**의 오픈 데이터가 있는 EA만이 여러분의 소중한 돈을 맡길 가치가 있습니다.`,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "고급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[자동매매] 10년 차가 알려주는 '좋은 EA'를 고르는 5가지 기준",
    category: "자동매매",
    excerpt: "MQL5 마켓의 수만 개 EA 중 무엇이 진짜일까? MDD부터 회복 지수까지, 프로들이 체크하는 5가지 필수 지표를 공개합니다.",
    content: `### 1. 최대 낙폭 (Max Drawdown)

수익률보다 중요합니다. 계좌가 견뎌야 했던 최악의 손실폭입니다. MDD가 20~30%를 넘지 않는 EA가 장기 운용에 적합합니다.

### 2. 회복 지수 (Recovery Factor)

손실을 얼마나 빨리 복구하느냐입니다. 한 번 깨진 후 몇 달 동안 제자리라면 기회비용이 너무 큽니다.

### 3. 마틴게일(Martingale) 여부 확인

잃을 때마다 로트 수를 2배씩 늘리는 방식은 언젠가 반드시 계좌를 폭파시킵니다. "손절이 없는 EA"라고 광고한다면 100% 마틴게일이며, 절대 피해야 합니다.

### 4. 실 계좌(Myfxbook) 인증 유무

브로커가 제공하는 변조 불가능한 실시간 매매 데이터가 공개된 EA만 믿으십시오. 스크린샷은 거짓말을 할 수 있지만 데이터는 거짓말하지 않습니다.

### 5. 로직의 투명성

어떤 보조지표를 쓰는지, 왜 들어가는지 원리가 명확해야 합니다. "비밀 알고리즘"이라는 말 뒤에 숨은 부실한 로직을 경계하십시오.`,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
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
