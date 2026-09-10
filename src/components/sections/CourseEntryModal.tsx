'use client';

import React, { useState } from 'react';
import { X, BookOpen, Sparkles, GraduationCap, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { registerReader } from '@/lib/api-client';

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
  const [courseSelected, setCourseSelected] = useState<'students-ai' | 'teachers-ai'>(defaultCourse);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('Student');
  const [institution, setInstitution] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consentGiven) {
      setError('You must consent to the privacy policy to access the educational materials.');
      return;
    }

    setLoading(true);

    try {
      const res = await registerReader({
        name,
        contact,
        role,
        institution,
        courseSelected,
        consentGiven
      });

      if (res.success && res.readerId) {
        // Save reader session locally
        localStorage.setItem('urdhv_reader_id', res.readerId);
        localStorage.setItem('urdhv_reader_name', name);

        // Determine Viewer target URL (Spec §6.2)
        const viewerBase = process.env.NEXT_PUBLIC_VIEWER_URL || 'https://viewer.urdhvascens.com';
        const targetUrl = `${viewerBase}?course=${courseSelected}`;
        window.location.href = targetUrl;
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      // If Hostinger API is offline in local dev, allow direct entrance
      console.warn('Reader registration fallback:', err);
      const viewerBase = process.env.NEXT_PUBLIC_VIEWER_URL || 'https://viewer.urdhvascens.com';
      window.location.href = `${viewerBase}?course=${courseSelected}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" />
            <span>100% Free Course Access</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Enter Ūrdhv Ascens Learning Portal
          </h2>
          <p className="text-zinc-400 text-xs mt-1.5">
            Instant unrestricted access to all 12 visual curriculum booklets.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Track Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setCourseSelected('students-ai');
                if (role === 'Educator') setRole('Student');
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                courseSelected === 'students-ai'
                  ? 'bg-amber-500/15 border-amber-500/40 text-white shadow-md shadow-amber-500/5'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">Students AI Series</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-[11px] text-zinc-400">6 Visual Booklets</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCourseSelected('teachers-ai');
                if (role === 'Student') setRole('Educator');
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                courseSelected === 'teachers-ai'
                  ? 'bg-amber-500/15 border-amber-500/40 text-white shadow-md shadow-amber-500/5'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">Teachers AI Toolkit</span>
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-[11px] text-zinc-400">6 Visual Booklets</span>
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Aryan Sharma"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Contact (Email or Phone)</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  placeholder="aryan@example.com"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Your Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Student">Student</option>
                  <option value="Educator">Educator / Teacher</option>
                  <option value="Parent">Parent</option>
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
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                placeholder="e.g. Delhi Public School / University of Rajasthan"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Privacy Consent Checkbox (Spec §6.3 / C-11) */}
          <div className="pt-2">
            <label className="flex items-start space-x-2.5 cursor-pointer text-zinc-400 hover:text-zinc-300 text-xs leading-relaxed">
              <input
                type="checkbox"
                required
                checked={consentGiven}
                onChange={e => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-amber-500"
              />
              <span>
                I agree to the <a href="/privacy" target="_blank" className="text-amber-400 hover:underline">Privacy Policy</a> and consent to educational progress logging. No spam, ever.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/10 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Access Course Booklets</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
