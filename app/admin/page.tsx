import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Category from '@/lib/models/Category';
import AdminEditorForm from '@/components/AdminEditorForm';
import AdminCategoryForm from '@/components/AdminCategoryForm';
import DeleteEditorButton from '@/components/DeleteEditorButton';
import DeleteCategoryButton from '@/components/DeleteCategoryButton';
import InlineCategoryEdit from '@/components/InlineCategoryEdit';

async function getData() {
  await dbConnect();
  const [editors, categories] = await Promise.all([
    User.find({ role: 'editor' }).select('-password').sort({ createdAt: -1 }),
    Category.find({}).sort({ name: 1 }),
  ]);
  return { editors: JSON.parse(JSON.stringify(editors)), categories: JSON.parse(JSON.stringify(categories)) };
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return null;
  }

  const { editors, categories } = await getData();

  return (
    <div className="p-6 space-y-8">
      <section id="overview" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">মোট সম্পাদক</div>
          <div className="text-2xl font-semibold">{editors.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">মোট বিভাগ</div>
          <div className="text-2xl font-semibold">{categories.length}</div>
        </div>
      </section>

      <section id="editors" className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">সম্পাদক ব্যবস্থাপনা</h2>
        <AdminEditorForm onCreated={undefined} />
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">নাম</th>
                <th className="py-2 pr-4">ইমেইল</th>
                <th className="py-2">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {editors.map((u: any) => (
                <tr key={u._id} className="border-t">
                  <td className="py-2 pr-4">{u.name}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2">
                    <DeleteEditorButton userId={u._id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="categories" className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">বিভাগ ব্যবস্থাপনা</h2>
        <AdminCategoryForm onCreated={undefined} />
        <div className="mt-6 flex flex-col gap-2">
          {categories.map((c: any) => (
            <div key={c._id} className="flex items-center gap-3">
              <InlineCategoryEdit category={c} />
              <DeleteCategoryButton categoryId={c._id} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

