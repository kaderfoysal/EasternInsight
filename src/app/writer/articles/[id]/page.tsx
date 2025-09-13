'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  name: string;
  image?: string;
}

interface EditArticlePageProps {
  authToken: string;
}

export default function EditArticlePage({ authToken }: EditArticlePageProps) {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Article | null>(null);

  useEffect(() => {
    if (!authToken) {
      router.push('/login');
      return;
    }

    fetchArticle(authToken);
    fetchCategories(authToken);
  }, [articleId, authToken, router]);

  const fetchArticle = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch article');

      const data = await response.json();
      setFormData(data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching article');
      setLoading(false);
    }
  };

  const fetchCategories = async (token: string) => {
    try {
      const response = await fetch('/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Error fetching categories');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !authToken) return router.push('/login');

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update article');
      }

      alert('Article updated successfully!');
      if (formData.status === 'PUBLISHED' && confirm('Article published! View it?')) {
        router.push(`/article/${articleId}`);
        return;
      }

      setSaving(false);
    } catch (err: any) {
      setError(err.message || 'Error updating article');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?') || !authToken) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete article');
      }

      alert('Article deleted successfully!');
      router.push('/writer');
    } catch (err: any) {
      setError(err.message || 'Error deleting article');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-red-600">Article not found or you don't have permission to edit it.</p>
          <Link href="/writer" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
          <div className="flex space-x-4">
            <Link href="/writer" className="text-blue-600 hover:text-blue-800">Back to Dashboard</Link>
            {formData.status === 'PUBLISHED' && (
              <Link href={`/article/${articleId}`} className="text-green-600 hover:text-green-800" target="_blank">View Published</Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button className="float-right" onClick={() => setError(null)}>&times;</button>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="mb-4 text-sm text-gray-500">
              <p>Created: {new Date(formData.createdAt).toLocaleString()}</p>
              <p>Last updated: {new Date(formData.updatedAt).toLocaleString()}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title *</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>

              <div className="mb-4">
                <label htmlFor="excerpt" className="block text-gray-700 text-sm font-bold mb-2">Excerpt/Summary *</label>
                <textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3} required />
              </div>

              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Featured Image URL *</label>
                <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img src={formData.imageUrl} alt="Preview" className="h-40 object-cover rounded" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Invalid+Image+URL'; }} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="categoryId" className="block text-gray-700 text-sm font-bold mb-2">Category *</label>
                  <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    <option value="">Select a category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status *</label>
                  <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Content *</label>
                <textarea id="content" name="content" value={formData.content} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={15} required />
                <p className="text-xs text-gray-500 mt-1">You can use HTML tags for formatting.</p>
              </div>

              <div className="flex items-center justify-between">
                <button type="button" onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                <div className="flex space-x-4">
                  <Link href="/writer" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</Link>
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
