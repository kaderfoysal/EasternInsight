'use client';

import { useState, useEffect } from 'react';
import { Mail, Calendar, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NewsletterAdminPage() {
  const { data: session, status } = useSession() as any;
  const router = useRouter();
  
  const [subscribers, setSubscribers] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/admin');
        return;
      }
      fetchSubscribers();
    }
  }, [status, session, router]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/newsletter');
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter((s: any) => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('bn-BD', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-[#8B949E]">
        <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="4" strokeDasharray="32" strokeLinecap="round" className="opacity-25" />
          <path d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" fill="currentColor" />
        </svg>
        <span>লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E6EDF3] tracking-tight">নিউজলেটার সাবস্ক্রাইবার</h1>
          <p className="text-[#8B949E] text-sm mt-1">
            মোট সাবস্ক্রাইবার: <strong className="text-white bg-[#30363D] px-2 py-0.5 rounded-md ml-1">{subscribers.length}</strong> জন
          </p>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="ইমেইল খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-sm text-[#E6EDF3] placeholder-[#484F58] focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" size={16} />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Table section */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#21262D] text-[#8B949E] font-medium uppercase tracking-wider text-xs border-b border-[#30363D]">
              <tr>
                <th className="px-6 py-4">ইমেইল ঠিকানা</th>
                <th className="px-6 py-4">যোগদানের তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((subscriber: any, idx: number) => (
                  <tr key={subscriber._id || idx} className="hover:bg-[#1C2128] transition-colors group">
                    <td className="px-6 py-4 font-mono text-[#58A6FF] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0D1117] border border-[#30363D] flex items-center justify-center text-[#8B949E] group-hover:border-[#58A6FF]/30 group-hover:text-[#58A6FF] transition-colors">
                        <Mail size={14} />
                      </div>
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 text-[#8B949E] flex items-center gap-2">
                      <Calendar size={14} className="opacity-50" />
                      {formatDate(subscriber.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-[#8B949E]">
                    <Mail className="mx-auto h-8 w-8 mb-3 opacity-20" />
                    কোন সাবস্ক্রাইবার পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
