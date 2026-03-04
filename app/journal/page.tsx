'use client';

import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, TrendingUp, Clock, Activity, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Trade {
  symbol: string;
  type: string;
  lot: number;
  openTimeKST: string;
  closeTimeKST: string;
  openPrice: number;
  closePrice: number;
  profit: number;
}

interface ParsedResult {
  totalTrades: number;
  winTrades: number;
  lossTrades: number;
  totalProfit: number;
  trades: Trade[];
}

export default function JournalPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
      setResult(null);
      setErrorMsg(null);
      setSaveSuccess(false);
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreview(url);
            setResult(null);
            setErrorMsg(null);
            setSaveSuccess(false);
            e.preventDefault();
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleUpload = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const res = await fetch('/api/journal/parse', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        const detailError = data.error ? `\n(상세: ${data.error})` : '';
        setErrorMsg((data.message || '분석 중 오류가 발생했습니다.') + detailError);
      }
    } catch (error) {
       console.error(error);
       setErrorMsg('네트워크 또는 서버 에러가 발생했습니다. 파일 크기나 타임아웃을 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDB = async () => {
    if (!result) return;
    setIsSaving(true);
    
    try {
      // Firebase User ID나 고유 세션 ID (임시적으로 'demo-user')
      const payload = {
         ...result,
         userId: 'demo-user',
      };

      const res = await fetch('/api/journal/save', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
         setSaveSuccess(true);
      } else {
         setErrorMsg('DB 저장 실패: ' + data.error);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('DB 저장 중 오류 발생');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col gap-12 max-w-7xl">
      <div className="flex flex-col gap-2">
         <h1 className="text-4xl font-outfit font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            <ScanIcon /> AI Trade Journal <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-1 rounded-md not-italic tracking-widest">VISION OCR</span>
         </h1>
         <p className="text-gray-400 font-medium max-w-2xl">
            단 1초! MT4/MT5 매매 내역 스크린샷을 올리기만 하세요. AI가 브로커 시간을 KST로 환산하고 완벽한 통계형 매매일지로 자동 기록해 줍니다.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* 업로드 & 프리뷰 섹션 */}
         <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#0F1115] border border-[#2B303B] rounded-3xl p-8 flex flex-col gap-6 text-center">
               
               {preview ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-800 bg-black flex items-center justify-center">
                     <Image src={preview} alt="MT5 Screenshot Preview" fill className="object-contain" />
                     {loading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-amber-500 z-10">
                           <Loader2 className="animate-spin mb-4" size={40} />
                           <p className="font-bold text-sm uppercase tracking-widest animate-pulse">Scanning Numbers...</p>
                        </div>
                     )}
                  </div>
               ) : (
                  <label className="border-2 border-dashed border-gray-700 hover:border-amber-500/50 bg-[#14161B] rounded-2xl p-12 cursor-pointer transition-all flex flex-col items-center justify-center group overflow-hidden relative">
                     <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-all"></div>
                     <UploadCloud size={48} className="text-gray-500 group-hover:text-amber-500 transition-colors mb-4" />
                     <p className="text-gray-300 font-bold mb-2">이미지 드래그 & 드롭, 클릭 또는 <span className="text-amber-500 bg-amber-500/10 px-1 rounded">Ctrl+V</span> 붙여넣기</p>
                     <p className="text-gray-600 text-xs">MT4 / MT5 History PNG, JPG만 허용</p>
                     <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
               )}

               {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
                     {errorMsg}
                  </div>
               )}

               <button 
                  onClick={handleUpload} 
                  disabled={!selectedImage || loading}
                  className="w-full py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-amber-500 focus:ring-4 ring-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               >
                  {loading ? 'AI 분석 중...' : '자동 매매일지 생성하기'}
               </button>
            </div>
         </div>

         {/* 결과 출력 섹션 */}
         <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            {result ? (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-6">
                  {/* 통계 위젯 */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     <StatCard label="Total Trades" value={result.totalTrades} icon={<Activity />} />
                     <StatCard label="Win Rate" value={`${Math.round((result.winTrades / result.totalTrades) * 100)}%`} icon={<CheckCircle2 />} color="text-green-500" />
                     <StatCard label="Total Profit" value={`$${result.totalProfit.toFixed(2)}`} icon={<TrendingUp />} color={result.totalProfit > 0 ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"} />
                     <StatCard label="Time Synced" value="KST (+9)" icon={<Clock />} />
                  </div>

                  {/* 거래 내역 테이블 */}
                  <div className="bg-[#0F1115] border border-[#2B303B] rounded-3xl p-6 overflow-hidden">
                     <div className="flex items-center justify-between mb-6 pl-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">상세 거래 로그</h3>
                        
                        <button
                          onClick={handleSaveToDB}
                          disabled={isSaving || saveSuccess}
                          className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                            saveSuccess 
                              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                              : 'bg-amber-500 text-black hover:bg-amber-600 disabled:opacity-50'
                          }`}
                        >
                          {isSaving ? '저장 중...' : saveSuccess ? '✓ 영구 저장 완료' : '클라우드 DB에 저장'}
                        </button>
                     </div>
                     <div className="overflow-x-auto overflow-y-auto max-h-[400px] custom-scrollbar pb-2">
                        <table className="w-full text-left border-collapse min-w-[600px] relative">
                           <thead className="sticky top-0 bg-[#0F1115] z-10 shadow-md">
                              <tr className="border-b border-gray-800 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                 <th className="p-4 font-bold text-blue-400">SYM</th>
                                 <th className="p-4">Type/Lot</th>
                                 <th className="p-4 text-center">Open Date (KST)</th>
                                 <th className="p-4 text-right">진입가</th>
                                 <th className="p-4 text-right">청산가</th>
                                 <th className="p-4 text-right">Profit</th>
                              </tr>
                           </thead>
                           <tbody className="text-sm font-medium">
                              {result.trades.map((t, i) => (
                                 <tr key={i} className="border-b border-gray-800/50 hover:bg-[#14161B] transition-colors">
                                    <td className="p-4 text-gray-200 font-bold">{t.symbol}</td>
                                     <td className="p-4">
                                        <span className={`mr-2 px-1.5 py-0.5 rounded text-[10px] font-black tracking-widest ${t.type.toUpperCase() === 'BUY' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                                           {t.type}
                                        </span>
                                       <span className="text-xs text-gray-500">{t.lot.toFixed(2)}</span>
                                    </td>
                                    <td className="p-4 text-center text-[11px] text-gray-400 font-mono tracking-tighter">
                                       {t.openTimeKST}
                                    </td>
                                    <td className="p-4 text-right text-gray-300 font-mono">{t.openPrice.toFixed(2)}</td>
                                    <td className="p-4 text-right text-gray-300 font-mono">{t.closePrice.toFixed(2)}</td>
                                     <td className={`p-4 text-right font-black font-mono ${t.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.profit > 0 ? '+' : ''}{t.profit.toFixed(2)}
                                     </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="h-full bg-[var(--bg-card)] border border-[var(--border-color)] border-dashed rounded-3xl flex flex-col items-center justify-center p-12 text-center text-gray-600">
                  <ScanIcon bg />
                  <h3 className="text-xl font-bold text-gray-400 mb-2 mt-6">데이터 대기 중</h3>
                  <p className="text-sm">좌측에서 스크린샷 이미지를 업로드하고 파싱을 진행해주세요.</p>
               </div>
            )}
         </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color = "text-gray-300" }: { label: string, value: string | number, icon: React.ReactElement, color?: string }) {
   return (
      <div className="bg-[#14161B] border border-gray-800 rounded-2xl p-5 flex flex-col gap-3">
         <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">{label}</span>
            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${color.includes('bg-') ? '' : 'bg-[#2B303B]'} ${color}`}>
               {React.cloneElement(icon, { size: 12 } as React.SVGProps<SVGSVGElement>)}
            </div>
         </div>
         <span className={`text-2xl font-black font-outfit uppercase tracking-tighter ${color}`}>{value}</span>
      </div>
   );
}

function ScanIcon({ bg = false }: { bg?: boolean }) {
   return (
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${bg ? 'bg-amber-500/10 text-amber-500/50' : 'bg-transparent text-amber-500'}`}>
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8V6a2 2 0 0 1 2-2h2" />
            <path d="M4 16v2a2 2 0 0 0 2 2h2" />
            <path d="M16 4h2a2 2 0 0 1 2 2v2" />
            <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
            <path d="M12 11v8l3-3m-6 0l3 3" />
         </svg>
      </div>
   )
}
