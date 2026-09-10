'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCMSContent } from '@/core/CMSContentContext';

const DEFAULT_NAV_LINKS = [
  { label: 'Capabilities', href: '/#capabilities' },
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#projects' },
  { label: 'Contact', href: '/#contact' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useCMSContent();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = content.navigation?.links?.length ? content.navigation.links : DEFAULT_NAV_LINKS;
  const brandTitle = content.navigation?.brandTitle || content.siteSettings?.companyName || 'ŪRDHV ASCENS';
  const logoUrl = content.navigation?.logoUrl || content.siteSettings?.logoUrl || '/logo.png';
  const viewerUrl = content.siteSettings?.viewerUrl || 'https://urdhv-viewer.pages.dev';
  const courseBtn = content.navigation?.courseButton || { text: 'AI Courses (Free)', href: viewerUrl };
  const ctaBtn = content.navigation?.ctaButton || { text: 'Discuss Project', href: '/#contact' };

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent',
        isScrolled
          ? 'bg-black border-zinc-850 py-3.5 shadow-xl shadow-black/50'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src={logoUrl} alt={brandTitle} className="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
          <span className="text-xl sm:text-2xl font-black tracking-widest uppercase text-white">
            {brandTitle.includes(' ') ? (
              <>
                {brandTitle.split(' ')[0]} <span className="text-emerald-400">{brandTitle.split(' ').slice(1).join(' ')}</span>
              </>
            ) : (
              <span className="text-emerald-400">{brandTitle}</span>
            )}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {courseBtn?.text && (
            <a
              href={courseBtn.href || viewerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <Sparkles className="w-3 h-3" />
              <span>{courseBtn.text}</span>
            </a>
          )}

          {ctaBtn?.text && (
            <Link
              href={ctaBtn.href || '/#contact'}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-400 text-black rounded-lg hover:bg-emerald-300 transition-colors"
            >
              {ctaBtn.text}
            </Link>
          )}
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-white hover:text-emerald-400 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-b border-zinc-800 shadow-2xl py-6 px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold uppercase tracking-wider py-2 border-b border-zinc-850 text-zinc-300 hover:text-emerald-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {courseBtn?.text && (
            <a
              href={courseBtn.href || viewerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold uppercase tracking-wider py-2 text-emerald-400 flex items-center space-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className="w-4 h-4" />
              <span>{courseBtn.text}</span>
            </a>
          )}
          {ctaBtn?.text && (
            <Link
              href={ctaBtn.href || '/#contact'}
              className="mt-2 px-6 py-3 text-center text-xs font-bold uppercase tracking-wider bg-emerald-400 text-black rounded-lg hover:bg-emerald-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {ctaBtn.text}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
