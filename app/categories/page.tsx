import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'সব বিভাগ - বাংলা সংবাদ পোর্টাল',
  description: 'আমাদের সব খবরের বিভাগ দেখুন',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">
            হোম
          </Link>
          <span>/</span>
          <span className="text-gray-900">সব বিভাগ</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            সব বিভাগ
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            আমাদের খবরের বিভিন্ন বিভাগ থেকে আপনার পছন্দের বিষয়বস্তু খুঁজে নিন
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: any) => (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
                
                {category.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                )}
                
                <div className="mt-4">
                  <Link
                    href={`/category/${category.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    সব খবর দেখুন
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              কোন বিভাগ পাওয়া যায়নি
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}