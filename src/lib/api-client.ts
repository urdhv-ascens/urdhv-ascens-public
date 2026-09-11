/**
 * ŪRDHV ASCENS — HOSTINGER CONTROL CENTER API CLIENT
 * Connects frontend and admin CMS to Hostinger PHP backend.
 * Reference: Spec §3.2
 */

import type { Booklet, Course, ReaderRecord, AdsConfig, ContentRecord, ReaderRegistrationInput } from '@/core/types';

export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8080/api';
    }
    // When loaded directly on Hostinger server
    if (window.location.origin.includes('hostingersite.com')) {
      return `${window.location.origin}/api`;
    }
    // Default to Hostinger production backend (e.g. from https://urdhvascens.pages.dev)
    return 'https://gold-cat-133405.hostingersite.com/api';
  }
  return 'https://gold-cat-133405.hostingersite.com/api';
}

export const API_BASE = 'https://gold-cat-133405.hostingersite.com/api';

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('urdhv_admin_token');
    const key = localStorage.getItem('urdhv_admin_key');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['X-Admin-Token'] = token;
    }
    if (key) {
      headers['X-Admin-Key'] = key;
    }
  }

  return headers;
}

export interface AdminUser {
  id?: string;
  name: string;
  email: string;
  role: string;
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('urdhv_admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// 1. AUTH API
export async function adminLogin(passwordOrKey: string, email = 'devsol@urdhvascens.online') {
  const res = await fetch(`${getApiBase()}/auth.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: passwordOrKey, email, adminKey: passwordOrKey }),
    signal: AbortSignal.timeout(10000)
  });
  const data = await res.json();
  if (data.success) {
    if (data.token) {
      localStorage.setItem('urdhv_admin_token', data.token);
      localStorage.setItem('urdhv_admin_key', passwordOrKey);
    }
    const userPayload: AdminUser = data.user || {
      id: data.name || (email.toLowerCase().includes('devanand') ? 'Devanand' : 'DEV'),
      name: data.name || (email.toLowerCase().includes('devanand') ? 'Devanand' : 'DEV'),
      email: data.email || email,
      role: data.role || 'admin'
    };
    localStorage.setItem('urdhv_admin_user', JSON.stringify(userPayload));
  }
  return data;
}

export function adminLogout() {
  const token = localStorage.getItem('urdhv_admin_token');
  if (token) {
    fetch(`${getApiBase()}/auth.php?action=logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(6000)
    }).catch(() => {});
  }
  localStorage.removeItem('urdhv_admin_token');
  localStorage.removeItem('urdhv_admin_key');
  localStorage.removeItem('urdhv_admin_user');
}

export async function verifyAdminSession(): Promise<boolean> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('urdhv_admin_token') : null;
  const key = typeof window !== 'undefined' ? localStorage.getItem('urdhv_admin_key') : null;
  
  if (!token && !key) return false;

  try {
    const res = await fetch(`${getApiBase()}/auth.php?action=verify`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(6000)
    });
    const data = await res.json();
    if (data.authenticated && data.user) {
      localStorage.setItem('urdhv_admin_user', JSON.stringify(data.user));
    }
    return !!data.authenticated;
  } catch {
    // If backend unreachable in dev or offline preview, check token or key
    return !!(token || key);
  }
}

// 2. CONTENT API
const LOCAL_CONTENT_KEY = 'urdhv_live_content';

