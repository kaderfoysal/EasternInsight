'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SessionUserWithRole = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type SessionWithRole = {
  user?: SessionUserWithRole;
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession() as { data: SessionWithRole | null, status: string };
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    // Cast the user to your custom type to access the role property
    const userRole = (session.user as SessionUserWithRole)?.role;
    if (!['admin', 'editor'].includes(userRole || '')) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 pt-4"
        style={{ maxWidth: '1400px' }}
      >
        <nav className="flex space-x-8 border-b border-gray-200 mb-6">
          {[
            { href: '/editor', label: 'খবরসমূহ' },
            { href: '/editor/videos', label: 'ভিডিও' },
            { href: '/editor/book-reviews', label: 'বই পর্যালোচনা' },
          ].map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`py-4 px-1 text-sm font-medium ${
                  active
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <main
        className="mx-auto p-6"
        style={{ maxWidth: '1400px' }}
      >
        {children}
      </main>
    </div>
  );
}
