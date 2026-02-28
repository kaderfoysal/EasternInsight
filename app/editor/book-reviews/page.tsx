// 'use client';

// import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import ImageUploader from '@/components/ImageUploader';

// type Review = {
//   _id?: string;
//   title: string;
//   authorName?: string;
//   image?: string;
//   content: string;
//   slug?: string;
//   published?: boolean;
// };

// export default function BookReviewsEditorPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [editing, setEditing] = useState<Review | null>(null);
//   const emptyForm: Review = {
//     title: '',
//     authorName: '',
//     image: '',
//     content: '',
//     published: true,
//   };

//   const [form, setForm] = useState<Review>(emptyForm);
//   const [message, setMessage] = useState<string | null>(null);

//   useEffect(() => {
//     if (status === 'loading') return;
//     if (!session || !['admin', 'editor'].includes((session.user as any)?.role || '')) {
//       router.push('/auth/signin');
//     }
//   }, [session, status, router]);

//   const fetchReviews = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/book-reviews?limit=200');
//       if (!res.ok) throw new Error('Failed to fetch');
//       const data = await res.json();
//       setReviews(data.reviews || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type, checked } = e.target as any;
//     setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//   };

//   const resetForm = () => {
//     setEditing(null);
//     setForm(emptyForm);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setMessage(null);
//     try {
//       const url = editing?._id ? `/api/book-reviews/${editing._id}` : '/api/book-reviews';
//       const method = editing?._id ? 'PUT' : 'POST';
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form),
//       });
//       if (!res.ok) throw new Error('সংরক্ষণ করা যায়নি');
//       resetForm();
//       setShowForm(false);
//       setMessage(editing ? 'বই পর্যালোচনা হালনাগাদ হয়েছে।' : 'বই পর্যালোচনা সংরক্ষিত হয়েছে।');
//       fetchReviews();
//     } catch (err: any) {
//       setMessage(err.message || 'ত্রুটি ঘটেছে');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEdit = (review: Review) => {
//     setEditing(review);
//     setForm({
//       title: review.title,
//       authorName: review.authorName || '',
//       image: review.image || '',
//       content: review.content,
//       published: review.published ?? true,
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (id?: string) => {
//     if (!id) return;
//     if (!confirm('আপনি কি নিশ্চিত? এই রিভিউ মুছে ফেলা হবে।')) return;
//     try {
//       const res = await fetch(`/api/book-reviews/${id}`, { method: 'DELETE' });
//       if (!res.ok) throw new Error('মুছে ফেলা যায়নি');
//       if (editing?._id === id) resetForm();
//       fetchReviews();
//     } catch (err: any) {
//       alert(err.message || 'ত্রুটি ঘটেছে');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">বই পর্যালোচনা</h1>
//             <p className="text-gray-600">নতুন রিভিউ যোগ করুন, সম্পাদনা করুন বা মুছুন।</p>
//           </div>
//           <button
//             onClick={() => {
//               resetForm();
//               setShowForm(!showForm);
//             }}
//             className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
//           >
//             {showForm ? 'তালিকা দেখুন' : 'নতুন বই পর্যালোচনা'}
//           </button>
//         </div>

//         {showForm && (
//           <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-100">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">শিরোনাম *</label>
//                     <input
//                       name="title"
//                       value={form.title}
//                       onChange={handleChange}
//                       required
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">বইয়ের লেখক</label>
//                     <input
//                       name="authorName"
//                       value={form.authorName || ''}
//                       onChange={handleChange}
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <input
//                       id="published"
//                       type="checkbox"
//                       name="published"
//                       checked={form.published ?? true}
//                       onChange={handleChange}
//                       className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                     />
//                     <label htmlFor="published" className="text-sm text-gray-700">প্রকাশ করুন</label>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">কভার ইমেজ আপলোড</label>
//                   <ImageUploader
//                     initialImage={form.image}
//                     onUploaded={(url) => setForm((prev) => ({ ...prev, image: url }))}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">মূল বিষয়বস্তু *</label>
//                 <textarea
//                   name="content"
//                   value={form.content}
//                   onChange={handleChange}
//                   required
//                   rows={8}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div className="flex items-center gap-3">
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-70"
//                 >
//                   {saving ? 'সংরক্ষণ হচ্ছে...' : editing ? 'আপডেট করুন' : 'সংরক্ষণ'}
//                 </button>
//                 {message && <span className="text-sm text-gray-700">{message}</span>}
//               </div>
//             </form>
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow border border-gray-100">
//           <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-900">বই পর্যালোচনার তালিকা</h2>
//           </div>
//           <div className="divide-y divide-gray-100">
//             {loading ? (
//               <div className="p-6 text-gray-500">লোড হচ্ছে...</div>
//             ) : reviews.length === 0 ? (
//               <div className="p-6 text-gray-500">কোনো রিভিউ পাওয়া যায়নি।</div>
//             ) : (
//               reviews.map((r) => (
//                 <div key={r._id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                   <div>
//                     <div className="text-base font-semibold text-gray-900">{r.title}</div>
//                     <div className="text-sm text-gray-600">
//                       {r.authorName || 'অজানা লেখক'} • {r.slug}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 text-sm">
//                     <span className={r.published ? 'text-green-600' : 'text-gray-500'}>
//                       {r.published ? 'প্রকাশিত' : 'খসড়া'}
//                     </span>
//                     <button
//                       onClick={() => handleEdit(r)}
//                       className="text-blue-600 hover:text-blue-800 font-medium"
//                     >
//                       সম্পাদনা
//                     </button>
//                     <button
//                       onClick={() => handleDelete(r._id)}
//                       className="text-red-600 hover:text-red-800 font-medium"
//                     >
//                       মুছুন
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// 2

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

type Review = {
  _id?: string;
  title: string;
  authorName?: string;
  image?: string;
  content: string;
  slug?: string;
  published?: boolean;
};

export default function BookReviewsEditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState([] as Review[]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null as Review | null);
  const emptyForm: Review = {
    title: '',
    authorName: '',
    image: '',
    content: '',
    published: true,
  };

  const [form, setForm] = useState(emptyForm as Review);
  const [message, setMessage] = useState(null as string | null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !['admin', 'editor'].includes((session.user as any)?.role || '')) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Only fetch reviews by the current editor
      const res = await fetch(`/api/book-reviews?reviewer=${(session?.user as any)?.id}&limit=200`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name } = e.target;

  setForm((prev: Review) => ({
    ...prev,
    [name]:
      e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value,
  }));
};

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const url = editing?._id ? `/api/book-reviews/${editing._id}` : '/api/book-reviews';
      const method = editing?._id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('সংরক্ষণ করা যায়নি');
      resetForm();
      setShowForm(false);
      setMessage(editing ? 'বই পর্যালোচনা হালনাগাদ হয়েছে।' : 'বই পর্যালোচনা সংরক্ষিত হয়েছে।');
      fetchReviews();
    } catch (err: any) {
      setMessage(err.message || 'ত্রুটি ঘটেছে');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditing(review);
    setForm({
      title: review.title,
      authorName: review.authorName || '',
      image: review.image || '',
      content: review.content,
      published: review.published ?? true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('আপনি কি নিশ্চিত? এই রিভিউ মুছে ফেলা হবে।')) return;
    try {
      const res = await fetch(`/api/book-reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('মুছে ফেলা যায়নি');
      if (editing?._id === id) resetForm();
      fetchReviews();
    } catch (err: any) {
      alert(err.message || 'ত্রুটি ঘটেছে');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">বই পর্যালোচনা</h1>
            <p className="text-gray-600">নতুন রিভিউ যোগ করুন, সম্পাদনা করুন বা মুছুন।</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            {showForm ? 'তালিকা দেখুন' : 'নতুন বই পর্যালোচনা'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">শিরোনাম *</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">বইয়ের লেখক</label>
                    <input
                      name="authorName"
                      value={form.authorName || ''}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="published"
                      type="checkbox"
                      name="published"
                      checked={form.published ?? true}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="text-sm text-gray-700">প্রকাশ করুন</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">কভার ইমেজ আপলোড</label>
                  <ImageUploader
                    initialImage={form.image}
                    onUploaded={(url) => setForm((prev: any) => ({ ...prev, image: url }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">মূল বিষয়বস্তু *</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-70"
                >
                  {saving ? 'সংরক্ষণ হচ্ছে...' : editing ? 'আপডেট করুন' : 'সংরক্ষণ'}
                </button>
                {message && <span className="text-sm text-gray-700">{message}</span>}
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">বই পর্যালোচনার তালিকা</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-6 text-gray-500">লোড হচ্ছে...</div>
            ) : reviews.length === 0 ? (
              <div className="p-6 text-gray-500">কোনো রিভিউ পাওয়া যায়নি।</div>
            ) : (
              reviews.map((r: Review) => (
                <div key={r._id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-gray-900">{r.title}</div>
                    <div className="text-sm text-gray-600">
                      {r.authorName || 'অজানা লেখক'} • {r.slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={r.published ? 'text-green-600' : 'text-gray-500'}>
                      {r.published ? 'প্রকাশিত' : 'খসড়া'}
                    </span>
                    <button
                      onClick={() => handleEdit(r)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      সম্পাদনা
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      মুছুন
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}