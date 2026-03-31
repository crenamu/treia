import { doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/firebase";

export async function POST(req: Request) {
	try {
		const { leadId, email, name, notionUrl, templateId = "intro" } = await req.json();

		if (!leadId || !email || !name) {
			return NextResponse.json({ success: false, message: "필수 정보 누락" }, { status: 400 });
		}

		if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
			return NextResponse.json({ 
				success: false, 
				message: ".env.local에 SMTP_USER와 SMTP_PASS 설정이 필요합니다. (Gmail 앱 비밀번호 등)" 
			}, { status: 500 });
		}

		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
		});

		let subject = "Treia_No1 실시간 관전자 계정 발급 완료";
		let title = "실시간 관전자 계정<br>발급이 완료되었습니다.";
		let content = `전 세계 표준 트레이딩 플랫폼인 MetaTrader 5 (MT5) 앱에 아래 정보를 입력하시면, <strong>지금 당장 엔진의 움직임을 실시간으로 감시할 수 있습니다.</strong>`;
		let showInfoBox = true;

		switch (templateId) {
			case "notice":
				subject = "[안내] Treia 시스템 업데이트 및 정책 변경 공지";
				title = "시스템 고도화 및<br>안내 사항 전달";
				content = `Treia 엔진의 성능 향상을 위한 알고리즘 업데이트가 예정되어 있습니다. 안정적인 운용을 위해 가이드를 반드시 확인해 주시기 바랍니다.`;
				showInfoBox = false;
				break;
			case "promo":
				subject = "[초대] Treia 정식 라이선스 가입 및 정식 런칭 안내";
				title = "Treia 정식 런칭<br>파트너 초대";
				content = `모의 테스트 기간 동안 확인하신 퍼포먼스에 확신이 생기셨다면, 이제 본인의 계좌에 직접 인공지능 엔진을 도입하여 수익을 현실화할 차례입니다.`;
				showInfoBox = false;
				break;
		}

		const emailHtml = `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#050505;color:#f2f2f2;font-family:'Pretendard',sans-serif;">
    <div style="max-width:600px;margin:40px auto;background-color:#111;border-radius:12px;overflow:hidden;border:1px solid #222;">
        <div style="text-align:center;padding:40px 20px;background-color:#0a0a0a;border-bottom:1px solid #222;">
            <p style="font-size:14px;letter-spacing:4px;color:#c8a84b;margin:0 0-10px 0;text-transform:uppercase;">Treia Gold Algorithm Engine</p>
            <h1 style="margin:0;font-size:24px;font-weight:300;line-height:1.4;color:#fff;">${title}</h1>
        </div>
        <div style="padding:40px 30px;">
            <p style="font-size:16px;line-height:1.8;color:#a1a1aa;margin-top:0;">안녕하세요, <strong>${name}</strong>님.<br>Treia 팀입니다.</p>
            <p style="font-size:16px;line-height:1.8;color:#a1a1aa;margin-bottom:30px;">${content}</p>
            ${showInfoBox ? `
            <div style="background-color:#1a1a1a;border-radius:8px;padding:25px;margin-bottom:30px;border-left:4px solid #c8a84b;">
                <p style="margin:0 0 15px 0;font-size:14px;color:#7a7f8e;">[관전자 접속 정보]</p>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:16px;">
                    <tr><td width="100" style="padding:8px 0;color:#a1a1aa;">서버</td><td style="padding:8px 0;color:#fff;font-weight:bold;">InfinoxLimited-MT5Demo</td></tr>
                    <tr><td style="padding:8px 0;color:#a1a1aa;">로그인 ID</td><td style="padding:8px 0;color:#fff;font-weight:bold;">100106281</td></tr>
                    <tr><td style="padding:8px 0;color:#a1a1aa;">비밀번호</td><td style="padding:8px 0;color:#c8a84b;font-weight:bold;">Vrt27710!!</td></tr>
                </table>
            </div>` : ""}
            <div style="text-align:center;margin-top:40px;">
                <a href="${notionUrl || "#"}" target="_blank" style="display:inline-block;background-color:#c8a84b;color:#000;text-decoration:none;padding:18px 30px;border-radius:8px;font-weight:bold;font-size:16px;">공식 가이드 확인하기</a>
            </div>
        </div>
        <div style="padding:20px 30px;text-align:center;border-top:1px solid #222;background-color:#0a0a0a;">
            <p style="font-size:12px;color:#555;margin:0;line-height:1.6;">본 이메일은 발신 전용이며 회신되지 않습니다.<br>&copy; Treia Algorithm Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

		await transporter.sendMail({
			from: `"Treia Support" <${process.env.SMTP_USER}>`,
			to: email,
			subject,
			html: emailHtml,
		});

		const leadRef = doc(db, "treia_leads", leadId);
		await updateDoc(leadRef, {
			status: "approved",
			approvedAt: new Date(),
		});

		return NextResponse.json({ success: true, message: "발송에 성공했습니다." });
	} catch (error: any) {
		console.error("Email sending error:", error);
		return NextResponse.json({ success: false, message: error.message || "발송 중 오류 발생" }, { status: 500 });
	}
}
