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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const pageSize = searchParams.get('pageSize') || '10'
  
  const API_KEY = process.env.PUBLIC_DATA_API_KEY
  const BASE_URL = `http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1`

  try {
    const response = await fetch(`${BASE_URL}?serviceKey=${API_KEY}&PG_SZ=${pageSize}&PAGE=${page}&UPP_AIS_TP_CD=06`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    const rawList: LHItem[] = data[1]?.dsList || []
    
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
      notices: formattedList
    })
  } catch (error) {
    console.error('Housing API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch housing data' 
    }, { status: 500 })
  }
}
