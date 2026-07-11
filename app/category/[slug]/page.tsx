import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import News from '@/lib/models/News';
import NewsCard from '@/components/NewsCard';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

async function getCategoryBySlug(slug: string) {
  await dbConnect();
  const category = await Category.findOne({ slug }).lean();
  if (!category) return null;
  return JSON.parse(JSON.stringify(category));
}

async function getNewsByCategory(categoryId: string, page = 1, limit = 12) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const [news, total] = await Promise.all([
    News.find({ category: categoryId, published: true })
      .sort({ priority: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .lean(),
    News.countDocuments({ category: categoryId, published: true }),
  ]);
  return {
    news: JSON.parse(JSON.stringify(news)),
    pagination: { total, pages: Math.ceil(total / limit), page },
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: 'বিভাগ পাওয়া যায়নি' };
  return {
    title: `${category.name} — Eastern Insight`,
    description: category.description || `${category.name} বিভাগের সর্বশেষ খবর`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">বিভাগ পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-8">
            দুঃখিত, &quot;{params.slug}&quot; নামে কোন বিভাগ পাওয়া যায়নি।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const page = parseInt(searchParams.page || '1');
  const { news, pagination } = await getNewsByCategory(category._id, page);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">হোম</Link>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>

        {/* Back button */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ফিরে যান
          </Link>
        </div>

        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 mb-3">{category.description}</p>
          )}
          <div className="text-sm text-gray-500">{pagination.total} টি খবর</div>
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
            <p className="text-gray-500 text-lg mb-4">এই বিভাগে কোন খবর পাওয়া যায়নি</p>
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              হোম পেজে ফিরে যান
            </Link>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Link
                    key={pageNum}
                    href={`/category/${params.slug}?page=${pageNum}`}
                    className={`px-4 py-2 rounded-lg ${
                      pageNum === page
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