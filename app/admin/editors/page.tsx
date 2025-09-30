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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">সম্পাদক ব্যবস্থাপনা</h1>
          <p className="text-gray-600 mt-1">সম্পাদকদের তৈরি, সম্পাদনা এবং মুছে ফেলুন</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-1" />
          নতুন সম্পাদক
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">নাম</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ইমেইল</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {editors.length > 0 ? (
                  editors.map((editor: Editor) => (
                    <tr key={editor._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{editor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{editor.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal(editor)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          সম্পাদনা
                        </button>
                        <DeleteEditorButton userId={editor._id} onDelete={fetchEditors} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      কোন সম্পাদক পাওয়া যায়নি
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