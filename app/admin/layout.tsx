'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Menu, X, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

type SessionUser = { name?: string | null; email?: string | null; image?: string | null; role?: string | null; };
type Session = { user?: SessionUser };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession() as { data: Session | null; status: string };
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/auth/signin'); return; }
    const role = session.user?.role;
    // Allow admins and editors to access shared pages like /admin/videos
    if (role !== 'admin' && role !== 'editor') { router.push('/'); return; }
    // Editors can only access shared pages, not admin-only pages
    if (role === 'editor') {
      const pathname = window.location.pathname;
      const editorAllowed = ['/admin/videos', '/admin/opinions', '/admin/book-reviews'];
      const isAllowed = editorAllowed.some(p => pathname.startsWith(p));
      if (!isAllowed) { router.push('/editor'); return; }
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D1117' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid #8B1A1A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#3A4050', letterSpacing: '0.1em' }}>লোড হচ্ছে...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session || !['admin', 'editor'].includes(session.user?.role || '')) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#0F1419', display: 'flex' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className="lg:translate-x-0"
        style={{
          position: 'fixed',
          top: 0, bottom: 0, left: 0,
          width: '240px',
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s ease',
        }}
      >
        {/* On mobile, hide unless open */}
        <div className={`h-full ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }} className="lg:ml-[240px]">
        {/* Top bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 30,
          background: '#0D1117',
          borderBottom: '1px solid rgba(139,26,26,0.2)',
          padding: '0 20px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile sidebar toggle */}
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: '#6A7280', cursor: 'pointer', padding: '4px' }}
            >
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutGrid size={16} style={{ color: '#8B1A1A' }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#C8C0B0', letterSpacing: '0.08em', fontWeight: 700 }}>
                ADMIN PANEL
              </span>
            </div>
          </div>

          {/* Breadcrumb actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/"
              target="_blank"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3A4050', letterSpacing: '0.08em', textDecoration: 'none', padding: '4px 10px', border: '1px solid #1A2030', borderRadius: '3px', transition: 'all 0.2s' }}
            >
              সাইট দেখুন ↗
            </Link>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3A4050', letterSpacing: '0.06em' }}>
              {session.user?.name}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 24px', overflowAuto: 'auto' } as any}>
          {children}
        </main>
      </div>
    </div>
  );
}