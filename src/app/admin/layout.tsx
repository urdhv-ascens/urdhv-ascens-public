'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { adminLogout, getAdminUser, AdminUser, publishSite } from "@/lib/api-client";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  Megaphone,
  Briefcase,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      // If accessing from Cloudflare Pages (urdhvascens.pages.dev),
      // strictly forbid admin access on pages.dev and redirect back to the public homepage.
      // Only https://gold-cat-133405.hostingersite.com/admin/login/ is for admin access.
      if (host.includes('pages.dev')) {
        window.location.replace('/');
        return;
      }
    }
    setCurrentUser(getAdminUser());
  }, [pathname]);

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
          <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">Hostinger Control Plane Only</h2>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              The Ūrdhv Ascens Admin Portal is exclusively hosted on Hostinger. Redirecting to official access portal...
            </p>
          </div>
          <a
            href="https://gold-cat-133405.hostingersite.com/admin/login/"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
          >
            <span>Proceed to Admin Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  if (typeof window !== 'undefined' && window.location.hostname.includes('pages.dev')) {
    window.location.replace('/');
    return null;
  }

  const normalizedPath = pathname ? pathname.replace(/\/+$/, '') : '';
  if (normalizedPath === '/admin/login') {
    return <AdminAuthGuard>{children}</AdminAuthGuard>;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Booklets & Covers", href: "/admin/booklets", icon: BookOpen, badge: "12" },
    { label: "Courses", href: "/admin/courses", icon: GraduationCap },
    { label: "Reader Leads", href: "/admin/readers", icon: Users },
    { label: "Advertisements", href: "/admin/ads", icon: Megaphone },
    { label: "Projects / Work", href: "/admin/projects", icon: Briefcase },
    { label: "Capabilities", href: "/admin/capabilities", icon: Sparkles },
    { label: "Services", href: "/admin/services", icon: Layers },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
  ];

  const handlePublishAll = async () => {
    setIsPublishing(true);
    setPublishResult(null);
    try {
      const res = await publishSite();
      setPublishResult({
        success: !!res.success,
        message: res.message || 'Changes published live to Hostinger and edge CDN!'
      });
      setTimeout(() => setPublishResult(null), 5000);
    } catch (err: any) {
      setPublishResult({
        success: false,
        message: err?.message || 'Failed to publish changes.'
      });
      setTimeout(() => setPublishResult(null), 5000);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSignOut = () => {
    adminLogout();
    router.push('/admin/login');
  };

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-black text-white">
        {/* Admin Sidebar */}
        <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0 hidden md:flex">
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <img src="/logo.webp" alt="Ūrdhv Ascens" className="h-6 w-auto object-contain" />
              <span className="text-base font-black tracking-wider text-white uppercase">
                ŪRDHV <span className="text-emerald-400">CONTROL</span>
              </span>
            </Link>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
              v2.0
            </span>
          </div>
          
          <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400 font-mono">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Logged in Admin Profile Badge */}
          <div className="p-4 border-t border-zinc-800 flex flex-col gap-2">
            <div className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 overflow-hidden">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'D'}
                </div>
                <div className="overflow-hidden">
                  <span className="block text-xs font-bold text-white truncate">
                    {currentUser?.name || 'DEV'}
                  </span>
                  <span className="block text-[10px] text-zinc-400 font-mono truncate">
                    {currentUser?.email || 'devsol@urdhvascens.online'}
                  </span>
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>

            <a
              href="https://urdhvascens.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 w-full px-3 py-2 bg-red-500/10 text-red-400 rounded-lg font-medium text-xs hover:bg-red-500/20 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out ({currentUser?.name || 'Admin'})</span>
            </button>
          </div>
        </aside>

        {/* Admin Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-black">
          <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono text-zinc-400">HOSTINGER CONTROL CENTER</span>
              <span className="text-zinc-700">•</span>
              <span className="text-xs font-medium text-emerald-400">Live API Dynamic Sync</span>
            </div>
            <div className="flex items-center gap-3">
              {publishResult && (
                <span className={`text-xs font-mono flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
                  publishResult.success 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}>
                  {publishResult.success ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : null}
                  <span className="truncate max-w-[280px]">{publishResult.message}</span>
                </span>
              )}

              <button
                onClick={handlePublishAll}
                disabled={isPublishing}
                title="Publish and sync all saved CMS changes live to Hostinger storage and edge CDN"
                className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isPublishing ? "Publishing..." : "Publish Site"}</span>
              </button>

              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {currentUser?.name || 'DEV'}
                </span>
                <span className="text-zinc-600 text-xs hidden md:inline">|</span>
                <span className="text-[11px] text-zinc-400 font-mono hidden md:inline">
                  {currentUser?.email || 'devsol@urdhvascens.online'}
                </span>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-8 overflow-y-auto flex-1">
            {children}
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}
