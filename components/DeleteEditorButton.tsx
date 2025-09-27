"use client";

import React, { useState } from 'react';

export default function DeleteEditorButton({ userId, onDeleted }: { userId: string; onDeleted?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!confirm('আপনি কি নিশ্চিত? এই সম্পাদককে ডিলিট করা হবে।')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete');
      }
      onDeleted?.();
    } catch (e: any) {
      setError(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button onClick={handleDelete} disabled={loading} className="text-red-600 hover:underline disabled:opacity-60">
        {loading ? 'ডিলিট হচ্ছে...' : 'ডিলিট'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}


