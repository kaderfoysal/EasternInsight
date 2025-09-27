// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { Calendar, User, Eye } from 'lucide-react';
// import { format } from 'date-fns';
// import bn from 'date-fns/locale/bn';

// interface NewsCardProps {
//   article: {
//     _id: string;
//     title: string;
//     slug: string;
//     excerpt?: string;
//     image?: string;
//     createdAt: string;
//     author: {
//       name: string;
//     };
//     category: {
//       name: string;
//       slug: string;
//     };
//     views: number;
//   };
// }

// export default function NewsCard({ article }: NewsCardProps) {
//   const formatDate = (dateString: string) => {
//     try {
//       return format(new Date(dateString), 'dd MMMM yyyy', { locale: bn });
//     } catch {
//       return new Date(dateString).toLocaleDateString('bn-BD');
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//       {article.image && (
//         <div className="relative h-48 w-full">
//           <Image
//             src={article.image}
//             alt={article.title}
//             fill
//             className="object-cover"
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           />
//           <div className="absolute top-3 left-3">
//             <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
//               {article.category.name}
//             </span>
//           </div>
//         </div>
//       )}
      
//       <div className="p-5">
//         <div className="flex items-center text-xs text-gray-500 mb-2">
//           <Link 
//             href={`/category/${article.category.slug}`}
//             className="text-blue-600 hover:text-blue-800 font-medium"
//           >
//             {article.category.name}
//           </Link>
//           <span className="mx-2">•</span>
//           <span>{formatDate(article.createdAt)}</span>
//         </div>
        
//         <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
//           <Link 
//             href={`/news/${article.slug}`}
//             className="hover:text-blue-600 transition-colors"
//           >
//             {article.title}
//           </Link>
//         </h3>
        
//         {article.excerpt && (
//           <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//             {article.excerpt}
//           </p>
//         )}
        
//         <div className="flex items-center justify-between text-xs text-gray-500">
//           <div className="flex items-center">
//             <User className="h-3 w-3 mr-1" />
//             <span>{article.author.name}</span>
//           </div>
//           <div className="flex items-center">
//             <Eye className="h-3 w-3 mr-1" />
//             <span>{article.views}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Eye } from 'lucide-react';
import { format } from 'date-fns';
import bn from 'date-fns/locale/bn';

interface NewsCardProps {
  article: {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    image?: string;
    createdAt: string;
    author: {
      name: string;
    };
    category: {
      name: string;
      slug: string;
    };
    views: number;
  };
}

export default function NewsCard({ article }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: bn });
    } catch {
      return new Date(dateString).toLocaleDateString('bn-BD');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {article.image && (
        <div className="relative h-48 w-full">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {article.category?.name || 'Uncategorized'}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          {/* Add null check for category */}
          {article.category?.slug ? (
            <Link 
              href={`/category/${article.category.slug}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {article.category.name}
            </Link>
          ) : (
            <span className="text-blue-600 font-medium">
              {article.category?.name || 'Uncategorized'}
            </span>
          )}
          <span className="mx-2">•</span>
          <span>{formatDate(article.createdAt)}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link 
            href={`/news/${article._id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {article.title}
          </Link>
        </h3>
        
        {article.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          {/* Add null check for author */}
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>{article.author?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{article.views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}