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
    title: "[브로커] 입출금 주의사항: 내 수익을 안전하게 주머니에 넣는 법",
    category: "브로커 가이드",
    excerpt: "트레이딩의 마지막 단계는 수익금을 안전하게 내 통장으로 옮기는 것입니다. 입출금 시 발생할 수 있는 문제와 안전 수칙을 배웁니다.",
    content: `### 1. 동일 명의 원칙 (Anti-Money Laundering)

해외 브로커의 모든 입출금은 반드시 **계좌 명의자와 동일한 이름의 결제 수단**만 사용해야 합니다. 친구나 가족 명의 카드로 입금했다가는 출금 시 거대한 벽에 부딪힐 수 있습니다.

### 2. 추천하는 입출금 방법

1.  **테더(USDT):** 전송 속도가 가장 빠르고 환차익 관리가 용이하여 전 세계 트레이더들이 가장 선호하는 방식입니다.
2.  **전자지갑(Neteller, Skrill):** 승인이 빠르고 해외 결제 인프라가 잘 구축되어 있습니다.
3.  **해외 송금:** 금액이 매우 클 때 사용하지만 수수료와 기간이 오래 걸린다는 단점이 있습니다.

### 3. 출금 지연 시 대처법

출금이 반나절 이상 늦어진다면 즉시 실시간 채팅을 통해 문의하십시오. 대부분 보너스 규정 위반이나 서류 미비의 경우입니다. 트레이아는 출금이 확실한 투명한 브로커만을 안내하고 있어 이러한 리스크를 사전에 방지합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[사기 예방] 과도한 레버리지의 위험성: 계좌를 녹이는 독약",
    category: "보안 가이드",
    excerpt: "레버리지는 양날의 검입니다. 수익을 가속화하지만, 반대로 내 시드를 순식간에 증발시키는 강력한 독이 될 수 있습니다.",
    content: `### 1. 1:500 레버리지의 진실

레버리지가 높다는 것은 내 자본금보다 500배 큰 거래를 할 수 있다는 뜻입니다. 이는 수익 시 거대한 기쁨을 주지만, **단 0.2%만 반대로 움직여도 내 증거금이 0이 된다**는 공포스러운 사실을 뜻하기도 합니다.

### 2. 고레버리지의 함정

레버리지가 높으면 '가용 마진'에 여유가 생겨 나도 모르게 로트 수를 마구 늘리게 됩니다(오버 트레이딩). 이는 시장의 사소한 출렁임 하나에도 마진콜 직전까지 계좌를 내몰게 만듭니다.

### 3. 현명한 활용법

레버리지는 '큰 거래를 하기 위해' 쓰는 것이 아니라, '증거금을 효율적으로 활용하기 위해' 써야 합니다. 실제 운용은 평소 계좌의 2~3배 수준을 넘지 않도록 로물 보존 위주의 매매를 유지하십시오. 레버리지를 다스리지 못하는 자는 결국 시장에 제물이 됩니다.`,
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[사기 예방] 초보자가 많이 잃는 패턴 TOP 5: 생존 매뉴얼",
    category: "보안 가이드",
    excerpt: "시장에서 돈을 잃는 트레이더들의 행동 양식은 놀랍도록 똑같습니다. 이 5가지만 피해도 여러분은 상위 10% 트레이더가 됩니다.",
    content: `### 1. 손절 없는 물타기

틀렸음을 인정하지 않고 가격이 더 내려갈 때마다 추가 매수를 하는 것은 파멸의 지름길입니다. 골드 시장은 여러분의 자존심보다 훨씬 강합니다.

### 2. 뉴스 추격 매매 (FOMO)

뉴스가 터지고 차트가 이미 수직 상승한 뒤 뒤늦게 올라타는 행위입니다. 그때가 보통 세력들이 물량을 넘기고 빠져나오는 고점입니다.

### 3. 지표 발표 도박 매매

결과를 예측하고 큰 배팅을 하는 것은 트레이딩이 아니라 홀짝 게임입니다. 변동성이 심한 구간에서는 스프레드만으로도 시드가 걸레짝이 될 수 있습니다.

### 4. 수익 중일 때 불안감에 조기 청산

손실은 꾹 견디면서 수익은 조금만 나도 얼른 챙겨버립니다. 결국 '손실은 크고 수익은 작은' 구조가 되어 계좌는 서서히 말라 죽습니다.

### 5. 매매 일지 부재

왜 이겼는지, 왜 졌는지 기록하지 않으면 실수는 반복됩니다. 기록이 없는 트레이더는 절대 성장할 수 없습니다.`,
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[기술적 분석] 이동평균선(MA): 추세의 정석을 배우다",
    category: "기술적 분석",
    excerpt: "가장 기본적이면서 강력한 보조지표, 이동평균선의 원리와 정배열/역배열을 활용한 추세 매종 전략을 알아봅니다.",
    content: `### 1. 이동평균선이란?

특정 기간 동안의 가격 평균치를 선으로 이은 것입니다. 20일선은 지난 20일간 트레이더들의 평균 단가를 보여줍니다.

### 2. 정배열과 역배열

*   **정배열 (상승):** 5일, 20일, 60일, 120일 선이 차례대로 위에 있을 때입니다. 추세가 강력하게 위를 향하고 있으며 눌림목 매수가 유리합니다.
*   **역배열 (하락):** 그 반대입니다. 매도세가 시장을 지배하고 있음을 의미합니다.

### 3. 골든크로스와 데드크로스

단기 이평선이 장기 이평선을 뚫고 올라가는 '골든크로스'는 강력한 매수 신호로 여겨집니다. 하지만 횡보장에서는 잦은 속임수를 줍니다. 이동평균선은 반드시 시장의 **'기울기'**와 함께 보아야 그 진가를 발휘합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[트레이딩 심리] 욕심과 공포 다루기: 지표보다 강력한 마음의 근육",
    category: "마인드셋",
    excerpt: "트레이딩의 90%는 심리입니다. 수익 시의 고양감과 손실 시의 절망감을 어떻게 관리하고 평정심을 유지할지 배워봅니다.",
    content: `### 1. 시장은 거울입니다

차트의 움직임은 곧 내 마음의 반영입니다. 내가 조급하면 차트가 빨라 보이고, 내가 두려우면 아무리 좋은 타점도 보이지 않습니다.

### 2. 욕심(Greed) 제어하기

충분한 수익권임에도 불구하고 더 벌고 싶은 마음 때문에 익절을 못 하다가 결국 마이너스로 돌아서는 경험을 누구나 합니다. 목표가에 도달하면 기계적으로 절반이라도 수익을 챙기는 습관을 들이십시오.

### 3. 공포(Fear) 관리하기

손절을 한 번 당한 후 다시 진입하기가 무섭나요? 그것은 해당 매매를 '확률'이 아닌 '전부'로 보기 때문입니다. 한 번의 실패가 인생의 실패가 아님을 인지하고, 다음 신호가 오면 무심하게 버튼을 누를 수 있는 용기가 필요합니다.

전문가는 감정을 무시하는 사람이 아니라, 감정이 매매에 끼어들 틈을 주지 않는 시스템을 구축한 사람입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1518186239717-31904a053174?auto=format&fit=crop&q=80&w=800",
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
