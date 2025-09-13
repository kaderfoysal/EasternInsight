'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  linkText: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    linkText: '',
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/banners'); // Open GET API
      if (!response.ok) throw new Error('Failed to fetch banners');
      const data = await response.json();
      setBanners(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching banners');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBanner ? `/api/banners/${editingBanner.id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save banner');
      }

      setFormData({
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        linkText: '',
        isActive: true,
        order: 0
      });
      setIsFormOpen(false);
      setEditingBanner(null);
      fetchBanners();
    } catch (err: any) {
      setError(err.message || 'Error saving banner');
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      linkText: banner.linkText || '',
      isActive: banner.isActive,
      order: banner.order
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const response = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete banner');
      }
      fetchBanners();
    } catch (err: any) {
      setError(err.message || 'Error deleting banner');
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive })
      });
      fetchBanners();
    } catch {
      setError('Error updating banner status');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = banners.findIndex(b => b.id === id);
    if (index === -1) return;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= banners.length) return;

    const currentBanner = banners[index];
    const swapBanner = banners[swapIndex];

    try {
      await fetch(`/api/banners/${currentBanner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: swapBanner.order })
      });
      await fetch(`/api/banners/${swapBanner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: currentBanner.order })
      });
      fetchBanners();
    } catch {
      setError('Error reordering banners');
    }
  };

  if (loading) return <AdminLayout><div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Banners</h1>
          <button 
            onClick={() => {
              setEditingBanner(null);
              setFormData({ 
                title: '',
                subtitle: '',
                description: '',
                imageUrl: '',
                linkUrl: '',
                linkText: '',
                isActive: true,
                order: banners.length > 0 ? Math.max(...banners.map(b => b.order)) + 1 : 1
              });
              setIsFormOpen(!isFormOpen);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {isFormOpen ? 'Cancel' : 'Add New Banner'}
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
            <h2 className="text-xl font-semibold mb-4">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title *</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
              </div>

              {/* Subtitle */}
              <div className="mb-4">
                <label htmlFor="subtitle" className="block text-gray-700 text-sm font-bold mb-2">Subtitle</label>
                <input type="text" id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
              </div>

              {/* Image URL */}
              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Image URL *</label>
                <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
              </div>

              {/* Link URL & Link Text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="linkUrl" className="block text-gray-700 text-sm font-bold mb-2">Link URL</label>
                  <input type="text" id="linkUrl" name="linkUrl" value={formData.linkUrl} onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
                </div>
                <div>
                  <label htmlFor="linkText" className="block text-gray-700 text-sm font-bold mb-2">Link Text</label>
                  <input type="text" id="linkText" name="linkText" value={formData.linkText} onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
                </div>
              </div>

              {/* Active & Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="mr-2" />
                    <span className="text-gray-700 text-sm font-bold">Active</span>
                  </label>
                </div>
                <div>
                  <label htmlFor="order" className="block text-gray-700 text-sm font-bold mb-2">Display Order</label>
                  <input type="number" id="order" name="order" value={formData.order} onChange={handleInputChange} min={0}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button type="button" onClick={() => { setIsFormOpen(false); setEditingBanner(null); }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md mr-2">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  {editingBanner ? 'Update' : 'Create'} Banner
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Banner List */}
        {banners.length > 0 ? (
          <div className="space-y-6">
            {banners.map((banner, index) => (
              <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
                  </div>
                  <div className="p-4 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{banner.title}</h3>
                          {banner.subtitle && <p className="text-sm text-gray-600 mt-1">{banner.subtitle}</p>}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">Order: {banner.order}</span>
                        </div>
                      </div>
                      {banner.description && <p className="text-sm text-gray-500 mt-2">{banner.description}</p>}
                      {banner.linkUrl && <p className="text-sm text-blue-600 mt-2">Link: {banner.linkText || banner.linkUrl}</p>}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-xs text-gray-400">Created: {new Date(banner.createdAt).toLocaleDateString()}</p>
                      <div className="flex space-x-2">
                        <button onClick={() => handleReorder(banner.id, 'up')} disabled={index === 0} className={`text-gray-600 hover:text-gray-800 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>↑</button>
                        <button onClick={() => handleReorder(banner.id, 'down')} disabled={index === banners.length - 1} className={`text-gray-600 hover:text-gray-800 ${index === banners.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>↓</button>
                        <button onClick={() => handleToggleActive(banner)} className={banner.isActive ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'}>
                          {banner.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => handleEdit(banner)} className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button onClick={() => handleDelete(banner.id)} className="text-red-600 hover:text-red-800">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md">
            No banners found. Create your first banner to get started.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
