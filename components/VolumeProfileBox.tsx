'use client';

import { useEffect, useState } from 'react';
import { Target } from 'lucide-react';

interface VolumeNode {
  price: number;
  volume: number;
}

interface H1ProfileData {
  baseFilename: string;
  topVolumeNodes: VolumeNode[];
}

export default function VolumeProfileBox() {
  const [data, setData] = useState<H1ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/h1/profiles');
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#1A1D24] p-6 rounded-2xl border border-[#2B303B] animate-pulse">
        <p className="text-gray-500 text-sm">3개월 치 H1 매물대 로딩 중...</p>
      </div>
    );
  }

  if (!data || !data.topVolumeNodes?.length) {
    return null;
  }

  // 최고 거래량을 기준으로 게이지바(가시성) 비율 설정
  const maxVol = Math.max(...data.topVolumeNodes.map(n => n.volume));

  return (
    <div className="bg-[#1A1D24] p-6 rounded-2xl border border-amber-500/20 flex flex-col gap-4 shadow-lg shadow-amber-500/5">
      <div className="flex items-center gap-2 mb-2 border-b border-gray-800 pb-4">
        <Target className="text-amber-500" size={18} />
        <div>
           <h3 className="text-sm font-bold text-white tracking-widest uppercase">핵심 매물대 박스 (Volume Nodes)</h3>
           <p className="text-[10px] text-gray-500 font-medium">최근 3개월 H1 캔들 기준 강력 지지 및 저항선</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {data.topVolumeNodes.map((node, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono font-bold text-gray-300">${node.price.toFixed(1)}</span>
              <span className="text-[10px] text-gray-500">Vol: {node.volume.toLocaleString()}</span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full" 
                style={{ width: `${(node.volume / maxVol) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
