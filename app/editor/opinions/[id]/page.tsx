import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Opinion from '@/lib/models/Opinion';
import EditorOpinionForm from '@/components/EditorOpinionForm';

interface EditOpinionPageProps {
  params: {
    id: string;
  };
}

async function getOpinion(id: string, userId: string) {
  await dbConnect();
  
  const opinion = await Opinion.findById(id).lean();
  
  if (!opinion) {
    return null;
  }

  // Check if user is the author or an admin
  if ((opinion as any).author.toString() !== userId) {
    return null;
  }

  return {
    ...(opinion as any),
    _id: (opinion as any)._id.toString(),
    author: (opinion as any).author.toString(),
    createdAt: (opinion as any).createdAt.toISOString(),
    updatedAt: (opinion as any).updatedAt.toISOString(),
  };
}

export default async function EditOpinionPage({ params }: EditOpinionPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !['admin', 'editor'].includes(session.user.role)) {
    redirect('/auth/signin');
  }

  const opinion = await getOpinion(params.id, session.user.id);

  if (!opinion) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">মতামত সম্পাদনা করুন</h1>
        <p className="text-gray-600 mt-2">আপনার মতামত আপডেট করুন</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <EditorOpinionForm opinion={opinion} />
      </div>
    </div>
  );
}
