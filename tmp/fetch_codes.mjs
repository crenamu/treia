import fs from 'fs';
import path from 'path';

const API_KEY = "9c6a12617f41e88957bf751f9f8ae193";
const BASE_URL = 'https://finlife.fss.or.kr/finlifeapi';
const GRPS = ['020000', '030300'];

async function fetchProducts(type) {
  const apiType = type === 'deposit' ? 'depositProductsSearch' : 'savingProductsSearch';
  let results = '';
  
  for (const grp of GRPS) {
    const url = `${BASE_URL}/${apiType}.json?auth=${API_KEY}&topFinGrpNo=${grp}&pageNo=1`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.result?.err_cd === '000') {
        const baseList = json.result.baseList || [];
        baseList.forEach(p => {
          results += `[${type}] ${p.kor_co_nm} | ${p.fin_prdt_nm} | ${p.fin_prdt_cd}\n`;
        });
      }
    } catch (e) {}
  }
  return results;
}

async function main() {
  const d = await fetchProducts('deposit');
  const s = await fetchProducts('saving');
  fs.writeFileSync('c:\\work\\AI 리더캠프\\projects\\treia\\tmp\\codes_utf8.txt', d + s, 'utf8');
}

main();
