'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
      <main className="max-w-6xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}