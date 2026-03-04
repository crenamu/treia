import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // 캐시 무효화 (항상 최신 Telegram 업데이트 강제)
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET() {
  try {
    const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    
    if (!token) {
      return NextResponse.json({ success: false, data: [], message: "토큰 없음" });
    }

    // Telegram Bot API의 getUpdates 메서드를 폴링하여 최신 메시지를 가져옵니다.
    // 캐싱을 완전히 방지하기 위해 쿼리에 타임스탬프를 추가합니다.
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?limit=5&t=${Date.now()}`, {
      cache: 'no-store'
    });
    const json = await res.json();

    if (!json.ok) {
      return NextResponse.json({ success: false, data: [] });
    }

    // 메시지나 채널 포스트 양쪽 모두 확인
    const updates = json.result || [];
    
    // 가장 최신 메시지 순으로 파싱 (최대 5개)
    const messages = updates.map((u: Record<string, any>) => {
      const msg = u.message || u.channel_post;
      if (!msg) return null;
      return {
        id: msg.message_id,
        text: msg.text || '',
        date: msg.date,
        sender: msg.chat?.title || msg.from?.first_name || 'MT5 Signal'
      };
    }).filter(Boolean).reverse().slice(0, 5); // null 제거 후 뒤집기

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("Telegram API Error:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
