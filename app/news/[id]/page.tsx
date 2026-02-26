// import { notFound } from 'next/navigation';
// import { Metadata } from 'next';
// import dbConnect from '@/lib/mongodb';
// import News from '@/lib/models/News';
// import Image from 'next/image';
// import mongoose from 'mongoose';

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// type Params = { id: string };

// async function getArticle(id: string) {
//   await dbConnect();
//   const decoded = decodeURIComponent(id);

//   let article = await News.findOne({ slug: decoded, published: true })
//     .populate('author', 'name')
//     .populate('category', 'name slug')
//     .lean();

//   if (!article && mongoose.Types.ObjectId.isValid(decoded)) {
//     article = await News.findOne({ _id: decoded, published: true })
//       .populate('author', 'name')
//       .populate('category', 'name slug')
//       .lean();
//   }

//   if (!article) return null;

//   return {
//     ...article,
//     _id: article._id.toString(),
//     createdAt: article.createdAt?.toISOString?.() || article.createdAt,
//     updatedAt: article.updatedAt?.toISOString?.() || article.updatedAt,
//   };
// }

// export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
//   const article = await getArticle(params.id);
//   if (!article) return { title: 'News' };
//   return {
//     title: article.title,
//     description: article.excerpt || article.title,
//     openGraph: {
//       title: article.title,
//       description: article.excerpt || article.title,
//       images: article.image ? [article.image] : undefined,
//     },
//   };
// }

// export default async function NewsDetailPage({ params }: { params: Params }) {
//   const article = await getArticle(params.id);
//   if (!article) return notFound();

//   return (
//     <div className="bg-gray-50 min-h-screen py-10">
//       <div
//         className="mx-auto px-4 sm:px-6 lg:px-8"
//         style={{ maxWidth: '1400px' }}
//       >
//         <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
//           <div className="flex items-center text-sm text-gray-600 mb-4 gap-3 flex-wrap">
//             {article.category?.name && (
//               <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
//                 {article.category.name}
//               </span>
//             )}
//             {article.author?.name && <span>{article.author.name}</span>}
//             {article.createdAt && (
//               <>
//                 <span className="text-gray-400">•</span>
//                 <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
//               </>
//             )}
//           </div>

//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
//             {article.title}
//           </h1>

//           {article.image && (
//             <div className="relative w-full h-80 md:h-[28rem] mb-8 rounded-xl overflow-hidden bg-gray-100">
//               <Image
//                 src={article.image}
//                 alt={article.title}
//                 fill
//                 className="object-cover"
//                 sizes="(max-width:768px) 100vw, 1200px"
//                 priority
//               />
//             </div>
//           )}

//           {article.content && (
//             <div
//               className="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-7"
//               dangerouslySetInnerHTML={{ __html: article.content }}
//             />
//           )}
//         </article>
//       </div>
//     </div>
//   );
// }


// 2
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import News from '@/lib/models/News';
import Image from 'next/image';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { id: string };

/* =========================================
   Lean Types (IMPORTANT)
   Must NOT extend Document
========================================= */

type LeanAuthor = {
  _id: Types.ObjectId;
  name: string;
};

type LeanCategory = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
};

type LeanNews = {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  image?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  author?: LeanAuthor;
  category?: LeanCategory;
};

/* =========================================
   Serialized Type (for page usage)
========================================= */

type SerializedNews = {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
  };
  category?: {
    name: string;
    slug: string;
  };
};

/* =========================================
   Fetch Article
========================================= */

async function getArticle(id: string): Promise<SerializedNews | null> {
  await dbConnect();
  const decoded = decodeURIComponent(id);

  let article = await News.findOne({
    slug: decoded,
    published: true,
  })
    .populate('author', 'name')
    .populate('category', 'name slug')
    .lean<LeanNews>();

  if (!article && Types.ObjectId.isValid(decoded)) {
    article = await News.findOne({
      _id: decoded,
      published: true,
    })
      .populate('author', 'name')
      .populate('category', 'name slug')
      .lean<LeanNews>();
  }

  if (!article) return null;

  return {
    _id: article._id.toString(),
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt,
    image: article.image,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    author: article.author
      ? { name: article.author.name }
      : undefined,
    category: article.category
      ? { name: article.category.name, slug: article.category.slug }
      : undefined,
  };
}

/* =========================================
   Metadata
========================================= */

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const article = await getArticle(params.id);

  if (!article) return { title: 'News' };

  return {
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: article.image ? [article.image] : undefined,
    },
  };
}

/* =========================================
   Page Component
========================================= */

export default async function NewsDetailPage({
  params,
}: {
  params: Params;
}) {
  const article = await getArticle(params.id);
  if (!article) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: '1400px' }}
      >
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <div className="flex items-center text-sm text-gray-600 mb-4 gap-3 flex-wrap">
            {article.category?.name && (
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                {article.category.name}
              </span>
            )}

            {article.author?.name && <span>{article.author.name}</span>}

            {article.createdAt && (
              <>
                <span className="text-gray-400">•</span>
                <span>
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {article.image && (
            <div className="relative w-full h-80 md:h-[28rem] mb-8 rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width:768px) 100vw, 1200px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {article.content && (
            <div
              className="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-7"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )}
        </article>
      </div>
    </div>
  );
}