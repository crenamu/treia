import {
	addDoc,
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	Timestamp,
	where,
} from "firebase/firestore";
import { db } from "./firebase";

export interface RankingData {
	name: string;
	returns: number; // 수익률 (예: 125.4)
	prize: string;
	month: string; // 예: "2026-02"
}

const COLLECTION_NAME = "treia_trading_rankings";

/**
 * 수익률 랭킹 데이터를 추가합니다 (관리용 혹은 자동 집계용)
 */
export async function addRanking(data: RankingData) {
	try {
		await addDoc(collection(db, COLLECTION_NAME), {
			...data,
			timestamp: Timestamp.now(),
		});
		return true;
	} catch (error) {
		console.error("Error adding ranking:", error);
		return false;
	}
}

/**
 * 특정 월의 상위 랭커를 가져옵니다.
 */
export async function getTopRankers(month: string) {
	try {
		const q = query(
			collection(db, COLLECTION_NAME),
			where("month", "==", month),
			orderBy("returns", "desc"),
			limit(10),
		);

		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
	} catch (error) {
		console.error("Error fetching rankers:", error);
		return [];
	}
}
