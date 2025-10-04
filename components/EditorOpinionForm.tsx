'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ImageUploader from './ImageUploader';

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

export default function EditorOpinionForm({ opinion }: EditorOpinionFormProps) {
  const [writerName, setWriterName] = useState(opinion?.writerName || '');
  const [writerImage, setWriterImage] = useState(opinion?.writerImage || '');
  const [title, setTitle] = useState(opinion?.title || '');
  const [subtitle, setSubtitle] = useState(opinion?.subtitle || '');
  const [opinionImage, setOpinionImage] = useState(opinion?.opinionImage || '');
  const [description, setDescription] = useState(opinion?.description || '');
  const [published, setPublished] = useState(opinion?.published || false);
  const [featured, setFeatured] = useState(opinion?.featured || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = opinion ? `/api/opinions?id=${opinion._id}` : '/api/opinions';
    const method = opinion ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          writerName,
          writerImage,
          title,
          subtitle,
          opinionImage,
          description,
          published,
          featured,
        }),
      });

      if (response.ok) {
        router.push('/editor/opinions');
        router.refresh();
      } else {
        const errorData = await response.json();
        console.error('Failed to submit opinion:', errorData.message);
        setError(errorData.error || 'Failed to submit opinion');
      }
    } catch (error) {
      console.error('Error submitting opinion:', error);
      setError('Failed to submit opinion');
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
        <label htmlFor="writerName" className="block text-sm font-medium text-gray-700 mb-1">লেখকের নাম *</label>
        <input
          type="text"
          id="writerName"
          value={writerName}
          onChange={(e) => setWriterName(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="লেখকের নাম লিখুন"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">লেখকের ছবি</label>
        <ImageUploader 
          onUploaded={(url) => setWriterImage(url)} 
          initialImage={writerImage} 
        />
      </div>

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
        <label className="block text-sm font-medium text-gray-700 mb-1">মতামতের ছবি</label>
        <ImageUploader 
          onUploaded={(url) => setOpinionImage(url)} 
          initialImage={opinionImage} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">বিস্তারিত মতামত *</label>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <ReactQuill
            value={description}
            onChange={setDescription}
            modules={modules}
            formats={formats}
            className="h-64"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-3 block text-sm text-gray-700">
            এই মতামতটি প্রকাশ করুন
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-3 block text-sm text-gray-700">
            ফিচার্ড মতামত (হোমপেজে দেখাবে, সর্বোচ্চ ২টি)
          </label>
        </div>
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
            opinion ? 'আপডেট করুন' : 'সংরক্ষণ করুন'
          )}
        </button>
      </div>
    </form>
  );
}
