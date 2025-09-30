// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import dbConnect from '@/lib/mongodb';
// import News from '@/lib/models/News';
// import Category from '@/lib/models/Category';
// import EditorNewsForm from '@/components/EditorNewsForm';
// import DeleteNewsButton from '@/components/DeleteNewsButton';
// import TogglePublishButton from '@/components/TogglePublishButton';

// async function getData(userId: string) {
//   await dbConnect();
//   const [myNews, categories] = await Promise.all([
//     News.find({ author: userId }).populate('category', 'name slug').sort({ createdAt: -1 }),
//     Category.find({}).sort({ name: 1 }),
//   ]);
//   return { myNews: JSON.parse(JSON.stringify(myNews)), categories: JSON.parse(JSON.stringify(categories)) };
// }

// export default async function EditorPage() {
//   const session = await getServerSession(authOptions);
//   if (!session) return null;

//   const { myNews, categories } = await getData(session.user.id);

//   return (
//     <div className="space-y-8">
//       <section className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">খবর যুক্ত করুন</h2>
//         <EditorNewsForm categories={categories} />
//       </section>

//       <section className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">আমার খবর</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="text-left text-gray-600">
//                 <th className="py-2 pr-4">শিরোনাম</th>
//                 <th className="py-2 pr-4">বিভাগ</th>
//                 <th className="py-2 pr-4">প্রকাশিত</th>
//                 <th className="py-2">অ্যাকশন</th>
//               </tr>
//             </thead>
//             <tbody>
//               {myNews.map((n: any) => (
//                 <tr key={n._id} className="border-t">
//                   <td className="py-2 pr-4">{n.title}</td>
//                   <td className="py-2 pr-4">{n.category?.name}</td>
//                   <td className="py-2 pr-4">
//                     <TogglePublishButton newsId={n._id} current={n.published} />
//                   </td>
//                   <td className="py-2 flex items-center gap-3">
//                     <a className="text-blue-600 hover:underline" href={`/editor/${n._id}`}>এডিট</a>
//                     <DeleteNewsButton newsId={n._id} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// }

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import News from '@/lib/models/News';
import Category from '@/lib/models/Category';
import DeleteNewsButton from '@/components/DeleteNewsButton';
import TogglePublishButton from '@/components/TogglePublishButton';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getData(userId: string) {
  await dbConnect();
  const [myNews, categories] = await Promise.all([
    News.find({ author: userId }).populate('category', 'name slug').sort({ createdAt: -1 }),
    Category.find({}).sort({ name: 1 }),
  ]);
  return { myNews: JSON.parse(JSON.stringify(myNews)), categories: JSON.parse(JSON.stringify(categories)) };
}

export default async function EditorPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const { myNews } = await getData(session.user.id);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Navigation Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          <Link
            href="/editor"
            className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
          >
            খবরসমূহ
          </Link>
          <Link
            href="/editor/opinions"
            className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            মতামত
          </Link>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">আমার খবরসমূহ</h1>
          <p className="text-gray-600 mt-1">আপনার তৈরি করা সকল খবরের তালিকা</p>
        </div>
        <Link 
          href="/editor/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          নতুন খবর যুক্ত করুন
        </Link>
      </div>

      {myNews.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center border border-gray-100">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">কোন খবর পাওয়া যায়নি</h3>
          <p className="mt-1 text-gray-500">আপনি এখনো কোন খবর তৈরি করেননি</p>
          <div className="mt-6">
            <Link 
              href="/editor/create" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              প্রথম খবর তৈরি করুন
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">শিরোনাম</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">বিভাগ</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অবস্থা</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myNews.map((n: any) => (
                  <tr key={n._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{n.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {n.category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TogglePublishButton newsId={n._id} current={n.published} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(n.createdAt).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/editor/${n._id}`} className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        এডিট
                      </Link>
                      <DeleteNewsButton newsId={n._id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}