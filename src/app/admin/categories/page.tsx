'use client';

import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  featured: boolean;
  _count: {
    articles: number;
  };
  createdAt: string;
}

interface CategoriesPageProps {
  authToken: string;
}

export default function CategoriesPage({ authToken }: CategoriesPageProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    featured: false
  });

  // Wrap fetchCategories in useCallback
  const fetchCategories = useCallback(async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (err: unknown) { // Use unknown here
      if (err instanceof Error) {
        setError(`Error fetching categories: ${err.message}`);
      } else {
        setError('Error fetching categories');
      }
      setLoading(false);
    }
  }, [router]); // router is a dependency for fetchCategories

  useEffect(() => {
    if (!authToken) {
      router.push('/login');
      return;
    }
    fetchCategories(authToken);
  }, [authToken, router, fetchCategories]); // fetchCategories is now a stable dependency

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save category');
      }

      setFormData({ name: '', description: '', image: '', featured: false });
      setIsFormOpen(false);
      setEditingCategory(null);
      fetchCategories(authToken);
    } catch (err: unknown) { // Use unknown here
      if (err instanceof Error) {
        setError(err.message || 'Error saving category');
      } else {
        setError('Error saving category');
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      featured: category.featured
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category && category._count.articles > 0) {
      setError(`Cannot delete category "${category.name}" because it has ${category._count.articles} articles.`);
      return;
    }

    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      fetchCategories(authToken);
    } catch (err: unknown) { // Use unknown here
      if (err instanceof Error) {
        setError(err.message || 'Error deleting category');
      } else {
        setError('Error deleting category');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Categories</h1>
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', description: '', image: '', featured: false });
              setIsFormOpen(!isFormOpen);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {isFormOpen ? 'Cancel' : 'Add New Category'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button className="float-right" onClick={() => setError(null)}>&times;</button>
          </div>
        )}

        {isFormOpen && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Image URL</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm font-bold">Featured Category</span>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setIsFormOpen(false); setEditingCategory(null); }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-gray-200 relative">
                  {category.image ? (
                    <Image src={category.image} alt={category.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                  )}
                  {category.featured && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded">Featured</span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {category._count.articles} {category._count.articles === 1 ? 'article' : 'articles'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={category._count.articles > 0}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {category.description && <p className="text-sm text-gray-500 mt-2">{category.description}</p>}
                  <p className="text-xs text-gray-400 mt-4">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No categories found. Create your first category to get started.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}