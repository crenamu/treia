// 제1금융권 은행 리스트 (시중은행 및 인터넷은행)
export const TIER_1_BANKS = [
  '한국산업은행', 'NH농협은행', '신한은행', '우리은행', 'SC제일은행', 
  '하나은행', '중소기업은행', 'KB국민은행', '한국씨티은행', 'SH수협은행', 
  '대구은행', '부산은행', '광주은행', '제주은행', '전북은행', 
  '경남은행', '케이뱅크', '카카오뱅크', '토스뱅크', '수협은행'
];

// 뱅크샐러드 기준 1금융권 선택 리스트 (표기명 및 로고 포함)
// 로컬 저장된 금융기관 로고 경로
const LOCAL_LOGO_BASE = '/images/banks';

// 뱅크샐러드 기준 1금융권 선택 리스트 (ID 업데이트)
export const BANK_LIST_TIER_1 = [
  { id: 'kb', name: '국민은행', logo: `${LOCAL_LOGO_BASE}/kb.png` },
  { id: 'shinhan', name: '신한은행', logo: `${LOCAL_LOGO_BASE}/shinhan.png` },
  { id: 'woori', name: '우리은행', logo: `${LOCAL_LOGO_BASE}/woori.png` },
  { id: 'hana', name: '하나은행', logo: `${LOCAL_LOGO_BASE}/hana.png` },
  { id: 'nh', name: '농협은행', logo: `${LOCAL_LOGO_BASE}/nh.png` },
  { id: 'ibk', name: '기업은행', logo: `${LOCAL_LOGO_BASE}/ibk.png` },
  { id: 'kbank', name: '케이뱅크', logo: `${LOCAL_LOGO_BASE}/kbank.png` },
  { id: 'kakao', name: '카카오뱅크', logo: `${LOCAL_LOGO_BASE}/kakao.png` },
  { id: 'toss', name: '토스뱅크', logo: `${LOCAL_LOGO_BASE}/toss.png` },
  { id: 'kdb', name: 'KDB산업은행', logo: `${LOCAL_LOGO_BASE}/kdb.png` },
  { id: 'sc', name: 'SC제일은행', logo: `${LOCAL_LOGO_BASE}/sc.png` },
  { id: 'suhyup', name: '수협은행', logo: `${LOCAL_LOGO_BASE}/suhyup.png` },
  { id: 'dgb', name: '대구은행', logo: `${LOCAL_LOGO_BASE}/dgb.png` },
  { id: 'busan', name: '부산은행', logo: `${LOCAL_LOGO_BASE}/busan.png` },
  { id: 'kyongnam', name: '경남은행', logo: `${LOCAL_LOGO_BASE}/kyongnam.png` },
  { id: 'kwangju', name: '광주은행', logo: `${LOCAL_LOGO_BASE}/kwangju.png` },
  { id: 'jeonbuk', name: '전북은행', logo: `${LOCAL_LOGO_BASE}/jeonbuk.png` },
  { id: 'jeju', name: '제주은행', logo: `${LOCAL_LOGO_BASE}/jeju.png` },
  { id: 'post', name: '우체국', logo: `${LOCAL_LOGO_BASE}/post.png` }
];

