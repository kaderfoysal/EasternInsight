'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Newspaper, Plus, Eye, EyeOff, Pencil, Trash2, Clock } from 'lucide-react';

interface NewsItem {
  _id: string;
  title: string;
  published: boolean;
  priority?: number;
  category?: { name: string; slug: string };
  author?: { name: string };
  createdAt: string;
}

export default function AdminNewsListPage() {
  const [news, setNews] = useState([] as NewsItem[]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all' as 'all' | 'published' | 'pending');
  const [togglingId, setTogglingId] = useState(null as string | null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news?limit=200&all=true');
      const data = await res.json();
      setNews(data.news ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const handleTogglePublish = async (item: NewsItem) => {
    setTogglingId(item._id);
    try {
      const res = await fetch(`/api/news/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      if (res.ok) {
        setNews((prev: NewsItem[]) => prev.map((n: NewsItem) => n._id === item._id ? { ...n, published: !n.published } : n));
      }
    } catch (e: any) { console.error(e); }
    finally { setTogglingId(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('এই খবরটি মুছে ফেলতে চান?')) return;
    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
      setNews((prev: NewsItem[]) => prev.filter((n: NewsItem) => n._id !== id));
    } catch (e: any) { console.error(e); }
  };

  const pendingCount = news.filter((n: NewsItem) => !n.published).length;
  const publishedCount = news.filter((n: NewsItem) => n.published).length;

  const filtered = news.filter((n: NewsItem) => {
    if (filter === 'published') return n.published;
    if (filter === 'pending') return !n.published;
    return true;
  });

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg border" style={{ background: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.3)' }}>
              <Newspaper size={20} className="text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-100">সব খবর</h1>
          </div>
          <p className="text-gray-500 text-sm ml-12">সকল প্রকাশিত ও অপ্রকাশিত খবর পরিচালনা করুন</p>
        </div>
        <Link
          href="/admin/news/create"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.35)', color: '#60A5FA' }}
        >
          <Plus size={16} /> নতুন খবর লিখুন
        </Link>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${filter === 'all' ? 'bg-blue-900/40 border-blue-700 text-blue-300' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
        >
          সব ({news.length})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${filter === 'published' ? 'bg-green-900/40 border-green-700 text-green-300' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
        >
          প্রকাশিত ({publishedCount})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${filter === 'pending' ? 'bg-amber-900/40 border-amber-700 text-amber-300' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}
        >
          {pendingCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
          অনুমোদন বাকি ({pendingCount})
        </button>
        <div className="flex-1 h-px bg-gray-800" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border flex flex-col items-center justify-center py-20 text-center" style={{ background: '#161B22', borderColor: '#21262D' }}>
          <div className="p-5 rounded-full mb-4" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <Newspaper size={32} className="text-blue-400" />
          </div>
          <p className="text-gray-400 text-base font-medium mb-1">কোনো খবর নেই</p>
          <p className="text-gray-600 text-sm">এই ফিল্টারে কোনো খবর পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border" style={{ background: '#161B22', borderColor: '#21262D' }}>
          <div style={{ background: '#0D1117', borderBottom: '1px solid #21262D' }}>
            <div className="grid grid-cols-12 px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <div className="col-span-5">শিরোনাম</div>
              <div className="col-span-2">বিভাগ</div>
              <div className="col-span-2">লেখক</div>
              <div className="col-span-1">অবস্থা</div>
              <div className="col-span-2 text-right">অ্যাকশন</div>
            </div>
          </div>
          <div className="divide-y divide-gray-800">
            {filtered.map((n: NewsItem) => (
              <div
                key={n._id}
                className="grid grid-cols-12 px-5 py-4 items-center group"
                style={{ transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1C2128')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Title */}
                <div className="col-span-5 flex items-start gap-2 min-w-0">
                  {!n.published && (
                    <Clock size={13} className="text-amber-400 mt-0.5 flex-shrink-0" title="অনুমোদন বাকি" />
                  )}
                  <div className="text-gray-200 font-medium text-sm line-clamp-2 leading-snug min-w-0">{n.title}</div>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-900/30 text-blue-300 border border-blue-800/40">
                    {n.category?.name ?? '—'}
                  </span>
                </div>

                {/* Author */}
                <div className="col-span-2 text-gray-400 text-sm truncate pr-2">
                  {n.author?.name ?? '—'}
                </div>

                {/* Status badge */}
                <div className="col-span-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${n.published ? 'bg-green-900/30 text-green-400 border-green-800/40' : 'bg-amber-900/20 text-amber-400 border-amber-800/30'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1 ${n.published ? 'bg-green-400' : 'bg-amber-400'}`} />
                    {n.published ? 'প্রকাশিত' : 'অপ্রকাশিত'}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2 flex-wrap">
                  {/* Publish/Unpublish toggle */}
                  <button
                    onClick={() => handleTogglePublish(n)}
                    disabled={togglingId === n._id}
                    title={n.published ? 'অপ্রকাশ করুন' : 'প্রকাশ করুন'}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all disabled:opacity-50"
                    style={n.published
                      ? { background: 'rgba(251,191,36,0.1)', color: '#FCD34D', border: '1px solid rgba(251,191,36,0.2)' }
                      : { background: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    {togglingId === n._id
                      ? <span className="animate-spin w-3 h-3 border border-current border-t-transparent rounded-full" />
                      : n.published ? <EyeOff size={11} /> : <Eye size={11} />}
                    {n.published ? 'অপ্রকাশ' : 'প্রকাশ করুন'}
                  </button>

                  {/* Edit */}
                  <Link
                    href={`/admin/news/${n._id}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
                    style={{ background: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    <Pencil size={11} /> এডিট
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#F87171', border: '1px solid rgba(239,68,68,0.18)' }}
                  >
                    <Trash2 size={11} /> মুছুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}