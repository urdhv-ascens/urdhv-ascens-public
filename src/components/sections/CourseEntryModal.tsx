'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { registerReader } from '@/lib/api-client';
import { useCMSContent } from '@/core/CMSContentContext';

interface CourseEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: 'students-ai' | 'teachers-ai';
}

export function CourseEntryModal({
  isOpen,
  onClose,
  defaultCourse = 'students-ai'
}: CourseEntryModalProps) {
  const { content } = useCMSContent();
  const viewerBase = content.siteSettings?.viewerUrl || process.env.NEXT_PUBLIC_VIEWER_URL || 'https://urdhv-viewer.pages.dev';

  const [courseSelected, setCourseSelected] = useState<'students-ai' | 'teachers-ai'>(defaultCourse);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [ageGroup, setAgeGroup] = useState('18-24');
  const [industry, setIndustry] = useState('Software, IT & Tech Development');
  const [intent, setIntent] = useState('AI & Automation Copilots / Prompt Engineering');
  const [role, setRole] = useState('Individual Learner');
  const [affiliation, setAffiliation] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const navigateToViewer = () => {
    const targetUrl = `${viewerBase}?course=${courseSelected}`;
    window.location.href = targetUrl;
  };

  // ONE-TIME FORM CHECK:
  // If the visitor has already completed the mandatory registration in this browser,
  // immediately route them directly to the curriculum viewer without showing the form again.
  useEffect(() => {
    if (isOpen) {
      const isAlreadyRegistered = typeof window !== 'undefined' && localStorage.getItem('urdhv_reader_registered') === 'true';
      if (isAlreadyRegistered) {
        navigateToViewer();
      }
    }
  }, [isOpen, courseSelected]);

  if (!isOpen) return null;

  // Double-check if already registered to prevent any flash of modal
  if (typeof window !== 'undefined' && localStorage.getItem('urdhv_reader_registered') === 'true') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Strict validation: every targeted demographic & advertising data point is compulsory
    if (!name.trim()) {
      setValidationError('Full Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('A valid Email Address is required.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setValidationError('A valid WhatsApp or Mobile Number is required.');
      return;
    }
    if (!city.trim()) {
      setValidationError('City and State/Region are required.');
      return;
    }
    if (!affiliation.trim()) {
      setValidationError('School, College, or Workplace Organization is required.');
      return;
    }
    if (!consentGiven) {
      setValidationError('You must agree to the portal terms to activate your access.');
      return;
    }

    setLoading(true);

    try {
      const res = await registerReader({
        name: name.trim(),
        contact: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        ageGroup,
        industry,
        intent,
        role,
        institution: affiliation.trim(),
        courseSelected,
        consentGiven: true
      });

      // Mark this browser as permanently registered (one-time requirement)
      localStorage.setItem('urdhv_reader_registered', 'true');
      localStorage.setItem('urdhv_reader_name', name.trim());
      localStorage.setItem('urdhv_reader_email', email.trim());
      localStorage.setItem('urdhv_reader_phone', phone.trim());
      if (res && res.readerId) {
        localStorage.setItem('urdhv_reader_id', res.readerId);
      }
    } catch (err) {
      console.warn('Registration network fallback:', err);
      // Still persist one-time registered flag locally so user isn't trapped if offline
      localStorage.setItem('urdhv_reader_registered', 'true');
      localStorage.setItem('urdhv_reader_name', name.trim());
      localStorage.setItem('urdhv_reader_email', email.trim());
    } finally {
      setLoading(false);
      navigateToViewer();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3 h-3" />
            <span>One-Time Learning Portal Activation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Ūrdhv Ascens Learning Portal
          </h2>
          <p className="text-zinc-400 text-xs mt-1 max-w-md mx-auto">
            Complete this one-time reader registration to unlock instant access to all 12 visual curriculum booklets.
          </p>
        </div>

        {validationError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-xs text-red-400 flex items-center space-x-2">
            <Lock className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Targeted Demographic & Ad-Relevant Profile Fields (Compulsory) */}
          <div className="space-y-3 pt-1">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Full Name</span>
                <span className="text-[10px] text-emerald-400 font-mono">* Required</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full legal name"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span>Email Address</span>
                  <span className="text-[10px] text-emerald-400 font-mono">* Required</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span>WhatsApp / Phone</span>
                  <span className="text-[10px] text-emerald-400 font-mono">* Required</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* City & Age Bracket */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span>City & State / Region</span>
                  <span className="text-[10px] text-emerald-400 font-mono">* Required</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Jaipur, Rajasthan"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span>Age Group</span>
                  <span className="text-[10px] text-emerald-400 font-mono">* Required</span>
                </label>
                <select
                  required
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="18-24">18 - 24 (College / Emerging Professional)</option>
                  <option value="25-34">25 - 34 (Young Professional / Tech Specialist)</option>
                  <option value="35-44">35 - 44 (Mid-Career / Manager / Enterprise)</option>
                  <option value="45+">45+ (Executive / Senior Professional / Lifelong)</option>
                  <option value="Under 18">Under 18 (School Student)</option>
                </select>
              </div>
            </div>

            {/* Industry & Primary Interest */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span>Industry / Sector</span>
                  <span className="text-[10px] text-emerald-400 font-mono">* Required</span>
                </label>
                <select
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Software, IT & Tech Development">Software, IT & Tech Development</option>
                  <option value="Education, Academic & Teaching">Education, Academic & Teaching</option>
                  <option value="Business Owner / E-Commerce / Retail">Business Owner / E-Commerce / Retail</option>
                  <option value="Banking, Finance & Fintech">Banking, Finance & Fintech</option>
                  <option value="Design, Media & Digital Marketing">Design, Media & Digital Marketing</option>
                  <option value="Engineering & Manufacturing">Engineering & Manufacturing</option>
                  <option value="Student (Higher Education)">Student (Higher Education)</option>
                  <option value="Other Professional Services">Other Professional Services</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span>Primary Tech Interest</span>
                  <span className="text-[10px] text-emerald-400 font-mono">* Required</span>
                </label>
                <select
                  required
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="AI & Automation Copilots / Prompt Engineering">AI & Automation Copilots / LLMs</option>
                  <option value="Web & Mobile Full-Stack Architecture">Web & Mobile Full-Stack Architecture</option>
                  <option value="Digital Marketing & Growth Funnels">Digital Marketing & Growth Funnels</option>
                  <option value="Creative Branding & Visual Systems">Creative Branding & Visual Systems</option>
                  <option value="Curriculum Digitization & EdTech Publishing">Curriculum Digitization & EdTech</option>
                </select>
              </div>
            </div>

            {/* School / College / Workplace Organization */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>School, College or Workplace Organization</span>
                <span className="text-[10px] text-emerald-400 font-mono">* Required</span>
              </label>
              <input
                type="text"
                required
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="e.g. University of Delhi / Infosys / Independent Studio"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Privacy & Commercial Communications Consent */}
          <div className="pt-2">
            <label className="flex items-start space-x-2.5 cursor-pointer text-zinc-400 hover:text-zinc-300 text-[11px] leading-relaxed">
              <input
                type="checkbox"
                required
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span>
                I agree to the Ūrdhv Ascens Learning Portal Terms and consent to receive curated curriculum materials, technological insights, and relevant sponsor partner communications. (One-time registration - will never ask again).
              </span>
            </label>
          </div>

          {/* Single Compulsory Action Button - No Skip Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activate One-Time Access & Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
