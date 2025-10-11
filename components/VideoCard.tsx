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
      <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Video Thumbnail or Image */}
        <div className="relative w-full aspect-[16/10]">
          {video.thumbnailUrl || video.image ? (
            <Image
              src={video.thumbnailUrl || video.image || ''}
              alt={video.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
            </div>
          )}
          
          {/* Play Button Overlay - Only show if it's a video */}
          {video.youtubeVideoId && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <svg className="w-7 h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          )}

          {/* Category Badge */}
          {video.category && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2.5 py-1 text-xs font-semibold rounded-md shadow-md">
              {video.category}
            </div>
          )}
        </div>

        {/* Video Info - Below Image */}
        <div className="p-3 bg-gray-800">
          <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 leading-tight group-hover:text-red-400 transition-colors duration-200">
            {video.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
