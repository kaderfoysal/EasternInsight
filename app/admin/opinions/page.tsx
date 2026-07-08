import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Opinion from '@/lib/models/Opinion';
import { BookOpen, Plus, Pencil, Eye } from 'lucide-react';
import DeleteOpinionButton from './DeleteOpinionButton';

async function getOpinions(userId: string, role: string) {
  await dbConnect();
  // Admins see all opinions; editors see only their own
  const query = role === 'admin' ? {} : { author: userId };
  const opinions = await Opinion.find(query)
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return opinions.map((opinion: any) => ({
    ...opinion,
    _id: opinion._id.toString(),
    author: opinion.author
      ? { _id: opinion.author._id?.toString(), name: opinion.author.name }
      : { name: 'অজানা' },
    createdAt: opinion.createdAt.toISOString(),
    updatedAt: opinion.updatedAt.toISOString(),
  }));
}

export default async function AdminOpinionsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !['admin', 'editor'].includes((session.user as any).role)) {
    redirect('/auth/signin');
  }

  const role = (session.user as any).role;
  const opinions = await getOpinions(session.user.id, role);
  const publishedCount = opinions.filter((o: any) => o.published).length;
  const draftCount = opinions.filter((o: any) => !o.published).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg border" style={{ background: 'rgba(124,58,237,0.15)', borderColor: 'rgba(124,58,237,0.3)' }}>
              <BookOpen size={20} className="text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-100">মতামত ব্যবস্থাপনা</h1>
          </div>
          <p className="text-gray-500 text-sm ml-12">
            {role === 'admin' ? 'সকল মতামত পরিচালনা করুন' : 'আপনার মতামত তৈরি ও পরিচালনা করুন'}
          </p>
        </div>
        <Link
          href="/admin/opinions/create"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', color: '#A78BFA' }}
        >
          <Plus size={16} />
          নতুন মতামত
        </Link>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            মোট {opinions.length}টি মতামত
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border"
            style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.25)', color: '#4ADE80' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5"></span>
            {publishedCount} প্রকাশিত
          </span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border"
            style={{ background: 'rgba(251,191,36,0.1)', borderColor: 'rgba(251,191,36,0.25)', color: '#FCD34D' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span>
            {draftCount} খসড়া
          </span>
        </div>
        <div className="flex-1 h-px bg-gray-800"></div>
      </div>

      {/* Table / Empty state */}
      {opinions.length === 0 ? (
        <div
          className="rounded-xl border flex flex-col items-center justify-center py-20 text-center"
          style={{ background: '#161B22', borderColor: '#21262D' }}
        >
          <div className="p-5 rounded-full mb-4" style={{ background: 'rgba(124,58,237,0.1)' }}>
            <BookOpen size={32} className="text-violet-500" />
          </div>
          <p className="text-gray-400 text-base font-medium mb-1">কোনো মতামত পাওয়া যায়নি</p>
          <p className="text-gray-600 text-sm mb-6">আপনার প্রথম মতামতটি লিখুন</p>
          <Link
            href="/admin/opinions/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all"
            style={{ background: '#7C3AED' }}
          >
            <Plus size={16} />
            প্রথম মতামত তৈরি করুন
          </Link>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden border"
          style={{ background: '#161B22', borderColor: '#21262D' }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-800">
              <thead style={{ background: '#0D1117' }}>
                <tr className="text-left text-gray-400">
                  <th className="px-5 py-3 font-medium uppercase tracking-wider text-xs">শিরোনাম</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider text-xs">লেখক</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider text-xs">অবস্থা</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider text-xs">তারিখ</th>
                  <th className="px-5 py-3 font-medium uppercase tracking-wider text-xs text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {opinions.map((opinion: any) => (
                  <tr key={opinion._id} className="hover:bg-[#1C2128] transition-colors group">
                    {/* Title */}
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 p-1.5 rounded flex-shrink-0"
                          style={{ background: 'rgba(124,58,237,0.12)' }}
                        >
                          <BookOpen size={12} className="text-violet-400" />
                        </div>
                        <div>
                          <div className="text-gray-200 font-medium line-clamp-2 max-w-sm text-sm leading-snug">
                            {opinion.title}
                          </div>
                          {opinion.slug && (
                            <div className="text-gray-600 text-xs mt-0.5">/{opinion.slug}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Writer name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                          style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA' }}
                        >
                          {(opinion.writerName || opinion.author?.name || 'অ').charAt(0)}
                        </div>
                        <span className="text-gray-400 text-sm">
                          {opinion.writerName || opinion.author?.name || 'অজানা'}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border`}
                        style={
                          opinion.published
                            ? { background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.25)', color: '#4ADE80' }
                            : { background: 'rgba(251,191,36,0.1)', borderColor: 'rgba(251,191,36,0.25)', color: '#FCD34D' }
                        }
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mr-1.5"
                          style={{ background: opinion.published ? '#4ADE80' : '#FCD34D' }}
                        />
                        {opinion.published ? 'প্রকাশিত' : 'খসড়া'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {new Date(opinion.createdAt).toLocaleDateString('bn-BD')}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/opinions/${opinion._id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                          style={{ background: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.2)' }}
                        >
                          <Pencil size={11} />
                          এডিট
                        </Link>
                        {opinion.slug && (
                          <Link
                            href={`/opinion/${opinion.slug}`}
                            target="_blank"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                            style={{ background: 'rgba(34,197,94,0.08)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.2)' }}
                          >
                            <Eye size={11} />
                            দেখুন
                          </Link>
                        )}
                        <DeleteOpinionButton id={opinion._id} />
                      </div>
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
