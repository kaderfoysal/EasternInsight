// "use client";

// import React, { useState } from 'react';

// export default function AdminEditorForm({ onCreated }: { onCreated?: () => void }) {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const res = await fetch('/api/users', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password, role: 'editor' }),
//       });
//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.error || 'Failed to create user');
//       }
//       setName('');
//       setEmail('');
//       setPassword('');
//       onCreated?.();
//     } catch (err: any) {
//       setError(err.message || 'Failed to create');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="grid grid-cols-1 md:grid-cols-4 gap-3" onSubmit={handleSubmit}>
//       <input value={name} onChange={(e: any) => setName(e.target.value)} name="name" placeholder="নাম" className="border rounded px-3 py-2" required />
//       <input value={email} onChange={(e: any) => setEmail(e.target.value)} type="email" name="email" placeholder="ইমেইল" className="border rounded px-3 py-2" required />
//       <input value={password} onChange={(e: any) => setPassword(e.target.value)} type="password" name="password" placeholder="পাসওয়ার্ড" className="border rounded px-3 py-2" required />
//       <button disabled={loading} className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-60">{loading ? 'তৈরি হচ্ছে...' : 'তৈরি করুন'}</button>
//       {error && <div className="md:col-span-4 text-sm text-red-600">{error}</div>}
//     </form>
//   );
// }


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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </span>
          নতুন সম্পাদক যোগ করুন
        </h2>
        <p className="text-gray-500 mt-1">নতুন সম্পাদক অ্যাকাউন্ট তৈরি করতে নিচের ফর্মটি পূরণ করুন</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              নাম <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              name="name"
              placeholder="সম্পাদকের নাম"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              ইমেইল <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="ইমেইল ঠিকানা"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              পাসওয়ার্ড <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              type="password"
              name="password"
              placeholder="পাসওয়ার্ড"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-70 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                তৈরি হচ্ছে...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                তৈরি করুন
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}