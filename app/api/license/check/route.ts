import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// EA에서 호출: GET /api/license/check?account=100106281&key=TREIA-ABCD
// Header: X-API-Key: {TREIA_API_KEY} (Developer Secret)
export async function GET(request: Request) {
  // 1. 개발자용 API-Key 검증 (WebRequest 헤더에 포함됨)
  const apiKey = request.headers.get("X-API-Key");
  if (process.env.TREIA_API_KEY && apiKey !== process.env.TREIA_API_KEY) {
    return NextResponse.json({ valid: false, reason: "unauthorized_ea" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const account = searchParams.get("account");
  const key = searchParams.get("key"); // 유저가 입력한 고유 키

  if (!account || !key) {
    return NextResponse.json({ valid: false, reason: "missing_params" }, { status: 400 });
  }

  try {
    const snap = await getDoc(doc(db, "treia_licenses", account.trim()));

    if (!snap.exists()) {
      return NextResponse.json({ valid: false, reason: "not_found" });
    }

    const data = snap.data();

    // 2. 유저 고유 라이선스 키 검증
    if (data.licenseKey !== key.trim()) {
      return NextResponse.json({ valid: false, reason: "invalid_license_key" });
    }

    if (!data.active) {
      return NextResponse.json({ valid: false, reason: "inactive" });
    }

    if (data.expireDate) {
      const expire = new Date(data.expireDate);
      expire.setHours(23, 59, 59, 999);
      if (expire < new Date()) {
        return NextResponse.json({ valid: false, reason: "expired", expireDate: data.expireDate });
      }
    }

    return NextResponse.json({
      valid: true,
      accountId: data.accountId,
      name: data.name,
      maxLot: data.maxLot ?? 0.01,
      tier: data.tier ?? "observer",
      expireDate: data.expireDate,
    });

  } catch (e) {
    console.error("[license/check]", e);
    return NextResponse.json({ valid: false, reason: "server_error" }, { status: 500 });
  }
}
