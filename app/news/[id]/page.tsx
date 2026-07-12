import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { id: string };

async function getModels() {
  const [{ default: News }, { default: Category }, { default: User }] = await Promise.all([
    import('@/lib/models/News'),
    import('@/lib/models/Category'),
    import('@/lib/models/User'),
  ]);
  return { News, Category, User };
}

async function getArticle(id: string) {
  try {
    await dbConnect();
    const { News, Category, User } = await getModels();
    const decoded = decodeURIComponent(id);

    let raw: any = await News.findOne({ slug: decoded, published: true }).lean();
    if (!raw) {
      const mongoose = (await import('mongoose')).default;
      if (mongoose.Types.ObjectId.isValid(decoded)) {
        raw = await News.findOne({ _id: decoded, published: true }).lean();
      }
    }
    if (!raw) return null;

    let authorName: string | undefined;
    let categoryName: string | undefined;
    let categorySlug: string | undefined;

    if (raw.author) {
      try {
        const a = await User.findById(raw.author).select('name').lean() as any;
        authorName = a?.name;
      } catch {}
    }
    if (raw.category) {
      try {
        const c = await Category.findById(raw.category).select('name slug').lean() as any;
        categoryName = c?.name;
        categorySlug = c?.slug;
      } catch {}
    }

    return {
      _id: raw._id.toString(),
      title: raw.title as string,
      subtitle: raw.subtitle as string | undefined,
      slug: raw.slug as string,
      content: raw.content as string | undefined,
      excerpt: raw.excerpt as string | undefined,
      image: raw.image as string | undefined,
      imageCaption: raw.imageCaption as string | undefined,
      createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString(),
      author: authorName ? { name: authorName } : undefined,
      category: categoryName ? { name: categoryName, slug: categorySlug ?? '' } : undefined,
    };
  } catch (err) {
    console.error('[NewsDetailPage] getArticle error:', err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  try {
    const article = await getArticle(params.id);
    if (!article) return { title: 'সংবাদ | ইস্টার্ন ইনসাইট' };
    return {
      title: `${article.title} | ইস্টার্ন ইনসাইট`,
      description: article.excerpt || article.title,
      openGraph: {
        title: article.title,
        description: article.excerpt || article.title,
        images: article.image ? [article.image] : undefined,
      },
    };
  } catch {
    return { title: 'সংবাদ | ইস্টার্ন ইনসাইট' };
  }
}

function formatBanglaDate(iso: string) {
  const d = new Date(iso);
  const bn = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  return `${d.getDate()} ${bn[d.getMonth()]}, ${d.getFullYear()}`;
}

export default async function NewsDetailPage({ params }: { params: Params }) {
  const article = await getArticle(params.id);
  if (!article) return notFound();

  const dateStr = article.createdAt ? formatBanglaDate(article.createdAt) : '';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── News Detail Page ── */
        .nd-wrap {
          background: #F7F3ED;
          min-height: 100vh;
          padding: 0 0 60px;
        }

        /* top accent bar */
        .nd-accent { height: 3px; background: linear-gradient(90deg, #8B1A1A 0%, #C9A84C 100%); }

        .nd-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* breadcrumb */
        .nd-breadcrumb {
          padding: 14px 0 10px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #888;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #E0D8CE;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nd-breadcrumb a { color: #888; text-decoration: none; }
        .nd-breadcrumb a:hover { color: #8B1A1A; }
        .nd-breadcrumb .sep { color: #ccc; }

        /* layout: main + sidebar */
        .nd-layout {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 40px;
          align-items: start;
        }

        /* ── ARTICLE ── */
        .nd-article {}

        .nd-cat-tag {
          display: inline-block;
          padding: 4px 14px;
          background: #8B1A1A;
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          margin-bottom: 18px;
        }
        .nd-cat-tag:hover { background: #a52020; }

        .nd-title {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 700;
          color: #111;
          line-height: 1.4;
          margin: 0 0 14px;
          letter-spacing: -0.01em;
        }

        .nd-subtitle {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 18px;
          color: #555;
          line-height: 1.7;
          margin: 0 0 20px;
          font-style: italic;
        }

        /* meta row */
        .nd-meta {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 14px 0;
          border-top: 1px solid #D4C9B8;
          border-bottom: 1px solid #D4C9B8;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .nd-meta-author {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 14px;
          font-weight: 700;
          color: #222;
        }
        .nd-meta-dot { color: #bbb; font-size: 10px; }
        .nd-meta-date {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #888;
          letter-spacing: 0.04em;
        }
        .nd-meta-share {
          margin-left: auto;
          display: flex;
          gap: 8px;
        }
        .nd-share-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #D4C9B8;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
          color: #555;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .nd-share-btn:hover { border-color: #8B1A1A; background: #8B1A1A; color: #fff; }

        /* Hero image */
        .nd-hero-img {
          position: relative;
          width: 100%;
          height: 460px;
          margin-bottom: 8px;
          overflow: hidden;
          background: #ddd;
        }
        .nd-hero-img img { object-fit: cover; }
        .nd-img-caption {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #888;
          margin-bottom: 28px;
          padding: 8px 12px;
          border-left: 3px solid #D4C9B8;
          background: #FAF7F2;
          line-height: 1.6;
        }

        /* excerpt / lead paragraph */
        .nd-lead {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 18px;
          line-height: 2;
          color: #333;
          margin-bottom: 28px;
          padding: 18px 22px;
          border-left: 4px solid #8B1A1A;
          background: #FAF7F2;
          border-radius: 0 4px 4px 0;
        }

        /* body content */
        .nd-content {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 17px;
          line-height: 2.1;
          color: #222;
        }
        .nd-content p { margin-bottom: 22px; }
        .nd-content h2 {
          font-size: 22px;
          font-weight: 700;
          margin: 36px 0 14px;
          color: #111;
          border-bottom: 2px solid #8B1A1A;
          padding-bottom: 6px;
        }
        .nd-content h3 { font-size: 19px; font-weight: 700; margin: 28px 0 10px; color: #222; }
        .nd-content blockquote {
          border-left: 4px solid #C9A84C;
          margin: 28px 0;
          padding: 16px 20px;
          background: #FAF7F2;
          font-style: italic;
          color: #444;
          font-size: 18px;
        }
        .nd-content img { max-width: 100%; border-radius: 4px; margin: 20px 0; }
        .nd-content ul, .nd-content ol { padding-left: 28px; margin-bottom: 20px; }
        .nd-content li { margin-bottom: 8px; }
        .nd-content a { color: #8B1A1A; text-decoration: underline; }
        .nd-content strong { font-weight: 700; color: #111; }

        /* tags row */
        .nd-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid #D4C9B8;
        }
        .nd-tag {
          padding: 4px 12px;
          border: 1px solid #D4C9B8;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #666;
          text-decoration: none;
          border-radius: 2px;
          transition: all 0.2s;
        }
        .nd-tag:hover { border-color: #8B1A1A; color: #8B1A1A; }

        /* ── SIDEBAR ── */
        .nd-sidebar {}
        .nd-sidebar-block {
          background: #fff;
          border: 1px solid #E8E0D4;
          margin-bottom: 28px;
        }
        .nd-sidebar-head {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #fff;
          background: #1a1a1a;
          padding: 10px 16px;
        }
        .nd-sidebar-item {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid #F0E8DC;
          text-decoration: none;
          transition: background 0.2s;
        }
        .nd-sidebar-item:last-child { border-bottom: none; }
        .nd-sidebar-item:hover { background: #FAF7F2; }
        .nd-sidebar-thumb {
          width: 72px;
          height: 54px;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          background: #eee;
        }
        .nd-sidebar-thumb img { object-fit: cover; }
        .nd-sidebar-title {
          font-family: 'Kalpurush', Georgia, serif;
          font-size: 14px;
          line-height: 1.5;
          color: #222;
          font-weight: 600;
        }
        .nd-sidebar-date {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #aaa;
          margin-top: 4px;
        }

        /* Divider line */
        .nd-divider {
          border: none;
          border-top: 2px solid #8B1A1A;
          margin: 0 0 28px;
          opacity: 0.15;
        }

        /* responsive */
        @media (max-width: 900px) {
          .nd-layout { grid-template-columns: 1fr; gap: 28px; }
          .nd-hero-img { height: 260px; }
          .nd-sidebar { display: none; }
        }
        @media (max-width: 500px) {
          .nd-title { font-size: 22px; }
          .nd-content { font-size: 16px; }
        }
      `}} />

      <div className="nd-wrap">
        <div className="nd-accent" />

        <div className="nd-container">

          {/* Breadcrumb */}
          <nav className="nd-breadcrumb">
            <Link href="/">হোম</Link>
            {article.category && (
              <>
                <span className="sep">›</span>
                <Link href={`/category/${article.category.slug}`}>{article.category.name}</Link>
              </>
            )}
            <span className="sep">›</span>
            <span style={{ color: '#444' }}>{article.title.substring(0, 48)}{article.title.length > 48 ? '...' : ''}</span>
          </nav>

          <div className="nd-layout">

            {/* ── Main Article ── */}
            <main className="nd-article">

              {article.category && (
                <Link href={`/category/${article.category.slug}`} className="nd-cat-tag">
                  {article.category.name}
                </Link>
              )}

              <h1 className="nd-title">{article.title}</h1>

              {article.subtitle && (
                <p className="nd-subtitle">{article.subtitle}</p>
              )}

              {/* Meta */}
              <div className="nd-meta">
                {article.author?.name && (
                  <span className="nd-meta-author">✍ {article.author.name}</span>
                )}
                {article.author?.name && dateStr && <span className="nd-meta-dot">●</span>}
                {dateStr && <span className="nd-meta-date">{dateStr}</span>}
                <div className="nd-meta-share">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.easterninsight.net/news/${article.slug}`)}`} target="_blank" rel="noopener" className="nd-share-btn" title="Facebook">f</a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.easterninsight.net/news/${article.slug}`)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener" className="nd-share-btn" title="Twitter">𝕏</a>
                </div>
              </div>

              {/* Hero Image */}
              {article.image && (
                <>
                  <div className="nd-hero-img">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width:768px) 100vw, 860px"
                      priority
                    />
                  </div>
                  {article.imageCaption && (
                    <div className="nd-img-caption">📷 {article.imageCaption}</div>
                  )}
                </>
              )}

              {/* Lead / excerpt */}
              {article.excerpt && (
                <div className="nd-lead">{article.excerpt}</div>
              )}

              <hr className="nd-divider" />

              {/* Body */}
              {article.content && (
                <div
                  className="nd-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              )}

              {/* Category tag at bottom */}
              {article.category && (
                <div className="nd-tags">
                  <Link href={`/category/${article.category.slug}`} className="nd-tag">
                    {article.category.name}
                  </Link>
                </div>
              )}

            </main>

            {/* ── Sidebar ── */}
            <aside className="nd-sidebar">
              <div className="nd-sidebar-block">
                <div className="nd-sidebar-head">সর্বশেষ সংবাদ</div>
                <Link href="/" className="nd-sidebar-item" style={{ flexDirection: 'column', gap: '4px' }}>
                  <span className="nd-sidebar-title">আরও সংবাদ পড়তে হোম পেজে যান</span>
                  <span className="nd-sidebar-date" style={{ color: '#8B1A1A', fontWeight: 700 }}>
                    → ইস্টার্ন ইনসাইট
                  </span>
                </Link>
              </div>

              {article.category && (
                <div className="nd-sidebar-block">
                  <div className="nd-sidebar-head">{article.category.name} বিভাগ</div>
                  <Link href={`/category/${article.category.slug}`} className="nd-sidebar-item" style={{ flexDirection: 'column', gap: '4px' }}>
                    <span className="nd-sidebar-title">{article.category.name} বিভাগের সব সংবাদ দেখুন</span>
                    <span className="nd-sidebar-date" style={{ color: '#8B1A1A', fontWeight: 700 }}>
                      → সব দেখুন
                    </span>
                  </Link>
                </div>
              )}

              {/* Ad / promo block */}
              <div className="nd-sidebar-block" style={{ padding: '24px 20px', textAlign: 'center', borderTop: '3px solid #C9A84C' }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#aaa', textTransform: 'uppercase', marginBottom: '12px' }}>নিউজলেটার</div>
                <p style={{ fontFamily: 'Kalpurush, Georgia, serif', fontSize: '14px', color: '#333', marginBottom: '16px', lineHeight: 1.7 }}>
                  প্রতিদিনের বিশ্লেষণ সরাসরি আপনার ইনবক্সে পান
                </p>
                <Link
                  href="/#newsletter"
                  style={{
                    display: 'block', padding: '10px 16px',
                    background: '#8B1A1A', color: '#fff',
                    fontFamily: 'Space Mono, monospace', fontSize: '11px',
                    letterSpacing: '0.06em', textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  সদস্য হন →
                </Link>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
}