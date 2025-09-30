import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface OpinionPageProps {
  params: {
    id: string;
  };
}

async function getOpinion(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/opinions?slug=${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.opinion;
  } catch (error) {
    console.error('Error fetching opinion:', error);
    return null;
  }
}

export async function generateMetadata({ params }: OpinionPageProps): Promise<Metadata> {
  const opinion = await getOpinion(params.id);

  if (!opinion) {
    return {
      title: 'মতামত পাওয়া যায়নি',
    };
  }

  return {
    title: `${opinion.title} - মতামত`,
    description: opinion.excerpt || opinion.subtitle || opinion.title,
    openGraph: {
      title: opinion.title,
      description: opinion.excerpt || opinion.subtitle || opinion.title,
      images: opinion.opinionImage ? [opinion.opinionImage] : [],
    },
  };
}

export default async function OpinionPage({ params }: OpinionPageProps) {
  const opinion = await getOpinion(params.id);

  if (!opinion) {
    notFound();
  }

  const formattedDate = new Date(opinion.createdAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(opinion.createdAt).toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">হোম</Link>
            </li>
            <li>/</li>
            <li>
              <span className="text-gray-900">মতামত</span>
            </li>
          </ol>
        </nav>

        {/* Article Container */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Opinion Image */}
          {opinion.opinionImage && (
            <div className="relative w-full h-96">
              <Image
                src={opinion.opinionImage}
                alt={opinion.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8">
            {/* Writer Info */}
            <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                {opinion.writerImage ? (
                  <Image
                    src={opinion.writerImage}
                    alt={opinion.writerName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <p className="text-xl font-bold text-gray-900">{opinion.writerName}</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <time dateTime={opinion.createdAt}>
                    {formattedDate} • {formattedTime}
                  </time>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {opinion.title}
            </h1>

            {/* Subtitle */}
            {opinion.subtitle && (
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                {opinion.subtitle}
              </p>
            )}

            {/* Description */}
            <div 
              className="prose prose-lg max-w-none mt-8"
              dangerouslySetInnerHTML={{ __html: opinion.description }}
            />
          </div>
        </article>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
