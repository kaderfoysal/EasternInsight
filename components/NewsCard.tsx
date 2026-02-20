// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { Calendar, User } from 'lucide-react';
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

//   // Function to get time ago or date
//   const getTimeAgo = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
//       const diffInHours = Math.floor(diffInMinutes / 60);
      
//       // Check if it's today
//       const isToday = date.toDateString() === now.toDateString();
      
//       if (isToday) {
//         if (diffInMinutes < 60) {
//           return `${diffInMinutes > 0 ? diffInMinutes : 1}m`;
//         } else {
//           return `${diffInHours}h`;
//         }
//       } else {
//         // For older posts, show date
//         return formatDate(dateString);
//       }
//     } catch {
//       return formatDate(dateString);
//     }
//   };

//   return (
//     <div className="bg-white overflow-hidden font-solaiman">
//       {article.image && (
//         <div className="relative h-48 w-full">
//           <Image
//             src={article.image}
//             alt={article.title}
//             fill
//             className="object-cover"
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           />
//         </div>
//       )}
      
//       <div className="py-2">
//         <div className="flex items-center text-xs text-gray-500 mb-2">
//           <span>{getTimeAgo(article.createdAt)}</span>
//           <span className="mx-1">|</span>
//           {article.category?.slug ? (
//             <Link 
//               href={`/category/${article.category.slug}`}
//               className="text-gray-700 hover:text-blue-600 font-medium"
//             >
//               {article.category.name}
//             </Link>
//           ) : (
//             <span className="text-gray-700 font-medium">
//               {article.category?.name || 'Uncategorized'}
//             </span>
//           )}
//         </div>
        
//         {/* <h3 className="text-base font-semibold text-gray-900 mb-2 leading-normal"> */}
//           <Link 
//             href={`/news/${article._id}`}
//             className="text-base font-semibold text-gray-900 mb-2 leading-normal hover:text-blue-600 transition-colors"
//           >
//             {article.title}
//           </Link>
//         {/* </h3> */}
//       </div>
//     </div>
//   );
// }


// 2

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';
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

  // Function to get time ago or date
  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      
      // Check if it's today
      const isToday = date.toDateString() === now.toDateString();
      
      if (isToday) {
        if (diffInMinutes < 60) {
          return `${diffInMinutes > 0 ? diffInMinutes : 1}m`;
        } else {
          return `${diffInHours}h`;
        }
      } else {
        // For older posts, show date
        return formatDate(dateString);
      }
    } catch {
      return formatDate(dateString);
    }
  };

  const timeString = getTimeAgo(article.createdAt);
  const isRecent = /\d+[mh]/.test(timeString);

  return (
    <div className="bg-white overflow-hidden font-solaiman border-b border-gray-200 pb-4">
      {/* Image first with time overlay */}
      {article.image && (
        <div className="relative h-48 w-full mb-3 rounded-lg overflow-hidden shadow-sm">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isRecent && (
            <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md font-medium">
              {timeString}
            </div>
          )}
        </div>
      )}
      
      {/* Title below the image */}
      <Link 
        href={`/news/${article._id}`}
        className="text-base font-bold text-gray-900 mb-2 leading-normal hover:text-blue-600 transition-colors block"
      >
        {article.title}
      </Link>
      
      {/* Time and category below the title */}
      {/* <div className="flex items-center text-sm text-gray-600">
        <span className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {!isRecent ? timeString : 'আজ'}
        </span>
        <span className="mx-2">•</span>
        {article.category?.slug ? (
          <Link 
            href={`/category/${article.category.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {article.category.name}
          </Link>
        ) : (
          <span className="text-gray-700 font-medium">
            {article.category?.name || 'Uncategorized'}
          </span>
        )}
      </div> */}
    </div>
  );
}