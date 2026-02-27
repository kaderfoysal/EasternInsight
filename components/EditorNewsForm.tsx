'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ImageUploader from './ImageUploader';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface Category {
  _id: string;
  name: string;
  slug: string;
  serial?: number;
}

interface EditorNewsFormProps {
  categories: Category[];
  news?: {
    _id: string;
    title: string;
    subtitle?: string;
    content: string;
    category: string;
    published: boolean;
    image?: string;
    imageCaption?: string;
    priority?: number;
    authorNameForOpinion?: string;
  };
}

export default function EditorNewsForm({ categories, news }: EditorNewsFormProps) {
  const [title, setTitle] = useState(news?.title || '');
  const [subtitle, setSubtitle] = useState(news?.subtitle || '');
  const [content, setContent] = useState(news?.content || '');
  const [categoryId, setCategoryId] = useState(news?.category || '');
  const [published, setPublished] = useState(news?.published || false);
  const [image, setImage] = useState(news?.image || '');
  const [imageCaption, setImageCaption] = useState(news?.imageCaption || '');
  const [priority, setPriority] = useState(news?.priority ?? 9999);
   const [authorNameForOpinion, setAuthorNameForOpinion] = useState(news?.authorNameForOpinion || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const selectedCategory = categories.find((c) => c._id === categoryId);
  const isOpinion = selectedCategory?.serial === 3;

const handleSubmit = async (e: any) => {
  e.preventDefault();
  setIsSubmitting(true);

  const url = news ? `/api/news/${news._id}` : '/api/news';
  const method = news ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        title,
        subtitle,
        content, 
        category: categoryId, 
        published, 
        image,
        imageCaption,
        priority: Number.isFinite(priority) ? priority : undefined,
        authorNameForOpinion: isOpinion ? authorNameForOpinion : undefined,
      }),
    });

    if (response.ok) {
      router.push('/editor');
    } else {
      const errorData = await response.json();
      console.error('Failed to submit news:', errorData.message);
      setError(errorData.error || 'Failed to submit news');
    }
  } catch (error) {
    console.error('Error submitting news:', error);
    setError('Failed to submit news');
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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">শিরোনাম *</label>
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
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">সাব-টাইটেল</label>
        <input
          type="text"
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="সাব-টাইটেল লিখুন (ঐচ্ছিক)"
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
        <label htmlFor="imageCaption" className="block text-sm font-medium text-gray-700 mb-1">ইমেজ ক্যাপশন</label>
        <input
          type="text"
          id="imageCaption"
          value={imageCaption}
          onChange={(e) => setImageCaption(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="ইমেজের বর্ণনা লিখুন (ঐচ্ছিক)"
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

      {isOpinion && (
        <div>
          <label htmlFor="authorNameForOpinion" className="block text-sm font-medium text-gray-700 mb-1">লেখকের নাম</label>
          <input
            type="text"
            id="authorNameForOpinion"
            value={authorNameForOpinion}
            onChange={(e) => setAuthorNameForOpinion(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="লেখকের নাম লিখুন"
          />
        </div>
      )}

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

      <div className="flex items-center">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="published" className="ml-3 block text-sm text-gray-700">
          এই খবরটি প্রকাশ করুন
        </label>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">প্রায়োরিটি (১ মানে সবার আগে)</label>
        <input
          type="number"
          id="priority"
          value={priority === 9999 ? '' : priority}
          min={1}
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
          placeholder="যেমন: 1, 2, 3..."
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
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
              সংরক্ষণ হচ্ছে...
            </>
          ) : (
            news ? 'আপডেট করুন' : 'সংরক্ষণ করুন'
          )}
        </button>
      </div>
    </form>
  );
}
