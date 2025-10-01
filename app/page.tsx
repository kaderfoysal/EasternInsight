// app/page.tsx
import { Metadata } from 'next';
import NewsCard from '@/components/NewsCard';
import FeaturedNews from '@/components/FeaturedNews';
import CategorySection from '@/components/CategorySection';
import OpinionCard from '@/components/OpinionCard';
import VideoCard from '@/components/VideoCard';
import dbConnect from '@/lib/mongodb';
import Opinion from '@/lib/models/Opinion';
import Video from '@/lib/models/Video';
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
    console.log('res' , res);
    
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
    
    console.log('Fetched opinions from DB:', opinions.length);
    
    // Convert MongoDB documents to plain objects matching OpinionCard interface
    const plainOpinions = opinions.map((opinion: any) => {
      return {
        _id: opinion._id.toString(),
        writerName: opinion.writerName || '',
        writerImage: opinion.writerImage || '',
        title: opinion.title || '',
        subtitle: opinion.subtitle || '',
        opinionImage: opinion.opinionImage || '',
        excerpt: opinion.excerpt || '',
        slug: opinion.slug || '',
        createdAt: new Date(opinion.createdAt).toISOString(),
      };
    });
    
    return { opinions: plainOpinions };
  } catch (error) {
    console.error('Error fetching opinions:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return { opinions: [] };
  }
}

async function getVideos() {
  try {
    await dbConnect();
    
    const videos = await Video.find({ published: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
    
    console.log('Fetched videos from DB:', videos.length);
    
    const plainVideos = videos.map((video: any) => {
      return {
        _id: video._id.toString(),
        title: video.title || '',
        description: video.description || '',
        youtubeVideoId: video.youtubeVideoId || '',
        thumbnailUrl: video.thumbnailUrl || '',
        category: video.category || '',
        createdAt: new Date(video.createdAt).toISOString(),
      };
    });
    
    return { videos: plainVideos };
  } catch (error) {
    console.error('Error fetching videos:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return { videos: [] };
  }
}

export default async function HomePage() {
  const [newsData, featuredData, opinionsData, videosData] = await Promise.all([
    getNews(),
    getFeaturedNews(),
    getOpinions(),
    getVideos(),
  ]);

  const { news, pagination } = newsData;
  const { news: featuredNews } = featuredData;
  const { opinions } = opinionsData;
  const { videos } = videosData;

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
              {opinions.map((opinion: any) => (
                <OpinionCard key={opinion._id} opinion={opinion} />
              ))}
            </div>
          </div>
        </section>
      )}

       {/* Videos Section */}
       {videos && videos.length > 0 && (
        <section className="py-12 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              ভিডিও
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((video: any) => (
                <VideoCard key={video._id} video={video} />
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