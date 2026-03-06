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
    title: "[카피트레이딩] 복사만 하면 정말 수익이 날까? 카피트레이딩의 작동 원리",
    category: "카피트레이딩",
    excerpt: "내 계좌가 어떻게 고수의 매매를 그대로 따라가는지, 기술적인 작동 방식과 복사 전 반드시 알아야 할 기초 상식을 알아봅니다.",
    content: `### 1. 카피트레이딩(Copy Trading)이란?

카피트레이딩은 말 그대로 **'마스터 트레이더(Master)'**의 매매 사그널을 내 계좌가 **'실시간으로 복사(Mirroring)'**하여 그대로 실행하는 방식입니다. 마스터가 매수 버튼을 누르면, 0.1초 만에 내 계좌에서도 같은 종목의 매수 주문이 나갑니다.

### 2. 기술적으로 어떻게 가능한가?

우리가 사용하는 MT5 플랫폼은 글로벌 시그널 서버와 연결되어 있습니다. 마스터 트레이더가 주문을 넣으면 서버가 이를 감지하고, 해당 마스터를 구독 중인 모든 '팔로워'들의 계좌로 동일한 명령어를 전송합니다. 이때 내 컴퓨터나 휴대폰이 꺼져 있어도 가상 서버(VPS)를 통해 24시간 복사가 유지됩니다.

### 3. 복사 비율(Ratio)의 중요성

내 계좌 잔고가 1,000불이고 마스터의 잔고가 10,000불이라면, 시스템은 자동으로 **비례 배분**을 계산합니다. 마스터가 1.0로트를 진입할 때 내 계좌는 0.1로트만 진입하여 리스크를 동일하게 맞추는 것이 핵심입니다.

### 4. 카피트레이딩의 장점과 한계

*   **장점:** 차트를 하루 종일 볼 필요가 없으며, 풍부한 경험을 가진 고수의 타점을 그대로 공유받을 수 있습니다.
*   **한계:** 마스터와 내 계좌 사이의 지연(Latency)이 발생할 수 있으며, 마스터의 심리적 변화나 실수를 그대로 감내해야 합니다.

복사 버튼을 누르기 전, 해당 마스터의 최소 1년 치 '트랙 레코드'를 확인하는 습관을 들이세요. 트레이아는 검증된 시그널만을 선별하여 안내합니다.`,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[CFD 기초] CFD란 무엇인가? 주식과 결정적 차이 3가지",
    category: "CFD 기초",
    excerpt: "소유하지 않고 가격의 차이에만 투자하는 CFD 트레이딩의 개념을 이해하고, 현물 주식보다 유리한 점이 무엇인지 분석합니다.",
    content: `### 1. CFD(Contract For Difference)의 개념

CFD는 '차익 결제 거래'라고 부릅니다. 내가 실제로 금괴를 사거나 삼성전자 주식을 내 금고에 보관하는 것이 아니라, 그 물건의 **'가격이 변하는 폭'**만큼만 현금으로 정산하는 계약입니다. 

### 2. 현물 주식과 무엇이 다른가?

1.  **양방향 매매(Long & Short):** 일반 주식은 가격이 올라야만 벌지만, CFD는 가격이 떨어질 때(매도)도 수익을 낼 수 있습니다. 하락장에서도 기회가 열려 있다는 뜻입니다.
2.  **레버리지 활용:** 내 자본금보다 몇 배, 몇십 배 큰 규모의 거래가 가능합니다. 적은 시드로도 효율적인 자산 운용이 가능해집니다.
3.  **소유권 없음:** 배당금이나 의결권은 없지만, 대신 거래 비용이 저렴하고 즉각적인 현금화가 가능합니다.

### 3. 왜 CFD를 선택하는가?

변동성이 큰 골드(GOLD)나 나스닥(NAS100) 같은 종목을 거래할 때 CFD는 가장 강력한 도구가 됩니다. 복잡한 절차 없이 클릭 한 번으로 전 세계 자산에 투자할 수 있는 유연함 때문입니다.

하지만 레버리지는 '양날의 검'임을 잊지 마십시오. 수익이 커지는 만큼 손실의 속도도 빨라질 수 있습니다.`,
    thumbnail: "https://images.unsplash.com/photo-1611974714652-960205d8bc11?auto=format&fit=crop&q=80&w=800",
    app: "treia",
    isPublished: true,
    difficulty: "입문",
    source: "Treia Official",
    createdAt: new Date()
  },
  {
    title: "[리스크 관리] 1% 룰: 전설적 트레이더들이 계좌를 지키는 비결",
    category: "리스크 관리",
    excerpt: "단 한 번의 큰 손실로 시장에서 쫓겨나지 않으려면 어떻게 자금을 배분해야 하는가? 통계적 파산을 막는 1%의 마법을 공개합니다.",
    content: `### 1. 왜 1%인가?

많은 초보 트레이더들이 한 번의 확실해 보이는 타점에 전체 자산의 20%, 50%를 겁니다. 하지만 90%의 승률을 가진 전략이라도 **연속 5번의 손절**은 수학적으로 충분히 일어날 수 있는 일입니다. 만약 20%씩 걸었다면 내 계좌는 단 5번 만에 0이 됩니다.

### 2. 1% 룰의 작동 방식

간단합니다. 내가 가진 총 잔고가 1,000만원이라면, 한 번의 매매에서 '손절'했을 때 잃는 금액이 **10만원(1%)**을 넘지 않도록 로트(Lot) 수와 손절 폭을 조절하는 것입니다.

### 3. 심리적 안정과 복리의 마법

*   **심리적 안정:** 한 번 졌을 때 계좌의 1%만 줄어든다면, 다음 매매에서 평정심을 유지하기 훨씬 쉽습니다. 
*   **복리 효과:** 계좌가 커짐에 따라 1%에 해당하는 절대 금액도 커집니다. 반대로 계좌가 줄어들면 손실 규모도 줄어들어 자동으로 리스크가 보정됩니다.

### 4. 12년차의 한마디

트레이딩은 100미터 달리기가 아니라 마라톤입니다. 매매 기법보다 중요한 것은 '내가 이 판에서 죽지 않고 살아남는 것'입니다. 1% 룰은 여러분이 시장에서 오래 살아남아 결국 승리하게 해줄 가장 강력한 방패입니다.`,
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
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
      console.log(`✅ ${post.title} 추가 완료`);
    } else {
      console.log(`⚠️ 중복: ${post.title}`);
    }
  }
}
seed().catch(console.error);
