'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import contentData from '@/data/content.json';
import { getLiveContent, updateContent as apiUpdateContent } from '@/lib/api-client';
import type { ContentRecord } from '@/core/types';

interface CMSContentContextType {
  content: ContentRecord;
  isLoadingLive: boolean;
  refreshContent: () => Promise<void>;
  updateLocalContent: (patch: Partial<ContentRecord>) => void;
  saveAndPublishContent: (patch: Partial<ContentRecord>) => Promise<{ success: boolean; message?: string }>;
}

const CACHE_KEY = 'urdhv_live_content';
const CACHE_TS_KEY = 'urdhv_live_content_ts';

const defaultContent = contentData as unknown as ContentRecord;

/**
 * Restore cached live content from localStorage.
 * This ensures admin-panel edits survive git-triggered rebuilds.
 */
function getCachedContent(): ContentRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as ContentRecord;
  } catch {
    // Corrupted cache — ignore
  }
  return null;
}

function setCachedContent(content: ContentRecord) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content));
    localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
  } catch {
    // localStorage full or unavailable — non-critical
  }
}

/**
 * Build initial content: prefer localStorage cache over bundled content.json.
 * This way, admin changes survive even when a git commit rebuilds the static bundle.
 */
function getInitialContent(): ContentRecord {
  const cached = getCachedContent();
  if (cached) {
    // Deep-merge cached over defaults to fill any new keys added in latest build
    return {
      ...defaultContent,
      ...cached,
      siteSettings: { ...defaultContent.siteSettings, ...(cached.siteSettings || {}) },
      navigation: { ...defaultContent.navigation, ...(cached.navigation || {}) },
      hero: { ...defaultContent.hero, ...(cached.hero || {}) },
      about: { ...defaultContent.about, ...(cached.about || {}) },
      capabilities: { ...defaultContent.capabilities, ...(cached.capabilities || {}) },
      services: { ...defaultContent.services, ...(cached.services || {}) },
      projects: { ...defaultContent.projects, ...(cached.projects || {}) },
      contact: { ...defaultContent.contact, ...(cached.contact || {}) },
      footer: { ...defaultContent.footer, ...(cached.footer || {}) },
      presence: { ...defaultContent.presence, ...(cached.presence || {}) },
      legal: { ...defaultContent.legal, ...(cached.legal || {}) },
    } as ContentRecord;
  }
  return defaultContent;
}

const CMSContentContext = createContext<CMSContentContextType>({
  content: defaultContent,
  isLoadingLive: false,
  refreshContent: async () => {},
  updateLocalContent: () => {},
  saveAndPublishContent: async () => ({ success: false })
});

export function CMSContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentRecord>(getInitialContent);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(true);

  const refreshContent = useCallback(async () => {
    try {
      const live = await getLiveContent();
      if (live && typeof live === 'object') {
        const merged = {
          ...defaultContent,
          ...live,
          siteSettings: { ...defaultContent.siteSettings, ...(live.siteSettings || {}) },
          navigation: { ...defaultContent.navigation, ...(live.navigation || {}) },
          hero: { ...defaultContent.hero, ...(live.hero || {}) },
          about: { ...defaultContent.about, ...(live.about || {}) },
          capabilities: { ...defaultContent.capabilities, ...(live.capabilities || {}) },
          services: { ...defaultContent.services, ...(live.services || {}) },
          projects: { ...defaultContent.projects, ...(live.projects || {}) },
          contact: { ...defaultContent.contact, ...(live.contact || {}) },
          footer: { ...defaultContent.footer, ...(live.footer || {}) },
          presence: { ...defaultContent.presence, ...(live.presence || {}) },
          legal: { ...defaultContent.legal, ...(live.legal || {}) }
        } as ContentRecord;

        // Persist projectsList from API if available
        if (Array.isArray(live.projectsList) && live.projectsList.length > 0) {
          (merged as any).projectsList = live.projectsList;
        }

        setContent(merged);
        // Cache to localStorage so changes survive git-triggered rebuilds
        setCachedContent(merged);
      }
    } catch (err) {
      console.warn('API unreachable — using cached/bundled content fallback:', err);
      // Don't overwrite — keep cached content from getInitialContent()
    } finally {
      setIsLoadingLive(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const updateLocalContent = useCallback((patch: Partial<ContentRecord>) => {
    setContent((prev) => {
      const updated = { ...prev, ...patch };
      setCachedContent(updated as ContentRecord);
      return updated;
    });
  }, []);

  const saveAndPublishContent = useCallback(async (patch: Partial<ContentRecord>) => {
    try {
      const res = await apiUpdateContent(patch);
      if (res && res.success) {
        updateLocalContent(patch);
        return { success: true, message: res.message || 'Saved successfully!' };
      }
      return { success: false, message: res?.message || 'Failed to save to server.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error while saving.' };
    }
  }, [updateLocalContent]);

  return (
    <CMSContentContext.Provider
      value={{
        content,
        isLoadingLive,
        refreshContent,
        updateLocalContent,
        saveAndPublishContent
      }}
    >
      {children}
    </CMSContentContext.Provider>
  );
}

export function useCMSContent() {
  const context = useContext(CMSContentContext);
  return context || {
    content: defaultContent,
    isLoadingLive: false,
    refreshContent: async () => {},
    updateLocalContent: () => {},
    saveAndPublishContent: async () => ({ success: false })
  };
}
