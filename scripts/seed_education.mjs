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
    title: "[CFD 기초] 롱(매수)과 숏(매도): 하락장에서도 수익을 내는 법",
    category: "CFD 기초",
    excerpt: "가격이 오를 때만 벌 수 있는 주식의 한계를 넘어, 하락장에서도 수익을 내는 '숏'의 개념을 완벽히 정리합니다.",
    content: `### 1. 롱(Long)과 숏(Short)의 기원

트레이딩에서 **'롱(Long)'**은 가격이 오를 것을 기대하고 매수하는 것을, **'숏(Short)'**은 가격이 내릴 것을 기대하고 매도하는 것을 의미합니다. CFD는 실제 물건을 소지하는 것이 아니라 '가격의 차이'에 베팅하는 것이기에 하락 베팅이 주식보다 훨씬 자유롭습니다.

### 2. '없는 물건을 판다'는 개념 이해하기

주식 공부를 처음 하면 "없는 걸 어떻게 먼저 팔지?"라고 의구심을 갖습니다. CFD에서는 브로커로부터 해당 자산을 빌려와서 현재 가격에 팔고, 나중에 더 싼 가격에 사서 갚는 방식입니다. 그 시세 차익이 곧 나의 수익이 됩니다.

### 3. 양방향 매매의 거대한 이점

*   **하락장의 기회:** 경기 불황이나 급락장에서도 수익 기회를 창출할 수 있습니다.
*   **헷징(Hedging):** 내가 가진 장기 보유 자산이 떨어질 것 같을 때, 숏 포지션을 잡아 손실을 상쇄할 수 있습니다.

상승장에서만 벌 수 있는 트레이더는 시장의 절반만 사용하는 것입니다. '숏'을 이해하는 순간, 여러분의 트레이딩 기회는 두 배로 늘어납니다.`,
    thumbnail: "https://images.unsplash.com/photo-1611974714652-960205d8bc11?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[골드 특화] 왜 골드인가? 골드 트레이딩의 폭발적인 매력",
    category: "골드 특화",
    excerpt: "전 세계 트레이더들이 가장 열광하는 종목, 골드(XAUUSD)의 전용 특성과 왜 '골드 EA'가 필요한지를 파헤칩니다.",
    content: `### 1. 안전자산이면서도 화끈한 변동성

골드는 역사적으로 가장 신뢰받는 안전자산입니다. 하지만 트레이딩 차트에서의 골드는 그 어떤 주식보다 **폭발적인 변동성**을 자랑합니다. 하루에도 수백 핍(Pip)씩 움직이는 골드의 파도는 트레이더들에게 거대한 수익의 기회를 제공합니다.

### 2. 골드 트레이딩의 3대 특징

1.  **달러(USD)와의 역상관:** 보통 달러 가치가 올라가면 골드 가격은 내려가는 뚜렷한 경향이 있어 분석이 비교적 명확합니다.
2.  **높은 유동성:** 전 세계 어디서든 24시간 활발히 거래되므로 슬리피지가 적고 체결이 빠릅니다.
3.  **지정학적 리스크의 민감도:** 전쟁이나 경제 위기 시 가장 먼저 반응하는 '시장의 안테나' 역할을 합니다.

### 3. 왜 트레이아는 골드에 집중하는가?

변동성이 크다는 것은 리스크가 크다는 뜻이기도 하지만, **정밀한 알고리즘(EA)**이 뒷받침된다면 통계적 우위를 점하기 가장 좋은 시장이기 때문입니다. 골드의 거친 파도를 안정적인 수익으로 바꾸는 거이 트레이아 시스템의 핵심입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[골드 특화] 골드 트레이딩 시 자주 하는 실수 TOP 5",
    category: "골드 특화",
    excerpt: "골드 시장에서 깡통 계좌를 차는 초보자들의 공통적인 실수 5가지를 분석하여, 여러분의 소중한 시드를 보호합니다.",
    content: `### 1. 과도한 레버리지 사용

골드는 틱 가치가 매우 높습니다. 일반 유로달러(EURUSD)를 거래하듯 로트 수를 잡았다가는 약간의 흔들림에도 마진콜 직전까지 갈 수 있습니다. 골드에서는 평소보다 로트 수를 보수적으로 가져가야 합니다.

