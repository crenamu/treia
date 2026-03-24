import { NextResponse } from "next/server";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * EA에서 호출하여 계좌 현황 업데이트: POST /api/license/update
 * Body: { accountId: string, balance: number, equity: number, profit: number }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountId, balance, equity, profit } = body;

    if (!accountId) {
      return NextResponse.json({ success: false, message: "no_account" }, { status: 400 });
    }

    const docRef = doc(db, "treia_licenses", accountId.trim());
    
    // 실시간 현황 업데이트
    await updateDoc(docRef, {
      balance: balance || 0,
      equity: equity || 0,
      profit: profit || 0,
      lastUpdated: serverTimestamp()
    });

    return NextResponse.json({ success: true });

  } catch (e) {
    console.error("[license/update]", e);
    return NextResponse.json({ success: false, message: "server_error" }, { status: 500 });
  }
}
