"use client";

import React, { useState } from 'react';

export default function AdminEditorForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'editor' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create user');
      }
      setName('');
      setEmail('');
      setPassword('');
      onCreated?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-4 gap-3" onSubmit={handleSubmit}>
      <input value={name} onChange={(e: any) => setName(e.target.value)} name="name" placeholder="নাম" className="border rounded px-3 py-2" required />
      <input value={email} onChange={(e: any) => setEmail(e.target.value)} type="email" name="email" placeholder="ইমেইল" className="border rounded px-3 py-2" required />
      <input value={password} onChange={(e: any) => setPassword(e.target.value)} type="password" name="password" placeholder="পাসওয়ার্ড" className="border rounded px-3 py-2" required />
      <button disabled={loading} className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-60">{loading ? 'তৈরি হচ্ছে...' : 'তৈরি করুন'}</button>
      {error && <div className="md:col-span-4 text-sm text-red-600">{error}</div>}
    </form>
  );
}


