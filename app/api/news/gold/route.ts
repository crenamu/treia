import { NextResponse } from 'next/server';
import { getMarketNews } from '@/lib/finnhub';
import { askGemini } from '@/lib/gemini';

export async function GET() {
  try {
    const rawNews = await getMarketNews("forex"); // forex 뉴스 10개
    if (!rawNews || rawNews.length === 0) {
      return NextResponse.json({ success: false, data: [] });
    }

    const newsText = rawNews.map((n, i) => `뉴스${i+1}: [제목] ${n.headline} [URL] ${n.url}`).join('\n');
    
    const prompt = `
넌 전문 글로벌 매크로 및 금(Gold) CFD 트레이더야. 
아래 최신 외환/글로벌 뉴스 목록 중에서 **"골드 트레이딩(XAUUSD)"과 거시경제 흐름에 가장 큰 영향을 미칠만한 뉴스 3가지**만 엄선해서 한글로 번역 및 큐레이션해줘.

[뉴스 원문 데이터]
${newsText}

[출력 형식 제한]
반드시 아래 JSON 배열 형식으로만 응답할 것 (마크다운 백틱 제외):
[
  {
    "id": 1,
    "headline": "한글로 의역한 뉴스 헤드라인 (가독성 좋고 전문성 있게)",
    "summary": "1~2줄 분량의 트레이딩 인사이트 한글 요약",
    "url": "원문 URL"
  }
]
`;

    const result = await askGemini(prompt);
    const cleanResult = result.replace(/```json|```/gi, '').trim();
    
    // Fallback if parsing fails
    try {
      const curated = JSON.parse(cleanResult);
      return NextResponse.json({ success: true, data: curated });
    } catch(e) {
      console.error("Gemini JSON parse failed:", e);
      return NextResponse.json({ success: true, data: [] });
    }

  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
