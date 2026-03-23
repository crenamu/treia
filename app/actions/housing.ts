"use server";

const API_KEY =
	process.env.PUBLIC_DATA_API_KEY?.replace(/["']/g, "").trim() ||
	"2bb8598d5b4ef8adba2cff0deba81e882b560351ddb6987d2d933945af968b32";
// 마이홈포털 API 베이스 URL (LH + SH 통합 공고)
const MYHOME_BASE_URL = `http://apis.data.go.kr/1613000/HWSPR02`;
// 기존 LH API 베이스 URL (백업용)
const LH_BASE_URL = `http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1`;

export interface HousingNotice {
	id: string;
	title: string;
	location: string;
	org: string;
	status: string;
	date: string;
	type: string;
	provider: string;
	link: string;
	description?: string;
}

export async function getHousingNotices(
	page: string = "1",
	pageSize: string = "100",
	id?: string,
) {
	try {
		// 1. 마이홈포털 API 호출 (LH + SH 통합)
		const myHomeUrl = `${MYHOME_BASE_URL}/noticeListGet?serviceKey=${API_KEY}&pageNo=${page}&numOfRows=${pageSize}&type=json`;

		let allNotices: HousingNotice[] = [];

		try {
			const res = await fetch(myHomeUrl, { cache: "no-store" });
			const data = await res.json();

			const items = data?.response?.body?.items?.item || [];
			const itemList = Array.isArray(items) ? items : [items].filter(Boolean);

			if (itemList.length > 0) {
				allNotices = itemList.map((item: any) => ({
					id: item.pblntcId || Math.random().toString(36).substr(2, 9),
					title: item.pblntcNm || "제목 없음",
					location: item.insttNm || "지역 정보 없음",
					org: item.insttNm || "공급 기관",
					status: item.pblntcSttsNm || "공고중",
					date: `${item.pblntcStartDt || ""} ~ ${item.pblntcEndDt || "상시"}`,
					type: item.houseSeNm || "임대주택",
					provider: item.insttNm?.includes("서울") ? "SH" : "LH",
					link: `https://www.myhome.go.kr/hws/portal/sch/selectNoticeDetailView.do?pblntcId=${item.pblntcId}`,
				}));
			}
		} catch (e) {
			console.error("MyHome API Error:", e);
		}

		// 2. 만약 마이홈 데이터가 부족하면 기존 LH API로 보완 (데이터 가용성 확보)
		if (allNotices.length < 5) {
			const AIS_TYPES = ["03", "04", "05", "06"];
			const lhResults = await Promise.all(
				AIS_TYPES.map(async (type) => {
					const url = `${LH_BASE_URL}?serviceKey=${API_KEY}&numOfRows=50&pageNo=1&UPP_AIS_TP_CD=${type}&_type=json`;
					try {
						const res = await fetch(url, { cache: "no-store" });
						return await res.json();
					} catch {
						return null;
					}
				}),
			);

			lhResults.forEach((data) => {
				const actualData = data?.body || data;
				const dsList = Array.isArray(actualData)
					? actualData[1]?.dsList
					: actualData?.dsList || actualData?.items || [];
				if (dsList && Array.isArray(dsList)) {
					const formatted = dsList.map((item: any) => ({
						id:
							item.PAN_ID ||
							item.panId ||
							Math.random().toString(36).substr(2, 9),
						title: item.PAN_NM || item.panNm || "제목 없음",
						location: item.CNP_CD_NM || item.cnpCdNm || "지역 정보 없음",
						org: item.AIS_TP_CD_NM || item.aisTpCdNm || "공급 기관",
						status: item.PAN_ST_NM || item.panStNm || "상태 미정",
						date: `${item.PAN_NT_ST_DT || item.panNtStDt || ""} ~ ${item.CLSG_DT || item.clsgDt || "상시"}`,
						type: item.AIS_TP_CD_NM || item.aisTpCdNm || "임대 주택",
						provider: "LH",
						link: item.DTL_URL || item.dtlUrl || "https://apply.lh.or.kr",
					}));
					allNotices = [...allNotices, ...formatted];
				}
			});
		}

		// 중복 제거 및 정렬
		const uniqueNotices = Array.from(
			new Map(allNotices.map((item) => [item.id, item])).values(),
		);
		uniqueNotices.sort((a, b) => b.date.localeCompare(a.date));

		if (uniqueNotices.length > 0) {
			if (id) {
				const found = uniqueNotices.find((n) => n.id === id);
				return { notice: found, isMock: false };
			}
			return { notices: uniqueNotices, isMock: false };
		}

		// 데이터가 없는 경우를 대비한 풍부한 Mock 생성
		const richMock = generateHousingMock();
		if (id)
			return {
				notice: richMock.find((n) => n.id === id) || richMock[0],
				isMock: true,
			};
		return { notices: richMock, isMock: true };
	} catch (error) {
		const richMock = generateHousingMock();
		return { notices: richMock, isMock: true };
	}
}

function generateHousingMock(): HousingNotice[] {
	return [
		{
			id: "MOCK_1",
			title: "[AI분석] 서울 마곡지구 9단지 공공임대 입주자 모집",
			location: "서울특별시 강서구",
			org: "SH공사",
			status: "접수중",
			date: "2026.03.10 ~ 2026.03.25",
			type: "공공임대",
			provider: "SH",
			link: "https://www.i-sh.co.kr",
		},
		{
			id: "MOCK_2",
			title: "인천 검단 AA10-1블록 통합공공임대주택 모집",
			location: "인천광역시 서구",
			org: "LH인천지역본부",
			status: "접수중",
			date: "2026.03.12 ~ 2026.03.30",
			type: "통합공공임대",
			provider: "LH",
			link: "https://apply.lh.or.kr",
		},
		{
			id: "MOCK_3",
			title: "경기 고양 장항 A-1블록 행복주택 예비자 모집",
			location: "경기도 고양시",
			org: "LH경기북부본부",
			status: "공고중",
			date: "2026.03.15 ~ 2026.04.05",
			type: "행복주택",
			provider: "LH",
			link: "https://apply.lh.or.kr",
		},
		{
			id: "MOCK_4",
			title: "서울 번동3단지 영구임대주택 예비입주자 모집",
			location: "서울특별시 강북구",
			org: "LH서울본부",
			status: "접수중",
			date: "2026.03.05 ~ 2026.03.20",
			type: "영구임대",
			provider: "LH",
			link: "https://apply.lh.or.kr",
		},
	];
}
