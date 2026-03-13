import { NextResponse } from 'next/server';

const FSS_API_URL = 'http://finlife.fss.or.kr/finlifeapi/savingProductsSearch.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trm = searchParams.get('trm') || '12';
  const apiKey = process.env.FSS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'FSS_API_KEY is not defined' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `${FSS_API_URL}?auth=${apiKey}&topFinGrpNo=020000&pageNo=1`,
      { next: { revalidate: 3600 } } // 1시간 캐시
    );

    const data = await res.json();

    if (data.result?.err_cd !== '000') {
      return NextResponse.json({ error: data.result?.err_msg }, { status: 400 });
    }

    const baseList = data.result.baseList || [];
    const optionList = data.result.optionList || [];

    // 가공: baseList와 optionList 조인
    const products = baseList.map((base: any) => {
      // 해당 상품의 옵션들 중 trm(기간)이 맞는 것들을 필터링
      let productOptions = optionList.filter(
        (opt: any) => opt.fin_prdt_cd === base.fin_prdt_cd
      );

      if (trm !== '0') {
        productOptions = productOptions.filter((opt: any) => opt.save_trm === trm);
      }

      if (productOptions.length === 0) return null;

      // 금리가 가장 높은 옵션을 대표 옵션으로 설정
      const bestOption = productOptions.reduce((prev: any, curr: any) => {
        return (prev.intr_rate2 || 0) > (curr.intr_rate2 || 0) ? prev : curr;
      });

      return {
        ...base,
        bestOption,
        options: productOptions,
      };
    }).filter(Boolean);

    // 정렬
    products.sort((a: any, b: any) => (b.bestOption?.intr_rate2 || 0) - (a.bestOption?.intr_rate2 || 0));

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Savings API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
