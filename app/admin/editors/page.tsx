"use client";

import React, { useState, useEffect } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import EditorModal from '@/components/EditorModal';
import DeleteEditorButton from '@/components/DeleteEditorButton';
import { Plus, Edit } from 'lucide-react';

interface Editor {
  _id: string;
  name: string;
  email: string;
}

export default function AdminEditorsPage() {
  const [editors, setEditors] = useState([] as Editor[]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEditor, setCurrentEditor] = useState(null as Editor | null);

  useEffect(() => {
    fetchEditors();
  }, []);

  const fetchEditors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users?role=editor');
      if (response.ok) {
        const data = await response.json();
        setEditors(data);
      }
    } catch (error) {
      console.error('Failed to fetch editors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEditor = async (editorData: { name: string; email: string; password?: string }) => {
    const url = currentEditor ? `/api/users/${currentEditor._id}` : '/api/users';
    const method = currentEditor ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editorData, role: 'editor' }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to save editor');
    }

    await fetchEditors();
  };

  const openAddModal = () => {
    setCurrentEditor(null);
    setModalOpen(true);
  };

  const openEditModal = (editor: Editor) => {
    setCurrentEditor(editor);
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-800/40">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-100">সম্পাদক ব্যবস্থাপনা</h1>
          </div>
          <p className="text-gray-500 text-sm ml-12">সম্পাদকদের তৈরি, সম্পাদনা এবং মুছে ফেলুন</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ADE80' }}
        >
          <Plus className="h-4 w-4" />
          নতুন সম্পাদক
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden border"
        style={{ background: '#161B22', borderColor: '#21262D' }}
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-500 text-sm">লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-800">
              <thead style={{ background: '#0D1117' }}>
                <tr className="text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">নাম</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">ইমেইল</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {editors.length > 0 ? (
                  editors.map((editor: Editor) => (
                    <tr key={editor._id} className="hover:bg-[#1C2128] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                            style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.25)' }}
                          >
                            {editor.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-sm font-medium text-gray-200">{editor.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">{editor.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(editor)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                            style={{ background: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.2)' }}
                          >
                            <Edit className="h-3 w-3" />
                            সম্পাদনা
                          </button>
                          <DeleteEditorButton userId={editor._id} onDelete={fetchEditors} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-full bg-gray-800/60">
                          <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">কোন সম্পাদক পাওয়া যায়নি</p>
                        <button
                          onClick={openAddModal}
                          className="text-blue-400 text-xs hover:text-blue-300 transition-colors underline underline-offset-2"
                        >
                          প্রথম সম্পাদক যোগ করুন
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EditorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEditor}
        editor={currentEditor}
      />
    </div>
  );
}