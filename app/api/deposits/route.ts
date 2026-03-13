import { NextResponse } from 'next/server'

const API_KEY = process.env.FSS_API_KEY!
const BASE_URL = 'https://finlife.fss.or.kr/finlifeapi'
const TOP_GRP = '020000'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const trm = searchParams.get('trm') || '0'

  if (!API_KEY) {
    return NextResponse.json({ error: 'API_KEY가 설정되지 않았습니다.' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `${BASE_URL}/depositProductsSearch.json?auth=${API_KEY}&topFinGrpNo=${TOP_GRP}&pageNo=1`,
      { next: { revalidate: 3600 } } // 1시간 캐시
    )
    const data = await res.json()

    if (data.result?.err_cd && data.result.err_cd !== '000') {
      return NextResponse.json({ error: data.result.err_msg }, { status: 500 })
    }

    const baseList = data.result.baseList || []
    const optionList = data.result.optionList || []

    // 상품별 옵션 조인
    const productMap: Record<string, any> = {}
    baseList.forEach((p: any) => {
      productMap[p.fin_prdt_cd] = { ...p, options: [] }
    })
    optionList.forEach((o: any) => {
      if (productMap[o.fin_prdt_cd]) {
        productMap[o.fin_prdt_cd].options.push(o)
      }
    })

    let products = Object.values(productMap).filter((p: any) => p.options.length > 0)

    // 기간 필터
    if (trm !== '0') {
      products = products.filter((p: any) =>
        p.options.some((o: any) => String(o.save_trm) === trm)
      )
    }

    // 각 상품의 대표 옵션 (해당 기간 or 전체 중 최고금리)
    products = products.map((p: any) => {
      const opts = trm !== '0'
        ? p.options.filter((o: any) => String(o.save_trm) === trm)
        : p.options
      const best = opts.reduce((a: any, b: any) =>
        (b.intr_rate2 || 0) > (a?.intr_rate2 || 0) ? b : a, opts[0])
      return { ...p, bestOption: best }
    })

    // 최고금리 내림차순 정렬
    products.sort((a: any, b: any) => (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0))

    return NextResponse.json({ products, total: products.length })
  } catch (e) {
    console.error('FSS API Error:', e)
    return NextResponse.json({ error: '데이터 로딩 실패' }, { status: 500 })
  }
}
