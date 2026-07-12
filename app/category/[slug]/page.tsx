import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import News from '@/lib/models/News';
import User from '@/lib/models/User';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

async function getCategoryBySlug(slug: string) {
  await dbConnect();
  const category = await Category.findOne({ slug }).lean();
  if (!category) return null;
  return JSON.parse(JSON.stringify(category));
}

async function getNewsByCategory(categoryId: string, page = 1, limit = 12) {
  await dbConnect();
  // Register User model for population
  void User;
  const skip = (page - 1) * limit;
  const [news, total] = await Promise.all([
    News.find({ category: categoryId, published: true })
      .sort({ priority: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .lean(),
    News.countDocuments({ category: categoryId, published: true }),
  ]);
  return {
    news: JSON.parse(JSON.stringify(news)),
    pagination: { total, pages: Math.ceil(total / limit), page },
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: 'বিভাগ পাওয়া যায়নি' };
  return {
    title: `${category.name} — ইস্টার্ন ইনসাইট`,
    description: category.description || `${category.name} বিভাগের সর্বশেষ সংবাদ ও বিশ্লেষণ`,
  };
}

function formatBanglaDate(iso: string) {
  const d = new Date(iso);
  const bn = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  return `${d.getDate()} ${bn[d.getMonth()]}, ${d.getFullYear()}`;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return notFound();

  const page = parseInt(searchParams.page || '1');
  const { news, pagination } = await getNewsByCategory(category._id, page);
  const featured = news[0];
  const rest = news.slice(1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Category Page ── */
        .cp-wrap {
          background: #F7F3ED;
          min-height: 100vh;
          padding-bottom: 60px;
        }
        .cp-accent { height: 3px; background: linear-gradient(90deg, #8B1A1A 0%, #C9A84C 100%); }
        .cp-container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* breadcrumb */
        .cp-breadcrumb {
          padding: 14px 0 12px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #888;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #E0D8CE;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cp-breadcrumb a { color: #888; text-decoration: none; }
        .cp-breadcrumb a:hover { color: #8B1A1A; }

        /* Category header */
        .cp-header {
          margin-bottom: 36px;
          padding-bottom: 20px;
          border-bottom: 3px solid #1a1a1a;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .cp-header-left {}
        .cp-cat-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #8B1A1A;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .cp-cat-title {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 700;
          color: #111;
          line-height: 1.1;
          margin: 0;
        }
        .cp-cat-desc {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 15px;
          color: #666;
          margin-top: 8px;
        }
        .cp-cat-count {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #888;
          white-space: nowrap;
          padding-bottom: 6px;
        }

        /* ── Featured Article ── */
        .cp-featured {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          background: #fff;
          border: 1px solid #E8E0D4;
          margin-bottom: 40px;
          overflow: hidden;
          text-decoration: none;
          transition: box-shadow 0.25s;
        }
        .cp-featured:hover { box-shadow: 0 8px 40px rgba(0,0,0,0.12); }
        .cp-featured-img {
          position: relative;
          height: 380px;
          overflow: hidden;
          background: #ddd;
        }
        .cp-featured-img img { object-fit: cover; transition: transform 0.4s; }
        .cp-featured:hover .cp-featured-img img { transform: scale(1.03); }
        .cp-featured-body {
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-left: 4px solid #8B1A1A;
        }
        .cp-featured-tag {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          color: #8B1A1A;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .cp-featured-title {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 700;
          color: #111;
          line-height: 1.5;
          margin: 0 0 16px;
        }
        .cp-featured-excerpt {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 15px;
          color: #555;
          line-height: 1.9;
          margin-bottom: 24px;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .cp-featured-meta {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #aaa;
          display: flex;
          gap: 14px;
          align-items: center;
        }
        .cp-featured-read {
          margin-left: auto;
          color: #8B1A1A;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        /* ── Section divider ── */
        .cp-section-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .cp-section-divider-line { flex: 1; height: 1px; background: #D4C9B8; }
        .cp-section-divider-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: #888;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* ── Article Grid ── */
        .cp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-bottom: 48px;
        }
        .cp-card {
          background: #fff;
          border: 1px solid #E8E0D4;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .cp-card:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .cp-card-thumb {
          position: relative;
          height: 190px;
          overflow: hidden;
          background: #e8e0d4;
          flex-shrink: 0;
        }
        .cp-card-thumb img { object-fit: cover; transition: transform 0.35s; }
        .cp-card:hover .cp-card-thumb img { transform: scale(1.05); }
        .cp-card-no-img {
          height: 190px;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2417 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          color: #C9A84C;
          text-transform: uppercase;
        }
        .cp-card-body { padding: 20px 20px 24px; flex: 1; display: flex; flex-direction: column; }
        .cp-card-tag {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          color: #8B1A1A;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .cp-card-title {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 16px;
          font-weight: 700;
          color: #111;
          line-height: 1.55;
          margin: 0 0 12px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .cp-card-excerpt {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 13px;
          color: #666;
          line-height: 1.7;
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .cp-card-meta {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #bbb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #F0E8DC;
          padding-top: 12px;
          margin-top: auto;
        }
        .cp-card-readmore { color: #8B1A1A; font-weight: 700; }

        /* Empty state */
        .cp-empty {
          text-align: center;
          padding: 80px 20px;
          background: #fff;
          border: 1px solid #E8E0D4;
        }
        .cp-empty-icon { font-size: 48px; margin-bottom: 16px; }
        .cp-empty-title {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 22px;
          color: #333;
          margin-bottom: 10px;
        }
        .cp-empty-sub {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #aaa;
          letter-spacing: 0.06em;
          margin-bottom: 28px;
        }
        .cp-empty-btn {
          display: inline-block;
          padding: 12px 28px;
          background: #8B1A1A;
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-decoration: none;
        }
        .cp-empty-btn:hover { background: #a52020; }

        /* Pagination */
        .cp-pagination {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
        }
        .cp-page-btn {
          min-width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          border: 1px solid #D4C9B8;
          text-decoration: none;
          color: #555;
          background: #fff;
          transition: all 0.2s;
        }
        .cp-page-btn:hover { border-color: #8B1A1A; color: #8B1A1A; }
        .cp-page-btn.active { background: #8B1A1A; border-color: #8B1A1A; color: #fff; }
        .cp-page-ellipsis {
          min-width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace; font-size: 12px; color: #aaa;
        }

        /* responsive */
        @media (max-width: 960px) {
          .cp-grid { grid-template-columns: repeat(2, 1fr); }
          .cp-featured { grid-template-columns: 1fr; }
          .cp-featured-img { height: 260px; }
          .cp-featured-body { border-left: none; border-top: 4px solid #8B1A1A; }
        }
        @media (max-width: 600px) {
          .cp-grid { grid-template-columns: 1fr; }
          .cp-cat-title { font-size: 28px; }
        }
      `}} />

      <div className="cp-wrap">
        <div className="cp-accent" />

        <div className="cp-container">

          {/* Breadcrumb */}
          <nav className="cp-breadcrumb">
            <Link href="/">হোম</Link>
            <span>›</span>
            <span style={{ color: '#444' }}>{category.name}</span>
          </nav>

          {/* Category Header */}
          <div className="cp-header">
            <div className="cp-header-left">
              <div className="cp-cat-label">বিভাগ</div>
              <h1 className="cp-cat-title">{category.name}</h1>
              {category.description && (
                <p className="cp-cat-desc">{category.description}</p>
              )}
            </div>
            <div className="cp-cat-count">{pagination.total} টি সংবাদ</div>
          </div>

          {news.length === 0 ? (
            <div className="cp-empty">
              <div className="cp-empty-icon">📰</div>
              <h2 className="cp-empty-title">এই বিভাগে কোনো সংবাদ নেই</h2>
              <p className="cp-empty-sub">এখনো কোনো সংবাদ প্রকাশিত হয়নি</p>
              <Link href="/" className="cp-empty-btn">← হোম পেজে ফিরুন</Link>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featured && (
                <Link href={`/news/${featured.slug || featured._id}`} className="cp-featured">
                  <div className="cp-featured-img">
                    {featured.image ? (
                      <Image src={featured.image} alt={featured.title} fill sizes="580px" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1a1a1a,#2d2417)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontFamily: 'Space Mono,monospace', fontSize: '11px', letterSpacing: '0.16em' }}>
                        EASTERN INSIGHT
                      </div>
                    )}
                  </div>
                  <div className="cp-featured-body">
                    <div className="cp-featured-tag">প্রধান সংবাদ</div>
                    <h2 className="cp-featured-title">{featured.title}</h2>
                    {featured.excerpt && (
                      <p className="cp-featured-excerpt">{featured.excerpt}</p>
                    )}
                    <div className="cp-featured-meta">
                      {featured.author?.name && <span>{featured.author.name}</span>}
                      {featured.createdAt && <span>{formatBanglaDate(featured.createdAt)}</span>}
                      <span className="cp-featured-read">পড়ুন →</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Rest of the articles */}
              {rest.length > 0 && (
                <>
                  <div className="cp-section-divider">
                    <div className="cp-section-divider-line" />
                    <div className="cp-section-divider-label">আরও সংবাদ</div>
                    <div className="cp-section-divider-line" />
                  </div>

                  <div className="cp-grid">
                    {rest.map((article: any) => (
                      <Link
                        key={article._id}
                        href={`/news/${article.slug || article._id}`}
                        className="cp-card"
                      >
                        <div className="cp-card-thumb">
                          {article.image ? (
                            <Image src={article.image} alt={article.title} fill sizes="380px" />
                          ) : (
                            <div className="cp-card-no-img">Eastern Insight</div>
                          )}
                        </div>
                        <div className="cp-card-body">
                          {article.category?.name && (
                            <div className="cp-card-tag">{article.category.name}</div>
                          )}
                          <h3 className="cp-card-title">{article.title}</h3>
                          {article.excerpt && (
                            <p className="cp-card-excerpt">{article.excerpt}</p>
                          )}
                          <div className="cp-card-meta">
                            <span>{article.createdAt ? formatBanglaDate(article.createdAt) : ''}</span>
                            <span className="cp-card-readmore">পড়ুন →</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="cp-pagination">
                  {page > 1 && (
                    <Link href={`/category/${params.slug}?page=${page - 1}`} className="cp-page-btn">←</Link>
                  )}
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === pagination.pages || Math.abs(p - page) <= 2)
                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && (arr[idx - 1] as number) < p - 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...'
                        ? <span key={`e${i}`} className="cp-page-ellipsis">…</span>
                        : (
                          <Link
                            key={p}
                            href={`/category/${params.slug}?page=${p}`}
                            className={`cp-page-btn${p === page ? ' active' : ''}`}
                          >
                            {p}
                          </Link>
                        )
                    )
                  }
                  {page < pagination.pages && (
                    <Link href={`/category/${params.slug}?page=${page + 1}`} className="cp-page-btn">→</Link>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}