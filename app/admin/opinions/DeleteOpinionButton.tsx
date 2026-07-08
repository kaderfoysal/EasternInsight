'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteOpinionButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('আপনি কি নিশ্চিত? এই মতামতটি মুছে ফেলা হবে।')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/opinions?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('মতামত মুছতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error(error);
      alert('নেটওয়ার্ক সমস্যা');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all disabled:opacity-50"
      style={{ background: 'rgba(239,68,68,0.08)', color: '#F87171', border: '1px solid rgba(239,68,68,0.18)' }}
    >
      <Trash2 size={11} />
      {isDeleting ? 'মুছছে...' : 'মুছুন'}
    </button>
  );
}
