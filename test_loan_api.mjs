
const API_KEY = "9c6a12617f41e88957bf751f9f8ae193";
const grps = ['020000', '030300'];
const endpoints = [
    'mortgageLoanProductsSearch',
    'rentHouseLoanProductsSearch',
    'creditLoanProductsSearch'
];

async function test() {
    for (const endpoint of endpoints) {
        console.log(`\n--- Testing Endpoint: ${endpoint} ---`);
        for (const grp of grps) {
            const url = `https://finlife.fss.or.kr/finlifeapi/${endpoint}.json?auth=${API_KEY}&topFinGrpNo=${grp}&pageNo=1`;
            try {
                const res = await fetch(url);
                const data = await res.json();
                console.log(`[Group ${grp}] Result: ${data.result?.err_cd} - ${data.result?.err_msg}`);
                console.log(`[Group ${grp}] Count: ${data.result?.baseList?.length || 0}`);
            } catch (e) {
                console.error(`Error for ${endpoint} Group ${grp}:`, e.message);
            }
        }
    }
}

test();
