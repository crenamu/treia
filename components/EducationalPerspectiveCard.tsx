"use client";

import { motion } from "framer-motion";
import { Info, Layout, Target, TrendingUp, AlertTriangle, BookOpen } from "lucide-react";

interface Level {
  price: number;
  label: string;
  type: 'major' | 'minor';
}

interface PerspectiveProps {
  levels: Level[];
  analysis: string;
  scenarios: { title: string; desc: string; color: string }[];
}

export default function EducationalPerspectiveCard({ levels, analysis, scenarios }: PerspectiveProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 1. Infographic Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1A1D23] to-[#14161B] border border-gray-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-10 -mt-10" />
        
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-amber-500" size={24} />
          <h3 className="text-xl font-black text-white tracking-tight">시장 구조 및 교육적 관점 (Context)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Analysis Text */}
          <div className="space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              {analysis}
            </p>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
              <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/80 font-medium leading-relaxed">
                <b>학습 포인트:</b> 전일 저점에서의 강한 회귀 본능은 단순히 가격의 상승이 아닌 기관의 유동성 매집 프로세스로 이해해야 합니다.
              </p>
            </div>
          </div>

          {/* Key Levels Visualization (Infographic Style) */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Key Observational Levels</h4>
            {levels.map((level, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  level.type === 'major' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-gray-900 border-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${level.type === 'major' ? 'bg-cyan-400' : 'bg-yellow-500'}`} />
                  <span className="text-xs font-bold text-gray-300">{level.label}</span>
                </div>
                <span className={`text-sm font-black ${level.type === 'major' ? 'text-cyan-400' : 'text-yellow-500'}`}>
                  ${level.price.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Strategy Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((s, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="p-6 rounded-3xl bg-[#14161B] border border-gray-800 hover:border-gray-700 transition-all flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${s.color}`} />
              <h5 className="font-bold text-white text-sm">{s.title}</h5>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed font-medium italic">
              &quot;{s.desc}&quot;
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
