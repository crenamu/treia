import TelegramBot from "node-telegram-bot-api";

const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const defaultChatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

// 서버 사이드에서만 동작하도록 보장 (Next.js Edge Runtime이나 클라이언트에서는 실행 안됨)
const isServer = typeof window === "undefined";

let bot: TelegramBot | null = null;

if (isServer && token) {
	// polling 설정은 false로. 우리는 웹훅이나 단순히 메시지를 "보내기(send)" 위한 용도로만 씁니다.
	bot = new TelegramBot(token, { polling: false });
}

/**
 * 텔레그램으로 트레이딩 신호 및 메시지 발송
 * @param message 보낼 내용 (HTML 마크다운 지원)
 * @param chatId 보낼 채팅방 아이디 (생략 시 env의 default 값 사용)
 */
export async function sendTelegramMessage(message: string, chatId?: string) {
	if (!bot) {
		console.error(
			"❌ 텔레그램 봇이 초기화되지 않았습니다. Token을 확인하세요.",
		);
		return false;
	}

	const targetId = chatId || defaultChatId;

	if (!targetId) {
		console.error("❌ 텔레그램 Chat ID가 설정되지 않았습니다.");
		return false;
	}

	try {
		// HTML 모드로 전송하여 깔끔한 포매팅 (bold, italic 등) 지원
		await bot.sendMessage(targetId, message, { parse_mode: "HTML" });
		console.log("✅ 텔레그램 메시지 발송 완료");
		return true;
	} catch (error) {
		console.error("❌ 텔레그램 발송 실패:", error);
		return false;
	}
}

/**
 * [예시] EA 거래 결과를 이쁘게 포장해서 발송하는 함수
 */
export async function sendTradingAlert(
	eaName: string,
	type: "BUY" | "SELL",
	price: number,
	profit?: number,
) {
	const isClose = profit !== undefined;

	const icon = type === "BUY" ? "🟢" : "🔴";
	const actionTitle = isClose ? "청산(Close)" : "진입(Open)";
	const profitText = isClose
		? `\n<b>💰 수익금:</b> ${profit && profit > 0 ? "+" : ""}${profit} USD`
		: "";

	const message = `
🔔 <b>[Treia Trading Alert]</b>
━━━━━━━━━━━━━━━━━━
<b>🤖 EA 전략:</b> ${eaName}
<b>⚡ 타입:</b> ${icon} ${type} ${actionTitle}
<b>🎯 체결가:</b> $${price.toLocaleString()}${profitText}
<b>⏰ KST:</b> ${new Date().toLocaleString("ko-KR")}
━━━━━━━━━━━━━━━━━━
<i>* 본 알림은 프리미엄 채널에서만 제공됩니다.</i>`;

	return sendTelegramMessage(message);
}
