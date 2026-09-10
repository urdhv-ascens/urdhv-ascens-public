'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import contentData from "@/data/content.json";
import { getLiveContent } from "@/lib/api-client";

interface HeroProps {
  onOpenCourseModal?: () => void;
}

export function Hero({ onOpenCourseModal }: HeroProps) {
  const [heroContent, setHeroContent] = useState(contentData.hero);

  useEffect(() => {
    async function loadLive() {
      try {
        const live = await getLiveContent();
        if (live?.hero) {
          setHeroContent((prev) => ({ ...prev, ...live.hero }));
        }
      } catch (err) {
        console.warn("Using local hero content fallback:", err);
      }
    }
    loadLive();
  }, []);

  const bgImage = heroContent.backgroundImage || '/assets/images/favicon.png';
  const blurAmount = heroContent.backgroundBlur ?? 32;
  const opacityVal = (heroContent.backgroundOpacity ?? 20) / 100;

  return (
    <section className="min-h-[85vh] flex items-center justify-center pt-24 pb-16 relative overflow-hidden bg-black text-white">
      {/* Blurred background image - editable through Admin Panel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 flex items-center justify-center">
        <div
          className="w-[480px] sm:w-[680px] md:w-[880px] aspect-square bg-center bg-no-repeat bg-contain transition-all duration-700 pointer-events-none select-none"
          style={{
            backgroundImage: `url('${bgImage}')`,
            filter: `blur(${blurAmount}px)`,
            opacity: opacityVal,
            transform: 'scale(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>
      
      <div className="container mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm">
            {heroContent.tagline || 'ACCEPTING LIMITED PROJECTS'}
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] mb-6 max-w-5xl text-white uppercase">
          {heroContent.title || 'DESIGNED TO DISTINGUISH'}
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-3xl mb-10 leading-relaxed font-normal">
          {heroContent.description || 'We craft bespoke digital experiences for brands that refuse to blend in. Precision engineered. Distinctly elevated.'}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Free Course Entry Modal Trigger */}
          <button
            onClick={onOpenCourseModal}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Access AI Courses (Free)</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <Link 
            href="#contact" 
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-semibold text-sm transition-all hover:border-zinc-700"
          >
            Discuss a Project
          </Link>

          <Link 
            href="#projects" 
            className="w-full sm:w-auto px-6 py-4 rounded-lg text-zinc-400 hover:text-emerald-400 font-medium text-sm transition-colors"
          >
            Explore Work ↓
          </Link>
        </div>
      </div>
    </section>
  );
}
