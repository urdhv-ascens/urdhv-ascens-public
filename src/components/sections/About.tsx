'use client';

import contentData from "@/data/content.json";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";

export function About() {
  const { about } = contentData;

  return (
    <section id="about" className="py-24 bg-black border-b border-zinc-900 text-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-3 block">
              The Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
              {about.title}
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl">
              {about.description.replace(/—/g, '-')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {about.stats.map((stat, index) => (
              <div 
                key={index} 
                className="flex flex-col gap-2 p-6 sm:p-8 bg-zinc-950 border border-zinc-850 hover:border-emerald-500/30 rounded-xl transition-all"
              >
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
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
