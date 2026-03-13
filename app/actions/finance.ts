'use server'

// API 키 가져오기 및 따옴표 제거 트리밍
const API_KEY = process.env.FSS_API_KEY?.replace(/["']/g, '').trim() || "9c6a12617f41e88957bf751f9f8ae193";
const BASE_URL = 'https://finlife.fss.or.kr/finlifeapi'

// 권역 코드: 020000(은행), 030300(저축은행)
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

export async function getProducts(type: 'deposit' | 'saving', trm: string = '0') {
  const apiType = type === 'deposit' ? 'depositProductsSearch' : 'savingProductsSearch';

  try {
    const results = await Promise.all(
      TOP_GRPS.map(async (grp) => {
        // numOfRows=100 설정 및 revalidate: 0으로 캐시 방지 (테스트용)
        const fetchUrl = `${BASE_URL}/${apiType}.json?auth=${API_KEY}&topFinGrpNo=${grp}&pageNo=1`;
        
        try {
          const res = await fetch(fetchUrl, { 
            cache: 'no-store', // 캐시 강제 비활성화하여 실시간성 확보
            headers: { 'Accept': 'application/json' }
          });
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
        if (!mergedProductMap[p.fin_prdt_cd]) {
          mergedProductMap[p.fin_prdt_cd] = {
            fin_prdt_cd: p.fin_prdt_cd,
            kor_co_nm: p.kor_co_nm,
            fin_prdt_nm: p.fin_prdt_nm,
            join_way: p.join_way || '-',
            spcl_cnd: p.spcl_cnd || '-',
            mtrt_int: p.mtrt_int || '-',
            etc_note: p.etc_note || '-',
            options: []
          };
        }
      });

      optionList.forEach((o: any) => {
        if (mergedProductMap[o.fin_prdt_cd]) {
          mergedProductMap[o.fin_prdt_cd].options.push({
            intr_rate_type_nm: o.intr_rate_type_nm,
            save_trm: String(o.save_trm),
            intr_rate: Number(o.intr_rate),
            intr_rate2: Number(o.intr_rate2)
          });
        }
      });
    });

    const rawProducts = Object.values(mergedProductMap).filter((p) => p.options.length > 0);
    
    // 만약 데이터가 있다면 실데이터 반환
    if (rawProducts.length > 0) {
      const formatted = formatProducts(rawProducts, trm);
      return { products: formatted, total: formatted.length, isMock: false };
    }

    // 데이터가 없는 경우를 대비한 가변 Mock (최소 10개 이상 생성하여 뱅크샐러드 느낌 유지)
    console.warn('API returned no data, generating rich mock for UX');
    const richMock = generateRichMock(type);
    const formattedMock = formatProducts(richMock, trm);
    return { products: formattedMock, total: formattedMock.length, isMock: true };

  } catch (error) {
    console.error('Fatal Error:', error);
    const richMock = generateRichMock(type);
    return { products: formatProducts(richMock, trm), total: richMock.length, isMock: true };
  }
}

function generateRichMock(type: string): Product[] {
  const isDeposit = type === 'deposit';
  return Array.from({ length: 15 }).map((_, i) => ({
    fin_prdt_cd: `MOCK_${i}`,
    kor_co_nm: i % 2 === 0 ? '핀테이블은행' : '미래성장금고',
    fin_prdt_nm: `${isDeposit ? '정기예금' : '자산형성적금'} ${i + 1}호`,
    join_way: '스마트폰,인터넷',
    spcl_cnd: '우대 금리 조건 충족 시 최고 금리 제공',
    mtrt_int: '만기 시 지급',
    etc_note: '데이터 연동 테스트 모드입니다.',
    options: [
      { intr_rate_type_nm: '단리', save_trm: '12', intr_rate: 3.5 + (i * 0.05), intr_rate2: 4.0 + (i * 0.1) },
      { intr_rate_type_nm: '단리', save_trm: '24', intr_rate: 3.7 + (i * 0.05), intr_rate2: 4.2 + (i * 0.1) }
    ]
  }));
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
