"use client";

import React, { useState } from 'react';

export default function InlineCategoryEdit({ category, onSaved }: { category: any; onSaved?: (c: any) => void }) {
  const [name, setName] = useState(category.name as string);
  const [description, setDescription] = useState(category.description || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update');
      }
      const data = await res.json();
      onSaved?.(data);
      setEditing(false);
    } catch (e: any) {
      setError(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">{category.name}</span>
        <button className="text-blue-600 text-xs" onClick={() => setEditing(true)}>এডিট</button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded">
      <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-2 py-1 text-sm" />
      <input value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded px-2 py-1 text-sm" placeholder="বর্ণনা" />
      <button disabled={loading} onClick={save} className="text-blue-600 text-xs disabled:opacity-60">{loading ? 'সেভ হচ্ছে...' : 'সেভ'}</button>
      <button onClick={() => { setEditing(false); setName(category.name); setDescription(category.description || ''); }} className="text-gray-600 text-xs">ক্যানসেল</button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}


