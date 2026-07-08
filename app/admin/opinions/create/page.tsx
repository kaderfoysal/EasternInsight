import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import EditorOpinionForm from '@/components/EditorOpinionForm';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default async function CreateOpinionPage() {
  const session = await getServerSession(authOptions);

  if (!session || !['admin', 'editor'].includes((session.user as any).role)) {
    redirect('/auth/signin');
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/opinions"
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-all flex-shrink-0"
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#A78BFA' }}
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg border"
            style={{ background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)' }}
          >
            <BookOpen size={20} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">নতুন মতামত তৈরি করুন</h1>
            <p className="text-gray-500 text-xs mt-0.5">আপনার মতামত লিখুন এবং প্রকাশ করুন</p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div
        className="rounded-xl border p-6 md:p-8"
        style={{ background: '#161B22', borderColor: '#21262D' }}
      >
        <EditorOpinionForm />
      </div>
    </div>
  );
}
