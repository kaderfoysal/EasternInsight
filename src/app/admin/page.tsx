'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

interface DashboardStats {
  totalArticles: number;
  totalCategories: number;
  totalUsers: number;
  activeBanners: number;
}

interface Article {
  _id: string;
  title: string;
  author: {
    name: string;
  };
  createdAt: string;
  status: 'PUBLISHED' | 'DRAFT' | 'REVIEW';
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    totalCategories: 0,
    totalUsers: 0,
    activeBanners: 0
  });
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch user and dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch authenticated user
        const userRes = await fetch('/api/auth/me', {
          credentials: 'include', // 👈 send cookie
        });

        if (!userRes.ok) {
          router.replace('/login');
          return;
        }

        const userData = await userRes.json();

        if (userData.role !== 'ADMIN') {
          router.replace('/unauthorized');
          return;
        }

        setUser(userData);
        setLoading(false);

        // Fetch dashboard stats
        const statsRes = await fetch('/api/dashboard/stats', {
          credentials: 'include',
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch recent articles
        const articlesRes = await fetch('/api/articles?limit=5', {
          credentials: 'include',
        });
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          setRecentArticles(articlesData.articles || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        router.replace('/login');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        <div className="mt-4 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Welcome back, {user?.name || 'Admin'}!</h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your news portal today.
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Overview</h3>
          <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/articles" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Articles</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalArticles}</dd>
              </div>
            </Link>
            <Link href="/admin/categories" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Categories</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalCategories}</dd>
              </div>
            </Link>
            <Link href="/admin/users" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalUsers}</dd>
              </div>
            </Link>
            <Link href="/admin/banners" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Active Banners</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.activeBanners}</dd>
              </div>
            </Link>
          </dl>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Articles</h3>
            <Link href="/admin/articles" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>
          <div className="mt-2 flex flex-col">
            {dataLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentArticles.length > 0 ? (
                          recentArticles.map((article) => (
                            <tr key={article._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.title}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.author.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(article.status)}`}>
                                  {article.status.charAt(0) + article.status.slice(1).toLowerCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={`/admin/articles/edit/${article._id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No articles found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
