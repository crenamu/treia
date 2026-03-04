import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const COMMON_FILES_DIR = 'C:\\Users\\crena\\AppData\\Roaming\\MetaQuotes\\Terminal\\Common\\Files';

export async function GET() {
  try {
    if (!fs.existsSync(COMMON_FILES_DIR)) {
      return NextResponse.json({ success: false, message: 'MT5 공용 폴더를 찾을 수 없습니다.' });
    }

    const files = fs.readdirSync(COMMON_FILES_DIR);
    const tickFiles = files.filter(f => f.startsWith('treia_gold_ticks')).sort((a,b) => b.localeCompare(a));
    
    // 1. 오래된 파일 정리 (1일(24시간) 초과 데이터 자동 삭제)
    const now = Date.now();
    let deletedCount = 0;
    tickFiles.forEach(file => {
      const filePath = path.join(COMMON_FILES_DIR, file);
      const stats = fs.statSync(filePath);
      const daysOld = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);
      // 저장 용량 고려, 3일 이상(또는 1일 이상) 지난 틱 데이터는 자동 삭제
      if (daysOld > 2) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    const activeFiles = fs.readdirSync(COMMON_FILES_DIR).filter(f => f.startsWith('treia_gold_ticks')).sort((a,b) => b.localeCompare(a));
    if (activeFiles.length === 0) {
      return NextResponse.json({ success: false, message: '분석할 틱 데이터가 없습니다.' });
    }

    // 가장 최근 파일 선택 (오늘)
    const targetFile = path.join(COMMON_FILES_DIR, activeFiles[0]);
    const fileStats = fs.statSync(targetFile);
    const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
    
    // 2. 틱 데이터 스트림 처리 및 휩소(Stop Hunt) 패턴 찾기
    const fileStream = fs.createReadStream(targetFile);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const minuteBuckets: { [minute: string]: { ticks: any[], high: number, low: number, volume: number } } = {};
    
    let totalTicks = 0;
    for await (const line of rl) {
      if (line.startsWith('Timestamp')) continue; // 헤더 무시
      
      const [timestamp, bid, ask, last, vol] = line.split(',');
      if (!timestamp) continue;
      
      // last 가격이 0.00이면 bid 가격을 사용
      let price = parseFloat(last);
      if (!price || price === 0) {
         price = parseFloat(bid);
      }
      if (!price) continue;
      
      const minutePrefix = timestamp.substring(0, 16); // "2026.03.04 01:00" 분 단위 그룹화

      if (!minuteBuckets[minutePrefix]) {
        minuteBuckets[minutePrefix] = { ticks: [], high: price, low: price, volume: 0 };
      }
      
      const bucket = minuteBuckets[minutePrefix];
      // 차트용 타임스탬프 (HH:MM:SS)
      const timeStr = timestamp.split(' ')[1];

      bucket.ticks.push({ time: timeStr, price });
      if (price > bucket.high) bucket.high = price;
      if (price < bucket.low) bucket.low = price;
      bucket.volume += parseInt(vol || '1', 10);
      totalTicks++;
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

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
