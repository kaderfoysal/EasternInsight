"use client";

import React, { useState } from 'react';

export default function DeleteNewsButton({ newsId, onDeleted }: { newsId: string; onDeleted?: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('আপনি কি নিশ্চিত? এই খবরটি ডিলিট করা হবে।')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/news/${newsId}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete');
      }
      
      // Immediately call onDeleted to refresh the list
      onDeleted?.();
    } catch (e: any) {
      console.error('Delete error:', e);
      alert('ডিলিট করতে সমস্যা হয়েছে: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading} 
      className="text-red-600 hover:text-red-800 disabled:opacity-60 font-medium text-sm flex items-center"
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          ডিলিট হচ্ছে...
        </>
      ) : (
        <>
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          ডিলিট
        </>
      )}
    </button>
  );
}


