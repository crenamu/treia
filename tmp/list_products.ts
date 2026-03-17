import { getProducts } from '../app/actions/finance';

async function listProducts() {
  console.log('--- 예금 상품 리스트 (1금융권) ---');
  const depositData = await getProducts('deposit', '12', [], '1');
  depositData.products.slice(0, 30).forEach(p => {
    console.log(`${p.fin_prdt_cd} | ${p.kor_co_nm} | ${p.fin_prdt_nm}`);
  });

  console.log('\n--- 적금 상품 리스트 (1금융권) ---');
  const savingData = await getProducts('saving', '12', [], '1');
  savingData.products.slice(0, 30).forEach(p => {
    console.log(`${p.fin_prdt_cd} | ${p.kor_co_nm} | ${p.fin_prdt_nm}`);
  });
}

listProducts().catch(console.error);
