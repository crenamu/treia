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
    title: "[실전 기법] 볼륨 프로파일 매매: 스마트 머니의 매집 구간을 찾아서",
    category: "실전 기법",
    excerpt: "단순 캔들 분석을 넘어, 특정 가격대에서 발생한 실질 거래량을 분석하여 세력의 지지와 저항을 찾아내는 고급 기법을 공개합니다.",
    content: `### 1. 볼륨 프로파일(Volume Profile)이란?

일반적인 거래량 지표가 '시간'에 따른 거래의 양을 보여준다면, **볼륨 프로파일**은 특정 '가격대'에서 얼마나 많은 거래가 일어났는지를 수평으로 보여줍니다. 이는 시장 참여자들이 어떤 가격을 가장 매력적으로 느꼈는지(Value Area), 혹은 어떤 가격을 강하게 거부했는지를 보여주는 가장 투명한 지도입니다.

### 2. POC(Point of Control)의 이해

포인트 오브 컨트롤(POC)은 해당 기간 동안 **가장 많은 거래가 터진 중심 가격대**입니다. 스마트 머니(세력)의 평균 단가가 머무를 가능성이 높은 이 구간은 향후 강력한 자석처럼 가격을 끌어당기거나, 돌파하기 힘든 저항벽 역할을 합니다.

### 3. 실전 매매 전략: 고가치 구간(VA) 활용법

1.  **VAH (Value Area High):** 참여자들이 비싸다고 느끼기 시작하는 구간입니다.
2.  **VAL (Value Area Low):** 참여자들이 저렴하다고 느끼기 시작하는 지지 구간입니다.
3.  **돌파 매매:** 가격이 VA 구간을 강하게 뚫고 나갈 때, 이는 새로운 추세의 시작을 의미하며 볼륨 프로파일의 '저거래 구간'을 빠르게 관통하는 경향이 있습니다.

### 4. 트레이아 EA와의 조화

트레이아의 자동매매 시스템은 이러한 볼륨 프로파일의 확률적 우위를 알고리즘에 녹여내어, 무의미한 횡보 구간에서의 진입을 억제하고 변동성이 터지는 지점에서 정밀한 타점을 노립니다.`,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "고급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[EA 운용] Gold EA 최적화 전략: 하이 레버리지와 변동성 컨트롤",
    category: "EA 운용",
    excerpt: "골드 시장의 극심한 변동성을 안정적인 수익으로 바꾸기 위한 트레이아 EA 전용 설정법과 리스크 관리 원칙을 설명합니다.",
    content: `### 1. 골드(XAUUSD) 시장의 특수성

골드는 다른 통화쌍과 비교할 수 없을 정도의 **높은 틱 가치**와 **빠른 변동성**을 가지고 있습니다. 일반적인 EA를 그대로 적용하면 휩소(Whipsaw) 장세에서 큰 손실을 보기 쉽습니다. 트레이아 Gold EA는 이러한 골드 전용 매커니즘에 최적화된 로직을 탑재하고 있습니다.

### 2. 최적의 로트(Lot) 설정 가이드

성공적인 EA 운용의 80%는 시스템 설정에서 결정됩니다.

*   **보수적 운용:** 1,000불당 0.01로트 미만. 계좌의 장기적 우상향을 목표로 합니다.
*   **공격적 운용:** 1,000불당 0.03로트. 충분한 증거금이 확보된 상태에서 복리 수익을 극대화할 때 사용합니다.
*   **손절선(Take-Profit/Stop-Loss):** 골드의 평균 변동폭(ATR)에 맞춘 유동적인 익절·손절 라인을 설정해야 합니다.

### 3. 뉴스와 이벤트 대응

지표 발표 시에는 EA의 일시 정지를 권장합니다. 특히 미 비농업 고용지표(NFP)나 FOMC 금리 결정 시기에는 차트의 로직이 무너지는 광폭한 흐름이 나타날 수 있습니다. 

### 4. 정기적인 최적화(Optimization)

시장은 살아있는 생물처럼 계속 변합니다. 6개월 전의 파라미터가 오늘날의 시장 흐름과 맞지 않을 수 있습니다. 트레이아 커뮤니티에서 공유되는 **공식 셋업 파일(.set)**을 정기적으로 업데이트하여 최상의 시스템 컨디션을 유지하십시오.`,
    thumbnail: "https://images.unsplash.com/photo-1614028674016-81c81358c2da?auto=format&fit=crop&q=80&w=800",
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
      await addDoc(colRef, {
        ...post,
        createdAt: serverTimestamp()
      });
      console.log(`✅ 포스팅 추가 완료: ${post.title}`);
    } else {
      console.log(`⚠️ 이미 존재하는 포스팅: ${post.title}`);
    }
  }
}

seed().catch(console.error);
