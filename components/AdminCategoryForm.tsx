"use client";

import React, { useState } from 'react';

export default function AdminCategoryForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create category');
      }
      setName('');
      setDescription('');
      onCreated?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleSubmit}>
      <input value={name} onChange={(e: any) => setName(e.target.value)} name="name" placeholder="বিভাগের নাম" className="border rounded px-3 py-2" required />
      <input value={description} onChange={(e: any) => setDescription(e.target.value)} name="description" placeholder="বর্ণনা (ঐচ্ছিক)" className="border rounded px-3 py-2" />
      <button disabled={loading} className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-60">{loading ? 'যোগ হচ্ছে...' : 'যোগ করুন'}</button>
      {error && <div className="md:col-span-3 text-sm text-red-600">{error}</div>}
    </form>
  );
}


