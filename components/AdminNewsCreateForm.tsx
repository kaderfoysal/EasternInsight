'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  parentSlug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  children: SubCategory[];
}

interface AdminNewsCreateFormProps {
  categories: Category[];
}

const darkQuillStyle = `
  .ql-toolbar { background: #0D1117 !important; border-color: #30363D !important; }
  .ql-toolbar .ql-stroke { stroke: #8B949E !important; }
  .ql-toolbar .ql-fill { fill: #8B949E !important; }
  .ql-toolbar .ql-picker { color: #8B949E !important; }
  .ql-toolbar .ql-picker-options { background: #161B22 !important; border-color: #30363D !important; color: #E6EDF3 !important; }
  .ql-container { background: #0D1117 !important; border-color: #30363D !important; }
  .ql-editor { color: #E6EDF3 !important; min-height: 240px; font-size: 14px; line-height: 1.7; }
  .ql-editor.ql-blank::before { color: #484F58 !important; font-style: normal; }
`;

const inputCls = 'w-full px-4 py-3 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/50';
const inputStyle = { background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3' };
const labelCls = 'block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};
const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image'];

export default function AdminNewsCreateForm({ categories }: AdminNewsCreateFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('');
  const [categoryId, setCategoryId] = useState(''); // actual category sent to API (parent or sub)
  const [image, setImage] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [priority, setPriority] = useState(9999);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Derived: subcategories for the selected parent
  const selectedParent = categories.find(c => c._id === selectedParentId);
  const subcategories = selectedParent?.children ?? [];

  // When parent changes, reset the final categoryId and subcategory selection
  const handleParentChange = (id: string) => {
    setSelectedParentId(id);
    // Default to parent itself (will be overridden if user picks subcategory)
    setCategoryId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) {
      setError('শিরোনাম, বিষয়বস্তু এবং বিভাগ অবশ্যই দিতে হবে।');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim() || undefined,
          content,
          category: categoryId,
          image: image || undefined,
          imageCaption: imageCaption.trim() || undefined,
          featured,
          published,
          priority: priority < 9999 ? priority : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'সংরক্ষণ করা যায়নি');
      setSuccess('খবর সফলভাবে তৈরি হয়েছে! ফিরে যাচ্ছেন...');
      setTimeout(() => router.push('/admin/news'), 1200);
    } catch (err: any) {
      setError(err.message || 'ত্রুটি ঘটেছে');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: darkQuillStyle }} />
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <div>
          <label htmlFor="title" className={labelCls}>শিরোনাম <span className="text-red-400">*</span></label>
          <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)}
            required className={inputCls} style={inputStyle} placeholder="আকর্ষণীয় শিরোনাম লিখুন" />
        </div>

        {/* Subtitle */}
        <div>
          <label htmlFor="subtitle" className={labelCls}>উপ-শিরোনাম (ঐচ্ছিক)</label>
          <input id="subtitle" type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)}
            className={inputCls} style={inputStyle} placeholder="সংক্ষিপ্ত উপ-শিরোনাম (ঐচ্ছিক)" />
        </div>

        {/* Category + Subcategory + Priority */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Parent Category */}
          <div>
            <label htmlFor="parentCategory" className={labelCls}>বিভাগ <span className="text-red-400">*</span></label>
            <select
              id="parentCategory"
              value={selectedParentId}
              onChange={e => handleParentChange(e.target.value)}
              required
              className={inputCls}
              style={{ ...inputStyle, appearance: 'auto' }}
            >
              <option value="" style={{ background: '#0D1117' }}>বিভাগ নির্বাচন করুন</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id} style={{ background: '#0D1117' }}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Sub-category (conditional) */}
          <div>
            <label htmlFor="subCategory" className={labelCls}>
              উপ-বিভাগ
              {subcategories.length === 0 && selectedParentId && (
                <span className="ml-2 text-gray-600 normal-case font-normal">(নেই)</span>
              )}
            </label>
            <select
              id="subCategory"
              value={subcategories.length > 0 ? (categoryId !== selectedParentId ? categoryId : '') : ''}
              onChange={e => setCategoryId(e.target.value || selectedParentId)}
              disabled={subcategories.length === 0}
              className={inputCls}
              style={{
                ...inputStyle,
                appearance: 'auto',
                opacity: subcategories.length === 0 ? 0.4 : 1,
                cursor: subcategories.length === 0 ? 'not-allowed' : 'auto',
              }}
            >
              <option value="" style={{ background: '#0D1117' }}>
                {subcategories.length === 0 ? 'উপ-বিভাগ নেই' : 'উপ-বিভাগ নির্বাচন করুন'}
              </option>
              {subcategories.map(sub => (
                <option key={sub._id} value={sub._id} style={{ background: '#0D1117' }}>{sub.name}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className={labelCls}>প্রায়োরিটি</label>
            <select id="priority" value={priority === 9999 ? '' : priority}
              onChange={e => setPriority(e.target.value ? parseInt(e.target.value) : 9999)}
              className={inputCls} style={{ ...inputStyle, appearance: 'auto' }}>
              <option value="" style={{ background: '#0D1117' }}>স্বাভাবিক</option>
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n} style={{ background: '#0D1117' }}>{n} — {['সবার আগে','দ্বিতীয়','তৃতীয়','চতুর্থ','পঞ্চম'][n-1]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image */}
        <div>
          <label className={labelCls}>কভার ইমেজ</label>
          <div className="rounded-lg overflow-hidden border mb-3" style={{ borderColor: '#30363D', background: '#0D1117' }}>
            <ImageUploader initialImage={image} onUploaded={url => setImage(url)} />
          </div>
          <input type="text" value={imageCaption} onChange={e => setImageCaption(e.target.value)}
            className={inputCls} style={inputStyle} placeholder="ছবির ক্যাপশন লিখুন (ঐচ্ছিক)" />
        </div>

        {/* Content */}
        <div>
          <label className={labelCls}>মূল বিষয়বস্তু <span className="text-red-400">*</span></label>
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#30363D' }}>
            <ReactQuill value={content} onChange={setContent} modules={modules} formats={formats}
              placeholder="খবরের বিস্তারিত লিখুন..." />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors">ফিচার্ড নিউজ</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)}
              className="w-4 h-4 rounded accent-green-500" />
            <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors">
              সাথে সাথে প্রকাশ করুন
            </span>
          </label>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ADE80' }}>
            ✓ {success}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'rgba(139,148,158,0.1)', border: '1px solid #30363D', color: '#8B949E' }}>
            বাতিল
          </button>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-all disabled:opacity-60"
            style={{ background: '#2563EB' }}>
            {saving ? (
              <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>সংরক্ষণ হচ্ছে...</>
            ) : (published ? 'প্রকাশ করুন' : 'খসড়া সংরক্ষণ করুন')}
          </button>
        </div>
      </form>
    </>
  );
}
