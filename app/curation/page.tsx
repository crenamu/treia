'use client'
import { useEffect, useState } from "react";
import { Bot, Filter, History, Loader2 } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import { summarizeArticle } from "@/lib/gemini";
import { getMarketNews } from "@/lib/finnhub";

interface AIArticle {
  title_ko: string;
  summary_ko: string;
  category: string;
  difficulty: "입문" | "중급" | "고급";
  source: string;
}

export default function CurationPage() {
  const [articles, setArticles] = useState<AIArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAIInfo() {
      try {
        setLoading(true);
        
        // 1. Finnhub에서 실시간 뉴스 가져오기 (Forex, Crypto 중심)
        const forexNews = await getMarketNews("forex");
        const cryptoNews = await getMarketNews("crypto");
        const allNews = [...forexNews.slice(0, 3), ...cryptoNews.slice(0, 3)];

        // 2. Gemini를 사용하여 최신 뉴스 요약하기
        const summarizedResults = await Promise.all(
          allNews.slice(0, 5).map(async (news) => {
            const summaryData = await summarizeArticle(news.headline, news.summary || news.headline);
            if (summaryData) {
              return {
                ...summaryData,
                source: news.source
              } as AIArticle;
            }
            return null;
          })
        );

// 3. 필터링 및 상태 업데이트
        const finalArticles = summarizedResults.filter((a): a is AIArticle => a !== null);
        
        // 4. 리서치 기반 고품질 데이터와 합치기 (CFD/EA 특화)
        const expertData: AIArticle[] = [
          {
            title_ko: "Gold: 퀀텀 발키리 전략의 핵심 로직 분석",
            summary_ko: "마틴게일을 배제한 순수 가격 액션 기반 골드 EA의 원리. 왜 상위 1% 트레이더들이 이 로직에 열광하는지 심층 분석합니다.",
            category: "자동매매",
            difficulty: "고급",
            source: "MQL5 Exclusive"
          },
          {
             title_ko: "나스닥 시가 돌파(ORB)를 활용한 데이 트레이딩",
             summary_ko: "뉴욕 본장 시작 15분, 나스닥의 폭발적인 변동성을 수익으로 전환하는 알고리즘 설계도와 진입 필터 설정법을 공개합니다.",
             category: "매매기법",
             difficulty: "중급",
             source: "MQL5 Articles"
          },
          {
             title_ko: "비트코인 AI 강화학습: Satoshium 로직의 이해",
             summary_ko: "SMC(Smart Money Concepts)와 머신러닝을 결합하여 가상자산의 비정형 변동성을 예측하는 최신 기술 트렌드를 다룹니다.",
             category: "AI분석",
             difficulty: "고급",
             source: "MQL5 Expert"
          }
        ];

        setArticles(finalArticles.length > 0 ? [...finalArticles, ...expertData] : expertData);
      } catch (error) {
        console.error("AI Curation Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAIInfo();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
             <Bot size={20} />
           </div>
           <h1 className="text-3xl font-outfit font-extrabold text-white tracking-tight">AI 정보 큐레이션</h1>
        </div>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
           글로벌 금융 시장의 화두를 AI가 실시간으로 포착하여 한국어로 정밀 요약해 드립니다. <br />
           실시간으로 분석된 최신 트레이딩 인사이트입니다.
        </p>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
          <div className="flex items-center gap-3">
             <button className="px-4 py-2 rounded-lg bg-[#FFC107] text-black text-xs font-bold hover:shadow-[0_4px_12px_rgba(255,193,7,0.2)] transition-all">전체보기</button>
             <button className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 text-xs font-bold hover:bg-gray-700 transition-all border border-gray-700">자동매매 (EA)</button>
             <button className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 text-xs font-bold hover:bg-gray-700 transition-all border border-gray-700">매매기법</button>
          </div>
          <div className="flex items-center gap-2">
             <Filter size={14} className="text-gray-500" />
             <span className="text-xs text-gray-500 font-medium tracking-tight">난이도: 전체</span>
          </div>
      </div>

      {/* Curation List Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={32} className="text-blue-500 animate-spin" />
          <p className="text-xs text-gray-600 font-bold uppercase tracking-[0.3em]">AI 분석 및 한국어 요약 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {articles.map((art, idx) => (
             <ArticleCard 
                key={idx}
                title={art.title_ko}
                source={art.source}
                summary={art.summary_ko}
                difficulty={art.difficulty}
                category={art.category}
                isAI={true} 
             />
           ))}
        </div>
      )}
      
      {/* Floating Action / Load More */}
      <div className="flex justify-center mt-8">
         <button className="px-12 py-4 rounded-xl bg-gray-900/40 border border-gray-800 text-gray-400 text-sm font-bold hover:border-gray-600 transition-all flex items-center gap-3">
           <History size={16} /> 큐레이션 더보기
         </button>
      </div>
    </div>
  );
}
