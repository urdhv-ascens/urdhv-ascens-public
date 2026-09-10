'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles 
} from 'lucide-react';
import contentData from "@/data/content.json";
import { getLiveContent } from "@/lib/api-client";

interface ServiceCardItem {
  id: string;
  number?: string;
  title: string;
  category?: string;
  description: string;
  tags?: string[];
  active?: boolean;
}

function ServiceTrack({
  items,
  direction = 'left',
  speed = 0.55,
  isPausedGlobal = false,
  onCardClick
}: {
  items: ServiceCardItem[];
  direction?: 'left' | 'right';
  speed?: number;
  isPausedGlobal?: boolean;
  onCardClick?: (item: ServiceCardItem) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const singleWidthRef = useRef(0);
  const dragStartRef = useRef<{ x: number; y: number; pos: number; time: number } | null>(null);
  const velocityRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Guarantee large width: cycle repeated 4 times, duplicated for a seamless 2-half loop
  const cycleItems = [...items, ...items, ...items, ...items];
  const displayItems = [...cycleItems, ...cycleItems];

  useEffect(() => {
    if (trackRef.current) {
      const sw = trackRef.current.scrollWidth / 2;
      singleWidthRef.current = sw;
      if (direction === 'right') {
        posRef.current = -sw;
      } else {
        posRef.current = 0;
      }
    }
  }, [items, direction]);

  const animate = useCallback(() => {
    if (!trackRef.current) return;

    const singleWidth = singleWidthRef.current || (trackRef.current.scrollWidth / 2);
    if (singleWidth <= 0) {
      rafIdRef.current = requestAnimationFrame(animate);
      return;
    }

    if (!isDraggingRef.current) {
      if (Math.abs(velocityRef.current) > 0.05) {
        posRef.current += velocityRef.current;
        velocityRef.current *= 0.94; // Inertial friction
      } else {
        velocityRef.current = 0;
        if (!isHoveredRef.current && !isPausedGlobal) {
          const moveDelta = direction === 'left' ? -speed : speed;
          posRef.current += moveDelta;
        }
      }
    }

    // Wrap around for continuous loop
    if (direction === 'left') {
      if (posRef.current <= -singleWidth) {
        posRef.current += singleWidth;
      } else if (posRef.current > 0) {
        posRef.current -= singleWidth;
      }
    } else {
      if (posRef.current >= 0) {
        posRef.current -= singleWidth;
      } else if (posRef.current < -singleWidth * 2) {
        posRef.current += singleWidth;
      }
    }

    trackRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
    rafIdRef.current = requestAnimationFrame(animate);
  }, [direction, speed, isPausedGlobal]);

  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [animate]);

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      pos: posRef.current,
      time: Date.now()
    };
    velocityRef.current = 0;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !dragStartRef.current) return;
    const diffX = e.clientX - dragStartRef.current.x;
    posRef.current = dragStartRef.current.pos + diffX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !dragStartRef.current) return;
    const diffX = e.clientX - dragStartRef.current.x;
    const dt = Date.now() - dragStartRef.current.time;
    if (dt > 0) {
      velocityRef.current = (diffX / dt) * 12;
    }
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleClick = (item: ServiceCardItem, e: React.MouseEvent) => {
    if (dragStartRef.current) {
      const diffX = Math.abs(e.clientX - dragStartRef.current.x);
      if (diffX > 5) {
        // Drag gesture detected, ignore click
        return;
      }
    }
    onCardClick?.(item);
  };

  if (items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none py-2"
      onPointerEnter={() => { isHoveredRef.current = true; }}
      onPointerLeave={() => { isHoveredRef.current = false; }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { isDraggingRef.current = false; }}
    >
      <div
        ref={trackRef}
        className="flex space-x-4 cursor-grab active:cursor-grabbing will-change-transform"
        style={{ width: 'max-content' }}
      >
        {displayItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            onClick={(e) => handleClick(item, e)}
            className="w-[230px] sm:w-[280px] md:w-[320px] shrink-0 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              {/* Header: Number & Category */}
              <div className="flex items-center justify-between mb-2.5 sm:mb-3.5">
                <span className="text-lg sm:text-xl font-bold font-mono text-zinc-600 group-hover:text-emerald-400 transition-colors">
                  {item.number || String((idx % items.length) + 1).padStart(2, '0')}
                </span>
                {item.category && (
                  <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                    {item.category}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mb-1.5 sm:mb-2">
                {item.title}
              </h3>
              <p className="text-zinc-400 text-[11px] sm:text-xs md:text-sm leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Footer tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-zinc-850">
                {item.tags.slice(0, 3).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-400 bg-zinc-900/80 border border-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Services({
  onOpenCourseModal
}: {
  onOpenCourseModal?: () => void;
}) {
  const [servicesData, setServicesData] = useState(contentData.services || {
    tagline: 'HOW WE SERVE',
    title: 'Precision Services',
    description: 'Tailored engagements engineered from foundational concept to enterprise execution.',
    list: []
  });

  const [items, setItems] = useState<ServiceCardItem[]>(
    ((contentData.services.list || []) as any[]).filter((s: any) => s.active !== false)
  );

  useEffect(() => {
    async function loadLive() {
      try {
        const live = await getLiveContent();
        if (live && live.services) {
          setServicesData(live.services as any);
          if (Array.isArray(live.services.list) && live.services.list.length > 0) {
            const activeList = live.services.list.filter((s: any) => s.active !== false);
            setItems(activeList);
          }
        }
      } catch (err) {
        console.warn("Using bundled services fallback:", err);
      }
    }
    loadLive();
  }, []);

  // Split into two balanced tracks
  const half = Math.ceil(items.length / 2);
  const row1 = items.slice(0, half);
  const row2 = items.slice(half);

  const [isPausedGlobal, setIsPausedGlobal] = useState(false);

  useEffect(() => {
    const handleVisibility = () => {
      setIsPausedGlobal(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const handleCardClick = (item: ServiceCardItem) => {
    if (item.category?.includes('Automation') || item.title.includes('AI') || item.title.includes('E-Book')) {
      onOpenCourseModal?.();
    } else {
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section 
      id="services" 
      className="relative w-full py-20 md:py-28 bg-black overflow-hidden border-b border-zinc-900"
    >
      {/* Edge gradient masks for seamless aesthetic */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-black to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-black to-transparent z-20" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-2 block">
              {servicesData.tagline || 'HOW WE SERVE'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {servicesData.title || 'Precision Services'}
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              {servicesData.description || 'Tailored engagements engineered from foundational concept to enterprise execution.'}
            </p>
          </div>

          <a 
            href="#contact" 
            className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider group"
          >
            <span>Discuss A Project</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Dual Counter-Rotating Continuous Small-Card Tracks */}
      <div className="flex flex-col space-y-4">
        <ServiceTrack
          items={row1.length > 0 ? row1 : items}
          direction="left"
          speed={0.55}
          isPausedGlobal={isPausedGlobal}
          onCardClick={handleCardClick}
        />
        <ServiceTrack
          items={row2.length > 0 ? row2 : items}
          direction="right"
          speed={0.6}
          isPausedGlobal={isPausedGlobal}
          onCardClick={handleCardClick}
        />
      </div>
    </section>
  );
}
