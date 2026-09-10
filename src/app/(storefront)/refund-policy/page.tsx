import Link from 'next/link';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

export const metadata = {
  title: 'Cancellation & Refund Policy | Ūrdhv Ascens',
  description: 'Cancellation, revision, and refund policies for Ūrdhv Ascens bespoke studio services.'
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Studio Flagship</span>
        </Link>

        <div className="border-b border-zinc-800 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono mb-3">
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Effective Date: September 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2">
            Clear guidelines on milestone payments, revisions, and project cancellations.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Bespoke Services Nature</h2>
            <p>
              Ūrdhv Ascens provides custom digital engineering, design, and production services tailored specifically to each client. Due to the high time investment required at project commencement, initial booking deposits are non-refundable once architectural work begins.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Revisions and Quality Assurance</h2>
            <p>
              Every package includes defined rounds of revision (typically 2 to 3 iterations per milestone) to ensure your complete satisfaction prior to final delivery and code deployment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Educational Materials</h2>
            <p>
              Educational course booklets on the Viewer platform are distributed 100% free of charge and therefore require no payment or refund considerations.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
