import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Eye } from 'lucide-react';
import { format } from 'date-fns';
import bn from 'date-fns/locale/bn';

async function getNews(id: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/news/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
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

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            {/* Add null check for category */}
            {news.category ? (
              <Link 
                href={`/category/${news.category?.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {news.category.name}
              </Link>
            ) : (
              <span className="text-blue-600 font-medium">
                {news.category?.name || 'Uncategorized'}
              </span>
            )}
            <span className="mx-2">•</span>
            <span>{formatDate(news.createdAt)}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {news.title}
          </h1>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
            {/* Add null check for author */}
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

        {/* Add null check for image */}
        {news.image && (
          <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Add null check for content with custom styling */}
        <div 
          className="prose prose-lg max-w-none custom-news-content text-base"
          dangerouslySetInnerHTML={{ __html: news.content || '' }}
        />
        
        {/* Custom styles for the content */}
        <style>{`
          .custom-news-content {
            font-family: inherit;
          }
          
          .custom-news-content p {
            font-weight: 300;
            line-height: 1.8;
            margin-bottom: 1.25rem;
            color: #374151;
          }
          
          .custom-news-content h1, 
          .custom-news-content h2, 
          .custom-news-content h3, 
          .custom-news-content h4, 
          .custom-news-content h5, 
          .custom-news-content h6 {
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }
          
          .custom-news-content ul, 
          .custom-news-content ol {
            margin-bottom: 1.25rem;
          }
          
          .custom-news-content li {
            margin-bottom: 0.5rem;
            line-height: 1.6;
          }
          
          .custom-news-content blockquote {
            font-weight: 400;
            line-height: 1.6;
            font-style: italic;
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            margin: 1.5rem 0;
            color: #4b5563;
          }
        `}</style>
      </div>
    </article>
  );
}