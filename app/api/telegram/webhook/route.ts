import { NextResponse } from 'next/server';

// 텔레그램 서버가 이 엔드포인트로 시그널 메시지를 즉시 푸시(Push) 합니다. (부하 0)
export async function POST(req: Request) {
  try {
    const update = await req.json();

    const msg = update.message || update.channel_post;
    if (!msg) return NextResponse.json({ success: true }); // 처리할 내용 없음

    const parsedMessage = {
      id: msg.message_id,
      text: msg.text || '',
      date: msg.date, // MT5 발송 시간 (Unix timestamp)
      sender: msg.chat?.title || msg.from?.first_name || 'MT5 Signal'
    };

    // [TO-DO] 실 서비스 배포 후 Firestore에 실시간 저장 (onSnapshot으로 프론트 반영)
    console.log("🔥 [Webhook 수신 완료]:", parsedMessage);

    // 텔레그램 서버에게 긍정 응답 (필수)
    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("Webhook 처리 에러:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
