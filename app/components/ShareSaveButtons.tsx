import { onAuthStateChanged } from "firebase/auth";
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import { Bookmark, Check, LogIn, Share2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";

interface ShareSaveButtonsProps {
	id: string;
	title: string;
	type: "product" | "housing";
}

export default function ShareSaveButtons({
	id,
	title,
	type,
}: ShareSaveButtonsProps) {
	const [isSaved, setIsSaved] = useState(false);
	const [copied, setCopied] = useState(false);
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	const checkIfSaved = useCallback(async (uid: string) => {
		try {
			const docRef = doc(db, "fintable_bookmarks", `${uid}_${id}`);
			const docSnap = await getDoc(docRef);
			setIsSaved(docSnap.exists());
		} catch (err) {
			console.error("Error checking bookmark:", err);
		} finally {
			setLoading(false);
		}
	}, [id]);

	// Auth state listener
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				checkIfSaved(currentUser.uid);
			} else {
				setLoading(false);
			}
		});
		return () => unsubscribe();
	}, [checkIfSaved]);

	const handleShare = async () => {
		const url = window.location.href;
		if (navigator.share) {
			try {
				await navigator.share({
					title: `FinTable | ${title}`,
					url: url,
				});
			} catch (err) {
				console.log("Share failed", err);
			}
		} else {
			// Fallback: Copy to clipboard
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleSave = async () => {
		if (!user) {
			alert("관심 상품을 저장하려면 로그인이 필요합니다.");
			return;
		}

		const bookmarkKey = `${user.uid}_${id}`;
		const docRef = doc(db, "fintable_bookmarks", bookmarkKey);

		try {
			if (isSaved) {
				await deleteDoc(docRef);
				setIsSaved(false);
			} else {
				await setDoc(docRef, {
					uid: user.uid,
					productId: id,
					title: title,
					type: type,
					createdAt: serverTimestamp(),
				});
				setIsSaved(true);
			}
		} catch (err) {
			console.error("Error toggling bookmark:", err);
			alert("저장 중 오류가 발생했습니다.");
		}
	};

	return (
		<div className="flex gap-3">
			<button
				type="button"
				onClick={handleShare}
				className="flex items-center gap-2 p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all font-bold text-xs text-gray-400 group relative"
			>
				{copied ? (
					<Check size={18} className="text-green-500" />
				) : (
					<Share2 size={18} className="group-hover:text-blue-500" />
				)}
				<span className="hidden md:inline">
					{copied ? "링크 복사됨" : "공유하기"}
				</span>

				{copied && (
					<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap animate-bounce">
						링크가 클립보드에 복사되었습니다!
					</div>
				)}
			</button>

			<button
				type="button"
				onClick={handleSave}
				className={`flex items-center gap-2 p-2.5 rounded-xl shadow-sm border transition-all font-bold text-xs ${
					isSaved
						? "bg-green-50 border-green-100 text-green-600"
						: "bg-white border-gray-100 text-gray-400 hover:bg-gray-50"
				}`}
			>
				<Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
				<span className="hidden md:inline">
					{isSaved ? "저장됨" : "저장하기"}
				</span>
			</button>
		</div>
	);
}
