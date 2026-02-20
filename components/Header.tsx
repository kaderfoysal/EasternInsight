// 'use client';
// import { useEffect, useState, useCallback, useRef } from 'react';
// import Link from 'next/link';
// import { useSession, signOut } from 'next-auth/react';
// import { usePathname, useSearchParams, useRouter } from 'next/navigation';
// import { Menu, X, Search, User, LogOut, Languages, ChevronDown, ChevronUp } from 'lucide-react';
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
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [categories, setCategories] = useState([] as Category[]);
//   const [loading, setLoading] = useState(true);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); // Changed to click toggle
//   const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
//   const [dateLine1, setDateLine1] = useState('');
//   const [dateLine2, setDateLine2] = useState('');
//   const [currentLang, setCurrentLang] = useState('bn' as 'bn' | 'en');
//   const categoryRef = useRef<HTMLDivElement>(null); // For click outside

//   // Check if on admin or editor page - if so, default to scrolled state
//   const isAdminOrEditorPage = pathname?.startsWith('/admin') || pathname?.startsWith('/editor');
//   const [isScrolled, setIsScrolled] = useState(isAdminOrEditorPage || false);

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
//         setShowCategoryDropdown(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     // Format date in Bangla
//     const updateDate = () => {
//       const now = new Date();
//       const weekday = now.toLocaleDateString('bn-BD', { weekday: 'long' });
//       const month = now.toLocaleDateString('bn-BD', { month: 'long' });
//       const day = now.toLocaleDateString('bn-BD', { day: '2-digit' });
//       const year = now.toLocaleDateString('bn-BD', { year: 'numeric' });
//       setDateLine1(`${weekday}, ${month}`);
//       setDateLine2(`${day}, ${year}`);
//     };
//     updateDate();
//     const interval = setInterval(updateDate, 60000);
//     return () => clearInterval(interval);
//   }, []);

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

//   // Toggle আরো dropdown on click
//   const toggleCategoryDropdown = () => {
//     setShowCategoryDropdown(!showCategoryDropdown);
//   };

//   const loadGoogleTranslate = useCallback(() => {
//     if (!document.getElementById('google-translate-script')) {
//       (window as any).googleTranslateElementInit = function() {
//         new (window as any).google.translate.TranslateElement(
//           {
//             pageLanguage: 'bn',
//             includedLanguages: 'en,bn',
//             layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
//             autoDisplay: false
//           },
//           'google_translate_element'
//         );
//       };
//       const script = document.createElement('script');
//       script.id = 'google-translate-script';
//       script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//       script.async = true;
//       document.body.appendChild(script);
//     }
//   }, []);

//   const toggleLanguage = () => {
//     const newLang = currentLang === 'bn' ? 'en' : 'bn';
//     setCurrentLang(newLang);
//     localStorage.setItem('preferredLanguage', newLang);
//     const attemptTranslation = (attempts = 0) => {
//       const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
//       if (selectElement) {
//         const targetValue = newLang === 'en' ? 'en' : '';
//         selectElement.value = targetValue;
//         selectElement.dispatchEvent(new Event('change'));
//       } else if (attempts < 20) {
//         setTimeout(() => attemptTranslation(attempts + 1), 200);
//       }
//     };
//     attemptTranslation();
//   };

//   useEffect(() => {
//     loadGoogleTranslate();
//   }, [loadGoogleTranslate]);

//   return (
//     <>
//       <header 
//         className={`sticky top-0 left-0 w-full bg-gradient-to-r from-[#00141a] via-[#001a24] to-[#00141a] shadow-2xl border-b border-gray-700/50 z-[100] transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}
//         style={{ isolation: 'isolate' }} // Creates new stacking context
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center gap-4">
//             {/* Logo */}
//             <div className="flex-shrink-0">
//               <Link href="/" className="flex items-center group">
//                 <Image
//                   src={Logo}
//                   alt="Eastern Insight Logo"
//                   width={isScrolled ? 120 : 150}
//                   height={isScrolled ? 25 : 32}
//                   className="transition-all duration-300 group-hover:scale-105"
//                 />
//               </Link>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden lg:flex items-center space-x-1 flex-1 overflow-visible py-1">
//               {/* Current Date in Bangla */}
//               <div className="text-gray-300 px-3 py-1 leading-tight whitespace-nowrap border-r border-gray-600/50 pr-4">
//                 <div className="text-xs">{dateLine1}</div>
//                 <div className="text-xs">{dateLine2}</div>
//               </div>

