import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET() {
  try {
    const educationRef = collection(db, "treia_education");
    const q = query(
      educationRef,
      where("app", "==", "treia"),
      where("isPublished", "==", true),
    );

    const querySnapshot = await getDocs(q);
    const articles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    // sectionId 기준 정렬 (1-1, 1-2 ... 8-6 순서)
    articles.sort((a, b) => {
      const parseId = (id: string) => {
        if (!id) return [99, 99];
        const parts = id.split("-").map(Number);
        return [parts[0] || 99, parts[1] || 99];
      };
      const [acat, asec] = parseId(a.sectionId);
      const [bcat, bsec] = parseId(b.sectionId);
      if (acat !== bcat) return acat - bcat;
      return asec - bsec;
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching education articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}