### 2. 지표 발표 직전 진입 (도박 매매)

미 비농업 고용지표(NFP)나 소비자물가지수(CPI) 발표 시 골드는 1초 만에 수십 달러를 오르내립니다. 방향성을 맞추려다가는 양방향 슬리피지로 계좌가 중상을 입을 수 있습니다.

### 3. 충분하지 못한 손절폭

골드는 '가짜 돌파(Fakeout)'가 빈번합니다. 너무 짧은 손절은 시장의 단순한 노이즈에도 털리고 나중에 가격이 내 방향으로 가는 억울한 상황을 만듭니다.

### 4. 손절 후의 '복수 매매'

골드의 변동성에 한 번 당하면 이성을 잃기 쉽습니다. 잃은 돈을 바로 찾으려다 더 큰 무리수를 두는 것이 골드 트레이더들의 전형적인 파산 경로입니다.

### 5. 세션별 특성 무시

아시아 장의 조용한 흐름만 믿고 뉴욕 장 시작 시점에 포지션을 방치했다가 낭패를 보는 경우가 많습니다. 골드는 세션별로 전혀 다른 성격을 가집니다.`,
    thumbnail: "https://images.unsplash.com/photo-1614028674016-81c81358c2da?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[리스크 관리] 손절(Stop Loss) 설정법: 내 계좌의 생명줄",
    category: "리스크 관리",
    excerpt: "고통스럽지만 반드시 해야 하는 손절. 어떻게 설정해야 억울하게 털리지 않고 계좌를 안전하게 지킬 수 있는지 실무법을 배웁니다.",
    content: `### 1. 손절은 비용입니다

트레이딩을 사업으로 본다면, **손절은 상품을 팔기 위한 '마케팅 비용'**과 같습니다. 비용 없이는 수익도 없습니다. 손절을 아까워하는 순간, 사업은 망하게 됩니다.

### 2. 현명한 손절 위치 잡기

1.  **구조적 지지/저항 뒤:** 내가 틀렸다는 것이 차트상 확인되는 지점에 걸어야 합니다.
2.  **ATR(변동성 지표) 활용:** 현재 시장의 평균 출렁임 범위 밖에 두어 노이즈에 털리는 것을 방지합니다.
3.  **금액 기준:** 한 매매당 전체 자산의 1~2% 손실이 확정되는 지점에 미리 걸어둡니다.

### 3. '손절 이동'의 죄악

가격이 손절선에 다가올 때 손절선을 더 뒤로 미루는 행위는 트레이딩의 사형 선고나 다름없습니다. 계획이 틀렸다면 일단 시장에서 나와 다음 기회를 노리는 것이 프로의 자세입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "고급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[리스크 관리] 손익비(Risk/Reward ratio): 승률보다 중요한 숫자",
    category: "리스크 관리",
    excerpt: "승률이 30%여도 돈을 벌 수 있는 비결, 손익비의 개념을 잡고 통계적으로 이기는 트레이딩을 설계하는 법을 알아봅니다.",
    content: `### 1. 승률의 함정

많은 사람이 승률 90% 기법을 찾아다닙니다. 하지만 9번 작게 이기고 1번 계좌가 터진다면 그건 패배하는 전략입니다. 프로 트레이더들은 승률보다 **'한 번 이길 때 얼마나 벌고, 질 때 얼마나 잃는가'**에 집중합니다.

### 2. 1:2 손익비의 마법

내가 10만원을 잃을 각오로 진입했다면, 최소 20만원의 수익을 기대할 수 있는 자리에서만 매매하는 것입니다. 이 경우 승률이 **단 40%만 되어도** 계좌는 장기적으로 우상향합니다.

### 3. 실전 적용 팁

*   **진입 전 익절/손절 계산:** 차트에 줄을 그어보고 익절 구간이 손절 구간보다 현저히 좁다면 그 매매는 포기하는 것이 낫습니다.
*   **부분 익절 활용:** 목표가의 절반에서 수익을 챙기고 나머지는 길게 가져가며 손익비를 극대화합니다.

수익은 시장이 주는 것이지만, 리스크(손실)는 내가 결정하는 것입니다. 이 숫자를 지배하는 자가 시장을 지배합니다.`,
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
