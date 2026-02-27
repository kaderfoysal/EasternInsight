// "use client";

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import DeleteNewsButton from '@/components/DeleteNewsButton';

// interface NewsItem {
//   _id: string;
//   title: string;
//   published: boolean;
//   category: {
//     name: string;
//     slug: string;
//   };
//   author: {
//     name: string;
//   };
//   createdAt: string;
// }

// export default function AdminNewsListPage() {
//   const [news, setNews] = useState<NewsItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [authorized, setAuthorized] = useState(false);

//   useEffect(() => {
//     checkAuth();
//     fetchNews();
//   }, []);

//   const checkAuth = async () => {
//     try {
//       // Simple auth check - you can modify this based on your auth setup
//       const response = await fetch('/api/auth/session');
//       if (response.ok) {
//         const session = await response.json();
//         if (session?.user?.role === 'admin') {
//           setAuthorized(true);
//         }
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       setAuthorized(false);
//     }
//   };

//   const fetchNews = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/news?limit=50'); // Get more news items
//       if (response.ok) {
//         const data = await response.json();
//         setNews(data.news || []);
//       } else {
//         console.error('Failed to fetch news:', response.status);
//       }
//     } catch (error) {
//       console.error('Failed to fetch news:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNewsDeleted = () => {
//     // Refresh news list after deletion
//     fetchNews();
//   };

//   const handleNewsEdited = () => {
//     // Refresh news list after editing
//     fetchNews();
//   };

//   if (!authorized) {
//     return (
//       <div className="p-6">
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//           অনুমতি নেই। আপনাকে অ্যাডমিন হতে হবে।
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">সব খবর</h1>
//         <div className="text-sm text-gray-500">
//           মোট {news.length} টি খবর
//         </div>
//       </div>
      
//       {loading ? (
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           <span className="ml-2 text-gray-600">লোড হচ্ছে...</span>
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-lg shadow">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="text-left text-gray-600 bg-gray-50">
//                 <th className="py-3 px-4 font-medium">শিরোনাম</th>
//                 <th className="py-3 px-4 font-medium">বিভাগ</th>
//                 <th className="py-3 px-4 font-medium">লেখক</th>
//                 <th className="py-3 px-4 font-medium">প্রকাশিত</th>
//                 <th className="py-3 px-4 font-medium">প্রায়োরিটি</th>
//                 <th className="py-3 px-4 font-medium">অ্যাকশন</th>
//               </tr>
//             </thead>
//             <tbody>
//               {news.length > 0 ? (
//                 news.map((n) => (
//                   <tr key={n._id} className="border-t hover:bg-gray-50 transition-colors">
//                     <td className="py-3 px-4">
//                       <div className="max-w-xs truncate font-medium text-gray-900">
//                         {n.title}
//                       </div>
//                     </td>
//                     <td className="py-3 px-4">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {n.category?.name || 'N/A'}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4 text-gray-600">
//                       {n.author?.name || 'N/A'}
//                     </td>
//                     <td className="py-3 px-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         n.published 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {n.published ? 'হ্যাঁ' : 'না'}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4">
//                       {n.priority && n.priority !== 9999 ? (
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                           {n.priority}
//                         </span>
//                       ) : (
//                         <span className="text-gray-400 text-xs">-</span>
//                       )}
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="flex items-center gap-2">
//                         <Link 
//                           href={`/admin/news/${n._id}`}
//                           onClick={handleNewsEdited}
//                           className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
//                         >
//                           এডিট
//                         </Link>
//                         <span className="text-gray-300">|</span>
//                         <DeleteNewsButton 
//                           newsId={n._id} 
//                           onDeleted={handleNewsDeleted}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={5} className="py-8 text-center text-gray-500">
//                     কোন খবর পাওয়া যায়নি
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


// 2


"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DeleteNewsButton from "@/components/DeleteNewsButton";

/* ============================
   Types
============================ */

interface NewsItem {
  _id: string;
  title: string;
  published: boolean;
  priority?: number;
  category?: {
    name: string;
    slug: string;
  };
  author?: {
    name: string;
  };
  createdAt: string;
}

interface NewsApiResponse {
  news: NewsItem[];
}

/* ============================
   Component
============================ */

export default function AdminNewsListPage() {
  const [news, setNews] = useState([] as NewsItem[]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchNews();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      const response = await fetch("/api/auth/session");

      if (!response.ok) {
        setAuthorized(false);
        return;
      }

      const session: { user?: { role?: string } } =
        await response.json();

      setAuthorized(session?.user?.role === "admin");
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthorized(false);
    }
  };

  const fetchNews = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await fetch("/api/news?limit=50");

      if (!response.ok) {
        console.error("Failed to fetch news:", response.status);
        return;
      }

      const data: NewsApiResponse = await response.json();
      setNews(data.news ?? []);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsDeleted = (): void => {
    fetchNews();
  };

  const handleNewsEdited = (): void => {
    fetchNews();
  };

  if (!authorized) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          অনুমতি নেই। আপনাকে অ্যাডমিন হতে হবে।
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">সব খবর</h1>
        <div className="text-sm text-gray-500">
          মোট {news.length} টি খবর
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">লোড হচ্ছে...</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 bg-gray-50">
                <th className="py-3 px-4 font-medium">শিরোনাম</th>
                <th className="py-3 px-4 font-medium">বিভাগ</th>
                <th className="py-3 px-4 font-medium">লেখক</th>
                <th className="py-3 px-4 font-medium">প্রকাশিত</th>
                <th className="py-3 px-4 font-medium">প্রায়োরিটি</th>
                <th className="py-3 px-4 font-medium">অ্যাকশন</th>
              </tr>
            </thead>

            <tbody>
              {news.length > 0 ? (
                news.map((n: NewsItem) => (
                  <tr
                    key={n._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate font-medium text-gray-900">
                        {n.title}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {n.category?.name ?? "N/A"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {n.author?.name ?? "N/A"}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          n.published
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {n.published ? "হ্যাঁ" : "না"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {n.priority && n.priority !== 9999 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {n.priority}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/news/${n._id}`}
                          onClick={handleNewsEdited}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          এডিট
                        </Link>

                        <span className="text-gray-300">|</span>

                        <DeleteNewsButton
                          newsId={n._id}
                          onDeleted={handleNewsDeleted}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    কোন খবর পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}