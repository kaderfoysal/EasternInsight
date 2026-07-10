import { Metadata } from 'next';
import FeaturedNews from '@/components/FeaturedNews';
import NewsCard from '@/components/NewsCard';
import GoogleAdBanner from '@/components/GoogleAdBanner';
import dbConnect from '@/lib/mongodb';
import Video from '@/lib/models/Video';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'ইস্টার্ন ইনসাইট | Eastern Insight — আঞ্চলিক বিশ্লেষণ ও কৌশলগত গোয়েন্দা তথ্য',
  description: 'বাংলাদেশ ও পূর্ব এশিয়ার আঞ্চলিক বিশ্লেষণ, ভূরাজনীতি এবং অর্থনীতির প্রিমিয়াম প্রকাশনা।',
};

const BASE = process.env.NEXTAUTH_URL || 'http://localhost:3000';

async function fetchJson(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getHeroNews() {
  const data = await fetchJson(`${BASE}/api/news?featured=true&limit=6&sortBy=priority&sortOrder=asc`);
  return data?.news || [];
}

async function getLatestNews() {
  const data = await fetchJson(`${BASE}/api/news?limit=9&sortBy=createdAt&sortOrder=desc`);
  return data?.news || [];
}

async function getSectionNews(section: string, limit = 3) {
  const data = await fetchJson(`${BASE}/api/news?section=${section}&limit=${limit}&sortBy=createdAt&sortOrder=desc`);
  return data?.news || [];
}

async function getCategories() {
  const data = await fetchJson(`${BASE}/api/categories`);
  return Array.isArray(data) ? data : [];
}

async function getVideos() {
  try {
    await dbConnect();
    const videos = await Video.find({ published: true }).sort({ createdAt: -1 }).limit(4).lean().exec();
    return videos.map((v: any) => ({
      _id: v._id?.toString() || '',
      title: v.title || '',
      youtubeVideoId: v.youtubeVideoId || '',
      thumbnailUrl: v.thumbnailUrl || '',
      category: v.category || '',
      createdAt: v.createdAt ? new Date(v.createdAt).toISOString() : new Date().toISOString(),
    }));
  } catch { return []; }
}

function formatDate(d?: string) {
  if (!d) return '';
  const dt = new Date(d);
  const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  return `${dt.getUTCDate()} ${months[dt.getUTCMonth()]}, ${dt.getUTCFullYear()}`;
}


const REGIONS = [
  { name: 'বাংলাদেশ', flagClass: 'ei-flag-bd', href: '/category/1', count: '' },
  { name: 'মিয়ানমার', flagClass: 'ei-flag-mm', href: '/category/2', count: '' },
  { name: 'সেভেন সিস্টার্স', flagClass: 'ei-flag-7s', href: '/category/3', count: '' },
  { name: 'চীন', flagClass: 'ei-flag-cn', href: '/category/4', count: '' },
  { name: 'আসিয়ান', flagClass: 'ei-flag-asean', href: '/category/5', count: '' },
  { name: 'এশিয়ান টাইগার্স', flagClass: 'ei-flag-tigers', href: '/category/6', count: '' },
];

const ARCHIVE_ITEMS = [
  { icon: '📁', title: 'বিশেষ প্রতিবেদন', deck: 'সকল বিশ্লেষণ', href: '/#special-reports' },
  { icon: '🗺️', title: 'ভূরাজনীতি', deck: 'কৌশলগত বিশ্লেষণ', href: '/#geopolitics' },
  { icon: '📊', title: 'অর্থনীতি', deck: 'বাণিজ্য ও বিনিয়োগ', href: '/#trade' },
  { icon: '📚', title: 'ডসিয়ার', deck: 'দেশ পরিচিতি', href: '/book-review' },
  { icon: '🌏', title: 'প্রবাসী', deck: 'ডায়াসপোরা সংবাদ', href: '/#diaspora' },
];

export default async function HomePage() {
  const [heroNews, latestNews, geoNews, tradeNews, analysisNews, categories, videos] = await Promise.all([
    getHeroNews(),
    getLatestNews(),
    getSectionNews('geopolitics', 4),
    getSectionNews('trade', 4),
    getSectionNews('analysis', 3),
    getCategories(),
    getVideos(),
  ]);

  // Fallback: if no section-tagged articles, use latest
  const geoArticles = geoNews.length > 0 ? geoNews : latestNews.slice(0, 4);
  const tradeArticles = tradeNews.length > 0 ? tradeNews : latestNews.slice(4, 8);
  const analysisArticles = analysisNews.length > 0 ? analysisNews : latestNews.slice(0, 3);

  // Update region pill counts from categories
  const updatedRegions = REGIONS.map((r, i) => {
    const cat = categories[i];
    return { ...r, count: cat ? '' : '' };
  });

  return (
    <div style={{ background: 'var(--paper)' }}>



      {/* ── HERO ── */}
      {heroNews.length > 0 && <FeaturedNews news={heroNews} />}

      {/* ── AD STRIP ── */}
      <div className="ei-ad-strip">বিজ্ঞাপন · ADVERTISEMENT</div>

      {/* ── SPECIAL REPORTS ── */}
      <section id="special-reports" className="ei-special-reports">
        <div className="ei-container">
          <div className="ei-section-header">
            <div className="section-rule" />
            <div>
              <h2 className="ei-section-title">বিশেষ প্রতিবেদন <span className="ei-section-title-en">SPECIAL REPORTS</span></h2>
            </div>
            <Link href="/categories" className="ei-section-link">সবগুলো →</Link>
          </div>
          <div className="ei-reports-grid">
            {latestNews.slice(0, 3).map((article: any, i: number) => (
              <NewsCard key={article._id} article={article} variant={i === 0 ? 'featured' : 'default'} />
            ))}
            {latestNews.length === 0 && (
              <div style={{ padding: '48px', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '12px' }}>
                কোনো নিবন্ধ পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── REGIONS STRIP ── */}
      <section className="ei-regional-band">
        <div className="ei-container">
          <div className="ei-section-header">
            <div className="section-rule" />
            <div><h2 className="ei-section-title">অঞ্চলসমূহ <span className="ei-section-title-en">REGIONS</span></h2></div>
          </div>
          <div className="ei-region-scroll">
            {updatedRegions.map((region) => (
              <Link key={region.name} href={region.href} className="ei-region-pill">
                <span className={`ei-flag-badge ${region.flagClass}`} />
                <span className="ei-region-name">{region.name}</span>
                <span className="ei-region-count">বিশ্লেষণ</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── GEOPOLITICS (DARK) ── */}
      <section id="geopolitics" className="ei-two-col-section dark">
        <div className="ei-container">
          <div className="ei-section-header">
            <div className="section-rule" />
            <div><h2 className="ei-section-title">ভূরাজনীতি <span className="ei-section-title-en">GEOPOLITICS</span></h2></div>
            <Link href="/categories" className="ei-section-link">সবগুলো →</Link>
          </div>
          <div className="ei-two-col-grid">
            <div>
              <span className="ei-sub-section-label">আঞ্চলিক রাজনীতি ও নিরাপত্তা</span>
              {geoArticles.slice(0, 3).map((a: any, i: number) => (
                <Link key={a._id} href={`/news/${a.slug || a._id}`} className="ei-list-article" style={{ textDecoration: 'none', display: 'flex', gap: '16px', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="ei-art-num">০{i + 1}</span>
                  <div className="ei-art-body">
                    <span className="ei-art-tag">{a.category?.name || 'ভূরাজনীতি'}</span>
                    <div className="ei-art-title">{a.title}</div>
                    <div className="ei-art-meta"><span>{formatDate(a.createdAt)}</span></div>
                  </div>
                </Link>
              ))}
            </div>
            <div>
              <span className="ei-sub-section-label">আন্তর্জাতিক সম্পর্ক</span>
              {(geoArticles.length > 3 ? geoArticles.slice(3) : latestNews.slice(0, 3)).map((a: any, i: number) => (
                <Link key={a._id} href={`/news/${a.slug || a._id}`} className="ei-list-article" style={{ textDecoration: 'none', display: 'flex', gap: '16px', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="ei-art-num">০{i + 1}</span>
                  <div className="ei-art-body">
                    <span className="ei-art-tag">{a.category?.name || 'সম্পর্ক'}</span>
                    <div className="ei-art-title">{a.title}</div>
                    <div className="ei-art-meta"><span>{formatDate(a.createdAt)}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AD STRIP ── */}
      <div className="ei-ad-strip">বিজ্ঞাপন · ADVERTISEMENT</div>

      {/* ── TRADE & CONNECTIVITY (LIGHT) ── */}
      <section id="trade" className="ei-two-col-section" style={{ background: 'var(--paper)' }}>
        <div className="ei-container">
          <div className="ei-section-header">
            <div className="section-rule" />
            <div><h2 className="ei-section-title">বাণিজ্য ও সংযোগ <span className="ei-section-title-en">TRADE &amp; CONNECTIVITY</span></h2></div>
            <Link href="/categories" className="ei-section-link">সবগুলো →</Link>
          </div>
          <div className="ei-two-col-grid">
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '9.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--crimson)', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.1)', marginBottom: '4px' }}>অর্থনীতি ও বাণিজ্য</span>
              {tradeArticles.slice(0, 3).map((a: any, i: number) => (
                <Link key={a._id} href={`/news/${a.slug || a._id}`} className="ei-list-article" style={{ textDecoration: 'none', display: 'flex', gap: '16px', padding: '18px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <span className="ei-art-num">০{i + 1}</span>
                  <div>
                    <span className="ei-art-tag" style={{ color: 'var(--crimson)' }}>{a.category?.name || 'বাণিজ্য'}</span>
                    <div className="ei-art-title">{a.title}</div>
                    <div className="ei-art-meta"><span>{formatDate(a.createdAt)}</span></div>
                  </div>
                </Link>
              ))}
            </div>
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '9.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--crimson)', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.1)', marginBottom: '4px' }}>করিডোর ও অবকাঠামো</span>
              {(tradeArticles.length > 3 ? tradeArticles.slice(3) : latestNews.slice(3, 6)).map((a: any, i: number) => (
                <Link key={a._id} href={`/news/${a.slug || a._id}`} className="ei-list-article" style={{ textDecoration: 'none', display: 'flex', gap: '16px', padding: '18px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <span className="ei-art-num">০{i + 1}</span>
                  <div>
                    <span className="ei-art-tag" style={{ color: 'var(--crimson)' }}>{a.category?.name || 'অবকাঠামো'}</span>
                    <div className="ei-art-title">{a.title}</div>
                    <div className="ei-art-meta"><span>{formatDate(a.createdAt)}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ANALYSIS GRID ── */}
      {analysisArticles.length > 0 && (
        <section id="analysis" className="ei-analysis-section">
          <div className="ei-container">
            <div className="ei-section-header">
              <div className="section-rule" />
              <div><h2 className="ei-section-title">গভীর বিশ্লেষণ <span className="ei-section-title-en">IN-DEPTH ANALYSIS</span></h2></div>
              <Link href="/categories" className="ei-section-link">সবগুলো →</Link>
            </div>
            <div className="ei-analysis-grid">
              {analysisArticles.map((a: any) => (
                <Link key={a._id} href={`/news/${a.slug || a._id}`} className="ei-analysis-card" style={{ textDecoration: 'none' }}>
                  <span className="ei-card-tag">{a.category?.name || 'বিশ্লেষণ'}</span>
                  <h3 className="ei-card-title" style={{ fontSize: '18px', marginBottom: '10px' }}>{a.title}</h3>
                  {a.excerpt && <p className="ei-card-deck" style={{ fontSize: '13px' }}>{a.excerpt.slice(0, 100)}…</p>}
                  <div className="ei-card-meta" style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    {a.author?.name && <span>{a.author.name}</span>}
                    <span>{formatDate(a.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VIDEOS / INTERVIEWS ── */}
      {videos.length > 0 && (
        <section style={{ padding: '64px 0 56px', background: 'var(--slate)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="ei-container">
            <div className="ei-section-header">
              <div className="section-rule" />
              <div><h2 className="ei-section-title" style={{ color: '#E0DAD0' }}>সাক্ষাতকার <span className="ei-section-title-en" style={{ color: '#556070' }}>INTERVIEWS</span></h2></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {videos.map((v: any) => (
                <a
                  key={v._id}
                  href={`https://www.youtube.com/watch?v=${v.youtubeVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#1A2030', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                    {v.thumbnailUrl ? (
                      <Image src={v.thumbnailUrl} alt={v.title} fill className="object-cover" sizes="300px" />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '40px' }}>▶</span>
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                      <div style={{ width: '48px', height: '48px', background: 'var(--crimson)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#fff' }}>▶</div>
                    </div>
                  </div>
                  <span className="ei-card-tag">{v.category || 'ভিডিও'}</span>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '14px', color: '#C8C0B0', lineHeight: 1.4, fontWeight: 600 }}>{v.title}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#444', marginTop: '6px' }}>{formatDate(v.createdAt)}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ARCHIVE STRIP ── */}
      <section style={{ padding: '64px 0 56px', background: 'var(--ink)' }}>
        <div className="ei-container">
          <div className="ei-section-header">
            <div className="section-rule" />
            <div><h2 className="ei-section-title" style={{ color: '#E0DAD0' }}>আর্কাইভ <span className="ei-section-title-en" style={{ color: '#445' }}>ARCHIVE</span></h2></div>
          </div>
          <div className="ei-archive-grid">
            {ARCHIVE_ITEMS.map((item) => (
              <Link key={item.title} href={item.href} className="ei-archive-item" style={{ textDecoration: 'none' }}>
                <div className="ei-archive-icon">{item.icon}</div>
                <div className="ei-card-title" style={{ fontSize: '14px', color: '#E5E7EB', margin: 0 }}>{item.title}</div>
                <div className="ei-card-deck" style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>{item.deck}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS GRID ── */}
      {latestNews.length > 3 && (
        <section style={{ padding: '64px 0 56px', background: '#EDE8DC', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div className="ei-container">
            <div className="ei-section-header">
              <div className="section-rule" />
              <div><h2 className="ei-section-title">সর্বশেষ সংবাদ <span className="ei-section-title-en">LATEST NEWS</span></h2></div>
              <Link href="/categories" className="ei-section-link">সবগুলো →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {latestNews.slice(3, 9).map((article: any) => (
                <NewsCard key={article._id} article={article} variant="default" />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
