'use client';

import { useState, useEffect } from 'react';
import type { AdsConfig, TopBarSlide } from '@/core/types';
import { getAds, updateAds } from '@/lib/api-client';
import { Megaphone, Plus, Trash2, Save, Loader2, RefreshCw } from 'lucide-react';

export default function AdsAdminPage() {
  const [ads, setAds] = useState<AdsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadAds = async () => {
    setLoading(true);
    try {
      const data = await getAds();
      setAds(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleSave = async () => {
    if (!ads) return;
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await updateAds(ads);
      if (res.success) {
        setStatusMessage('✅ Advertisement configuration updated successfully!');
      } else {
        alert(res.message || 'Save failed.');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving ads config.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSlide = () => {
    if (!ads) return;
    const newSlide: TopBarSlide = {
      id: `slide-${Date.now()}`,
      title: 'New Sponsor Headline',
      subtitle: 'Optional sponsor description',
      destinationUrl: 'https://urdhvascens.com',
      active: true,
      displayOrder: ads.topBar.slides.length + 1
    };
    setAds({
      ...ads,
      topBar: {
        ...ads.topBar,
        slides: [...ads.topBar.slides, newSlide]
      }
    });
  };

  const handleRemoveSlide = (id: string) => {
    if (!ads) return;
    setAds({
      ...ads,
      topBar: {
        ...ads.topBar,
        slides: ads.topBar.slides.filter(s => s.id !== id)
      }
    });
  };

  const handleUpdateSlide = (id: string, field: keyof TopBarSlide, value: any) => {
    if (!ads) return;
    setAds({
      ...ads,
      topBar: {
        ...ads.topBar,
        slides: ads.topBar.slides.map(s => s.id === id ? { ...s, [field]: value } : s)
      }
    });
  };

  if (loading || !ads) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mr-3" />
        <span className="text-sm font-mono">Loading Ads Configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-400" />
            <span>Advertisement & Sponsor Control</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Manage the Top Sponsor Bar slideshow and Desktop side advertisement placements in the Viewer.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadAds}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Ads Config</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-medium">
          {statusMessage}
        </div>
      )}

      {/* SECTION 1: Top Sponsor Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white">Top Sponsor Bar Slideshow</h2>
            <p className="text-xs text-zinc-400">Rotating header announcement banner on the Viewer platform.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="topBarEnabled"
                checked={ads.topBar.enabled}
                onChange={e => setAds({ ...ads, topBar: { ...ads.topBar, enabled: e.target.checked } })}
                className="rounded bg-zinc-900 border-zinc-800 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="topBarEnabled" className="text-xs font-semibold text-zinc-300 cursor-pointer">
                Enabled
              </label>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
              <span>Interval:</span>
              <input
                type="number"
                min={2}
                max={60}
                value={ads.topBar.rotationIntervalSeconds}
                onChange={e => setAds({
                  ...ads,
                  topBar: { ...ads.topBar, rotationIntervalSeconds: parseInt(e.target.value, 10) || 6 }
                })}
                className="w-12 bg-zinc-900 border border-zinc-800 rounded-lg text-center py-1 text-white text-xs font-mono"
              />
              <span>sec</span>
            </div>
          </div>
        </div>

        {/* Slides List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Slides ({ads.topBar.slides.length})
            </h3>
            <button
              onClick={handleAddSlide}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-amber-400"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="space-y-3">
            {ads.topBar.slides.map((slide) => (
              <div key={slide.id} className="p-4 bg-zinc-900/50 border border-zinc-850 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`slide-active-${slide.id}`}
                      checked={slide.active}
                      onChange={e => handleUpdateSlide(slide.id, 'active', e.target.checked)}
                      className="rounded bg-zinc-900 border-zinc-800 text-amber-500"
                    />
                    <label htmlFor={`slide-active-${slide.id}`} className="text-xs font-semibold text-zinc-300 cursor-pointer">
                      Active
                    </label>
                  </div>
                  <button
                    onClick={() => handleRemoveSlide(slide.id)}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-zinc-400">Slide Headline</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={e => handleUpdateSlide(slide.id, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-zinc-400">Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={slide.subtitle || ''}
                      onChange={e => handleUpdateSlide(slide.id, 'subtitle', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-medium text-zinc-400">Target Destination URL</label>
                    <input
                      type="text"
                      value={slide.destinationUrl}
                      onChange={e => handleUpdateSlide(slide.id, 'destinationUrl', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: Desktop Side Ads */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white">Desktop Side Ads (2XL Viewport)</h2>
          <p className="text-xs text-zinc-400">Fixed vertical banners shown exclusively on extra large screens.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left Ad */}
          <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white">Left Banner Placement</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="leftAdEnabled"
                  checked={ads.sideAds.leftAd.enabled}
                  onChange={e => setAds({
                    ...ads,
                    sideAds: { ...ads.sideAds, leftAd: { ...ads.sideAds.leftAd, enabled: e.target.checked } }
                  })}
                  className="rounded bg-zinc-900 border-zinc-800 text-amber-500"
                />
                <label htmlFor="leftAdEnabled" className="text-xs font-medium text-zinc-300 cursor-pointer">
                  Enabled
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400">Creative Image URL</label>
              <input
                type="text"
                value={ads.sideAds.leftAd.imageUrl}
                onChange={e => setAds({
                  ...ads,
                  sideAds: { ...ads.sideAds, leftAd: { ...ads.sideAds.leftAd, imageUrl: e.target.value } }
                })}
                className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                placeholder="/uploads/banner_left.webp"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400">Destination Link</label>
              <input
                type="text"
                value={ads.sideAds.leftAd.destinationUrl}
                onChange={e => setAds({
                  ...ads,
                  sideAds: { ...ads.sideAds, leftAd: { ...ads.sideAds.leftAd, destinationUrl: e.target.value } }
                })}
                className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Right Ad */}
          <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white">Right Banner Placement</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rightAdEnabled"
                  checked={ads.sideAds.rightAd.enabled}
                  onChange={e => setAds({
                    ...ads,
                    sideAds: { ...ads.sideAds, rightAd: { ...ads.sideAds.rightAd, enabled: e.target.checked } }
                  })}
                  className="rounded bg-zinc-900 border-zinc-800 text-amber-500"
                />
                <label htmlFor="rightAdEnabled" className="text-xs font-medium text-zinc-300 cursor-pointer">
                  Enabled
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400">Creative Image URL</label>
              <input
                type="text"
                value={ads.sideAds.rightAd.imageUrl}
                onChange={e => setAds({
                  ...ads,
                  sideAds: { ...ads.sideAds, rightAd: { ...ads.sideAds.rightAd, imageUrl: e.target.value } }
                })}
                className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                placeholder="/uploads/banner_right.webp"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400">Destination Link</label>
              <input
                type="text"
                value={ads.sideAds.rightAd.destinationUrl}
                onChange={e => setAds({
                  ...ads,
                  sideAds: { ...ads.sideAds, rightAd: { ...ads.sideAds.rightAd, destinationUrl: e.target.value } }
                })}
                className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
