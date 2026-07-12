import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { id: string };

/* ─── helpers ─── */

async function getModels() {
  // Dynamic import ensures models are always registered in the correct context
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

    // Try by slug first, then by ObjectId
    let raw: any = await News.findOne({ slug: decoded, published: true }).lean();

    if (!raw) {
      // Check if it's a valid ObjectId before querying by _id
      const mongoose = (await import('mongoose')).default;
      if (mongoose.Types.ObjectId.isValid(decoded)) {
        raw = await News.findOne({ _id: decoded, published: true }).lean();
      }
    }

    if (!raw) return null;

    // Manual population — more reliable than .populate() in production
    let authorName: string | undefined;
    let categoryName: string | undefined;
    let categorySlug: string | undefined;

    if (raw.author) {
      try {
        const author = await User.findById(raw.author).select('name').lean() as any;
        authorName = author?.name;
      } catch { /* author fetch failed — non-fatal */ }
    }

    if (raw.category) {
      try {
        const category = await Category.findById(raw.category).select('name slug').lean() as any;
        categoryName = category?.name;
        categorySlug = category?.slug;
      } catch { /* category fetch failed — non-fatal */ }
    }

    return {
      _id: raw._id.toString(),
      title: raw.title as string,
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

/* ─── Metadata ─── */

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

/* ─── Page ─── */

export default async function NewsDetailPage({ params }: { params: Params }) {
  const article = await getArticle(params.id);
  if (!article) return notFound();

  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div style={{ background: 'var(--paper, #F5F0E8)', minHeight: '100vh', paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 20px' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '20px', fontFamily: 'var(--mono, monospace)' }}>
          <a href="/" style={{ color: '#888', textDecoration: 'none' }}>হোম</a>
          {article.category && (
            <>
              {' / '}
              <a href={`/category/${article.category.slug}`} style={{ color: '#888', textDecoration: 'none' }}>
                {article.category.name}
              </a>
            </>
          )}
          {' / '}
          <span style={{ color: '#555' }}>সংবাদ</span>
        </div>

        <article style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 20px rgba(0,0,0,0.07)', overflow: 'hidden' }}>

          {/* Hero image */}
          {article.image && (
            <div style={{ position: 'relative', width: '100%', height: '420px' }}>
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width:768px) 100vw, 860px"
                style={{ objectFit: 'cover' }}
                priority
              />
              {article.imageCaption && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                  padding: '24px 20px 12px',
                  color: '#ddd', fontSize: '13px', fontStyle: 'italic',
                }}>
                  {article.imageCaption}
                </div>
              )}
            </div>
          )}

          <div style={{ padding: '32px 36px 40px' }}>

            {/* Category tag */}
            {article.category?.name && (
              <a
                href={`/category/${article.category.slug}`}
                style={{
                  display: 'inline-block', marginBottom: '16px',
                  padding: '4px 12px', background: '#8B1A1A', color: '#fff',
                  borderRadius: '4px', fontSize: '12px', fontFamily: 'var(--mono, monospace)',
                  letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase',
                }}
              >
                {article.category.name}
              </a>
            )}

            {/* Title */}
            <h1 style={{
              fontFamily: 'Kalpurush, Georgia, serif',
              fontSize: 'clamp(22px, 4vw, 32px)',
              fontWeight: 700,
              lineHeight: 1.4,
              color: '#1a1a1a',
              marginBottom: '16px',
            }}>
              {article.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap' }}>
              {article.author?.name && (
                <span style={{ fontSize: '14px', color: '#555', fontFamily: 'Kalpurush, Georgia, serif' }}>
                  ✍ {article.author.name}
                </span>
              )}
              {formattedDate && (
                <span style={{ fontSize: '13px', color: '#888', fontFamily: 'var(--mono, monospace)' }}>
                  {formattedDate}
                </span>
              )}
            </div>

            {/* Excerpt / lead */}
            {article.excerpt && (
              <p style={{
                fontFamily: 'Kalpurush, Georgia, serif',
                fontSize: '17px',
                lineHeight: 1.9,
                color: '#444',
                marginBottom: '28px',
                borderLeft: '3px solid #8B1A1A',
                paddingLeft: '16px',
                fontStyle: 'italic',
              }}>
                {article.excerpt}
              </p>
            )}

            {/* Divider */}
            <hr style={{ border: 'none', borderTop: '1px solid #eee', marginBottom: '28px' }} />

            {/* Content */}
            {article.content && (
              <div
                style={{
                  fontFamily: 'Kalpurush, Georgia, serif',
                  fontSize: '17px',
                  lineHeight: 2,
                  color: '#333',
                }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}

          </div>
        </article>

        {/* Back link */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <a
            href="/"
            style={{
              display: 'inline-block', padding: '10px 28px',
              background: '#8B1A1A', color: '#fff', borderRadius: '6px',
              textDecoration: 'none', fontFamily: 'var(--mono, monospace)',
              fontSize: '13px', letterSpacing: '0.06em',
            }}
          >
            ← হোম পেজে ফিরুন
          </a>
        </div>

      </div>
    </div>
  );
}