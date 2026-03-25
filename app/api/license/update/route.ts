import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UpdateRequestBody {
  accountId: string | number;
  magicNumber?: number;
  timeframe?: string;
  balance?: number;
  equity?: number;
  profit?: number;
  strategyProfit?: number;
}

// EA에서 호출: POST /api/license/update
// 1시간 주기(OnTimer) + 매매 종료 시(OnTrade) 전송
export async function POST(request: Request) {
  // API-Key 검증
  const apiKey = request.headers.get("X-API-Key");
  if (process.env.TREIA_API_KEY && apiKey !== process.env.TREIA_API_KEY) {
    return NextResponse.json({ success: false, reason: "unauthorized" }, { status: 401 });
  }

  let body: UpdateRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, reason: "invalid_json" }, { status: 400 });
  }

  const { accountId, magicNumber, timeframe, balance, equity, profit, strategyProfit } = body;

  if (!accountId) {
    return NextResponse.json({ success: false, reason: "no_accountId" }, { status: 400 });
  }

  try {
    const docRef = doc(db, "treia_licenses", String(accountId));
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return NextResponse.json({ success: false, reason: "not_found" });
    }

    const now = new Date().toISOString();

    // 현재 상태 업데이트 (최신값 덮어쓰기)
    const updatePayload: Record<string, unknown> = {
      lastSeen: serverTimestamp(),
      lastUpdate: now,
      balance: balance ?? null,
      equity: equity ?? null,
      profit: profit ?? null,
    };

    // 타임프레임별 전략 수익 (magicNumber + timeframe 조합으로 키 생성)
    if (magicNumber !== undefined && timeframe) {
      const stratKey = `strategy_${magicNumber}_${timeframe}`;
      updatePayload[stratKey] = {
        magicNumber,
        timeframe,
        strategyProfit: strategyProfit ?? 0,
        updatedAt: now,
      };
    }

    // 히스토리 로그 (최근 48개 유지 - 필요 시 자르기 로직 추가 가능)
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
