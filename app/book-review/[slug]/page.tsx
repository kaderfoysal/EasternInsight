// import { notFound } from 'next/navigation';
// import { Metadata } from 'next';
// import dbConnect from '@/lib/mongodb';
// import BookReview from '@/lib/models/BookReview';
// import Image from 'next/image';
// import mongoose from 'mongoose';

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// type Params = { slug: string };

// async function getReview(slug: string) {
//   await dbConnect();
//   const decoded = decodeURIComponent(slug);

//   let review = await BookReview.findOne({ slug: decoded, published: true }).lean();

//   if (!review && mongoose.Types.ObjectId.isValid(decoded)) {
//     review = await BookReview.findOne({ _id: decoded, published: true }).lean();
//   }

//   if (!review) return null;
//   return {
//     ...review,
//     _id: review._id.toString(),
//     createdAt: review.createdAt?.toISOString?.() || review.createdAt,
//   };
// }

// export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
//   const review = await getReview(params.slug);
//   if (!review) {
//     return { title: 'বই পর্যালোচনা' };
//   }
//   return {
//     title: `${review.title} | বই পর্যালোচনা`,
//     description: review.excerpt || review.title,
//     openGraph: {
//       title: review.title,
//       description: review.excerpt || review.title,
//       images: review.image ? [review.image] : undefined,
//     },
//   };
// }

// export default async function BookReviewDetail({ params }: { params: Params }) {
//   const review = await getReview(params.slug);
//   if (!review) return notFound();

//   return (
//     <div className="min-h-screen bg-gray-50 py-10">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">{review.title}</h1>
//         <div className="flex items-center text-sm text-gray-600 mb-6 gap-3">
//           <span>{review.authorName || 'অজানা লেখক'}</span>
//           <span className="text-gray-400">•</span>
//           <span>{new Date(review.createdAt).toLocaleDateString('bn-BD')}</span>
//         </div>

//         {review.image && (
//           <div className="relative w-full h-80 md:h-96 mb-6 rounded-xl overflow-hidden bg-gray-100">
//             <Image
//               src={review.image}
//               alt={review.title}
//               fill
//               className="object-cover"
//               sizes="(max-width:768px) 100vw, 800px"
//               priority
//             />
//           </div>
//         )}

//         <article className="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-7">
//           {review.content}
//         </article>
//       </div>
//     </div>
//   );
// }



// 2

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import BookReview from '@/lib/models/BookReview';
import Image from 'next/image';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = {
  slug: string;
};

/* ========================================
   Lean Type (IMPORTANT)
   This must NOT extend Document
======================================== */

type LeanBookReview = {
  _id: Types.ObjectId;
  title: string;
  authorName?: string;
  content: string;
  image?: string;
  slug: string;
  excerpt?: string;
  published: boolean;
  createdAt: Date;
};

/* ========================================
   Serialized Type (sent to page)
======================================== */

type SerializedReview = {
  _id: string;
  title: string;
  authorName?: string;
  content: string;
  image?: string;
  slug: string;
  excerpt?: string;
  published: boolean;
  createdAt: string;
};

/* ========================================
   Fetch Review
======================================== */

async function getReview(slug: string): Promise<SerializedReview | null> {
  await dbConnect();

  const decoded = decodeURIComponent(slug);

  let review = await BookReview.findOne({
    slug: decoded,
    published: true,
  }).lean<LeanBookReview>();

  // Fallback: allow ObjectId access
  if (!review && Types.ObjectId.isValid(decoded)) {
    review = await BookReview.findOne({
      _id: decoded,
      published: true,
    }).lean<LeanBookReview>();
  }

  if (!review) return null;

  return {
    _id: review._id.toString(),
    title: review.title,
    authorName: review.authorName,
    content: review.content,
    image: review.image,
    slug: review.slug,
    excerpt: review.excerpt,
    published: review.published,
    createdAt: review.createdAt.toISOString(),
  };
}

/* ========================================
   Metadata
======================================== */

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const review = await getReview(params.slug);

  if (!review) {
    return {
      title: 'বই পর্যালোচনা',
    };
  }

  return {
    title: `${review.title} | বই পর্যালোচনা`,
    description: review.excerpt || review.title,
    openGraph: {
      title: review.title,
      description: review.excerpt || review.title,
      images: review.image ? [review.image] : undefined,
    },
  };
}

/* ========================================
   Page Component
======================================== */

export default async function BookReviewDetail({
  params,
}: {
  params: Params;
}) {
  const review = await getReview(params.slug);

  if (!review) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {review.title}
        </h1>

        <div className="flex items-center text-sm text-gray-600 mb-6 gap-3">
          <span>{review.authorName || 'অজানা লেখক'}</span>
          <span className="text-gray-400">•</span>
          <span>
            {new Date(review.createdAt).toLocaleDateString('bn-BD')}
          </span>
        </div>

        {review.image && (
          <div className="relative w-full h-80 md:h-96 mb-6 rounded-xl overflow-hidden bg-gray-100">
            <Image
              src={review.image}
              alt={review.title}
              fill
              sizes="(max-width:768px) 100vw, 800px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <article className="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-7">
          {review.content}
        </article>
      </div>
    </div>
  );
}