// 뱅크샐러드 가이드라인에 맞춘 금융기관 로고 맵핑 (로컬 파일 활용)
const BANK_LOGO_MAP: Record<string, string> = {
  '국민': 'kb', '신한': 'shinhan', '우리': 'woori', '하나': 'hana', '농협': 'nh',
  'NH': 'nh', '기업': 'ibk', 'IBK': 'ibk', '케이': 'kbank', '카카오': 'kakao',
  '토스': 'toss', '산업': 'kdb', 'KDB': 'kdb',
  '수협': 'suhyup', 'SH': 'suhyup', '대구': 'dgb', 'iM': 'im', '아이엠': 'im', '부산': 'busan',
  '경남': 'kyongnam', '광주': 'kwangju', '전북': 'jeonbuk', '제주': 'jeju',
  '우체국': 'post', '씨티': 'citi', 'SC': 'sc', '제일': 'sc', '스탠다드': 'sc',
  '새마을': 'mg', '신협': 'cu', '산림': 'nfcf', '다올': 'daol', '조은': 'choeun', 
  '웰컴': 'welcome', 'OK': 'ok', 'SBI': 'sbi', '페퍼': 'pepper', '더케이': 'thek', 
  '영진': 'youngjin', '흥국': 'heungkuk', '예가람': 'heungkuk', '고려': 'heungkuk', 
  'HB': 'hb', 'BNK': 'bnk', 'DB': 'db', '드림': 'dream', 'O2': 'o2', 'OSB': 'osb', 
  'JT': 'jt', '푸른': 'pureun', '미래': 'mirae', '대한': 'daehan', '동원': 'dongwon', 
  '동양': 'dongyang', '진주': 'jinju', '대명': 'daemyeong', '키움': 'kiwoombank', 
  '상상인': 'sangsangin', '모아': 'moa', '유안타': 'uanta', '세람': 'seram', 
  '조흥': 'choheung', '삼호': 'samho', '부림': 'bulim', '솔브레인': 'soulbrain', 
  '애큐온': 'acuon', '키움예스': 'kiwoomyes', '평택': 'pyeongtaek', '인성': 'insung', 
  '오성': 'osung', '금화': 'kuemhwa', '참': 'charm', '안국': 'ankuk', '스타': 'star', 
  '민국': 'minkuk', '유니온': 'union', '한화': 'hanwha', '대신': 'daeshin', 
  '국제': 'kukje', '스카이': 'sky', 'SKY': 'sky', '바로': 'baro', '융창': 'yungchang',
  '남양': 'namyang', '안양': 'anyang', '삼정': 'samjung', '인천': 'incheon', 'DH': 'dh',
  '우리금융': 'woori', '신한저축': 'shinhan', 'KB저축': 'kb',
  '우리저축': 'woori', '하나저축': 'hana', 'NH저축': 'nh', 'IBK저축': 'ibk',
  '저축': 'savingsbank'
};

