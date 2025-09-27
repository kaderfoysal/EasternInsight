// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import dbConnect from '@/lib/mongodb';
// import News from '@/lib/models/News';
// import Category from '@/lib/models/Category';
// import Link from 'next/link';
// import NewsEditForm from '@/components/NewsEditForm';

// async function getData(id: string) {
//   await dbConnect();
//   const [news, categories] = await Promise.all([
//     News.findById(id).populate('author', 'name').populate('category', 'name'),
//     Category.find({}).sort({ name: 1 }),
//   ]);
//   return { news: JSON.parse(JSON.stringify(news)), categories: JSON.parse(JSON.stringify(categories)) };
// }

// export default async function EditorNewsEditPage({ params }: { params: { id: string } }) {
//   const session = await getServerSession(authOptions);
//   if (!session) return null;
//   const { news, categories } = await getData(params.id);
//   if (!news) return <div className="p-6">খবর পাওয়া যায়নি</div>;
//   if (session.user.role !== 'admin' && news.author?._id !== session.user.id) {
//     return <div className="p-6">অনুমতি নেই</div>;
//   }
//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold">খবর এডিট</h1>
//         <Link className="text-sm text-blue-600 hover:underline" href="/editor">আমার খবরে ফিরে যান</Link>
//       </div>
//       <NewsEditForm news={news} categories={categories} />
//     </div>
//   );
// }


import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import News from '@/lib/models/News';
import Category from '@/lib/models/Category';
import EditorNewsForm from '@/components/EditorNewsForm';
import { notFound } from 'next/navigation';

async function getNews(id: string, userId: string) {
  await dbConnect();
  const news = await News.findOne({ _id: id, author: userId }).populate('category', 'name slug');
  if (!news) {
    return null;
  }
  return JSON.parse(JSON.stringify(news));
}

async function getCategories() {
  await dbConnect();
  const categories = await Category.find({}).sort({ name: 1 });
  return JSON.parse(JSON.stringify(categories));
}

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Unauthorized</div>;

  const news = await getNews(params.id, session.user.id);
  if (!news) {
    notFound();
  }

  const categories = await getCategories();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">খবর এডিট করুন</h1>
        <p className="text-gray-600 mt-2">আপনার খবরটি আপডেট করুন</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <EditorNewsForm categories={categories} news={news} />
      </div>
    </div>
  );
}