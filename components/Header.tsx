'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Search, User, LogOut } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type SessionType = {
  user?: SessionUser;
};

export default function Header() {
  const { data: session, status } = useSession() as { data: SessionType | null, status: string };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Fix: Use type assertion instead of generic type parameter
  const [categories, setCategories] = useState([] as Category[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const categoryData: Category[] = await response.json();
          setCategories(categoryData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="bg-[#00141a] shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">
              Eastern Insight 
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
            >
              হোম
            </Link>
            <Link
              href="/categories"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
            >
              বিভাগসমূহ
            </Link>
            {loading ? (
              <div className="flex space-x-8">
                {Array.from({ length: 5 }).map((_, i: number) => (
                  <div key={i} className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              categories.map((category: Category) => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug}`}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  {category.name}
                </Link>
              ))
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="খবর খুঁজুন..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-700 h-8 w-8 rounded-full"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-300" />
                  <span className="text-sm font-medium text-gray-300">
                    {session.user?.name}
                  </span>
                </div>
                {session.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-blue-400 hover:text-blue-300"
                  >
                    অ্যাডমিন
                  </Link>
                )}
                {['admin', 'editor'].includes(session.user?.role || '') && (
                  <Link
                    href="/editor"
                    className="text-sm font-medium text-blue-400 hover:text-blue-300"
                  >
                    সম্পাদক
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span>লগআউট</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                লগইন
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800">
              {/* Mobile Search */}
              <div className="mb-4">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="খবর খুঁজুন..."
                      className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </form>
              </div>

              {/* Mobile Navigation Links */}
              <Link
                href="/"
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                হোম
              </Link>
              <Link
                href="/categories"
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                বিভাগসমূহ
              </Link>
              
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i: number) => (
                    <div key={i} className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                categories.map((category: Category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug}`}
                    className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))
              )}

              {/* Mobile User Menu */}
              {session ? (
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <User className="h-5 w-5 text-gray-300" />
                    <span className="text-sm font-medium text-gray-300">
                      {session.user?.name}
                    </span>
                  </div>
                  {session.user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      অ্যাডমিন
                    </Link>
                  )}
                  {['admin', 'editor'].includes(session.user?.role || '') && (
                    <Link
                      href="/editor"
                      className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      সম্পাদক
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white w-full px-3 py-2 text-left text-base font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>লগআউট</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-800">
                  <Link
                    href="/auth/signin"
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    লগইন
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}