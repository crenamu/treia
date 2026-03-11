import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";

// ---------- 서버 메모리 캐시 (30분) ----------
let cache: { data: unknown[]; ts: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30분

interface CalendarItem {
  title: string;
  country: string;
  date: string;
  impact: string;
  forecast?: string;
  previous?: string;
  actual?: string;
}

export async function GET() {
  try {
    // 캐시가 유효하면 즉시 반환
    if (cache && Date.now() - cache.ts < CACHE_TTL) {
      return NextResponse.json({ success: true, data: cache.data });
    }

    const res = await fetch(
      "https://nfs.faireconomy.media/ff_calendar_thisweek.json",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
        next: { revalidate: 1800 },
      },
    );

    if (!res.ok) {
      // 요청 제한 등으로 실패 시 캐시 데이터 반환 (오래됐어도)
      if (cache) {
        console.warn("Calendar API fetch failed, returning stale cache");
        return NextResponse.json({ success: true, data: cache.data });
      }
      throw new Error(`Failed to fetch calendar: ${res.status}`);
    }

    const data: CalendarItem[] = await res.json();

    // High Impact & 주요 통화 필터링
    const highImpact = data.filter(
      (item) =>
        item.impact === "High" &&
        ["USD", "EUR", "CNY", "JPY", "GBP"].includes(item.country),
    );

    if (highImpact.length === 0) {
      cache = { data: [], ts: Date.now() };
      return NextResponse.json({ success: true, data: [] });
    }

    // Gemini 번역
    const titles = highImpact.map((item) => item.title);
    const prompt = `다음은 글로벌 주요 경제지표 영문명들입니다. 순서를 유지하여 정확한 금융 전문 용어로 한국어로 번역해주세요. (결과만 쉼표로 구분하여 출력)
예: Non-Farm Employment Change -> 비농업 고용 변화
목록:
${titles.join("\n")}`;

    let translatedArr: string[] = [];
    try {
      const translatedText = await askGemini(prompt);
      translatedArr = translatedText
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    } catch (translateError) {
      console.warn(
        "Gemini translation failed, using original titles:",
        translateError,
      );
    }

    const formattedData = highImpact.map((item, idx) => ({
      id: idx,
      title:
        translatedArr.length > idx && translatedArr[idx]
          ? translatedArr[idx]
          : item.title,
      country: item.country,
      date: item.date,
      forecast: item.forecast || "-",
      previous: item.previous || "-",
      actual: item.actual || "-",
    }));

    // 캐시 갱신
    cache = { data: formattedData, ts: Date.now() };

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Calendar API Error:", error);

    // 캐시가 있으면 오래된 데이터라도 반환
    if (cache) {
      console.warn("Returning stale cache due to error");
      return NextResponse.json({ success: true, data: cache.data });
    }

    return NextResponse.json(
      { success: false, data: [] },
      { status: 500 },
    );
  }
}
