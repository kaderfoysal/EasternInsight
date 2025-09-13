'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

interface Article {
  _id: string;
  title: string;
  status: string;
  featured: boolean;
  latest: boolean;
  latestFeatured: boolean;
  category: { name: string };
  author: { name: string };
  createdAt: string;
}

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const getTokenFromCookie = () => {
    return document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
  };

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/articles?page=${currentPage}&limit=10&status=${statusFilter}`,
        {
          headers: {
            Authorization: `Bearer ${getTokenFromCookie()}`,
          },
        }
      );

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      setArticles(data.articles);
      setTotalPages(data.pagination.totalPages);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError('Error fetching articles');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, router]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getTokenFromCookie()}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete article');
      fetchArticles();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError('Error deleting article');
    }
  };

  const filteredArticles = searchTerm
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : articles;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Articles</h1>
          <Link
            href="/admin/articles/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Create New Article
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search articles..."
            className="flex-1 px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Latest</th>
                    <th>Latest Featured</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.length ? (
                    filteredArticles.map((a) => (
                      <tr key={a._id}>
                        <td>{a.title}</td>
                        <td>{a.author.name}</td>
                        <td>{a.category.name}</td>
                        <td>{a.status}</td>
                        <td>{a.featured ? 'Yes' : 'No'}</td>
                        <td>{a.latest ? 'Yes' : 'No'}</td>
                        <td>{a.latestFeatured ? 'Yes' : 'No'}</td>
                        <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                        <td className="space-x-2">
                          <Link href={`/article/${a._id}`} target="_blank">
                            View
                          </Link>
                          <Link href={`/admin/articles/edit/${a._id}`}>
                            Edit
                          </Link>
                          <button onClick={() => handleDelete(a._id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center">
                        No articles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={p === currentPage ? 'font-bold' : ''}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
