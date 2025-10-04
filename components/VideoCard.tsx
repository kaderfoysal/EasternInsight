import Link from 'next/link';
import Image from 'next/image';

interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    description?: string;
    youtubeVideoId?: string;
    thumbnailUrl?: string;
    image?: string;
    category?: string;
    createdAt: string;
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/video/${video._id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-black">
        {/* Video Thumbnail or Image */}
        <div className="relative w-full aspect-video">
          {video.thumbnailUrl || video.image ? (
            <Image
              src={video.thumbnailUrl || video.image || ''}
              alt={video.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
            </div>
          )}
          
          {/* Play Button Overlay - Only show if it's a video */}
          {video.youtubeVideoId && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          )}

          {/* Category Badge */}
          {video.category && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded">
              {video.category}
            </div>
          )}
        </div>

        {/* Video Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
          <h3 className="text-white font-bold text-base md:text-lg line-clamp-2 leading-snug">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-gray-300 text-sm mt-1 line-clamp-1">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
