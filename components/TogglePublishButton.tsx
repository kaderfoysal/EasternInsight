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
      <button 
        onClick={handleToggle} 
        disabled={loading} 
        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50 ${
          published 
            ? 'bg-green-50 text-green-600 hover:bg-green-100' 
            : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            আপডেট হচ্ছে...
          </>
        ) : (
          <>
            {published ? (
              <>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                প্রকাশিত
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                অনপ্রকাশিত
              </>
            )}
          </>
        )}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}


