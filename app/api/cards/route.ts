import { NextResponse } from "next/server";
import { getCardById, getCards } from "@/app/actions/card";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	try {
		if (id) {
			const data = await getCardById(id);
			return NextResponse.json(data);
		}

		const data = await getCards();
		return NextResponse.json(data);
	} catch (error) {
		console.error("API Route Error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
