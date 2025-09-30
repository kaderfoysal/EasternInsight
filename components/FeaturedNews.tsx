'use client';

import Link from 'next/link';
import Image from 'next/image';

interface FeaturedNewsProps {
  news: Array<{
    _id: string;
    title: string;
    subtitle?: string;
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
          <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
            {/* Category Tag */}
            <div className="mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {featuredArticle.category.name}
              </span>
            </div>
            
            {/* News Title - Now clickable with hover effect */}
            <Link 
              href={`/news/${featuredArticle._id}`}
              className="group inline-block"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                {featuredArticle.title}
              </h2>
            </Link>
            
            {/* Subtitle - if available */}
            {featuredArticle.subtitle && (
              <p className="text-lg md:text-xl text-gray-600 mb-4 md:mb-6 font-light italic">
                {featuredArticle.subtitle}
              </p>
            )}
            
            {/* News Excerpt - Responsive text size */}
            {featuredArticle.excerpt && (
              <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8">
                {featuredArticle.excerpt}
              </p>
            )}
          </div>
          
          {/* Right Column - Dynamic Image */}
          <div className="md:w-1/2 relative min-h-[300px] md:min-h-[500px]">
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