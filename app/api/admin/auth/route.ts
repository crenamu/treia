import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || "treia_default_secret");

export async function POST(req: NextRequest) {
  try {
    const { password, otp, trustDevice } = await req.json();

    // 1. Password Check
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "비밀번호가 일치하지 않습니다." }, { status: 401 });
    }

    // 2. OTP Check
    const secret = process.env.ADMIN_OTP_SECRET || "JBSWY3DPEHPK3PXP";
    
    // 동적 임포트를 통한 런타임 호출 (빌드 에러 방지)
    const totpModule = await import("totp-generator");
    const serverOtp = (totpModule as unknown as (s: string) => string)(secret); 

    if (otp !== serverOtp) {
      return NextResponse.json({ success: false, message: "OTP 코드가 유효하지 않습니다." }, { status: 401 });
    }
    const token = await new SignJWT({ user: "admin", authenticated: true })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(trustDevice ? "30d" : "1h") // 신뢰 기기 체크 시 30일 유지
      .sign(SECRET_KEY);

    const response = NextResponse.json({ success: true });
    
    // HTTP-Only Cookie 설정 (F12에서 탈취 불가)
    response.cookies.set("treia_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: trustDevice ? 30 * 24 * 60 * 60 : 60 * 60, // 30일 또는 1시간
    });

    return response;
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ success: false, message: "인증 서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// GET 요청 시 토큰 검증 (어드민 페이지 진입 시 체크용)
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("treia_admin_session")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return NextResponse.json({ authenticated: true, user: payload.user });
  } catch { // 변수 없이 catch 블록 사용 (ESLint 만족)
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
