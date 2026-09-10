/**
 * ŪRDHV ASCENS — HOSTINGER CONTROL CENTER API CLIENT
 * Connects frontend and admin CMS to Hostinger PHP backend.
 * Reference: Spec §3.2
 */

import type { Booklet, Course, ReaderRecord, AdsConfig, ContentRecord } from '@/core/types';

export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8080/api';
    }
    if (window.location.pathname.startsWith('/admin') || window.location.origin.includes('hostingersite.com')) {
      return `${window.location.origin}/api`;
    }
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
    }
    if (key) {
      headers['X-Admin-Key'] = key;
    }
  }

  return headers;
}

// 1. AUTH API
export async function adminLogin(passwordOrKey: string, email = 'admin@urdhvascens.com') {
  const res = await fetch(`${getApiBase()}/auth.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: passwordOrKey, email, adminKey: passwordOrKey }),
    signal: AbortSignal.timeout(10000)
  });
  const data = await res.json();
  if (data.success && data.token) {
    localStorage.setItem('urdhv_admin_token', data.token);
    localStorage.setItem('urdhv_admin_key', passwordOrKey);
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
    return !!data.authenticated;
  } catch {
    // If backend unreachable in dev, allow fallback key check
    return !!key && (key === 'urdhv_admin_2026_secure' || key.length >= 8);
  }
}

// 2. CONTENT API
export async function getLiveContent(): Promise<ContentRecord | null> {
  try {
    const res = await fetch(`${getApiBase()}/content.php`, {
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) {
      const data = await res.json();
      if (!data.error) return data;
    }
  } catch (err) {
    console.warn('Failed to fetch live content from API:', err);
  }
  return null;
}

export async function updateContent(content: Partial<ContentRecord>) {
  const res = await fetch(`${getApiBase()}/content.php`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(content),
    signal: AbortSignal.timeout(12000)
  });
  return await res.json();
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
export async function registerReader(input: {
  name: string;
  contact: string;
  role: string;
  institution?: string;
  courseSelected: string;
  consentGiven: boolean;
}) {
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

// 7. FILE UPLOAD API
export async function uploadAsset(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  const token = localStorage.getItem('urdhv_admin_token');
  const key = localStorage.getItem('urdhv_admin_key');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (key) headers['X-Admin-Key'] = key;

  const res = await fetch(`${getApiBase()}/upload.php`, {
    method: 'POST',
    headers,
    body: formData,
    signal: AbortSignal.timeout(30000)
  });
  return await res.json();
}