export async function getLiveContent(): Promise<ContentRecord | null> {
  // 1. Try to fetch from live backend API
  try {
    const res = await fetch(`${getApiBase()}/content.php`, {
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && !data.error && data.status !== 'empty') {
        if (typeof window !== 'undefined') {
          try {
            const existingRaw = localStorage.getItem(LOCAL_CONTENT_KEY);
            const existing = existingRaw ? JSON.parse(existingRaw) : {};
            const merged = { ...existing, ...data };
            localStorage.setItem(LOCAL_CONTENT_KEY, JSON.stringify(merged));
          } catch {}
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch live content from API, checking local cache:', err);
  }

  // 2. Fallback to localStorage cache so changes survive offline/rebuilds
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_CONTENT_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
  }

  return null;
}

export async function updateContent(content: Partial<ContentRecord>) {
  // Always update local cache immediately so edits persist across page reloads and git rebuilds
  if (typeof window !== 'undefined') {
    try {
      const cachedRaw = localStorage.getItem(LOCAL_CONTENT_KEY);
      const cached = cachedRaw ? JSON.parse(cachedRaw) : {};
      const updated = {
        ...cached,
        ...content,
        ...(content.services ? { services: content.services } : {}),
        ...(content.capabilities ? { capabilities: content.capabilities } : {}),
        ...(content.projectsList ? { projectsList: content.projectsList } : {})
      };
      localStorage.setItem(LOCAL_CONTENT_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not write to localStorage cache:', e);
    }
  }

  try {
    const res = await fetch(`${getApiBase()}/content.php`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(content),
      signal: AbortSignal.timeout(12000)
    });
    return await res.json();
  } catch (err: any) {
    console.warn('API update failed, local cache maintained:', err);
    return { success: true, message: 'Saved to local persistent cache.', offline: true };
  }
}

// 3. BOOKLETS API & MANUAL THUMBNAIL EDITOR
export async function getBooklets(courseId?: string, category?: string): Promise<Booklet[]> {
  const params = new URLSearchParams();
  if (courseId) params.append('courseId', courseId);
  if (category) params.append('category', category);

  try {
    const res = await fetch(`${getApiBase()}/booklets.php?${params.toString()}`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch booklets from API:', err);
  }
  return [];
}

export async function updateBooklet(booklet: Partial<Booklet> & { id: string }) {
  const res = await fetch(`${getApiBase()}/booklets.php`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(booklet),
    signal: AbortSignal.timeout(10000)
  });
  return await res.json();
}

export async function updateAllBooklets(booklets: Booklet[]) {
  const res = await fetch(`${getApiBase()}/booklets.php`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ booklets }),
    signal: AbortSignal.timeout(12000)
  });
  return await res.json();
}

// 4. COURSES API
export async function getCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${getApiBase()}/courses.php`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Failed to fetch courses:', err);
  }
  return [];
}

export async function updateCourses(courses: Course[]) {
  const res = await fetch(`${getApiBase()}/courses.php`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(courses),
    signal: AbortSignal.timeout(10000)
  });
  return await res.json();
}

// 5. READERS API
export async function registerReader(input: ReaderRegistrationInput) {
  const res = await fetch(`${getApiBase()}/readers.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(8000)
  });
  return await res.json();
}

export async function getReaders(query = '', courseId = ''): Promise<{ total: number; readers: ReaderRecord[] }> {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (courseId) params.append('courseId', courseId);

  const res = await fetch(`${getApiBase()}/readers.php?${params.toString()}`, {
    headers: getAuthHeaders(),
    signal: AbortSignal.timeout(10000)
  });
  return await res.json();
}

export async function deleteReader(id: string) {
  const res = await fetch(`${getApiBase()}/readers.php`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ id }),
    signal: AbortSignal.timeout(8000)
  });
  return await res.json();
}

export function getReadersCsvExportUrl(): string {
  return `${getApiBase()}/readers.php?export=csv`;
}

// 6. ADS API
export async function getAds(): Promise<AdsConfig | null> {
  try {
    const res = await fetch(`${getApiBase()}/ads.php`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Failed to fetch ads:', err);
  }
  return null;
}

export async function updateAds(ads: AdsConfig) {
  const res = await fetch(`${getApiBase()}/ads.php`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(ads),
    signal: AbortSignal.timeout(10000)
  });
  return await res.json();
}

// 7. MEDIA & FILE UPLOAD API
export interface MediaAssetItem {
  url: string;
  filename: string;
  size?: number;
  type?: 'image' | 'video';
  uploadedAt: string;
}

export async function getMediaAssets(): Promise<MediaAssetItem[]> {
  try {
    const res = await fetch(`${getApiBase()}/upload.php`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(10000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.assets)) {
        return data.assets;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch media assets from Hostinger:', err);
  }
  return [];
}

export async function deleteMediaAsset(filenameOrUrl: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${getApiBase()}/upload.php`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ filename: filenameOrUrl }),
      signal: AbortSignal.timeout(10000)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Delete request failed' };
  }
}

export async function uploadAsset(file: File): Promise<{ success: boolean; url?: string; filename?: string; message?: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('urdhv_admin_token');
    const key = localStorage.getItem('urdhv_admin_key');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['X-Admin-Token'] = token;
      formData.append('token', token);
    }
    if (key) {
      headers['X-Admin-Key'] = key;
      formData.append('adminKey', key);
    }
  }

  const res = await fetch(`${getApiBase()}/upload.php`, {
    method: 'POST',
    headers,
    body: formData,
    signal: AbortSignal.timeout(60000)
  });
  return await res.json();
}
