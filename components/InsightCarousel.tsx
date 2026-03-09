'use client';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InsightCarouselProps {
  children: React.ReactNode;
}

export default function InsightCarousel({ children }: InsightCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Auto-scroll logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isHovered && scrollRef.current) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          // If reached the end, snap back to start (or smoothly scroll back)
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: 2, behavior: 'auto' });
          }
        }
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  // Handle arrow visibility
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#14161B]/90 border border-gray-700 flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-500 hover:text-black hover:border-amber-500 hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-6 pb-8 snap-x border-t border-b border-transparent hover:border-b-gray-800/20 scrollbar-hide" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      {showRightArrow && (
        <button 
          onClick={() => scroll('right')}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#14161B]/90 border border-gray-700 flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-500 hover:text-black hover:border-amber-500 hover:scale-110 active:scale-95"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
}
