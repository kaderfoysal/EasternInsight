'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from '../assets/logo2.png';
import { useEffect, useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface Category { _id: string; name: string; slug: string; serial: number; }

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState([] as Category[]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.ok ? r.json() : [])
      .then(setCategories)
      .catch(() => { });
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  };

  return (
    <>
      {/* ── NEWSLETTER ── */}
      <div className="ei-newsletter-section">
        <div className="ei-newsletter-inner">
          <h2>সর্বশেষ বিশ্লেষণ সরাসরি আপনার ইনবক্সে</h2>
          <p>ইস্টার্ন ইনসাইট নিউজলেটারে সদস্য হন এবং আঞ্চলিক বিশ্লেষণ, ভূরাজনীতি ও অর্থনীতির গভীর প্রতিবেদন পান।</p>
          {subscribed ? (
            <p style={{ color: '#fff', fontFamily: 'var(--mono)', fontSize: '13px', letterSpacing: '0.06em' }}>
              ✓ সফলভাবে সাবস্ক্রাইব হয়েছেন
            </p>
          ) : (
            <form className="ei-newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল ঠিকানা"
                required
              />
              <button type="submit">সদস্য হন</button>
            </form>
          )}
        </div>
      </div>

      {/* ── MAIN FOOTER ── */}
      <footer style={{ background: '#0D0D0D', paddingTop: '56px', color: '#555' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '48px' }}>

            {/* Brand column */}
            <div>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', textDecoration: 'none' }}>
                <Image src={Logo} alt="Eastern Insight" width={36} height={36} style={{ borderRadius: '4px', objectFit: 'contain' }} />
                <span style={{ fontFamily: 'var(--display)', fontSize: '18px', color: '#ccc', fontWeight: 700 }}>ইস্টার্ন ইনসাইট</span>
              </Link>
              <p style={{ fontSize: '13px', lineHeight: 1.75, color: '#4A5060', marginBottom: '16px' }}>
                বাংলাদেশ ও পূর্ব এশিয়ার আঞ্চলিক বিশ্লেষণ, ভূরাজনীতি এবং অর্থনীতির প্রিমিয়াম প্রকাশনা।
                <em style={{ fontStyle: 'normal', color: '#888', fontWeight: 600 }}> A Bangla-first publication on Eastern Asia &amp; Beyond.</em>
              </p>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '13px', color: '#888', lineHeight: 2 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '13px' }}>📍</span>
                  <span>প্লানার্স টাওয়ার, সোনারগাঁও রোড, ঢাকা-১০০০</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span>📧</span>
                  <a href="mailto:easterninsight@gmail.com" style={{ color: '#888', textDecoration: 'none' }}>easterninsight@gmail.com</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span>📞</span>
                  <strong style={{ color: 'var(--gold)', fontSize: '14px' }}>+৮৮০ ১৭৭০ ১৯৮২৭৭</strong>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.14em', color: '#666', textTransform: 'uppercase', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #1E1E1E' }}>নেভিগেশন</h4>
              <ul style={{ listStyle: 'none' }}>
                {[{ label: 'হোম', href: '/' }, { label: 'বিশেষ প্রতিবেদন', href: '/#special-reports' }, { label: 'ভূরাজনীতি', href: '/#geopolitics' }, { label: 'বাণিজ্য ও সংযোগ', href: '/#trade' }, { label: 'বই পর্যালোচনা', href: '/book-review' }, { label: 'আমাদের সম্পর্কে', href: '/about' }].map(l => (
                  <li key={l.label} style={{ marginBottom: '10px' }}>
                    <Link href={l.href} style={{ color: '#444', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLElement).style.color = '#999'}
                      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLElement).style.color = '#444'}
                    >{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Regions */}
            <div>
              <h4 style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.14em', color: '#666', textTransform: 'uppercase', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #1E1E1E' }}>অঞ্চলসমূহ</h4>
              <ul style={{ listStyle: 'none' }}>
                {[{ label: 'বাংলাদেশ', href: '/category/1' }, { label: 'মিয়ানমার', href: '/category/2' }, { label: 'সেভেন সিস্টার্স', href: '/category/3' }, { label: 'চীন', href: '/category/4' }, { label: 'আসিয়ান', href: '/category/5' }, { label: 'এশিয়ান টাইগার্স', href: '/category/6' }].map(l => (
                  <li key={l.label} style={{ marginBottom: '10px' }}>
                    <Link href={l.href} style={{ color: '#444', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLElement).style.color = '#999'}
                      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLElement).style.color = '#444'}
                    >{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories dynamic */}
            <div>
              <h4 style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.14em', color: '#666', textTransform: 'uppercase', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #1E1E1E' }}>সংবাদ বিভাগ</h4>
              <ul style={{ listStyle: 'none' }}>
                {categories.slice(0, 8).map((cat: Category) => (
                  <li key={cat._id} style={{ marginBottom: '10px' }}>
                    <Link href={`/category/${cat.serial}`} style={{ color: '#444', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLElement).style.color = '#999'}
                      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLElement).style.color = '#444'}
                    >{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact bar */}
        <div style={{ background: '#0A0A0A', borderTop: '1px solid #1E1E1E', borderBottom: '1px solid #1E1E1E', padding: '20px 24px', marginTop: '40px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--crimson)', paddingRight: '24px', borderRight: '1px solid #2A2A2A' }}>যোগাযোগ</span>
            <a href="mailto:easterninsight@gmail.com" style={{ fontFamily: 'var(--serif)', fontSize: '13.5px', color: '#888', textDecoration: 'none', fontWeight: 700, transition: 'color 0.2s' }}>easterninsight@gmail.com</a>
            <a href="tel:+8801770198277" style={{ fontFamily: 'var(--serif)', fontSize: '13.5px', color: '#888', textDecoration: 'none', fontWeight: 700, transition: 'color 0.2s' }}>+৮৮০ ১৭৭০ ১৯৮২৭৭</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px', marginTop: 0, borderTop: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--mono)', fontSize: '10px', color: '#333', letterSpacing: '0.05em', flexWrap: 'wrap', gap: '12px' }}>
          <span>© {currentYear} ইস্টার্ন ইনসাইট — সকল অধিকার সংরক্ষিত।</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[{ icon: <Facebook size={16} />, href: '#' }, { icon: <Twitter size={16} />, href: '#' }, { icon: <Instagram size={16} />, href: '#' }, { icon: <Youtube size={16} />, href: '#' }].map((s, i) => (
              <a key={i} href={s.href} style={{ color: '#333', transition: 'color 0.2s' }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLElement).style.color = '#666'}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLElement).style.color = '#333'}
              >{s.icon}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
