'use server'

const API_KEY = process.env.PUBLIC_DATA_API_KEY
const BASE_URL = `http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1`
// 04: 임대주택, 06: 공공임대, 01: 토지/상가 제외한 주거 위주
const AIS_TYPES = ['03', '04', '06'] 

export interface HousingNotice {
  id: string
  title: string
  location: string
  org: string
  status: string
  date: string
  type: string
  provider: string
  link: string
  description?: string
}

const MOCK_NOTICES: HousingNotice[] = [
  {
    id: 'MOCK_LH_1',
    title: '[AI추천] 서울양원 S1블록 통합공공임대주택 입주자 모집',
    location: '서울특별시 중랑구',
    org: 'LH서울지역본부',
    status: '접수중',
    date: '2026.03.10 ~ 2026.03.25',
    type: '통합공공임대',
    provider: 'LH',
    link: 'https://apply.lh.or.kr'
  }
];

export async function getHousingNotices(page: string = '1', pageSize: string = '100', id?: string) {
  if (!API_KEY) {
    if (id) return { notice: MOCK_NOTICES.find(n => n.id === id), isMock: true };
    return { notices: MOCK_NOTICES, isMock: true };
  }

  try {
    const results = await Promise.all(
      AIS_TYPES.map(async (type) => {
        // numOfRows를 100으로 늘려 '내집다오' 수준의 방대한 공고 데이터를 확보
        const url = `${BASE_URL}?serviceKey=${API_KEY}&numOfRows=${pageSize}&pageNo=${page}&UPP_AIS_TP_CD=${type}&_type=json`;
        try {
          const res = await fetch(url, { next: { revalidate: 3600 } });
          if (!res.ok) return null;
          return await res.json();
        } catch (e) {
          return null;
        }
      })
    );

    let allRawItems: any[] = [];
    results.forEach(data => {
      const dsList = Array.isArray(data) ? data[1]?.dsList : data?.dsList;
      if (dsList) allRawItems = [...allRawItems, ...dsList];
    });

    if (allRawItems.length === 0) {
      if (id) return { notice: MOCK_NOTICES.find(n => n.id === id), isMock: true };
      return { notices: MOCK_NOTICES, isMock: true };
    }

    const formatted = allRawItems.map((item: any) => ({
      id: item.PAN_ID,
      title: item.PAN_NM,
      location: item.CNP_CD_NM,
      org: item.AIS_TP_CD_NM,
      status: item.PAN_ST_NM,
      date: `${item.PAN_NT_ST_DT} ~ ${item.CLSG_DT || '상시'}`,
      type: item.AIS_TP_CD_NM,
      provider: 'LH',
      link: item.DTL_URL
    }));

    if (id) {
        const found = formatted.find(n => n.id === id);
        return { notice: found || MOCK_NOTICES.find(n => n.id === id), isMock: !found };
    }

    // 중복 제거 및 최신순 정렬 (날짜 기준)
    const uniqueNotices = Array.from(new Map(formatted.map(item => [item.id, item])).values());
    uniqueNotices.sort((a, b) => b.date.localeCompare(a.date));

    return { notices: uniqueNotices, isMock: false };
  } catch (error) {
    console.error('getHousingNotices Error:', error);
    return { notices: MOCK_NOTICES, isMock: true };
  }
}
