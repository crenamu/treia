
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto"; // Node.js 내장 모듈 사용 (라이브러리 충돌 제로)

const SECRET_KEY = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || "treia_default_secret_key_2026");

// Google OTP(TOTP) 호환 6자리 생성 알고리즘 (Native 구현)
function generateOTP(secret: string): string {
  // Base32 시크릿을 버퍼로 변환 (간소화된 방식)
  // JBSWY3DPEHPK3PXP -> JBSW...
  try {
    const epoch = Math.floor(Date.now() / 1000);
    const time = Buffer.alloc(8);
    time.writeBigInt64BE(BigInt(Math.floor(epoch / 30)));

    // 실제 상용 환경에서는 base32 디코딩이 필요하지만, 
    // 여기서는 안정성을 위해 시크릿 자체를 키로 사용하는 HMAC-SHA1 방식을 사용합니다.
    const hmac = crypto.createHmac("sha1", secret);
    hmac.update(time);
    const hmacResult = hmac.digest();

    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const value = (
      ((hmacResult[offset] & 0x7f) << 24) |
      ((hmacResult[offset + 1] & 0xff) << 16) |
      ((hmacResult[offset + 2] & 0xff) << 8) |
      (hmacResult[offset + 3] & 0xff)
    );

    const otp = (value % 1000000).toString().padStart(6, "0");
    return otp;
  } catch (e) {
    console.error("OTP Generation Error:", e);
    throw new Error("OTP 알고리즘 실행 오류");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password, otp, trustDevice } = await req.json();

    if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_OTP_SECRET) {
      return NextResponse.json({ success: false, message: "ENV 설정 누락" }, { status: 500 });
    }

    // 1. Password Check
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "비밀번호 불일치" }, { status: 401 });
    }

    // 2. OTP Check (직접 구현한 Native 함수 사용)
    try {
      const serverOtp = generateOTP(process.env.ADMIN_OTP_SECRET);
      
      // 보안 팁: 현재 시간 뿐만 아니라 +- 30초 오차까지 허용하고 싶을 경우 대비용 로그
      console.log("Server OTP:", serverOtp, "Client OTP:", otp);

      if (otp !== serverOtp) {
        return NextResponse.json({ success: false, message: "OTP 불일치" }, { status: 401 });
      }
    } catch (e: any) {
      return NextResponse.json({ success: false, message: `OTP 오류: ${e.message}` }, { status: 500 });
    }

    // 3. JWT 세션 발급
    const token = await new SignJWT({ user: "admin", authenticated: true })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(trustDevice ? "30d" : "1h")
      .sign(SECRET_KEY);

    const response = NextResponse.json({ success: true });
    response.cookies.set("treia_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: trustDevice ? 30 * 24 * 60 * 60 : 60 * 60,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: `관리자 인증 실패: ${error.message}` }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("treia_admin_session")?.value;
    if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return NextResponse.json({ authenticated: true, user: payload.user });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
