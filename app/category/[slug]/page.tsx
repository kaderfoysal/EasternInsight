import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Eye, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import bn from 'date-fns/locale/bn';
import NewsCard from '@/components/NewsCard';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

async function getCategoryBySerial(serial: string) {
  try {
    console.log('Looking up category with serial:', serial);
    
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories/serial/${serial}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.log('Category not found for serial:', serial);
      return null;
    }
    
    const category = await res.json();
    console.log('Found category:', category.name, 'with ID:', category._id);
    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getNewsByCategory(categoryId: string, page = 1, limit = 10) {
  try {
    console.log('Fetching news for category ID:', categoryId, 'Page:', page, 'Limit:', limit);
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/news?category=${categoryId}&page=${page}&limit=${limit}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.log('Failed to fetch news, status:', res.status);
      return { news: [], pagination: { total: 0, pages: 0 } };
    }
    
    const data = await res.json();
    console.log('News API response:', data.news?.length, 'news items found');
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return { news: [], pagination: { total: 0, pages: 0 } };
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySerial(params.slug);
  
  if (!category) {
    return {
      title: 'বিভাগ পাওয়া যায়নি',
    };
  }

  return {
    title: `${category.name} - বাংলা সংবাদ পোর্টাল`,
    description: category.description || `${category.name} বিভাগের সর্বশেষ খবর`,
    openGraph: {
      title: `${category.name} - বাংলা সংবাদ পোর্টাল`,
      description: category.description || `${category.name} বিভাগের সর্বশেষ খবর`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySerial(params.slug);
  
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">বিভাগ পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-8">
            দুঃখিত, "{params.slug}" নামে কোন বিভাগ পাওয়া যায়নি।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              হোম পেজে ফিরে যান
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              সব বিভাগ দেখুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const page = parseInt(searchParams.page || '1');
  const { news, pagination } = await getNewsByCategory(category._id, page);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, h:mm a', { locale: bn });
    } catch {
      return new Date(dateString).toLocaleDateString('bn-BD');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">
            হোম
          </Link>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ফিরে যান
          </Link>
        </div>

        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-600 mb-4">
              {category.description}
            </p>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <span>{pagination.total} টি খবর</span>
          </div>
        </div>

        {/* News Grid */}
        {news && news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article: any) => (
              <NewsCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              এই বিভাগে কোন খবর পাওয়া যায়নি
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              হোম পেজে ফিরে যান
            </Link>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                const pageNum = i + 1;
                const isCurrentPage = pageNum === page;
                return (
                  <Link
                    key={pageNum}
                    href={`/category/${params.slug}?page=${pageNum}`}
                    className={`px-4 py-2 rounded-lg ${
                      isCurrentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
              {pagination.pages > 5 && (
                <>
                  <span className="px-4 py-2 text-gray-500">...</span>
                  <Link
                    href={`/category/${params.slug}?page=${pagination.pages}`}
                    className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  >
                    {pagination.pages}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}