export const BANK_LOGOS: Record<string, string> = {
  ...BANK_LIST_TIER_1.reduce((acc, bank) => ({ ...acc, [bank.name]: bank.logo }), {}),
  // 동적 로고 생성 (키워드 기반)
  ...Object.entries(BANK_LOGO_MAP).reduce((acc, [key, id]) => ({
    ...acc,
    [key]: `${LOCAL_LOGO_BASE}/${id}.png`
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

export const BANK_URLS: Record<string, string> = {
  '신한은행': 'https://www.shinhan.com',
  '우리은행': 'https://www.wooribank.com',
  '하나은행': 'https://www.kebhana.com',
  '농협은행': 'https://www.nhbank.com',
  '기업은행': 'https://www.ibk.co.kr',
  '케이뱅크': 'https://www.kbanknow.com',
  '카카오뱅크': 'https://www.kakaobank.com',
  '토스뱅크': 'https://www.tossbank.com',
  '산업은행': 'https://www.kdb.co.kr',
  'SC제일은행': 'https://www.standardchartered.co.kr',
  '수협은행': 'https://www.suhyup-bank.com',
  '대구은행': 'https://www.dgb.co.kr',
  '부산은행': 'https://www.busanbank.co.kr',
  '경남은행': 'https://www.knbank.co.kr',
  '광주은행': 'https://www.kjbank.com',
  '전북은행': 'https://www.jbbank.co.kr',
  '제주은행': 'https://www.jejubank.co.kr',
  '한국씨티은행': 'https://www.citibank.co.kr',
  '우체국': 'https://www.epostbank.go.kr',
  '신한카드': 'https://www.shinhancard.com',
  '현대카드': 'https://www.hyundaicard.com',
  '삼성카드': 'https://www.samsungcard.com',
  'KB국민카드': 'https://www.kbcard.com',
  '롯데카드': 'https://www.lottecard.co.kr',
  '하나카드': 'https://www.hanacard.co.kr',
  '우리카드': 'https://www.wooricard.com',
  '비씨카드': 'https://www.bccard.com'
};

/**
 * 전수 조사를 통한 주요 상품별 다이렉트 URL 매핑 (금융상품코드(fin_prdt_cd) 기준)
 */
export const DIRECT_PRODUCT_URLS: Record<string, string> = {
  // --- 예금 (Deposit) ---
  'WR0001B': 'https://spot.wooribank.com/pot/Dream?withyou=PRDEP0011&cc=c010528:c010531;c012425:c012425&PL_PRD_CD=P010002131&P_PRD_CD=P010002131', // 우리은행 WON플러스예금
  '10-011-137-0036': 'https://obank.kbstar.com/quics?page=C016613&cc=b061496:b061645&prdcNm=KB%20Star%20%EC%A0%95%EA%B8%B0%EC%98%88%EA%B8%88', // KB국민은행 KB Star 정기예금
  'D0000000001': 'https://bank.shinhan.com/index.jsp#020101010000', // 신한은행 My플러스 정기예금
  'P010002473': 'https://www.kakaobank.com/products/deposit', // 카카오뱅크 정기예금
  '10-01-20-388-0002': 'https://www.kakaobank.com/products/deposit', // 카카오뱅크 정기예금 (신규 코드 대응)
  'TOSSBANK_DEP_01': 'https://www.tossbank.com/product/deposit', // 토스뱅크 먼저 이자 받는 정기예금
  '1001202000002': 'https://www.tossbank.com/product/deposit', // 토스뱅크 먼저 이자 받는 정기예금 (신규 코드 대응)
  '1021101010001': 'https://www.kbanknow.com/ib20/mnu/FPMDPT010100', // 케이뱅크 코드K 정기예금 (URL 수정)
  '01013000110000000001': 'https://www.kbanknow.com/ib20/mnu/FPMDPT010100', // 케이뱅크 코드K 정기예금 (신규 코드 대응)
  '10-01-20-024-0046-0000': 'https://www.jbbank.co.kr/gdnc_smyr_direct.act', // 전북은행 JB 다이렉트 예금
  'HB_OFFLINE_DEP': 'https://www.hbsb.co.kr/deposit/online-time-deposit', // HB저축은행 비대면 정기예금
  '4': 'https://www.kebhana.com/cont/mall/mall08/mall0801/mall080101/1479088_115126.jsp', // 하나은행 하나의정기예금
  '207-0134-16': 'https://bank.shinhan.com/index.jsp?sns_type=fb&cr=020102010110&pcd=207013416', // 신한은행 신한My플러스 정기예금
  '207-0135-12': 'https://m.shinhan.com/mw/fin/pg/PR0401S0000F01?mid=220011112006&pid=207013512&type=now', // 신한은행 쏠편한 정기예금
  '01211310142': 'https://mybank.ibk.co.kr/uib/jsp/guest/ntr/ntr70/ntr7010/PNTR701000_i2.jsp?lncd=01&grcd=21&tmcd=131&pdcd=0130', // IBK기업은행 IBK굴리기통장
  
  // --- 적금 (Savings) ---
  'WR0001S': 'https://spot.wooribank.com/pot/Dream?withyou=PRDEP0012&cc=c010528:c010531;c012425:c012425&PL_PRD_CD=P020002129', // 우리은행 WON적금
  'WR0001L': 'https://spot.wooribank.com/pot/Dream?withyou=PRDEP0012&cc=c010528:c010531;c012425:c012425&PL_PRD_CD=P020002129', // 우리은행 WON적금 (코드 보완)
  '10-01-30-355-0002': 'https://www.kakaobank.com/products/savings', // 카카오뱅크 자유적금
  '1001303001004': 'https://www.tossbank.com/product-service/savings/savings-freedom', // 토스뱅크 자유 적금
  '01012000210000000000': 'https://www.kbanknow.com/ib20/mnu/FPMISA020000', // 케이뱅크 주거래우대 자유적금
  '01012000200000000003': 'https://www.kbanknow.com/ib20/mnu/FPMISA010100', // 케이뱅크 코드K 자유적금
  '230-0119-85': 'https://bank.shinhan.com/index.jsp?sns_type=fb&cr=020102010110&pcd=230011985', // 신한은행 신한 알.쏠 적금
  
  // --- 대출 (Loan) ---
  'L00000001': 'https://www.kakaobank.com/products/loan/credit', // 카카오뱅크 신용대출
}

// 특정 상품 페이지 다이렉트 랜딩을 위한 검색 URL 생성기
export function getSmartLandingUrl(bankName: string, productName: string, prdtCd?: string) {
  // 1. 다이렉트 매핑 우선 확인
  if (prdtCd && DIRECT_PRODUCT_URLS[prdtCd]) {
    return DIRECT_PRODUCT_URLS[prdtCd];
  }
  
  // 2. 은행 공식 홈페이지로 연결 (은행 이름 기반)
  const bankKey = Object.keys(BANK_URLS).find(key => bankName.includes(key));
  if (bankKey) {
    return BANK_URLS[bankKey];
  }

  // 3. 일반 검색 엔진으로 연결 (최후의 수단)
  const query = `${bankName} ${productName} 가입 안내`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
};
