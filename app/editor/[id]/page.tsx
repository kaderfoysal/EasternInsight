import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import News from '@/lib/models/News';
import Category from '@/lib/models/Category';
import EditorNewsForm from '@/components/EditorNewsForm';
import { redirect } from 'next/navigation';

async function getNews(id: string) {
  await dbConnect();
  const news = await News.findById(id).lean();
  return news ? JSON.parse(JSON.stringify(news)) : null;
}

async function getCategories() {
  await dbConnect();
  const categories = await Category.find({}).sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(categories));
}

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const [news, categories] = await Promise.all([getNews(params.id), getCategories()]);

  if (!news) redirect('/editor');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">খবর সম্পাদনা করুন</h1>
        <p className="text-gray-600 mt-2">প্রয়োজনে শিরোনাম, বিষয়বস্তু বা প্রকাশনা পরিবর্তন করুন।</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <EditorNewsForm categories={categories} news={news} />
      </div>
    </div>
  );
}
