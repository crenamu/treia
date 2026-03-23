import {
	addDoc,
	collection,
	getDocs,
	query,
	serverTimestamp,
	where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const seedEducation = async () => {
	const educationRef = collection(db, "treia_education");

	// 중복 저장 방지를 위한 간단한 체크
	const q = query(
		educationRef,
		where(
			"title",
			"==",
			"[브로커 가이드] 안전한 트레이딩 환경: 브로커 선택 기준과 팩트 체크",
		),
	);
	const querySnapshot = await getDocs(q);

	if (!querySnapshot.empty) {
		console.log("이미 존재하는 포스팅입니다.");
		return;
	}

	const post = {
		title: "[브로커 가이드] 안전한 트레이딩 환경: 브로커 선택 기준과 팩트 체크",
		category: "브로커 가이드",
		excerpt:
			"해외 브로커에 대한 오해와 진실, 그리고 안전한 거래 환경을 스스로 판별하기 위한 5가지 객관적 기준을 제시합니다.",
		content: `
### 1. 브로커 본체와 유통 경로의 분리
많은 트레이더들이 특정 해외 브로커를 위험하다고 오해하는 이유는, 브로커 자체의 결함보다는 **중간 단계에서 활동하는 불법 다단계 영업직**들의 행태 때문인 경우가 많습니다. 
글로벌 금융 규제 기관(FCA 등)에 가입된 브로커는 시스템적 안정성을 갖추고 있으나, 이를 이용해 "고수익 보장"이나 "지인 모집 인센티브"를 홍보하는 조직은 반드시 피해야 합니다.

### 2. 안전한 브로커 선택을 위한 5가지 객관적 기준
특정 업체의 홍보 문구가 아닌, 아래 5가지 체크리스트를 통해 스스로 판단하시기 바랍니다.

1. **글로벌 규제 기관 등록 여부**: FCA(영국), ASIC(호주), CySEC(키프로스) 등 정식 라이선스 보유 여부.
2. **입출금 신뢰성**: 실제 사용자들의 출금 지연 사례가 없는지 확인.
3. **표준 플랫폼 지원**: 카피트레이딩 및 EA 구동이 용이한 MetaTrader 5(MT5) 지원 여부.
4. **거래 환경**: XAU/USD 기준 적정 스프레드(0.2 내외)와 주문 밀림(Slippage) 최소화 여부.
5. **지원 서비스**: 한국어 문의가 가능하고 최소 입금액이 합리적인가?

### 3. Treia의 입장 및 운영 방침
- **공개 원칙**: 본 플랫폼은 투명성을 위해 운영자가 실제 사용하는 브로커 환경(예: 인피녹스, 한텍 등)을 밝히고 있으나, 이는 **특정 브로커를 추천하기 위함이 아닙니다.**
- **독립적 선택**: 트레이아는 위에서 제시한 객관적 기준에 부합하는 환경에서만 매매 데이터를 추출하며, 사용자는 제공된 기준을 바탕으로 본인에게 가장 적합한 증권사를 **직접 비교하고 선택**해야 합니다.
- **리스크 고지**: 해외 브로커는 국내와 비교해 적은 시드머니로 레버리지를 활용할 수 있는 장점이 있으나, 예금자 보호 범위 등 국가별 법적 보호 체계가 다를 수 있음을 반드시 인지해야 합니다.
    `,
		thumbnail:
			"https://images.unsplash.com/photo-1611974714652-960205d8bc11?auto=format&fit=crop&q=80&w=800",
		isPublished: true,
		order: 1,
		createdAt: serverTimestamp(),
		app: "treia",
	};

	try {
		await addDoc(educationRef, post);
		console.log("교육 콘텐츠 시딩 완료!");
	} catch (error) {
		console.error("Error seeding education:", error);
	}
};

seedEducation();
