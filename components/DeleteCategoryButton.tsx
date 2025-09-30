// "use client";

// import React, { useState } from 'react';

// export default function DeleteCategoryButton({ categoryId, onDeleted }: { categoryId: string; onDeleted?: () => void }) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleDelete = async () => {
//     if (!confirm('আপনি কি নিশ্চিত? বিভাগটি ডিলিট করা হবে।')) return;
//     setLoading(true);
//     setError('');
//     try {
//       const res = await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.error || 'Failed to delete');
//       }
//       onDeleted?.();
//     } catch (e: any) {
//       setError(e.message || 'Failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="inline-flex items-center gap-2">
//       <button onClick={handleDelete} disabled={loading} className="text-red-600 hover:underline disabled:opacity-60 text-xs">
//         {loading ? 'ডিলিট হচ্ছে...' : 'ডিলিট'}
//       </button>
//       {error && <span className="text-xs text-red-600">{error}</span>}
//     </div>
//   );
// }


// 2
"use client";

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteCategoryButtonProps {
  categoryId: string;
  onDelete?: () => void;
}

export default function DeleteCategoryButton({ categoryId, onDelete }: DeleteCategoryButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('আপনি কি নিশ্চিত যে আপনি এই বিভাগটি মুছে ফেলতে চান?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      onDelete?.();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('বিভাগ মুছে ফেলতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 flex items-center disabled:opacity-50"
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          মুছছে...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4 mr-1" />
          মুছুন
        </>
      )}
    </button>
  );
}

