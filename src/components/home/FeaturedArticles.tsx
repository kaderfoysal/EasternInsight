// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// interface Author {
//   id: string;
//   name: string;
// }

// interface Category {
//   id: string;
//   name: string;
// }

// interface Article {
//   id: string;
//   title: string;
//   excerpt: string;
//   featuredImage?: string;
//   createdAt: string;
//   author: Author;
//   category: Category;
// }

// const FeaturedArticles = () => {
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('/api/articles?limit=3');
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch articles');
//         }
        
//         const data = await response.json();
//         setArticles(data.articles);
//       } catch (err) {
//         setError('Error loading articles');
//         console.error('Error fetching articles:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticles();
//   }, []);

//   if (loading) {
//     return (
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             {error}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-12">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {articles.map((article) => (
//             <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="relative h-48">
//                 <Image
//                   src={article.featuredImage || '/placeholder-image.jpg'}
//                   alt={article.title}
//                   fill
//                   style={{ objectFit: 'cover' }}
//                 />
//               </div>
//               <div className="p-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-sm font-medium text-blue-600">{article.category.name}</span>
//                   <span className="text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</span>
//                 </div>
//                 <Link href={`/article/${article.id}`} className="block">
//                   <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
//                     {article.title}
//                   </h3>
//                 </Link>
//                 <p className="text-gray-600 mb-4">{article.excerpt}</p>
//                 <div className="flex items-center">
//                   <span className="text-sm text-gray-500">By {article.author.name}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="text-center mt-8">
//           <Link 
//             href="/articles" 
//             className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
//           >
//             View All Articles
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedArticles;


'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  createdAt: string;
  author: Author;
  category: Category;
}

const dummyArticles: Article[] = [
  {
    id: "1",
    title: "Global Economy Faces Uncertain Future Amid Trade Tensions",
    excerpt: "Experts warn that mounting geopolitical risks could spark economic instability worldwide.",
    featuredImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    author: { id: "a1", name: "Jane Doe" },
    category: { id: "c1", name: "Business" },
  },
  {
    id: "2",
    title: "Climate Change Summit: Leaders Push for Urgent Action",
    excerpt: "World leaders gathered to discuss strategies for reducing emissions and achieving net zero targets.",
    featuredImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    author: { id: "a2", name: "John Smith" },
    category: { id: "c2", name: "Environment" },
  },
  {
    id: "3",
    title: "Tech Giants Compete in the AI Arms Race",
    excerpt: "Artificial intelligence is reshaping industries, but also raising ethical and regulatory challenges.",
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
    author: { id: "a3", name: "Sarah Lee" },
    category: { id: "c3", name: "Technology" },
  },
];

const FeaturedArticles = () => {
  const [articles, setArticles] = useState<Article[]>(dummyArticles);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles?limit=3');
        if (!response.ok) throw new Error("No articles");
        const data = await response.json();
        setArticles(data.articles.length ? data.articles : dummyArticles);
      } catch {
        setArticles(dummyArticles);
      }
    };
    fetchArticles();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
              <div className="relative h-56">
                <Image
                  src={article.featuredImage || '/placeholder-image.jpg'}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-red-600 uppercase">{article.category.name}</span>
                  <span className="text-xs text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <Link href={`/article/${article.id}`} className="block">
                  <h3 className="text-xl font-semibold mb-3 hover:text-red-600 transition">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <p className="text-sm text-gray-500">By {article.author.name}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/articles"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
