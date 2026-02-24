
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
//   layout?: 'left' | 'right'; // Layout position for the image
// }

// export default function OpinionCard({ opinion, layout = 'left' }: OpinionCardProps) {
//   return (
//     <Link href={`/opinion/${opinion._id}`} className="h-full group block bg-white rounded-xl shadow-md overflow-hidden">
//       <div className="flex h-full">
//         {/* Image section */}
//         <div className={`${layout === 'left' ? 'order-1' : 'order-2'} w-1/2`}>
//           {opinion.opinionImage ? (
//             <div className="h-full w-full">
//               <Image
//                 src={opinion.opinionImage}
//                 alt={opinion.title}
//                 width={400}
//                 height={300}
//                 className="object-cover w-full h-full"
//               />
//             </div>
//           ) : (
//             <div className="h-full w-full bg-gray-200 flex items-center justify-center">
//               <span className="text-gray-500">No Image Available</span>
//             </div>
//           )}
//         </div>

//         {/* Text content section */}
//         <div className={`${layout === 'left' ? 'order-2' : 'order-1'} w-1/2 p-6 flex flex-col justify-center`}>
//           <div className="text-center">
//             <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 line-clamp-3">
//               {opinion.title}
//             </h3>
//             <p className="text-sm font-medium text-gray-700">
//               {opinion.writerName}
//             </p>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }


// 2


import Link from 'next/link';
import Image from 'next/image';

interface OpinionCardProps {
  opinion: {
    _id: string;
    writerName: string;
    title: string;
    slug: string;
    opinionImage?: string; // Add this line to fix the error
  };
}

export default function OpinionCard({ opinion }: OpinionCardProps) {
  return (
    <Link href={`/opinion/${opinion._id}`} className="group block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image at the top */}
      <div className="relative h-48 overflow-hidden">
        {opinion.opinionImage ? (
          <Image
            src={opinion.opinionImage}
            alt={opinion.title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-lg">No Image Available</span>
          </div>
        )}
      </div>

      {/* Content below the image */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {opinion.title}
        </h3>

        {/* Author name - simplified without image */}
        <p className="text-sm font-medium text-gray-700">
          {opinion.writerName}
        </p>
      </div>
    </Link>
  );
}