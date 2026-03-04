import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString } from 'firebase/storage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

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

const COMMON_FILES_DIR = 'C:\\Users\\crena\\AppData\\Roaming\\MetaQuotes\\Terminal\\Common\\Files';

const fileHashes = new Map();

async function uploadFile(actualFilename, storageName) {
    const filePath = path.join(COMMON_FILES_DIR, actualFilename);
    if (!fs.existsSync(filePath)) return;
    
    try {
        const stats = fs.statSync(filePath);
        const lastModified = stats.mtimeMs;

        // 이전에 올린 시간과 같으면 (수정되지 않았으면) 업로드 안 함 -> 요금 폭탄 방지!
        if (fileHashes.get(storageName) === lastModified) {
            return; 
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const fileRef = ref(storage, `treia_data/${storageName}`);
        await uploadString(fileRef, content);
        
        fileHashes.set(storageName, lastModified); // 올린 시간 기억
        console.log(`[${new Date().toLocaleTimeString()}] ✅ ${storageName} 실시간 동기화 완료 (${(content.length/1024).toFixed(2)} KB)`);
    } catch (e) {
        console.error(`[${new Date().toLocaleTimeString()}] ❌ ${storageName} 업로드 에러:`, e.message);
    }
}

async function sync() {
    if (!fs.existsSync(COMMON_FILES_DIR)) {
        return;
    }
    const files = fs.readdirSync(COMMON_FILES_DIR);
    
    // H1 데이터 동기화 (가장 최근 생성된 파일만)
    const h1Files = files.filter(f => f.startsWith('treia_h1_base_')).sort((a,b) => b.localeCompare(a));
    if (h1Files.length > 0) {
        await uploadFile(h1Files[0], 'treia_h1_base_latest.csv');
    }

    // 틱 데이터 동기화 (가장 최근 생성된 파일만)
    const tickFiles = files.filter(f => f.startsWith('treia_gold_ticks')).sort((a,b) => b.localeCompare(a));
    if (tickFiles.length > 0) {
        await uploadFile(tickFiles[0], 'treia_gold_ticks_latest.csv');
    }
}

console.log("🚀 Treia 실시간 클라우드 동기화 봇 작동 시작 (주기: 60초)");
sync();
setInterval(sync, 60000);
