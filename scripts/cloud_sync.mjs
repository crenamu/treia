import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString } from "firebase/storage";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const COMMON_FILES_DIR =
	"C:\\Users\\crena\\AppData\\Roaming\\MetaQuotes\\Terminal\\Common\\Files";

const fileHashes = new Map();

async function uploadFile(actualFilename, storageName, forceUpdate = false) {
	const filePath = path.join(COMMON_FILES_DIR, actualFilename);
	if (!fs.existsSync(filePath)) return;

	try {
		const stats = fs.statSync(filePath);
		const lastModified = stats.mtimeMs;

		// 이전에 올린 시간과 같으면 (수정되지 않았으면) 업로드 안 함 -> 요금 폭탄 방지!
		// 틱 데이터 같이 무조건 올리고 싶을 땐 forceUpdate=true로 넘김
		if (!forceUpdate && fileHashes.get(storageName) === lastModified) {
			return;
		}

		const content = fs.readFileSync(filePath, "utf-8");
		const fileRef = ref(storage, `treia/${storageName}`);
		await uploadString(fileRef, content);

		fileHashes.set(storageName, lastModified); // 올린 시간 기억
		console.log(
			`[${new Date().toLocaleTimeString()}] ✅ ${storageName} 동기화 완료 (${(content.length / 1024).toFixed(2)} KB)`,
		);
	} catch (e) {
		console.error(
			`[${new Date().toLocaleTimeString()}] ❌ ${storageName} 업로드 에러:`,
			e.message,
		);
	}
}

async function sync() {
	if (!fs.existsSync(COMMON_FILES_DIR)) {
		return;
	}
	const files = fs.readdirSync(COMMON_FILES_DIR);

	// H1 데이터 동기화 (가장 최근 생성된 파일만)
	const h1Files = files
		.filter((f) => f.startsWith("treia_h1_base_"))
		.sort((a, b) => b.localeCompare(a));
	if (h1Files.length > 0) {
		// H1은 "1시간" 이상 지났거나 파일 해시태그(mtime)가 바뀌었을 때만 업로드
		await uploadFile(h1Files[0], "treia_h1_base_latest.csv");
	}
}

console.log("🚀 Treia 클라우드 동기화 성공 (1시간봉 매물대 데이터)");
sync().then(() => {
	console.log("종료합니다.");
	process.exit(0);
});
