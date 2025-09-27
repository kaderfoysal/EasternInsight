// components/FeaturedNews.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

interface FeaturedNewsProps {
  news: Array<{
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    image?: string;
    category: {
      name: string;
      slug: string;
    };
  }>;
}

export default function FeaturedNews({ news }: FeaturedNewsProps) {
  const featuredArticle = news[0];

  if (!featuredArticle) {
    return null;
  }

  return (
    <div className="w-full" style={{ backgroundColor: '#e9e6d9' }}>
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Title and Description */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            {/* Category Tag */}
            <div className="mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {featuredArticle.category.name}
              </span>
            </div>
            
            {/* News Title */}
            <h2 className="font-46 mb-6">
              {featuredArticle.title}
            </h2>
            
            {/* News Excerpt */}
            {featuredArticle.excerpt && (
              <p className="card-paragraph text-gray-700 mb-8">
                {featuredArticle.excerpt}
              </p>
            )}
            
            {/* Read More Link */}
            <Link 
              href={`/news/${featuredArticle._id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors mt-auto text-lg"
            >
              Read Full Article →
            </Link>
          </div>
          
          {/* Right Column - Dynamic Image */}
          <div className="md:w-1/2 relative min-h-[400px] md:min-h-[500px]">
            {featuredArticle.image ? (
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-gray-500 text-lg">No Image Available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}