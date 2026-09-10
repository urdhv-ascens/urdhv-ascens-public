import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Ūrdhv Ascens',
  description: 'Our privacy standards, visitor data protection policy, and learning progress logging practices.'
};

export default function PrivacyPolicyPage() {
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
            <Shield className="w-3.5 h-3.5" />
            <span>Effective Date: September 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2">
            Ūrdhv Ascens is committed to absolute data transparency and responsible privacy practices.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Scope and Commitment</h2>
            <p>
              This Privacy Policy explains how Ūrdhv Ascens ("we", "us", "our") collects, uses, and safeguards information when you visit our website (urdhvascens.com) or access our free educational course booklets through the Ūrdhv Ascens Viewer platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
            <p>
              When entering our educational learning courses, we request your name, contact information (email or phone number), role (Student, Educator, Professional), and optional institutional affiliation. We collect this data strictly on an opt-in basis with your explicit consent checkbox.
            </p>
            <p>
              We additionally log cryptographic hashes of incoming IP addresses (SHA-256 salted) to prevent automated rate-limit abuse and safeguard edge CDN bandwidth. We do not store raw IP addresses alongside personal identities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Educational Booklet Access</h2>
            <p>
              All course booklets are completely free of charge. We do not process payments, collect banking details, or request payment card credentials for curriculum access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Third-Party Edge Delivery</h2>
            <p>
              Static booklet assets (WebP images) are cached and distributed globally via Cloudflare Pages edge nodes. Cloudflare may process network telemetry in accordance with their standard enterprise privacy and security protocols.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">5. Your Data Rights</h2>
            <p>
              You have the right to request deletion of your reader record at any time. Simply send an email to <a href="mailto:urdhvascens@gmail.com" className="text-amber-400 hover:underline">urdhvascens@gmail.com</a> with the subject "Data Removal Request", and we will purge your details within 48 hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
