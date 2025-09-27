import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import EditorNewsForm from '@/components/EditorNewsForm';
import { redirect } from 'next/navigation';

async function getCategories() {
  await dbConnect();
  const categories = await Category.find({}).sort({ name: 1 });
  return JSON.parse(JSON.stringify(categories));
}

export default async function CreateNewsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const categories = await getCategories();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">নতুন খবর তৈরি করুন</h1>
        <p className="text-gray-600 mt-2">আপনার খবরটি সুন্দরভাবে লিখুন এবং প্রকাশ করুন</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <EditorNewsForm categories={categories} />
      </div>
    </div>
  );
}