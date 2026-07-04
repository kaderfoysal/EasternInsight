import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Category from '@/lib/models/Category';
import News from '@/lib/models/News';
import Link from 'next/link';
import { Users, FolderOpen, Newspaper, Star, ArrowRight, TrendingUp, Eye } from 'lucide-react';

async function getData() {
  await dbConnect();
  const [editors, categories, totalNews, featuredNews, heroNews, recentNews] = await Promise.all([
    User.find({ role: 'editor' }).select('-password').sort({ createdAt: -1 }),
    Category.find({}).sort({ name: 1 }),
    News.countDocuments({ published: true }),
    News.countDocuments({ featured: true, published: true }),
    News.countDocuments({ isHero: true }),
    News.find({ published: true }).sort({ createdAt: -1 }).limit(6).populate('category', 'name').populate('author', 'name').lean(),
  ]);
  return {
    editors: JSON.parse(JSON.stringify(editors)),
    categories: JSON.parse(JSON.stringify(categories)),
    totalNews,
    featuredNews,
    heroNews,
    recentNews: JSON.parse(JSON.stringify(recentNews)),
  };
}

function StatCard({ icon: Icon, label, value, color, sublabel }: any) {
  return (
    <div style={{
      background: '#0D1117',
      border: '1px solid #1A2030',
      borderRadius: '4px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: color }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3A4050' }}>{label}</span>
        <div style={{ background: `${color}20`, padding: '8px', borderRadius: '3px' }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '32px', fontWeight: 700, color: '#E0DAD0', lineHeight: 1 }}>{value}</div>
      {sublabel && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: '#3A4050', letterSpacing: '0.08em' }}>{sublabel}</div>}
    </div>
  );
}

function QuickAction({ href, icon: Icon, title, desc, color }: any) {
  return (
    <Link href={href} style={{
      display: 'block',
      background: '#0D1117',
      border: '1px solid #1A2030',
      borderRadius: '4px',
      padding: '20px',
      textDecoration: 'none',
      transition: 'border-color 0.2s, background 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ background: `${color}15`, padding: '8px', borderRadius: '3px' }}>
          <Icon size={18} style={{ color }} />
        </div>
        <ArrowRight size={14} style={{ color: '#2A3040' }} />
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: '#C8C0B0', fontWeight: 700, marginBottom: '6px' }}>{title}</div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3A4050', lineHeight: 1.5 }}>{desc}</div>
    </Link>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return null;

  const { editors, categories, totalNews, featuredNews, heroNews, recentNews } = await getData();

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', color: '#8B1A1A', textTransform: 'uppercase', marginBottom: '8px' }}>
          Admin · Dashboard
        </div>
        <h1 style={{ fontFamily: "'Kalpurush', Georgia, serif", fontSize: '28px', color: '#E0DAD0', fontWeight: 700, marginBottom: '4px' }}>
          অ্যাডমিন ড্যাশবোর্ড
        </h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3A4050', letterSpacing: '0.06em' }}>
          ইস্টার্ন ইনসাইট সংবাদ পোর্টাল ব্যবস্থাপনা কেন্দ্র
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard icon={Newspaper} label="মোট সংবাদ" value={totalNews} color="#8B1A1A" sublabel="প্রকাশিত নিবন্ধ" />
        <StatCard icon={Star} label="ফিচার্ড" value={featuredNews} color="#C9A84C" sublabel="বিশেষ প্রতিবেদন" />
        <StatCard icon={TrendingUp} label="হিরো আর্টিকেল" value={heroNews} color="#4A7C59" sublabel="হোমপেজে প্রদর্শিত" />
        <StatCard icon={Users} label="সম্পাদক" value={editors.length} color="#4A6FA5" sublabel="সক্রিয় সম্পাদক" />
        <StatCard icon={FolderOpen} label="বিভাগ" value={categories.length} color="#7B5EA7" sublabel="সংবাদ বিভাগ" />
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', color: '#2A3040', textTransform: 'uppercase', marginBottom: '16px' }}>
          দ্রুত অ্যাকশন
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          <QuickAction href="/admin/news" icon={Newspaper} title="খবর ব্যবস্থাপনা" desc="সংবাদ প্রকাশ, সম্পাদনা ও মুছুন" color="#8B1A1A" />
          <QuickAction href="/admin/hero" icon={Star} title="হিরো সেটিংস" desc="হোমপেজের প্রধান নিবন্ধ বেছে নিন" color="#C9A84C" />
          <QuickAction href="/admin/editors" icon={Users} title="সম্পাদক" desc="সম্পাদক তৈরি ও ব্যবস্থাপনা" color="#4A6FA5" />
          <QuickAction href="/admin/categories" icon={FolderOpen} title="বিভাগ" desc="বিভাগ তৈরি ও সম্পাদনা" color="#7B5EA7" />
          <QuickAction href="/editor" icon={TrendingUp} title="এডিটর প্যানেল" desc="নতুন সংবাদ ও ভিডিও যোগ করুন" color="#4A7C59" />
        </div>
      </div>

      {/* Recent articles */}
      <div style={{
        background: '#0D1117',
        border: '1px solid #1A2030',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #1A2030',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '3px', height: '20px', background: '#8B1A1A', borderRadius: '1px' }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#C8C0B0', letterSpacing: '0.08em', fontWeight: 700 }}>সাম্প্রতিক নিবন্ধ</span>
          </div>
          <Link href="/admin/news" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#8B1A1A', textDecoration: 'none', letterSpacing: '0.06em' }}>সবগুলো →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1A2030' }}>
                {['শিরোনাম', 'বিভাগ', 'সম্পাদক', 'তারিখ', 'অবস্থা'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', color: '#2A3040', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentNews.map((article: any) => (
                <tr key={article._id} style={{ borderBottom: '1px solid #0F1419', transition: 'background 0.15s' }}>
                  <td style={{ padding: '12px 16px', maxWidth: '280px' }}>
                    <Link href={`/news/${article.slug || article._id}`} target="_blank" style={{ fontFamily: "'Kalpurush', Georgia, serif", fontSize: '13px', color: '#C8C0B0', textDecoration: 'none', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {article.title}
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', color: '#C9A84C', background: 'rgba(201,168,76,0.1)', padding: '2px 6px', borderRadius: '2px' }}>
                      {article.category?.name || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3A4050', whiteSpace: 'nowrap' }}>
                    {article.author?.name || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: "'Space Mono', monospace", fontSize: '10px', color: '#3A4050', whiteSpace: 'nowrap' }}>
                    {formatDate(article.createdAt)}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      fontFamily: "'Space Mono', monospace", fontSize: '8px', letterSpacing: '0.12em',
                      padding: '2px 7px', borderRadius: '2px',
                      background: article.featured ? 'rgba(201,168,76,0.15)' : article.isHero ? 'rgba(139,26,26,0.2)' : 'rgba(74,124,89,0.15)',
                      color: article.featured ? '#C9A84C' : article.isHero ? '#8B1A1A' : '#4A7C59',
                      border: `1px solid ${article.featured ? 'rgba(201,168,76,0.3)' : article.isHero ? 'rgba(139,26,26,0.3)' : 'rgba(74,124,89,0.3)'}`,
                    }}>
                      {article.isHero ? 'HERO' : article.featured ? 'FEATURED' : 'PUBLISHED'}
                    </span>
                  </td>
                </tr>
              ))}
              {recentNews.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#2A3040', letterSpacing: '0.08em' }}>
                    কোনো নিবন্ধ পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}