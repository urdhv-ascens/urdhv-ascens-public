'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, FileText, RefreshCcw } from 'lucide-react';
import { useCMSContent } from '@/core/CMSContentContext';
import contentData from '@/data/content.json';
import type { LegalPageContent } from '@/core/types';

interface LegalContentProps {
  policyKey: 'privacyPolicy' | 'termsAndConditions' | 'refundPolicy';
  iconType: 'shield' | 'file' | 'refresh';
}

export function LegalContent({ policyKey, iconType }: LegalContentProps) {
  const { content } = useCMSContent();

  const rawLegal = content.legal || (contentData as any).legal || {};
  const legalConfig = (rawLegal[policyKey] || 
    (policyKey === 'privacyPolicy' ? (rawLegal.privacy || rawLegal.privacyPolicy) :
     policyKey === 'termsAndConditions' ? (rawLegal.terms || rawLegal.termsAndConditions) :
     rawLegal.refundPolicy)) as (LegalPageContent & { description?: string; effectiveDate?: string });

  const title = legalConfig?.title || (
    policyKey === 'privacyPolicy' ? 'Privacy Policy' :
    policyKey === 'termsAndConditions' ? 'Terms of Service' :
    'Cancellation & Refund Policy'
  );

  const lastUpdated = legalConfig?.lastUpdated || legalConfig?.effectiveDate || 'Effective Date: September 2026';
  const description = (legalConfig as any)?.description || (legalConfig as any)?.subtitle || 'Comprehensive enterprise legal framework and operating covenants.';
  const sections = legalConfig?.sections || [];

  const Icon = iconType === 'shield' ? Shield : iconType === 'file' ? FileText : RefreshCcw;

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
            <Icon className="w-3.5 h-3.5" />
            <span>{lastUpdated}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-zinc-400 text-xs sm:text-sm mt-2">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          {sections.map((section, idx) => (
            <section key={idx} className="space-y-2">
              <h2 className="text-lg font-bold text-white">
                {section.heading}
              </h2>
              <div 
                className="text-zinc-300 space-y-2 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: section.content.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>') 
                }} 
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
