import { NextResponse } from "next/server";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * EA에서 호출하여 계좌 및 전략별 현황 업데이트: POST /api/license/update
 * Body: { 
 *   accountId: string, 
 *   magicNumber: number, 
 *   timeframe: string,
 *   balance: number, 
 *   equity: number, 
 *   profit: number,
 *   strategyProfit: number 
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountId, magicNumber, timeframe, balance, equity, profit, strategyProfit } = body;

    if (!accountId) {
      return NextResponse.json({ success: false, message: "no_account" }, { status: 400 });
    }

    const docRef = doc(db, "treia_licenses", accountId.trim());
    
    // 전략별 식별 정보 구성 (매직넘버 기준)
    const strategyKey = `strategies.${magicNumber || 'default'}`;
    const strategyData = {
      tf: timeframe || 'unknown',
      profit: strategyProfit || 0,
      updatedAt: new Date().toISOString()
    };

    // 실시간 현황 및 전략별 데이터 업데이트
    await updateDoc(docRef, {
      balance: balance || 0,
      equity: equity || 0,
      profit: profit || 0, // 전체 계좌 수익
      [strategyKey]: strategyData, // 특정 전략(매직넘버)의 수익/타임프레임
      lastUpdated: serverTimestamp()
    });

    return NextResponse.json({ success: true });

  } catch (e) {
    console.error("[license/update]", e);
    return NextResponse.json({ success: false, message: "server_error" }, { status: 500 });
  }
}
