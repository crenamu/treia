'use server'

// API 키 가져오기 및 따옴표 제거 트리밍
const API_KEY = process.env.FSS_API_KEY?.replace(/["']/g, '').trim() || "9c6a12617f41e88957bf751f9f8ae193";
const BASE_URL = 'https://finlife.fss.or.kr/finlifeapi'

// 권역 코드: 020000(은행), 030300(저축은행)
const TOP_GRPS = ['020000', '030300']

// 제1금융권 은행 리스트 (시중은행)
export const TIER_1_BANKS = [
  '한국산업은행', 'NH농협은행', '신한은행', '우리은행', 'SC제일은행', 
  '하나은행', '중소기업은행', 'KB국민은행', '한국씨티은행', 'SH수협은행', 
  '대구은행', '부산은행', '광주은행', '제주은행', '전북은행', 
  '경남은행', '케이뱅크', '카카오뱅크', '토스뱅크'
];

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
  tags: string[] // 상세 우대 조건 태그
}

export async function getProducts(
  type: 'deposit' | 'saving', 
  trm: string = '0', 
  filters: string[] = [],
  tier: 'all' | '1' = 'all'
) {
  const apiType = type === 'deposit' ? 'depositProductsSearch' : 'savingProductsSearch';

  try {
    const results = await Promise.all(
      TOP_GRPS.map(async (grp) => {
        const fetchUrl = `${BASE_URL}/${apiType}.json?auth=${API_KEY}&topFinGrpNo=${grp}&pageNo=1`;
        
        try {
          const res = await fetch(fetchUrl, { 
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
          });
          if (!res.ok) return null;
          return await res.json();
        } catch (error) {
          return null;
        }
      })
    );

    const mergedProductMap: Record<string, Product> = {};

    results.forEach((data) => {
      const actualData = data?.result || data;
      if (!actualData || actualData.err_cd !== '000') return;
      
      const baseList = actualData.baseList || [];
      const optionList = actualData.optionList || [];

      baseList.forEach((p: { fin_prdt_cd: string; kor_co_nm: string; fin_prdt_nm: string; join_way: string; spcl_cnd: string; mtrt_int: string; etc_note: string; }) => {
        if (!mergedProductMap[p.fin_prdt_cd]) {
          const spclCnd = p.spcl_cnd || '-';
          const joinWay = p.join_way || '-';
          
          mergedProductMap[p.fin_prdt_cd] = {
            fin_prdt_cd: p.fin_prdt_cd,
            kor_co_nm: p.kor_co_nm,
            fin_prdt_nm: p.fin_prdt_nm,
            join_way: joinWay,
            spcl_cnd: spclCnd,
            mtrt_int: p.mtrt_int || '-',
            etc_note: p.etc_note || '-',
            options: [],
            tags: parseTags(spclCnd, joinWay)
          };
        }
      });

      optionList.forEach((o: { fin_prdt_cd: string; intr_rate_type_nm: string; save_trm: string; intr_rate: number; intr_rate2: number; }) => {
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
    
    // 데이터가 있다면 실데이터 반환
    if (rawProducts.length > 0) {
      const formatted = formatProducts(rawProducts, trm, filters, tier);
      return { products: formatted, total: formatted.length, isMock: false };
    }

    // 데이터가 없는 경우를 대비한 가변 Mock
    const richMock = generateRichMock(type);
    const formattedMock = formatProducts(richMock, trm, filters, tier);
    return { products: formattedMock, total: formattedMock.length, isMock: true };

  } catch (error) {
    console.error('Fatal Error:', error);
    const richMock = generateRichMock(type);
    return { products: formatProducts(richMock, trm, filters, tier), total: richMock.length, isMock: true };
  }
}

function parseTags(spcl: string, joinWay: string): string[] {
  const tags: string[] = [];
  const fullText = (spcl + joinWay).toLowerCase();

  if (fullText.includes('카드')) tags.push('카드사용');
  if (fullText.includes('급여')) tags.push('급여연동');
  if (fullText.includes('공과금') || fullText.includes('이체')) tags.push('공과금연동');
  if (fullText.includes('비대면') || fullText.includes('스마트폰') || fullText.includes('인터넷')) tags.push('비대면가입');
  if (fullText.includes('첫') || fullText.includes('최초')) tags.push('첫거래');
  if (fullText.includes('재예치') || fullText.includes('만기')) tags.push('재예치');
  if (fullText.includes('입출금') || fullText.includes('연계')) tags.push('입출금통장');
  if (fullText.includes('마케팅') || fullText.includes('동의')) tags.push('마케팅동의');
  if (fullText.includes('청약')) tags.push('주택청약');
  if (joinWay.includes('스마트폰') || joinWay.includes('인터넷')) tags.push('방문없이가입');
  if (!spcl || spcl === '-' || spcl.includes('없음')) tags.push('누구나가입');

  return Array.from(new Set(tags));
}

function generateRichMock(type: string): Product[] {
  const isDeposit = type === 'deposit';
  return Array.from({ length: 15 }).map((_, i) => {
    const spcl = i % 3 === 0 ? '급여이체, 신용카드 실적 충족 시 우대' : '조건 없음';
    return {
      fin_prdt_cd: `MOCK_${i}`,
      kor_co_nm: i % 2 === 0 ? '핀테이블은행' : '미래성장금고',
      fin_prdt_nm: `${isDeposit ? '정기예금' : '자산형성적금'} ${i + 1}호`,
      join_way: '스마트폰,인터넷',
      spcl_cnd: spcl,
      mtrt_int: '만기 시 지급',
      etc_note: '데이터 연동 테스트 모드입니다.',
      options: [
        { intr_rate_type_nm: '단리', save_trm: '12', intr_rate: 3.5 + (i * 0.05), intr_rate2: 4.0 + (i * 0.1) },
        { intr_rate_type_nm: '단리', save_trm: '24', intr_rate: 3.7 + (i * 0.05), intr_rate2: 4.2 + (i * 0.1) }
      ],
      tags: parseTags(spcl, '스마트폰,인터넷')
    };
  });
}

function formatProducts(products: Product[], trm: string, filters: string[], tier: 'all' | '1' = 'all') {
  let filtered = [...products];
  
  // 1금융권 필터
  if (tier === '1') {
    filtered = filtered.filter(p => TIER_1_BANKS.some(bank => p.kor_co_nm.includes(bank)));
  }
  
  // 가입 기간 필터
  if (trm && trm !== '0') {
    filtered = filtered.filter((p) =>
      p.options.some((o) => String(o.save_trm) === String(trm))
    );
  }

  // 우대 조건 필터 (AND 로직)
  if (filters && filters.length > 0) {
    filtered = filtered.filter((p) => 
      filters.every(f => p.tags.includes(f))
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
