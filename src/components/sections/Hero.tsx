import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import contentData from "@/data/content.json";

interface HeroProps {
  onOpenCourseModal?: () => void;
}

export function Hero({ onOpenCourseModal }: HeroProps) {
  const { hero } = contentData;

  return (
    <section className="min-h-[85vh] flex items-center justify-center pt-24 pb-16 relative overflow-hidden bg-black text-white">
      {/* Background abstract radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm">
            {hero.tagline || 'ACCEPTING LIMITED PROJECTS'}
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] mb-6 max-w-5xl text-white uppercase">
          {hero.title || 'DESIGNED TO DISTINGUISH'}
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-3xl mb-10 leading-relaxed font-normal">
          {hero.description || 'We craft bespoke digital experiences for brands that refuse to blend in. Precision engineered. Distinctly elevated.'}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Free Course Entry Modal Trigger */}
          <button
            onClick={onOpenCourseModal}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm uppercase tracking-wider transition-all hover:scale-105 shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Access AI Courses (Free)</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <Link 
            href="#contact" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-semibold text-sm transition-all hover:border-zinc-700"
          >
            Discuss a Project
          </Link>

          <Link 
            href="#projects" 
            className="w-full sm:w-auto px-6 py-4 rounded-full text-zinc-400 hover:text-white font-medium text-sm transition-colors"
          >
            Explore Work ↓
          </Link>
        </div>
      </div>
    </section>
  );
}
