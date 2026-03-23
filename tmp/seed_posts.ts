import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const samplePosts = [
	{
		title: "Gold(XAUUSD) 1시간봉 돌파 전략 공유",
		author: "트레이아 마스터",
		userId: "admin_master",
		content: `
      최근 골드 1시간봉 기준 주요 저항선(#2645)을 강하게 돌파하는 흐름이 포착되었습니다.
      
      [주요 포인트]
      1. 거래량 동반한 장대양봉 출현
      2. RSI 60 이상 상향 돌파
      3. 손절가: #2620
      
      개인적인 견해이므로 투자 참고용으로만 활용하세요.
    `,
		category: "자유게시판",
		likes: 12,
		comments: 3,
		timestamp: Timestamp.now(),
		verificationStatus: "verified",
		isHot: true,
	},
	{
		title: "[질문] 나스닥 숏 진입 시점 봐주실 분?",
		author: "열공트레이더",
		userId: "user_123",
		content:
			"현재 최고점 부근에서 다이버전스가 발생하는 것 같은데, 지금 진입해도 괜찮을까요? 차트 분석 잘하시는 분들 답변 부탁드립니다!",
		category: "질문/답변",
		likes: 2,
		comments: 8,
		timestamp: Timestamp.now(),
		verificationStatus: "none",
	},
	{
		title: "뉴욕 세션 시작 전 체크해야 할 3가지",
		author: "데일리브리핑",
		userId: "user_456",
		content:
			"1. 실업수당 청구 건수 발표\n2. 연준 위원 발언\n3. 기술주 선물 동향\n\n지표 발표 후 변동성 주의하시기 바랍니다.",
		category: "정보공유",
		likes: 25,
		comments: 5,
		timestamp: Timestamp.now(),
		verificationStatus: "community",
	},
	{
		title: "초보를 위한 지지/저항 잡는 법 (기초)",
		author: "교육팀장",
		userId: "admin_edu",
		content:
			"지지와 저항은 트레이딩의 가장 기본입니다. 선을 긋는 것이 중요한 것이 아니라, 그 가격대에서 왜 매도/매수세가 붙었는지 이해하는 것이 핵심입니다.",
		category: "강의/교육",
		likes: 45,
		comments: 12,
		timestamp: Timestamp.now(),
		verificationStatus: "verified",
	},
];

async function seed() {
	console.log("Starting seed...");
	for (const post of samplePosts) {
		try {
			const docRef = await addDoc(collection(db, "community_posts"), post);
			console.log(`Added post with ID: ${docRef.id}`);
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	}
	console.log("Seed finished.");
	process.exit(0);
}

seed();
