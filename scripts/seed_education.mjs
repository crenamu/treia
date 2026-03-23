import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import {
	addDoc,
	collection,
	getDocs,
	getFirestore,
	query,
	serverTimestamp,
	where,
} from "firebase/firestore";

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const posts = [
	// --- 1. CFD 기초 ---
	{
		title: "[CFD 기초] 마진(Margin)이란? 초보자용 증거금 완벽 가이드",
		category: "CFD 기초",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1554224155-1697480ee27a?auto=format&fit=crop&q=80&w=800",
		excerpt: "레버리지 매매의 핵심인 마진의 개념을 배웁니다.",
	},
	{
		title: "[CFD 기초] 스프레드와 수수료: 거래 시작 전 반드시 체크할 비용",
		category: "CFD 기초",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1633151821814-110034a7800c?auto=format&fit=crop&q=80&w=800",
		excerpt: "스프레드와 수수료 구조를 투명하게 공개합니다.",
	},
	{
		title: "[CFD 기초] 로트(Lot)와 Pip: 내 수익금은 어떻게 계산되나?",
		category: "CFD 기초",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1591696208202-731934149231?auto=format&fit=crop&q=80&w=800",
		excerpt: "트레이딩의 화폐 단위인 핍(Pip)의 개념을 알아봅니다.",
	},
	{
		title: "[CFD 기초] 마진콜과 스탑아웃: 계좌가 터지는 공포의 순간",
		category: "CFD 기초",
		difficulty: "고급",
		thumbnail:
			"https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=800",
		excerpt: "강제 청산의 원리와 방어법을 다룹니다.",
	},
	{
		title: "[CFD 기초] 롱(매수)과 숏(매도): 하락장에서도 수익을 내는 법",
		category: "CFD 기초",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1611974714652-960205d8bc11?auto=format&fit=crop&q=80&w=800",
		excerpt: "하락 베팅의 개념을 완벽히 정리합니다.",
	},
	{
		title: "[CFD 기초] 스왑(Swap) 이자: 보유만 해도 돈이 나간다?",
		category: "CFD 기초",
		difficulty: "중급",
		thumbnail:
			"https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800",
		excerpt: "오버나이트 이자의 정체를 밝힙니다.",
	},

	// --- 2. 골드 특화 ---
	{
		title: "[골드 특화] 왜 골드인가? 골드 트레이딩의 폭발적인 매력",
		category: "골드 특화",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
		excerpt: "전 세계 트레이더들이 열광하는 골드의 매력.",
	},
	{
		title: "[골드 특화] 골드 트레이딩 시 자주 하는 실수 TOP 5",
		category: "골드 특화",
		difficulty: "중급",
		thumbnail:
			"https://images.unsplash.com/photo-1614028674016-81c81358c2da?auto=format&fit=crop&q=80&w=800",
		excerpt: "초보자들이 골드에서 파산하는 전형적인 이유들.",
	},
	{
		title: "[골드분석] 골드 가격의 4대 엔진: 무엇이 금값을 움직이나?",
		category: "골드 분석",
		difficulty: "중급",
		thumbnail:
			"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
		excerpt: "금리, 달러, 전쟁 등 골드의 4대 동인 분석.",
	},
	{
		title: "[골드분석] 골드 시장의 시간표: 아시아-유럽-뉴욕 세션별 특징",
		category: "골드 분석",
		difficulty: "중급",
		thumbnail:
			"https://images.unsplash.com/photo-1508921234172-73891048f766?auto=format&fit=crop&q=80&w=800",
		excerpt: "세션별 변동성과 매매 적기 분석.",
	},

	// --- 3. 기술적 분석 ---
	{
		title: "[기술적 분석] 캔들스틱 기초: 차트가 우리에게 건네는 첫마디",
		category: "기술적 분석",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1614028674016-81c81358c2da?auto=format&fit=crop&q=80&w=800",
		excerpt: "시/고/저/종 캔들에 담긴 트레이더의 심리.",
	},
	{
		title: "[기술적 분석] 필수 캔들 패턴: 세력의 의도가 읽히는 결정적 모양",
		category: "기술적 분석",
		difficulty: "중급",
		thumbnail:
			"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
		excerpt: "망치형, 도지, 장악형 등 실전 패턴 가이드.",
	},
	{
		title: "[기술적 분석] 지지와 저항의 심리학: 왜 특정 가격에서 반복되나?",
		category: "기술적 분석",
		difficulty: "중급",
		thumbnail:
			"https://images.unsplash.com/photo-1518186239717-31904a053174?auto=format&fit=crop&q=80&w=800",
		excerpt: "집단 기억이 가격을 지탱하고 억제하는 원리.",
	},
	{
		title:
			"[기술적 분석] 추세 파악법: 추세는 당신의 친구(Trend is your friend)",
		category: "기술적 분석",
		difficulty: "중급",
		thumbnail:
			"https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
		excerpt: "시장의 큰 흐름에 올라타는 기술.",
	},
	{
		title: "[기술적 분석] 이동평균선(MA): 추세의 정석을 배우다",
		category: "기술적 분석",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
		excerpt: "정배열과 역배열을 통한 추세 추종 전략.",
	},

	// --- 4. 리스크 관리 ---
	{
		title: "[리스크 관리] 1% 룰: 계좌 생존을 위한 최고의 방패",
		category: "리스크 관리",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
		excerpt: "전체 자산의 1%만 잃는 수학적 습관.",
	},
	{
		title: "[리스크 관리] 손절(Stop Loss) 설정법: 내 계좌의 생명줄",
		category: "리스크 관리",
		difficulty: "고급",
		thumbnail:
			"https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
		excerpt: "손절선을 차트의 어디에 걸어야 억울하지 않을까?",
	},
	{
		title: "[리스크 관리] 손익비(Risk/Reward ratio): 승률보다 중요한 숫자",
		category: "리스크 관리",
		difficulty: "중급",
		thumbnail:
			"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
		excerpt: "승률이 낮아도 돈을 버는 통계적 모델링.",
	},
	{
		title: "[리스크 관리] 포지션 사이징: 내 잔고에 최적인 로트 계산법",
		category: "리스크 관리",
		difficulty: "고급",
		thumbnail:
			"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
		excerpt: "수학적으로 산출하는 내 계좌 맞춤 로트 수.",
	},

	// --- 5. 자동매매 ---
	{
		title: "[자동매매] EA란 무엇인가? 수동매매와의 결정적 차이 3가지",
		category: "자동매매",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
		excerpt: "24시간 인공지능 트레이더 EA의 개념 설명.",
	},
	{
		title: "[자동매매] MT5 플랫폼 설치 및 기본 사용법 (초보자 튜토리얼)",
		category: "자동매매",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1611974714652-960205d8bc11?auto=format&fit=crop&q=80&w=800",
		excerpt: "메타트레이더 5 설치 단계부터 로그인까지.",
	},
	{
		title: "[자동매매] EA 설치 및 적용법: MQL5 마켓 연동 가이드",
		category: "자동매매",
		difficulty: "중급",
		thumbnail:
			"https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
		excerpt: "내 MT5 차트에 EA를 로드하는 실무 과정.",
	},
	{
		title: "[자동매매] 백테스트와 프런트테스트: 가짜 수익에 속지 마세요",
		category: "자동매매",
		difficulty: "고급",
		thumbnail:
			"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
		excerpt: "과거 데이터와 실시간 데이터 검증의 차이.",
	},

	// --- 6. 카피트레이딩 ---
	{
		title: "[카피트레이딩] 작동 원리: 어떻게 고수의 매매가 내 계좌로 오나?",
		category: "카피트레이딩",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1518186239717-31904a053174?auto=format&fit=crop&q=80&w=800",
		excerpt: "기술적 미러링 시스템의 구조 설명.",
	},
	{
		title: "[카피트레이딩] MQL5 시그널 서비스 사용법: 1분 만에 연동하기",
		category: "카피트레이딩",
		difficulty: "중급",
		thumbnail:
			"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
		excerpt: "시그널 구독 및 복사 설정 실전 스텝.",
	},
	{
		title: "[카피트레이딩] 프로 시그널 고르는 기준 3가지 (MDD, 신뢰도)",
		category: "카피트레이딩",
		difficulty: "고급",
		thumbnail:
			"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
		excerpt: "가짜 고수를 걸러내는 3대 핵심 지표 분석.",
	},

	// --- 7. 브로커 & 보안 ---
	{
		title: "[브로커] 사기 안 당하는 브로커 선택 기준 5가지",
		category: "브로커 가이드",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1454165833267-033c215839dc?auto=format&fit=crop&q=80&w=800",
		excerpt: "라이선스와 입출금 안정성 체크리스트.",
	},
	{
		title: "[사기 예방] 사기 리딩방 구별법: 이런 곳은 무조건 피하세요",
		category: "보안 가이드",
		difficulty: "입문",
		thumbnail:
			"https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
		excerpt: "원금 보장과 허위 스크린샷의 함정 폭로.",
	},
	{
		title: "[트레이딩 심리] 욕심과 공포 다루기: 지표보다 강력한 마음의 근육",
		category: "마인드셋",
		difficulty: "고급",
		thumbnail:
			"https://images.unsplash.com/photo-1518186239717-31904a053174?auto=format&fit=crop&q=80&w=800",
		excerpt: "전문가는 감정을 통제하는 시스템을 가집니다.",
	},
];

async function seed() {
	const colRef = collection(db, "treia_education");
	for (const post of posts) {
		const q = query(colRef, where("title", "==", post.title));
		const snap = await getDocs(q);
		if (snap.empty) {
			await addDoc(colRef, {
				...post,
				content: `본문 내용은 ${post.title}에 특화된 고품질 교육 데이터로 구성되어 있습니다. 상세 내용은 Treia Insight에서 확인하세요.`,
				source: "Treia Official",
				app: "treia",
				isPublished: true,
				createdAt: serverTimestamp(),
			});
			console.log(`✅ ${post.title} 삽입 완료`);
		} else {
			console.log(`⏭️ ${post.title} 이미 존재함`);
		}
	}
}
seed().catch(console.error);
