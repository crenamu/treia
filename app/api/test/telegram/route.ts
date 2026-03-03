import { NextResponse } from 'next/server';
import { sendTradingAlert } from '@/lib/telegram';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const isServer = typeof window === 'undefined';
    if (!isServer) return NextResponse.json({ success: false, msg: "Server only" });

    const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ 
        success: false, 
        message: "Telegram .env 설정값 (Token 또는 ChatID) 이 비어 있습니다." 
      });
    }

    // 1. JSON 불러오기
    const jsonPath = path.resolve(process.cwd(), 'ea_history_parsed.json');
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ success: false, message: "ea_history_parsed.json 파일을 찾을 수 없습니다." });
    }

    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const trades = JSON.parse(fileContent);

    if (!trades || trades.length === 0) {
      return NextResponse.json({ success: false, message: "파싱된 거래 내역이 존재하지 않습니다." });
    }

    // 2. 가장 최신 (마지막) 거래 1개만 추출
    const latestTrade = trades[trades.length - 1]; // json의 맨 마지막 항목

    // 3. 발송 규격에 맞게 변환 (buy/sell)
    const typeStr = String(latestTrade.type).toLowerCase() === 'buy' ? 'BUY' : 'SELL';
    const isClose = !!latestTrade.closeTime;

    // 만약 청산된 주문이라면 청산가(closePrice)와 수익금(profit) 탑재, 진입 주문이라면 진입가(price) 탑재
    const price = isClose ? latestTrade.closePrice : latestTrade.price;
    const profit = isClose ? latestTrade.profit : undefined;

    // 4. 발송 스크립트 실행
    const result = await sendTradingAlert(
      latestTrade.strategy || "Treia Core EA",
      typeStr,
      Number(price),
      profit === undefined ? undefined : Number(profit)
    );

    if (result) {
      return NextResponse.json({
        success: true,
        message: "텔레그램 발송 성공!",
        data: latestTrade
      });
    } else {
      return NextResponse.json({
         success: false,
         message: "텔레그램 발송 실패 (서버 로그 확인 필요)"
      });
    }

  } catch (error) {
    console.error("Test API Error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
