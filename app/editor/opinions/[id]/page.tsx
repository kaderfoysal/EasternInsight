import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Opinion from '@/lib/models/Opinion';
import EditorOpinionForm from '@/components/EditorOpinionForm';
import { BookOpen, ArrowLeft } from 'lucide-react';

interface EditOpinionPageProps {
  params: { id: string };
}

interface OpinionData {
  _id: string;
  writerName: string;
  writerImage?: string;
  title: string;
  subtitle?: string;
  opinionImage?: string;
  description: string;
  published: boolean;
  featured?: boolean;
}

async function getOpinion(id: string, userId: string, role: string): Promise<OpinionData | null> {
  await dbConnect();
  const opinion = await Opinion.findById(id).lean();
  if (!opinion) return null;

  // Admins can edit any opinion; editors can only edit their own
  if (role !== 'admin' && (opinion as any).author.toString() !== userId) return null;

  return {
    _id: (opinion as any)._id.toString(),
    writerName: (opinion as any).writerName,
    writerImage: (opinion as any).writerImage,
    title: (opinion as any).title,
    subtitle: (opinion as any).subtitle,
    opinionImage: (opinion as any).opinionImage,
    description: (opinion as any).description,
    published: (opinion as any).published,
    featured: (opinion as any).featured,
  };
}

export default async function EditOpinionPage({ params }: EditOpinionPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !['admin', 'editor'].includes((session.user as any).role)) {
    redirect('/auth/signin');
  }

  const opinion = await getOpinion(params.id, session.user.id, (session.user as any).role);
  if (!opinion) {
    notFound();
    return null;
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
            <h1 className="text-xl font-bold text-gray-100">মতামত সম্পাদনা করুন</h1>
            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1 max-w-xs">{opinion.title}</p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div
        className="rounded-xl border p-6 md:p-8"
        style={{ background: '#161B22', borderColor: '#21262D' }}
      >
        <EditorOpinionForm opinion={opinion} />
      </div>
    </div>
  );
}
