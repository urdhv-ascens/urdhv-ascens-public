'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  ArrowRight,
  Layers,
  Pause,
  Play
} from 'lucide-react';
import contentData from "@/data/content.json";
import { useCMSContent } from "@/core/CMSContentContext";
import type { ProjectItem } from "@/core/types";

export function Projects() {
  const { content } = useCMSContent();
  const projectsMeta = content.projects || (contentData as any).projects || {
    tagline: "SELECTED WORK",
    title: "Curated Projects",
    description: "Digital systems and client flagship productions delivered with precision.",
    intervalSeconds: 5,
    autoPlay: true
  };

  const rawProjects = Array.isArray(content.projectsList) && content.projectsList.length > 0
    ? content.projectsList
    : ((contentData as any).projectsList || []);
  const projects: ProjectItem[] = (rawProjects as any[]).filter((p: any) => p.status === 'ACTIVE');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [isTransitioning, setIsTransitioning] = useState(false);

  const total = projects.length;
  const intervalDurationMs = Math.max((projectsMeta.intervalSeconds || 5) * 1000, 2000);
  const tickIntervalMs = 40;

  // Infinite looping slide navigation
  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev + 1) % total);
    setProgress(0);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev - 1 + total) % total);
    setProgress(0);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [total]);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(idx);
    setProgress(0);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  // Equal-interval timer engine with infinite looping
  useEffect(() => {
    if (total <= 1 || isPaused || projectsMeta.autoPlay === false) return;

    const intervalTimer = setInterval(() => {
      setProgress(prev => {
        const nextProg = prev + (tickIntervalMs / intervalDurationMs) * 100;
        if (nextProg >= 100) {
          nextSlide();
          return 0;
        }
        return nextProg;
      });
    }, tickIntervalMs);

    return () => clearInterval(intervalTimer);
  }, [total, isPaused, intervalDurationMs, nextSlide, projectsMeta.autoPlay]);

  // Pause on tab inactive
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const section = document.getElementById('projects');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  if (total === 0) return null;

  const currentProject = projects[currentIndex] || projects[0];

  return (
    <section 
      id="projects" 
      className="relative w-full py-20 md:py-32 bg-zinc-950 border-b border-zinc-900 overflow-hidden scroll-mt-24 md:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Equal-Interval Looping Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-2 block">
              {projectsMeta.tagline || 'SELECTED WORK'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {projectsMeta.title || 'Curated Projects'}
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              {projectsMeta.description || 'Digital systems and client flagship productions delivered with precision.'}
            </p>
          </div>

          {/* Slideshow Controls */}
          {total > 1 && (
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
                className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                title={isPaused ? "Resume slideshow" : "Pause slideshow"}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={prevSlide}
                aria-label="Previous project slide"
                className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next project slide"
                className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Slideshow Card Container */}
        <div 
          className="relative rounded-xl sm:rounded-2xl bg-black/90 border border-zinc-850 p-4 sm:p-8 lg:p-14 overflow-hidden shadow-2xl transition-all duration-500"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          {/* Progress Indicator Line (Equal Interval Timer) */}
          {total > 1 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-900">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Slide Content Grid with Smooth Transition */}
          <div 
            className={`grid lg:grid-cols-12 gap-6 lg:gap-12 items-center transition-opacity duration-300 ${
              isTransitioning ? 'opacity-40' : 'opacity-100'
            }`}
          >
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-6">
              
              <div className="space-y-3 sm:space-y-4">
                {/* Meta row: Index + Category + Status */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-emerald-500/20">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    {currentProject.category}
                  </span>
                  {currentProject.year && (
                    <span className="text-[11px] sm:text-xs font-mono text-zinc-600">
                      / {currentProject.year}
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {currentProject.name}
                </h3>

                {/* Client Reference */}
                {currentProject.client && (
                  <p className="text-xs sm:text-sm font-mono text-zinc-500">
                    Client: <span className="text-zinc-300">{currentProject.client}</span>
                  </p>
                )}

                {/* Narrative Description */}
                <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
                  {currentProject.description || currentProject.shortDescription}
                </p>
              </div>

              {/* Tech Stack Pills */}
              {currentProject.tech && currentProject.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                  {currentProject.tech.map((tag: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons: Direct Project URL entered in Admin CMS */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2 sm:pt-4">
                {currentProject.url ? (
                  <a
                    href={currentProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-colors"
                  >
                    <span>Visit Project</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <a
                    href="#contact"
                    className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-colors"
                  >
                    <span>Discuss Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}

                <a
                  href="#contact"
                  className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 hover:border-zinc-700 font-medium text-[11px] sm:text-xs transition-colors"
                >
                  <span>Request Similar Build</span>
                </a>
              </div>
            </div>

            {/* Right Showcase Preview Frame (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[16/11] w-full rounded-xl bg-zinc-900/90 border border-zinc-800 p-6 flex flex-col justify-between overflow-hidden group">
                
                {/* Visual Glass Accents */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-black pointer-events-none" />
                
                {/* Background Image if available */}
                {currentProject.imageUrl && (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={currentProject.imageUrl}
                      alt={currentProject.name}
                      className="w-full h-full object-cover opacity-35 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  </div>
                )}

                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
                    SYSTEM SPEC // {currentProject.slug}
                  </span>
                </div>

                {/* Center Visual Element */}
                <div className="my-auto py-8 text-center z-10 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 shadow-inner">
                    <Layers className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h4 className="text-white font-bold text-base tracking-wide">
                    {currentProject.name}
                  </h4>
                  <span className="text-zinc-400 text-xs font-mono mt-1">
                    {currentProject.category}
                  </span>
                </div>

                {/* Bottom Spec Footer */}
                <div className="flex items-center justify-between z-10 text-[11px] font-mono text-zinc-400 border-t border-zinc-800/80 pt-3 bg-black/40 px-2 -mx-2 -mb-2 rounded-b">
                  <span>STATUS: {currentProject.status}</span>
                  <span className="text-emerald-400 font-bold">VERIFIED DELIVERABLE</span>
                </div>
              </div>
            </div>

          </div>

          {/* Dot Pagination for Looping Slideshow */}
          {total > 1 && (
            <div className="flex items-center justify-center space-x-2.5 mt-8 pt-6 border-t border-zinc-900">
              {projects.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => goToSlide(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-2 rounded-md transition-all duration-300 ${
                    dotIdx === currentIndex
                      ? 'w-8 bg-emerald-400'
                      : 'w-2 bg-zinc-800 hover:bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
