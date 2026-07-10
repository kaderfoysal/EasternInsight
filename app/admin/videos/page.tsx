'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import EditorVideoForm from '@/components/EditorVideoForm';
import Image from 'next/image';
import { Video, Plus, X, Pencil, Trash2, Youtube } from 'lucide-react';

interface VideoItem {
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

export default function AdminVideosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState([] as VideoItem[]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null as VideoItem | null);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const fetchVideos = async () => {
    try {
      const res = await fetch(`/api/videos?limit=50`);
      const data = await res.json();
      setVideos((data.videos || []) as VideoItem[]);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ভিডিওটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/videos?id=${id}`, { method: 'DELETE' });
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

  const handleEdit = (video: VideoItem) => {
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 text-sm">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-red-900/30 rounded-lg border border-red-800/40">
              <Youtube size={20} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-100">ভিডিও ম্যানেজমেন্ট</h1>
          </div>
          <p className="text-gray-500 text-sm ml-12">YouTube ভিডিও যোগ করুন এবং পরিচালনা করুন</p>
        </div>
        <button
          onClick={() => { setEditingVideo(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
          style={{
            background: showForm ? 'rgba(75,85,99,0.3)' : 'rgba(59,130,246,0.15)',
            border: showForm ? '1px solid rgba(75,85,99,0.5)' : '1px solid rgba(59,130,246,0.4)',
            color: showForm ? '#9CA3AF' : '#60A5FA',
          }}
        >
          {showForm ? <><X size={16} /> বাতিল</> : <><Plus size={16} /> নতুন ভিডিও</>}
        </button>
      </div>

      {/* Form Panel */}
      {showForm && (
        <div
          className="mb-8 rounded-xl p-6 border"
          style={{ background: '#161B22', borderColor: 'rgba(59,130,246,0.2)' }}
        >
          <h2 className="text-lg font-semibold text-gray-200 mb-5 flex items-center gap-2">
            <Pencil size={16} className="text-blue-400" />
            {editingVideo ? 'ভিডিও সম্পাদনা করুন' : 'নতুন ভিডিও যোগ করুন'}
          </h2>
          <EditorVideoForm video={editingVideo} onSuccess={handleFormSuccess} />
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          মোট {videos.length}টি ভিডিও
        </span>
        <div className="flex-1 h-px bg-gray-800"></div>
        <span className="text-xs text-gray-600">
          {videos.filter((v: VideoItem) => v.published).length} প্রকাশিত · {videos.filter((v: VideoItem) => !v.published).length} খসড়া
        </span>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden border"
        style={{ background: '#161B22', borderColor: '#21262D' }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-800">
            <thead style={{ background: '#0D1117' }}>
              <tr className="text-left text-gray-400">
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-xs">থাম্বনেইল</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-xs">শিরোনাম</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-xs">ক্যাটাগরি</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-xs">স্ট্যাটাস</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-xs">তারিখ</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider text-xs text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-gray-800/60">
                        <Video size={28} className="text-gray-600" />
                      </div>
                      <p className="text-gray-500 text-sm">কোন ভিডিও পাওয়া যায়নি</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="text-blue-400 text-xs hover:text-blue-300 transition-colors underline underline-offset-2"
                      >
                        প্রথম ভিডিও যোগ করুন
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                videos.map((video: VideoItem) => (
                  <tr key={video._id} className="hover:bg-[#1C2128] transition-colors group">
                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="relative w-20 h-14 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                        {video.thumbnailUrl ? (
                          <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Youtube size={20} className="text-gray-600" />
                          </div>
                        )}
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <div className="text-gray-200 font-medium line-clamp-2 max-w-sm text-sm">{video.title}</div>
                      {video.youtubeVideoId && (
                        <a
                          href={`https://youtube.com/watch?v=${video.youtubeVideoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-600 hover:text-blue-400 transition-colors mt-0.5 block"
                        >
                          yt/{video.youtubeVideoId}
                        </a>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-900/30 text-blue-300 border border-blue-800/40">
                        {video.category || 'আনক্যাটাগরাইজড'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                        video.published
                          ? 'bg-green-900/30 text-green-400 border-green-800/40'
                          : 'bg-amber-900/20 text-amber-400 border-amber-800/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${video.published ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                        {video.published ? 'প্রকাশিত' : 'খসড়া'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(video.createdAt).toLocaleDateString('bn-BD')}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(video)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                          style={{ background: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.2)' }}
                        >
                          <Pencil size={11} />
                          সম্পাদনা
                        </button>
                        <button
                          onClick={() => handleDelete(video._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)' }}
                        >
                          <Trash2 size={11} />
                          মুছুন
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
