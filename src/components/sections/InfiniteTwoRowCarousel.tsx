'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Pause, Play, Sparkles, ExternalLink, BookOpen, Layers } from 'lucide-react';
import type { CarouselCard, CarouselStateType } from '@/core/types';

const ROW_1_CARDS: CarouselCard[] = [
  {
    id: 'c1',
    title: 'AI Superpowers Field Manual',
    subtitle: 'Comprehensive visual guide for research and building',
    category: 'Student AI Series',
    aspectRatio: '16:9',
    tags: ['Prompt Engineering', 'Research', 'GenAI'],
    gradientTheme: 'from-amber-500/20 via-zinc-900 to-black'
  },
  {
    id: 'c2',
    title: 'Star Excellent Academy',
    subtitle: 'Institutional Digital Flagship & API CMS Hydration',
    category: 'Web Design',
    aspectRatio: '16:9',
    tags: ['Next.js 16', 'Tailwind', 'Cloudflare'],
    gradientTheme: 'from-blue-500/20 via-zinc-900 to-black'
  },
  {
    id: 'c3',
    title: 'Prompt Like a Pro',
    subtitle: 'Advanced reasoning frameworks and structured synthesis',
    category: 'Educational Track',
    aspectRatio: '16:9',
    tags: ['Reasoning', 'Cognitive Tools', 'Workflows'],
    gradientTheme: 'from-purple-500/20 via-zinc-900 to-black'
  },
  {
    id: 'c4',
    title: 'Precision Brand Architecture',
    subtitle: 'Cinematic visual identities engineered for distinction',
    category: 'Brand Systems',
    aspectRatio: '16:9',
    tags: ['Identity', 'Design Systems', 'Typography'],
    gradientTheme: 'from-emerald-500/20 via-zinc-900 to-black'
  },
  {
    id: 'c5',
    title: 'Create, Research & Build',
    subtitle: 'Autonomous project design and literature verification',
    category: 'Student AI Series',
    aspectRatio: '16:9',
    tags: ['Prototyping', 'Deep Research'],
    gradientTheme: 'from-rose-500/20 via-zinc-900 to-black'
  }
];

const ROW_2_CARDS: CarouselCard[] = [
  {
    id: 'c6',
    title: "Teachers' AI Toolkit",
    subtitle: 'Classroom lesson planning and personalized feedback',
    category: 'Educator Framework',
    aspectRatio: '16:9',
    tags: ['Pedagogy', 'Time Savings', 'Curriculum'],
    gradientTheme: 'from-indigo-500/20 via-zinc-900 to-black'
  },
  {
    id: 'c7',
    title: 'Cinematic Motion Production',
    subtitle: 'Studio-grade video editing and motion graphics',
    category: 'Content Production',
    aspectRatio: '16:9',
    tags: ['Post-Production', 'Showreels'],
    gradientTheme: 'from-amber-600/20 via-zinc-900 to-black'
  },
  {
    id: 'c8',
    title: 'The AI Classroom: Integrity & Policy',
    subtitle: 'Ethical boundaries, bias detection, and academic safety',
    category: 'Educator Framework',
    aspectRatio: '16:9',
    tags: ['Ethics', 'Safety', 'Policies'],
    gradientTheme: 'from-cyan-500/20 via-zinc-900 to-black'
  },
  {
    id: 'c9',
    title: 'High-Concurrency Digital Portals',
    subtitle: 'Edge-distributed micro-frontends and sub-second delivery',
    category: 'Architecture',
    aspectRatio: '16:9',
    tags: ['Cloudflare Pages', 'Hostinger', 'Edge CDN'],
    gradientTheme: 'from-violet-500/20 via-zinc-900 to-black'
  },
  {
    id: 'c10',
    title: '100 AI Prompts Field Manual',
    subtitle: 'Battle-tested prompts for high-stakes problem solving',
    category: 'Student & Teacher Edition',
    aspectRatio: '16:9',
    tags: ['Prompt Library', 'Field Manual'],
    gradientTheme: 'from-yellow-500/20 via-zinc-900 to-black'
  }
];

