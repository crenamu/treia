import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Firestore 저장 로직 (treia_journals)
    const docRef = await addDoc(collection(db, "treia_journals"), {
      ...data,
      userId: data.userId || 'anonymous_user',
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, docId: docRef.id });
  } catch (error) {
    console.error("Firebase Save Error:", error);
    const msg = error instanceof Error ? error.message : "알 수 없는 에러";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
