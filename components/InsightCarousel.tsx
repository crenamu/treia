'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InsightCarouselProps {
  children: React.ReactNode;
}

export default function InsightCarousel({ children }: InsightCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Auto-scroll logic with precise frame-based speed control
  useEffect(() => {
    let frameId: number;
    let lastTime = 0;
    const speed = 40; // Pixels per second

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      if (!isHovered && containerRef.current) {
        containerRef.current.scrollLeft += speed * deltaTime;
        
        // Loop around for an infinite carousel feel
        if (containerRef.current.scrollLeft >= containerRef.current.scrollWidth - containerRef.current.clientWidth - 1) {
          containerRef.current.scrollLeft = 0;
        }
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered]);

  const updateScrollButtons = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons);
      return () => el.removeEventListener('scroll', updateScrollButtons);
    }
  }, [updateScrollButtons]);

  const scrollHandler = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const distance = 420; // Matches typical card width + gap
      const target = containerRef.current.scrollLeft + (direction === 'left' ? -distance : distance);
      
      containerRef.current.scrollTo({
        left: target,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      className="relative w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button 
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            whileHover={{ scale: 1.1, backgroundColor: '#f59e0b', color: '#000' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scrollHandler('left')}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-black/80 border border-amber-500/50 flex items-center justify-center text-amber-500 shadow-[0_0_40px_rgba(0,0,0,0.9)] backdrop-blur-md transition-shadow hover:shadow-amber-500/20"
          >
            <ChevronLeft size={32} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {canScrollRight && (
          <motion.button 
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.8 }}
            whileHover={{ scale: 1.1, backgroundColor: '#f59e0b', color: '#000' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scrollHandler('right')}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-black/80 border border-amber-500/50 flex items-center justify-center text-amber-500 shadow-[0_0_40px_rgba(0,0,0,0.9)] backdrop-blur-md transition-shadow hover:shadow-amber-500/20"
          >
            <ChevronRight size={32} />
          </motion.button>
        )}
      </AnimatePresence>

      <div 
        ref={containerRef}
        className="flex overflow-x-auto gap-8 pb-12 pt-4 px-2 scrollbar-hide snap-x select-none cursor-grab active:cursor-grabbing" 
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth'
        }}
      >
        {children}
      </div>
    </div>
  );
}
