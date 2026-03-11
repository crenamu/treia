import { NextResponse } from "next/server";
import { askGeminiVision } from "@/lib/gemini";

export const maxDuration = 60; // Vercel 함수 실행 시간 60초로 상향

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "이미지 파일이 존재하지 않습니다." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type;

    const prompt = `넌 세계 최고의 퀀트 트레이더이자 데이터 분석가야.
첨부된 이미지는 MT4 또는 MT5의 거래 내역(History) 혹은 수익 인증 스크린샷이야.
이 이미지에서 수익/손실이 발생한 '거래 내역(Trades)'을 정확하게 추출해줘.

[필수 요구사항]
1. 이미지에 나타난 '모든 개별 거래 내역'을 찾아내야 해.
2. 각 거래의 '진입 시간(Open Time)'과 '청산 시간(Close Time)'은 MT4/MT5 서버 시간(보통 GMT+2/GMT+3) 기준인데, 이를 한국 표준시(KST, GMT+9)로 자동 환산해서 표기해줘. (계산하기 모호하면 원래 시간에 6~7시간을 더해서 KST로 변환해)
3. 가격(진입가, 청산가)과 수익금(Profit) 숫자는 정확해야 해.
4. 반드시 아래의 완전한 JSON 형식으로만 출력해줘. (마크다운 백틱 \`\`\`json 기호 절대로 쓰지 말 것)

[JSON 출력 형식]
{
  "totalTrades": 5,
  "winTrades": 3,
  "lossTrades": 2,
  "totalProfit": 125.50,
  "trades": [
    {
      "symbol": "XAUUSD",
      "type": "BUY",
      "lot": 0.1,
      "openTimeKST": "2026-03-03 14:30",
      "closeTimeKST": "2026-03-03 15:00",
      "openPrice": 2040.50,
      "closePrice": 2045.50,
      "profit": 50.00
    }
  ]
}
`;

    const result = await askGeminiVision(prompt, base64Image, mimeType);

    // JSON 파싱을 위해 마크다운 정리
    const cleanJson = result.replace(/```json|```/gi, "").trim();

    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error(
        "Vision JSON Parsing Error:",
        parseErr,
        "\nRaw Result:",
        result,
      );
      return NextResponse.json(
        {
          success: false,
          message: "AI 분석 실패",
          error: `JSON 형태가 아닙니다. 파싱 실패.\n응답 내용:\n${result}`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error("Vision API Parsing Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    return NextResponse.json(
      { success: false, message: "AI 통신 실패", error: errorMessage },
      { status: 500 },
    );
  }
}
