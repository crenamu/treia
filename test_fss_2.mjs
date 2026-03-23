const API_KEY = "9c6a12617f41e88957bf751f9f8ae193";
const grps = ["020000", "030300"];
const apiType = "depositProductsSearch";

async function test() {
	for (const grp of grps) {
		const url = `https://finlife.fss.or.kr/finlifeapi/${apiType}.json?auth=${API_KEY}&topFinGrpNo=${grp}&pageNo=1`;
		try {
			const res = await fetch(url);
			const data = await res.json();
			const baseCount = data.result?.baseList?.length || 0;
			const optionCount = data.result?.optionList?.length || 0;
			console.log(`Group ${grp} - Base: ${baseCount}, Options: ${optionCount}`);

			if (baseCount > 0) {
				const firstBase = data.result.baseList[0];
				const matchingOptions = data.result.optionList.filter(
					(o) => o.fin_prdt_cd === firstBase.fin_prdt_cd,
				);
				console.log(
					`First Product: ${firstBase.fin_prdt_nm}, Matching Options: ${matchingOptions.length}`,
				);
			}
		} catch (e) {
			console.error(`Error:`, e.message);
		}
	}
}

test();
