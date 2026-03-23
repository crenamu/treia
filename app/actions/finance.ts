"use server";

// API 키 가져오기 및 따옴표 제거 트리밍
const API_KEY =
	process.env.FSS_API_KEY?.replace(/["']/g, "").trim() ||
	"9c6a12617f41e88957bf751f9f8ae193";
const BASE_URL = "https://finlife.fss.or.kr/finlifeapi";

// 권역 코드: 020000(은행), 030300(저축은행)
const TOP_GRPS = ["020000", "030300"];

import { TIER_1_BANKS } from "./constants";

export interface ProductOption {
	intr_rate_type_nm: string;
	save_trm: string;
	intr_rate: number;
	intr_rate2: number;
}

export interface Product {
	fin_prdt_cd: string;
	kor_co_nm: string;
	fin_prdt_nm: string;
	join_way: string;
	spcl_cnd: string;
	mtrt_int: string;
	etc_note: string;
	join_member: string; // 가입대상 추가
	max_limit: number | null; // 예치한도 추가
	options: ProductOption[];
	bestOption?: ProductOption;
	isMock?: boolean;
	tags: string[]; // 상세 우대 조건 태그
}

export async function getProducts(
	type: "deposit" | "saving",
	trm: string = "0",
	filters: string[] = [],
	tier: "all" | "1" = "all",
	sortBy: "highest" | "base" = "highest", // 정렬 기준 추가
	specificBanks: string[] = [], // 특정 은행 필터 추가
) {
	const apiType =
		type === "deposit" ? "depositProductsSearch" : "savingProductsSearch";

	try {
		const results = await Promise.all(
			TOP_GRPS.map(async (grp) => {
				// 뱅크샐러드 데이터 정합성을 위해 최소 1-3페이지까지 수집 시도 (대부분 1페이지에 수용됨)
				const pages = [1, 2];
				const pageResults = await Promise.all(
					pages.map(async (pageNo) => {
						const fetchUrl = `${BASE_URL}/${apiType}.json?auth=${API_KEY}&topFinGrpNo=${grp}&pageNo=${pageNo}`;
						try {
							const res = await fetch(fetchUrl, {
								cache: "no-store",
								headers: { Accept: "application/json" },
							});
							if (!res.ok) return null;
							const json = await res.json();
							if (json.result?.err_cd !== "000") {
								console.warn(
									`FSS API Warning (${grp}, page ${pageNo}):`,
									json.result?.err_msg,
								);
							}
							return json;
						} catch {
							return null;
						}
					}),
				);
				return pageResults;
			}),
		);

		const mergedProductMap: Record<string, Product> = {};

		results.flat().forEach((data) => {
			const actualData = data?.result || data;
			if (!actualData || actualData.err_cd !== "000") return;

			const baseList = actualData.baseList || [];
			const optionList = actualData.optionList || [];

			baseList.forEach(
				(p: {
					fin_prdt_cd: string;
					kor_co_nm: string;
					fin_prdt_nm: string;
					join_way: string;
					spcl_cnd: string;
					mtrt_int: string;
					etc_note: string;
					join_member: string;
					max_limit: number | null;
				}) => {
					if (!mergedProductMap[p.fin_prdt_cd]) {
						const spclCnd = p.spcl_cnd || "-";
						const joinWay = p.join_way || "-";

						mergedProductMap[p.fin_prdt_cd] = {
							fin_prdt_cd: p.fin_prdt_cd,
							kor_co_nm: p.kor_co_nm,
							fin_prdt_nm: p.fin_prdt_nm,
							join_way: joinWay,
							spcl_cnd: spclCnd,
							mtrt_int: p.mtrt_int || "-",
							etc_note: p.etc_note || "-",
							join_member: p.join_member || "-",
							max_limit: p.max_limit,
							options: [],
							tags: parseTags(spclCnd, joinWay),
						};
					}
				},
			);

			optionList.forEach(
				(o: {
					fin_prdt_cd: string;
					intr_rate_type_nm: string;
					save_trm: string;
					intr_rate: number;
					intr_rate2: number;
				}) => {
					if (mergedProductMap[o.fin_prdt_cd]) {
						mergedProductMap[o.fin_prdt_cd].options.push({
							intr_rate_type_nm: o.intr_rate_type_nm,
							save_trm: String(o.save_trm),
							intr_rate: Number(o.intr_rate),
							intr_rate2: Number(o.intr_rate2),
						});
					}
				},
			);
		});

		const rawProducts = Object.values(mergedProductMap).filter(
			(p) => p.options.length > 0,
		);

		// 데이터가 있다면 실데이터 반환
		if (rawProducts.length > 0) {
			const formatted = formatProducts(
				rawProducts,
				trm,
				filters,
				tier,
				sortBy,
				specificBanks,
			);
			return { products: formatted, total: formatted.length, isMock: false };
		}

		// 데이터가 없는 경우를 대비한 가변 Mock
		const richMock = generateRichMock(type);
		const formattedMock = formatProducts(
			richMock,
			trm,
			filters,
			tier,
			sortBy,
			specificBanks,
		);
		return {
			products: formattedMock,
			total: formattedMock.length,
			isMock: true,
		};
	} catch (error) {
		console.error("Fatal Error:", error);
		const richMock = generateRichMock(type);
		return {
			products: formatProducts(
				richMock,
				trm,
				filters,
				tier,
				sortBy,
				specificBanks,
			),
			total: richMock.length,
			isMock: true,
		};
	}
}

function parseTags(spcl: string, joinWay: string): string[] {
	const tags: string[] = [];
	const fullText = (spcl + joinWay).toLowerCase();

	if (fullText.includes("카드")) tags.push("카드사용");
	if (fullText.includes("급여")) tags.push("급여연동");
	if (fullText.includes("공과금") || fullText.includes("이체"))
		tags.push("공과금연동");
	if (
		fullText.includes("비대면") ||
		fullText.includes("스마트폰") ||
		fullText.includes("인터넷")
	)
		tags.push("비대면가입");
	if (fullText.includes("첫") || fullText.includes("최초")) tags.push("첫거래");
	if (fullText.includes("재예치") || fullText.includes("만기"))
		tags.push("재예치");
	if (fullText.includes("입출금") || fullText.includes("연계"))
		tags.push("입출금통장");
	if (fullText.includes("마케팅") || fullText.includes("동의"))
		tags.push("마케팅동의");
	if (fullText.includes("청약")) tags.push("주택청약");
	if (joinWay.includes("스마트폰") || joinWay.includes("인터넷"))
		tags.push("방문없이가입");
	if (!spcl || spcl === "-" || spcl.includes("없음")) tags.push("누구나가입");

	return Array.from(new Set(tags));
}

function generateRichMock(type: string): Product[] {
	const isDeposit = type === "deposit";
	return Array.from({ length: 15 }).map((_, i) => {
		const spcl =
			i % 3 === 0 ? "급여이체, 신용카드 실적 충족 시 우대" : "조건 없음";
		return {
			fin_prdt_cd: `MOCK_${i}`,
			kor_co_nm: i % 2 === 0 ? "핀테이블은행" : "미래성장금고",
			fin_prdt_nm: `${isDeposit ? "정기예금" : "자산형성적금"} ${i + 1}호`,
			join_way: "스마트폰,인터넷",
			spcl_cnd: spcl,
			mtrt_int: "만기 시 지급",
			etc_note: "데이터 연동 테스트 모드입니다.",
			join_member: "개인 (제한 없음)",
			max_limit: 100000000,
			options: [
				{
					intr_rate_type_nm: "단리",
					save_trm: "12",
					intr_rate: 3.5 + i * 0.05,
					intr_rate2: 4.0 + i * 0.1,
				},
				{
					intr_rate_type_nm: "단리",
					save_trm: "24",
					intr_rate: 3.7 + i * 0.05,
					intr_rate2: 4.2 + i * 0.1,
				},
			],
			tags: parseTags(spcl, "스마트폰,인터넷"),
		};
	});
}

function formatProducts(
	products: Product[],
	trm: string,
	filters: string[],
	tier: "all" | "1",
	sortBy: "highest" | "base" = "highest",
	specificBanks: string[] = [],
) {
	let filtered = [...products];

	// 1. 하드 필터 (금융권, 특정 은행, 예치 기간)
	if (specificBanks.length > 0) {
		filtered = filtered.filter((p) => {
			const bankName = p.kor_co_nm;
			return specificBanks.some((selected) => {
				if (selected === "iM뱅크" || selected === "대구은행")
					return bankName.includes("대구은행") || bankName.includes("iM");
				return bankName.includes(selected);
			});
		});
	} else if (tier === "1") {
		filtered = filtered.filter((p) => {
			const bankName = p.kor_co_nm;
			return TIER_1_BANKS.some((tier1) => {
				if (tier1 === "대구은행")
					return bankName.includes("대구은행") || bankName.includes("iM");
				return bankName.includes(tier1);
			});
		});
	}

	if (trm && trm !== "0") {
		filtered = filtered.filter((p) =>
			p.options.some((o) => String(o.save_trm) === String(trm)),
		);
	}

	// 2. 가입 방식 (Constraint) - 하드 필터 유지
	const constraintTags = ["비대면가입", "방문없이가입", "누구나가입"];
	const activeConstraints = filters.filter((f) => constraintTags.includes(f));
	if (activeConstraints.length > 0) {
		filtered = filtered.filter((p) =>
			activeConstraints.every((f) => p.tags.includes(f)),
		);
	}

	// 3. 우대 조건 (Preferential) - 소프트 필터
	const prefFilters = filters.filter((f) => !constraintTags.includes(f));

	const mapped = filtered.map((p) => {
		const opts =
			trm && trm !== "0"
				? p.options.filter((o) => String(o.save_trm) === String(trm))
				: p.options;

		const sortedOpts = [...opts].sort((a, b) => {
			if (sortBy === "base") return (b.intr_rate || 0) - (a.intr_rate || 0);
			return (b.intr_rate2 || 0) - (a.intr_rate2 || 0);
		});

		const best = sortedOpts[0] || p.options[0];
		const isAnyone = p.tags.includes("누구나가입");
		const hasMatch =
			prefFilters.length > 0
				? prefFilters.some((f) => p.tags.includes(f))
				: true;

		// 실질 금리: 만족 조건이 있거나 누구나가입이면 최고금리, 아니면 기본금리
		const effectiveRate =
			isAnyone || hasMatch ? best?.intr_rate2 || 0 : best?.intr_rate || 0;

		return { ...p, bestOption: best, effectiveRate };
	});

	mapped.sort((a, b) => {
		if (sortBy === "base")
			return (b.bestOption?.intr_rate || 0) - (a.bestOption?.intr_rate || 0);
		return (b.effectiveRate || 0) - (a.effectiveRate || 0);
	});
	return mapped;
}
// 개별 상품 조회 (FSS API 특성상 검색 후 필터링)
export async function getProductById(id: string) {
	// 우선 예금에서 검색
	const depositData = await getProducts("deposit", "12"); // 12개월 기준 랭킹 산출
	let allProducts = depositData.products;
	let productIndex = allProducts.findIndex((p) => p.fin_prdt_cd === id);

	if (productIndex !== -1) {
		return {
			product: allProducts[productIndex],
			type: "deposit",
			rank: productIndex + 1,
			total: allProducts.length,
			top5: allProducts.slice(0, 5),
		};
	}

	// 없으면 적금에서 검색
	const savingData = await getProducts("saving", "12");
	allProducts = savingData.products;
	productIndex = allProducts.findIndex((p) => p.fin_prdt_cd === id);

	if (productIndex !== -1) {
		return {
			product: allProducts[productIndex],
			type: "saving",
			rank: productIndex + 1,
			total: allProducts.length,
			top5: allProducts.slice(0, 5),
		};
	}

	return { product: null, type: null, rank: 0, total: 0, top5: [] };
}
