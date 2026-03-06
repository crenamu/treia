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
    <div className="group relative bg-[#14161B] border border-gray-800 hover:border-amber-500/30 rounded-3xl overflow-hidden transition-all duration-500 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
        <Image 
          src={imageUrl || "https://images.unsplash.com/photo-1611974714652-960205d8bc11?auto=format&fit=crop&q=80&w=800"} 
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14161B] via-transparent to-transparent opacity-60"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
            {category}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{source}</span>
            {isAI && (
              <div className="flex items-center gap-1 text-[9px] font-bold text-amber-500 uppercase tracking-tighter">
                <Sparkles size={10} /> AI Analysis
              </div>
            )}
          </div>
          <Bookmark size={14} className="text-gray-700 hover:text-amber-500 cursor-pointer transition-colors" />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-lg text-white leading-tight group-hover:text-amber-500 transition-colors line-clamp-2 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-medium">
            {summary}
          </p>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-800/50">
          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-600">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{date || "Just now"}</span>
            </div>
            <span className={`px-2 py-0.5 rounded ${
              difficulty === '입문' ? 'bg-green-500/10 text-green-500' : 
              difficulty === '중급' ? 'bg-blue-500/10 text-blue-500' : 
              'bg-red-500/10 text-red-500'
            }`}>
              {difficulty}
            </span>
          </div>
          <ArrowUpRight size={16} className="text-gray-700 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
}
