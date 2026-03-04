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
    const h1Files = files.filter(f => f.startsWith('treia_h1_base_')).sort((a,b) => b.localeCompare(a));
    
    // 1. 오래된 기준 H1 파일 정리 (최근 2개 유지, 나머지는 자동 삭제)
    let deletedCount = 0;
    if (h1Files.length > 2) {
      for (let i = 2; i < h1Files.length; i++) {
        const filePath = path.join(COMMON_FILES_DIR, h1Files[i]);
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    }

    const activeFiles = fs.readdirSync(COMMON_FILES_DIR).filter(f => f.startsWith('treia_h1_base_')).sort((a,b) => b.localeCompare(a));
    if (activeFiles.length === 0) {
      return NextResponse.json({ success: false, message: '분석할 H1 베이스 데이터(최근 1달치)가 없습니다. MT5에서 스크립트를 먼저 실행해주세요.' });
    }

    // 가장 최근 파일 선택 (주말 마감 후 생성한 파일)
    const targetFile = path.join(COMMON_FILES_DIR, activeFiles[0]);
    const fileStats = fs.statSync(targetFile);
    const fileSizeKB = (fileStats.size / 1024).toFixed(2);
    
    // 2. 1시간봉(H1) 데이터 파싱하여 가장 매물대(Volume)가 두터운 'Price Node' 찾기
    const fileStream = fs.createReadStream(targetFile);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const priceNodes: { [priceLevel: string]: number } = {};
    let totalKCandles = 0;

    for await (const line of rl) {
      if (line.startsWith('Time')) continue; // 헤더 무시
      
      const [time, openStr, highStr, lowStr, closeStr, volStr] = line.split(',');
      if (!time) continue;

      // 트레이딩 편의성을 위해 가격을 소수점 1자리(정수형태)로 그룹핑 (예: 2501.52 -> 2501.5)
      const close = parseFloat(closeStr);
      const volume = parseInt(volStr, 10);
      
      if (!close || isNaN(close)) continue;
      
      // 소수점 1자리로 반올림하여 1달 치 가격대를 "버킷(Bucket)"으로 묶음
      const priceBucket = Math.round(close * 10) / 10;
      const bucketStr = priceBucket.toFixed(1);

      if (!priceNodes[bucketStr]) {
        priceNodes[bucketStr] = 0;
      }
      
      priceNodes[bucketStr] += volume; // 해당 가격대에서 터진 거래량을 누적
      totalKCandles++;
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
         baseFilename: activeFiles[0],
         topVolumeNodes: sortedByPrice
      }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
