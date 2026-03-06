import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export async function GET() {
  try {
    const educationRef = collection(db, 'treia_education');
    const q = query(
      educationRef,
      where('app', '==', 'treia'),
      where('isPublished', '==', true),
      limit(4)
    );

    const querySnapshot = await getDocs(q);
    const articles = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching education articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
