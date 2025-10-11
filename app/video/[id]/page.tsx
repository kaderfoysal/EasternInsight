import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface VideoPageProps {
  params: {
    id: string;
  };
}

async function getVideo(id: string) {
  try {
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid MongoDB ObjectId format:', id);
      return null;
    }

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    // Try the new route first, fallback to query param route
    let url = `${baseUrl}/api/videos/${id}`;
    
    console.log('Fetching video from:', url);
    
    let res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // If new route doesn't exist (404), try the old query param route
    if (res.status === 404) {
      url = `${baseUrl}/api/videos?id=${id}`;
      console.log('Trying fallback URL:', url);
      res = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!res.ok) {
      console.error('Video fetch failed:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    const video = data.video;

    if (!video) {
      console.log('Video not found for id:', id);
      return null;
    }

    return {
      _id: video._id.toString(),
      title: video.title || '',
      description: video.description || '',
      youtubeUrl: video.youtubeUrl || '',
      youtubeVideoId: video.youtubeVideoId || '',
      thumbnailUrl: video.thumbnailUrl || '',
      image: video.image || '',
      category: video.category || '',
      createdAt: video.createdAt ? new Date(video.createdAt).toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching video:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return null;
  }
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const video = await getVideo(params.id);

  if (!video) {
    return {
      title: 'ভিডিও পাওয়া যায়নি',
      description: 'এই ভিডিওটি খুঁজে পাওয়া যায়নি',
    };
  }

  const ogImage = video.thumbnailUrl || video.image;
  
  return {
    title: `${video.title} - ভিডিও`,
    description: video.description || video.title,
    openGraph: {
      title: video.title,
      description: video.description || video.title,
      images: ogImage ? [ogImage] : [],
      type: 'video.other',
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const videoData = await getVideo(params.id);

  if (!videoData) {
    notFound();
  }

  // Type assertion after null check
  const video = videoData!;

  const formattedDate = new Date(video.createdAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(video.createdAt).toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 md:mb-6">
          <ol className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">হোম</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/#videos" className="hover:text-blue-600">ভিডিও</Link>
            </li>
            <li>/</li>
            <li>
              <span className="text-gray-900">বিস্তারিত</span>
            </li>
          </ol>
        </nav>

        {/* Video Container */}
        <article className="bg-white rounded-lg shadow-md lg:shadow-lg overflow-hidden">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Title */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
              {video.title}
            </h1>

            {/* Category and Date */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
              {video.category && (
                <span className="bg-red-600 text-white px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm font-semibold rounded">
                  {video.category}
                </span>
              )}
              <div className="flex items-center text-xs md:text-sm text-gray-600">
                <span>প্রকাশ : </span>
                <time dateTime={video.createdAt} className="ml-1">
                  {formattedDate}, {formattedTime}
                </time>
              </div>
            </div>

            {/* YouTube Video Embed or Image */}
            {video.youtubeVideoId ? (
              <div className="relative w-full aspect-video mb-4 md:mb-8 bg-black rounded-md md:rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeVideoId}?rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            ) : video.image ? (
              <div className="relative w-full mb-4 md:mb-8 rounded-md md:rounded-lg overflow-hidden">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            ) : null}

            {/* Description */}
            {video.description && (
              <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed md:leading-loose whitespace-pre-wrap">
                  {video.description}
                </p>
              </div>
            )}

            {/* Social Share Buttons */}
            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
              <p className="text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">শেয়ার করুন:</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-md md:rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-400 text-white rounded-md md:rounded-lg hover:bg-blue-500 transition-colors text-xs md:text-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Back Button */}
        <div className="mt-6 md:mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
