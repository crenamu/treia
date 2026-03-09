import { NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini';

export const revalidate = 1800; // 30분마다 갱신 (서버사이드 캐시)

export async function GET() {
  try {
    // 1. Forex Factory JSON 가져오기
    const res = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch calendar");
    }
    
    const data = await res.json();
    
    // 2. High Impact(별 3개) & 주요 통화(USD, EUR, CNY, JPY 등) 필터링
    const highImpact = data.filter((item: any) => 
      item.impact === 'High' && 
      ['USD', 'EUR', 'CNY', 'JPY', 'GBP'].includes(item.country)
    );

    if (highImpact.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // 3. Gemini를 통한 영문 지표 한국어 번역 (프롬프트 구성)
    const titles = highImpact.map((item: any) => item.title);
    const prompt = `
다음은 글로벌 주요 경제지표 영문명들입니다. 순서를 유지하여 정확한 금융 전문 용어로 한국어로 번역해주세요. (결과만 쉼표로 구분하여 출력)
예: Non-Farm Employment Change -> 비농업 고용 변화
목록:
${titles.join('\n')}
`;
    let translatedArr: string[] = [];
    try {
      const translatedText = await askGemini(prompt);
      translatedArr = translatedText.split(/,|\n/).map(s => s.trim()).filter(Boolean);
    } catch (translateError) {
      console.warn("Gemini translation failed, using original titles:", translateError);
      // 실패 시 translatedArr는 빈 상태로 유지하여 이후 로직에서 item.title을 그대로 씀
    }

    // 4. 원본 데이터에 번역본 병합 및 반환 포맷 변환
    const formattedData = highImpact.map((item: any, idx: number) => ({
      id: idx,
      title: translatedArr.length > idx && translatedArr[idx] ? translatedArr[idx] : item.title,
      country: item.country,
      date: item.date, // ISO Format
      forecast: item.forecast || '-',
      previous: item.previous || '-',
      actual: item.actual || '-' // Forex Factory에 actual이 있을 수 있음
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Calendar API Error:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
