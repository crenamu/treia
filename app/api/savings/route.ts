import { NextResponse } from 'next/server';

const API_KEY = process.env.FSS_API_KEY!;
const BASE_URL = 'https://finlife.fss.or.kr/finlifeapi';
const TOP_GRP = '020000';

const MOCK_SAVINGS = [
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trm = searchParams.get('trm') || '0';

  if (!API_KEY) {
    return NextResponse.json({ products: formatProducts(MOCK_SAVINGS, trm), isMock: true });
  }

  try {
    const res = await fetch(
      `${BASE_URL}/savingProductsSearch.json?auth=${API_KEY}&topFinGrpNo=${TOP_GRP}&pageNo=1`,
      { next: { revalidate: 3600 } }
    );

    const data = await res.json();

    if (data.result?.err_cd && data.result.err_cd !== '000') {
      return NextResponse.json({ products: formatProducts(MOCK_SAVINGS, trm), isMock: true });
    }

    const baseList = data.result.baseList || [];
    const optionList = data.result.optionList || [];

    const productMap: Record<string, any> = {};
    baseList.forEach((p: any) => {
      productMap[p.fin_prdt_cd] = { ...p, options: [] };
    });
    optionList.forEach((o: any) => {
      if (productMap[o.fin_prdt_cd]) {
        productMap[o.fin_prdt_cd].options.push(o);
      }
    });

    const rawProducts = Object.values(productMap).filter((p: any) => p.options.length > 0);
    const formatted = formatProducts(rawProducts, trm);

    return NextResponse.json({ products: formatted, isMock: false });
  } catch (error) {
    console.error('Savings API Error:', error);
    return NextResponse.json({ products: formatProducts(MOCK_SAVINGS, trm), isMock: true });
  }
}

function formatProducts(products: any[], trm: string) {
  let filtered = [...products];

  if (trm && trm !== '0') {
    filtered = filtered.filter((p: any) =>
      p.options.some((o: any) => String(o.save_trm) === String(trm))
    );
  }

  const mapped = filtered.map((p: any) => {
    const opts = (trm && trm !== '0')
      ? p.options.filter((o: any) => String(o.save_trm) === String(trm))
      : p.options;
    
    const sortedOpts = [...opts].sort((a, b) => (b.intr_rate2 || 0) - (a.intr_rate2 || 0));
    const best = sortedOpts[0] || p.options[0];
    
    return { ...p, bestOption: best };
  });

  mapped.sort((a, b) => (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0));
  
  return mapped;
}
