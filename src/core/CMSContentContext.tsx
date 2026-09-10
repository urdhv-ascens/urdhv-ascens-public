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

const defaultContent = contentData as unknown as ContentRecord;

const CMSContentContext = createContext<CMSContentContextType>({
  content: defaultContent,
  isLoadingLive: false,
  refreshContent: async () => {},
  updateLocalContent: () => {},
  saveAndPublishContent: async () => ({ success: false })
});

export function CMSContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentRecord>(defaultContent);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(true);

  const refreshContent = useCallback(async () => {
    try {
      const live = await getLiveContent();
      if (live && typeof live === 'object') {
        setContent((prev) => ({
          ...prev,
          ...live,
          siteSettings: { ...prev.siteSettings, ...(live.siteSettings || {}) },
          navigation: { ...prev.navigation, ...(live.navigation || {}) },
          hero: { ...prev.hero, ...(live.hero || {}) },
          about: { ...prev.about, ...(live.about || {}) },
          capabilities: { ...prev.capabilities, ...(live.capabilities || {}) },
          services: { ...prev.services, ...(live.services || {}) },
          projects: { ...prev.projects, ...(live.projects || {}) },
          contact: { ...prev.contact, ...(live.contact || {}) },
          footer: { ...prev.footer, ...(live.footer || {}) },
          presence: { ...prev.presence, ...(live.presence || {}) },
          legal: { ...prev.legal, ...(live.legal || {}) }
        } as ContentRecord));
      }
    } catch (err) {
      console.warn('Using bundled content.json fallback:', err);
    } finally {
      setIsLoadingLive(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const updateLocalContent = useCallback((patch: Partial<ContentRecord>) => {
    setContent((prev) => ({
      ...prev,
      ...patch
    }));
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
