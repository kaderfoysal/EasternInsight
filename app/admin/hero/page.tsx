'use client';

import { useEffect, useState } from 'react';
import { Star, RefreshCw, CheckCircle, AlertCircle, Search } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: { name: string };
  author?: { name: string };
  createdAt: string;
  featured: boolean;
  isHero: boolean;
}

export default function HeroSettingsPage() {
  const [articles, setArticles] = useState([] as Article[]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null as string | null);
  const [toast, setToast] = useState(null as { msg: string; type: 'success' | 'error' } | null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    try {
      const res = await fetch('/api/news?limit=50&sortBy=createdAt&sortOrder=desc');
      if (res.ok) {
        const data = await res.json();
        setArticles(data.news || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function toggleHero(article: Article) {
    setSaving(article._id);
    try {
      const res = await fetch(`/api/news/${article._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHero: !article.isHero }),
      });
      if (res.ok) {
        setArticles((prev: Article[]) => prev.map((a: Article) => a._id === article._id ? { ...a, isHero: !a.isHero } : a));
        showToast(!article.isHero ? 'হিরো হিসেবে সেট করা হয়েছে' : 'হিরো থেকে সরানো হয়েছে', 'success');
      } else {
        showToast('সংরক্ষণ ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      showToast('নেটওয়ার্ক ত্রুটি', 'error');
    } finally {
      setSaving(null);
    }
  }

  async function toggleFeatured(article: Article) {
    setSaving(article._id + 'f');
    try {
      const res = await fetch(`/api/news/${article._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !article.featured }),
      });
      if (res.ok) {
        setArticles((prev: Article[]) => prev.map((a: Article) => a._id === article._id ? { ...a, featured: !a.featured } : a));
        showToast(!article.featured ? 'ফিচার্ড হিসেবে সেট করা হয়েছে' : 'ফিচার্ড থেকে সরানো হয়েছে', 'success');
      } else {
        showToast('সংরক্ষণ ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      showToast('নেটওয়ার্ক ত্রুটি', 'error');
    } finally {
      setSaving(null);
    }
  }

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const filtered = articles.filter((a: Article) =>
    !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const heroCount = articles.filter((a: Article) => a.isHero).length;
  const featuredCount = articles.filter((a: Article) => a.featured).length;

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          background: toast.type === 'success' ? '#0D2B1A' : '#2B0D0D',
          border: `1px solid ${toast.type === 'success' ? '#4A7C59' : '#8B1A1A'}`,
          borderRadius: '4px', padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontFamily: "'Space Mono', monospace", fontSize: '11px',
          color: toast.type === 'success' ? '#4A7C59' : '#C9A84C',
        }}>
          {toast.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', color: '#8B1A1A', textTransform: 'uppercase', marginBottom: '8px' }}>Admin · Hero Settings</div>
        <h1 style={{ fontFamily: "'Kalpurush', Georgia, serif", fontSize: '26px', color: '#E0DAD0', fontWeight: 700, marginBottom: '4px' }}>হিরো ও ফিচার্ড সেটিংস</h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3A4050' }}>
          হোমপেজের প্রধান নিবন্ধ (হিরো) এবং বিশেষ প্রতিবেদন (ফিচার্ড) নিয়ন্ত্রণ করুন।
          বর্তমানে <strong style={{ color: '#8B1A1A' }}>{heroCount}</strong> হিরো এবং <strong style={{ color: '#C9A84C' }}>{featuredCount}</strong> ফিচার্ড নিবন্ধ রয়েছে।
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { color: '#8B1A1A', bg: 'rgba(139,26,26,0.15)', label: 'HERO — হোমপেজ প্রধান নিবন্ধ (সাইডবার সহ)' },
          { color: '#C9A84C', bg: 'rgba(201,168,76,0.1)', label: 'FEATURED — বিশেষ প্রতিবেদন গ্রিডে' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3A4050' }}>
            <span style={{ width: '10px', height: '10px', background: l.bg, border: `1px solid ${l.color}`, borderRadius: '2px', display: 'inline-block' }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Search + refresh */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0D1117', border: '1px solid #1A2030', borderRadius: '3px', padding: '8px 12px', flex: 1, maxWidth: '320px' }}>
          <Search size={14} style={{ color: '#3A4050' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="নিবন্ধ খুঁজুন..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#C8C0B0', fontFamily: "'Kalpurush', Georgia, serif", fontSize: '13px', width: '100%' }}
          />
        </div>
        <button
          onClick={fetchArticles}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#0D1117', border: '1px solid #1A2030', borderRadius: '3px', color: '#3A4050', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '10px', transition: 'all 0.2s' }}
        >
          <RefreshCw size={13} /> রিফ্রেশ
        </button>
      </div>

      {/* Articles table */}
      <div style={{ background: '#0D1117', border: '1px solid #1A2030', borderRadius: '4px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#2A3040' }}>লোড হচ্ছে...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1A2030' }}>
                  {['শিরোনাম', 'বিভাগ', 'তারিখ', 'হিরো', 'ফিচার্ড'].map((h: string) => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', color: '#2A3040', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((article: Article) => (
                  <tr key={article._id} style={{ borderBottom: '1px solid #0F1419' }}>
                    <td style={{ padding: '14px 16px', maxWidth: '320px' }}>
                      <div style={{ fontFamily: "'Kalpurush', Georgia, serif", fontSize: '13px', color: article.isHero ? '#fff' : '#C8C0B0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.isHero && <Star size={10} style={{ color: '#8B1A1A', display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />}
                        {article.title}
                      </div>
                      {article.author?.name && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#2A3040', marginTop: '4px' }}>{article.author.name}</div>}
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#C9A84C', background: 'rgba(201,168,76,0.1)', padding: '2px 6px', borderRadius: '2px' }}>
                        {article.category?.name || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3A4050', whiteSpace: 'nowrap' }}>
                      {formatDate(article.createdAt)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => toggleHero(article)}
                        disabled={saving === article._id}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '3px',
                          border: `1px solid ${article.isHero ? '#8B1A1A' : '#1A2030'}`,
                          background: article.isHero ? 'rgba(139,26,26,0.2)' : 'transparent',
                          color: article.isHero ? '#C9A84C' : '#3A4050',
                          cursor: 'pointer',
                          fontFamily: "'Space Mono', monospace",
                          fontSize: '9px',
                          letterSpacing: '0.1em',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap',
                          opacity: saving === article._id ? 0.5 : 1,
                        }}
                      >
                        {saving === article._id ? '...' : article.isHero ? '✓ HERO' : 'HERO সেট'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => toggleFeatured(article)}
                        disabled={saving === article._id + 'f'}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '3px',
                          border: `1px solid ${article.featured ? '#C9A84C' : '#1A2030'}`,
                          background: article.featured ? 'rgba(201,168,76,0.1)' : 'transparent',
                          color: article.featured ? '#C9A84C' : '#3A4050',
                          cursor: 'pointer',
                          fontFamily: "'Space Mono', monospace",
                          fontSize: '9px',
                          letterSpacing: '0.1em',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap',
                          opacity: saving === article._id + 'f' ? 0.5 : 1,
                        }}
                      >
                        {saving === article._id + 'f' ? '...' : article.featured ? '✓ FEATURED' : 'FEATURED সেট'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#2A3040' }}>
                      কোনো নিবন্ধ পাওয়া যায়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
