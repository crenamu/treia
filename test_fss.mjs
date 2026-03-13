
const API_KEY = "9c6a12617f41e88957bf751f9f8ae193";
const grps = ['020000', '030300'];
const apiType = 'depositProductsSearch';

async function test() {
    for (const grp of grps) {
        const url = `https://finlife.fss.or.kr/finlifeapi/${apiType}.json?auth=${API_KEY}&topFinGrpNo=${grp}&pageNo=1`;
        console.log(`Checking URL: ${url}`);
        try {
            const res = await fetch(url);
            const data = await res.json();
            console.log(`Group ${grp} result code:`, data.result?.err_cd);
            console.log(`Group ${grp} message:`, data.result?.err_msg);
            console.log(`Group ${grp} baseList count:`, data.result?.baseList?.length);
        } catch (e) {
            console.error(`Error for group ${grp}:`, e.message);
        }
    }
}

test();
