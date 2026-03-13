'use server'

const API_KEY = process.env.FSS_API_KEY
const BASE_URL = 'https://finlife.fss.or.kr/finlifeapi'
// 020000: 은행, 030300: 저축은행
const TOP_GRPS = ['020000', '030300']

export interface ProductOption {
  intr_rate_type_nm: string
  save_trm: string
  intr_rate: number
  intr_rate2: number
}

export interface Product {
  fin_prdt_cd: string
  kor_co_nm: string
  fin_prdt_nm: string
  join_way: string
  spcl_cnd: string
  mtrt_int: string
  etc_note: string
  options: ProductOption[]
  bestOption?: ProductOption
  isMock?: boolean
}

const MOCK_PRODUCTS: Product[] = [
  {
    fin_prdt_cd: 'MOCK_001',
    kor_co_nm: '핀테이블은행',
    fin_prdt_nm: 'FinTable 웰컴 정기예금',
    join_way: '인터넷,스마트폰',
    spcl_cnd: '첫 거래 고객 0.5%p 우대\n마케팅 동의 시 0.1%p 우대',
    mtrt_int: '만기 시 일시 지급',
    etc_note: 'LH/SH 청약 준비생을 위한 전용 예금입니다.',
    options: [
      { intr_rate_type_nm: '단리', save_trm: '12', intr_rate: 3.85, intr_rate2: 4.50 },
      { intr_rate_type_nm: '단리', save_trm: '24', intr_rate: 3.90, intr_rate2: 4.60 },
      { intr_rate_type_nm: '단리', save_trm: '6', intr_rate: 3.20, intr_rate2: 3.50 }
    ]
  }
];

export async function getProducts(type: 'deposit' | 'saving', trm: string = '0', id?: string) {
  const currentMock = MOCK_PRODUCTS; 
  const apiType = type === 'deposit' ? 'depositProductsSearch' : 'savingProductsSearch';

  if (!API_KEY) {
    const products = formatProducts(currentMock, trm);
    if (id) return { product: products.find(p => p.fin_prdt_cd === id), isMock: true };
    return { products, total: currentMock.length, isMock: true };
  }

  try {
    const results = await Promise.all(
      TOP_GRPS.map(async (grp) => {
        // numOfRows=100으로 설정하여 뱅크샐러드 수준의 많은 데이터를 가져옴
        const fetchUrl = `${BASE_URL}/${apiType}.json?auth=${API_KEY}&topFinGrpNo=${grp}&pageNo=1`;
        try {
          const res = await fetch(fetchUrl, { next: { revalidate: 3600 } });
          if (!res.ok) return null;
          return await res.json();
        } catch (e) {
          return null;
        }
      })
    );

    const mergedProductMap: Record<string, Product> = {};

    results.forEach((data) => {
      if (!data || data.result?.err_cd !== '000') return;
      
      const baseList = data.result.baseList || [];
      const optionList = data.result.optionList || [];

      baseList.forEach((p: any) => {
        mergedProductMap[p.fin_prdt_cd] = { ...p, options: [] };
      });

      optionList.forEach((o: any) => {
        if (mergedProductMap[o.fin_prdt_cd]) {
          mergedProductMap[o.fin_prdt_cd].options.push(o);
        }
      });
    });

    const rawProducts = Object.values(mergedProductMap).filter((p) => p.options.length > 0);
    
    if (rawProducts.length === 0) {
      const products = formatProducts(currentMock, trm);
      if (id) return { product: products.find(p => p.fin_prdt_cd === id), isMock: true };
      return { products, total: currentMock.length, isMock: true };
    }

    const formatted = formatProducts(rawProducts, trm);
    
    if (id) {
      const product = formatted.find((p) => p.fin_prdt_cd === id);
      return { product, isMock: false };
    }

    return { products: formatted, total: formatted.length, isMock: false };
  } catch (error) {
    console.error('getProducts Error:', error);
    const products = formatProducts(currentMock, trm);
    return { products, total: currentMock.length, isMock: true };
  }
}

function formatProducts(products: Product[], trm: string) {
  let filtered = [...products];
  if (trm && trm !== '0') {
    filtered = filtered.filter((p) =>
      p.options.some((o) => String(o.save_trm) === String(trm))
    );
  }
  const mapped = filtered.map((p) => {
    const opts = (trm && trm !== '0')
      ? p.options.filter((o) => String(o.save_trm) === String(trm))
      : p.options;
    const sortedOpts = [...opts].sort((a, b) => (b.intr_rate2 || 0) - (a.intr_rate2 || 0));
    const best = sortedOpts[0] || p.options[0];
    return { ...p, bestOption: best };
  });
  mapped.sort((a, b) => (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0));
  return mapped;
}
