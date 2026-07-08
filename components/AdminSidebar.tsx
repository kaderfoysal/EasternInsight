"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutGrid, Newspaper, Users, FolderOpen, Video, BookOpen, Star, Settings, LogOut, ExternalLink } from 'lucide-react';
import Logo from '../assets/logo2.png';

const navItems = [
  { name: 'ড্যাশবোর্ড', href: '/admin', icon: LayoutGrid, roles: ['admin'] },
  { name: 'খবর ব্যবস্থাপনা (অ্যাডমিন)', href: '/admin/news', icon: Newspaper, roles: ['admin'] },
  { name: 'খবর ব্যবস্থাপনা', href: '/editor', icon: Newspaper, roles: ['editor'] },
  { name: 'হিরো সেটিংস', href: '/admin/hero', icon: Star, roles: ['admin'] },
  { name: 'সম্পাদক ব্যবস্থাপনা', href: '/admin/editors', icon: Users, roles: ['admin'] },
  { name: 'বিভাগ ব্যবস্থাপনা', href: '/admin/categories', icon: FolderOpen, roles: ['admin'] },
  { name: 'ভিডিও ব্যবস্থাপনা', href: '/admin/videos', icon: Video, roles: ['admin', 'editor'] },
  { name: 'মতামত', href: '/admin/opinions', icon: BookOpen, roles: ['admin', 'editor'] },
  { name: 'বই পর্যালোচনা', href: '/admin/book-reviews', icon: BookOpen, roles: ['admin', 'editor'] },
  { name: 'সেটিংস', href: '/admin/settings', icon: Settings, roles: ['admin'] },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession() as any;
  const userRole = session?.user?.role || 'editor'; // Default to editor if not found

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0D1117', color: 'white' }}>
      {/* Brand */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(139,26,26,0.3)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '4px' }}>
          <Image src={Logo} alt="Eastern Insight" width={32} height={32} style={{ borderRadius: '4px', objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.15em', color: '#8B1A1A', textTransform: 'uppercase' }}>Eastern Insight</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', color: '#3A4050' }}>Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
        <div style={{ marginBottom: '8px', padding: '0 8px', fontFamily: "'Space Mono', monospace", fontSize: '8px', letterSpacing: '0.18em', color: '#2A3040', textTransform: 'uppercase' }}>
          মূল নেভিগেশন
        </div>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && item.href !== '/editor' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onClose?.()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                marginBottom: '2px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontFamily: "'Space Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.03em',
                transition: 'all 0.15s',
                background: isActive ? 'rgba(139,26,26,0.2)' : 'transparent',
                color: isActive ? '#fff' : '#6A7280',
                borderLeft: isActive ? '2px solid #8B1A1A' : '2px solid transparent',
              }}
            >
              <Icon size={14} style={{ color: isActive ? '#C9A84C' : '#3A4050', flexShrink: 0 }} />
              <span>{item.name}</span>
              {item.name === 'হিরো সেটিংস' && (
                <span style={{ marginLeft: 'auto', background: '#8B1A1A', color: '#fff', fontSize: '7px', padding: '1px 5px', borderRadius: '2px', fontFamily: "'Space Mono', monospace", letterSpacing: '0.1em' }}>HOT</span>
              )}
            </Link>
          );
        })}

        <div style={{ marginTop: '16px', marginBottom: '8px', padding: '0 8px', fontFamily: "'Space Mono', monospace", fontSize: '8px', letterSpacing: '0.18em', color: '#2A3040', textTransform: 'uppercase' }}>
          দ্রুত লিঙ্ক
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '4px', textDecoration: 'none', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#4A5060', transition: 'color 0.15s' }}
        >
          <ExternalLink size={14} style={{ color: '#3A4050' }} />
          <span>সাইট দেখুন</span>
        </a>
        {userRole === 'admin' && (
          <Link
            href="/editor"
            onClick={() => onClose?.()}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '4px', textDecoration: 'none', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#4A5060', transition: 'color 0.15s' }}
          >
            <Newspaper size={14} style={{ color: '#3A4050' }} />
            <span>এডিটর প্যানেল</span>
          </Link>
        )}
      </nav>

      {/* User */}
      <div style={{ padding: '16px', borderTop: '1px solid #1A2030' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'rgba(139,26,26,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={14} style={{ color: '#C9A84C' }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#C8C0B0', fontWeight: 700 }}>{session?.user?.name || 'ইউজার'}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#3A4050', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{userRole}</div>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', background: 'rgba(139,26,26,0.1)', border: '1px solid rgba(139,26,26,0.2)', borderRadius: '3px', color: '#8B1A1A', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em', transition: 'background 0.15s' }}
        >
          <LogOut size={12} />
          <span>লগআউট</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block" style={{ height: '100%' }}>
        <SidebarContent />
      </div>
      {/* Mobile */}
      <div className="lg:hidden" style={{ height: '100%' }}>
        <SidebarContent onClose={onClose} />
      </div>
    </>
  );
}