// import Link from 'next/link';
// import Image from 'next/image';

// interface OpinionCardProps {
//   opinion: {
//     _id: string;
//     writerName: string;
//     writerImage?: string;
//     title: string;
//     subtitle?: string;
//     opinionImage?: string;
//     excerpt?: string;
//     slug: string;
//     createdAt: string;
//   };
// }

// export default function OpinionCard({ opinion }: OpinionCardProps) {
//   return (
//     <Link href={`/opinion/${opinion._id}`} className="h-full group block px-4 pb-4 pt-8 relative rounded-xl bg-gray-200 min-h-[200px]">
//       {/* Writer Image - Absolutely positioned at top with negative offset */}
//       <div className="size-24 mx-auto absolute top-[-48px] right-0 left-0 p-1 bg-gray-200 rounded-full group-hover:scale-105 transition-transform duration-500 ease-in-out">
//         {opinion.writerImage ? (
//           <Image
//             src={opinion.writerImage}
//             alt={opinion.writerName}
//             width={96}
//             height={96}
//             className="object-cover rounded-full w-full h-full"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gray-400 rounded-full">
//             <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//             </svg>
//           </div>
//         )}
//       </div>

//       {/* Writer Name */}
//       <p className="text-sm sm:text-base font-semibold text-center text-gray-800 pt-6">
//         {opinion.writerName}
//       </p>

//       {/* Title */}
//       <div className="text-center h-full flex flex-col gap-2 pt-3">
//         <div>
//           <h3 className="text-[18px] leading-[26px] line-clamp-3 font-semibold group-hover:text-blue-600">
//             {opinion.title}
//           </h3>
//         </div>
//       </div>
//     </Link>
//   );
// }


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
  layout?: 'left' | 'right'; // Layout position for the image
}

export default function OpinionCard({ opinion, layout = 'left' }: OpinionCardProps) {
  return (
    <Link href={`/opinion/${opinion._id}`} className="h-full group block bg-white rounded-xl shadow-md overflow-hidden">
      <div className="flex h-full">
        {/* Image section */}
        <div className={`${layout === 'left' ? 'order-1' : 'order-2'} w-1/2`}>
          {opinion.opinionImage ? (
            <div className="h-full w-full">
              <Image
                src={opinion.opinionImage}
                alt={opinion.title}
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
        </div>
        
        {/* Text content section */}
        <div className={`${layout === 'left' ? 'order-2' : 'order-1'} w-1/2 p-6 flex flex-col justify-center`}>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 line-clamp-3">
              {opinion.title}
            </h3>
            <p className="text-sm font-medium text-gray-700">
              {opinion.writerName}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}