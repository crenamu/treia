'use client'
import { Bookmark, ArrowUpRight, Sparkles, Clock } from "lucide-react";
import Image from "next/image";

interface ArticleCardProps {
  title: string;
  source: string;
  summary: string;
  difficulty: "입문" | "중급" | "고급";
  category: string;
  imageUrl?: string;
  date?: string;
  isAI?: boolean;
}

export default function ArticleCard({ 
  title, 
  source, 
  summary, 
  difficulty, 
  category, 
  imageUrl, 
  date,
  isAI = false 
}: ArticleCardProps) {
  return (
    <div className="group relative bg-[#14161B] border border-gray-800/50 hover:border-amber-500/30 rounded-3xl overflow-hidden transition-all duration-500 flex flex-col h-full shadow-2xl shadow-black/20">
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
        <Image 
          src={imageUrl || "https://images.unsplash.com/photo-1611974714652-960205d8bc11?auto=format&fit=crop&q=80&w=800"} 
          alt="" // Alt text overlap prevent
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14161B] via-transparent to-transparent opacity-80"></div>
        
        {/* Category Badge - Over Image */}
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/5 text-[9px] font-black text-amber-500 uppercase tracking-widest shadow-xl">
            {category}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-7 flex flex-col flex-grow gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{source}</span>
            {isAI && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-[9px] font-bold text-amber-500 uppercase tracking-tighter">
                <Sparkles size={10} /> AI Analysis
              </div>
            )}
          </div>
          <Bookmark size={15} className="text-gray-700 hover:text-amber-500 cursor-pointer transition-all" />
        </div>

        <div className="flex flex-col gap-3.5">
          <h3 className="font-bold text-lg md:text-xl text-white leading-[1.3] group-hover:text-amber-500 transition-colors line-clamp-2 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 font-medium opacity-80">
            {summary}
          </p>
        </div>

        <div className="mt-auto pt-7 flex items-center justify-between border-t border-gray-800/60">
          <div className="flex items-center gap-5 text-[10px] font-bold text-gray-600">
            <div className="flex items-center gap-1.5 hover:text-gray-400 transition-colors">
              <Clock size={12} className="text-amber-500/50" />
              <span>{date || "Just now"}</span>
            </div>
            <span className={`px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-tighter ${
              difficulty === '입문' ? 'bg-emerald-500/5 text-emerald-500' : 
              difficulty === '중급' ? 'bg-blue-500/5 text-blue-500' : 
              'bg-rose-500/5 text-rose-500'
            }`}>
              {difficulty}
            </span>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-600 group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-500 transition-all duration-300">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
