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
    title: "[보안/주의] 해외 브로커 사기 및 다단계 주의보: 사기꾼들의 전형적인 수법",
    category: "보안 가이드",
    excerpt: "글로벌 브로커의 이름을 도용하여 한국 내에서 활개 치는 다단계 사기꾼들의 수법과 이를 피하는 법을 상세히 공개합니다.",
    content: `### 1. 브로커는 무죄, 다단계 사기꾼이 문제

해외 유명 증권사(예: 인피녹스 등)는 전 세계적으로 합법적인 금융 서비스를 제공합니다. 하지만 한국 내 일부 **불법 다단계 조직**이 이러한 브로커 이름을 내걸고 "우리를 통하면 무조건 수익이 난다", "사람을 데려오면 수수료를 준다"는 식으로 원금 손실 위험을 속여 무고한 피해자를 만듭니다.

### 2. 이런 경우 100% 사기입니다 (Red Flags)

1.  **원금 보장 및 고정 수익 약속:** 트레이딩 시장에서 원금 보장은 물리적으로 불가능합니다.
2.  **다단계식 추천 보너스:** 하부 투자자를 모집하면 수익의 일부를 준다는 구조는 전형적인 폰지 사기입니다.
3.  **Hedged 매매 유도:** 양방향 매매를 통해 수수료(Rebate)만 챙기려는 목적의 영업은 투자자의 계좌를 녹게 만듭니다.

### 3. 소중한 자산을 지키는 안전 수칙

*   **본사 공식 경로 확인:** 한국 관리자를 통하기보다 브로커 본사의 공식 홈페이지와 라이선스를 직접 확인하십시오.
*   **Rebate(환급금) 중심 매매 지양:** 수수료 환급을 미끼로 과도한 매매를 강요하는 곳은 피해야 합니다.
*   **독립적인 판단:** 트레이딩은 본인이 직접 시스템을 이해하고 통제할 수 있어야 합니다. 남에게 전적으로 맡기는 투자는 도박과 같습니다.

트레이아는 어떠한 다단계 영업도 하지 않으며, 오직 기술적인 시스템 우위와 통계적 데이터를 바탕으로 한 트레이딩 환경만을 안내합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[마인드셋] 기계처럼 매매하라: 자동매매를 지탱하는 생존 철학",
    category: "마인드셋",
    excerpt: "트레이딩의 최대 적은 시장이 아니라 '나 자신의 감정'입니다. EA를 운용할 때 가져야 할 올바른 심리적 태도를 알아봅니다.",
    content: `### 1. 인간의 뇌는 트레이딩에 부적합하다

진화론적으로 인간은 위험을 피하고 즉각적인 보상을 쫓도록 설계되었습니다. 이는 트레이딩에서 **'손실은 길게, 수익은 짧게'** 가져가는 치명적인 실수를 낳습니다. 자동매매(EA)를 사용하는 목적은 바로 이 파괴적인 감정을 시스템 밖으로 밀어내는 데 있습니다.

### 2. 드로다운(Drawdown)을 인정하라

수익 곡선은 절대 직선으로 올라가지 않습니다. 반드시 계단식 하락과 정체기(DD)를 거칩니다. 많은 초보 트레이더들이 이 정체기를 견디지 못하고 EA를 끄거나 설정을 임의로 바꿔버려 결국 시스템이 가진 장기적 기대수익을 놓칩니다.

### 3. 생존을 위한 '데이터 신뢰'

시스템 트레이딩에서 가장 중요한 것은 **백테스트(Backtest) 결과에 대한 확신**입니다. 충분히 검증된 전략이라면, 일시적인 손실 구간에서 흔들리지 말고 시스템이 정해진 로직대로 매매를 완수하도록 지켜봐야 합니다.

결국 트레이딩의 성공은 누가 더 좋은 지표를 가졌느냐가 아니라, 누가 더 자신의 시스템을 끝까지 믿고 원칙을 지켰느냐에서 결정됩니다.`,
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[실전 기법] 트레이딩의 나침반: 지지와 저항 실전 작도법",
    category: "실전 기법",
    excerpt: "복잡한 보조지표보다 중요한 것은 가격의 본질입니다. 세력이 가장 예민하게 반응하는 지지와 저항선을 긋는 법을 배웁니다.",
    content: `### 1. 가격에는 기억력이 있다

시장은 과거에 강하게 튕겨 올라갔던 가격(지지)이나, 맞고 떨어졌던 가격(저항)을 기억합니다. 이 구간에 다시 가격이 도달했을 때 참여자들은 심리적 긴장감을 느끼며 대규모 주문이 체결됩니다.

### 2. 수평 지지/저항선의 3요소

1.  **접점의 수:** 더 많은 캔들이 꼬리를 남기거나 몸통으로 지지받은 구간일수록 공신력이 높습니다.
2.  **시간의 경과:** 최근에 형성된 지지/저항일수록 현재 시장에 미치는 영향력이 큽니다.
3.  **라운드 피겨(Round Figure):** 2,000달러, 20,000달러처럼 딱 떨어지는 숫자는 그 자체로 강력한 심리적 벽이 됩니다.

### 3. 실전 적용: 지지가 저항으로 바뀌는 순간 (S/R Flip)

강력했던 지지선이 무너지면, 그 구간은 반대로 강력한 저항선으로 돌변합니다. 이를 '역전 현상'이라 부르며, 트레이아의 많은 기술적 분석은 이러한 마디가(Pivot)를 중심으로 전략을 수립합니다.

모든 복잡한 지표를 걷어내고 차트를 깨끗하게 보는 습관을 들이십시오. 핵심은 늘 가격 그 자체에 있습니다.`,
    thumbnail: "https://images.unsplash.com/photo-1518186239717-31904a053174?auto=format&fit=crop&q=80&w=800",
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
      console.log(`✅ ${post.title} 시딩 완료`);
    } else {
      console.log(`⚠️ 중복 제외: ${post.title}`);
    }
  }
}
seed().catch(console.error);
