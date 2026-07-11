'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import { BookOpen, Plus, X, Pencil, Trash2, Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';

type Review = {
  _id?: string;
  title: string;
  authorName?: string;
  image?: string;
  content: string;
  slug?: string;
  published?: boolean;
};

const inputCls =
  'w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/50';
const inputStyle = {
  background: '#0D1117',
  border: '1px solid #30363D',
  color: '#E6EDF3',
};
const labelCls = 'block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider';

export default function AdminBookReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState([] as Review[]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null as Review | null);
  const [message, setMessage] = useState(null as { type: 'success' | 'error'; text: string } | null);
  const [togglingId, setTogglingId] = useState(null as string | null);

  const emptyForm: Review = { title: '', authorName: '', image: '', content: '', published: true };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'editor'].includes((session.user as any)?.role || '')) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/book-reviews?limit=200&all=true');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setForm((prev: Review) => ({
      ...prev,
      [name]:
        e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
          ? e.target.checked
          : e.target.value,
    }));
  };

  const resetForm = () => { setEditing(null); setForm(emptyForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const url = editing?._id ? `/api/book-reviews/${editing._id}` : '/api/book-reviews';
      const method = editing?._id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('সংরক্ষণ করা যায়নি');
      resetForm();
      setShowForm(false);
      setMessage({ type: 'success', text: editing ? 'বই পর্যালোচনা হালনাগাদ হয়েছে।' : 'বই পর্যালোচনা সংরক্ষিত হয়েছে।' });
      fetchReviews();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'ত্রুটি ঘটেছে' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditing(review);
    setForm({ title: review.title, authorName: review.authorName || '', image: review.image || '', content: review.content, published: review.published ?? true });
    setShowForm(true);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('আপনি কি নিশ্চিত? এই রিভিউ মুছে ফেলা হবে।')) return;
    try {
      const res = await fetch(`/api/book-reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('মুছে ফেলা যায়নি');
      if (editing?._id === id) { resetForm(); setShowForm(false); }
      fetchReviews();
      setMessage({ type: 'success', text: 'রিভিউ মুছে ফেলা হয়েছে।' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'ত্রুটি ঘটেছে' });
    }
  };

  const handleTogglePublish = async (review: Review) => {
    if (!review._id) return;
    setTogglingId(review._id);
    try {
      const res = await fetch(`/api/book-reviews/${review._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !review.published }),
      });
      if (res.ok) {
        setReviews((prev: Review[]) => prev.map((r: Review) => r._id === review._id ? { ...r, published: !r.published } : r));
        setMessage({ type: 'success', text: !review.published ? 'রিভিউ প্রকাশিত হয়েছে।' : 'রিভিউ অপ্রকাশিত হয়েছে।' });
      }
    } catch (e: any) { console.error(e); }
    finally { setTogglingId(null); }
  };

  const publishedCount = reviews.filter((r: Review) => r.published).length;
  const draftCount = reviews.filter((r: Review) => !r.published).length;

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="p-2 rounded-lg border"
              style={{ background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.3)' }}
            >
              <BookOpen size={20} className="text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-100">বই পর্যালোচনা</h1>
          </div>
          <p className="text-gray-500 text-sm ml-12">নতুন রিভিউ যোগ করুন, সম্পাদনা করুন বা মুছুন</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); setMessage(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={
            showForm
              ? { background: 'rgba(75,85,99,0.2)', border: '1px solid rgba(75,85,99,0.4)', color: '#9CA3AF' }
              : { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#34D399' }
          }
        >
          {showForm ? <><X size={16} /> বাতিল</> : <><Plus size={16} /> নতুন বই পর্যালোচনা</>}
        </button>
      </div>

      {/* Toast message */}
      {message && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
          style={
            message.type === 'success'
              ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ADE80' }
              : { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }
          }
        >
          {message.type === 'success' ? (
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {message.text}
        </div>
      )}

      {/* Create / Edit Form Panel */}
      {showForm && (
        <div
          className="rounded-xl border p-6 space-y-5"
          style={{ background: '#161B22', borderColor: 'rgba(16,185,129,0.2)' }}
        >
          <h2 className="text-base font-semibold text-gray-200 flex items-center gap-2">
            <Pencil size={15} className="text-emerald-400" />
            {editing ? 'বই পর্যালোচনা সম্পাদনা করুন' : 'নতুন বই পর্যালোচনা যোগ করুন'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left column */}
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>শিরোনাম <span className="text-red-400">*</span></label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="বইয়ের শিরোনাম লিখুন"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelCls}>বইয়ের লেখক</label>
                  <input
                    name="authorName"
                    value={form.authorName || ''}
                    onChange={handleChange}
                    placeholder="লেখকের নাম"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer group mt-2">
                  <input
                    id="published"
                    type="checkbox"
                    name="published"
                    checked={form.published ?? true}
                    onChange={handleChange}
                    className="w-4 h-4 rounded accent-emerald-500"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors">প্রকাশ করুন</span>
                </label>
              </div>

              {/* Right column — Image */}
              <div>
                <label className={labelCls}>কভার ইমেজ</label>
                <div
                  className="rounded-lg overflow-hidden border"
                  style={{ borderColor: '#30363D', background: '#0D1117' }}
                >
                  <ImageUploader
                    initialImage={form.image}
                    onUploaded={(url) => setForm((prev: any) => ({ ...prev, image: url }))}
                  />
                </div>
              </div>
            </div>

            {/* Content textarea */}
            <div>
              <label className={labelCls}>মূল বিষয়বস্তু <span className="text-red-400">*</span></label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={8}
                placeholder="বইটি সম্পর্কে আপনার পর্যালোচনা লিখুন..."
                className={inputCls}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.7' }}
              />
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => { resetForm(); setShowForm(false); }}
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: 'rgba(139,148,158,0.1)', border: '1px solid #30363D', color: '#8B949E' }}
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-60"
                style={{ background: '#059669' }}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    সংরক্ষণ হচ্ছে...
                  </>
                ) : editing ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          মোট {reviews.length}টি রিভিউ
        </span>
        {reviews.length > 0 && (
          <>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border"
              style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.25)', color: '#4ADE80' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5" />
              {publishedCount} প্রকাশিত
            </span>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border"
              style={{ background: 'rgba(251,191,36,0.1)', borderColor: 'rgba(251,191,36,0.25)', color: '#FCD34D' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
              {draftCount} খসড়া
            </span>
          </>
        )}
        <div className="flex-1 h-px bg-gray-800" />
      </div>

      {/* Table / Card list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
        </div>
      ) : reviews.length === 0 ? (
        <div
          className="rounded-xl border flex flex-col items-center justify-center py-20 text-center"
          style={{ background: '#161B22', borderColor: '#21262D' }}
        >
          <div className="p-5 rounded-full mb-4" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <BookOpen size={32} className="text-emerald-500" />
          </div>
          <p className="text-gray-400 text-base font-medium mb-1">কোনো রিভিউ পাওয়া যায়নি</p>
          <p className="text-gray-600 text-sm mb-6">আপনার প্রথম বই পর্যালোচনাটি লিখুন</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ background: '#059669' }}
          >
            <Plus size={16} />
            প্রথম রিভিউ যোগ করুন
          </button>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden border"
          style={{ background: '#161B22', borderColor: '#21262D' }}
        >
          {/* Table header */}
          <div style={{ background: '#0D1117', borderBottom: '1px solid #21262D' }}>
            <div className="grid grid-cols-12 px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <div className="col-span-5">শিরোনাম</div>
              <div className="col-span-2">লেখক</div>
              <div className="col-span-2">অবস্থা</div>
              <div className="col-span-1">স্লাগ</div>
              <div className="col-span-2 text-right">অ্যাকশন</div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-800">
            {reviews.map((r: Review) => (
              <div
                key={r._id}
                className="grid grid-cols-12 px-5 py-4 items-center group"
                style={{ transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1C2128')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Title + book cover indicator */}
                <div className="col-span-5 flex items-start gap-3 min-w-0">
                  <div
                    className="mt-0.5 p-1.5 rounded flex-shrink-0"
                    style={{ background: 'rgba(16,185,129,0.1)' }}
                  >
                    <BookOpen size={12} className="text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-200 font-medium text-sm line-clamp-2 leading-snug">{r.title}</div>
                  </div>
                </div>

                {/* Author */}
                <div className="col-span-2 text-gray-400 text-sm truncate pr-2">
                  {r.authorName || <span className="text-gray-600 italic">অজানা</span>}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border"
                    style={
                      r.published
                        ? { background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.25)', color: '#4ADE80' }
                        : { background: 'rgba(251,191,36,0.1)', borderColor: 'rgba(251,191,36,0.25)', color: '#FCD34D' }
                    }
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mr-1.5"
                      style={{ background: r.published ? '#4ADE80' : '#FCD34D' }}
                    />
                    {r.published ? 'প্রকাশিত' : 'খসড়া'}
                  </span>
                </div>

                {/* Slug */}
                <div className="col-span-1 text-gray-600 text-xs truncate pr-2">
                  {r.slug ? `/${r.slug.slice(0, 12)}…` : '—'}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  {r.slug && (
                    <a
                      href={`/book-review/${r.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
                      style={{ background: 'rgba(34,197,94,0.08)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.2)' }}
                    >
                      <Eye size={11} />
                      দেখুন
                    </a>
                  )}
                  <button
                    onClick={() => handleTogglePublish(r)}
                    disabled={togglingId === r._id}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all disabled:opacity-50"
                    style={r.published
                      ? { background: 'rgba(251,191,36,0.1)', color: '#FCD34D', border: '1px solid rgba(251,191,36,0.2)' }
                      : { background: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    {r.published ? <EyeOff size={11} /> : <Eye size={11} />}
                    {r.published ? 'অপ্রকাশ' : 'প্রকাশ করুন'}
                  </button>
                  <button
                    onClick={() => handleEdit(r)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
                    style={{ background: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    <Pencil size={11} />
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#F87171', border: '1px solid rgba(239,68,68,0.18)' }}
                  >
                    <Trash2 size={11} />
                    মুছুন
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
