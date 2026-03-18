import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, contact, inquiry } = body;

    if (!name || !contact) {
      return NextResponse.json(
        { success: false, message: '이름과 연락처는 필수입니다.' },
        { status: 400 }
      );
    }

    // 1. Firebase Firestore에 데이터 저장
    const leadsRef = collection(db, 'treia_leads');
    await addDoc(leadsRef, {
      name,
      contact,
      inquiry: inquiry || '시스템 무료 데모 체험',
      createdAt: serverTimestamp(),
      status: 'new', // 신규 접수 상태
    });

    // 2. 관리자 텔레그램으로 알림 발송
    const dateStr = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    const message = `
🔔 <b>[신규 Treia_No1 리드 포착!]</b>
━━━━━━━━━━━━━━━━━━
👤 <b>이름:</b> ${name}
📞 <b>연락처:</b> ${contact}
📝 <b>유형:</b> ${inquiry || '미지정'}
⏰ <b>일시:</b> ${dateStr}
━━━━━━━━━━━━━━━━━━
<i>* Firebase "treia_leads" DB에 저장되었습니다.</i>`;

    // sendTelegramMessage는 내부적으로 봇 토큰과 env에 설정된 CHAT_ID를 사용합니다.
    await sendTelegramMessage(message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { success: false, message: '내부 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
