// 'use client';

// import { useState } from 'react';
// import dynamic from 'next/dynamic';
// import ImageUploader from './ImageUploader';

// // Dynamically import ReactQuill to avoid SSR issues
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// import 'react-quill/dist/quill.snow.css';

// interface Category {
//   _id: string;
//   name: string;
//   slug: string;
// }

// interface News {
//   _id: string;
//   title: string;
//   content: string;
//   category: string;
//   image?: string;
//   featured: boolean;
//   published: boolean;
//   priority?: number;
// }

// interface NewsEditFormProps {
//   news: News;
//   categories: Category[];
//   onSaved?: (updatedNews: News) => void;
// }

// export default function NewsEditForm({ news, categories, onSaved }: NewsEditFormProps) {
//   const [title, setTitle] = useState(news.title);
//   const [content, setContent] = useState(news.content);
//   const [categoryId, setCategoryId] = useState(
//     typeof news.category === 'string' ? news.category : news.category?._id
//   );
//   const [image, setImage] = useState(news.image || '');
//   const [featured, setFeatured] = useState(news.featured);
//   const [published, setPublished] = useState(news.published);
//   const [priority, setPriority] = useState(news.priority ?? 9999);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError('');
//     setSuccess('');

//     try {
//       const res = await fetch(`/api/news/${news._id}`, {
//         method: 'PUT',
//         headers: { 
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           title, 
//           content, 
//           category: categoryId, 
//           image: image || undefined, 
//           featured, 
//           published,
//           priority: Number.isFinite(priority) ? priority : undefined
//         }),
//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.error || 'Failed to update news');
//       }

//       const updatedNews = await res.json();
//       setSuccess('খবর সফলভাবে আপডেট হয়েছে!');
//       onSaved?.(updatedNews);
      
//       // Redirect back to news list after 1 second
//       setTimeout(() => {
//         window.location.href = '/admin/news';
//       }, 1000);
//     } catch (err: any) {
//       setError(err.message || 'Failed to update news');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const modules = {
//     toolbar: [
//       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//       ['bold', 'italic', 'underline', 'strike'],
//       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//       ['link', 'image'],
//       ['clean']
//     ],
//   };

//   const formats = [
//     'header',
//     'bold', 'italic', 'underline', 'strike',
//     'list', 'bullet',
//     'link', 'image'
//   ];

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">শিরোনাম</label>
//         <input
//           type="text"
//           id="title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//           placeholder="আকর্ষণীয় শিরোনাম লিখুন"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">ইমেজ</label>
//         <ImageUploader 
//           onUploaded={(url) => setImage(url)} 
//           initialImage={image} 
//         />
//       </div>

//       <div>
//         <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">বিভাগ</label>
//         <select
//           id="category"
//           value={categoryId}
//           onChange={(e) => setCategoryId(e.target.value)}
//           required
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//         >
//           <option value="">একটি বিভাগ নির্বাচন করুন</option>
//           {categories.map((category) => (
//             <option key={category._id} value={category._id}>
//               {category.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">বিস্তারিত</label>
//         <div className="border border-gray-300 rounded-lg overflow-hidden">
//           <ReactQuill
//             value={content}
//             onChange={setContent}
//             modules={modules}
//             formats={formats}
//             className="h-64"
//           />
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-6">
//         <div className="flex items-center">
//           <input
//             id="featured"
//             type="checkbox"
//             checked={featured}
//             onChange={(e) => setFeatured(e.target.checked)}
//             className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <label htmlFor="featured" className="ml-3 block text-sm text-gray-700">
//             ফিচার্ড নিউজ
//           </label>
//         </div>
        
//         <div className="flex items-center">
//           <input
//             id="published"
//             type="checkbox"
//             checked={published}
//             onChange={(e) => setPublished(e.target.checked)}
//             className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <label htmlFor="published" className="ml-3 block text-sm text-gray-700">
//             প্রকাশিত
//           </label>
//         </div>
//       </div>

//       <div>
//         <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">প্রায়োরিটি (১ মানে সবার আগে)</label>
//         <select
//           id="priority"
//           value={priority === 9999 ? '' : priority}
//           onChange={(e) => {
//             const value = e.target.value;
//             if (value === '') {
//               setPriority(9999); // Default value when empty
//             } else {
//               const numValue = parseInt(value, 10);
//               if (!isNaN(numValue) && numValue >= 1) {
//                 setPriority(numValue);
//               }
//             }
//           }}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//         >
//           <option value="">প্রায়োরিটি নির্বাচন করুন</option>
//           <option value="1">১ - সবার আগে</option>
//           <option value="2">২ - দ্বিতীয় আগে</option>
//           <option value="3">৩ - তৃতীয় আগে</option>
//           <option value="4">৪ - চতুর্থ আগে</option>
//           <option value="5">৫ - পঞ্চম আগে</option>
//           <option value="6">৬ - ষষ্ঠ আগে</option>
//         </select>
//       </div>

