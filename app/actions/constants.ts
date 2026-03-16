// 제1금융권 은행 리스트 (시중은행 및 인터넷은행)
export const TIER_1_BANKS = [
  '한국산업은행', 'NH농협은행', '신한은행', '우리은행', 'SC제일은행', 
  '하나은행', '중소기업은행', 'KB국민은행', '한국씨티은행', 'SH수협은행', 
  '대구은행', '부산은행', '광주은행', '제주은행', '전북은행', 
  '경남은행', '케이뱅크', '카카오뱅크', '토스뱅크', '수협은행'
];

// 뱅크샐러드 기준 1금융권 선택 리스트 (표기명 및 로고 포함)
export const BANK_LIST_TIER_1 = [
  { id: 'kb', name: '국민은행', logo: 'https://static.toss.im/png-icons/bank/kb.png' },
  { id: 'shinhan', name: '신한은행', logo: 'https://static.toss.im/png-icons/bank/shinhan.png' },
  { id: 'woori', name: '우리은행', logo: 'https://static.toss.im/png-icons/bank/woori.png' },
  { id: 'hana', name: '하나은행', logo: 'https://static.toss.im/png-icons/bank/hana.png' },
  { id: 'nh', name: '농협은행', logo: 'https://static.toss.im/png-icons/bank/nh.png' },
  { id: 'ibk', name: '기업은행', logo: 'https://static.toss.im/png-icons/bank/ibk.png' },
  { id: 'kbank', name: '케이뱅크', logo: 'https://static.toss.im/png-icons/bank/kbank.png' },
  { id: 'kakao', name: '카카오뱅크', logo: 'https://static.toss.im/png-icons/bank/kakaobank.png' },
  { id: 'toss', name: '토스뱅크', logo: 'https://static.toss.im/png-icons/bank/tossbank.png' },
  { id: 'kdb', name: 'KDB산업은행', logo: 'https://static.toss.im/png-icons/bank/kdb.png' },
  { id: 'sc', name: 'SC제일은행', logo: 'https://static.toss.im/png-icons/bank/sc.png' },
  { id: 'sh', name: '수협은행', logo: 'https://static.toss.im/png-icons/bank/sh.png' },
  { id: 'im', name: 'iM뱅크', logo: 'https://static.toss.im/png-icons/bank/dgb.png' },
  { id: 'bnk_bs', name: '부산은행', logo: 'https://static.toss.im/png-icons/bank/busan.png' },
  { id: 'bnk_kn', name: '경남은행', logo: 'https://static.toss.im/png-icons/bank/kyongnam.png' },
  { id: 'kjb', name: '광주은행', logo: 'https://static.toss.im/png-icons/bank/kwangju.png' },
  { id: 'jbb', name: '전북은행', logo: 'https://static.toss.im/png-icons/bank/jeonbuk.png' },
  { id: 'jjb', name: '제주은행', logo: 'https://static.toss.im/png-icons/bank/jeju.png' },
  { id: 'post', name: '우체국', logo: 'https://static.toss.im/png-icons/bank/epost.png' }
];

// 뱅크샐러드 가이드라인에 맞춘 금융기관 로고 맵핑 (Toss CDN 활용)
const BANK_LOGO_MAP: Record<string, string> = {
  '국민': 'kb', '신한': 'shinhan', '우리': 'woori', '하나': 'hana', '농협': 'nh',
  'NH': 'nh', '기업': 'ibk', 'IBK': 'ibk', '케이': 'kbank', '카카오': 'kakaobank',
  '토스': 'tossbank', '산업': 'kdb', 'KDB': 'kdb', '제일': 'sc', 'SC': 'sc',
  '수협': 'sh', 'SH': 'sh', '대구': 'dgb', 'iM': 'dgb', '부산': 'busan',
  '경남': 'kyongnam', '광주': 'kwangju', '전북': 'jeonbuk', '제주': 'jeju',
  '우체국': 'epost', '씨티': 'citi', '새마을': 'saemaul', '신협': 'cu',
  '산림': 'nfcf', '저축': 'savingsbank', '우리종합': 'woori', // 우리종합금융은 우리은행 로고와 유사하게 처리
};

export const BANK_LOGOS: Record<string, string> = {
  ...BANK_LIST_TIER_1.reduce((acc, bank) => ({ ...acc, [bank.name]: bank.logo }), {}),
  // 동적 로고 생성 (키워드 기반)
  ...Object.entries(BANK_LOGO_MAP).reduce((acc, [key, id]) => ({
    ...acc,
    [key]: `https://static.toss.im/png-icons/bank/${id}.png`
  }), {})
};

// 뱅크샐러드 기준 2금융권(저축은행) 선택 리스트
export const BANK_LIST_TIER_2 = [
  { id: 'bnk', name: 'BNK저축은행' },
  { id: 'ck', name: 'CK저축은행' },
  { id: 'db', name: 'DB저축은행' },
  { id: 'dh', name: 'DH저축은행' },
  { id: 'hb', name: 'HB저축은행' },
  { id: 'ibks', name: 'IBK저축은행' },
  { id: 'jt', name: 'JT저축은행' },
  { id: 'jtc', name: 'JT친애저축은행' },
  { id: 'kbs', name: 'KB저축은행' },
  { id: 'ms', name: 'MS저축은행' },
  { id: 'nhs', name: 'NH저축은행' },
  { id: 'o2', name: 'O2저축은행' },
  { id: 'ok', name: 'OK저축은행' },
  { id: 'osb', name: 'OSB저축은행' },
  { id: 'sbi', name: 'SBI저축은행' },
  { id: 'sky', name: 'SKY저축은행' },
  { id: 'snt', name: 'SNT저축은행' },
  { id: 'koryo', name: '고려저축은행' },
  { id: 'dream', name: '드림저축은행' },
  { id: 'sol', name: '솔브레인저축은행' }
];

// 카드사 리스트 (신용카드는 권역 구분이 무의미하므로 통합 관리)
export const CARD_ISSUERS = [
  '신한카드', '현대카드', 'KB국민카드', '삼성카드', '롯데카드', 
  '하나카드', '우리인터내셔널', 'IBK기업은행', 'NH농협카드', 'BC카드'
];

export const TIER_1_CARD_ISSUERS = [
  '신한카드', '현대카드', 'KB국민카드', '삼성카드', '하나카드'
];