// Single interactive carousel track row with 6-state machine
function CarouselRow({
  cards,
  direction = 'left',
  speedMultiplier = 1.0,
  isGlobalPaused = false,
  onCardClick
}: {
  cards: CarouselCard[];
  direction?: 'left' | 'right';
  speedMultiplier?: number;
  isGlobalPaused?: boolean;
  onCardClick?: (card: CarouselCard) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<CarouselStateType>('IDLE');
  const posRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const dragDistRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  // Triple the items for true seamless wrapping
  const repeatedCards = [...cards, ...cards, ...cards];

  // Base speed in pixels per second
  const baseSpeed = (direction === 'left' ? -35 : 35) * speedMultiplier;

  // Animation Loop
  const tick = useCallback((time: number) => {
    const dt = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    if (!isGlobalPaused && state !== 'PAUSED' && state !== 'FOCUS') {
      if (state === 'IDLE') {
        posRef.current += baseSpeed * dt;
      } else if (state === 'HOVER') {
        // Slow down smoothly when hovered
        posRef.current += (baseSpeed * 0.3) * dt;
      } else if (state === 'MOMENTUM') {
        posRef.current += velocityRef.current * dt;
        // Apply friction
        velocityRef.current *= 0.94;
        if (Math.abs(velocityRef.current) < 5) {
          velocityRef.current = 0;
          setState('IDLE');
        }
      }
    }

    // Wrap around smoothly
    if (trackRef.current) {
      const singleSetWidth = trackRef.current.scrollWidth / 3;
      if (posRef.current <= -singleSetWidth) {
        posRef.current += singleSetWidth;
      } else if (posRef.current >= 0) {
        posRef.current -= singleSetWidth;
      }
      trackRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
    }

    animationFrameRef.current = requestAnimationFrame(tick);
  }, [baseSpeed, isGlobalPaused, state]);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [tick]);

  // Pointer Drag Handlers (Spec §7.3.2 & §7.3.3)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    dragDistRef.current = 0;
    velocityRef.current = 0;
    setState('DRAGGING');
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    dragDistRef.current += Math.abs(dx);
    posRef.current += dx;
    velocityRef.current = dx * 40; // momentum calculation
    startXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    if (Math.abs(velocityRef.current) > 20) {
      setState('MOMENTUM');
    } else {
      setState('IDLE');
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => { if (state === 'IDLE') setState('HOVER'); }}
      onMouseLeave={() => { if (state === 'HOVER') setState('IDLE'); }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing select-none py-2"
    >
      <div
        ref={trackRef}
        className="flex space-x-5 w-max will-change-transform"
      >
        {repeatedCards.map((card, idx) => {
          const isClone = idx >= cards.length;
          return (
            <div
              key={`${card.id}-${idx}`}
              aria-hidden={isClone ? 'true' : undefined}
              onClick={(e) => {
                // Click vs Drag threshold: 5px (Spec §7.3.3)
                if (dragDistRef.current > 5) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                onCardClick?.(card);
              }}
              onFocus={() => setState('FOCUS')}
              onBlur={() => setState('IDLE')}
              tabIndex={isClone ? -1 : 0}
              className="group relative w-[280px] sm:w-[340px] md:w-[380px] h-[190px] sm:h-[210px] rounded-2xl p-5 bg-zinc-950 border border-zinc-800/90 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientTheme} opacity-40 group-hover:opacity-70 transition-opacity`} />
              
              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-zinc-900/90 border border-zinc-800 text-amber-400 uppercase tracking-wider backdrop-blur-md">
                  {card.category}
                </span>
                <span className="p-1 rounded-lg bg-zinc-900/80 text-zinc-500 group-hover:text-amber-400 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Card Body */}
              <div className="relative z-10 space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {card.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {card.subtitle}
                </p>
              </div>

              {/* Card Footer: Tags */}
              <div className="relative z-10 flex flex-wrap gap-1.5 pt-2">
                {card.tags?.slice(0, 3).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded text-[9px] font-mono text-zinc-400 bg-black/50 border border-zinc-800/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function InfiniteTwoRowCarousel({
  onOpenCourseModal
}: {
  onOpenCourseModal?: () => void;
}) {
  const [isPaused, setIsPaused] = useState(false);

  // Tab visibility handling (Spec §7.3.7)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <section 
      aria-label="Showcase & Course Curriculum Carousel"
      className="relative w-full py-16 md:py-24 bg-black overflow-hidden border-y border-zinc-900"
    >
      {/* Edge gradient masks for seamless infinite look */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-black to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-black to-transparent z-20" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-amber-400 mb-3 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Production Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Engineered with Intent. Distinctly Elevated.
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Drag left or right to explore studio releases and educational booklet modules.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 transition-colors"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        </div>
      </div>

      {/* Two Counter-Rotating Rows */}
      <div className="space-y-4">
        {/* Row 1: Leftward drift */}
        <CarouselRow
          cards={ROW_1_CARDS}
          direction="left"
          speedMultiplier={1.0}
          isGlobalPaused={isPaused}
          onCardClick={onOpenCourseModal}
        />

        {/* Row 2: Rightward drift */}
        <CarouselRow
          cards={ROW_2_CARDS}
          direction="right"
          speedMultiplier={0.9}
          isGlobalPaused={isPaused}
          onCardClick={onOpenCourseModal}
        />
      </div>
    </section>
  );
}
