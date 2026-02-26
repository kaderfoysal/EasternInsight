


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
  secondNews: NewsItem | null;
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

        // For each category, fetch latest 2 news
        const categoriesWithNewsData = await Promise.all(
          sortedCategories.map(async (category) => {
            const newsRes = await fetch(`/api/news?category=${category.slug}&limit=2`);
            if (!newsRes.ok) throw new Error('Failed to fetch news');
            const newsData = await newsRes.json();
            const [featuredNews = null, secondNews = null] = newsData.news || [];

            return {
              category,
              featuredNews,
              secondNews
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
      {categoriesWithNews.map(({ category, featuredNews, secondNews }: CategoryWithNews) => (
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
            {/* Latest News with Image */}
            {featuredNews && (
              <div className="space-y-2">
                <div className="relative h-44 w-full rounded-lg overflow-hidden bg-gray-100">
                  {featuredNews.image ? (
                    <Image
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      fill
                      sizes="(max-width:768px) 100vw, 320px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-base leading-6">
                  <Link 
                    href={`/news/${featuredNews.slug}`}
                    className="hover:text-blue-600 transition-colors line-clamp-2"
                  >
                    {featuredNews.title}
                  </Link>
                </h3>
              </div>
            )}

            {/* Second Latest (title only) */}
            {secondNews && (
              <div>
                <Link
                  href={`/news/${secondNews.slug}`}
                  className="block text-gray-900 hover:text-blue-600 font-semibold text-base leading-6 border-t border-dotted border-gray-300 pt-3 line-clamp-2"
                >
                  {secondNews.title}
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
