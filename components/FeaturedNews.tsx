'use client';
import Link from 'next/link';
import Image from 'next/image';

interface Article {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  excerpt?: string;
  image?: string;
  createdAt?: string;
  readTime?: number;
  category: { name: string; slug: string };
  author?: { name: string };
}

interface FeaturedNewsProps {
  news: Article[];
}

function formatBengaliDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  // Use a stable, locale-agnostic format to avoid server/client hydration mismatch.
  // Bengali month names mapped manually from the English month index.
  const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  const day = d.getUTCDate();
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month}, ${year}`;
}

export default function FeaturedNews({ news }: FeaturedNewsProps) {
  const hero = news[0];
  const sidebar = news.slice(1, 6);

  if (!hero) return null;

  return (
    <section className="ei-hero">
      <div className="ei-hero-inner">
        {/* ── MAIN HERO ── */}
        <div className="ei-hero-main">
          <div className="ei-hero-bg-text">E</div>

          <div className="ei-hero-category">
            {hero.category?.name || 'বিশেষ প্রতিবেদন'} · Special Report
          </div>

          <h1 className="ei-hero-title">
            {hero.title}
            {hero.subtitle && <><br /><em>{hero.subtitle}</em></>}
          </h1>

          {hero.excerpt && (
            <p className="ei-hero-deck">
              {hero.excerpt.slice(0, 200)}{hero.excerpt.length > 200 ? '…' : ''}
            </p>
          )}

          <div className="ei-hero-meta">
            <div className="ei-hero-author">
              {hero.author?.name && <><strong>{hero.author.name}</strong> &nbsp;·&nbsp; </>}
              {formatBengaliDate(hero.createdAt)}
              {hero.readTime ? ` &nbsp;·&nbsp; ${hero.readTime} মিনিট পাঠ` : ''}
            </div>
            <Link href={`/news/${hero.slug || hero._id}`} className="ei-read-btn">
              সম্পূর্ণ পড়ুন →
            </Link>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="ei-hero-sidebar">
          <div className="ei-hero-sidebar-header">সাম্প্রতিক বিশ্লেষণ · Recent Analysis</div>
          {sidebar.map((item) => (
            <Link key={item._id} href={`/news/${item.slug || item._id}`} className="ei-hero-sidebar-item">
              <span className="ei-sidebar-tag">{item.category?.name || 'সংবাদ'}</span>
              <div className="ei-sidebar-title">{item.title}</div>
              <span className="ei-sidebar-time">{formatBengaliDate(item.createdAt)}</span>
            </Link>
          ))}
          {sidebar.length === 0 && (
            <div className="ei-hero-sidebar-item" style={{ color: '#555' }}>
              আরো নিবন্ধ শীঘ্রই আসছে
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
