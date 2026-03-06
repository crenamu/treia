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
    title: "[기술적 분석] 캔들스틱 기초: 차트가 우리에게 건네는 첫마디",
    category: "기술적 분석",
    excerpt: "시가, 고가, 저가, 종가. 캔들 하나에 담긴 4가지 숫자가 어떻게 트레이더들의 심리적 전투를 보여주는지 알아봅니다.",
    content: `### 1. 캔들은 트레이더들의 대화록입니다

하나의 캔들에는 특정 시간 동안 매수세(황소)와 매도세(곰)가 얼마나 치열하게 싸웠는지가 고스란히 담겨 있습니다. 몸통의 색깔과 꼬리의 길이는 단순한 그림이 아니라 **'누가 이겼는가'**에 대한 결과 보고서입니다.

### 2. 4가지 핵심 데이터 (OHLC)

*   **시가 (Open):** 장이 열릴 때의 가격. 오늘의 기준점입니다.
*   **고가 (High):** 매수세가 도달했던 가장 높은 지점. 저항의 끝입니다.
*   **저가 (Low):** 매도세가 밀어붙였던 가장 낮은 지점. 지지의 끝입니다.
*   **종가 (Close):** 최종 결론. 트레이더들이 가장 중요하게 생각하는 합의 가격입니다.

### 3. 몸통과 꼬리가 말해주는 것

1.  **긴 양봉:** 매수세가 압도적이며 상승 의지가 매우 강함을 뜻합니다.
2.  **긴 윗꼬리:** 올라가려 했으나 강력한 팔자 세력(저항)에 부딪혀 밀려났음을 의미합니다. 하락 반전의 신호가 될 수 있습니다.
3.  **긴 아랫꼬리:** 급락했으나 낮은 가격에서 매수세가 강하게 들어와 가격을 방어했음을 뜻합니다.

캔들을 읽는 법은 외국어를 배우는 것과 같습니다. 이 단어들을 조합해야 '추세'라는 문장을 읽을 수 있습니다.`,
    thumbnail: "https://images.unsplash.com/photo-1614028674016-81c81358c2da?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[기술적 분석] 필수 캔들 패턴: 세력의 의도가 읽히는 결정적 모양",
    category: "기술적 분석",
    excerpt: "망치형, 도지, 장악형 패턴 등 실전 매매에서 반드시 확인해야 할 신뢰도 높은 캔들 조합을 분석합니다.",
    content: `### 1. 망치형(Hammer) - 바닥의 신호

하락하던 차트 끝에서 긴 아랫꼬리를 가진 망치 모양 캔들이 나오면, 이는 하락세가 끝나고 매수세가 주도권을 되찾았다는 강력한 신호입니다. 

### 2. 도지(Doji) - 결정의 순간

시가와 종가가 거의 같아 십자가(+) 모양을 띄는 캔들입니다. 매수와 매도가 팽팽하게 맞서고 있다는 뜻이며, 보통 이 캔들 이후에 거대한 방향성이 터지는 경우가 많습니다.

### 3. 장악형(Engulfing) - 권력의 이동

앞선 캔들을 다음 캔들이 통째로 잡아먹는 모양입니다.
*   **상승 장악형:** 음봉 뒤에 큰 양봉이 나오면 상승 반전을 뜻합니다.
*   **하락 장악형:** 양봉 뒤에 큰 음봉이 나오면 하락의 시작을 알립니다.

### 4. 주의사항

캔들 패턴 하나만 보고 진입하는 것은 도박입니다. 이 패턴이 **'주요 지지/저항선'**이나 **'매물대'** 근처에서 나왔을 때 비로소 70~80% 이상의 신뢰도를 가집니다.`,
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[기술적 분석] 지지와 저항의 심리학: 왜 특정 가격에서 반복되나?",
    category: "기술적 분석",
    excerpt: "작도를 넘어 지지와 저항 배후에 숨겨진 인간의 '후회'와 '희망'이라는 심리적 매커니즘을 심화 분석합니다.",
    content: `### 1. 지지와 저항은 집단 기억의 산물입니다

차트에 줄을 긋는 것이 중요한 게 아니라, 왜 그 선에서 가격이 튕겨 나가는지를 이해해야 합니다. 거기엔 시장 참여자들의 **'세 가지 심리'**가 섞여 있습니다.

### 2. 저항선 배후의 심리

1.  **본전 탈출:** 과거 그 가격에 샀다가 물렸던 사람들이 가격이 다시 오자 "드디어 본전이다!" 하며 매물을 쏟아냅니다.
2.  **숏 포지션 진입:** 고점임을 확신하는 트레이더들이 신규 매도 주문을 넣는 지점입니다.

### 3. 지지선 배후의 심리

1.  **후회하는 참여자:** "저번에 저 가격일 때 살걸" 하고 아쉬워하던 사람들이 가격이 다시 내려오자마자 보란 듯이 삽니다.
2.  **이익 실현:** 숏을 잡았던 사람들이 이제 충분히 내렸다고 판단해 되사기(Covering) 시작합니다.

### 4. 라운드 피겨(Round Figure)의 마법

인간은 본능적으로 딱 떨어지는 숫자(예: 골드 2,500불)에 의미를 부여합니다. 이런 수치 근처에서는 별다른 기술적 이유 없이도 거대한 지지나 저항이 형성됩니다. 이 심리적 마디가를 이해하는 자가 차트의 주인이 됩니다.`,
    thumbnail: "https://images.unsplash.com/photo-1518186239717-31904a053174?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "중급",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[기술적 분석] 매물대(Supply & Demand) 분석: 지지/저항의 진화",
    category: "기술적 분석",
    excerpt: "얇은 선(Line)을 넘어 넓은 구간(Zone)으로 차트를 보는 법. 스마트 머니가 진입한 흔적인 매물대 분석법을 소개합니다.",
    content: `### 1. 선(Line)이 아니라 구역(Zone)이다

지지와 저항을 단 하나의 가격(선)으로만 보면 털릴 확률이 매우 높습니다. 실제 돈이 터진 구간은 일정 **'범위(Zone)'**를 형성합니다. 이를 매물대 혹은 수요와 공급 구역이라 부릅니다.

### 2. 매물대가 형성되는 원리

거대 기관이나 세력은 한 번에 수천 로트를 체결시킬 수 없습니다. 유동성이 부족하기 때문입니다. 그래서 특정 가격대에 머무르며 오랜 시간 물량을 매집(Accumulation)하거나 털어버리는데(Distribution), 이때 차트에 수평적인 박스권이 만들어집니다.

### 3. 실전 활용: 폭발 전의 고요

매물대가 촘촘하게 쌓인 뒤 가격이 그 구간을 **강한 캔들(장대 양봉/음봉)**로 뚫고 나갈 때가 진짜 기회입니다. 이후 가격이 다시 그 매물대로 돌아오는 '리테스트(Retest)' 시점이 가장 손익비 좋은 진입 타점이 됩니다.

선을 긋지 말고 색칠을 해보십시오. 차트에서 돈이 가장 많이 머물렀던 구간이 보이기 시작할 것입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
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
