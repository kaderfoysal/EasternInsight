'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronDown, ChevronRight } from 'lucide-react';
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

type SessionUser = { name?: string | null; email?: string | null; role?: string | null };
type SessionType = { user?: SessionUser };

const getCategoryHref = (cat: { slug: string }) => {
  if (cat.slug === 'home') return '/';
  if (cat.slug === 'about') return '/about';
  if (cat.slug === 'sahitto-o-boi') return '/book-review';
  if (cat.slug === 'bishesh-protibedon') return '/#special-reports';
  return `/category/${cat.slug}`;
};

export default function Header() {
  const { data: session } = useSession() as { data: SessionType | null; status: string };
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navItems, setNavItems] = useState([] as Category[]);
  const [openDropdown, setOpenDropdown] = useState(null as string | null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null as string | null);
  const [dateStr, setDateStr] = useState('');

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

  // Stable date (client-only)
  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
      const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
      setDateStr(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`);
    };
    fmt();
    const t = setInterval(fmt, 60000);
    return () => clearInterval(t);
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories?nested=true')
      .then(r => r.ok ? r.json() : [])
      .then((tree: Category[]) => setNavItems(tree.filter(c => !c.parentSlug)))
      .catch(() => {});
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  }, [searchQuery, router]);

  const mainNavItems = navItems.filter((c: Category) => c.slug !== 'home' && c.slug !== 'about');

  return (
    <>
      {/* ═══ STYLES ═══ */}
      <style>{`
        /* ── Header base ── */
        .ei-header {
          background: #111111;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 24px rgba(0,0,0,0.5);
        }

        /* ── Topbar ── */
        .ei-topbar {
          background: #111;
          border-bottom: 1px solid #222;
          padding: 7px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ei-topbar-date {
          font-family: 'Space Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.07em;
          color: #666;
        }
        .ei-lang-group {
          display: flex;
          gap: 4px;
        }
        .ei-lang-btn {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          padding: 2px 8px;
          border-radius: 2px;
          border: 1px solid #333;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
        }
        .ei-lang-btn.active {
          background: #8B1A1A;
          border-color: #8B1A1A;
          color: #fff;
        }

        /* ── Masthead ── */
        .ei-masthead {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 16px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .ei-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }
        .ei-logo-img {
          width: 58px;
          height: 58px;
          object-fit: contain;
          border-radius: 8px;
          flex-shrink: 0;
        }
        .ei-brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .ei-brand-name {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: clamp(18px, 4.5vw, 30px);
          color: #ffffff;
          font-weight: 700;
          letter-spacing: 0.02em;
          line-height: 1.1;
          text-decoration: none;
          white-space: nowrap;
          text-shadow: 0 0 40px rgba(201,168,76,0.25);
        }
        .ei-brand-tagline {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #445060;
          letter-spacing: 0.04em;
          font-style: italic;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Desktop search ── */
        .ei-search-form {
          display: flex;
          align-items: center;
          background: #1A1A1A;
          border: 1px solid #2A2A2A;
          border-radius: 3px;
          padding: 7px 12px;
          gap: 8px;
          width: 240px;
          transition: border-color 0.2s;
        }
        .ei-search-form:focus-within {
          border-color: #8B1A1A;
        }
        .ei-search-form input {
          background: transparent;
          border: none;
          color: #ccc;
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 13px;
          outline: none;
          width: 100%;
        }
        .ei-search-form input::placeholder { color: #444; }

        /* ── Mobile action buttons ── */
        .ei-mobile-actions {
          display: none;
          gap: 4px;
          align-items: center;
        }
        .ei-icon-btn {
          background: none;
          border: none;
          color: #777;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s, background 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .ei-icon-btn:hover, .ei-icon-btn:active { color: #fff; background: rgba(255,255,255,0.07); }

        /* ── Desktop Nav ── */
        .ei-nav {
          background: #111;
          border-top: 1px solid #1E1E1E;
          margin-top: 14px;
          position: relative;
          z-index: 500;
          overflow: visible;
        }
        .ei-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          overflow-x: auto;
          scrollbar-width: none;
          gap: 0;
        }
        .ei-nav-inner::-webkit-scrollbar { display: none; }

        .ei-nav-link {
          color: #D1D5DB;
          text-decoration: none;
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          padding: 12px 14px;
          white-space: nowrap;
          border-bottom: 3px solid transparent;
          transition: color 0.2s, border-color 0.2s;
          display: inline-block;
          flex-shrink: 0;
        }
        .ei-nav-link:hover { color: #fff; border-bottom-color: #555; }
        .ei-nav-link.active { color: #fff; border-bottom-color: #8B1A1A; }
        .ei-nav-link.muted { color: #555; font-size: 11.5px; font-style: italic; font-weight: 400; }
        .ei-nav-link.muted:hover { color: #888; }

        .ei-nav-divider {
          color: #2A2A2A;
          font-size: 16px;
          padding: 0 2px;
          align-self: center;
          user-select: none;
          flex-shrink: 0;
        }

        /* Dropdown wrapper */
        .ei-dropdown-wrap {
          position: relative;
          display: inline-flex;
          align-items: stretch;
          flex-shrink: 0;
        }
        .ei-dropdown-trigger {
          color: #D1D5DB;
          text-decoration: none;
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          padding: 12px 14px;
          white-space: nowrap;
          border-bottom: 3px solid transparent;
          transition: color 0.2s, border-color 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .ei-dropdown-wrap:hover .ei-dropdown-trigger,
        .ei-dropdown-trigger:hover { color: #fff; border-bottom-color: #555; }

        .ei-dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          background: #111;
          border: 1px solid #2A2A2A;
          border-top: 2px solid #8B1A1A;
          min-width: 210px;
          max-width: 270px;
          max-height: 480px;
          overflow-y: auto;
          z-index: 9999;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
          scrollbar-width: thin;
        }
        .ei-dropdown-wrap:hover .ei-dropdown-menu,
        .ei-dropdown-menu:hover { display: block; }

        .ei-dropdown-item {
          display: block;
          padding: 10px 18px;
          border-bottom: 1px solid #1A1A1A;
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 13px;
          font-weight: 600;
          color: #D1D5DB;
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
        }
        .ei-dropdown-item:last-child { border-bottom: none; }
        .ei-dropdown-item:hover { color: #fff; background: #1C1C1C; }

        /* ── Mobile search bar ── */
        .ei-mobile-search {
          background: #181818;
          border-top: 1px solid #1E1E1E;
          padding: 10px 14px;
        }
        .ei-mobile-search form {
          display: flex;
          align-items: center;
          background: #111;
          border: 1px solid #2A2A2A;
          border-radius: 4px;
          padding: 8px 12px;
          gap: 8px;
        }
        .ei-mobile-search input {
          background: transparent;
          border: none;
          color: #ccc;
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 14px;
          outline: none;
          width: 100%;
        }

        /* ── Mobile drawer ── */
        .ei-mobile-drawer {
          background: #0D0D0D;
          border-top: 1px solid #1E1E1E;
          max-height: calc(100dvh - 100px);
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .ei-drawer-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid #161616;
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 15px;
          color: #E5E7EB;
          text-decoration: none;
          cursor: pointer;
          background: transparent;
          border-left: none;
          border-right: none;
          border-top: none;
          width: 100%;
          text-align: left;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.15s;
        }
        .ei-drawer-item:active, .ei-drawer-item:hover { background: rgba(255,255,255,0.04); }
        .ei-drawer-item.bold { font-weight: 700; }
        .ei-drawer-item.gold { color: #C9A84C; }
        .ei-drawer-item.red { color: #f87171; }
        .ei-drawer-sub {
          display: block;
          padding: 10px 20px 10px 36px;
          border-bottom: 1px solid #111;
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 13.5px;
          color: #D1D5DB;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .ei-drawer-sub:active, .ei-drawer-sub:hover { background: rgba(255,255,255,0.03); color: #AAA; }
        .ei-drawer-divider {
          height: 1px;
          background: #1E1E1E;
          margin: 4px 0;
        }

        /* ── Responsive breakpoints ── */
        @media (max-width: 900px) {
          .ei-nav { display: none; }
          .ei-search-form { display: none !important; }
          .ei-mobile-actions { display: flex !important; }
          .ei-brand-tagline { display: none; }
          .ei-logo-img { width: 44px; height: 44px; }
          .ei-masthead { padding: 10px 14px 0; }
          .ei-topbar { padding: 6px 14px; }
        }
        @media (max-width: 480px) {
          .ei-brand-name { font-size: 18px; }
          .ei-logo-img { width: 38px; height: 38px; }
        }
      `}</style>

      <header className="ei-header">

        {/* ── TOPBAR ── */}
        <div className="ei-topbar">
          <span className="ei-topbar-date" suppressHydrationWarning>{dateStr}</span>
          <div className="ei-lang-group">
            <span className="ei-lang-btn active">বাংলা</span>
            <span className="ei-lang-btn">EN</span>
          </div>
        </div>

        {/* ── MASTHEAD ── */}
        <div className="ei-masthead">
          {/* Brand */}
          <div className="ei-brand">
            <Link href="/" style={{ flexShrink: 0 }}>
              <Image src={Logo} alt="Eastern Insight" width={68} height={68} className="ei-logo-img" priority />
            </Link>
            <div className="ei-brand-text">
              <Link href="/" className="ei-brand-name">ইস্টার্ন ইনসাইট</Link>
              <span className="ei-brand-tagline">A Bangla-first publication on Eastern Asia &amp; Beyond</span>
            </div>
          </div>

          {/* Desktop search */}
          <form className="ei-search-form" onSubmit={handleSearch}>
            <Search size={14} style={{ color: '#444', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="বিষয়, দেশ, বিশ্লেষণ খুঁজুন..."
            />
          </form>

          {/* Mobile action buttons */}
          <div className="ei-mobile-actions">
            <button className="ei-icon-btn" onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }} aria-label="Search">
              <Search size={20} />
            </button>
            <button className="ei-icon-btn" onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── DESKTOP NAV ── */}
        <nav className="ei-nav">
          <div className="ei-nav-inner">
            <Link href="/" className={`ei-nav-link ${pathname === '/' ? 'active' : ''}`}>হোম</Link>

            {mainNavItems.map((cat: Category) => (
              cat.isDropdown && cat.children && cat.children.length > 0 ? (
                <div key={cat._id} className="ei-dropdown-wrap">
                  <Link href={getCategoryHref(cat)} className="ei-dropdown-trigger">
                    {cat.name} <ChevronDown size={10} style={{ opacity: 0.5 }} />
                  </Link>
                  <div className="ei-dropdown-menu">
                    {cat.children.map((sub: SubCategory) => (
                      <Link key={sub._id} href={`/category/${sub.slug}`} className="ei-dropdown-item">
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={cat._id} href={getCategoryHref(cat)} className="ei-nav-link">{cat.name}</Link>
              )
            ))}

            <span className="ei-nav-divider">।</span>
            <Link href="/about" className="ei-nav-link muted">আমাদের সম্পর্কে</Link>
            {session ? (
              <button onClick={() => signOut()} className="ei-nav-link muted" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>লগআউট</button>
            ) : (
              <Link href="/auth/signin" className="ei-nav-link muted">লগইন</Link>
            )}
          </div>
        </nav>

        {/* ── MOBILE SEARCH ── */}
        {searchOpen && (
          <div className="ei-mobile-search">
            <form onSubmit={handleSearch}>
              <Search size={16} style={{ color: '#555', flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="খবর খুঁজুন..."
                autoFocus
              />
            </form>
          </div>
        )}

        {/* ── MOBILE DRAWER ── */}
        {menuOpen && (
          <div className="ei-mobile-drawer">
            <Link href="/" className="ei-drawer-item" onClick={() => setMenuOpen(false)}>
              <span>হোম</span>
            </Link>

            {navItems.filter((c: Category) => c.slug !== 'home').map((cat: Category) => (
              <div key={cat._id}>
                {cat.isDropdown && cat.children && cat.children.length > 0 ? (
                  <>
                    <button
                      className={`ei-drawer-item bold`}
                      onClick={() => setOpenMobileDropdown(openMobileDropdown === cat.slug ? null : cat.slug)}
                    >
                      <span>{cat.name}</span>
                      <ChevronRight size={16} style={{ color: '#444', transform: openMobileDropdown === cat.slug ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                    </button>
                    {openMobileDropdown === cat.slug && cat.children.map((sub: SubCategory) => (
                      <Link key={sub._id} href={`/category/${sub.slug}`} className="ei-drawer-sub" onClick={() => setMenuOpen(false)}>
                        {sub.name}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link href={getCategoryHref(cat)} className="ei-drawer-item" onClick={() => setMenuOpen(false)}>
                    <span>{cat.name}</span>
                  </Link>
                )}
              </div>
            ))}

            <div className="ei-drawer-divider" />
            <Link href="/about" className="ei-drawer-item" onClick={() => setMenuOpen(false)}>
              <span>আমাদের সম্পর্কে</span>
            </Link>
            {session?.user?.role === 'admin' && (
              <Link href="/admin" className="ei-drawer-item gold" onClick={() => setMenuOpen(false)}>
                <span>অ্যাডমিন প্যানেল</span>
              </Link>
            )}
            {session ? (
              <button className="ei-drawer-item red" onClick={() => { signOut(); setMenuOpen(false); }}>
                <span>লগআউট</span>
              </button>
            ) : (
              <Link href="/auth/signin" className="ei-drawer-item gold" onClick={() => setMenuOpen(false)}>
                <span>লগইন</span>
              </Link>
            )}
          </div>
        )}
      </header>

      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', top: 0 }} />
    </>
  );
}
