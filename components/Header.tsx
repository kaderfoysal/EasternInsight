// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useSession, signOut } from 'next-auth/react';
// import { usePathname } from 'next/navigation';
// import { Menu, X, Search, User, LogOut } from 'lucide-react';
// import Image from 'next/image'; 
// import Logo from '../assets/logo2.png'; 

// interface Category {
//   _id: string;
//   name: string;
//   slug: string;
// }

// type SessionUser = {
//   name?: string | null;
//   email?: string | null;
//   image?: string | null;
//   role?: string | null;
// };

// type SessionType = {
//   user?: SessionUser;
// };

// export default function Header() {
//   const { data: session, status } = useSession() as { data: SessionType | null, status: string };
//   const pathname = usePathname();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [categories, setCategories] = useState([] as Category[]);
//   const [loading, setLoading] = useState(true);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
  
//   // Check if on admin or editor page - if so, default to scrolled state
//   const isAdminOrEditorPage = pathname.startsWith('/admin') || pathname.startsWith('/editor');
//   const [isScrolled, setIsScrolled] = useState(isAdminOrEditorPage);

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const response = await fetch('/api/categories');
//         if (response.ok) {
//           const categoryData: Category[] = await response.json();
//           setCategories(categoryData);
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       // On admin/editor pages, always keep scrolled state
//       if (isAdminOrEditorPage) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(window.scrollY > 100);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [isAdminOrEditorPage]);

//   const handleSearch = (e: any) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
//       setIsSearchOpen(false);
//     }
//   };

//   const toggleSearch = () => {
//     setIsSearchOpen(!isSearchOpen);
//     if (isSearchOpen) {
//       setSearchQuery('');
//     }
//   };

//   return (
//     <header className={`sticky top-0 left-0 w-full bg-gradient-to-r from-[#00141a] via-[#001a24] to-[#00141a] shadow-2xl border-b border-gray-700/50 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center gap-4">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link href="/" className="flex items-center group">
//               <Image 
//                 src={Logo} 
//                 alt="Eastern Insight Logo" 
//                 width={isScrolled ? 120 : 150} 
//                 height={isScrolled ? 25 : 32} 
//                 className="transition-all duration-300 group-hover:scale-105" 
//               />
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden lg:flex items-center space-x-1 flex-1">
//             <Link
//               href="/"
//               className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
//             >
//               হোম
//             </Link>
//             <Link
//               href="/categories"
//               className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
//             >
//               বিভাগসমূহ
//             </Link>
//             {loading ? (
//               <div className="flex space-x-2">
//                 {Array.from({ length: 3 }).map((_, i: number) => (
//                   <div key={i} className="h-4 w-16 bg-gray-700/50 rounded animate-pulse"></div>
//                 ))}
//               </div>
//             ) : (
//               categories.slice(0, 4).map((category: Category) => (
//                 <Link
//                   key={category._id}
//                   href={`/category/${category.slug}`}
//                   className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
//                 >
//                   {category.name}
//                 </Link>
//               ))
//             )}
//           </nav>

//           {/* Right Side Actions */}
//           <div className="flex items-center gap-2">
//             {/* Search Icon - Desktop */}
//             <div className="hidden md:flex items-center">
//               <button
//                 onClick={toggleSearch}
//                 className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
//                 aria-label="Search"
//               >
//                 {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
//               </button>
//             </div>

//             {/* User Menu - Desktop */}
//             <div className="hidden md:flex items-center gap-2">
//               {status === 'loading' ? (
//                 <div className="animate-pulse bg-gray-700 h-8 w-8 rounded-full"></div>
//               ) : session ? (
//                 <div className="flex items-center gap-2">
//                   <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full">
//                     <User className="h-4 w-4 text-blue-400" />
//                     <span className="text-sm font-medium text-gray-200 max-w-[100px] truncate">
//                       {session.user?.name}
//                     </span>
//                   </div>
//                   {session.user?.role === 'admin' && (
//                     <Link
//                       href="/admin"
//                       className="px-3 py-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 rounded-full transition-all duration-200"
//                     >
//                       অ্যাডমিন
//                     </Link>
//                   )}
//                   {['admin', 'editor'].includes(session.user?.role || '') && (
//                     <Link
//                       href="/editor"
//                       className="px-3 py-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 rounded-full transition-all duration-200"
//                     >
//                       সম্পাদক
//                     </Link>
//                   )}
//                   <button
//                     onClick={() => signOut()}
//                     className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-red-600/20 rounded-full transition-all duration-200"
//                   >
//                     <LogOut className="h-4 w-4" />
//                     <span>লগআউট</span>
//                   </button>
//                 </div>
//               ) : (
//                 <Link
//                   href="/auth/signin"
//                   className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
//                 >
//                   লগইন
//                 </Link>
//               )}
//             </div>

