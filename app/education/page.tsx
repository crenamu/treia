'use client'
import { useEffect, useState } from 'react';
import { ArrowLeft, GraduationCap, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';

interface InsightArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  thumbnail?: string;
  createdAt: { seconds: number };
  difficulty?: "입문" | "중급" | "고급";
  source?: string;
}

export default function EducationListPage() {
  const [articles, setArticles] = useState<InsightArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/education')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setArticles(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white pb-24">
      {/* Header */}
      <div className="bg-[#14161B] border-b border-gray-800 pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-500 mb-8 transition-colors text-sm font-bold">
            <ArrowLeft size={16} /> 매매 대시보드로 돌아가기
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                <GraduationCap size={20} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Treia Academy</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter">트레이아 인사이트</h1>
              <p className="text-gray-500 mt-2 font-medium">데이터와 통계로 증명하는 프리미엄 트레이딩 교육 자료</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="관심 있는 주제 검색..." 
                  className="bg-black/40 border border-gray-800 rounded-2xl py-3 pl-12 pr-6 text-sm focus:border-amber-500 outline-none w-full md:w-[300px] transition-all"
                />
              </div>
              <button className="p-3 bg-gray-800 rounded-2xl text-gray-400 hover:text-white transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-3xl h-[400px] animate-pulse"></div>
            ))
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <Link href={`/education/${article.id}`} key={article.id}>
                <ArticleCard 
                  title={article.title}
                  category={article.category}
                  summary={article.excerpt}
                  imageUrl={article.thumbnail}
                  date={new Date(article.createdAt.seconds * 1000).toLocaleDateString()}
                  source={article.source || "Treia Official"}
                  difficulty={article.difficulty || "입문"}
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 font-bold">등록된 교육 자료가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
