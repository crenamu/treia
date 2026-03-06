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
    title: "[CFD 기초] 마진(Margin)이란? 초보자용 증거금 완벽 가이드",
    category: "CFD 기초",
    excerpt: "레버리지 매매의 핵심인 마진의 개념을 배우고, 내 잔고에서 얼마가 담보로 잡히는지 계산하는 법을 알아봅니다.",
    content: `### 1. 마진(Margin)은 '담보'입니다

CFD 트레이딩에서 마진은 물건값을 다 지불하는 것이 아니라, 계약을 유지하기 위해 증권사에 맡겨두는 **'일종의 보증금'**입니다. 이 보증금 덕분에 우리는 레버리지를 활용해 실제 가진 돈보다 큰 자산을 운용할 수 있습니다.

### 2. 마진의 종류 이해하기

1.  **필요 마진(Used Margin):** 포지션을 진입하기 위해 묶여있는 돈입니다.
2.  **가용 마진(Free Margin):** 새로운 포지션을 잡거나 손실을 견딜 수 있는 여유 자금입니다.
3.  **마진 레벨(%):** 내 계좌의 안전도를 나타내는 지수로, 이 수치가 낮아질수록 위험해집니다.

### 3. 실전 계산 예시 (레버리지 500배 기준)

10,000달러어치 골드 0.1로트를 사고 싶다면, 500분의 1인 **단 20달러**만 마진으로 잡힙니다. 하지만 수익과 손실은 10,000달러를 기준으로 움직이기 때문에 마진 관리가 곧 계좌의 생명입니다.

제 경험상, 마진 레벨은 항상 **1,000% 이상**을 유지하는 것이 가장 마음 편한 매매의 기초입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1554224155-1697480ee27a?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[CFD 기초] 스프레드와 수수료: 거래 시작 전 반드시 체크할 비용",
    category: "CFD 기초",
    excerpt: "우리가 매수 단추를 누르는 순간 이미 소폭 손실로 시작하는 이유, 스프레드와 수수료 구조를 투명하게 공개합니다.",
    content: `### 1. 왜 사자마자 마이너스인가요?

CFD에는 **'매수 가격(Ask)'**과 **'매도 가격(Bid)'** 사이에 차이가 존재합니다. 이를 **스프레드(Spread)**라고 부르며, 브로커가 가져가는 가장 기본적인 통행료입니다. 마트에 가서 물건을 살 때 붙는 유통 마진과 비슷하다고 보시면 됩니다.

### 2. 수수료(Commission) 구조

스프레드가 아주 좁거나 거의 없는 대신, 주문 건당 고정 금액을 받는 **ECN 계좌** 방식도 있습니다. 전문 트레이더들은 보통 스프레드가 변동하는 것보다 고정 수수료를 지불하는 방식을 선호하여 원가를 더 정확히 계산합니다.

### 3. 비용을 줄이는 법

1.  **변동성이 큰 시간대 피하기:** 지표 발표 직후에는 브로커들도 리스크를 줄이기 위해 스프레드를 평소보다 5~10배씩 벌립니다.
2.  **종목별 특성 파악:** 골드는 유동성이 풍부해 스프레드가 좁지만, 비인기 통화쌍은 스프레드가 매우 넓어 거래 즉시 큰 비용이 발생할 수 있습니다.

작은 비용 같지만, 하루에 수십 번 매매하는 단타 트레이더에게 스프레드는 월말 수익률의 10~20%를 결정짓는 핵심 요소입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1633151821814-110034a7800c?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[CFD 기초] 로트(Lot)와 Pip: 내 수익금은 어떻게 계산되나?",
    category: "CFD 기초",
    excerpt: "트레이딩의 화폐 단위인 핍(Pip)의 개념과 로트(Lot) 사이즈에 따른 실제 수익 계산법을 아주 쉽게 설명합니다.",
    content: `### 1. 핍(Pip)이란 무엇인가?

주식에 '원'이나 '틱'이 있다면, 외환과 CFD에는 **핍(Percentage in Point)**이 있습니다. 보통 소수점 넷째 자리의 변화를 1핍이라고 부르지만, 골드나 엔화 환물은 소수점 둘째 자리를 기준으로 합니다.

### 2. 로트(Lot) 사이즈의 위력

*   **1.0 Standard Lot:** 1핍 움직일 때 보통 10달러가 오르내립니다.
*   **0.1 Mini Lot:** 1핍당 1달러.
*   **0.01 Micro Lot:** 1핍당 0.1달러(약 130원).

### 3. 실전 수익 계산 공식

예를 들어, 골드 0.1로트를 진입한 후 가격이 10핍 올랐다면? **0.1(로트) x 10(핍) x 10(핍가치) = 10달러**의 수익이 발생합니다.

로트 수를 정할 때는 '내가 벌고 싶은 돈'보다 '내가 어느 수준의 하락(Pip)까지 견딜 수 있는가'를 먼저 생각해야 합니다. 이 단위를 정확히 알아야 무리한 베팅을 멈출 수 있습니다.`,
    thumbnail: "https://images.unsplash.com/photo-1591696208202-731934149231?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[CFD 기초] 마진콜과 스탑아웃: 계좌가 터지는 공포의 순간",
    category: "CFD 기초",
    excerpt: "트레이더에게 사형 선고와도 같은 마진콜. 왜 발생하며, 내 계좌를 마지막 순간에 지키기 위한 강제 청산 원리를 해부합니다.",
    content: `### 1. 마진콜(Margin Call)이란?

내 계좌의 잔고가 포지션의 손실을 더 이상 감당하기 힘들 정도로 줄어들었을 때, 브로커가 보내는 **'최후통첩'**입니다. "돈을 더 넣거나, 포지션을 줄이지 않으면 곧 강제 청산하겠다"는 경고입니다.

### 2. 스탑아웃(Stop Out) - 강제 청산

경고를 무시하고 손실이 더 커져 '마진 레벨'이 특정 수준(보통 50% 이하)까지 떨어지면, 시스템이 자동으로 포지션을 종료합니다. 이는 계좌 잔고가 **- (마이너스)**가 되어 빚을 지는 것을 막기 위함입니다.

### 3. '깡통 계좌'를 피하는 법

1.  **반드시 손절(Stop Loss)을 걸 것:** 기계가 내 돈을 강제로 뺏어가기 전에 내가 먼저 자를 줄 알아야 합니다.
2.  **오버트레이딩 금지:** 로트 수를 과하게 늘리면 마치 살얼물판 위를 걷는 것과 같습니다. 약간의 파도만 쳐도 계좌는 무너집니다.

트레이딩하면서 가장 비싼 수업료는 바로 이 '스탑아웃'을 당하는 것입니다. 지는 법을 배워야 이기는 법도 보입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=800",
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
