'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/login' || pathname === '/register') {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // 👈 send cookie
        });

        if (!res.ok) {
          // Not authenticated → redirect to login
          setUser(null);
          setLoading(false);
          router.replace('/login');
          return;
        }

        const userData = await res.json();
        setUser(userData);
        setLoading(false);
      } catch (err) {
        console.error('❌ [DEBUG] Fetch user error:', err);
        setUser(null);
        setLoading(false);
        router.replace('/login');
      }
    };

    fetchUserData();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // clear cookie
      });

      setUser(null);
      window.location.href = '/login'; // full page reload
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
          <p className="mt-2 text-gray-600">Please log in to access this page.</p>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Go to Login Page
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a
                  href="/admin"
                  className={`block px-4 py-2 rounded hover:bg-gray-100 ${pathname === '/admin' ? 'bg-gray-100' : ''}`}
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/admin/articles"
                  className={`block px-4 py-2 rounded hover:bg-gray-100 ${pathname === '/admin/articles' ? 'bg-gray-100' : ''}`}
                >
                  Articles
                </a>
              </li>
              <li>
                <a
                  href="/admin/categories"
                  className={`block px-4 py-2 rounded hover:bg-gray-100 ${pathname === '/admin/categories' ? 'bg-gray-100' : ''}`}
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="/admin/users"
                  className={`block px-4 py-2 rounded hover:bg-gray-100 ${pathname === '/admin/users' ? 'bg-gray-100' : ''}`}
                >
                  Users
                </a>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-300"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