//               {loading ? (
//                 <div className="flex space-x-2">
//                   {Array.from({ length: 6 }).map((_, i: number) => (
//                     <div key={i} className="h-3 w-16 bg-gray-700/50 rounded animate-pulse"></div>
//                   ))}
//                 </div>
//               ) : (
//                 <>
//                   {categories.slice(0, 5).map((category: Category) => (
//                     <Link
//                       key={category._id}
//                       href={`/category/${category.slug}`}
//                       className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap"
//                     >
//                       {category.name}
//                     </Link>
//                   ))}
//                   {/* FIXED আরো Dropdown - CLICK TO TOGGLE + ULTRA HIGH Z-INDEX */}
//                   {categories.length > 5 && (
//                     <div ref={categoryRef} className="relative inline-block z-[10000]">
//                       <button
//                         onClick={toggleCategoryDropdown}
//                         className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1 relative z-[10001]"
//                       >
//                         আরো {showCategoryDropdown ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
//                       </button>

//                       {/* PORTAL-LIKE DROPDOWN - Guaranteed above everything */}
//                       {showCategoryDropdown && (
//                         <div 
//                           className="absolute top-full left-0 mt-1 w-48 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-600 py-2 animate-in slide-in-from-top-2 duration-200 z-[10000]"
//                           style={{
//                             transform: 'translateZ(0)', // Hardware acceleration
//                             willChange: 'transform'
//                           }}
//                         >
//                           {categories.slice(5).map((category: Category) => (
//                             <Link
//                               key={category._id}
//                               href={`/category/${category.slug}`}
//                               className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700/80 transition-all duration-200 border-l-4 border-transparent hover:border-blue-500 ml-2"
//                               onClick={() => setShowCategoryDropdown(false)}
//                             >
//                               {category.name}
//                             </Link>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </>
//               )}
//             </nav>

//             {/* Right Side Actions - Same as before */}
//             <div className="flex items-center gap-2">
//               {/* Language Toggle - Updated with better z-index */}
//               <div className="hidden md:flex items-center">
//                 <div className="relative z-[10000]">
//                   <button
//                     onClick={toggleLanguage}
//                     onMouseEnter={() => setIsLangDropdownOpen(true)}
//                     onMouseLeave={() => setIsLangDropdownOpen(false)}
//                     className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200 relative z-[10001]"
//                     aria-label="Toggle Language"
//                   >
//                     <Languages className="h-4 w-4" />
//                     <span>{currentLang === 'bn' ? 'English' : 'বাংলা'}</span>
//                     <ChevronDown className="h-3 w-3" />
//                   </button>
//                   {isLangDropdownOpen && (
//                     <div className="absolute top-full right-0 mt-2 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-2xl py-2 z-[10000] min-w-[120px] border border-gray-600">
//                       <button
//                         onClick={() => {
//                           toggleLanguage();
//                           setIsLangDropdownOpen(false);
//                         }}
//                         className={`block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/80 transition-colors duration-200 ${currentLang === 'bn' ? 'bg-blue-600/20' : ''}`}
//                       >
//                         বাংলা
//                       </button>
//                       <button
//                         onClick={() => {
//                           toggleLanguage();
//                           setIsLangDropdownOpen(false);
//                         }}
//                         className={`block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/80 transition-colors duration-200 ${currentLang === 'en' ? 'bg-blue-600/20' : ''}`}
//                       >
//                         English
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Rest remains exactly the same */}
//               <div className="hidden md:flex items-center">
//                 <button
//                   onClick={toggleSearch}
//                   className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
//                   aria-label="Search"
//                 >
//                   {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
//                 </button>
//               </div>

//               <div className="hidden md:flex items-center gap-2">
//                 {status === 'loading' ? (
//                   <div className="animate-pulse bg-gray-700 h-8 w-8 rounded-full"></div>
//                 ) : session ? (
//                   <div className="flex items-center gap-2">
//                     <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full">
//                       <User className="h-4 w-4 text-blue-400" />
//                       <span className="text-xs font-medium text-gray-200 max-w-[100px] truncate">
//                         {session.user?.name}
//                       </span>
//                     </div>
//                     {session.user?.role === 'admin' && (
//                       <Link href="/admin" className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 rounded-full transition-all duration-200">
//                         অ্যাডমিন
//                       </Link>
//                     )}
//                     {['admin', 'editor'].includes(session.user?.role || '') && (
//                       <Link href="/editor" className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 rounded-full transition-all duration-200">
//                         সম্পাদক
//                       </Link>
//                     )}
//                     <button
//                       onClick={() => signOut()}
//                       className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-red-600/20 rounded-full transition-all duration-200"
//                     >
//                       <LogOut className="h-4 w-4" />
//                       <span>লগআউট</span>
//                     </button>
//                   </div>
//                 ) : null}
//               </div>

