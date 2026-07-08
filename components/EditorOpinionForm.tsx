'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ImageUploader from './ImageUploader';
import { BookOpen, User, Image as ImageIcon, FileText, Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface EditorOpinionFormProps {
  opinion?: {
    _id: string;
    writerName: string;
    writerImage?: string;
    title: string;
    subtitle?: string;
    opinionImage?: string;
    description: string;
    published: boolean;
    featured?: boolean;
  };
}

const darkQuillStyle = `
  .ql-toolbar { background: #0D1117 !important; border-color: #30363D !important; border-radius: 8px 8px 0 0; }
  .ql-toolbar .ql-stroke { stroke: #8B949E !important; }
  .ql-toolbar .ql-fill { fill: #8B949E !important; }
  .ql-toolbar .ql-picker { color: #8B949E !important; }
  .ql-toolbar .ql-picker-options { background: #161B22 !important; border-color: #30363D !important; color: #E6EDF3 !important; }
  .ql-toolbar button:hover .ql-stroke { stroke: #A78BFA !important; }
  .ql-toolbar button:hover .ql-fill { fill: #A78BFA !important; }
  .ql-toolbar .ql-active .ql-stroke { stroke: #A78BFA !important; }
  .ql-toolbar .ql-active .ql-fill { fill: #A78BFA !important; }
  .ql-container { background: #0D1117 !important; border-color: #30363D !important; border-radius: 0 0 8px 8px; }
  .ql-editor { color: #E6EDF3 !important; min-height: 260px; font-size: 14px; line-height: 1.8; }
  .ql-editor.ql-blank::before { color: #484F58 !important; font-style: normal; }
  .ql-editor p, .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor li { color: #E6EDF3 !important; }
  .ql-editor a { color: #A78BFA !important; }
`;

const inputCls = 'w-full px-4 py-3 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-violet-500/40';
const inputStyle = { background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3' };
const labelCls = 'block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1.5';

export default function EditorOpinionForm({ opinion }: EditorOpinionFormProps) {
  const [writerName, setWriterName] = useState(opinion?.writerName || '');
  const [writerImage, setWriterImage] = useState(opinion?.writerImage || '');
  const [title, setTitle] = useState(opinion?.title || '');
  const [subtitle, setSubtitle] = useState(opinion?.subtitle || '');
  const [opinionImage, setOpinionImage] = useState(opinion?.opinionImage || '');
  const [description, setDescription] = useState(opinion?.description || '');
  const [published, setPublished] = useState(opinion?.published ?? false);
  const [featured, setFeatured] = useState(opinion?.featured ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (!writerName.trim()) { setError('লেখকের নাম দিন'); setIsSubmitting(false); return; }
    if (!title.trim()) { setError('শিরোনাম দিন'); setIsSubmitting(false); return; }
    if (!description || description === '<p><br></p>') { setError('বিস্তারিত মতামত লিখুন'); setIsSubmitting(false); return; }

    const url = opinion ? `/api/opinions?id=${opinion._id}` : '/api/opinions';
    const method = opinion ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ writerName, writerImage, title, subtitle, opinionImage, description, published, featured }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(opinion ? 'মতামত সফলভাবে আপডেট হয়েছে!' : 'মতামত সফলভাবে সংরক্ষিত হয়েছে!');
        setTimeout(() => {
          router.push('/admin/opinions');
          router.refresh();
        }, 1200);
      } else {
        setError(data.error || 'মতামত সংরক্ষণ করতে ব্যর্থ হয়েছে');
      }
    } catch {
      setError('নেটওয়ার্ক সমস্যা। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'blockquote'],
      ['clean'],
    ],
  };

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'blockquote'];

  return (
    <>
      <style>{darkQuillStyle}</style>
      <form onSubmit={handleSubmit} className="space-y-7">

        {/* Error banner */}
        {error && (
          <div
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}
          >
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-400" />
            <div>
              <div className="font-medium text-red-300 mb-0.5">সমস্যা হয়েছে</div>
              <div className="text-red-400/80 text-xs">{error}</div>
            </div>
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#86EFAC' }}
          >
            <CheckCircle size={18} className="flex-shrink-0 text-green-400" />
            <div>
              <div className="font-medium text-green-300">{success}</div>
              <div className="text-green-500/70 text-xs mt-0.5">মতামত তালিকায় ফিরে যাচ্ছে...</div>
            </div>
          </div>
        )}

        {/* Two-column: writer info + writer image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            {/* Writer name */}
            <div>
              <label className={labelCls}>
                <User size={13} />
                লেখকের নাম <span className="text-red-400 font-normal normal-case tracking-normal">*</span>
              </label>
              <input
                type="text"
                value={writerName}
                onChange={(e) => setWriterName(e.target.value)}
                placeholder="লেখকের নাম লিখুন"
                className={inputCls}
                style={inputStyle}
              />
            </div>

            {/* Title */}
            <div>
              <label className={labelCls}>
                <FileText size={13} />
                শিরোনাম <span className="text-red-400 font-normal normal-case tracking-normal">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="আকর্ষণীয় শিরোনাম লিখুন"
                className={inputCls}
                style={inputStyle}
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className={labelCls}>
                <FileText size={13} />
                সাব-টাইটেল
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="সাব-টাইটেল লিখুন (ঐচ্ছিক)"
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Writer image */}
          <div>
            <label className={labelCls}>
              <ImageIcon size={13} />
              লেখকের ছবি
            </label>
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#30363D', background: '#0D1117' }}>
              <ImageUploader onUploaded={(url) => setWriterImage(url)} initialImage={writerImage} />
            </div>
          </div>
        </div>

        {/* Opinion image */}
        <div>
          <label className={labelCls}>
            <ImageIcon size={13} />
            মতামতের ছবি
          </label>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#30363D', background: '#0D1117' }}>
            <ImageUploader onUploaded={(url) => setOpinionImage(url)} initialImage={opinionImage} />
          </div>
        </div>

        {/* Description / rich text */}
        <div>
          <label className={labelCls}>
            <BookOpen size={13} />
            বিস্তারিত মতামত <span className="text-red-400 font-normal normal-case tracking-normal">*</span>
          </label>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#30363D' }}>
            <ReactQuill
              value={description}
              onChange={setDescription}
              modules={modules}
              formats={formats}
              placeholder="আপনার মতামত এখানে লিখুন..."
            />
          </div>
          <p className="text-gray-600 text-xs mt-1.5">HTML ফরম্যাটে লেখা সংরক্ষিত হবে।</p>
        </div>

        {/* Toggles */}
        <div
          className="flex flex-wrap gap-6 p-4 rounded-xl"
          style={{ background: '#161B22', border: '1px solid #21262D' }}
        >
          {[
            { id: 'published', label: 'এই মতামতটি প্রকাশ করুন', sublabel: 'প্রকাশ করলে সবাই দেখতে পাবে', checked: published, onChange: setPublished, color: 'emerald' },
            { id: 'featured', label: 'ফিচার্ড মতামত', sublabel: 'হোমপেজে দেখাবে (সর্বোচ্চ ২টি)', checked: featured, onChange: setFeatured, color: 'violet' },
          ].map(({ id, label, sublabel, checked, onChange, color }) => (
            <label key={id} htmlFor={id} className="flex items-start gap-3 cursor-pointer group flex-1 min-w-48">
              <div className="mt-0.5">
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onChange(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: color === 'violet' ? '#7C3AED' : '#059669' }}
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-300 group-hover:text-gray-100 transition-colors">{label}</div>
                <div className="text-xs text-gray-600 mt-0.5">{sublabel}</div>
              </div>
            </label>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => router.push('/admin/opinions')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'rgba(139,148,158,0.1)', border: '1px solid #30363D', color: '#8B949E' }}
          >
            <ArrowLeft size={15} />
            ফিরে যান
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !!success}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: isSubmitting || success ? '#5B21B6' : '#7C3AED' }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                সংরক্ষণ হচ্ছে...
              </>
            ) : success ? (
              <>
                <CheckCircle size={15} />
                সম্পন্ন!
              </>
            ) : (
              <>
                <Save size={15} />
                {opinion ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
