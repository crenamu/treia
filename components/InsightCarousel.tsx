'use client';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InsightCarouselProps {
  children: React.ReactNode;
}

export default function InsightCarousel({ children }: InsightCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  // Smooth Auto-scroll using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    const speed = 0.6; // pixels per frame

    const step = () => {
      if (!isHovered && scrollRef.current) {
        scrollRef.current.scrollLeft += speed;
        // Infinite loop effect
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 1) {
           scrollRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      className="relative w-full group"
      onMouseEnter={() => {
        setIsHovered(true);
        setShowArrows(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowArrows(false);
      }}
    >
      {/* Arrows */}
      <button 
        onClick={() => scroll('left')}
        style={{ opacity: showArrows ? 1 : 0, visibility: showArrows ? 'visible' : 'hidden' }}
        className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#14161B]/95 border border-amber-500/50 flex items-center justify-center text-amber-500 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:bg-amber-500 hover:text-black transition-all duration-300"
      >
        <ChevronLeft size={28} />
      </button>

      <button 
        onClick={() => scroll('right')}
        style={{ opacity: showArrows ? 1 : 0, visibility: showArrows ? 'visible' : 'hidden' }}
        className="absolute -right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#14161B]/95 border border-amber-500/50 flex items-center justify-center text-amber-500 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:bg-amber-500 hover:text-black transition-all duration-300"
      >
        <ChevronRight size={28} />
      </button>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
}
