'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Logo from '../assets/logo2.png';

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  serial: number;
  parentSlug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  serial: number;
  isDropdown?: boolean;
  parentSlug?: string | null;
  children?: SubCategory[];
}

type SessionUser = { name?: string | null; email?: string | null; role?: string | null; };
type SessionType = { user?: SessionUser };

export default function Header() {
  const { data: session } = useSession() as { data: SessionType | null; status: string };
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navItems, setNavItems] = useState([] as Category[]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null as string | null);
  const [dateStr, setDateStr] = useState('');
  const dropdownRef = useRef(new Map() as Map<string, HTMLDivElement>);

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const days = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
      const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
      setDateStr(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`);
    };
    updateDate();
    const t = setInterval(updateDate, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch('/api/categories?nested=true')
      .then(r => r.ok ? r.json() : [])
      .then((tree: Category[]) => {
        // Filter out subcategories from top-level (they're in children), and exclude 'home' & 'about'
        const topLevel = tree.filter((c) => !c.parentSlug);
        setNavItems(topLevel);
      })
      .catch(() => {});
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  }, [searchQuery, router]);

  const getCategoryHref = (cat: Category) => {
    if (cat.slug === 'home') return '/';
    if (cat.slug === 'about') return '/about';
    if (cat.slug === 'sahitto-o-boi') return '/book-review';
    if (cat.slug === 'bishesh-protibedon') return '/#special-reports';
    return `/category/${cat.slug}`;
  };

  // Main nav items to show in header (exclude 'home' which is handled separately, exclude 'about')
  const mainNavItems = navItems.filter((c: Category) => c.slug !== 'home' && c.slug !== 'about');

  return (
    <>
      <header style={{ background: '#111', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>

        {/* ── TOPBAR ── */}
        <div style={{ background: '#111', color: '#AAA', fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.08em', padding: '8px 0', borderBottom: '1px solid #222' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            <span suppressHydrationWarning>{dateStr}</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ border: '1px solid #333', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '2px', background: '#8B1A1A', borderColor: '#8B1A1A', color: '#fff' }}>বাংলা</span>
              <span style={{ border: '1px solid #333', color: '#888', fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '2px', cursor: 'pointer' }}>EN</span>
            </div>
          </div>
        </div>

        {/* ── MASTHEAD ── */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          {/* Logo + Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <Image
                src={Logo}
                alt="Eastern Insight Logo"
                width={68}
                height={68}
                style={{ width: '68px', height: '68px', objectFit: 'contain', borderRadius: '8px' }}
                priority
              />
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
              <Link href="/" style={{ fontFamily: "'Kalpurush', Georgia, serif", fontSize: 'clamp(20px, 5vw, 32px)', color: '#FFFFFF', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.1, textDecoration: 'none', whiteSpace: 'nowrap', textShadow: '0 0 40px rgba(201,168,76,0.3)' }}>
                ইস্টার্ন ইনসাইট
              </Link>
              <span style={{ fontFamily: "'Kalpurush', Georgia, serif", fontSize: '12px', color: '#556070', letterSpacing: '0.04em', fontStyle: 'italic' }}>
                A Bangla-first publication on Eastern Asia &amp; Beyond
              </span>
            </div>
          </div>

          {/* Right: Search + Lang */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Desktop search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#1E1E1E', border: '1px solid #333', borderRadius: '3px', padding: '7px 14px', gap: '8px', width: '260px', maxWidth: '100%' }} className="hidden-mobile">
              <Search size={15} style={{ color: '#555', flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="বিষয়, দেশ, বিশ্লেষণ খুঁজুন..."
                style={{ background: 'transparent', border: 'none', color: '#ddd', fontFamily: "'Kalpurush', Georgia, serif", fontSize: '14px', outline: 'none', width: '100%' }}
              />
            </form>

            {/* Mobile icons */}
            <div className="show-mobile" style={{ display: 'none', gap: '12px', alignItems: 'center' }}>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}>
                <Search size={20} />
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}>
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── NAV BAR ── */}
        <nav style={{ background: '#111', borderTop: '1px solid #222', marginTop: '16px', position: 'relative', zIndex: 200, overflow: 'visible' }} className="nav-desktop">
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', flexWrap: 'wrap', gap: 0, overflow: 'visible', alignItems: 'center' }}>
            {/* Home always first */}
            <Link href="/"
              style={{ color: pathname === '/' ? '#fff' : '#BBB', textDecoration: 'none', fontFamily: "'Kalpurush', Georgia, serif", fontSize: '13.5px', fontWeight: 700, letterSpacing: '0.02em', padding: '13px 18px', whiteSpace: 'nowrap', borderBottom: pathname === '/' ? '3px solid #8B1A1A' : '3px solid transparent', transition: 'color 0.2s, border-color 0.2s', display: 'inline-block' }}
            >হোম</Link>

            {/* Dynamic nav items */}
            {mainNavItems.map((cat: Category) => (
              cat.isDropdown && cat.children && cat.children.length > 0 ? (
                /* Dropdown item */
                <div
                  key={cat._id}
                  style={{ position: 'relative', display: 'inline-block', zIndex: 10000 }}
                  onMouseEnter={() => setOpenDropdown(cat.slug)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link href={getCategoryHref(cat)} style={{ color: '#BBB', textDecoration: 'none', fontFamily: "'Kalpurush', Georgia, serif", fontSize: '13.5px', fontWeight: 700, letterSpacing: '0.02em', padding: '13px 18px', whiteSpace: 'nowrap', borderBottom: '3px solid transparent', transition: 'color 0.2s, border-color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.currentTarget as HTMLElement).style.color = '#BBB'; }}
                  >
                    {cat.name} <ChevronDown size={10} style={{ opacity: 0.6 }} />
                  </Link>
                  {openDropdown === cat.slug && (
                    <div style={{ display: 'block', position: 'absolute', top: '100%', left: 0, background: '#111', border: '1px solid #2A2A2A', borderTop: '2px solid #8B1A1A', width: 'max-content', minWidth: '220px', maxWidth: 'min(280px, 90vw)', maxHeight: '480px', overflowY: 'auto', zIndex: 999, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                      {cat.children!.map((sub: SubCategory) => (
                        <Link key={sub._id} href={`/category/${sub.slug}`} style={{ display: 'block', padding: '11px 20px', borderBottom: '1px solid #1C1C1C', fontSize: '13px', fontWeight: 600, color: '#AAA', textDecoration: 'none', fontFamily: "'Kalpurush', Georgia, serif", transition: 'color 0.15s, background 0.15s' }}
                          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = '#1A1A1A'; }}
                          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.currentTarget as HTMLElement).style.color = '#AAA'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                          onClick={() => setOpenDropdown(null)}
                        >{sub.name}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Regular link */
                <Link key={cat._id} href={getCategoryHref(cat)}
                  style={{ color: '#BBB', textDecoration: 'none', fontFamily: "'Kalpurush', Georgia, serif", fontSize: '13.5px', fontWeight: 700, letterSpacing: '0.02em', padding: '13px 18px', whiteSpace: 'nowrap', borderBottom: '3px solid transparent', transition: 'color 0.2s, border-color 0.2s', display: 'inline-block' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderBottomColor = '#555'; }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.currentTarget as HTMLElement).style.color = '#BBB'; (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'; }}
                >{cat.name}</Link>
              )
            ))}

            <span style={{ color: '#333', fontSize: '18px', padding: '0 4px', alignSelf: 'center', userSelect: 'none' }}>।</span>
            <Link href="/about"
              style={{ color: '#666', textDecoration: 'none', fontFamily: "'Kalpurush', Georgia, serif", fontSize: '12px', fontStyle: 'italic', padding: '13px 18px', borderBottom: '3px solid transparent', display: 'inline-block' }}
            >আমাদের সম্পর্কে</Link>

            {/* Auth link */}
            {session ? (
              <button onClick={() => signOut()} style={{ color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Kalpurush', Georgia, serif", fontSize: '12px', fontStyle: 'italic', padding: '13px 18px' }}>লগআউট</button>
            ) : (
              <Link href="/auth/signin" style={{ color: '#666', textDecoration: 'none', fontFamily: "'Kalpurush', Georgia, serif", fontSize: '12px', fontStyle: 'italic', padding: '13px 18px' }}>লগইন</Link>
            )}
          </div>
        </nav>

        {/* Mobile search bar */}
        {isSearchOpen && (
          <div style={{ background: '#1A1A1A', padding: '12px 16px' }}>
            <form onSubmit={handleSearch}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="খবর খুঁজুন..."
                  autoFocus
                  style={{ width: '100%', padding: '8px 8px 8px 36px', background: '#111', border: '1px solid #333', borderRadius: '3px', color: '#ddd', fontFamily: "'Kalpurush', Georgia, serif", fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#555' }} />
              </div>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {isMenuOpen && (
          <div style={{ background: '#0D0D0D', borderTop: '1px solid #222', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/" onClick={() => setIsMenuOpen(false)} style={{ color: '#BBB', padding: '12px 20px', fontFamily: "'Kalpurush', Georgia, serif", fontSize: '15px', borderBottom: '1px solid #1A1A1A', textDecoration: 'none' }}>হোম</Link>
              {navItems.filter((c: Category) => c.slug !== 'home').map((cat: Category) => (
                <div key={cat._id}>
                  <Link href={getCategoryHref(cat)} onClick={() => setIsMenuOpen(false)} style={{ color: '#BBB', padding: '12px 20px', fontFamily: "'Kalpurush', Georgia, serif", fontSize: '15px', borderBottom: '1px solid #1A1A1A', textDecoration: 'none', display: 'block', fontWeight: cat.isDropdown ? 700 : 400 }}>{cat.name}</Link>
                  {cat.isDropdown && cat.children && cat.children.map((sub: SubCategory) => (
                    <Link key={sub._id} href={`/category/${sub.slug}`} onClick={() => setIsMenuOpen(false)} style={{ color: '#777', padding: '9px 36px', fontFamily: "'Kalpurush', Georgia, serif", fontSize: '13px', borderBottom: '1px solid #151515', textDecoration: 'none', display: 'block' }}>— {sub.name}</Link>
                  ))}
                </div>
              ))}
              {session?.user?.role === 'admin' && <Link href="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: '#C9A84C', padding: '12px 20px', fontSize: '14px', borderBottom: '1px solid #1A1A1A', textDecoration: 'none' }}>অ্যাডমিন প্যানেল</Link>}
              {session ? (
                <button onClick={() => { signOut(); setIsMenuOpen(false); }} style={{ color: '#f87171', padding: '12px 20px', textAlign: 'left', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', borderTop: '1px solid #1A1A1A', fontFamily: "'Kalpurush', Georgia, serif" }}>লগআউট</button>
              ) : (
                <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)} style={{ color: '#C9A84C', padding: '12px 20px', fontSize: '14px', textDecoration: 'none', display: 'block' }}>লগইন</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Responsive CSS */}
      <style>{`
        .nav-desktop { display: block; }
        .hidden-mobile { display: flex !important; }
        .show-mobile { display: none !important; }

        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', top: '0' }}></div>
    </>
  );
}