//       <div className="flex justify-end space-x-4 pt-4">
//         <button
//           type="button"
//           onClick={() => window.history.back()}
//           className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//         >
//           বাতিল
//         </button>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-70"
//         >
//           {isSubmitting ? (
//             <>
//               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               আপডেট হচ্ছে...
//             </>
//           ) : (
//             'আপডেট করুন'
//           )}
//         </button>
//       </div>

//       {error && (
//         <div className="text-center py-3">
//           <div className="inline-block bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
//             {error}
//           </div>
//         </div>
//       )}

//       {success && (
//         <div className="text-center py-3">
//           <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm flex items-center">
//             <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             {success}
//           </div>
//         </div>
//       )}
//     </form>
//   );
// }

// 2
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ImageUploader from './ImageUploader';

// Dynamically import ReactQuill to avoid SSR issues
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

interface News {
  _id: string;
  title: string;
  content: string;
  category: string | { _id: string; name: string; slug: string; parentSlug?: string };
  image?: string;
  imageCaption?: string;
  featured: boolean;
  published: boolean;
  priority?: number;
}

interface NewsEditFormProps {
  news: News;
  categories: Category[];
  onSaved?: (updatedNews: News) => void;
}

export default function NewsEditForm({ news, categories, onSaved }: NewsEditFormProps) {
  // Determine initial category ID
  const initialCatId = typeof news.category === 'string' ? news.category : (news.category as any)?._id || '';
  const initialCat = typeof news.category === 'object' ? news.category : null;

  // Find initial parent: if the current category is a subcategory, find its parent
  const findParentId = () => {
    if (!initialCatId) return '';
    // Check if it's a direct parent
    const isParent = categories.find(c => c._id === initialCatId);
    if (isParent) return initialCatId;
    // It's a subcategory — find the parent that has it as a child
    for (const parent of categories) {
      if (parent.children?.find((ch: SubCategory) => ch._id === initialCatId)) {
        return parent._id;
      }
    }
    return '';
  };

  const [title, setTitle] = useState(news.title);
  const [content, setContent] = useState(news.content);
  const [selectedParentId, setSelectedParentId] = useState(findParentId);
  const [categoryId, setCategoryId] = useState(initialCatId);
  const [image, setImage] = useState(news.image || '');
  const [imageCaption, setImageCaption] = useState(news.imageCaption || '');
  const [featured, setFeatured] = useState(news.featured);
  const [published, setPublished] = useState(news.published);
  const [priority, setPriority] = useState(news.priority ?? 9999);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedParent = categories.find(c => c._id === selectedParentId);
  const subcategories = selectedParent?.children ?? [];

  const handleParentChange = (id: string) => {
    setSelectedParentId(id);
    setCategoryId(id); // default to parent unless subcategory is selected
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/news/${news._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          content, 
          category: categoryId, 
          image: image || undefined, 
          imageCaption: imageCaption.trim() || undefined,
          featured, 
          published,
          priority: Number.isFinite(priority) ? priority : undefined
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update news');
      }

      const updatedNews = await res.json();
      setSuccess('খবর সফলভাবে আপডেট হয়েছে!');
      onSaved?.(updatedNews);
      
      // Redirect back to news list after 1 second
      setTimeout(() => {
        window.location.href = '/admin/news';
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to update news');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  // Dark theme CSS injected once for ReactQuill overrides
  const darkQuillStyle = `
    .ql-toolbar { background: #0D1117 !important; border-color: #30363D !important; }
    .ql-toolbar .ql-stroke { stroke: #8B949E !important; }
    .ql-toolbar .ql-fill { fill: #8B949E !important; }
    .ql-toolbar .ql-picker { color: #8B949E !important; }
    .ql-toolbar .ql-picker-options { background: #161B22 !important; border-color: #30363D !important; color: #E6EDF3 !important; }
    .ql-toolbar button:hover .ql-stroke { stroke: #58A6FF !important; }
    .ql-toolbar button:hover .ql-fill { fill: #58A6FF !important; }
    .ql-toolbar .ql-active .ql-stroke { stroke: #58A6FF !important; }
    .ql-toolbar .ql-active .ql-fill { fill: #58A6FF !important; }
    .ql-container { background: #0D1117 !important; border-color: #30363D !important; }
    .ql-editor { color: #E6EDF3 !important; min-height: 220px; font-size: 14px; line-height: 1.7; }
    .ql-editor.ql-blank::before { color: #484F58 !important; font-style: normal; }
    .ql-editor p, .ql-editor h1, .ql-editor h2, .ql-editor h3 { color: #E6EDF3 !important; }
    .ql-editor a { color: #58A6FF !important; }
  `;

  const inputCls = `w-full px-4 py-3 rounded-lg text-gray-100 text-sm transition-all outline-none
    focus:ring-2 focus:ring-blue-500/50`;
  const inputStyle = {
    background: '#0D1117',
    border: '1px solid #30363D',
    color: '#E6EDF3',
  };
  const labelCls = 'block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider';

  return (
    <>
      <style>{darkQuillStyle}</style>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <div>
          <label htmlFor="title" className={labelCls}>শিরোনাম</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputCls}
            style={inputStyle}
            placeholder="আকর্ষণীয় শিরোনাম লিখুন"
          />
        </div>

        {/* Image */}
        <div>
          <label className={labelCls}>ইমেজ</label>
          <div
            className="rounded-lg overflow-hidden border mb-3"
            style={{ borderColor: '#30363D', background: '#0D1117' }}
          >
            <ImageUploader onUploaded={(url) => setImage(url)} initialImage={image} />
          </div>
          <input
            type="text"
            value={imageCaption}
            onChange={(e) => setImageCaption(e.target.value)}
            className={inputCls}
            style={inputStyle}
            placeholder="ছবির ক্যাপশন লিখুন (ঐচ্ছিক)"
          />
        </div>

        {/* Category + Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="edit-parent-cat" className={labelCls}>বিভাগ</label>
            <select
              id="edit-parent-cat"
              value={selectedParentId}
              onChange={(e) => handleParentChange(e.target.value)}
              required
              className={inputCls}
              style={{ ...inputStyle, appearance: 'auto' }}
            >
              <option value="" style={{ background: '#0D1117' }}>বিভাগ নির্বাচন করুন</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id} style={{ background: '#0D1117' }}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edit-sub-cat" className={labelCls}>
              উপ-বিভাগ
              {subcategories.length === 0 && selectedParentId && (
                <span className="ml-2 text-gray-600 normal-case font-normal">(নেই)</span>
              )}
            </label>
            <select
              id="edit-sub-cat"
              value={subcategories.length > 0 ? (categoryId !== selectedParentId ? categoryId : '') : ''}
              onChange={(e) => setCategoryId(e.target.value || selectedParentId)}
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
              {subcategories.map((sub: SubCategory) => (
                <option key={sub._id} value={sub._id} style={{ background: '#0D1117' }}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Rich text editor */}
        <div>
          <label className={labelCls}>বিস্তারিত</label>
          <div
            className="rounded-lg overflow-hidden border"
            style={{ borderColor: '#30363D' }}
          >
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6">
          {[
            { id: 'featured', label: 'ফিচার্ড নিউজ', checked: featured, onChange: (v: boolean) => setFeatured(v) },
            { id: 'published', label: 'প্রকাশিত', checked: published, onChange: (v: boolean) => setPublished(v) },
          ].map(({ id, label, checked, onChange }) => (
            <label
              key={id}
              htmlFor={id}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500"
              />
              <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors">{label}</span>
            </label>
          ))}
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className={labelCls}>প্রায়োরিটি (১ মানে সবার আগে)</label>
          <select
            id="priority"
            value={priority === 9999 ? '' : priority}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setPriority(9999);
              } else {
                const numValue = parseInt(value, 10);
                if (!isNaN(numValue) && numValue >= 1) setPriority(numValue);
              }
            }}
            className={inputCls}
            style={{ ...inputStyle, appearance: 'auto' }}
          >
            <option value="" style={{ background: '#0D1117' }}>প্রায়োরিটি নির্বাচন করুন</option>
            {[1,2,3,4,5,6].map(n => (
              <option key={n} value={n} style={{ background: '#0D1117' }}>
                {['১','২','৩','৪','৫','৬'][n-1]} - {['সবার আগে','দ্বিতীয় আগে','তৃতীয় আগে','চতুর্থ আগে','পঞ্চম আগে','ষষ্ঠ আগে'][n-1]}
              </option>
            ))}
          </select>
        </div>

        {/* Error / Success */}
        {error && (
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ADE80' }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'rgba(139,148,158,0.1)', border: '1px solid #30363D', color: '#8B949E' }}
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-all disabled:opacity-60"
            style={{ background: isSubmitting ? '#1D4ED8' : '#2563EB' }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                আপডেট হচ্ছে...
              </>
            ) : (
              'আপডেট করুন'
            )}
          </button>
        </div>
      </form>
    </>
  );
}