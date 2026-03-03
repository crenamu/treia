import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const revalidate = 60; // 60초마다 캐시 갱신

export async function GET() {
  try {
    const parser = new Parser();
    
    // 인베스팅닷컴 (한국) 외환 뉴스 RSS 피드
    const feed = await parser.parseURL('https://kr.investing.com/rss/news_285.rss');
    
    const curated = feed.items.slice(0, 4).map((item, i) => ({
      id: "kr_news_" + i,
      headline: item.title || '제목 없음',
      summary: item.pubDate ? new Date(item.pubDate).toLocaleString('ko-KR') + " • Investing.com" : "Investing.com",
      url: item.link || '#',
      source: "Investing.com KR"
    }));
    
    return NextResponse.json({ success: true, data: curated });

  } catch (error) {
    console.error("RSS News API Error:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
