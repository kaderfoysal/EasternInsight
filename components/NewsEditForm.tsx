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

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface News {
  _id: string;
  title: string;
  content: string;
  category: string | { _id: string; name: string; slug: string }; // Can be string ID or populated object
  image?: string;
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
  const [title, setTitle] = useState(news.title);
  const [content, setContent] = useState(news.content);
  const [categoryId, setCategoryId] = useState(
    typeof news.category === 'string' ? news.category : news.category?._id || ''
  );
  const [image, setImage] = useState(news.image || '');
  const [featured, setFeatured] = useState(news.featured);
  const [published, setPublished] = useState(news.published);
  const [priority, setPriority] = useState(news.priority ?? 9999);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">শিরোনাম</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="আকর্ষণীয় শিরোনাম লিখুন"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ইমেজ</label>
        <ImageUploader 
          onUploaded={(url) => setImage(url)} 
          initialImage={image} 
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">বিভাগ</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="">একটি বিভাগ নির্বাচন করুন</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">বিস্তারিত</label>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            className="h-64"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-3 block text-sm text-gray-700">
            ফিচার্ড নিউজ
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-3 block text-sm text-gray-700">
            প্রকাশিত
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">প্রায়োরিটি (১ মানে সবার আগে)</label>
        <select
          id="priority"
          value={priority === 9999 ? '' : priority}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              setPriority(9999); // Default value when empty
            } else {
              const numValue = parseInt(value, 10);
              if (!isNaN(numValue) && numValue >= 1) {
                setPriority(numValue);
              }
            }
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="">প্রায়োরিটি নির্বাচন করুন</option>
          <option value="1">১ - সবার আগে</option>
          <option value="2">২ - দ্বিতীয় আগে</option>
          <option value="3">৩ - তৃতীয় আগে</option>
          <option value="4">৪ - চতুর্থ আগে</option>
          <option value="5">৫ - পঞ্চম আগে</option>
          <option value="6">৬ - ষষ্ঠ আগে</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          বাতিল
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

      {error && (
        <div className="text-center py-3">
          <div className="inline-block bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="text-center py-3">
          <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        </div>
      )}
    </form>
  );
}