//               <div className="md:hidden flex items-center gap-2">
//                 <button
//                   onClick={toggleSearch}
//                   className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
//                   aria-label="Search"
//                 >
//                   <Search className="h-5 w-5" />
//                 </button>
//                 <button
//                   onClick={() => setIsMenuOpen(!isMenuOpen)}
//                   className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200"
//                 >
//                   {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Search Bar */}
//           {isSearchOpen && (
//             <div className="mt-3 pb-2 animate-in slide-in-from-top duration-200">
//               <form onSubmit={handleSearch}>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="খবর খুঁজুন..."
//                     autoFocus
//                     className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-gray-800/80 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm shadow-lg"
//                   />
//                   <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* Mobile Navigation - unchanged */}
//           {isMenuOpen && (
//             <div className="md:hidden mt-3 animate-in slide-in-from-top duration-200">
//               <div className="px-2 pt-3 pb-4 space-y-2 border-t border-gray-700/50 bg-gray-900/50 rounded-b-lg backdrop-blur-sm">
//                 <div className="text-gray-300 px-4 py-2 leading-tight border-r border-gray-600/50 pr-4">
//                   <div className="text-sm">{dateLine1}</div>
//                   <div className="text-sm">{dateLine2}</div>
//                 </div>
//                 {loading ? (
//                   <div className="space-y-2 px-4">
//                     {Array.from({ length: 5 }).map((_, i: number) => (
//                       <div key={i} className="h-3 w-20 bg-gray-700/50 rounded animate-pulse"></div>
//                     ))}
//                   </div>
//                 ) : (
//                   categories.map((category: Category) => (
//                     <Link
//                       key={category._id}
//                       href={`/category/${category.slug}`}
//                       className="text-gray-300 hover:text-white hover:bg-gray-800/50 block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       {category.name}
//                     </Link>
//                   ))
//                 )}
//                 {session && (
//                   <div className="pt-3 mt-3 border-t border-gray-700/50 space-y-2">
//                     <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg">
//                       <User className="h-4 w-4 text-blue-400" />
//                       <span className="text-sm font-medium text-gray-200">{session.user?.name}</span>
//                     </div>
//                     {session.user?.role === 'admin' && (
//                       <Link href="/admin" className="text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
//                         অ্যাডমিন
//                       </Link>
//                     )}
//                     {['admin', 'editor'].includes(session.user?.role || '') && (
//                       <Link href="/editor" className="text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
//                         সম্পাদক
//                       </Link>
//                     )}
//                     <button
//                       onClick={() => {
//                         signOut();
//                         setIsMenuOpen(false);
//                       }}
//                       className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-red-600/20 w-full px-4 py-2.5 text-left text-sm font-medium rounded-lg transition-all duration-200"
//                     >
//                       <LogOut className="h-4 w-4" />
//                       <span>লগআউট</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Hidden Google Translate */}
//       <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', top: '0' }}></div>
//     </>
//   );
// }


// 2

