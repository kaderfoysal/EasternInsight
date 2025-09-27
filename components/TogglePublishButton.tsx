"use client";

import React, { useState } from 'react';

export default function TogglePublishButton({ newsId, current, onToggled }: { newsId: string; current: boolean; onToggled?: (next: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [published, setPublished] = useState(current);

  const handleToggle = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/news/${newsId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update');
      }
      setPublished(!published);
      onToggled?.(!published);
    } catch (e: any) {
      setError(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button onClick={handleToggle} disabled={loading} className="text-blue-600 hover:underline disabled:opacity-60">
        {loading ? 'আপডেট হচ্ছে...' : published ? 'আনপাবলিশ' : 'পাবলিশ'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}


