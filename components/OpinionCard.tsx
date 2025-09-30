import Link from 'next/link';
import Image from 'next/image';

interface OpinionCardProps {
  opinion: {
    _id: string;
    writerName: string;
    writerImage?: string;
    title: string;
    subtitle?: string;
    opinionImage?: string;
    excerpt?: string;
    slug: string;
    createdAt: string;
  };
}

export default function OpinionCard({ opinion }: OpinionCardProps) {
  return (
    <Link href={`/opinion/${opinion.slug}`}>
      <div className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Opinion Image */}
        {opinion.opinionImage && (
          <div className="relative w-full h-48 bg-gray-200">
            <Image
              src={opinion.opinionImage}
              alt={opinion.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-6 flex-1 flex flex-col">
          {/* Writer Info */}
          <div className="flex items-center mb-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
              {opinion.writerImage ? (
                <Image
                  src={opinion.writerImage}
                  alt={opinion.writerName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-900">{opinion.writerName}</p>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-orange-600 mb-2 hover:text-orange-700 transition-colors line-clamp-2">
            {opinion.title}
          </h3>

          {/* Subtitle */}
          {opinion.subtitle && (
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
              {opinion.subtitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
