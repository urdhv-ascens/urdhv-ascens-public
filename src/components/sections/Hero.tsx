'use client';

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { useCMSContent } from "@/core/CMSContentContext";

interface HeroProps {
  onOpenCourseModal?: () => void;
}

export function Hero({ onOpenCourseModal }: HeroProps) {
  const { content } = useCMSContent();
  const heroContent = content.hero || {};

  const bgImage = heroContent.backgroundImage || '/assets/images/hero-bg.webp';
  const blurAmount = heroContent.backgroundBlur ?? 4;
  const opacityVal = (heroContent.backgroundOpacity ?? 55) / 100;

  const primaryCtaText = heroContent.primaryCtaText || 'Access AI Courses (Free)';
  const primaryCtaLink = heroContent.primaryCtaLink || 'https://urdhv-viewer.pages.dev';
  const primaryCtaAction = heroContent.primaryCtaAction || 'modal';
  const secondaryCtaText = heroContent.secondaryCtaText || 'Discuss a Project';
  const secondaryCtaLink = heroContent.secondaryCtaLink || '#contact';

  const handlePrimaryClick = (e: React.MouseEvent) => {
    const isRegistered = typeof window !== 'undefined' && localStorage.getItem('urdhv_reader_registered') === 'true';
    if (isRegistered) {
      window.location.href = primaryCtaLink;
      return;
    }
    if (primaryCtaAction === 'modal' && onOpenCourseModal) {
      e.preventDefault();
      onOpenCourseModal();
    }
  };

  return (
    <section className="min-h-[85vh] flex items-center justify-center pt-24 pb-16 relative overflow-hidden bg-black text-white">
      {/* Background canvas - full-bleed, clearly visible and atmospheric */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 pointer-events-none select-none"
          style={{
            backgroundImage: `url('${bgImage}')`,
            filter: `blur(${blurAmount}px)`,
            opacity: opacityVal,
            transform: 'scale(1.05)',
          }}
        />
        {/* Subtle dark vignette overlay so typography remains razor sharp while art is vividly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black pointer-events-none" />
      </div>
      
      <div className="container mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm">
            {heroContent.tagline || 'ACCEPTING LIMITED PROJECTS'}
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.08] sm:leading-[1.05] mb-6 max-w-5xl text-white">
          {heroContent.title || 'We help you to Ascend.'}
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-3xl mb-10 leading-relaxed font-normal">
          {heroContent.description || 'We craft bespoke digital experiences for brands that refuse to blend in. Precision engineered. Distinctly elevated.'}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Primary CTA (Free Course Entry Modal or Direct Link) */}
          {primaryCtaAction === 'modal' ? (
            <button
              onClick={handlePrimaryClick}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-sm uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <a
              href={primaryCtaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-sm uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          )}

          <Link 
            href={secondaryCtaLink} 
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-semibold text-sm transition-all hover:border-zinc-700"
          >
            {secondaryCtaText}
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
