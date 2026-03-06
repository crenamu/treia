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
    title: "[기술적 분석] 추세 파악법: 추세는 당신의 친구(Trend is your friend)",
    category: "기술적 분석",
    excerpt: "시장이 오르는지 내리는지 구분하는 법. 고점과 저점의 변화를 통해 추세의 맥을 짚는 가장 쉬운 방법을 배웁니다.",
    content: `### 1. 추세를 알아야 잔고가 산다

트레이딩 격언 중 가장 유명한 말은 "추세는 당신의 친구다"입니다. 친구와 싸우면(역추세 매매) 상처만 남듯, 추세를 거스르는 매매는 계좌 파산의 1순위 원인입니다.

### 2. 다우 이론(Dow Theory) 기초

추세는 아주 단순하게 정의할 수 있습니다.
*   **상승 추세 (Uptrend):** 고점(High)이 이전보다 높아지고, 저점(Low)도 이전보다 높아지는 상태.
*   **하락 추세 (Downtrend):** 고점이 낮아지고, 저점도 더 낮아지는 상태.
*   **횡보 (Sideways):** 고점과 저점이 일정한 범위 안에 갇혀 있는 상태.

### 3. 추세선(Trendline) 제대로 긋는 법

캔들의 꼬리와 꼬리를 이어 선을 그려보십시오. 이 선이 가파를수록 추세는 강력하지만, 동시에 급격한 반전의 위험도 큽니다. 추세선이 뚫린다는 것은 친구가 등을 돌렸다는 신호입니다. 이때는 미련 없이 포지션을 정리하고 새로운 관계를 준비해야 합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[기술적 분석] 피보나치 되돌림: 자연의 법칙으로 타점 잡기",
    category: "기술적 분석",
    excerpt: "0.618, 0.382... 마법처럼 가격이 튕겨 나가는 피보나치 수열을 활용해 가장 손익비 좋은 진입 자리를 찾는 법을 공개합니다.",
    content: `### 1. 왜 가격은 직선으로 가지 않을까?

가격은 한 방향으로 계속 가다가도 반드시 쉬어가는 '눌림목'이 발생합니다. 이때 어디서 다시 반등할지를 예측하는 도구 중 가장 강력한 것이 **'피보나치 되돌림'**입니다.

### 2. 핵심 수치 3가지

1.  **0.382:** 강력한 추세일 때 살짝 눌리고 갈 때 나타납니다.
2.  **0.50 (절반):** 가장 대중적인 지지 구간입니다.
3.  **0.618 (황금 비율):** 추세가 지속되기 위한 가장 심리적 저항이 강한 '마지막 방어선'입니다.

### 3. 실전 적용 팁

작도를 시작할 때는 최근 발생한 큰 파동의 **'시작점(저점)'과 '끝점(고점)'**을 잇습니다. 지표가 0.618 지점까지 내려왔는데 거기서 '망치형 캔들'이나 '장악형 패턴'이 나온다면? 그곳이 바로 확률이 가장 높은 승부처입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "고급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[기술적 분석] 타임프레임 활용: 숲을 보고 나무를 베는 기술",
    category: "기술적 분석",
    excerpt: "1분 봉에만 집착하면 실패합니다. 주봉부터 분봉까지, 여러 타임프레임을 조합하여 전체 시장의 구도를 읽는 '멀티 타임프레임' 분석법.",
    content: `### 1. 타임프레임의 정의

타임프레임은 시간을 쪼개어 차트를 보는 돋보기와 같습니다. 1분 봉은 시장의 잔물결을, 주봉은 거대한 대양의 흐름을 보여줍니다.

### 2. 멀티 타임프레임 분석 전략

1.  **대추세 파악 (일봉/4시간 봉):** 지금 시장이 큰 배가 어디로 가고 있는지 확인합니다. 배 방향이 상승이라면 매수 타점만 노려야 합니다.
2.  **작업 구간 설정 (1시간 봉):** 지지와 저항, 매물대를 확인하여 내가 싸울 전쟁터를 정합니다.
3.  **세밀한 진입 (15분/5분 봉):** 최적의 가격에 올라타기 위해 타이밍을 잽니다.

### 3. 타임프레임의 오류

작은 분봉에서의 지지는 큰 일봉에서의 저항 한 방에 무너질 수 있습니다. 항상 **높은 시간대의 차트가 우선권**을 갖는다는 대원칙을 잊지 마십시오.`,
    thumbnail: "https://images.unsplash.com/photo-1508921234172-73891048f766?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[리스크 관리] 포지션 사이징: 내 잔고에 최적인 로트 계산법",
    category: "리스크 관리",
    excerpt: "로또처럼 운에 맡기지 마세요. 내 계좌 규모와 손절폭을 바탕으로, 수학적으로 가장 안전한 '로트 사이즈'를 산출하는 공식을 배웁니다.",
    content: `### 1. 로트 수는 운이 아니라 수학입니다

많은 초보자가 "이번엔 느낌이 좋으니 좀 크게 가자"라며 로트 수를 정합니다. 하지만 일관된 수익은 일관된 리크스에서 나옵니다.

### 2. 포지션 사이징 공식

1.  **매매당 리스크 설정:** 내 자산의 1%(예: 1,000불 계좌면 10불)만 잃기로 약속합니다.
2.  **손절 핍(Pip) 거리 측정:** 진입가와 손절가의 차이를 구합니다. (예: 50핍)
3.  **로트 산출:** 10불 / (50핍 X 0.1핍가치) = 결과값이 여러분이 태워야 할 **정확한 로트 수**입니다.

### 3. 왜 이렇게 해야 하나요?

손절 폭이 좁으면 로트를 키울 수 있고, 손절 폭이 넓다면 로트를 줄여야 합니다. 결과적으로 어떤 매매에서 손절을 당하더라도 내 계좌는 똑같이 1%만 줄어듭니다. 이 통제력이 바로 전문가와 도박꾼을 가르는 경계선입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
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
