

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
  linkPrefix?: string; // allow overriding target path
}

export default function NewsCard({ article, linkPrefix = '/news' }: NewsCardProps) {
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
    <div
      className="bg-white overflow-hidden border-b border-gray-200 pb-4"
      style={{ fontFamily: 'SolaimanLipi, Arial, sans-serif' }}
    >
      {/* Image first with time overlay */}
      {article.image && (
        <Link
          href={`${linkPrefix}/${article.slug || article._id}`}
          className="block relative h-48 w-full mb-3 rounded-lg overflow-hidden shadow-sm"
        >
          <Image
            src={article.image}
            alt={article.title}
            fill
            quality={90}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isRecent && (
            <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md font-medium">
              {timeString}
            </div>
          )}
        </Link>
      )}
      
      {/* Title below the image */}
      <Link 
        href={`${linkPrefix}/${article.slug || article._id}`}
        className="text-base font-bold text-gray-900 mb-2 leading-normal hover:text-blue-600 transition-colors block"
      >
        {article.title}
      </Link>
    </div>
  );
}
