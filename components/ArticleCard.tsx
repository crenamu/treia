'use client'
import { Bookmark, Link as LinkIcon, Sparkles } from "lucide-react";

interface ArticleCardProps {
  title: string;
  source: string;
  summary: string;
  difficulty: "입문" | "중급" | "고급";
  category: string;
  isAI?: boolean;
}

export default function ArticleCard({ title, source, summary, difficulty, category, isAI = false }: ArticleCardProps) {
  return (
    <div className="group p-6 rounded-2xl bg-[#14161B] border border-gray-800 hover:border-blue-500/30 transition-all flex flex-col gap-4 relative">
       <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 text-[10px] font-bold tracking-widest">{source}</div>
            {isAI && (
              <div className="flex items-center gap-1 text-[9px] font-bold text-blue-400 uppercase tracking-tighter">
                <Sparkles size={10} /> AI SUMMARIZED
              </div>
            )}
          </div>
          <Bookmark size={14} className="text-gray-700 hover:text-yellow-500 cursor-pointer transition-colors" />
       </div>
       <div className="flex flex-col gap-3">
          <h3 className="font-outfit font-bold text-lg text-gray-100 leading-snug group-hover:text-blue-400 transition-colors uppercase tracking-tight">{title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 font-medium">{summary}</p>
       </div>
       <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">{category}</span>
             <span className="w-1 h-1 rounded-full bg-gray-800"></span>
             <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
               difficulty === '입문' ? 'bg-green-500/10 text-green-500' : 
               difficulty === '중급' ? 'bg-blue-500/10 text-blue-500' : 
               'bg-red-500/10 text-red-400'
             }`}>
                {difficulty}
             </span>
          </div>
          <LinkIcon size={14} className="text-gray-700 group-hover:text-blue-500 transition-colors" />
       </div>
    </div>
  );
}
