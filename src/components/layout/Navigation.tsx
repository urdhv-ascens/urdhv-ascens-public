'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Capabilities', href: '/#capabilities' },
    { label: 'Services', href: '/#services' },
    { label: 'Work', href: '/#projects' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent',
        isScrolled
          ? 'bg-black/90 backdrop-blur-md border-zinc-800/80 py-3.5 shadow-xl'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-black tracking-widest uppercase text-white">
          ŪRDHV <span className="text-amber-400">ASCENS</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <a
            href="https://viewer.urdhvascens.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Courses (Free)</span>
          </a>

          <Link
            href="/#contact"
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-amber-500 text-black rounded-full hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10"
          >
            Discuss Project
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-zinc-800 backdrop-blur-xl shadow-2xl py-6 px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold uppercase tracking-wider py-2 border-b border-zinc-850 text-zinc-300 hover:text-amber-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://viewer.urdhvascens.com"
            className="text-sm font-semibold uppercase tracking-wider py-2 text-amber-400 flex items-center space-x-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Courses Library</span>
          </a>
          <Link
            href="/#contact"
            className="mt-2 px-6 py-3 text-center text-xs font-bold uppercase tracking-wider bg-amber-500 text-black rounded-full"
            onClick={() => setMobileMenuOpen(false)}
          >
            Discuss Project
          </Link>
        </div>
      )}
    </header>
  );
}
