'use server'

export interface CardProduct {
  id: string
  name: string
  company: string
  type: 'credit' | 'check'
  benefits: string[]
  annualFee: string
  prevMonthRecord: string
  imageText: string
  imageUrl?: string // 카드 이미지 경로 추가
  bestBenefit: string
  tags: string[]
  externalLink?: string // 카드사 다이렉트 링크 추가
}

// 뱅크샐러드급 데이터 분류 로직 시뮬레이션
export async function getCards(filters: string[] = []) {
  // 카드 섹션은 1/2금융권 구분이 무의미하므로 통합 데이터를 제공합니다.
  const products: CardProduct[] = [
    {
      id: 'shinhan_deep',
      name: 'Deep Dream 카드',
      company: '신한카드',
      type: 'credit',
      benefits: ['주유', '쇼핑', '편의점'],
      annualFee: '8,000원~',
      prevMonthRecord: '실적 조건 없음',
      imageText: 'Deep',
      imageUrl: '/images/cards/deep_dream.png',
      bestBenefit: '모두드림 0.7~최대 3.5% 적립',
      tags: ['gas', 'shopping', 'store', 'all'],
      externalLink: 'https://www.shinhancard.com/pconts/html/card/apply/credit/1188310_2207.html'
    },
    {
      id: 'hyundai_m',
      name: 'Hyundai Card M',
      company: '현대카드',
      type: 'credit',
      benefits: ['카페', '외식', '온라인쇼핑'],
      annualFee: '30,000원',
      prevMonthRecord: '50만원 이상',
      imageText: 'M',
      imageUrl: '/images/cards/hyundai_m.png',
      bestBenefit: '업종별 최대 3% M포인트 적립',
      tags: ['coffee', 'food', 'shopping'],
      externalLink: 'https://www.hyundaicard.com/cpc/cr/CPCCR0201_01.hc?cardWcd=M'
    },
    {
      id: 'kb_daero',
      name: '다담카드',
      company: 'KB국민카드',
      type: 'credit',
      benefits: ['대중교통', '통신', '음식점'],
      annualFee: '15,000원',
      prevMonthRecord: '30만원 이상',
      imageText: 'Dadam',
      imageUrl: '/images/cards/dadam.png',
      bestBenefit: '선택형 서비스팩 최대 10% 적립',
      tags: ['traffic', 'telecom', 'food'],
      externalLink: 'https://card.kbcard.com/CRD/DVIEW/CPPC_STARDARD_CARD_DETAIL?mainCC=a&cardNm=다담카드'
    },
    {
      id: 'samsung_id',
      name: '삼성 iD ON 카드',
      company: '삼성카드',
      type: 'credit',
      benefits: ['배달앱', '카페', '스트리밍'],
      annualFee: '20,000원',
      prevMonthRecord: '30만원 이상',
      imageText: 'iD',
      imageUrl: '/images/cards/samsung_id.png',
      bestBenefit: '많이 쓰는 영역 30% 자동 할인',
      tags: ['delivery', 'coffee', 'streaming'],
      externalLink: 'https://www.samsungcard.com/home/card/cardinfo/doviewCardApp.do?mainCC=y&p_card_id=71243'
    },
    {
      id: 'lotte_loca',
      name: 'LOCA 365 카드',
      company: '롯데카드',
      type: 'credit',
      benefits: ['공과금', '아파트관리비', '보험료'],
      annualFee: '20,000원',
      prevMonthRecord: '50만원 이상',
      imageText: 'LOCA',
      imageUrl: '/images/cards/loca_365.png',
      bestBenefit: '생활 업종 월 최대 36,500원 할인',
      tags: ['energy', 'all'],
      externalLink: 'https://www.lottecard.co.kr/app/LPCDADB_V100.lc?unon_id=14183'
    },
    {
      id: 'hana_multi',
      name: 'MULTI Any 카드',
      company: '하나카드',
      type: 'credit',
      benefits: ['모든가맹점', '단순함'],
      annualFee: '12,000원',
      prevMonthRecord: '실적 무관',
      imageText: 'MULTI',
      imageUrl: '/images/cards/multi_any.png',
      bestBenefit: '전 가맹점 0.7~4.0% 적립',
      tags: ['all', 'shopping'],
      externalLink: 'https://www.hanacard.co.kr/OPI41001M.web?schID=pcd&mID=OPI41001M&CD_WID=07026'
    }
  ];

  let filtered = [...products];

  if (filters.length > 0) {
    filtered = filtered.filter(p => filters.some(f => p.tags.includes(f)));
  }

  return { products: filtered, isMock: true };
}
// 개별 카드 조회
export async function getCardById(id: string) {
  const { products } = await getCards();
  const productIndex = products.findIndex(p => p.id === id);
  const product = productIndex !== -1 ? products[productIndex] : null;
  
  return { 
    product,
    rank: productIndex + 1,
    total: products.length,
    top5: products.slice(0, 5)
  };
}