//             {/* Mobile menu button */}
//             <div className="md:hidden flex items-center gap-2">
//               <button
//                 onClick={toggleSearch}
//                 className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
//                 aria-label="Search"
//               >
//                 <Search className="h-5 w-5" />
//               </button>
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
//               >
//                 {isMenuOpen ? (
//                   <X className="h-5 w-5" />
//                 ) : (
//                   <Menu className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Desktop & Mobile Search Bar - Dropdown below header */}
//         {isSearchOpen && (
//           <div className="mt-3 pb-2 animate-in slide-in-from-top duration-200">
//             <form onSubmit={handleSearch}>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="খবর খুঁজুন..."
//                   autoFocus
//                   className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-gray-800/80 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm shadow-lg"
//                 />
//                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden mt-3 animate-in slide-in-from-top duration-200">
//             <div className="px-2 pt-3 pb-4 space-y-2 border-t border-gray-700/50 bg-gray-900/50 rounded-b-lg backdrop-blur-sm">
//               {/* Mobile Navigation Links */}
//               <Link
//                 href="/"
//                 className="text-gray-300 hover:text-white hover:bg-gray-800/50 block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 হোম
//               </Link>
//               <Link
//                 href="/categories"
//                 className="text-gray-300 hover:text-white hover:bg-gray-800/50 block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 বিভাগসমূহ
//               </Link>
              
//               {loading ? (
//                 <div className="space-y-2 px-4">
//                   {Array.from({ length: 5 }).map((_, i: number) => (
//                     <div key={i} className="h-4 w-20 bg-gray-700/50 rounded animate-pulse"></div>
//                   ))}
//                 </div>
//               ) : (
//                 categories.map((category: Category) => (
//                   <Link
//                     key={category._id}
//                     href={`/category/${category.slug}`}
//                     className="text-gray-300 hover:text-white hover:bg-gray-800/50 block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     {category.name}
//                   </Link>
//                 ))
//               )}

