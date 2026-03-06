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
    title: "[브로커] 해외 브로커란? 국내 증권사와의 결정적 차이 3가지",
    category: "브로커 가이드",
    excerpt: "왜 많은 트레이더들이 해외 브로커를 사용하는가? 국내 증권사 대비 장점과 반드시 주의해야 할 점을 분석합니다.",
    content: `### 1. 해외 브로커를 사용하는 이유

국내 증권사의 해외선물 계좌는 증거금이 매우 높고 레버리지가 낮아 소액 투자자에게 벽이 높습니다. 반면 글로벌 브로커들은 소액으로도 큰 자산을 운용할 수 있는 환경을 제공합니다.

### 2. 결정적 차이점 3가지

1.  **압도적인 레버리지:** 국내는 보통 10~20배 수준이지만, 해외는 500배 이상의 환경을 제공하여 자본 효율성을 극대화합니다.
2.  **다양한 종목:** 외환, 골드, 오일은 물론 전 세계 주식과 지수를 한 계좌에서 거래할 수 있습니다.
3.  **MT5 플랫폼 지원:** 전 세계 표준 트레이딩 툴인 메타트레이더를 사용하여 최신 EA와 시그널 서비스를 직관적으로 활용할 수 있습니다.

### 3. 주의해야 할 단 한 가지

해외 브로커는 국내 법의 보호를 받지 못합니다. 따라서 **라이선스(FCA, ASIC 등)가 확실한 검증된 브로커**를 선택하는 것이 무엇보다 중요합니다. 트레이아는 10년 이상 무사고를 기록 중인 안전한 곳만을 안내합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1591696208202-731934149231?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[브로커] 사기 안 당하는 브로커 선택 기준 5가지",
    category: "브로커 가이드",
    excerpt: "내 소중한 원금을 지키는 첫 걸음. 출금이 막히지 않는 정식 라이선스 브로커를 고르는 필수 체크리스트를 공개합니다.",
    content: `### 1. 글로벌 규제 기관의 라이선스 (가장 중요)

영국의 **FCA**, 호주의 **ASIC** 등 엄격한 금융 당국의 규제를 받는 브로커인지 확인하세요. 이름뿐인 군소 국가의 라이선스만 가진 곳은 피해야 합니다.

### 2. 입출금 안정성 및 속도

트레이딩을 잘해도 돈을 못 빼면 의미가 없습니다. 입출금 사고 이력이 없는지, 그리고 평균적으로 24시간 이내에 처리가 완료되는지 점검하십시오.

### 3. 스프레드와 체결 속도

수익과 직결되는 문제입니다. 변동성이 터질 때 스프레드가 과하게 벌어지지 않고, 주문이 밀리지 않고 즉시 체결되는 인프라를 갖춰야 합니다.

### 4. 고객 지원 시스템 (한국어 지원 여부)

문제가 생겼을 때 바로 소통할 수 있는 한국어 상담 채널이 있는지 중요합니다. 소통이 안 되는 곳은 리스크 상황에서 대처가 불가능합니다.

### 5. EA 및 시그널 서비스 허용 여부

일부 질 낮은 브로커들은 수익이 나는 자동매매를 교묘하게 방해하곤 합니다. 트레아는 자동매매에 최적화된 높은 유동성을 제공하는 브로커만을 엄선합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1454165833267-033c215839dc?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[사기 예방] 사기 리딩방 구별법: 이런 곳은 무조건 피하세요",
    category: "보안 가이드",
    excerpt: "당신의 계좌를 노리는 달콤한 유혹. 텔레그램이나 카톡방에서 벌어지는 전형적인 리딩 사기 수법을 폭로합니다.",
    content: `### 1. '원금 보장'과 '고수익'의 조화

경제학의 기본 원칙은 '하이 리스크 하일 리턴'입니다. 원금을 보장해주면서 한 달에 몇십 퍼센트씩 벌어주겠다는 말은 100% 거짓말입니다.

### 2. 바람잡이의 향연

사기 리딩방에는 가짜 수익 인증을 올리는 '알바'들이 가득합니다. "관리자님 덕분에 집 샀어요" 같은 말도 안 되는 간증 글에 현혹되지 마십시오.

### 3. 특정 가짜 플랫폼 가입 유도

세계적으로 유명한 MT5가 아니라, 자기들이 직접 만든 희한한 사이트나 앱에 가입하여 돈을 입금하게 한다면 절대 하지 마십시오. 그 돈은 다시는 돌려받을 수 없습니다.

### 4. 전문가의 조언

트레이딩은 본인이 직접 기술을 익히거나, 검증된 시스템과 마운트되어야 합니다. 얼굴도 모르는 '리딩방 선생'에게 소중한 자산을 맡기지 마세요. 트레이아의 모든 정보는 투명하게 공개된 데이터를 지향합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[사기 예방] 불법 다단계 및 피싱 사이트 식별법",
    category: "보안 가이드",
    excerpt: "유명 브로커의 디자인을 그대로 베낀 피싱 사이트와 지인 추천을 강조하는 다단계 조직의 특징을 상세히 알아봅니다.",
    content: `### 1. 피싱 사이트(Phishing) 주의

브로커 본사와 도메인 주소가 한 글자만 다르거나, 레이아웃이 조잡한 사이트가 많습니다. 반드시 공식 링크를 통해서만 접속하고 계정 정보를 입력하십시오.

### 2. 다단계(MLM) 구조의 특징

수익이 매매에서 나는 것이 아니라, 밑에 사람을 데려온 수수료에서 나온다면 이는 전형적인 다단계입니다. 이런 곳은 결국 마지막에 가입한 사람들의 돈을 들고 도망치는 '폰지 사기'로 끝납니다.

### 3. 리베이트(Rebate) 사기

"수수료를 100% 돌려주겠다"며 하이브리드 계좌 가입을 유도한 뒤, 교묘하게 고객의 매매를 반대 포지션으로 잡아 돈을 잃게 만드는 수법도 조심해야 합니다. 

트레이아는 어떠한 지인 모집이나 다단계 보너스를 운영하지 않습니다. 오직 하드웨어와 소프트웨어의 우수성으로 증명합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[사기 예방] '수익 보장' 광고의 위험한 진실",
    category: "보안 가이드",
    excerpt: "세상에 공짜 점심은 없습니다. '손실 없는 투자'라는 마케팅 뒤에 숨겨진 함정과 금융 사기의 끝을 경고합니다.",
    content: `### 1. 금융 사고의 99%는 '욕심'에서 시작된다

사기꾼들은 인간의 가장 취약한 지점인 '조급함'과 '공포'를 공략합니다. "지금 안 하면 기회를 놓친다"거나 "리스크 0%"라는 말로 이성적인 판단을 흐리게 만듭니다.

### 2. 가짜 거래 데이터에 속지 마세요

수익 인증 샷은 포토샵으로 얼마든지 조작 가능합니다. 제3자 검증 사이트(예: Myfxbook, MQL5 Signals)의 변조 불가능한 데이터가 아니라면 절대 믿지 마십시오.

### 3. 정직한 트레이딩을 하십시오

수익은 불확실한 미래의 영역이지만, 리스크는 내가 관리할 수 있는 통제의 영역입니다. 리스크를 인정하고 그것을 관리할 때 비로소 진짜 수익이 시작됩니다. 트레이아는 여러분께 '가짜 꿈'을 팔지 않고, '실전 무기'를 제공합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
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
