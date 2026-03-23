import {
	collection,
	doc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import { db } from "./firebase";

export interface TickAnalysis {
	sentiment: string;
	intensity: number;
	reason: string;
	signal: string;
	phase: string;
	timestamp: any;
}

export interface PageAnalysis {
	marketLevels: { price: number; label: string; type: "major" | "minor" }[];
	scenarios: { title: string; desc: string; color: string }[];
	mainText: string;
	updatedAt: any;
}

export interface MtfLevel {
	price: number;
	volume: number;
}

export interface MtfTfAnalysis {
	tf: string;
	poc: number;
	levels: MtfLevel[];
	count: number;
	lastDate: string;
}

export interface MtfAnalysis {
	asset: string;
	analysis: MtfTfAnalysis[];
	updatedAt: any;
}

export interface VolumeProfile {
	topLevels: MtfLevel[];
	analyzedAt: any;
}

// 실시간 틱 분석 감지
export function subscribeTickAnalysis(
	callback: (data: TickAnalysis | null) => void,
) {
	const q = query(
		collection(db, "treia_tick_analysis"),
		orderBy("timestamp", "desc"),
		limit(1),
	);

	return onSnapshot(q, (snapshot) => {
		if (!snapshot.empty) {
			callback(snapshot.docs[0].data() as TickAnalysis);
		} else {
			callback(null);
		}
	});
}

// 매물대 정보 가져오기 (단일 TF 호환용)
export async function getVolumeProfile(): Promise<VolumeProfile | null> {
	const q = query(
		collection(db, "treia_volume_profile"),
		orderBy("analyzedAt", "desc"),
		limit(1),
	);

	const snapshot = await getDocs(q);
	if (!snapshot.empty) {
		return snapshot.docs[0].data() as VolumeProfile;
	}
	return null;
}

// 멀티 타임프레임 분석 정보 가져오기
export async function getMtfAnalysis(): Promise<MtfAnalysis | null> {
	const q = query(collection(db, "treia_market_intelligence"), limit(1));

	const snapshot = await getDocs(q);
	if (!snapshot.empty) {
		return snapshot.docs[0].data() as MtfAnalysis;
	}
	return null;
}

// 페이지 전역 분석 관점 구독 (Market Levels, Scenarios)
export function subscribePageAnalysis(
	callback: (data: PageAnalysis | null) => void,
) {
	const q = query(collection(db, "treia_analysis_page"), limit(1));

	return onSnapshot(q, (snapshot) => {
		if (!snapshot.empty) {
			callback(snapshot.docs[0].data() as PageAnalysis);
		} else {
			callback(null);
		}
	});
}
