import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Ūrdhv Ascens',
  description: 'Terms of service governing studio engagements, intellectual property, and educational booklet access.'
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Studio Flagship</span>
        </Link>

        <div className="border-b border-zinc-800 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Effective Date: September 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2">
            Standard contractual guidelines for studio clients and educational curriculum users.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Studio Engagements</h2>
            <p>
              Ūrdhv Ascens delivers bespoke digital design, software engineering, visual identity systems, and video production services. Project timelines, deliverables, and payment milestones are governed by individual client Statement of Work (SOW) agreements.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Educational Curriculum & Intellectual Property</h2>
            <p>
              All visual courses, manuals, and booklets hosted on the Ūrdhv Ascens Viewer platform are the copyrighted intellectual property of Ūrdhv Ascens. They are made freely accessible for personal, non-commercial educational reading.
            </p>
            <p>
              Reproduction, redistribution, scraping, mass mirroring, or commercial resale of booklet pages or graphics without express written authorization is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Governing Jurisdiction</h2>
            <p>
              These Terms and any dispute arising from them shall be governed by and construed in accordance with the laws of India, with exclusive jurisdiction in the courts of Bikaner, Rajasthan.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
