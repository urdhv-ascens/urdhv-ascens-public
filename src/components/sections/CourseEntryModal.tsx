'use client';

import React, { useState } from 'react';
import { X, BookOpen, Sparkles, GraduationCap, ShieldCheck, ArrowRight, Loader2, UserCheck } from 'lucide-react';
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
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('Individual Learner');
  const [affiliation, setAffiliation] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const navigateToViewer = () => {
    const targetUrl = `${viewerBase}?course=${courseSelected}`;
    window.location.href = targetUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If user provided no details, immediately navigate directly
    if (!name.trim() && !contact.trim()) {
      navigateToViewer();
      return;
    }

    setLoading(true);

    try {
      const res = await registerReader({
        name: name.trim() || 'Learner',
        contact: contact.trim() || 'N/A',
        role,
        institution: affiliation.trim(),
        courseSelected,
        consentGiven: true
      });

      if (res && res.readerId) {
        localStorage.setItem('urdhv_reader_id', res.readerId);
        localStorage.setItem('urdhv_reader_name', name.trim() || 'Learner');
      }
    } catch (err) {
      console.warn('Reader registration skipped/fallback:', err);
    } finally {
      setLoading(false);
      navigateToViewer();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Open Access Curriculum</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Ūrdhv Ascens Learning Portal
          </h2>
          <p className="text-zinc-400 text-xs mt-1.5">
            Instant, universal access to all 12 visual curriculum booklets. Open to any individual.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Track Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCourseSelected('students-ai')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                courseSelected === 'students-ai'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">Students AI Series</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[11px] text-zinc-400">6 Visual Booklets</span>
            </button>

            <button
              type="button"
              onClick={() => setCourseSelected('teachers-ai')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                courseSelected === 'teachers-ai'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">Teachers AI Toolkit</span>
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[11px] text-zinc-400">6 Visual Booklets</span>
            </button>
          </div>

          {/* Universally Fillable Input Fields */}
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Full Name <span className="text-zinc-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name or alias"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Email or Phone <span className="text-zinc-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Individual Profile</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Individual Learner">Individual Learner / Self-Explorer</option>
                  <option value="Student">Student (School / College)</option>
                  <option value="Educator">Educator / Teacher</option>
                  <option value="Parent">Parent / Mentor</option>
                  <option value="Professional">Professional / Lifelong Learner</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                School, College or Organization <span className="text-zinc-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="Any institution, workplace, or leave blank"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Privacy Consent Notice - Informational, universal */}
          <div className="pt-2">
            <label className="flex items-start space-x-2.5 cursor-pointer text-zinc-400 hover:text-zinc-300 text-xs leading-relaxed">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span>
                Free open educational access. By entering, you agree to Ūrdhv Ascens open learning terms. Zero spam, ever.
              </span>
            </label>
          </div>

          {/* Action Buttons: Submit or Direct Access */}
          <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Enter Learning Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={navigateToViewer}
              className="py-3 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs transition-colors border border-zinc-800 flex items-center justify-center space-x-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Skip & Read Directly</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
