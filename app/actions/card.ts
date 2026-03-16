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
  bestBenefit: string
  tags: string[]
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
      bestBenefit: '월 최대 5만원 포인트 적립',
      tags: ['gas', 'shopping', 'store', 'all']
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
      bestBenefit: '업종별 최대 3% M포인트 적립',
      tags: ['coffee', 'food', 'shopping']
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
      bestBenefit: '선택형 서비스팩 최대 10% 적립',
      tags: ['traffic', 'telecom', 'food']
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
      bestBenefit: '많이 쓰는 영역 30% 자동 할인',
      tags: ['delivery', 'coffee', 'streaming']
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
      bestBenefit: '생활 업종 월 최대 36,500원 할인',
      tags: ['energy', 'all']
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
      bestBenefit: '전 가맹점 0.7~4.0% 적립',
      tags: ['all', 'shopping']
    }
  ];

  let filtered = [...products];

  if (filters.length > 0) {
    filtered = filtered.filter(p => filters.some(f => p.tags.includes(f)));
  }

  return { products: filtered, isMock: true };
}
