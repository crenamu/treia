"use server";

const API_KEY =
	process.env.FSS_API_KEY?.replace(/["']/g, "").trim() ||
	"9c6a12617f41e88957bf751f9f8ae193";
const BASE_URL = "https://finlife.fss.or.kr/finlifeapi";
const TOP_GRPS = ["020000", "030300"];

import { TIER_1_BANKS } from "./constants";

export interface LoanOption {
	rpay_type_nm?: string; // 상환 방식 (원리금균등, 원금균등 등)
	lend_rate_type_nm: string; // 금리 방식 (고정, 변동)
	lend_rate_min: number | null; // 최저 금리
	lend_rate_max: number | null; // 최고 금리
	lend_rate_avg: number | null; // 평균 금리
}

export interface LoanProduct {
	fin_prdt_cd: string;
	kor_co_nm: string; // 금융회사명
	fin_prdt_nm: string; // 상품명
	join_way: string; // 가입 방법
	loan_lmt: string; // 대출 한도
	join_member: string; // 가입 대상 추가
	options: LoanOption[];
	bestOption?: LoanOption;
	type: "mortgage" | "rent" | "credit";
	tags: string[]; // 대출 특성 태그 (중도상환수수료 없음, 무직자 가능 등)
}

export async function getLoans(
	type: "mortgage" | "rent" | "credit",
	filters: string[] = [],
	tier: "all" | "1" = "all",
	specificBanks: string[] = [], // 특정 은행 필터 추가
) {
	const endpointMap = {
		mortgage: "mortgageLoanProductsSearch",
		rent: "rentHouseLoanProductsSearch",
		credit: "creditLoanProductsSearch",
	};

	const endpoint = endpointMap[type];

	// 뱅크샐러드급 커버리지를 위해 권역군 확장
	// 020000(은행), 030300(저축은행), 050000(보험), 030200(여신전문/캐피탈)
	const dynamicGrps = [...TOP_GRPS];
	if (type === "mortgage" || type === "rent") dynamicGrps.push("050000");
	if (type === "credit") dynamicGrps.push("030200");

	try {
		const results = await Promise.all(
			dynamicGrps.map(async (grp) => {
				// 페이지네이션 지원 (1-2페이지)
				const pages = [1, 2];
				const pageResults = await Promise.all(
					pages.map(async (pageNo) => {
						const url = `${BASE_URL}/${endpoint}.json?auth=${API_KEY}&topFinGrpNo=${grp}&pageNo=${pageNo}`;
						try {
							const res = await fetch(url, { cache: "no-store" });
							if (!res.ok) return null;
							return await res.json();
						} catch {
							return null;
						}
					}),
				);
				return pageResults;
			}),
		);

		const mergedProductMap: Record<string, LoanProduct> = {};

		results.flat().forEach((data) => {
			const actualData = data?.result || data;
			if (!actualData || actualData.err_cd !== "000") return;

			const baseList = actualData.baseList || [];
			const optionList = actualData.optionList || [];

			baseList.forEach(
				(p: {
					fin_prdt_cd: string;
					fin_prdt_nm: string;
					kor_co_nm: string;
					join_way: string;
					loan_lmt: string;
					join_member: string;
				}) => {
					if (!mergedProductMap[p.fin_prdt_cd]) {
						const prdtNm = p.fin_prdt_nm || "";
						const joinWay = p.join_way || "";

						mergedProductMap[p.fin_prdt_cd] = {
							fin_prdt_cd: p.fin_prdt_cd,
							kor_co_nm: p.kor_co_nm,
							fin_prdt_nm: prdtNm,
							join_way: joinWay,
							loan_lmt: p.loan_lmt || "상세 확인 필요",
							join_member: p.join_member || "-",
							options: [],
							type,
							tags: parseLoanTags(prdtNm, joinWay, type),
						};
					}
				},
			);

			optionList.forEach(
				(o: {
					fin_prdt_cd: string;
					rpay_type_nm?: string;
					crdt_prdt_type_nm?: string;
					lend_rate_type_nm?: string;
					lend_rate_min?: number;
					crdt_grad_avg?: number;
					lend_rate_max?: number;
					lend_rate_avg?: number;
				}) => {
					if (mergedProductMap[o.fin_prdt_cd]) {
						const minRate = o.lend_rate_min || o.crdt_grad_avg || 0;
						const maxRate = o.lend_rate_max || 0;
						const avgRate = o.lend_rate_avg || o.crdt_grad_avg || 0;

						mergedProductMap[o.fin_prdt_cd].options.push({
							rpay_type_nm: o.rpay_type_nm || o.crdt_prdt_type_nm || "-",
							lend_rate_type_nm: o.lend_rate_type_nm || "변동",
							lend_rate_min: minRate >= 1.5 ? Number(minRate) : null,
							lend_rate_max: maxRate >= 1.5 ? Number(maxRate) : null,
							lend_rate_avg: avgRate >= 1.5 ? Number(avgRate) : null,
						});
					}
				},
			);
		});

		let products = Object.values(mergedProductMap)
			.filter((p) => p.options.length > 0)
			.map((p) => {
				const sortedOpts = [...p.options].sort(
					(a, b) => (a.lend_rate_min || 99) - (b.lend_rate_min || 99),
				);
				return { ...p, bestOption: sortedOpts[0] };
			});

		// 1. 특정 금융사 필터 (우선순위 높음)
		if (specificBanks.length > 0) {
			products = products.filter((p) => {
				const bankName = p.kor_co_nm;
				return specificBanks.some((selected) => {
					if (selected === "iM뱅크" || selected === "대구은행")
						return bankName.includes("대구은행") || bankName.includes("iM");
					return bankName.includes(selected);
				});
			});
		} else if (tier === "1") {
			// 2. 1금융권 필터링
			products = products.filter((p) => {
				const bankName = p.kor_co_nm;
				return TIER_1_BANKS.some((tier1) => {
					if (tier1 === "대구은행" || tier1 === "iM뱅크")
						return bankName.includes("대구은행") || bankName.includes("iM");
					return bankName.includes(tier1);
				});
			});
		}

		// 필터링 적용 (AND 로직)
		if (filters.length > 0) {
			products = products.filter((p) =>
				filters.every((f) => p.tags.includes(f)),
			);
		}

		// 최저 금리가 낮은 순 정렬 (null은 뒤로)
		products.sort((a, b) => {
			const aMin = a.bestOption?.lend_rate_min ?? 999;
			const bMin = b.bestOption?.lend_rate_min ?? 999;
			return aMin - bMin;
		});

		if (products.length > 0) return { products, isMock: false };

		// 데이터가 없는 경우를 위한 목업
		let mock = generateMockLoans(type);
		if (specificBanks.length > 0) {
			mock = mock.filter((p) =>
				specificBanks.some((bank) => p.kor_co_nm.includes(bank)),
			);
		} else if (tier === "1") {
			mock = mock.filter((p) =>
				TIER_1_BANKS.some((bank) => p.kor_co_nm.includes(bank)),
			);
		}
		return {
			products: mock.filter((p) => filters.every((f) => p.tags.includes(f))),
			isMock: true,
		};
	} catch (error) {
		console.error(`getLoans error (${type}):`, error);
		return { products: generateMockLoans(type), isMock: true };
	}
}

function parseLoanTags(name: string, joinWay: string, type: string): string[] {
	const tags: string[] = [];
	const text = (name + joinWay).toLowerCase();

	if (
		text.includes("비대면") ||
		text.includes("인터넷") ||
		text.includes("스마트폰")
	)
		tags.push("방문없이가입");
	if (text.includes("무서류")) tags.push("무서류");
	if (text.includes("정기") || text.includes("우량")) tags.push("직장인");
	if (text.includes("비상금") || text.includes("간편")) tags.push("무직자가능");
	if (type === "mortgage" || type === "rent") tags.push("LTV우대");

	// 기본 배지
	tags.push("누구나가입");

	return Array.from(new Set(tags));
}

function generateMockLoans(
	type: "mortgage" | "rent" | "credit",
): LoanProduct[] {
	return Array.from({ length: 8 }).map((_, i) => ({
		fin_prdt_cd: `LOAN_MOCK_${type}_${i}`,
		kor_co_nm: i % 2 === 0 ? "우리은행" : "신한은행",
		fin_prdt_nm: `${type === "credit" ? "신용대출" : type === "mortgage" ? "주택담보대출" : "전세대출"} No.${i + 1}`,
		join_way: "스마트폰,인터넷",
		loan_lmt: "최대 2억원",
		join_member: "직장인 (1년 이상 재직)",
		options: [
			{
				rpay_type_nm: "원리금분할상환",
				lend_rate_type_nm: "변동",
				lend_rate_min: 3.2 + i * 0.1,
				lend_rate_max: 5.5,
				lend_rate_avg: 4.1,
			},
		],
		bestOption: {
			rpay_type_nm: "원리금분할상환",
			lend_rate_type_nm: "변동",
			lend_rate_min: 3.2 + i * 0.1,
			lend_rate_max: 5.5,
			lend_rate_avg: 4.1,
		},
		type,
		tags: ["누구나가입", "방문없이가입", i % 3 === 0 ? "무서류" : "직장인"],
	}));
}
// 개별 대출 조회
export async function getLoanById(id: string) {
	// 모든 타입에서 검색
	const types: ("mortgage" | "rent" | "credit")[] = [
		"mortgage",
		"rent",
		"credit",
	];

	for (const type of types) {
		const { products } = await getLoans(type);
		const productIndex = products.findIndex((p) => p.fin_prdt_cd === id);
		if (productIndex !== -1) {
			return {
				product: products[productIndex],
				type,
				rank: productIndex + 1,
				total: products.length,
				top5: products.slice(0, 5),
			};
		}
	}

	return { product: null, type: null, rank: 0, total: 0, top5: [] };
}
