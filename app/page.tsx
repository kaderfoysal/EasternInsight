// app/page.tsx
import { Metadata } from 'next';
import NewsCard from '@/components/NewsCard';
import FeaturedNews from '@/components/FeaturedNews';
import CategorySection from '@/components/CategorySection';
import OpinionCard from '@/components/OpinionCard';
import dbConnect from '@/lib/mongodb';
import Opinion from '@/lib/models/Opinion';
import { ObjectId } from 'mongodb';

export const metadata: Metadata = {
  title: 'Eastern Insight পোর্টাল - সর্বশেষ খবর',
  description: 'আপনার বিশ্বস্ত সংবাদ উৎস - সর্বশেষ খবর, রাজনীতি, ব্যবসা, ক্রীড়া, বিনোদন এবং প্রযুক্তি',
  openGraph: {
    title: 'Eastern Insight পোর্টাল - সর্বশেষ খবর',
    description: 'আপনার বিশ্বস্ত সংবাদ উৎস - সর্বশেষ খবর, রাজনীতি, ব্যবসা, ক্রীড়া, বিনোদন এবং প্রযুক্তি',
    type: 'website',
  },
};

// Define TypeScript interfaces for our models
interface IAuthor {
  _id: ObjectId;
  name: string;
}

interface IOpinion {
  _id: ObjectId;
  title: string;
  content: string;
  author: IAuthor | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

async function getNews() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/news?limit=10`, {
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
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/news?featured=true&limit=3`, {
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

async function getOpinions() {
  try {
    await dbConnect();
    
    // Get the raw data from MongoDB
    const opinions = await Opinion.find({ published: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();
    
    // Convert MongoDB documents to plain objects with proper typing
    const plainOpinions = opinions.map((opinion: any) => {
      // Ensure all required fields exist
      const typedOpinion: IOpinion = {
        _id: opinion._id as ObjectId,
        title: opinion.title || '',
        content: opinion.content || '',
        author: opinion.author ? {
          _id: opinion.author._id as ObjectId,
          name: opinion.author.name || ''
        } : null,
        published: opinion.published || false,
        createdAt: new Date(opinion.createdAt),
        updatedAt: new Date(opinion.updatedAt)
      };
      
      return {
        ...typedOpinion,
        _id: typedOpinion._id.toString(),
        author: typedOpinion.author ? {
          ...typedOpinion.author,
          _id: typedOpinion.author._id.toString()
        } : null,
        createdAt: typedOpinion.createdAt.toISOString(),
        updatedAt: typedOpinion.updatedAt.toISOString(),
      };
    });
    
    return { opinions: plainOpinions };
  } catch (error) {
    console.error('Error fetching opinions:', error);
    return { opinions: [] };
  }
}

export default async function HomePage() {
  const [newsData, featuredData, opinionsData] = await Promise.all([
    getNews(),
    getFeaturedNews(),
    getOpinions(),
  ]);

  const { news, pagination } = newsData;
  const { news: featuredNews } = featuredData;
  const { opinions } = opinionsData;

  return (
    <div className="min-h-screen bg-gray-50 ">
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

      {/* Opinions Section */}
      {opinions && opinions.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              মতামত
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {opinions.map((opinion: any) => (
                <OpinionCard key={opinion._id} opinion={opinion} />
              ))}
            </div>
          </div>
        </section>
      )}

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