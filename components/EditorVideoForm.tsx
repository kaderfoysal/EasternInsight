'use client';

import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';

interface EditorVideoFormProps {
  video?: any;
  onSuccess?: () => void;
}

export default function EditorVideoForm({ video, onSuccess }: EditorVideoFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    image: '',
    category: '',
    published: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        description: video.description || '',
        youtubeUrl: video.youtubeUrl || '',
        image: video.image || '',
        category: video.category || '',
        published: video.published !== undefined ? video.published : true,
      });
    }
  }, [video]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = video
        ? `/api/videos?id=${video._id}`
        : '/api/videos';
      
      const method = video ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save video');
      }

      setSuccess(video ? 'ভিডিও সফলভাবে আপডেট করা হয়েছে!' : 'ভিডিও সফলভাবে তৈরি করা হয়েছে!');
      
      if (!video) {
        setFormData({
          title: '',
          description: '',
          youtubeUrl: '',
          image: '',
          category: '',
          published: true,
        });
      }

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'একটি ত্রুটি ঘটেছে');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          শিরোনাম *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ভিডিওর শিরোনাম লিখুন"
        />
      </div>

      <div>
        <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-2">
          YouTube URL (ঐচ্ছিক)
        </label>
        <input
          type="text"
          id="youtubeUrl"
          name="youtubeUrl"
          value={formData.youtubeUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="mt-1 text-sm text-gray-500">
          YouTube ভিডিও লিংক বা ভিডিও ID দিন (অথবা নিচে ছবি আপলোড করুন)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ছবি (YouTube URL না থাকলে)
        </label>
        <ImageUploader 
          onUploaded={(url: string) => setFormData((prev: any) => ({ ...prev, image: url }))} 
          initialImage={formData.image} 
        />
        <p className="mt-1 text-sm text-gray-500">
          YouTube URL না থাকলে ছবি আপলোড করুন
        </p>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          ক্যাটাগরি
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="যেমন: রাজনীতি, খেলাধুলা, বিনোদন"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          বিবরণ
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ভিডিওর বিবরণ লিখুন (ঐচ্ছিক)"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          name="published"
          checked={formData.published}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">
          প্রকাশ করুন
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'সংরক্ষণ করা হচ্ছে...' : video ? 'আপডেট করুন' : 'ভিডিও তৈরি করুন'}
        </button>
      </div>
    </form>
  );
}
