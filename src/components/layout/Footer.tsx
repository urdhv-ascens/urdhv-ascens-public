import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-zinc-900 text-white py-14 md:py-18">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-12">
        
        <div className="flex flex-col max-w-sm gap-4">
          <Link href="/" className="text-2xl font-black tracking-widest uppercase">
            ŪRDHV <span className="text-amber-400">ASCENS</span>
          </Link>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            A bespoke digital studio for brands that refuse to blend in.
            Precision engineered. Distinctly elevated.
          </p>
          <span className="text-[11px] font-mono text-zinc-600">
            Based in India • Serving Select Global Engagements
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Studio</h4>
            <Link href="/#about" className="text-xs text-zinc-400 hover:text-white transition-colors">About Us</Link>
            <Link href="/#capabilities" className="text-xs text-zinc-400 hover:text-white transition-colors">Capabilities</Link>
            <Link href="/#services" className="text-xs text-zinc-400 hover:text-white transition-colors">Services</Link>
            <Link href="/#projects" className="text-xs text-zinc-400 hover:text-white transition-colors">Selected Work</Link>
            <Link href="/#pricing" className="text-xs text-zinc-400 hover:text-white transition-colors">Pricing Plans</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Curriculum</h4>
            <a href="https://viewer.urdhvascens.com?course=students-ai" target="_blank" rel="noopener noreferrer" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">Students AI Track</a>
            <a href="https://viewer.urdhvascens.com?course=teachers-ai" target="_blank" rel="noopener noreferrer" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">Teachers AI Toolkit</a>
            <a href="https://viewer.urdhvascens.com" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-white transition-colors">Booklet Library</a>
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
            <a href="mailto:urdhvascens@gmail.com" className="text-xs text-zinc-400 hover:text-amber-400 transition-colors font-mono">
              urdhvascens@gmail.com
            </a>
            <p className="text-xs text-zinc-400 font-mono">+91 7891085020</p>
            <p className="text-xs text-zinc-400 font-mono">+91 80037 53540</p>
          </div>
        </div>

      </div>
      
      <div className="container mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
        <p>
          &copy; {currentYear} ŪRDHV ASCENS. All visual identities and course frameworks reserved.
        </p>
        <p className="font-mono text-[11px] text-zinc-600">
          Engineered on Cloudflare Pages Edge CDN & Hostinger Dynamic Storage
        </p>
      </div>
    </footer>
  );
}