//               {/* Mobile User Menu */}
//               {session ? (
//                 <div className="pt-3 mt-3 border-t border-gray-700/50 space-y-2">
//                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg">
//                     <User className="h-4 w-4 text-blue-400" />
//                     <span className="text-sm font-medium text-gray-200">
//                       {session.user?.name}
//                     </span>
//                   </div>
//                   {session.user?.role === 'admin' && (
//                     <Link
//                       href="/admin"
//                       className="text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       অ্যাডমিন
//                     </Link>
//                   )}
//                   {['admin', 'editor'].includes(session.user?.role || '') && (
//                     <Link
//                       href="/editor"
//                       className="text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       সম্পাদব
//                     </Link>
//                   )}
//                   <button
//                     onClick={() => {
//                       signOut();
//                       setIsMenuOpen(false);
//                     }}
//                     className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-red-600/20 w-full px-4 py-2.5 text-left text-sm font-medium rounded-lg transition-all duration-200"
//                   >
//                     <LogOut className="h-4 w-4" />
//                     <span>লগআউট</span>
//                   </button>
//                 </div>
//               ) : (
//                 <div className="pt-3 mt-3 border-t border-gray-700/50">
//                   <Link
//                     href="/auth/signin"
//                     className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 block text-center shadow-lg"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     লগইন
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import Image from 'next/image'; 
import Logo from '../assets/logo2.png'; 

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
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([] as Category[]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dateLine1, setDateLine1] = useState('');
  const [dateLine2, setDateLine2] = useState('');
  
  // Check if on admin or editor page - if so, default to scrolled state
  const isAdminOrEditorPage = pathname.startsWith('/admin') || pathname.startsWith('/editor');
  const [isScrolled, setIsScrolled] = useState(isAdminOrEditorPage);

  useEffect(() => {
    // Format date in Bangla
    const updateDate = () => {
      const now = new Date();
      
      // Get individual parts in Bangla
      const weekday = now.toLocaleDateString('bn-BD', { weekday: 'long' });
      const month = now.toLocaleDateString('bn-BD', { month: 'long' });
      const day = now.toLocaleDateString('bn-BD', { day: '2-digit' });
      const year = now.toLocaleDateString('bn-BD', { year: 'numeric' });
      
      setDateLine1(`${weekday}, ${month}`);
      setDateLine2(`${day}, ${year}`);
    };

    updateDate();
    const interval = setInterval(updateDate, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    const handleScroll = () => {
      // On admin/editor pages, always keep scrolled state
      if (isAdminOrEditorPage) {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isAdminOrEditorPage]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  return (
    <header className={`sticky top-0 left-0 w-full bg-gradient-to-r from-[#00141a] via-[#001a24] to-[#00141a] shadow-2xl border-b border-gray-700/50 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <Image 
                src={Logo} 
                alt="Eastern Insight Logo" 
                width={isScrolled ? 120 : 150} 
                height={isScrolled ? 25 : 32} 
                className="transition-all duration-300 group-hover:scale-105" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 flex-1 overflow-x-auto py-1">
            {/* Current Date in Bangla - Two Lines */}
            <div className="text-gray-300 px-3 py-1 leading-tight whitespace-nowrap">
              <div className="text-xs">{dateLine1}</div>
              <div className="text-xs">{dateLine2}</div>
            </div>
            {loading ? (
              <div className="flex space-x-2">
                {Array.from({ length: 6 }).map((_, i: number) => (
                  <div key={i} className="h-3 w-16 bg-gray-700/50 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              categories.map((category: Category) => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug}`}
                  className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Icon - Desktop */}
            <div className="hidden md:flex items-center">
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
                aria-label="Search"
              >
                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>
            </div>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {status === 'loading' ? (
                <div className="animate-pulse bg-gray-700 h-8 w-8 rounded-full"></div>
              ) : session ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full">
                    <User className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-medium text-gray-200 max-w-[100px] truncate">
                      {session.user?.name}
                    </span>
                  </div>
                  {session.user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 rounded-full transition-all duration-200"
                    >
                      অ্যাডমিন
                    </Link>
                  )}
                  {['admin', 'editor'].includes(session.user?.role || '') && (
                    <Link
                      href="/editor"
                      className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 rounded-full transition-all duration-200"
                    >
                      সম্পাদক
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-red-600/20 rounded-full transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>লগআউট</span>
                  </button>
                </div>
              ) : null}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop & Mobile Search Bar - Dropdown below header */}
        {isSearchOpen && (
          <div className="mt-3 pb-2 animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="খবর খুঁজুন..."
                  autoFocus
                  className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-gray-800/80 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm shadow-lg"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 animate-in slide-in-from-top duration-200">
            <div className="px-2 pt-3 pb-4 space-y-2 border-t border-gray-700/50 bg-gray-900/50 rounded-b-lg backdrop-blur-sm">
              {/* Current Date in Bangla - Two Lines */}
              <div className="text-gray-300 px-4 py-2 leading-tight">
                <div className="text-xs">{dateLine1}</div>
                <div className="text-xs">{dateLine2}</div>
              </div>
              
              {loading ? (
                <div className="space-y-2 px-4">
                  {Array.from({ length: 5 }).map((_, i: number) => (
                    <div key={i} className="h-3 w-20 bg-gray-700/50 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                categories.map((category: Category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug}`}
                    className="text-gray-300 hover:text-white hover:bg-gray-800/50 block px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))
              )}

              {/* Mobile User Menu */}
              {session ? (
                <div className="pt-3 mt-3 border-t border-gray-700/50 space-y-2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg">
                    <User className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-medium text-gray-200">
                      {session.user?.name}
                    </span>
                  </div>
                  {session.user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 block px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      অ্যাডমিন
                    </Link>
                  )}
                  {['admin', 'editor'].includes(session.user?.role || '') && (
                    <Link
                      href="/editor"
                      className="text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 block px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200"
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
                    className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-red-600/20 w-full px-4 py-2 text-left text-xs font-medium rounded-lg transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>লগআউট</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}