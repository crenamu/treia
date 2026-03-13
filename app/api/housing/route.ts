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
    link: '#'
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
    link: '#'
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const pageSize = searchParams.get('pageSize') || '10'
  
  const API_KEY = process.env.PUBLIC_DATA_API_KEY
  const BASE_URL = `http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1`

  if (!API_KEY) {
    console.warn('PUBLIC_DATA_API_KEY is missing. Using Mock Data.');
    return NextResponse.json({ success: true, notices: MOCK_NOTICES, isMock: true });
  }

  try {
    // 공공데이터포털 특성상 numOfRows, pageNo 등을 시도
    const response = await fetch(`${BASE_URL}?serviceKey=${API_KEY}&numOfRows=${pageSize}&pageNo=${page}&UPP_AIS_TP_CD=06&_type=json`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) throw new Error('API Response Error');

    const data = await response.json()
    
    // LH API는 응답 구조가 배열로 올 때가 많음
    const dsList = Array.isArray(data) ? data[1]?.dsList : data?.dsList;
    const rawList: LHItem[] = dsList || []
    
    if (rawList.length === 0) {
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

    return NextResponse.json({
      success: true,
      notices: formattedList,
      isMock: false
    })
  } catch (error) {
    console.error('Housing API Error:', error)
    return NextResponse.json({ 
      success: true, 
      notices: MOCK_NOTICES,
      isMock: true,
      message: 'API 연동 장애로 시뮬레이션 데이터를 표시합니다.'
    })
  }
}
