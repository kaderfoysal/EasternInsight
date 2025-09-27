import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import News from '@/lib/models/News';
import Link from 'next/link';
import DeleteNewsButton from '@/components/DeleteNewsButton';

async function getData() {
  await dbConnect();
  const items = await News.find({}).populate('category', 'name slug').populate('author', 'name').sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(items));
}

export default async function AdminNewsListPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return null;
  const items = await getData();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">সব খবর</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2 px-4">শিরোনাম</th>
              <th className="py-2 px-4">বিভাগ</th>
              <th className="py-2 px-4">লেখক</th>
              <th className="py-2 px-4">প্রকাশিত</th>
              <th className="py-2 px-4">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n: any) => (
              <tr key={n._id} className="border-t">
                <td className="py-2 px-4">{n.title}</td>
                <td className="py-2 px-4">{n.category?.name}</td>
                <td className="py-2 px-4">{n.author?.name}</td>
                <td className="py-2 px-4">{n.published ? 'হ্যাঁ' : 'না'}</td>
                <td className="py-2 px-4 flex items-center gap-3">
                  <Link className="text-blue-600 hover:underline" href={`/admin/news/${n._id}`}>এডিট</Link>
                  <DeleteNewsButton newsId={n._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


