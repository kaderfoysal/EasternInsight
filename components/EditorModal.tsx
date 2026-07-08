"use client";

import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface Editor {
  _id: string;
  name: string;
  email: string;
}

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (editor: { name: string; email: string; password?: string }) => void;
  editor?: Editor | null;
}

export default function EditorModal({ isOpen, onClose, onSave, editor }: EditorModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editor) {
      setName(editor.name);
      setEmail(editor.email);
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setPassword('');
    }
    setError('');
  }, [editor, isOpen]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onSave({ name, email, password: editor ? undefined : password });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save editor');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/50';
  const inputStyle = { background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3' };
  const labelCls = 'block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editor ? "সম্পাদক সম্পাদনা করুন" : "নতুন সম্পাদক যোগ করুন"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={labelCls}>
            নাম <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            placeholder="সম্পাদকের নাম"
            className={inputCls}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>
            ইমেইল <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            placeholder="ইমেইল ঠিকানা"
            className={inputCls}
            style={inputStyle}
            required
          />
        </div>

        {!editor && (
          <div>
            <label htmlFor="password" className={labelCls}>
              পাসওয়ার্ড <span className="text-red-400">*</span>
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="password"
              placeholder="পাসওয়ার্ড"
              className={inputCls}
              style={inputStyle}
              required
            />
          </div>
        )}

        {error && (
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'rgba(139,148,158,0.1)', border: '1px solid #30363D', color: '#8B949E' }}
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-all disabled:opacity-60"
            style={{ background: '#16A34A' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                সংরক্ষণ হচ্ছে...
              </>
            ) : (
              'সংরক্ষণ করুন'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}