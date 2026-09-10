import { useCMSContent } from "@/core/CMSContentContext";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";

export function About() {
  const { content } = useCMSContent();
  const about = content.about || {
    category: "The Philosophy",
    title: "Evolving the Standard of Digital Presence.",
    description: "",
    imageUrl: "/assets/images/About-Us.webp",
    badges: {
      badge1: "STUDIO PHILOSOPHY",
      badge2: "DIGITAL ARCHITECTURE",
      badge3: "EST. 2026"
    },
    stats: [
      { value: "24+", label: "Enterprise Projects" },
      { value: "100%", label: "Client Retention" },
      { value: "9", label: "Core Disciplines" }
    ]
  };

  const badge1 = about.badges?.badge1 || "STUDIO PHILOSOPHY";
  const badge2 = about.badges?.badge2 || "DIGITAL ARCHITECTURE";
  const badge3 = about.badges?.badge3 || "EST. 2026";
  const statsList = Array.isArray(about.stats) && about.stats.length > 0 ? about.stats : [
    { value: "24+", label: "Enterprise Projects" },
    { value: "100%", label: "Client Retention" },
    { value: "9", label: "Core Disciplines" }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-black border-b border-zinc-900 text-white scroll-mt-24 md:scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column: Philosophy Copy + Compact Counters Below */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <span className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-2 sm:mb-3 block">
                {about.category || "The Philosophy"}
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 sm:mb-6">
                {about.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl">
                {(about.description || '').replace(/—/g, '-')}
              </p>
            </div>

            {/* Compact Counters Grid (Below Content) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-5 sm:pt-6 border-t border-zinc-900">
              {statsList.map((stat, index) => (
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
          
          {/* Right Column: Mascot & Studio Imagery Showcase */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none flex flex-col items-center">
            <div className="relative w-full rounded-2xl border border-zinc-800/90 bg-zinc-950/90 hover:border-emerald-500/40 transition-all duration-500 shadow-2xl p-3 sm:p-4 group flex flex-col items-center backdrop-blur-sm">
              
              {/* Studio Card Header */}
              <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-zinc-850/80 px-1 text-[11px] font-mono">
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold tracking-wider text-emerald-400 uppercase">{badge1}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400">
                  ŪRDHV ARCHITECTURE
                </span>
              </div>

              {/* Artwork Container: Pristine, uncropped display */}
              <div className="relative w-full aspect-[960/805] max-h-[460px] rounded-xl overflow-hidden bg-black flex items-center justify-center border border-zinc-900">
                <img
                  src={about.imageUrl || "/assets/images/About-Us.webp"}
                  alt="Ūrdhv Ascens Studio Mascot & Digital Architecture"
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-700 select-none"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (!img.src.includes('About-Us.webp')) {
                      img.src = '/assets/images/About-Us.webp';
                    } else if (!img.src.includes('about-us.webp')) {
                      img.src = '/assets/images/about-us.webp';
                    } else {
                      img.src = '/assets/images/favicon.webp';
                    }
                  }}
                />
              </div>

              {/* Studio Card Badges Footer */}
              <div className="w-full pt-3 mt-3 border-t border-zinc-850/80 flex items-center justify-between gap-2 px-1 text-[10px] sm:text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                  {badge2}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-emerald-400 font-bold">
                  {badge3}
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
