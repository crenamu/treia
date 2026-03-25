import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UpdateRequestBody {
  accountId: string | number;
  licenseKey: string; // 고유 라이선스 키 추가
  magicNumber?: number;
  timeframe?: string;
  balance?: number;
  equity?: number;
  profit?: number;
  strategyProfit?: number;
}

// EA에서 호출: POST /api/license/update
// Header: X-API-Key: {TREIA_API_KEY} (Developer Secret)
export async function POST(request: Request) {
  // 1. 개발자용 API-Key 검증
  const apiKey = request.headers.get("X-API-Key");
  if (process.env.TREIA_API_KEY && apiKey !== process.env.TREIA_API_KEY) {
    return NextResponse.json({ success: false, reason: "unauthorized_ea" }, { status: 401 });
  }

  let body: UpdateRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, reason: "invalid_json" }, { status: 400 });
  }

  const { accountId, licenseKey, magicNumber, timeframe, balance, equity, profit, strategyProfit } = body;

  if (!accountId || !licenseKey) {
    return NextResponse.json({ success: false, reason: "missing_params" }, { status: 400 });
  }

  try {
    const docRef = doc(db, "treia_licenses", String(accountId));
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return NextResponse.json({ success: false, reason: "not_found" });
    }

    const data = snap.data();

    // 2. 유저 고유 라이선스 키 검증
    if (data.licenseKey !== licenseKey.trim()) {
      return NextResponse.json({ success: false, reason: "invalid_license_key" });
    }

    const now = new Date().toISOString();

    // 현재 상태 업데이트
    const updatePayload: Record<string, unknown> = {
      lastSeen: serverTimestamp(),
      lastUpdate: now,
      balance: balance ?? null,
      equity: equity ?? null,
      profit: profit ?? null,
    };

    if (magicNumber !== undefined && timeframe) {
      const stratKey = `strategy_${magicNumber}_${timeframe}`;
      updatePayload[stratKey] = {
        magicNumber,
        timeframe,
        strategyProfit: strategyProfit ?? 0,
        updatedAt: now,
      };
    }

    const historyEntry = {
      ts: now,
      balance: balance ?? null,
      equity: equity ?? null,
      profit: profit ?? null,
      magicNumber: magicNumber ?? null,
      timeframe: timeframe ?? null,
      strategyProfit: strategyProfit ?? null,
    };

    await updateDoc(docRef, {
      ...updatePayload,
      history: arrayUnion(historyEntry),
    });

    return NextResponse.json({ success: true, timestamp: now });

  } catch (e) {
    console.error("[license/update]", e);
    return NextResponse.json({ success: false, reason: "server_error" }, { status: 500 });
  }
}
