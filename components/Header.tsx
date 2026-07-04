'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, User, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Logo from '../assets/logo2.png';

interface Category {
  _id: string;
  name: string;
  slug: string;
  serial: number;
}

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type SessionType = { user?: SessionUser };

export default function Header() {
  const { data: session, status } = useSession() as { data: SessionType | null; status: string };
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([] as Category[]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [dateStr, setDateStr] = useState('');
  const categoryRef = useRef(null as HTMLDivElement | null);

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const days = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
      const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
      const day = days[now.getDay()];
      const month = months[now.getMonth()];
      const date = now.getDate();
      const year = now.getFullYear();
      setDateStr(`${day}, ${date} ${month}, ${year}`);
    };
    updateDate();
    const t = setInterval(updateDate, 60000);
    return () => clearInterval(t);
  }, []);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) setCategories(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* ── TOPBAR ── */}
      <div className="ei-topbar hidden md:block">
        <div className="ei-topbar-inner">
          <span>{dateStr}</span>
          <div className="ei-topbar-lang flex items-center gap-1">
            {session ? (
              <span className="text-[#AAA]">
                {session.user?.name}
                {session.user?.role === 'admin' && (
                  <Link href="/admin" className="ml-2 text-[var(--gold)] hover:underline">অ্যাডমিন</Link>
                )}
                {['admin','editor'].includes(session.user?.role || '') && (
                  <Link href="/editor" className="ml-2 text-[var(--gold)] hover:underline">সম্পাদক</Link>
                )}
              </span>
            ) : null}
            <Link href="#" className="active">বাংলা</Link>
            <Link href="#">EN</Link>
          </div>
        </div>
      </div>

      {/* ── MASTHEAD ── */}
      <header
        className="sticky top-0 z-[100] overflow-visible"
        style={{ background: 'var(--deep)', boxShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
      >
        {/* Logo + search row */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 16px 0' }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left: logo + brand */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image src={Logo} alt="Eastern Insight" width={64} height={64} className="rounded-lg object-contain" style={{ height: '64px', width: '64px' }} />
              </Link>
              <div className="flex flex-col gap-1 min-w-0">
                <Link
                  href="/"
                  className="font-bold text-white hover:text-[var(--gold)] transition-colors whitespace-nowrap"
                  style={{ fontFamily: 'var(--display)', fontSize: 'clamp(20px,4vw,30px)', textShadow: '0 0 40px rgba(201,168,76,0.3)', lineHeight: 1.1 }}
                >
                  ইস্টার্ন ইনসাইট
                </Link>
                <span className="text-[#556070] text-xs italic hidden sm:block" style={{ fontFamily: 'var(--serif)', letterSpacing: '0.04em' }}>
                  A Bangla-first publication on Eastern Asia &amp; Beyond
                </span>
              </div>
            </div>

            {/* Right: search + lang + user */}
            <div className="flex items-center gap-3">
              {/* Search bar desktop */}
              <div className="hidden md:flex items-center gap-2 rounded" style={{ background: '#1E1E1E', border: '1px solid #333', padding: '7px 14px', width: '240px' }}>
                <Search size={14} color="#555" />
                <form onSubmit={handleSearch} className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="বিষয়, দেশ, বিশ্লেষণ খুঁজুন..."
                    className="bg-transparent border-none outline-none w-full text-sm"
                    style={{ color: '#ddd', fontFamily: 'var(--serif)' }}
                  />
                </form>
              </div>

              {/* Session actions desktop */}
              <div className="hidden md:flex items-center gap-2">
                {status === 'authenticated' && session ? (
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors px-2 py-1"
                  >
                    <LogOut size={14} /> লগআউট
                  </button>
                ) : null}
              </div>

              {/* Mobile burger */}
              <button
                className="md:hidden p-2 text-gray-300 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              {/* Mobile search */}
              <button
                className="md:hidden p-2 text-gray-300 hover:text-white"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* ── NAV BAR ── */}
        <nav
          style={{
            background: 'var(--deep)',
            borderTop: '1px solid #222',
            marginTop: '16px',
            position: 'relative',
            zIndex: 200,
            overflow: 'visible',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', flexWrap: 'wrap', gap: 0, overflow: 'visible' }}>
            <Link
              href="/"
              className={`ei-nav-link ${pathname === '/' ? 'active' : ''}`}
              style={{
                color: pathname === '/' ? '#fff' : '#BBB',
                textDecoration: 'none',
                fontFamily: 'var(--serif)',
                fontSize: '13.5px',
                fontWeight: 700,
                letterSpacing: '0.02em',
                padding: '13px 18px',
                whiteSpace: 'nowrap',
                borderBottom: pathname === '/' ? '3px solid var(--crimson)' : '3px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
                display: 'inline-block',
              }}
            >
              হোম
            </Link>

            {loading ? null : (
              <>
                {categories.slice(0, 7).map((cat: Category) => (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.serial}`}
                    style={{
                      color: '#BBB',
                      textDecoration: 'none',
                      fontFamily: 'var(--serif)',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      padding: '13px 18px',
                      whiteSpace: 'nowrap',
                      borderBottom: '3px solid transparent',
                      transition: 'color 0.2s, border-color 0.2s',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.target as HTMLElement).style.color = '#fff'; (e.target as HTMLElement).style.borderBottomColor = '#555'; }}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.target as HTMLElement).style.color = '#BBB'; (e.target as HTMLElement).style.borderBottomColor = 'transparent'; }}
                  >
                    {cat.name}
                  </Link>
                ))}

                <Link
                  href="/book-review"
                  style={{
                    color: '#BBB', textDecoration: 'none', fontFamily: 'var(--serif)', fontSize: '13.5px',
                    fontWeight: 700, letterSpacing: '0.02em', padding: '13px 18px', whiteSpace: 'nowrap',
                    borderBottom: '3px solid transparent', transition: 'color 0.2s', display: 'inline-block',
                  }}
                >
                  বই
                </Link>

                {/* More dropdown */}
                {categories.length > 7 && (
                  <div
                    ref={categoryRef}
                    style={{ position: 'relative', display: 'inline-block', zIndex: 10000 }}
                    onMouseEnter={() => setShowCategoryDropdown(true)}
                    onMouseLeave={() => setShowCategoryDropdown(false)}
                  >
                    <button
                      style={{
                        color: '#BBB', background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: 'var(--serif)', fontSize: '13.5px', fontWeight: 700,
                        padding: '13px 18px', display: 'flex', alignItems: 'center', gap: '4px',
                        borderBottom: '3px solid transparent',
                      }}
                    >
                      আরো {showCategoryDropdown ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    </button>
                    {showCategoryDropdown && (
                      <div style={{
                        display: 'block', position: 'absolute', top: '100%', left: 0,
                        background: '#111', border: '1px solid #2A2A2A', borderTop: '2px solid var(--crimson)',
                        width: 'max-content', minWidth: '220px', maxHeight: '480px', overflowY: 'auto',
                        zIndex: 999, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      }}>
                        {categories.slice(7).map((cat: Category) => (
                          <Link
                            key={cat._id}
                            href={`/category/${cat.serial}`}
                            onClick={() => setShowCategoryDropdown(false)}
                            style={{
                              display: 'block', padding: '11px 20px', borderBottom: '1px solid #1C1C1C',
                              fontSize: '13px', fontWeight: 600, color: '#AAA', textDecoration: 'none',
                              fontFamily: 'var(--serif)',
                            }}
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            <span style={{ color: '#333', fontSize: '18px', padding: '0 4px', alignSelf: 'center', userSelect: 'none' }}>।</span>
            <Link
              href="/auth/signin"
              style={{
                color: '#666', textDecoration: 'none', fontFamily: 'var(--serif)',
                fontSize: '12px', fontStyle: 'italic', padding: '13px 18px',
                borderBottom: '3px solid transparent', display: 'inline-block',
              }}
            >
              {session ? 'প্রোফাইল' : 'লগইন'}
            </Link>
          </div>
        </nav>

        {/* Mobile search */}
        {isSearchOpen && (
          <div style={{ background: '#1A1A1A', padding: '12px 16px' }}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="খবর খুঁজুন..."
                  autoFocus
                  className="w-full px-4 py-2 pl-10 text-sm text-white border border-gray-600 rounded outline-none"
                  style={{ background: '#111', fontFamily: 'var(--serif)' }}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {isMenuOpen && (
          <div style={{ background: '#0D0D0D', borderTop: '1px solid #222' }}>
            <div className="flex flex-col py-2">
              <Link href="/" onClick={() => setIsMenuOpen(false)} style={{ color: '#BBB', padding: '10px 20px', fontFamily: 'var(--serif)', fontSize: '14px', borderBottom: '1px solid #1A1A1A' }}>হোম</Link>
              {categories.map((cat: Category) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.serial}`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ color: '#BBB', padding: '10px 20px', fontFamily: 'var(--serif)', fontSize: '14px', borderBottom: '1px solid #1A1A1A' }}
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/book-review" onClick={() => setIsMenuOpen(false)} style={{ color: '#BBB', padding: '10px 20px', fontFamily: 'var(--serif)', fontSize: '14px', borderBottom: '1px solid #1A1A1A' }}>বই</Link>
              {session ? (
                <>
                  {session.user?.role === 'admin' && <Link href="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--gold)', padding: '10px 20px', fontSize: '14px', borderBottom: '1px solid #1A1A1A' }}>অ্যাডমিন</Link>}
                  {['admin','editor'].includes(session.user?.role || '') && <Link href="/editor" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--gold)', padding: '10px 20px', fontSize: '14px', borderBottom: '1px solid #1A1A1A' }}>সম্পাদক</Link>}
                  <button onClick={() => { signOut(); setIsMenuOpen(false); }} style={{ color: '#f87171', padding: '10px 20px', textAlign: 'left', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>লগআউট</button>
                </>
              ) : (
                <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--gold)', padding: '10px 20px', fontSize: '14px' }}>লগইন</Link>
              )}
            </div>
          </div>
        )}
      </header>

      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', top: '0' }}></div>
    </>
  );
}
