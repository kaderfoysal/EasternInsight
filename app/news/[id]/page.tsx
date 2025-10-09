import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Eye } from 'lucide-react';
import { format } from 'date-fns';
import bn from 'date-fns/locale/bn';
import GoogleAdBanner from '@/components/GoogleAdBanner';

async function getNews(id: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/news/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.news;
}

async function getRelatedNews(categoryId: string, currentNewsId: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/news?category=${categoryId}&limit=10`;
    console.log('Fetching related news from:', url);
    
    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Related news fetch failed:', res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    console.log('Related news API response:', data);
    
    // Filter out current news and return only 6 items
    const filtered = data.news.filter((n: any) => n._id.toString() !== currentNewsId.toString()).slice(0, 6);
    console.log('Filtered related news:', filtered.length);
    return filtered;
  } catch (error) {
    console.error('Error fetching related news:', error);
    return [];
  }
}

async function getMostViewedNews(categoryId: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/news?category=${categoryId}&limit=10&sortBy=views`;
    console.log('Fetching most viewed news from:', url);
    
    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Most viewed news fetch failed:', res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    console.log('Most viewed news API response:', data);
    return data.news.slice(0, 10);
  } catch (error) {
    console.error('Error fetching most viewed news:', error);
    return [];
  }
}

export default async function NewsPage({ params }: { params: { id: string } }) {
  const news = await getNews(params.id);

  if (!news) {
    notFound();
  }

  // Extract category ID - handle both populated and non-populated cases
  let categoryId = null;
  if (news.category) {
    if (typeof news.category === 'object' && news.category._id) {
      categoryId = news.category._id.toString();
    } else if (typeof news.category === 'string') {
      categoryId = news.category;
    }
  }

  console.log('News category:', news.category);
  console.log('Extracted categoryId:', categoryId);

  const [relatedNews, mostViewedNews] = await Promise.all([
    categoryId ? getRelatedNews(categoryId, news._id) : Promise.resolve([]),
    categoryId ? getMostViewedNews(categoryId) : Promise.resolve([]),
  ]);

  console.log('Related news count:', relatedNews.length);
  console.log('Most viewed news count:', mostViewedNews.length);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, hh:mm a', { locale: bn });
    } catch {
      return new Date(dateString).toLocaleDateString('bn-BD');
    }
  };

  const contentHtml = news.content || '<p>কোনো বিষয়বস্তু পাওয়া যায়নি</p>';

  return (
    <div className='bg-gray-50'>
      {/* Top Ad Banner */}
      <section className="w-full bg-white py-4">
        <div className=" mx-auto px-2 flex justify-center">
          <GoogleAdBanner
            adSlot="1234567890"
            adFormat="horizontal"
            style={{ width: '728px', height: '90px', display: 'block' }}
            className="text-center"
          />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Related News (25%) */}
          <aside className="lg:col-span-3 order-2 lg:order-1">
            {relatedNews.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
                <div className="flex items-center mb-4 pb-3 border-b-2 border-red-600">
                  <div className="bg-red-600 w-1 h-6 mr-2"></div>
                  <h2 className="text-lg font-bold text-gray-900">সম্পর্কিত সংবাদ</h2>
                </div>
                <div className="space-y-4">
                  {relatedNews.map((article: any) => (
                    <Link
                      key={article._id}
                      href={`/news/${article._id}`}
                      className="block group"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-3 group-hover:text-red-600 transition mb-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(article.createdAt).toLocaleDateString('bn-BD')}</span>
                      </div>
                      <div className="border-b border-gray-200 mt-3"></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main Content - Center (50%) */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <article className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  {news.category ? (
                    <Link
                      href={`/category/${news.category.slug}`}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-700 transition"
                    >
                      {news.category.name}
                    </Link>
                  ) : (
                    <span className="text-gray-400">বিভাগ নেই</span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {news.title}
                </h1>

                {news.subtitle && (
                  <h2 className="text-xl md:text-2xl text-gray-600 mb-4 font-light">
                    {news.subtitle}
                  </h2>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6 pb-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{news.author?.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(news.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{news.views || 0} বার পঠিত</span>
                  </div>
                </div>
              </div>

              {news.image && (
                <div className="mb-8">
                  <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {news.imageCaption && (
                    <p className="text-sm text-gray-600 italic mt-2 text-center">
                      {news.imageCaption}
                    </p>
                  )}
                </div>
              )}

              <div
                className="prose prose-lg max-w-none prose-p:font-light prose-p:leading-loose prose-p:text-gray-800 prose-li:font-light prose-li:leading-loose prose-li:text-gray-800 prose-headings:text-gray-900"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* Social Share Buttons */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 font-semibold">শেয়ার করুন:</span>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm">
                      Facebook
                    </button>
                    <button className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition text-sm">
                      Twitter
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm">
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Right Sidebar - Ads & Most Viewed (25%) */}
          <aside className="lg:col-span-3 order-3">
            {/* Ad Space 1 */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <GoogleAdBanner
                adSlot="2345678901"
                adFormat="vertical"
                style={{ width: '300px', height: '250px', display: 'block' }}
              />
            </div>

            {/* Most Viewed Section */}
            {mostViewedNews.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-center mb-4 pb-3 border-b-2 border-red-600">
                  <div className="bg-red-600 w-1 h-6 mr-3"></div>
                  <h2 className="text-xl font-bold text-gray-900">সর্বাধিক পঠিত</h2>
                </div>
                <div className="space-y-4">
                  {mostViewedNews.map((article: any, index: number) => (
                    <Link
                      key={article._id}
                      href={`/news/${article._id}`}
                      className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition p-2 rounded"
                    >
                      {article.image && (
                        <div className="relative h-20 w-24 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-3 hover:text-red-600 transition mb-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{article.views || 0} বার পঠিত</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Ad Space 2 */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <GoogleAdBanner
                adSlot="3456789012"
                adFormat="vertical"
                style={{ width: '300px', height: '600px', display: 'block' }}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}