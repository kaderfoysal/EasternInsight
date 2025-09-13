'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  createdAt: string;
  author: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.name as string;
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCategoryArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/articles?category=${categoryName}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        setArticles(data.articles || []);
        
        // Also fetch category details if available
        try {
          const categoryResponse = await fetch(`/api/categories/by-name/${categoryName}`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            setCategory(categoryData);
          }
        } catch {
          // If category details fetch fails, we can still show articles
          console.error('Error fetching category details');
        }
        
        setLoading(false);
      } catch {
        setError('Error fetching articles');
        setLoading(false);
      }
    };
    
    fetchCategoryArticles();
  }, [categoryName]);
  
  const categoryTitle = category ? category.name : categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }
  
  if (articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="mb-6">The category you are looking for does not exist or has no articles.</p>
          <Link 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{categoryTitle}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={article.imageUrl || '/placeholder-image.jpg'}
                alt={article.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-600">{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</span>
                <span className="text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <Link href={`/article/${article.id}`} className="block">
                <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
              </Link>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">By {article.author.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}