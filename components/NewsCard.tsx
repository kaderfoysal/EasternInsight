import Link from 'next/link';
import Image from 'next/image';

interface NewsCardProps {
  article: {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    image?: string;
    createdAt?: string;
    author?: { name: string };
    category?: { name: string; slug: string };
    views?: number;
    readTime?: number;
    featured?: boolean;
  };
  variant?: 'default' | 'featured' | 'list';
  linkPrefix?: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}


export default function NewsCard({ article, variant = 'default', linkPrefix = '/news' }: NewsCardProps) {
  const isFeatured = variant === 'featured' || article.featured;

  if (variant === 'list') {
    return (
      <Link href={`${linkPrefix}/${article.slug || article._id}`} className="ei-list-article" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', width: '80px', height: '60px', flexShrink: 0 }}>
          {article.image ? (
            <Image src={article.image} alt={article.title} fill className="object-cover" sizes="80px" style={{ borderRadius: '2px' }} />
          ) : (
            <div style={{ width: '80px', height: '60px', background: '#2A2A2A', borderRadius: '2px' }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="ei-art-tag">{article.category?.name}</span>
          <div className="ei-art-title">{article.title}</div>
          <div className="ei-art-meta">
            <span>{formatDate(article.createdAt)}</span>
            {article.readTime ? <><span>·</span><span>{article.readTime} মিনিট</span></> : null}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`${linkPrefix}/${article.slug || article._id}`}
      className={`ei-report-card ${isFeatured ? 'featured' : ''}`}
      style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
    >
      {article.image && !isFeatured && (
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', marginBottom: '16px', overflow: 'hidden' }}>
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 33vw"
            style={{ borderRadius: '2px' }}
          />
        </div>
      )}
      <span className="ei-card-tag">{article.category?.name || 'সংবাদ'}</span>
      <h3 className="ei-card-title">{article.title}</h3>
      {article.excerpt && (
        <p className="ei-card-deck">
          {article.excerpt.slice(0, 120)}{article.excerpt.length > 120 ? '…' : ''}
        </p>
      )}
      <span className="ei-card-type-badge">{isFeatured ? 'বিশেষ প্রতিবেদন' : 'সংবাদ'}</span>
      <div className="ei-card-meta" style={{ marginTop: 'auto', paddingTop: '20px' }}>
        {article.author?.name && <span>{article.author.name}</span>}
        {article.author?.name && <span>·</span>}
        <span>{formatDate(article.createdAt)}</span>
        {article.readTime ? <><span>·</span><span>{article.readTime} মিনিট</span></> : null}
      </div>
    </Link>
  );
}
