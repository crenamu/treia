import { NextResponse } from 'next/server'

interface LHItem {
  PAN_ID: string
  PAN_NM: string
  CNP_CD_NM: string
  AIS_TP_CD_NM: string
  PAN_ST_NM: string
  PAN_NT_ST_DT: string
  CLSG_DT: string | null
  DTL_URL: string
}

const MOCK_NOTICES = [
  {
    id: 'MOCK_LH_1',
    title: '[AI추천] 서울양원 S1블록 통합공공임대주택 입주자 모집',
    location: '서울특별시 중랑구',
    org: 'LH서울지역본부',
    status: '접수중',
    date: '2026.03.10 ~ 2026.03.25',
    type: '통합공공임대',
    provider: 'LH',
    link: 'https://apply.lh.or.kr',
    description: '서울 양원 S1블록에 위치한 통합공공임대주택입니다. 신혼부부 및 청년층을 위한 특별 공급 물량이 포함되어 있습니다.'
  },
  {
    id: 'MOCK_LH_2',
    title: '동탄2 A-94블록 장기전세주택 예비입주자 모집',
    location: '경기도 화성시',
    org: 'LH경기남부지역본부',
    status: '공고중',
    date: '2026.03.15 ~ 2026.04.05',
    type: '장기전세',
    provider: 'LH',
    link: 'https://apply.lh.or.kr',
    description: '동탄2 신도시 A-94블록의 장기전세주택입니다. 주변 시세보다 저렴한 전세가로 최장 20년까지 거주 가능합니다.'
  },
  {
    id: 'MOCK_SH_1',
    title: '제1차 행복주택 입주자 모집 (가양, 신내, 마곡 등)',
    location: '서울특별시 강서구 외',
    org: 'SH공사',
    status: '접수중',
    date: '2026.03.12 ~ 2026.03.30',
    type: '행복주택',
    provider: 'SH',
    link: 'https://www.i-sh.co.kr',
    description: 'SH공사에서 공급하는 2026년 제1차 행복주택입니다. 직주근접을 원하는 청년 및 사회초년생에게 추천합니다.'
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const pageSize = searchParams.get('pageSize') || '10'
  const id = searchParams.get('id')
  
  const API_KEY = process.env.PUBLIC_DATA_API_KEY
  const BASE_URL = `http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1`

  if (!API_KEY) {
    if (id) {
       const notice = MOCK_NOTICES.find(n => n.id === id)
       return NextResponse.json({ success: true, notice, isMock: true })
    }
    return NextResponse.json({ success: true, notices: MOCK_NOTICES, isMock: true });
  }

  try {
    const response = await fetch(`${BASE_URL}?serviceKey=${API_KEY}&numOfRows=${pageSize}&pageNo=${page}&UPP_AIS_TP_CD=06&_type=json`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) throw new Error('API Response Error');

    const data = await response.json()
    const dsList = Array.isArray(data) ? data[1]?.dsList : data?.dsList;
    const rawList: LHItem[] = dsList || []
    
    if (rawList.length === 0) {
      if (id) {
        const notice = MOCK_NOTICES.find(n => n.id === id)
        return NextResponse.json({ success: true, notice, isMock: true })
     }
      return NextResponse.json({ success: true, notices: MOCK_NOTICES, isMock: true });
    }

    const formattedList = rawList.map((item: LHItem) => ({
      id: item.PAN_ID,
      title: item.PAN_NM,
      location: item.CNP_CD_NM,
      org: item.AIS_TP_CD_NM,
      status: item.PAN_ST_NM,
      date: `${item.PAN_NT_ST_DT} ~ ${item.CLSG_DT || '상시'}`,
      type: item.AIS_TP_CD_NM,
      size: '상세 확인 필요',
      provider: 'LH',
      link: item.DTL_URL
    }))

    if (id) {
      const notice = formattedList.find(n => n.id === id) || MOCK_NOTICES.find(n => n.id === id);
      return NextResponse.json({ success: true, notice, isMock: false });
    }

    return NextResponse.json({
      success: true,
      notices: formattedList,
      isMock: false
    })
  } catch (error) {
    console.error('Housing API Error:', error)
    if (id) {
      const notice = MOCK_NOTICES.find(n => n.id === id)
      return NextResponse.json({ success: true, notice, isMock: true })
    }
    return NextResponse.json({ 
      success: true, 
      notices: MOCK_NOTICES,
      isMock: true,
      message: 'API 연동 장애로 시뮬레이션 데이터를 표시합니다.'
    })
  }
}
