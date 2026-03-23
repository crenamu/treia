import { NextResponse } from "next/server";
import { getProductById, getProducts } from "@/app/actions/finance";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");
	const trm = searchParams.get("trm") || "0";
	const type = (searchParams.get("type") as "deposit" | "saving") || "deposit";

	try {
		if (id) {
			const data = await getProductById(id);
			return NextResponse.json(data);
		}

		const data = await getProducts(type, trm);
		return NextResponse.json(data);
	} catch (error) {
		console.error("API Route Error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
