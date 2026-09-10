'use client';

import { useState, useEffect } from "react";
import contentData from "@/data/content.json";
import { getLiveContent } from "@/lib/api-client";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";

export function About() {
  const [about, setAbout] = useState(contentData.about);

  useEffect(() => {
    async function loadLive() {
      try {
        const live = await getLiveContent();
        if (live?.about) {
          setAbout((prev) => ({ ...prev, ...live.about }));
        }
      } catch (err) {
        console.warn("Using local about fallback:", err);
      }
    }
    loadLive();
  }, []);

  return (
    <section id="about" className="py-16 sm:py-24 bg-black border-b border-zinc-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column: Philosophy Copy + Compact Counters Below */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <span className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-2 sm:mb-3 block">
                The Philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 sm:mb-6">
                {about.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl">
                {about.description.replace(/—/g, '-')}
              </p>
            </div>

            {/* Compact Counters Grid (Below Content) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-5 sm:pt-6 border-t border-zinc-900">
              {about.stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="p-2.5 sm:p-4 bg-zinc-950/90 border border-zinc-850 hover:border-emerald-500/40 rounded-xl transition-colors flex flex-col justify-between"
                >
                  <span className="text-base sm:text-2xl lg:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[9px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1 sm:mt-1.5 leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column: Image Holder where the counters were */}
          <div className="relative w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-850 bg-zinc-950 group shadow-2xl">
              <img
                src={(about as any).imageUrl || "/assets/images/about-graphic.png"}
                alt="Ūrdhv Ascens Studio Philosophy & Digital Architecture"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/favicon.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Aesthetic Badges */}
              <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 flex items-center space-x-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-black border border-zinc-800 text-[9px] sm:text-[10px] font-mono font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>STUDIO PHILOSOPHY</span>
              </div>

              <div className="absolute bottom-2.5 sm:bottom-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400">
                <span className="px-1.5 sm:px-2 py-0.5 rounded bg-black border border-zinc-800">
                  DIGITAL ARCHITECTURE
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded bg-black border border-zinc-800 text-emerald-400">
                  EST. 2026
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Presentation (Only if enabled with real video) */}
        {about.video?.enabled && about.video?.videoId && (
          <div className="w-full max-w-5xl mx-auto mt-16">
            <YouTubeEmbed 
              videoId={about.video.videoId}
              title={about.video.title || "Ūrdhv Ascens Showreel"} 
            />
          </div>
        )}
      </div>
    </section>
  );
}
