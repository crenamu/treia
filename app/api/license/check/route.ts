import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// EA에서 호출: GET /api/license/check?account=100106281
// Header: X-API-Key: {TREIA_API_KEY} (선택 보안)
export async function GET(request: Request) {
  // API-Key 검증 (환경변수 설정 시 활성화)
  const apiKey = request.headers.get("X-API-Key");
  if (process.env.TREIA_API_KEY && apiKey !== process.env.TREIA_API_KEY) {
    return NextResponse.json({ valid: false, reason: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const account = searchParams.get("account");

  if (!account) {
    return NextResponse.json({ valid: false, reason: "no_account" }, { status: 400 });
  }

  try {
    const snap = await getDoc(doc(db, "treia_licenses", account.trim()));

    if (!snap.exists()) {
      return NextResponse.json({ valid: false, reason: "not_found" });
    }

    const data = snap.data();

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
