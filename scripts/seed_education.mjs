import { db } from '../lib/firebase.js'; // .js extension for ES modules
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/timestamp'; 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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
const firestore = getFirestore(app);

const posts = [
  {
    title: "[브로커 가이드] 안전한 트레이딩 환경: 브로커 선택 기준과 팩트 체크",
    category: "브로커 가이드",
    excerpt: "해외 브로커에 대한 오해와 진실, 그리고 안전한 거래 환경을 스스로 판별하기 위한 5가지 객관적 기준을 제시합니다.",
    content: `### 1. 브로커 본체와 유통 경로의 분리

많은 트레이더들이 특정 해외 브로커를 위험하다고 오해하는 이유는, 브로커 자체의 결함보다는 **중간 단계에서 활동하는 불법 다단계 영업직들의 행태** 때문인 경우가 많습니다. 글로벌 금융 규제 기관(FCA, ASIC 등)에 가입된 브로커는 시스템적 안정성을 갖추고 있으나, 이를 이용해 "고수익 보장"이나 "지인 모집 인센티브"를 홍보하는 조직은 반드시 피해야 합니다.

### 2. 규제 기관(License) 확인의 필수성

브로커의 안전성을 판별하는 가장 확실한 기준은 라이선스입니다. 

*   **1단계 (High-Grade):** 영국 FCA, 호주 ASIC, 미국 NFA. 가장 엄격한 자본금 요건과 투자자 보호 기금을 운영합니다.
*   **2단계 (Mid-Grade):** 키프로스 CySEC. 유럽 내 공신력이 높으며 비교적 유연한 레버리지를 허용합니다.
*   **3단계 (Offshore):** 세이셸, 모리셔스 등. 규제는 약하지만 합법적인 활동이 가능하며, 높은 레버리지를 제공하는 장점이 있습니다.

### 3. 입출금 안정성 및 스프레드 체크

실제로 거래를 시작하기 전, 소액 거래를 통해 다음 항목을 직접 검증해야 합니다.

1.  **입출금 속도:** 영업일 기준 24시간 이내에 처리가 완료되는가?
2.  **슬리피지(Slippage):** 지표 발표 등 변동성 장세에서 주문 체결 오차가 허용 범위 내인가?
3.  **고객 지원:** 한국어 상담 서비스를 지원하며 문제 발생 시 즉각적인 피드백이 오는가?

### 4. 결론: 트레이아의 선택 기준

트레이아는 특정 브로커를 추천하지 않습니다. 다만, 제가 12년간 직접 사용하며 **입출금 사고가 없었고, 주문 체결이 안정적이며, 합리적인 스프레드를 유지하는 곳**을 기준으로 안내를 드립니다. 브로커 선택은 트레이딩의 50%를 결정하는 중요한 기초입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", // 유효한 금융 이미지
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[레버리지] 리스크와 기회의 양날의 검: 레버리지와 증거금 효율적 관리법",
    category: "리스크 관리",
    excerpt: "트레이딩의 규모를 결정짓는 레버리지의 원리와 증거금 관리의 중요성을 통해 계좌의 안전을 지키는 실전 원칙을 알아봅니다.",
    content: `### 1. 레버리지의 본질: '증거금'의 적절한 활용

레버리지는 아주 적은 증거금으로 큰 자산을 운용할 수 있게 해주는 도구입니다. 예를 들어 500배 레버리지를 사용하면, 실제 10,000달러어치의 자산을 단 20달러의 증거금으로 주문할 수 있습니다. 

**중요한 것은**, 레버리지 그 자체가 위험한 것이 아니라 **'본인의 총 잔고 대비 과도한 로트 수(Size)'**를 설정하는 것이 위험의 핵심이라는 점입니다.

### 2. 마진콜(Margin Call)과 강제 청산 방지법

계좌가 파산에 이르는 과정은 단순합니다. 사용 가능한 증거금이 바닥나 '마진 레벨'이 일정 수준 이하(보통 50%~100%)로 떨어지면 브로커가 포지션을 강제로 종료합니다.

1.  **증거금 유지율:** 항상 1,000% 이상의 마진 레벨을 유지할 것을 권장합니다.
2.  **손절매(Stop Loss):** 감정이 개입되지 않도록 기계적으로 손실폭을 제한해야 합니다.
3.  **심리적 마진:** 총 자산의 1~3% 이상을 한 번의 매매에 걸지 않는 원칙이 필요합니다.

### 3. 결론: 똑똑한 레버리지 활용법

레버리지는 적은 시드로 큰 수익을 낼 수 있는 CFD 트레이딩의 강력한 무기입니다. 하지만 이는 안전 장치가 확보되었을 때만 유효합니다. 트레이아 EA(자동매매) 시스템은 이러한 통계적 우위를 바탕으로 리스크를 철저히 관리하도록 설계되어 있습니다.`,
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[시스템 환경] MT5 마스터 가이드: EA 설치부터 실전 운용까지",
    category: "시스템 환경",
    excerpt: "안정적인 자동매매를 위한 최적의 MT5 환경 설정법과 자주 발생하는 에러 코드 대응 가이드까지 상세히 알아봅니다.",
    content: `### 1. MT5 설치 및 EA 환경 최적화

자동매매(EA)의 성패는 알고리즘만큼이나 **안정적인 시스템 환경**에 달려 있습니다. MT5(MetaTrader 5)는 MT4보다 훨씬 강력한 멀티스레딩 기능을 제공하지만, 제대로 된 설정이 수반되어야 그 성능을 온전히 활용할 수 있습니다.

**알고리즘 트레이딩 활성화:**
도구(Tools) > 옵션(Options) > 전문가 상세(Expert Advisors) 탭에서 '알고리즘 트레이딩 허용'에 체크해야 합니다. 또한, 외부 API 연동이 필요한 경우 'WebRequest 허용' 항목에 필요한 URL을 반드시 등록해야 합니다.

### 2. EA 설치 및 차트 적용 프로세스

EA 파일을 올바른 경로에 배치하는 것이 첫걸음입니다.

1.  MT5 상단 메뉴 [파일] > [데이터 폴더 열기] 클릭
2.  MQL5 > Experts 폴더에 .ex5 파일을 복사
3.  MT5 내비게이터(Navigator) 창에서 우클릭 후 '새로고침'
4.  설치된 EA를 원하는 종목 차트(예: XAUUSD)로 드래그 앤 드롭

### 3. 실전 운용 시 주의사항 및 에러 대응

전문 트레이더는 차트에 EA를 걸어두는 것에서 멈추지 않습니다. 하단 '도구 상자'의 **[전문가] 탭과 [로그] 탭**을 수시로 확인하여 명령이 정상적으로 실행되는지 감시해야 합니다.

**자주 발생하는 에러 코드:**
*   **Error 4756:** 주문 발송 실패. 주로 잔고 부족이나 잘못된 로트 수 설정 시 발생합니다.
*   **Error 10027:** 타임아웃. 브로커 서버와의 지연(Latency)이 심할 때 발생하며, 원격 서버(VPS) 사용을 권장합니다.
*   **Disabled Trading:** 브로커가 해당 종목의 거래를 일시적으로 제한했거나, 계좌 인증이 완료되지 않은 경우입니다.

### 4. VPS(원격 서버)의 필요성

24시간 끊김 없는 매매를 위해서는 본인의 PC가 아닌 **해외 VPS(Virtual Private Server)**를 사용하는 것이 필수입니다. 런던이나 뉴욕 등 브로커 서버와 물리적으로 가까운 위치의 VPS를 사용하면 슬리피지를 최소화하고 급격한 변동성 장세에서도 안정적인 대응이 가능합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  }
];

async function seed() {
  const colRef = collection(firestore, "treia_education");
  
  for (const post of posts) {
    const q = query(colRef, where("title", "==", post.title));
    const snap = await getDocs(q);
    
    if (snap.empty) {
      await addDoc(colRef, post);
      console.log(`포스팅 추가 완료: ${post.title}`);
    } else {
      console.log(`이미 존재하는 포스팅입니다: ${post.title}`);
    }
  }
}

seed().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
