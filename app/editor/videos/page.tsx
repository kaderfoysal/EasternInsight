'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import EditorVideoForm from '@/components/EditorVideoForm';
import Image from 'next/image';

interface Video {
  _id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  thumbnailUrl?: string;
  category?: string;
  published: boolean;
  createdAt: string;
}

export default function EditorVideosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState([] as Video[]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null as Video | null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session && session.user && !['admin', 'editor'].includes((session.user as any).role)) {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session && session.user && ['admin', 'editor'].includes((session.user as any).role)) {
      fetchVideos();
    }
  }, [session]);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos?limit=50');
      const data = await res.json();
      setVideos((data.videos || []) as Video[]);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ভিডিওটি মুছে ফেলতে চান?')) {
      return;
    }

    try {
      const res = await fetch(`/api/videos?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchVideos();
      } else {
        alert('ভিডিও মুছে ফেলতে ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('একটি ত্রুটি ঘটেছে');
    }
  };

  const handleEdit = (video: any) => {
    setEditingVideo(video);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingVideo(null);
    fetchVideos();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.user || !['admin', 'editor'].includes((session.user as any).role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ভিডিও ম্যানেজমেন্ট</h1>
            <p className="mt-2 text-gray-600">YouTube ভিডিও যোগ করুন এবং পরিচালনা করুন</p>
          </div>
          <button
            onClick={() => {
              setEditingVideo(null);
              setShowForm(!showForm);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {showForm ? 'তালিকা দেখুন' : '+ নতুন ভিডিও'}
          </button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingVideo ? 'ভিডিও সম্পাদনা করুন' : 'নতুন ভিডিও যোগ করুন'}
            </h2>
            <EditorVideoForm video={editingVideo} onSuccess={handleFormSuccess} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      থাম্বনেইল
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      শিরোনাম
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ক্যাটাগরি
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      স্ট্যাটাস
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      তারিখ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {videos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        কোন ভিডিও পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    videos.map((video: Video) => (
                      <tr key={video._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative w-24 h-16 bg-gray-200 rounded overflow-hidden">
                            {video.thumbnailUrl ? (
                              <Image
                                src={video.thumbnailUrl}
                                alt={video.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-md">
                            {video.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {video.category || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            video.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {video.published ? 'প্রকাশিত' : 'খসড়া'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(video.createdAt).toLocaleDateString('bn-BD')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(video)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            সম্পাদনা
                          </button>
                          <button
                            onClick={() => handleDelete(video._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            মুছুন
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
