'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from '../assets/logo2.png';
import { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';

const NAV_LINKS = [
  { label: 'হোম', href: '/' },
  { label: 'বিশেষ প্রতিবেদন', href: '/category/bishesh-protibedon' },
  { label: 'ভূরাজনীতি', href: '/category/bhurajniti' },
  { label: 'বাণিজ্য ও সংযোগ', href: '/category/banijjo-o-sanjog' },
  { label: 'ডসিয়ার', href: '/category/dossier' },
  { label: 'সাহিত্য ও বই', href: '/book-review' },
  { label: 'আমাদের সম্পর্কে', href: '/about' },
];

const REGION_LINKS = [
  { label: 'বাংলাদেশ', href: '/category/bangladesh' },
  { label: 'মিয়ানমার', href: '/category/myanmar' },
  { label: 'সেভেন সিস্টার্স', href: '/category/seven-sisters' },
  { label: 'চীন', href: '/category/china' },
  { label: 'আসিয়ান', href: '/category/asean' },
  { label: 'এশিয়ান টাইগার্স', href: '/category/asian-tigers' },
  { label: 'প্রবাসী', href: '/category/probashi' },
];

const TOPIC_LINKS = [
  { label: 'আঞ্চলিক রাজনীতি', href: '/category/ancholik-rajniti' },
  { label: 'নিরাপত্তা ও কৌশল', href: '/category/nirapotta-o-koushol' },
  { label: 'সীমান্ত', href: '/category/simanta' },
  { label: 'অর্থনীতি', href: '/category/orthoniti' },
  { label: 'বিনিয়োগ', href: '/category/biniyog' },
  { label: 'করিডোর', href: '/category/corridor' },
  { label: 'গবেষণা', href: '/category/gobeshona' },
];

const SOCIALS = [
  { icon: <Facebook size={17} />, href: '#', label: 'Facebook' },
  { icon: <Twitter size={17} />, href: '#', label: 'Twitter' },
  { icon: <Instagram size={17} />, href: '#', label: 'Instagram' },
  { icon: <Youtube size={17} />, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
      
      setSubscribed(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'নেটওয়ার্ক ত্রুটি, আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ═══ NEWSLETTER ═══ */
        .ei-nl {
          background: #141414;
          border-top: 2px solid #8B1A1A;
          padding: 48px 24px;
        }
        .ei-nl-inner {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .ei-nl-label {
          font-family: 'Space Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8B1A1A;
          margin-bottom: 12px;
          display: block;
        }
        .ei-nl h2 {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: clamp(18px, 3.5vw, 24px);
          color: #E8E0D0;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 10px;
        }
        .ei-nl p {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 13.5px;
          color: #4A5060;
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .ei-nl-form {
          display: flex;
          gap: 0;
          max-width: 440px;
          margin: 0 auto;
          border: 1px solid #2A2A2A;
          border-radius: 3px;
          overflow: hidden;
        }
        .ei-nl-form input {
          flex: 1;
          padding: 11px 14px;
          background: #0D0D0D;
          border: none;
          color: #ccc;
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 13px;
          outline: none;
          min-width: 0;
        }
        .ei-nl-form input::placeholder { color: #333; }
        .ei-nl-form button {
          padding: 11px 18px;
          background: #8B1A1A;
          border: none;
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          cursor: pointer;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .ei-nl-form button:hover { background: #A52020; }
        .ei-nl-success {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #6BAF7A;
          letter-spacing: 0.06em;
        }

        /* ═══ MAIN FOOTER ═══ */
        .ei-footer {
          background: #0D0D0D;
          padding: 56px 0 0;
          color: #555;
        }
        .ei-footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .ei-footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 40px;
        }

        /* Brand col */
        .ei-footer-brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          text-decoration: none;
        }
        .ei-footer-brand-name {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 17px;
          color: #C8C0B0;
          font-weight: 700;
        }
        .ei-footer-desc {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 13px;
          line-height: 1.8;
          color: #9CA3AF;
          margin-bottom: 18px;
        }
        .ei-footer-desc em { font-style: normal; color: #6B7280; }
        .ei-footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 13px;
          color: #9CA3AF;
        }
        .ei-footer-contact-list a {
          color: #9CA3AF;
          text-decoration: none;
          transition: color 0.2s;
        }
        .ei-footer-contact-list a:hover { color: #888; }
        .ei-footer-contact-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .ei-footer-phone {
          color: #C9A84C !important;
          font-weight: 700;
          font-size: 14px;
        }

        /* Link cols */
        .ei-footer-grid h4 {
          font-family: 'Space Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.16em;
          color: #9CA3AF;
          text-transform: uppercase;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid #1A1A1A;
        }
        .ei-footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ei-footer-links a {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 13px;
          color: #9CA3AF;
          text-decoration: none;
          transition: color 0.2s;
          display: block;
          line-height: 1.5;
        }
        .ei-footer-links a:hover { color: #888; }

        /* Social icons */
        .ei-footer-socials {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        .ei-social-btn {
          width: 34px;
          height: 34px;
          border: 1px solid #222;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #444;
          text-decoration: none;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .ei-social-btn:hover { color: #fff; border-color: #8B1A1A; background: rgba(139,26,26,0.15); }

        /* Contact bar */
        .ei-footer-contact-bar {
          background: #0A0A0A;
          border-top: 1px solid #1A1A1A;
          border-bottom: 1px solid #1A1A1A;
          padding: 18px 24px;
          margin-top: 44px;
        }
        .ei-contact-bar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .ei-contact-label {
          font-family: 'Space Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8B1A1A;
          padding-right: 20px;
          border-right: 1px solid #222;
          flex-shrink: 0;
        }
        .ei-contact-bar-link {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 13px;
          color: #9CA3AF;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .ei-contact-bar-link:hover { color: #C9A84C; }

        /* Bottom bar */
        .ei-footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 18px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ei-footer-copy {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #2A3040;
          letter-spacing: 0.05em;
          line-height: 1.6;
        }
        .ei-footer-bottom-links {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .ei-footer-bottom-links a {
          font-family: 'Space Mono', monospace;
          font-size: 9.5px;
          color: #2A3040;
          text-decoration: none;
          letter-spacing: 0.05em;
          transition: color 0.2s;
        }
        .ei-footer-bottom-links a:hover { color: #666; }

        /* ═══ RESPONSIVE ═══ */
        @media (max-width: 1024px) {
          .ei-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
        }
        @media (max-width: 600px) {
          .ei-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .ei-footer-grid > div:first-child { grid-column: 1 / -1; }
          .ei-footer-container { padding: 0 16px; }
          .ei-footer { padding: 40px 0 0; }
          .ei-nl { padding: 36px 16px; }
          .ei-nl-form { flex-direction: column; border-radius: 4px; overflow: visible; border: none; gap: 8px; }
          .ei-nl-form input {
            border: 1px solid #2A2A2A;
            border-radius: 3px;
            width: 100%;
            box-sizing: border-box;
          }
          .ei-nl-form button { border-radius: 3px; justify-content: center; padding: 12px; }
          .ei-footer-contact-bar { padding: 16px; }
          .ei-contact-label { border-right: none; padding-right: 0; }
          .ei-footer-bottom { flex-direction: column; align-items: flex-start; gap: 10px; padding: 16px; }
          .ei-footer-socials { margin-top: 16px; }
        }
        @media (max-width: 400px) {
          .ei-footer-bottom-links { gap: 10px; }
        }
      `}} />

      {/* ── NEWSLETTER ── */}
      <div className="ei-nl">
        <div className="ei-nl-inner">
          <span className="ei-nl-label">Newsletter</span>
          <h2>সর্বশেষ বিশ্লেষণ সরাসরি আপনার ইনবক্সে</h2>
          <p>ইস্টার্ন ইনসাইট নিউজলেটারে সদস্য হন এবং আঞ্চলিক বিশ্লেষণ, ভূরাজনীতি ও অর্থনীতির গভীর প্রতিবেদন পান।</p>
          {subscribed ? (
            <p className="ei-nl-success">✓ সফলভাবে সাবস্ক্রাইব হয়েছেন। ধন্যবাদ!</p>
          ) : (
            <form className="ei-nl-form" onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="আপনার ইমেইল ঠিকানা"
                    required
                    disabled={loading}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'অপেক্ষা করুন...' : <><Send size={13} /> সদস্য হন</>}
                  </button>
                </div>
                {error && <div style={{ color: '#ef4444', fontSize: '13px' }}>{error}</div>}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── MAIN FOOTER ── */}
      <footer className="ei-footer">
        <div className="ei-footer-container">
          <div className="ei-footer-grid">

            {/* Brand */}
            <div>
              <Link href="/" className="ei-footer-brand-logo">
                <Image src={Logo} alt="Eastern Insight" width={36} height={36} style={{ borderRadius: '5px', objectFit: 'contain' }} />
                <span className="ei-footer-brand-name">ইস্টার্ন ইনসাইট</span>
              </Link>
              <p className="ei-footer-desc">
                বাংলাদেশ ও পূর্ব এশিয়ার আঞ্চলিক বিশ্লেষণ, ভূরাজনীতি এবং অর্থনীতির প্রিমিয়াম প্রকাশনা।
                <em> A Bangla-first publication on Eastern Asia &amp; Beyond.</em>
              </p>
              <div className="ei-footer-contact-list">
                <div className="ei-footer-contact-row">
                  <span>📧</span>
                  <a href="mailto:easterninsight@gmail.com">easterninsight@gmail.com</a>
                </div>
              </div>
              <div className="ei-footer-socials">
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} className="ei-social-btn" aria-label={s.label}>{s.icon}</a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4>নেভিগেশন</h4>
              <ul className="ei-footer-links">
                {NAV_LINKS.map(l => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Regions */}
            <div>
              <h4>অঞ্চলসমূহ</h4>
              <ul className="ei-footer-links">
                {REGION_LINKS.map(l => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Topics */}
            <div>
              <h4>বিষয়ভিত্তিক</h4>
              <ul className="ei-footer-links">
                {TOPIC_LINKS.map(l => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Contact bar */}
        <div className="ei-footer-contact-bar">
          <div className="ei-contact-bar-inner">
            <span className="ei-contact-label">যোগাযোগ</span>
            <a href="mailto:easterninsight@gmail.com" className="ei-contact-bar-link">easterninsight@gmail.com</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ei-footer-bottom">
          <span className="ei-footer-copy">
            © {year} ইস্টার্ন ইনসাইট — সকল অধিকার সংরক্ষিত।
          </span>
          <div className="ei-footer-bottom-links">
            <Link href="/about">আমাদের সম্পর্কে</Link>
            <Link href="/privacy">গোপনীয়তা নীতি</Link>
            <Link href="/terms">শর্তাবলী</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
