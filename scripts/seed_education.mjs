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
    title: "[자동매매] EA란 무엇인가? 수동매매와의 결정적 차이 3가지",
    category: "자동매매",
    excerpt: "24시간 깨어있는 인공지능 트레이더, Expert Advisor(EA)의 개념과 왜 수동매매보다 유리한지 파헤칩니다.",
    content: `### 1. 전문가의 뇌를 복제한 코드, EA

**EA(Expert Advisor)**는 트레이딩 전문가의 매매 로직을 프로그램 코드로 변환한 소프트웨어입니다. MT5 플랫폼 위에서 작동하며, 여러분이 잠든 사이에도 시장을 감시하고 정해진 규칙에 따라 스스로 매매를 체결합니다.

### 2. 수동매매와 무엇이 다른가?

1.  **감정의 배제:** 기계는 두려움이나 탐욕을 느끼지 않습니다. 손절 지점에서 망설이지 않고, 익절 지점에서 욕심부리지 않습니다.
2.  **24시간 감시:** 시장은 밤낮없이 열립니다. 인간은 잠을 자야 하지만, EA는 뉴욕 장 새벽 3시의 급격한 변동성도 놓치지 않고 대응합니다.
3.  **정밀한 계산:** 0.1초의 찰나에 복잡한 수치 분석을 마치고 오차 없이 로트 수를 계산합니다.

### 3. 성공적인 EA 운용의 전제 조건

EA는 마법의 방망이가 아닙니다. 시장의 성격에 맞는 올바른 로직을 선택하고, 정기적으로 성능을 점검하는 **'운전자의 능력'**이 뒤따라야 진정한 무기가 됩니다.`,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[자동매매] MT5 플랫폼 설치 및 기본 사용법 (초보자 튜토리얼)",
    category: "자동매매",
    excerpt: "전 세계 프로 트레이더들의 표준, 메타트레이더 5(MT5)를 설치하고 차트를 띄우는 첫 걸음을 안내합니다.",
    content: `### 1. 왜 MT5인가?

MT5는 이전 버전인 MT4보다 훨씬 빠른 실행 속도와 강력한 백테스트 엔진을 가지고 있습니다. 트레이아의 모든 최첨단 EA들은 MT5 환경에 최적화되어 개발되었습니다.

### 2. 설치 및 로그인 단계

1.  **브로커 홈페이지 접속:** 트레이아가 제안하는 공식 브로커 페이지에서 MT5 설치 파일을 다운로드합니다.
2.  **계좌 정보 입력:** 로그인 ID와 비밀번호, 그리고 브로커 서버 이름을 정확히 선택해야 접속이 가능합니다.
3.  **차트 기본 세팅:** 'Market Watch' 창에서 골드(XAUUSD)를 우클릭하여 차트를 띄우고, 원하는 타임프레임을 설정합니다.

### 3. 핵심 단추 3가지

*   **Algo Trading (알고 트레이딩):** 이 버튼이 녹색으로 켜져 있어야 EA가 작동합니다.
*   **Navigator (탐색기):** 내가 설치한 EA와 보조지표를 관리하는 곳입니다.
*   **Terminal (도구 창):** 현재 진행 중인 매매와 잔고를 한눈에 보는 하단 창입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1611974714652-960205d8bc11?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[자동매매] EA 설치 및 적용법: MQL5 마켓 연동 가이드",
    category: "자동매매",
    excerpt: "좋은 EA를 내 MT5 차트에 올리는 현실적인 방법. MQL5 커뮤니티 계정 연동부터 적용 후 점검까지 상세히 다룹니다.",
    content: `### 1. MQL5 커뮤니티 연동

MT5의 강력한 점은 전 세계 트레이더들이 공유하는 마켓(Market)을 바로 쓸 수 있다는 것입니다.

1.  MT5 상단 메뉴 **[Tools] -> [Options] -> [Community]** 탭에서 MQL5 ID로 로그인합니다.
2.  하단 **[Market]** 탭에서 원하는 EA를 검색하거나, 내가 이미 구매/대여한 파일을 확인합니다.

### 2. 차트에 EA 입히기

1.  탐색기(Navigator) 창에서 EA를 마우스로 끌어(Drag & Drop) 원하는 차트 위에 놓습니다.
2.  설정창 **[Common]** 탭에서 'Allow Algo Trading'에 체크합니다.
3.  **[Inputs]** 탭에서 전략 파일(.set)을 불러오거나 로트 수를 조정합니다.

### 3. 24시간 안정성 유지 (VPS 강조)

집의 PC를 24시간 켜기보다는 **가상 전용 서버(VPS)** 사용을 강력히 권장합니다. 인터넷 끊김이나 정전 걱정 없이 EA가 안정적으로 시장에 대응할 수 있는 가장 확실한 투자입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[카피트레이딩] MQL5 시그널 서비스 사용법: 1분 만에 연동하기",
    category: "카피트레이딩",
    excerpt: "고수의 타점을 내 계좌로 그대로 가져오는 MQL5 시그널 서비스를 구독하고 설정하는 실전 단계를 설명합니다.",
    content: `### 1. 시그널(Signals) 탭 활성화

MT5 하단 도구 창의 'Signals' 탭을 누르면 실시간으로 수익을 내고 있는 전 세계 프로들의 계좌가 리스트업됩니다.

### 2. 구독 및 설정 프로세스

1.  **마음에 드는 시그널 선택:** 수익률, MDD(최대낙폭), 구독료를 확인합니다.
2.  **구독 신청:** MQL5 잔액을 사용하여 구독을 완료합니다.
3.  **중요한 설정 옵션:** 'Copy Stop Loss and Take Profit'에 체크하여 마스터의 손절선을 그대로 따르게 설정하십시오.

### 3. 복사 시 주의사항 (Slippage)

마스터와 나의 브로커가 다를 경우 아주 약간의 가격 차이(슬리피지)가 발생할 수 있습니다. 가급적 마스터와 동일하거나 레이턴시가 낮은 서버를 사용하는 브로커를 선택하는 것이 복사 품질을 높이는 비결입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[카피트레이딩] 프로 시그널 고르는 기준 3가지 (MDD, 신뢰도)",
    category: "카피트레이딩",
    excerpt: "단순히 수익률만 보고 따라가면 계좌가 위험해집니다. MDD와 Reliability 지표를 분석하여 '가짜 고수'를 걸러내는 법을 배웁니다.",
    content: `### 1. 수익률보다 중요한 MDD (최대낙폭)

누적 수익률이 1,000%라도 중간에 계좌가 반 토막(MDD 50%) 난 적이 있다면 그 시그널은 도박에 가깝습니다. 안정적인 중복사 성장을 원한다면 **MDD가 20% 미만**인 시그널을 우선적으로 검토하세요.

### 2. 신뢰도(Reliability) 지표의 이해

MQL5는 자체 알고리즘으로 시그널의 위험도를 측정합니다. 별 점수나 신뢰도 게이지가 낮은 시그널은 갑자기 큰 위험에 노출될 가능성이 높습니다.

### 3. 트랙 레코드 기간 (최소 6개월 이상)

한두 달의 반짝 수익은 운일 수 있습니다. 상승장, 하락장, 횡보장을 모두 겪으며 살아남은 **최소 6개월 이상의 기록**이 있는 시그널만 믿으십시오. 안정적인 '복리의 마법'은 검증된 인내심에서 나옵니다.`,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
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
