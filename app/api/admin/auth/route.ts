
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
// totp-generator v2는 Named Export인 TOTP를 사용합니다.
import { TOTP } from "totp-generator"; 

const SECRET_KEY = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || "treia_default_secret_key_2026");

export async function POST(req: NextRequest) {
  try {
    const { password, otp, trustDevice } = await req.json();

    // 0. Env Check (환경변수가 주입되지 않았을 때의 예외 처리)
    if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_OTP_SECRET) {
      return NextResponse.json({ 
        success: false, 
        message: "계정 보안 설정(ENV)이 배포 서버에 등록되지 않았습니다. 관리자에게 문의하세요." 
      }, { status: 500 });
    }

    // 1. Password Check
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "비밀번호가 일치하지 않습니다." }, { status: 401 });
    }

    // 2. OTP Check
    try {
      const secret = process.env.ADMIN_OTP_SECRET;
      // v2 버전의 다양한 임포트 방식 유연하게 대응
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serverOtp = (TOTP as any)(secret); 

      if (otp !== serverOtp) {
        return NextResponse.json({ success: false, message: "OTP 코드가 유효하지 않습니다." }, { status: 401 });
      }
    } catch (otpErr) {
      console.error("OTP Error:", otpErr);
      return NextResponse.json({ success: false, message: "OTP 생성 중 오류가 발생했습니다. (라이브러리 충돌)" }, { status: 500 });
    }

    // 3. JWT 세션 발급
    const token = await new SignJWT({ user: "admin", authenticated: true })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(trustDevice ? "30d" : "1h")
      .sign(SECRET_KEY);

    const response = NextResponse.json({ success: true });
    
    // HTTP-Only Cookie 설정
    response.cookies.set("treia_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: trustDevice ? 30 * 24 * 60 * 60 : 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Auth Server Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: `인증 서버 오류: ${error.message || "알 수 없는 오류"}` 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("treia_admin_session")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET_KEY);
    return NextResponse.json({ authenticated: true, user: payload.user });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
