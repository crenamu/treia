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

import { TIER_1_CARD_ISSUERS } from './constants';

// 뱅크샐러드급 데이터 분류 로직 시뮬레이션
export async function getCards(filters: string[] = [], tier: 'all' | '1' = 'all') {
  // 실제로는 금감원 API + 각 카드사 크롤링/제휴 데이터를 결합해야 하나 
  // 여기서는 구조를 잡기 위해 큐레이션된 고품질 데이터를 제공합니다.
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
      tags: ['gas', 'shopping', 'store']
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
      id: 'lotte_likit',
      name: 'LOCA LIKIT 1.2',
      company: '롯데카드',
      type: 'credit',
      benefits: ['모든가맹점', '단순함'],
      annualFee: '10,000원',
      prevMonthRecord: '실적 무관',
      imageText: 'LIKIT',
      bestBenefit: '국내외 전 가맹점 1.2% 할인',
      tags: ['all', 'shopping']
    }
  ];

  let filtered = [...products];

  // 1금융권 필터링
  if (tier === '1') {
    filtered = filtered.filter(p => TIER_1_CARD_ISSUERS.some(issuer => p.company.includes(issuer)));
  }
  if (filters.length > 0) {
    filtered = filtered.filter(p => filters.some(f => p.tags.includes(f)));
  }

  return { products: filtered, isMock: true };
}
