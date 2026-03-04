import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { storage } from '@/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const COMMON_FILES_DIR = 'C:\\Users\\crena\\AppData\\Roaming\\MetaQuotes\\Terminal\\Common\\Files';

export async function GET() {
  try {
    let fileStream: fs.ReadStream | null = null;
    let fileContent: string = '';
    let fileSizeMB = '0.00';
    let deletedCount = 0;

    if (fs.existsSync(COMMON_FILES_DIR)) {
      // 로컬 환경: 파일 탐색 및 자동 정리
      const files = fs.readdirSync(COMMON_FILES_DIR);
      const tickFiles = files.filter(f => f.startsWith('treia_gold_ticks')).sort((a,b) => b.localeCompare(a));
      
      const now = Date.now();
      tickFiles.forEach(file => {
        const filePath = path.join(COMMON_FILES_DIR, file);
        const stats = fs.statSync(filePath);
        const daysOld = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);
        if (daysOld > 2) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      });

      const activeFiles = fs.readdirSync(COMMON_FILES_DIR).filter(f => f.startsWith('treia_gold_ticks')).sort((a,b) => b.localeCompare(a));
      if (activeFiles.length > 0) {
        const targetFile = path.join(COMMON_FILES_DIR, activeFiles[0]);
        fileStream = fs.createReadStream(targetFile);
        const fileStats = fs.statSync(targetFile);
        fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
      }
    }

    if (!fileStream) {
       // 로컬에 파일이 없거나 Vercel 클라우드 환경인 경우 Firebase Storage에서 다운로드
       try {
           const url = await getDownloadURL(ref(storage, 'treia_data/treia_gold_ticks_latest.csv'));
           const res = await fetch(url + `&t=${Date.now()}`, { cache: 'no-store' });
           if (!res.ok) throw new Error("클라우드 데이터를 가져올 수 없습니다.");
           fileContent = await res.text();
           const bytes = Buffer.byteLength(fileContent, 'utf8');
           fileSizeMB = (bytes / (1024 * 1024)).toFixed(2);
       } catch (e) {
           return NextResponse.json({ success: false, message: '로컬 PC 데이터를 클라우드에 아직 연동하지 않았거나 데이터가 없습니다.' });
       }
    }

    // 2. 데이터 파싱
    const minuteBuckets: { [minute: string]: { ticks: {time: string, price: number}[], high: number, low: number, volume: number } } = {};
    let totalTicks = 0;

    const processLine = (line: string) => {
      if (line.startsWith('Timestamp') || line.trim() === '') return;
      const parts = line.split(',');
      if (parts.length < 5) return;
      const timestamp = parts[0];
      const bid = parts[1];
      const last = parts[3];
      const vol = parts[4];
      
      let price = parseFloat(last);
      if (!price || price === 0) price = parseFloat(bid);
      if (!price) return;
      
      const minutePrefix = timestamp.substring(0, 16); 
      if (!minuteBuckets[minutePrefix]) {
        minuteBuckets[minutePrefix] = { ticks: [], high: price, low: price, volume: 0 };
      }
      const bucket = minuteBuckets[minutePrefix];
      const timeStr = timestamp.split(' ')[1];

      bucket.ticks.push({ time: timeStr, price });
      if (price > bucket.high) bucket.high = price;
      if (price < bucket.low) bucket.low = price;
      bucket.volume += parseInt(vol || '1', 10);
      totalTicks++;
    };

    if (fileStream) {
       const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
       for await (const line of rl) processLine(line);
    } else {
       const lines = fileContent.split('\n');
       for (const line of lines) processLine(line);
    }



    // 3. 변동성 (Stop Hunting) 점수 계산 및 가장 움직임이 컸던 1분 추출
    let topHuntWindow = null;
    let maxVariance = 0;
    
    for (const min in minuteBuckets) {
      const bucket = minuteBuckets[min];
      const variance = bucket.high - bucket.low;
      
      // 틱이 최소 50번 이상 발생했고(유동성), 위아래 변동폭이 가장 큰 1분
      if (bucket.ticks.length > 50 && variance > maxVariance) {
        maxVariance = variance;
        
        // 프론트엔드로 보낼 때 데이터가 너무 무거우면 브라우저가 느려지므로 샘플링
        const sampledTicks = bucket.ticks.filter((_, idx) => idx % Math.ceil(bucket.ticks.length / 100) === 0);

        topHuntWindow = {
          minute: min,
          variance: parseFloat(variance.toFixed(2)),
          tickCount: bucket.ticks.length,
          volume: bucket.volume,
          high: bucket.high,
          low: bucket.low,
          ticks: sampledTicks 
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: `성공적으로 분석했습니다. (파일 크기: ${fileSizeMB}MB, 총 ${totalTicks.toLocaleString()}틱, 2일 경과 삭제: ${deletedCount}개)`,
      data: topHuntWindow
    });

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
