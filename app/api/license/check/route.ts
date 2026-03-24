import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// EA에서 호출: GET /api/license/check?account=100106281
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const account = searchParams.get("account");

  if (!account) {
    return NextResponse.json({ valid: false, reason: "no_account" }, { status: 400 });
  }

  try {
    const docRef = doc(db, "treia_licenses", account.trim());
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return NextResponse.json({ valid: false, reason: "not_found" });
    }

    const data = snap.data();

    // 비활성 체크
    if (!data.active) {
      return NextResponse.json({ valid: false, reason: "inactive" });
    }

    // 만료일 체크
    if (data.expireDate) {
      const expire = new Date(data.expireDate);
      expire.setHours(23, 59, 59, 999);
      if (expire < new Date()) {
        return NextResponse.json({ valid: false, reason: "expired", expireDate: data.expireDate });
      }
    }

    // 유효 — EA에 필요한 정보 반환
    return NextResponse.json({
      valid: true,
      accountId: data.accountId,
      name: data.name,
      maxLot: data.maxLot || 0.01,
      tier: data.tier || "observer",
      expireDate: data.expireDate,
    });

  } catch (e) {
    console.error("[license/check]", e);
    return NextResponse.json({ valid: false, reason: "server_error" }, { status: 500 });
  }
}
