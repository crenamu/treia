// lib/finnhub.ts

export interface FinnhubQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
}

const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "";

export interface FinnhubNews {
  id: number;
  category: string;
  datetime: number;
  headline: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

/**
 * 실시간 시장 뉴스를 가져옵니다
 */
export async function getMarketNews(category: "general" | "forex" | "crypto" | "merger" = "general"): Promise<FinnhubNews[]> {
  if (!API_KEY || API_KEY === "재발급받은키") return [];

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=${category}&token=${API_KEY}`,
      { next: { revalidate: 300 } } // 5분 캐싱
    );

    if (!res.ok) return [];
    const data = await res.json();
    return (data as FinnhubNews[]).slice(0, 10); // 최신 10개만 반환
  } catch (error) {
    console.error(`Finnhub News Fetch Error (${category}):`, error);
    return [];
  }
}
export async function getQuote(symbol: string): Promise<FinnhubQuote | null> {
  if (!API_KEY || API_KEY === "재발급받은키") return null;

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`,
      { next: { revalidate: 60 } } // 1분 캐싱
    );

    if (!res.ok) return null;
    const data = await res.json();
    
    // 데이터가 유효한지 확인 (가격이 0이면 데이터가 없는 것)
    if (!data.c) return null;
    
    return data as FinnhubQuote;
  } catch (error) {
    console.error(`Finnhub Quote Fetch Error (${symbol}):`, error);
    return null;
  }
}

interface FinnhubCalendarItem {
  impact: string;
  country: string;
  event: string;
  time: string;
  [key: string]: unknown;
}

// 경제지표 캘린더 — 별 3개, 미국+중국만
export async function getEconomicCalendar() {
  try {
    const today = new Date()
    const from = today.toISOString().split('T')[0]
    const to = new Date(today.setDate(today.getDate() + 7))
      .toISOString().split('T')[0]

    if (!API_KEY || API_KEY === "재발급받은키") {
      console.warn("Finnhub API Key가 설정되지 않았습니다.");
      return getMockData();
    }

    const res = await fetch(
      `https://finnhub.io/api/v1/calendar/economic?from=${from}&to=${to}&token=${API_KEY}`
    )
    
    if (res.status === 403) {
      return getMockData();
    }

    if (!res.ok) return getMockData();

    const data = await res.json()
    const calendar = data.economicCalendar?.filter((item: FinnhubCalendarItem) =>
      item.impact === 'high' &&
      (item.country === 'US' || item.country === 'CN')
    ) || []

    return calendar.length > 0 ? calendar : getMockData();
  } catch {
    return getMockData();
  }
}

function getMockData() {
  return [
    {
      time: "2026-03-02 23:45:00",
      event: "제조업 구매관리자지수 (2월)",
      impact: "high",
      country: "US"
    },
    {
      time: "2026-03-03 00:00:00",
      event: "ISM 제조업구매자지수 (2월)",
      impact: "high",
      country: "US"
    },
    {
      time: "2026-03-04 10:30:00",
      event: "중국 제조업 구매관리자지수 (2월)",
      impact: "high",
      country: "CN"
    },
    {
      time: "2026-03-04 22:15:00",
      event: "ADP 비농업부문 고용 변화 (2월)",
      impact: "high",
      country: "US"
    },
    {
      time: "2026-03-04 23:45:00",
      event: "서비스 구매관리자지수 (2월)",
      impact: "high",
      country: "US"
    },
    {
      time: "2026-03-05 00:00:00",
      event: "ISM 비제조업구매자지수 (2월)",
      impact: "high",
      country: "US"
    },
    {
      time: "2026-03-05 00:30:00",
      event: "원유재고",
      impact: "high",
      country: "US"
    },
    {
      time: "2026-03-05 22:30:00",
      event: "신규 실업수당청구건수",
      impact: "high",
      country: "US"
    },
    {
      time: "2026-03-06 21:30:00",
      event: "소매판매 (MoM) (1월)",
      impact: "high",
      country: "US"
    },
    {
      time: "2026-03-06 22:30:00",
      event: "비농업고용지수 (2월)",
      impact: "high",
      country: "US"
    },
    {
      time: "2026-03-06 22:30:00",
      event: "실업률 (2월)",
      impact: "high",
      country: "US"
    },
    {
      time: "2026-03-06 22:30:00",
      event: "평균 시간당 임금 (MoM)",
      impact: "high",
      country: "US"
    }
  ];
}
