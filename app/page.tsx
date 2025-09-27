// app/page.tsx
import { Metadata } from 'next';
import NewsCard from '@/components/NewsCard';
import FeaturedNews from '@/components/FeaturedNews';
import CategorySection from '@/components/CategorySection';

export const metadata: Metadata = {
  title: 'বাংলা সংবাদ পোর্টাল - সর্বশেষ খবর',
  description: 'আপনার বিশ্বস্ত সংবাদ উৎস - সর্বশেষ খবর, রাজনীতি, ব্যবসা, ক্রীড়া, বিনোদন এবং প্রযুক্তি',
  openGraph: {
    title: 'বাংলা সংবাদ পোর্টাল - সর্বশেষ খবর',
    description: 'আপনার বিশ্বস্ত সংবাদ উৎস - সর্বশেষ খবর, রাজনীতি, ব্যবসা, ক্রীড়া, বিনোদন এবং প্রযুক্তি',
    type: 'website',
  },
};

async function getNews() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/news?limit=10`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch news');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return { news: [], pagination: { total: 0, pages: 0 } };
  }
}

async function getFeaturedNews() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/news?featured=true&limit=3`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch featured news');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching featured news:', error);
    return { news: [] };
  }
}

export default async function HomePage() {
  const [newsData, featuredData] = await Promise.all([
    getNews(),
    getFeaturedNews(),
  ]);

  const { news, pagination } = newsData;
  const { news: featuredNews } = featuredData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Featured News Section */}
      {featuredNews && featuredNews.length > 0 && (
        <section>
          <FeaturedNews news={featuredNews} />
        </section>
      )}

      {/* Latest News Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            সর্বশেষ খবর
          </h2>
          
          {news && news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article: any) => (
                <NewsCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                কোন খবর পাওয়া যায়নি
              </p>
            </div>
          )}

          {pagination && pagination.pages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex space-x-2">
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-4 py-2 rounded-lg ${
                      i + 1 === 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                {pagination.pages > 5 && (
                  <>
                    <span className="px-4 py-2 text-gray-500">...</span>
                    <button className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
                      {pagination.pages}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Category Sections */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            বিভাগ অনুযায়ী খবর
          </h2>
          <CategorySection />
        </div>
      </section>
    </div>
  );
}