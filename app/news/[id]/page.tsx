import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Eye } from 'lucide-react';
import { format } from 'date-fns';
import bn from 'date-fns/locale/bn';

async function getNews(id: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/news/${id}`, {
    cache: 'no-store', // Don't cache as we increment views on each visit
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.news; // Extract the news object from the response
}

export default async function NewsPage({ params }: { params: { id: string } }) {
  const news = await getNews(params.id);

  if (!news) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: bn });
    } catch {
      return new Date(dateString).toLocaleDateString('bn-BD');
    }
  };

  // Ensure content is always a valid HTML string
  const contentHtml = news.content || '<p>কোনো বিষয়বস্তু পাওয়া যায়নি</p>';

  return (
    <div className='bg-white'>
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              {news.category ? (
                <Link
                  href={`/category/${news.category.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {news.category.name}
                </Link>
              ) : (
                <span className="text-gray-400">বিভাগ নেই</span>
              )}
              <span className="mx-2">•</span>
              <span>{formatDate(news.createdAt)}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {news.title}
            </h1>

            {news.subtitle && (
              <h2 className="text-xl md:text-2xl text-gray-600 mb-4 font-light italic">
                {news.subtitle}
              </h2>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{news.author?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{news.views || 0} views</span>
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
            className="prose prose-lg max-w-none prose-p:font-light prose-p:leading-loose prose-p:text-red-800 prose-li:font-light prose-li:leading-loose prose-li:text-red-800"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </article>
    </div>
  );
}