'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Menu, X, Search, User, LogOut, Languages, ChevronDown, ChevronUp } from 'lucide-react';
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([] as Category[]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [dateLine1, setDateLine1] = useState('');
  const [dateLine2, setDateLine2] = useState('');
  const [currentLang, setCurrentLang] = useState('bn' as 'bn' | 'en');

  // Use HTMLElement instead of HTMLDivElement to avoid type issues
  const categoryRef = useRef(null);
  const langRef = useRef(null);

  const isAdminOrEditorPage = pathname?.startsWith('/admin') || pathname?.startsWith('/editor');
  const [isScrolled, setIsScrolled] = useState(isAdminOrEditorPage || false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const weekday = now.toLocaleDateString('bn-BD', { weekday: 'long' });
      const month = now.toLocaleDateString('bn-BD', { month: 'long' });
      const day = now.toLocaleDateString('bn-BD', { day: '2-digit' });
      const year = now.toLocaleDateString('bn-BD', { year: 'numeric' });
      setDateLine1(`${weekday}, ${month}`);
      setDateLine2(`${day}, ${year}`);
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
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
      if (isAdminOrEditorPage) {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    if (isSearchOpen) setSearchQuery('');
  };

  // Hover + Click for আরো dropdown (Desktop)
  const handleCategoryToggle = () => {
    setShowCategoryDropdown(true);
  };

  const handleCategoryMouseEnter = () => {
    setShowCategoryDropdown(true);
  };

  const handleCategoryMouseLeave = () => {
    setShowCategoryDropdown(false);
  };

  const loadGoogleTranslate = useCallback(() => {
    if (!document.getElementById('google-translate-script')) {
      (window as any).googleTranslateElementInit = function () {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'bn',
            includedLanguages: 'en,bn',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
      };
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === 'bn' ? 'en' : 'bn';
    setCurrentLang(newLang);
    localStorage.setItem('preferredLanguage', newLang);
    const attemptTranslation = (attempts = 0) => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        const targetValue = newLang === 'en' ? 'en' : '';
        selectElement.value = targetValue;
        selectElement.dispatchEvent(new Event('change'));
      } else if (attempts < 20) {
        setTimeout(() => attemptTranslation(attempts + 1), 200);
      }
    };
    attemptTranslation();
  };

  useEffect(() => {
    loadGoogleTranslate();
  }, [loadGoogleTranslate]);

  return (
    <>
      <header
        className={`sticky top-0 left-0 w-full bg-gradient-to-r from-[#00141a] via-[#001a24] to-[#00141a] shadow-2xl border-b border-gray-700/50 z-[100] transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}
        style={{ isolation: 'isolate' }}
      >
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
            <nav className="hidden lg:flex items-center space-x-1 flex-1 overflow-visible py-1">
              <div className="text-gray-300 px-3 py-1 leading-tight whitespace-nowrap border-r-2 border-gray-600/50 pr-4">
                <div className="text-base">{dateLine1}</div>
                <div className="text-base">{dateLine2}</div>
              </div>

              {loading ? (
                <div className="flex space-x-2">
                  {Array.from({ length: 6 }).map((_, i: number) => (
                    <div key={i} className="h-3 w-16 bg-gray-700/50 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <>
                  {categories.slice(0, 5).map((category: Category) => (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug}`}
                      className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-1.5 rounded-lg text-base font-medium transition-all duration-200 whitespace-nowrap"
                    >
                      {category.name}
                    </Link>
                  ))}

                  {/* আরো Dropdown - HOVER + CLICK (Desktop) */}
                  {categories.length > 5 && (
                    <div
                      ref={categoryRef}
                      className="relative inline-block z-[10000]"
                      onMouseEnter={handleCategoryMouseEnter}
                      onMouseLeave={handleCategoryMouseLeave}
                    >
                      <button
                        onClick={handleCategoryToggle}
                        className="text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-1.5 rounded-lg text-base font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1 relative z-[10001] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        আরো {showCategoryDropdown ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>

                      {showCategoryDropdown && (
                        <div
                          className="absolute top-full left-0 mt-1 w-48 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-600 py-2 animate-in slide-in-from-top-2 duration-200 z-[15000]"
                          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                        >
                          {categories.slice(5).map((category: Category) => (
                            <Link
                              key={category._id}
                              href={`/category/${category.slug}`}
                              className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700/80 transition-all duration-200 border-l-4 border-transparent hover:border-blue-500 ml-2"
                              onClick={() => setShowCategoryDropdown(false)}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Language Dropdown */}
              <div className="hidden md:flex items-center" ref={langRef}>
                <div className="relative z-[10000]">
                  <button
                    onClick={toggleLanguage}
                    onMouseEnter={() => setIsLangDropdownOpen(true)}
                    onMouseLeave={() => setIsLangDropdownOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200 relative z-[10001] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Toggle Language"
                  >
                    <Languages className="h-4 w-4" />
                    <span>{currentLang === 'bn' ? 'English' : 'বাংলা'}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {isLangDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-2xl py-2 z-[15000] min-w-[120px] border border-gray-600">
                      <button
                        onClick={() => {
                          toggleLanguage();
                          setIsLangDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/80 transition-colors duration-200 ${currentLang === 'bn' ? 'bg-blue-600/20' : ''}`}
                      >
                        বাংলা
                      </button>
                      <button
                        onClick={() => {
                          toggleLanguage();
                          setIsLangDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/80 transition-colors duration-200 ${currentLang === 'en' ? 'bg-blue-600/20' : ''}`}
                      >
                        English
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Search, User Menu, Mobile - Same as before */}
              <div className="hidden md:flex items-center">
                <button onClick={toggleSearch} className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200">
                  {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                </button>
              </div>

              <div className="hidden md:flex items-center gap-2">
                {status === 'loading' ? (
                  <div className="animate-pulse bg-gray-700 h-8 w-8 rounded-full"></div>
                ) : session ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full">
                      <User className="h-4 w-4 text-blue-400" />
                      <span className="text-xs font-medium text-gray-200 max-w-[100px] truncate">{session.user?.name}</span>
                    </div>
                    {session.user?.role === 'admin' && (
                      <Link href="/admin" className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 rounded-full transition-all duration-200">
                        অ্যাডমিন
                      </Link>
                    )}
                    {['admin', 'editor'].includes(session.user?.role || '') && (
                      <Link href="/editor" className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 rounded-full transition-all duration-200">
                        সম্পাদক
                      </Link>
                    )}
                    <button onClick={() => signOut()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-red-600/20 rounded-full transition-all duration-200">
                      <LogOut className="h-4 w-4" /> <span>লগআউট</span>
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="md:hidden flex items-center gap-2">
                <button onClick={toggleSearch} className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200">
                  <Search className="h-5 w-5" />
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full transition-all duration-200">
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
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

          {/* MOBILE MENU WITH আরো DROPDOWN */}
          {isMenuOpen && (
            <div className="md:hidden mt-3 animate-in slide-in-from-top duration-200">
              <div className="px-2 pt-3 pb-4 space-y-2 border-t border-gray-700/50 bg-gray-900/50 rounded-b-lg backdrop-blur-sm">
                <div className="text-gray-300 px-4 py-2 leading-tight border-r-2 border-gray-600/50 pr-4">
                  <div className="text-sm">{dateLine1}</div>
                  <div className="text-sm">{dateLine2}</div>
                </div>

                {loading ? (
                  <div className="space-y-2 px-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-3 w-20 bg-gray-700/50 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Mobile first 5 categories */}
                    {categories.slice(0, 5).map((category: Category) => (
                      <Link
                        key={category._id}
                        href={`/category/${category.slug}`}
                        className="text-gray-300 hover:text-white hover:bg-gray-800/50 block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}

                    {/* Mobile আরো Dropdown */}
                    {categories.length > 5 && (
                      <div className="px-4">
                        <div
                          className="relative inline-block w-full z-[10000]"
                          onMouseEnter={handleCategoryMouseEnter}
                          onMouseLeave={handleCategoryMouseLeave}
                        >
                          <button
                            onClick={handleCategoryToggle}
                            className="text-gray-300 hover:text-white hover:bg-gray-800/50 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-between"
                          >
                            আরো {showCategoryDropdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>

                          {showCategoryDropdown && (
                            <div className="absolute top-full left-0 mt-1 w-full bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-600 py-2 z-[15000] mt-2">
                              {categories.slice(5).map((category: Category) => (
                                <Link
                                  key={category._id}
                                  href={`/category/${category.slug}`}
                                  className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700/80 transition-all duration-200 border-l-4 border-transparent hover:border-blue-500 ml-2"
                                  onClick={() => {
                                    setShowCategoryDropdown(false);
                                    setIsMenuOpen(false);
                                  }}
                                >
                                  {category.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Mobile User Menu */}
                {session && (
                  <div className="pt-3 mt-3 border-t border-gray-700/50 space-y-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg">
                      <User className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-gray-200">{session.user?.name}</span>
                    </div>
                    {session.user?.role === 'admin' && (
                      <Link href="/admin" className="text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                        অ্যাডমিন
                      </Link>
                    )}
                    {['admin', 'editor'].includes(session.user?.role || '') && (
                      <Link href="/editor" className="text-blue-400 hover:text-blue-300 hover:bg-gray-800/50 block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                        সম্পাদক
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-red-600/20 w-full px-4 py-2.5 text-left text-sm font-medium rounded-lg transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4" /> <span>লগআউট</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', top: '0' }}></div>
    </>
  );
}