import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Opinion from '@/lib/models/Opinion';

interface OpinionPageProps {
  params: {
    id: string;
  };
}

async function getOpinion(id: string) {
  try {
    await dbConnect();
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid MongoDB ObjectId format:', id);
      return null;
    }
    
    const opinion = await Opinion.findOne({ _id: id, published: true })
      .populate('author', 'name')
      .lean() as any;

    if (!opinion) {
      console.log('Opinion not found for id:', id);
      return null;
    }

    // Convert to plain object with proper serialization
    return {
      _id: opinion._id.toString(),
      writerName: opinion.writerName || '',
      writerImage: opinion.writerImage || '',
      title: opinion.title || '',
      subtitle: opinion.subtitle || '',
      opinionImage: opinion.opinionImage || '',
      description: opinion.description || '',
      excerpt: opinion.excerpt || '',
      slug: opinion.slug || '',
      createdAt: new Date(opinion.createdAt).toISOString(),
    };
  } catch (error) {
    console.error('Error fetching opinion:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
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
  const opinionData = await getOpinion(params.id);

  if (!opinionData) {
    notFound();
  }

  // Type assertion after null check
  const opinion = opinionData!;

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
          <div className="p-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {opinion.title}
            </h1>

            {/* Subtitle */}
            {opinion.subtitle && (
              <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed bg-gray-100 p-4 rounded">
                {opinion.subtitle}
              </p>
            )}

            {/* Writer Info */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                {opinion.writerName}
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <span>প্রকাশ : </span>
                <time dateTime={opinion.createdAt} className="ml-1">
                  {formattedDate}, {formattedTime}
                </time>
              </div>
            </div>

            {/* Opinion Image */}
            {opinion.opinionImage && (
              <div className="relative w-full h-64 md:h-96 mb-8">
                <Image
                  src={opinion.opinionImage}
                  alt={opinion.title}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            )}

            {/* Description */}
            <div 
              className="prose prose-lg max-w-none"
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
