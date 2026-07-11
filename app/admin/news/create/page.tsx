import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import AdminNewsCreateForm from '@/components/AdminNewsCreateForm';

async function getCategories() {
  await dbConnect();
  const cats = await Category.find({}).sort({ serial: 1, name: 1 }).lean();
  const all = JSON.parse(JSON.stringify(cats));
  // Separate parent and child categories
  const parents = all.filter((c: any) => !c.parentSlug);
  const withChildren = parents.map((p: any) => ({
    ...p,
    children: all.filter((c: any) => c.parentSlug === p.slug),
  }));
  return withChildren;
}

export default async function AdminNewsCreatePage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') redirect('/admin');

  const categories = await getCategories();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">নতুন খবর লিখুন</h1>
          <p className="text-gray-500 text-sm mt-0.5">নতুন একটি খবর তৈরি করুন এবং সরাসরি প্রকাশ করুন।</p>
        </div>
      </div>
      <div className="rounded-xl border p-6 md:p-8" style={{ background: '#161B22', borderColor: '#21262D' }}>
        <AdminNewsCreateForm categories={categories} />
      </div>
    </div>
  );
}
