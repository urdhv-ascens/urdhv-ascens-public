'use client';

import { useState, useEffect } from 'react';
import type { CapabilityItem, ContentRecord } from '@/core/types';
import { getLiveContent, updateContent } from '@/lib/api-client';
import { Sparkles, Plus, Trash2, Save, Loader2, RefreshCw } from 'lucide-react';

export default function CapabilitiesAdminPage() {
  const [capabilities, setCapabilities] = useState<CapabilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const content = await getLiveContent();
      if (content && content.capabilities && Array.isArray(content.capabilities.list)) {
        setCapabilities(content.capabilities.list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    const newItem: CapabilityItem = {
      id: `cap-${Date.now()}`,
      title: 'New Studio Capability',
      titleHi: '',
      description: 'Describe this capability and its business impact.',
      descriptionHi: '',
      icon: 'Sparkles',
      category: 'Digital Strategy',
      featured: true,
      active: true,
      displayOrder: capabilities.length + 1
    };
    setCapabilities([...capabilities, newItem]);
  };

  const handleRemove = (id: string) => {
    setCapabilities(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdate = (id: string, field: keyof CapabilityItem, value: any) => {
    setCapabilities(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await updateContent({
        capabilities: {
          tagline: 'What We Do',
          title: 'Capabilities',
          description: 'One nexus for every digital solution — engineered with intent.',
          list: capabilities
        }
      });
      if (res.success) {
        setStatusMessage('✅ Capabilities updated live to Hostinger!');
      } else {
        alert(res.message || 'Save failed.');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating capabilities.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mr-3" />
        <span className="text-sm font-mono">Loading Capabilities...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>Studio Capabilities Management</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Manage capabilities cards, icon selections, bilingual copy (EN/HI), and featured flags.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleAdd}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-amber-400 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Capability</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Capabilities</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-medium">
          {statusMessage}
        </div>
      )}

      <div className="space-y-4">
        {capabilities.map((item) => (
          <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`active-${item.id}`}
                    checked={item.active}
                    onChange={e => handleUpdate(item.id, 'active', e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-800 text-amber-500"
                  />
                  <label htmlFor={`active-${item.id}`} className="text-xs text-zinc-400 cursor-pointer">
                    Active
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`feat-${item.id}`}
                    checked={item.featured}
                    onChange={e => handleUpdate(item.id, 'featured', e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-800 text-amber-500"
                  />
                  <label htmlFor={`feat-${item.id}`} className="text-xs text-zinc-400 cursor-pointer">
                    Featured
                  </label>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-400">Title (English)</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={e => handleUpdate(item.id, 'title', e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-400">Title (Hindi - Optional)</label>
                <input
                  type="text"
                  value={item.titleHi || ''}
                  onChange={e => handleUpdate(item.id, 'titleHi', e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-400">Lucide Icon</label>
                <input
                  type="text"
                  value={item.icon}
                  onChange={e => handleUpdate(item.id, 'icon', e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                  placeholder="Monitor, PenTool, Video..."
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-[11px] font-medium text-zinc-400">Description</label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={e => handleUpdate(item.id, 'description', e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
