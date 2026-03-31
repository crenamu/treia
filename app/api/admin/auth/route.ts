
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET_KEY = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || "treia_default_secret_key_2026");

// Base32 디코더 직접 구현 (Google OTP 호환용)
function base32toHex(base32: string) {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let hex = "";

  for (let i = 0; i < base32.length; i++) {
    const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }

  for (let i = 0; i + 4 <= bits.length; i += 4) {
    const chunk = bits.substr(i, 4);
    hex = hex + parseInt(chunk, 2).toString(16);
  }
  return hex;
}

// Google OTP(TOTP) 호환 6자리 생성 알고리즘 (Sync With Google App)
function generateOTP(secret: string, offset = 0): string {
  try {
    const key = Buffer.from(base32toHex(secret), "hex");
    const epoch = Math.floor(Date.now() / 1000) + (offset * 30);
    const time = Buffer.alloc(8);
    time.writeBigInt64BE(BigInt(Math.floor(epoch / 30)));

    const hmac = crypto.createHmac("sha1", key);
    hmac.update(time);
    const hmacResult = hmac.digest();

    const hmacOffset = hmacResult[hmacResult.length - 1] & 0xf;
    const value = (
      ((hmacResult[hmacOffset] & 0x7f) << 24) |
      ((hmacResult[hmacOffset + 1] & 0xff) << 16) |
      ((hmacResult[hmacOffset + 2] & 0xff) << 8) |
      (hmacResult[hmacOffset + 3] & 0xff)
    );

    const otp = (value % 1000000).toString().padStart(6, "0");
    return otp;
  } catch (e) {
    throw new Error("OTP 알고리즘 실행 오류");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password, otp, trustDevice } = await req.json();

    if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_OTP_SECRET) {
      return NextResponse.json({ success: false, message: "ENV 설정 누락" }, { status: 500 });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "비밀번호 불일치" }, { status: 401 });
    }

    // 2. OTP Check (현재 시간 기준 +- 30초 오차까지 3회 대조)
    const secret = process.env.ADMIN_OTP_SECRET;
    const matched = [-1, 0, 1].some((offset) => {
      return generateOTP(secret, offset) === otp;
    });

    if (!matched) {
      return NextResponse.json({ success: false, message: "OTP 불일치" }, { status: 401 });
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
    return NextResponse.json({ success: false, message: `서버 오류: ${error.message}` }, { status: 500 });
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
