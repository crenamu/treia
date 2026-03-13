import { NextResponse } from 'next/server'

const API_KEY = process.env.FSS_API_KEY
const BASE_URL = 'https://finlife.fss.or.kr/finlifeapi'
const TOP_GRP = '020000'

// Robust Mock data as fallback
const MOCK_PRODUCTS = [
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const trm = searchParams.get('trm') || '0'

  if (!API_KEY) {
    console.warn('FSS_API_KEY is missing. Using Mock Data.');
    return NextResponse.json({ products: formatProducts(MOCK_PRODUCTS, trm), total: MOCK_PRODUCTS.length, isMock: true });
  }

  try {
    const fetchUrl = `${BASE_URL}/depositProductsSearch.json?auth=${API_KEY}&topFinGrpNo=${TOP_GRP}&pageNo=1`;
    const res = await fetch(fetchUrl, { next: { revalidate: 3600 } });
    
    if (!res.ok) throw new Error('API Response not OK');
    
    const data = await res.json()

    if (data.result?.err_cd && data.result.err_cd !== '000') {
      console.error('FSS API Error:', data.result.err_msg);
      return NextResponse.json({ products: formatProducts(MOCK_PRODUCTS, trm), total: MOCK_PRODUCTS.length, isMock: true });
    }

    const baseList = data.result.baseList || []
    const optionList = data.result.optionList || []

    const productMap: Record<string, any> = {}
    baseList.forEach((p: any) => {
      productMap[p.fin_prdt_cd] = { ...p, options: [] }
    })
    optionList.forEach((o: any) => {
      if (productMap[o.fin_prdt_cd]) {
        productMap[o.fin_prdt_cd].options.push(o)
      }
    })

    const rawProducts = Object.values(productMap).filter((p: any) => p.options.length > 0)
    const formatted = formatProducts(rawProducts, trm);

    return NextResponse.json({ products: formatted, total: formatted.length, isMock: false })
  } catch (e: any) {
    console.error('FSS API Catch Error:', e.message)
    return NextResponse.json({ products: formatProducts(MOCK_PRODUCTS, trm), total: MOCK_PRODUCTS.length, isMock: true });
  }
}

function formatProducts(products: any[], trm: string) {
  let filtered = [...products];

  // 기간 필터
  if (trm && trm !== '0') {
    filtered = filtered.filter((p: any) =>
      p.options.some((o: any) => String(o.save_trm) === String(trm))
    )
  }

  // 대표 옵션 선정
  const mapped = filtered.map((p: any) => {
    const opts = (trm && trm !== '0')
      ? p.options.filter((o: any) => String(o.save_trm) === String(trm))
      : p.options
    
    const sortedOpts = [...opts].sort((a, b) => (b.intr_rate2 || 0) - (a.intr_rate2 || 0));
    const best = sortedOpts[0] || p.options[0];
    
    return { ...p, bestOption: best }
  })

  // 정렬
  mapped.sort((a: any, b: any) => (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0))
  
  return mapped;
}
