'use client';

import React from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  tagline: string;
  deliverables: string[];
  isPopular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'flagship',
    name: 'Essential Digital Flagship',
    price: '₹24,999',
    period: 'one-time',
    tagline: 'Ideal for emerging brands commanding high-converting visual prestige.',
    deliverables: [
      'Bespoke 5-page responsive architecture',
      'Next.js 16 + React 19 high-performance stack',
      'Hostinger dynamic API CMS integration',
      'Full technical SEO & Core Web Vitals audit',
      'Custom micro-animations & dark mode'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Web Application',
    price: '₹49,999',
    period: 'starting',
    isPopular: true,
    tagline: 'Full-stack bespoke web platforms built for scale, speed, and complex data.',
    deliverables: [
      'Custom multi-portal or dashboard architecture',
      'Role-based admin control plane & auth',
      'Cloudflare edge CDN & caching configuration',
      'Real-time database integration & atomic storage',
      'Dedicated staging preview & QA testing matrix'
    ]
  },
  {
    id: 'brand',
    name: 'Visual Brand Identity System',
    price: '₹19,999',
    period: 'one-time',
    tagline: 'Meticulously crafted brand systems that establish instant market authority.',
    deliverables: [
      'Vector logo system (Primary, secondary, marks)',
      'Curated typography & color token architecture',
      'Complete brand guideline handbook (PDF)',
      'Stationery, digital collateral & social kits',
      'Full commercial IP transfer'
    ]
  },
  {
    id: 'content',
    name: 'Studio Content Production',
    price: '₹14,999',
    period: '/ month',
    tagline: 'End-to-end video editing, motion graphics, and visual storytelling.',
    deliverables: [
      '8 cinematic short-form / showreel videos',
      'Professional color grading & audio mastering',
      'Custom motion typography & captions',
      'Fast 48-hour turnarounds',
      'Multi-platform optimization (Reels, X, LinkedIn)'
    ]
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-black border-t border-zinc-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-amber-400 mb-4 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Engagements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Studio Investment Tiers.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Every engagement is engineered for measurable distinction. All pricing in INR (₹)
            with zero hidden surprises.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                tier.isPopular
                  ? 'bg-zinc-950 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10'
                  : 'bg-zinc-950/60 border border-zinc-850 hover:border-zinc-750'
              }`}
            >
              {tier.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                  Most Requested
                </span>
              )}

              <div>
                <h3 className="text-base font-bold text-white mb-1">{tier.name}</h3>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed min-h-[36px]">{tier.tagline}</p>

                <div className="flex items-baseline space-x-1 mb-6 pb-6 border-b border-zinc-850">
                  <span className="text-3xl font-black text-white tracking-tight">{tier.price}</span>
                  {tier.period && (
                    <span className="text-xs text-zinc-500 font-mono">{tier.period}</span>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Inclusions
                  </span>
                  {tier.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start space-x-2.5 text-xs text-zinc-300">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="#contact"
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                  tier.isPopular
                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/10'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800'
                }`}
              >
                <span>Initiate Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
