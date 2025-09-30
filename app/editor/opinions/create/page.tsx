import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import EditorOpinionForm from '@/components/EditorOpinionForm';

export default async function CreateOpinionPage() {
  const session = await getServerSession(authOptions);

  if (!session || !['admin', 'editor'].includes(session.user.role)) {
    redirect('/auth/signin');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">নতুন মতামত তৈরি করুন</h1>
        <p className="text-gray-600 mt-2">আপনার মতামত লিখুন এবং প্রকাশ করুন</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <EditorOpinionForm />
      </div>
    </div>
  );
}
