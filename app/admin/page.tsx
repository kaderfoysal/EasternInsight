// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import dbConnect from '@/lib/mongodb';
// import User from '@/lib/models/User';
// import Category from '@/lib/models/Category';
// import AdminEditorForm from '@/components/AdminEditorForm';
// import AdminCategoryForm from '@/components/AdminCategoryForm';
// import DeleteEditorButton from '@/components/DeleteEditorButton';
// import DeleteCategoryButton from '@/components/DeleteCategoryButton';
// import InlineCategoryEdit from '@/components/InlineCategoryEdit';

// async function getData() {
//   await dbConnect();
//   const [editors, categories] = await Promise.all([
//     User.find({ role: 'editor' }).select('-password').sort({ createdAt: -1 }),
//     Category.find({}).sort({ name: 1 }),
//   ]);
//   return { editors: JSON.parse(JSON.stringify(editors)), categories: JSON.parse(JSON.stringify(categories)) };
// }

// export default async function AdminDashboardPage() {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== 'admin') {
//     return null;
//   }

//   const { editors, categories } = await getData();

//   return (
//     <div className="p-6 space-y-8">
//       <section id="overview" className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="text-sm text-gray-500">মোট সম্পাদক</div>
//           <div className="text-2xl font-semibold">{editors.length}</div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="text-sm text-gray-500">মোট বিভাগ</div>
//           <div className="text-2xl font-semibold">{categories.length}</div>
//         </div>
//       </section>

//       <section id="editors" className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">সম্পাদক ব্যবস্থাপনা</h2>
//         <AdminEditorForm onCreated={undefined} />
//         <div className="mt-6 overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="text-left text-gray-600">
//                 <th className="py-2 pr-4">নাম</th>
//                 <th className="py-2 pr-4">ইমেইল</th>
//                 <th className="py-2">অ্যাকশন</th>
//               </tr>
//             </thead>
//             <tbody>
//               {editors.map((u: any) => (
//                 <tr key={u._id} className="border-t">
//                   <td className="py-2 pr-4">{u.name}</td>
//                   <td className="py-2 pr-4">{u.email}</td>
//                   <td className="py-2">
//                     <DeleteEditorButton userId={u._id} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       <section id="categories" className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">বিভাগ ব্যবস্থাপনা</h2>
//         <AdminCategoryForm onCreated={undefined} />
//         <div className="mt-6 flex flex-col gap-2">
//           {categories.map((c: any) => (
//             <div key={c._id} className="flex items-center gap-3">
//               <InlineCategoryEdit category={c} />
//               <DeleteCategoryButton categoryId={c._id} />
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }



// 2

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Category from '@/lib/models/Category';
import Link from 'next/link';
import { Users, FolderOpen, ArrowRight } from 'lucide-react';

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
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">অ্যাডমিন ড্যাশবোর্ড</h1>
        <p className="text-gray-600 mt-1">সংবাদ পোর্টাল ব্যবস্থাপনা কেন্দ্র</p>
      </div>

      {/* Overview Section */}
      <section id="overview" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">মোট সম্পাদক</h2>
              <p className="text-2xl font-bold text-gray-900">{editors.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <FolderOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">মোট বিভাগ</h2>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">সম্পাদক ব্যবস্থাপনা</h2>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 mb-4">সম্পাদকদের তৈরি, সম্পাদনা এবং মুছে ফেলুন</p>
          <Link href="/admin/editors" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            সম্পাদক ব্যবস্থাপনায় যান <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">বিভাগ ব্যবস্থাপনা</h2>
            <div className="bg-green-100 p-2 rounded-lg">
              <FolderOpen className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 mb-4">বিভাগ তৈরি, সম্পাদনা এবং মুছে ফেলুন</p>
          <Link href="/admin/categories" className="inline-flex items-center text-green-600 hover:text-green-800 font-medium">
            বিভাগ ব্যবস্থাপনায় যান <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}