import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // treia 전용 데이터베이스 인스턴스에서 문서 가져오기
    const docRef = doc(db, 'treia_education', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data(),
    });
  } catch (error) {
    console.error('Error fetching education article detail:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
