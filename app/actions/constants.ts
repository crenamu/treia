// 제1금융권 은행 리스트 (시중은행 및 인터넷은행)
export const TIER_1_BANKS = [
  '한국산업은행', 'NH농협은행', '신한은행', '우리은행', 'SC제일은행', 
  '하나은행', '중소기업은행', 'KB국민은행', '한국씨티은행', 'SH수협은행', 
  '대구은행', '부산은행', '광주은행', '제주은행', '전북은행', 
  '경남은행', '케이뱅크', '카카오뱅크', '토스뱅크', '수협은행'
];

// 뱅크샐러드 기준 1금융권 선택 리스트 (표기명 및 로고 포함)
export const BANK_LIST_TIER_1 = [
  { id: 'kb', name: '국민은행', logo: 'https://i.ibb.co/vzYyX6L/kb.png' },
  { id: 'shinhan', name: '신한은행', logo: 'https://i.ibb.co/hR0M1X9/shinhan.png' },
  { id: 'woori', name: '우리은행', logo: 'https://i.ibb.co/0m8B7zH/woori.png' },
  { id: 'hana', name: '하나은행', logo: 'https://i.ibb.co/4P2X7S1/hana.png' },
  { id: 'nh', name: '농협은행', logo: 'https://i.ibb.co/vB8Z1zK/nh.png' },
  { id: 'ibk', name: '기업은행', logo: 'https://i.ibb.co/fDxz1Xk/ibk.png' },
  { id: 'kbank', name: '케이뱅크', logo: 'https://i.ibb.co/yq8Z1zK/kbank.png' },
  { id: 'kakao', name: '카카오뱅크', logo: 'https://i.ibb.co/XzYyX6L/kakao.png' },
  { id: 'toss', name: '토스뱅크', logo: 'https://i.ibb.co/ZzYyX6L/toss.png' },
  { id: 'kdb', name: 'KDB산업은행', logo: 'https://i.ibb.co/fDxz1Xl/kdb.png' },
  { id: 'sc', name: 'SC제일은행', logo: 'https://i.ibb.co/fDxz1Xm/sc.png' },
  { id: 'sh', name: '수협은행', logo: 'https://i.ibb.co/fDxz1Xn/sh.png' },
  { id: 'im', name: 'iM뱅크', logo: 'https://i.ibb.co/fDxz1Xo/im.png' },
  { id: 'bnk_bs', name: '부산은행', logo: 'https://i.ibb.co/fDxz1Xp/bs.png' },
  { id: 'bnk_kn', name: '경남은행', logo: 'https://i.ibb.co/fDxz1Xq/kn.png' },
  { id: 'kjb', name: '광주은행', logo: 'https://i.ibb.co/fDxz1Xr/kj.png' },
  { id: 'jbb', name: '전북은행', logo: 'https://i.ibb.co/fDxz1Xs/jb.png' },
  { id: 'jjb', name: '제주은행', logo: 'https://i.ibb.co/fDxz1Xt/jj.png' },
  { id: 'post', name: '우체국', logo: 'https://i.ibb.co/fDxz1Xu/post.png' }
];

export const BANK_LOGOS: Record<string, string> = BANK_LIST_TIER_1.reduce((acc, bank) => ({
  ...acc,
  [bank.name]: bank.logo,
  [bank.name.replace('은행', '')]: bank.logo,
  [bank.id]: bank.logo
}), {});

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
