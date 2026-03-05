import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { storage } from '@/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

export const revalidate = 3600; // 1시간 단위 캐싱 (초단위 렌더링 로딩 지연 해결)

const COMMON_FILES_DIR = 'C:\\Users\\crena\\AppData\\Roaming\\MetaQuotes\\Terminal\\Common\\Files';

export async function GET() {
  try {
    let fileStream: fs.ReadStream | null = null;
    let fileContent: string = '';
    let fileSizeKB = '0.00';
    let baseFilename = 'cloud_data.csv';
    let deletedCount = 0;

    if (fs.existsSync(COMMON_FILES_DIR)) {
      const files = fs.readdirSync(COMMON_FILES_DIR);
      const h1Files = files.filter(f => f.startsWith('treia_h1_base_')).sort((a,b) => b.localeCompare(a));
      
      if (h1Files.length > 2) {
        for (let i = 2; i < h1Files.length; i++) {
          const filePath = path.join(COMMON_FILES_DIR, h1Files[i]);
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }

      const activeFiles = fs.readdirSync(COMMON_FILES_DIR).filter(f => f.startsWith('treia_h1_base_')).sort((a,b) => b.localeCompare(a));
      if (activeFiles.length > 0) {
        baseFilename = activeFiles[0];
        const targetFile = path.join(COMMON_FILES_DIR, activeFiles[0]);
        fileStream = fs.createReadStream(targetFile);
        const fileStats = fs.statSync(targetFile);
        fileSizeKB = (fileStats.size / 1024).toFixed(2);
      }
    }

    if (!fileStream) {
       try {
           const url = await getDownloadURL(ref(storage, 'treia/treia_h1_base_latest.csv'));
           const res = await fetch(url);
           if (!res.ok) throw new Error("클라우드 데이터를 가져올 수 없습니다.");
           fileContent = await res.text();
           const bytes = Buffer.byteLength(fileContent, 'utf8');
           fileSizeKB = (bytes / 1024).toFixed(2);
           baseFilename = 'treia_h1_base_latest.csv';
       } catch {
           return NextResponse.json({ success: false, message: '로컬 PC 데이터를 클라우드에 아직 연동하지 않았거나 데이터가 없습니다.' });
       }
    }

    const priceNodes: { [priceLevel: string]: number } = {};
    let totalKCandles = 0;

    const processLine = (line: string) => {
      if (line.startsWith('Time') || line.trim() === '') return;
      const parts = line.split(',');
      if (parts.length < 6) return;
      
      const time = parts[0];
      const closeStr = parts[4];
      const volStr = parts[5];
      
      if (!time) return;
      const close = parseFloat(closeStr);
      const volume = parseInt(volStr, 10);
      
      if (!close || isNaN(close)) return;
      
      const priceBucket = Math.round(close * 10) / 10;
      const bucketStr = priceBucket.toFixed(1);

      if (!priceNodes[bucketStr]) priceNodes[bucketStr] = 0;
      priceNodes[bucketStr] += volume;
      totalKCandles++;
    };

    if (fileStream) {
       const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
       for await (const line of rl) processLine(line);
    } else {
       const lines = fileContent.split('\n');
       for (const line of lines) processLine(line);
    }

    // 3. 누적된 매물대 중 가장 거래량이 터진 상위 5개(Top Volume Nodes) 찾기
    const sortedNodes = Object.entries(priceNodes)
      .map(([price, vol]) => ({ price: parseFloat(price), volume: vol }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5); // 강력한 지지/저항선 Top 5 추출

    // 가격 순으로 다시 정렬 (차트상 위에서 아래로 보기 편하도록)
    const sortedByPrice = [...sortedNodes].sort((a, b) => b.price - a.price);

    return NextResponse.json({
      success: true,
      message: `성공적으로 분석했습니다. (파일 크기: ${fileSizeKB}KB, 총 ${totalKCandles}개의 1시간 캔들, 삭제된 과거 파일: ${deletedCount}개)`,
      data: {
         baseFilename: baseFilename,
         topVolumeNodes: sortedByPrice
      }
    });

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
