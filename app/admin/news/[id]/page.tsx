import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import News from '@/lib/models/News';
import Category from '@/lib/models/Category';
import Link from 'next/link';
import NewsEditForm from '@/components/NewsEditForm';

async function getData(id: string) {
  await dbConnect();
  const [news, cats] = await Promise.all([
    News.findById(id).populate('category', 'name slug _id parentSlug').populate('author', 'name'),
    Category.find({}).sort({ serial: 1, name: 1 }),
  ]);
  const all = JSON.parse(JSON.stringify(cats));
  const parents = all.filter((c: any) => !c.parentSlug);
  const categories = parents.map((p: any) => ({
    ...p,
    children: all.filter((c: any) => c.parentSlug === p.slug),
  }));
  return { news: JSON.parse(JSON.stringify(news)), categories };
}

export default async function AdminNewsEditPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return null;
  const { news, categories } = await getData(params.id);
  if (!news) return <div className="p-6">খবর পাওয়া যায়নি</div>;
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-100">খবর এডিট</h1>
        <Link className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors" href="/admin/news">সব খবরে ফিরে যান</Link>
      </div>
      <NewsEditForm news={news} categories={categories} />
    </div>
  );
}


