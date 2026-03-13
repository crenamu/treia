'use server'

const API_KEY = process.env.FSS_API_KEY
const BASE_URL = 'https://finlife.fss.or.kr/finlifeapi'
const TOP_GRP = '020000'

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
  },
  {
    fin_prdt_cd: 'MOCK_002',
    kor_co_nm: '미래성장은행',
    fin_prdt_nm: '청약 브릿지 스마트 예금',
    join_way: '스마트폰 전용',
    spcl_cnd: '급여이체 실적 보유 시 우대',
    mtrt_int: '월 복리 지급 가능',
    etc_note: '매우 인기가 많은 상품입니다.',
    options: [
      { intr_rate_type_nm: '복리', save_trm: '12', intr_rate: 3.50, intr_rate2: 4.20 },
      { intr_rate_type_nm: '복리', save_trm: '36', intr_rate: 3.70, intr_rate2: 4.40 }
    ]
  }
];

const MOCK_SAVINGS: Product[] = [
  {
    fin_prdt_cd: 'MOCK_S001',
    kor_co_nm: '핀테이블은행',
    fin_prdt_nm: 'FinTable 챌린지 적금',
    join_way: '스마트폰 전용',
    spcl_cnd: '매주 자동이체 시 1.0%p 우대',
    mtrt_int: '만기 일시 지급',
    etc_note: '목돈 마련을 위한 최고의 선택',
    options: [
      { intr_rate_type_nm: '단리', save_trm: '12', intr_rate: 4.50, intr_rate2: 5.50 },
      { intr_rate_type_nm: '단리', save_trm: '24', intr_rate: 4.80, intr_rate2: 6.00 }
    ]
  },
  {
    fin_prdt_cd: 'MOCK_S002',
    kor_co_nm: '청년희망은행',
    fin_prdt_nm: '주택마련 브릿지 적금',
    join_way: '인터넷/방문',
    spcl_cnd: '청약통장 보유자 우대',
    mtrt_int: '만기 일시 지급',
    etc_note: '내 집 마련의 첫 걸음',
    options: [
      { intr_rate_type_nm: '복리', save_trm: '12', intr_rate: 4.00, intr_rate2: 5.00 }
    ]
  }
];

export async function getProducts(type: 'deposit' | 'saving', trm: string = '0', id?: string) {
  const currentMock = type === 'deposit' ? MOCK_PRODUCTS : MOCK_SAVINGS;
  const apiType = type === 'deposit' ? 'depositProductsSearch' : 'savingProductsSearch';

  if (!API_KEY) {
    const products = formatProducts(currentMock, trm);
    if (id) {
      const product = products.find((p) => p.fin_prdt_cd === id);
      return { product, isMock: true };
    }
    return { products, total: currentMock.length, isMock: true };
  }

  try {
    const fetchUrl = `${BASE_URL}/${apiType}.json?auth=${API_KEY}&topFinGrpNo=${TOP_GRP}&pageNo=1`;
    const res = await fetch(fetchUrl, { next: { revalidate: 3600 } });
    
    if (!res.ok) throw new Error('API Response not OK');
    
    const data = await res.json()

    if (data.result?.err_cd && data.result.err_cd !== '000') {
      const products = formatProducts(currentMock, trm);
      if (id) {
        const product = products.find((p) => p.fin_prdt_cd === id);
        return { product, isMock: true };
      }
      return { products, total: currentMock.length, isMock: true };
    }

    const baseList = data.result.baseList || []
    const optionList = data.result.optionList || []

    const productMap: Record<string, Product> = {}
    baseList.forEach((p: Product) => {
      productMap[p.fin_prdt_cd] = { ...p, options: [] }
    })
    optionList.forEach((o: ProductOption & { fin_prdt_cd: string }) => {
      if (productMap[o.fin_prdt_cd]) {
        productMap[o.fin_prdt_cd].options.push(o)
      }
    })

    const rawProducts = Object.values(productMap).filter((p) => p.options.length > 0)
    
    if (rawProducts.length === 0) {
      const products = formatProducts(currentMock, trm);
      if (id) {
        const product = products.find((p) => p.fin_prdt_cd === id);
        return { product, isMock: true };
      }
      return { products, total: currentMock.length, isMock: true };
    }

    const formatted = formatProducts(rawProducts, trm);
    
    if (id) {
      const product = formatted.find((p) => p.fin_prdt_cd === id);
      return { product, isMock: false };
    }

    return { products: formatted, total: formatted.length, isMock: false }
  } catch (error) {
    console.error('Action Error:', error)
    const products = formatProducts(currentMock, trm);
    if (id) {
      const product = products.find((p) => p.fin_prdt_cd === id);
      return { product, isMock: true };
    }
    return { products, total: currentMock.length, isMock: true };
  }
}

function formatProducts(products: Product[], trm: string) {
  let filtered = [...products];
  if (trm && trm !== '0') {
    filtered = filtered.filter((p) =>
      p.options.some((o) => String(o.save_trm) === String(trm))
    )
  }
  const mapped = filtered.map((p) => {
    const opts = (trm && trm !== '0')
      ? p.options.filter((o) => String(o.save_trm) === String(trm))
      : p.options
    const sortedOpts = [...opts].sort((a, b) => (b.intr_rate2 || 0) - (a.intr_rate2 || 0));
    const best = sortedOpts[0] || p.options[0];
    return { ...p, bestOption: best }
  })
  mapped.sort((a, b) => (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0))
  return mapped;
}
