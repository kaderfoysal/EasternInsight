import { Metadata } from 'next';
import NewsCard from '@/components/NewsCard';
import FeaturedNews from '@/components/FeaturedNews';
import CategorySection from '@/components/CategorySection';
import VideoCard from '@/components/VideoCard';
import GoogleAdBanner from '@/components/GoogleAdBanner';
import dbConnect from '@/lib/mongodb';
import Video from '@/lib/models/Video';
import { ObjectId } from 'mongodb';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Eastern Insight Portal - Latest News',
  description: 'Your trusted news source - Latest news, politics, business, sports, entertainment and technology',
  openGraph: {
    title: 'Eastern Insight Portal - Latest News',
    description: 'Your trusted news source - Latest news, politics, business, sports, entertainment and technology',
    type: 'website',
  },
};

async function getNews() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/news?limit=20`, {
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
    console.log('res', res);

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
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/opinion-news?limit=4`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('opinion-news fetch failed status', res.status);
      throw new Error('Failed to fetch opinion news');
    }
    const data = await res.json();
    console.log('opinion-news api response count', data.news?.length || 0);
    const opinions = (data.news || []).map((article: any) => ({
      ...article,
      writerName: article.authorNameForOpinion || article.author?.name || 'লেখক অজানা',
      opinionImage: article.image,
    }));
    return { opinions };
  } catch (error) {
    console.error('CRITICAL ERROR fetching opinion news:', error);
    return { opinions: [] };
  }
}

async function getVideos() {
  try {
    console.log('Starting to fetch videos...');
    await dbConnect();
    console.log('DB connected for videos');

    const videos = await Video.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean()
      .exec();

    console.log('Fetched videos from DB:', videos?.length || 0);

    if (!videos || videos.length === 0) {
      console.log('No videos found in database');
      return { videos: [] };
    }

    const plainVideos = videos.map((video: any) => {
      return {
        _id: video._id?.toString() || '',
        title: video.title || '',
        description: video.description || '',
        youtubeVideoId: video.youtubeVideoId || '',
        thumbnailUrl: video.thumbnailUrl || '',
        image: video.image || '',
        category: video.category || '',
        createdAt: video.createdAt ? new Date(video.createdAt).toISOString() : new Date().toISOString(),
      };
    });

    console.log('Successfully processed videos:', plainVideos.length);
    return { videos: plainVideos };
  } catch (error) {
    console.error('CRITICAL ERROR fetching videos:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return { videos: [] };
  }
}

export default async function HomePage() {
  // Use Promise.allSettled to prevent one failure from breaking all
  const results = await Promise.allSettled([
    getNews(),
    getFeaturedNews(),
    getOpinions(),
    getVideos(),
  ]);

  // Extract results with fallbacks
  const newsData = results[0].status === 'fulfilled' ? results[0].value : { news: [], pagination: { total: 0, pages: 0 } };
  const featuredData = results[1].status === 'fulfilled' ? results[1].value : { news: [] };
  const opinionsData = results[2].status === 'fulfilled' ? results[2].value : { opinions: [] };
  const videosData = results[3].status === 'fulfilled' ? results[3].value : { videos: [] };

  // Log any failures
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const names = ['news', 'featured', 'opinions', 'videos'];
      console.error(`Failed to fetch ${names[index]}:`, result.reason);
    }
  });

  const { news, pagination } = newsData;
  const { news: featuredNews } = featuredData;
  const { opinions } = opinionsData;
  const { videos } = videosData;

  console.log('homepage opinions derived', {
    totalNews: news?.length || 0,
    opinionCount: opinions.length,
    opinionSlugs: opinions.map((o: any) => o.slug || o._id),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Google Ad Banner - Between Header and Featured News */}
      <section className="w-full bg-white">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-center"
          style={{ maxWidth: '1400px', maxHeight: '100px', overflow: 'hidden' }}
        >
          <GoogleAdBanner
            adSlot="1234567890"
            adFormat="horizontal"
            style={{ width: '728px', height: '90px', display: 'block' }}
            className="text-center"
          />
        </div>
      </section>

      {/* Featured News Section */}
      {featuredNews && featuredNews.length > 0 && (
        <section>
          <FeaturedNews news={featuredNews} />
        </section>
      )}
      <section className="py-8">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: '1400px' }}
        >
          {news && news.length > 0 ? (
            <div className='grid grid-cols-1 lg:grid-cols-10 gap-8'>
              {/* Left side - News cards (70% width) */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((article: any) => (
                    <NewsCard
                      key={article._id}
                      article={{
                        _id: article._id,
                        title: article.title,
                        slug: article.slug || article._id,
                        excerpt: article.excerpt,
                        image: article.image,
                        createdAt: article.createdAt,
                        author: {
                          name: article.author?.name || 'Admin'
                        },
                        category: {
                          name: article.category?.name || 'Uncategorized',
                          slug: article.category?.slug || 'uncategorized'
                        },
                        views: article.views || 0
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Right side - Latest news list (30% width) */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col">
                  <h2 className="text-lg font-bold text-center text-gray-900 mb-3 pb-2 border-b">
                    সর্বশেষ খবর
                  </h2>

                  <div className="space-y-2 mb-3">
                    {news.slice(0, 4).map((article: any, index: number) => (
                      <div key={index} className="border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
                        <a
                          href={`/news/${article.slug}`}
                          className="text-gray-800 hover:text-blue-600 font-semibold transition-colors text-[15px] leading-6 line-clamp-2"
                        >
                          {article.title}
                        </a>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          {article.category?.name && (
                            <span className="text-blue-600 font-medium">
                              {article.category.name}
                            </span>
                          )}
                          {article.category?.name && <span className="mx-1.5">•</span>}
                          <span>{new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Google Ad Banner - After Latest News heading */}
                  <div className="flex justify-center">
                    <GoogleAdBanner
                      adSlot="5678901234"  // Different ad slot ID
                      adFormat="horizontal"
                      style={{ width: '300px', height: '200px', display: 'block' , minHeight: '200px'}}
                      className="text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No news available
              </p>
            </div>
          )}

          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-4 py-2 rounded-lg ${i + 1 === 1
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

      {/* Google Ad Banner - After Latest News Section */}
      <section className="w-full bg-white py-4">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-center"
          style={{ maxWidth: '1400px', maxHeight: '100px', overflow: 'hidden' }}
        >
          <GoogleAdBanner
            adSlot="0987654321"  // Different ad slot ID
            adFormat="horizontal"
            style={{ width: '728px', height: '90px', display: 'block' }}
            className="text-center"
          />
        </div>
      </section>

      {opinions && opinions.length > 0 && (
        <section className="py-12 bg-gray-100">
          <div
            className="mx-auto px-4 sm:px-6 lg:px-8"
            style={{ maxWidth: '1400px' }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              মতামত
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {opinions.map((article: any) => (
                <Link
                  key={article._id}
                  href={`/news/${article.slug || article._id}`}
                  className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="relative h-48 w-full">
                    {article.opinionImage ? (
                      <Image
                        src={article.opinionImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {article.writerName || 'লেখক অজানা'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos Section */}
      {videos && videos.length > 0 && (
        <section className="py-12 bg-gray-900">
          <div
            className="mx-auto px-4 sm:px-6 lg:px-8"
            style={{ maxWidth: '1400px' }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              সাক্ষাতকার
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
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: '1400px' }}
        >
          {/* <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            News by Category
          </h2> */}
          <CategorySection />
        </div>
      </section>
    </div>
  );
}
