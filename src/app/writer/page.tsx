'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
}

interface User {
  name: string;
  image?: string;
}

interface WriterDashboardProps {
  authToken: string;
  user?: User;
}

export default function WriterDashboard({ authToken, user: initialUser }: WriterDashboardProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0
  });
  const [user, setUser] = useState<User | null>(initialUser || null);

  useEffect(() => {
    if (!authToken) {
      window.location.href = '/login';
      return;
    }
    fetchArticles(authToken);
  }, [authToken]);

  const fetchArticles = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles?authorOnly=true', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch articles');

      const data = await response.json();
      setArticles(data);

      const stats = {
        total: data.length,
        published: data.filter((a: Article) => a.status === 'PUBLISHED').length,
        draft: data.filter((a: Article) => a.status === 'DRAFT').length,
        archived: data.filter((a: Article) => a.status === 'ARCHIVED').length
      };
      setStats(stats);
      setLoading(false);
    } catch (err) {
      setError('Error fetching articles');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Writer Dashboard</h1>
          {user && (
            <div className="flex items-center">
              {user.image ? (
                <div className="h-10 w-10 relative mr-2">
                  <Image src={user.image} alt={user.name} fill className="rounded-full object-cover" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-2">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-gray-700">{user.name}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {['total', 'published', 'draft', 'archived'].map((key) => (
              <div key={key} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {key === 'total'
                        ? 'Total Articles'
                        : key.charAt(0).toUpperCase() + key.slice(1)}
                    </dt>
                    <dd className={`mt-1 text-3xl font-semibold ${key === 'published' ? 'text-green-600' : key === 'draft' ? 'text-yellow-600' : key === 'archived' ? 'text-gray-600' : 'text-gray-900'}`}>
                      {stats[key as keyof typeof stats]}
                    </dd>
                  </dl>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Articles</h2>
            <Link href="/writer/articles/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Create New Article
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button className="float-right" onClick={() => setError(null)}>
                &times;
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <li key={article.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-indigo-600 truncate">{article.title}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : ''}
                                ${article.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${article.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-800' : ''}`}>
                                {article.status}
                              </span>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <Link href={`/writer/articles/${article.id}`} className="font-medium text-blue-600 hover:text-blue-500 mr-3">
                              Edit
                            </Link>
                            {article.status === 'PUBLISHED' && (
                              <Link href={`/article/${article.id}`} className="font-medium text-gray-600 hover:text-gray-500" target="_blank">
                                View
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <p className="flex items-center text-sm text-gray-500">{article.excerpt.substring(0, 100)}...</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <span className="font-medium text-gray-600">{article.category.name}</span>
                            <span className="mx-2">•</span>
                            Updated {new Date(article.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                    No articles found. Create your first article!
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
