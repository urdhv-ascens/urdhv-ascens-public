'use client';

import React from 'react';
import Link from 'next/link';
import { useCMSContent } from '@/core/CMSContentContext';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { content } = useCMSContent();

  const brandTitle = content.navigation?.brandTitle || 'ŪRDHV ASCENS';
  const logoUrl = content.navigation?.logoUrl || '/logo.webp';
  const footerConfig = content.footer || {};
  const contact = content.contact || {};
  const viewerBase = content.siteSettings?.viewerUrl || 'https://urdhv-viewer.pages.dev';

  const description = footerConfig.description || 'A bespoke digital studio for brands that refuse to blend in. Precision engineered. Distinctly elevated.';
  const locationNote = footerConfig.locationNote || 'Based in India / Serving Select Global Engagements';
  const copyrightText = footerConfig.copyrightText || `© ${currentYear} ŪRDHV ASCENS. All visual identities and course frameworks reserved.`;
  const creditText = footerConfig.creditText || 'Architected by Ūrdhv Ascens • Digital Design & Engineering Studio';

  const email = contact.email || 'urdhvascens@gmail.com';
  const phone = contact.phone || '+91 7891085020';
  const secondaryPhone = contact.secondaryPhone || '+91 80037 53540';

  const socials = footerConfig.socialLinks || {};

  return (
    <footer className="bg-black border-t border-zinc-900 text-white py-14 md:py-18">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-12">
        
        <div className="flex flex-col max-w-sm gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <img src={logoUrl} alt={brandTitle} className="h-8 w-auto object-contain" />
            <span className="text-2xl font-black tracking-widest uppercase">
              {brandTitle.includes(' ') ? (
                <>
                  {brandTitle.substring(0, brandTitle.indexOf(' '))} <span className="text-emerald-400">{brandTitle.substring(brandTitle.indexOf(' ') + 1)}</span>
                </>
              ) : (
                brandTitle
              )}
            </span>
          </Link>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            {description}
          </p>
          <span className="text-[11px] font-mono text-zinc-600">
            {locationNote}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Studio</h4>
            <Link href="/#about" className="text-xs text-zinc-400 hover:text-white transition-colors">About Us</Link>
            <Link href="/#capabilities" className="text-xs text-zinc-400 hover:text-white transition-colors">Capabilities</Link>
            <Link href="/#services" className="text-xs text-zinc-400 hover:text-white transition-colors">Services</Link>
            <Link href="/#projects" className="text-xs text-zinc-400 hover:text-white transition-colors">Selected Work</Link>
            <Link href="/#contact" className="text-xs text-zinc-400 hover:text-white transition-colors">Contact</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Curriculum</h4>
            <a href={`${viewerBase}?course=students-ai`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Students AI Track</a>
            <a href={`${viewerBase}?course=teachers-ai`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Teachers AI Toolkit</a>
            <a href={viewerBase} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-white transition-colors">Booklet Library</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Legal & Trust</h4>
            <Link href="/privacy" className="text-xs text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-zinc-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="text-xs text-zinc-400 hover:text-white transition-colors">Cancellation & Refund</Link>
            <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono">Control Plane</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Direct Contact</h4>
            <a href={`mailto:${email}`} className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors font-mono">
              {email}
            </a>
            <p className="text-xs text-zinc-400 font-mono">{phone}</p>
            {secondaryPhone && (
              <p className="text-xs text-zinc-400 font-mono">{secondaryPhone}</p>
            )}
            
            {/* Optional Social Presence Links */}
            {(socials.twitter || socials.linkedin || socials.instagram || socials.github || socials.whatsapp) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-900">
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white text-[11px] font-mono">Twitter</a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white text-[11px] font-mono">LinkedIn</a>
                )}
                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white text-[11px] font-mono">Instagram</a>
                )}
                {socials.github && (
                  <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white text-[11px] font-mono">GitHub</a>
                )}
                {socials.whatsapp && (
                  <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-400 text-[11px] font-mono">WhatsApp</a>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
      
      <div className="container mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
        <p>
          {copyrightText}
        </p>
        <p className="font-mono text-[11px] text-zinc-600">
          {creditText}
        </p>
      </div>
    </footer>
  );
}
