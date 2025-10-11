// // components/CategorySection.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';

// interface NewsItem {
//   _id: string;
//   title: string;
//   slug: string;
//   image?: string;
//   publishedAt?: string;
// }

// interface Category {
//   _id: string;
//   name: string;
//   slug: string;
// }

// interface CategoryWithNews {
//   category: Category;
//   featuredNews: NewsItem | null;
//   otherNews: NewsItem[];
// }

// export default function CategorySection() {
//   // Fix: Use type assertion instead of generic type parameter
//   const [categoriesWithNews, setCategoriesWithNews] = useState([] as CategoryWithNews[]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchCategoriesWithNews() {
//       try {
//         // Fetch categories
//         const categoriesRes = await fetch('/api/categories');
//         if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
//         const categories: Category[] = await categoriesRes.json();

//         // For each category, fetch featured news and other news
//         const categoriesWithNewsData = await Promise.all(
//           categories.map(async (category) => {
//             // Fetch featured news (latest news with image)
//             const featuredRes = await fetch(`/api/news?category=${category.slug}&limit=1`);
//             const featuredData = await featuredRes.json();
//             const featuredNews = featuredData.news?.[0] || null;

//             // Fetch other news (titles only)
//             const otherRes = await fetch(`/api/news?category=${category.slug}&limit=3`);
//             const otherData = await otherRes.json();
//             const otherNews = otherData.news || [];

//             return {
//               category,
//               featuredNews,
//               otherNews
//             };
//           })
//         );

//         setCategoriesWithNews(categoriesWithNewsData);
//       } catch (error) {
//         console.error('Error fetching categories with news:', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCategoriesWithNews();
//   }, []);

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {Array.from({ length: 4 }).map((_, index) => (
//           <div key={index} className="border-r border-gray-300 last:border-r-0 pr-6">
//             <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
//             <div className="space-y-4">
//               <div className="animate-pulse">
//                 <div className="h-48 bg-gray-200 rounded mb-2"></div>
//                 <div className="h-5 bg-gray-200 rounded w-full"></div>
//               </div>
//               {Array.from({ length: 2 }).map((_, i) => (
//                 <div key={i} className="h-5 bg-gray-200 rounded w-full"></div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {categoriesWithNews.map(({ category, featuredNews, otherNews }: CategoryWithNews) => (
//         <div key={category._id} className="border-r border-gray-300 last:border-r-0 pr-6">
//           <h2 className="text-xl font-bold mb-4 text-gray-900">
//             <Link 
//               href={`/category/${category.slug}`}
//               className="hover:text-blue-600 transition-colors"
//             >
//               {category.name}
//             </Link>
//           </h2>
          
//           <div className="space-y-4">
//             {/* Featured News with Image */}
//             {featuredNews && (
//               <div>
//                 <div className="relative h-48 w-full mb-2">
//                   {featuredNews.image ? (
//                     <Image
//                       src={featuredNews.image}
//                       alt={featuredNews.title}
//                       fill
//                       className="object-cover"
//                     />
//                   ) : (
//                     <div className="bg-gray-200 w-full h-full flex items-center justify-center">
//                       <span className="text-gray-500">No Image</span>
//                     </div>
//                   )}
//                 </div>
//                 <h3 className="font-semibold text-gray-900">
//                   <Link 
//                     href={`/news/${featuredNews.slug}`}
//                     className="hover:text-blue-600 transition-colors line-clamp-2 border-b border-dotted border-gray-400 pb-6"
//                   >
//                     {featuredNews.title}
//                   </Link>
//                 </h3>
//               </div>
//             )}
            
//             {/* Other News (Titles Only) */}
//             {otherNews.map((newsItem) => (
//               <div key={newsItem._id}>
//                 <h3 className="font-semibold text-gray-900">
//                   <Link 
//                     href={`/news/${newsItem.slug}`}
//                     className="hover:text-blue-600 transition-colors line-clamp-2 border-b border-dotted border-gray-400 pb-6"
//                   >
//                     {newsItem.title}
//                   </Link>
//                 </h3>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


// components/CategorySection.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  publishedAt?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  priority?: number; // Added priority field
}

interface CategoryWithNews {
  category: Category;
  featuredNews: NewsItem | null;
  otherNews: NewsItem[];
}

export default function CategorySection() {
  // Fix: Use type assertion instead of generic type parameter
  const [categoriesWithNews, setCategoriesWithNews] = useState([] as CategoryWithNews[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoriesWithNews() {
      try {
        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categories: Category[] = await categoriesRes.json();

        // Sort categories by priority (lower number = higher priority)
        // If priority is not defined, treat it as a high number (low priority)
        const sortedCategories = [...categories].sort((a, b) => {
          const priorityA = a.priority !== undefined ? a.priority : 999;
          const priorityB = b.priority !== undefined ? b.priority : 999;
          return priorityA - priorityB;
        }).slice(0, 4); // Take only top 4 categories

        // For each category, fetch featured news and other news
        const categoriesWithNewsData = await Promise.all(
          sortedCategories.map(async (category) => {
            // Fetch featured news (latest news with image)
            const featuredRes = await fetch(`/api/news?category=${category.slug}&limit=1`);
            const featuredData = await featuredRes.json();
            const featuredNews = featuredData.news?.[0] || null;

            // Fetch other news (titles only)
            const otherRes = await fetch(`/api/news?category=${category.slug}&limit=3`);
            const otherData = await otherRes.json();
            const otherNews = otherData.news || [];

            return {
              category,
              featuredNews,
              otherNews
            };
          })
        );

        setCategoriesWithNews(categoriesWithNewsData);
      } catch (error) {
        console.error('Error fetching categories with news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoriesWithNews();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border-r border-gray-300 last:border-r-0 pr-6">
            <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-full"></div>
              </div>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-5 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categoriesWithNews.map(({ category, featuredNews, otherNews }: CategoryWithNews, index: number) => (
        <div key={category._id} className="border-r border-gray-300 last:border-r-0 pr-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              <Link 
                href={`/category/${category.slug}`}
                className="hover:text-blue-600 transition-colors"
              >
                {category.name}
              </Link>
            </h2>
            {/* Priority Badge */}
            {category.priority !== undefined && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Priority {category.priority}
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Featured News with Image */}
            {featuredNews && (
              <div>
                <div className="relative h-48 w-full mb-2">
                  {featuredNews.image ? (
                    <Image
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-base legend-relaxed">
                  <Link 
                    href={`/news/${featuredNews.slug}`}
                    className="hover:text-blue-600 transition-colors line-clamp-2 border-b border-dotted border-gray-400 pb-6"
                  >
                    {featuredNews.title}
                  </Link>
                </h3>
              </div>
            )}
            
            {/* Other News (Titles Only) */}
            {otherNews.map((newsItem) => (
              <div key={newsItem._id}>
                <h3 className="font-semibold text-gray-900 text-base legend-relaxed">
                  <Link 
                    href={`/news/${newsItem.slug}`}
                    className="hover:text-blue-600 transition-colors line-clamp-2 border-b border-dotted border-gray-400 pb-6"
                  >
                    {newsItem.title}
                  </Link>
                </h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}