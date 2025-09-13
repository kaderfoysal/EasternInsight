// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { useSession, signOut } from 'next-auth/react';

// const Header = () => {
//   const { data: session } = useSession();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   const categories = [
//     { name: 'Politics', href: '/category/politics' },
//     { name: 'Business', href: '/category/business' },
//     { name: 'Sports', href: '/category/sports' },
//     { name: 'Technology', href: '/category/technology' },
//     { name: 'Entertainment', href: '/category/entertainment' },
//   ];

//   return (
//     <header className="bg-white shadow-md">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex justify-between items-center">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link href="/" className="text-2xl font-bold text-gray-900">
//               Eastern Insight
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex space-x-8">
//             {categories.map((category) => (
//               <Link
//                 key={category.name}
//                 href={category.href}
//                 className="text-gray-700 hover:text-gray-900 font-medium"
//               >
//                 {category.name}
//               </Link>
//             ))}
//           </nav>

//           {/* Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             {session ? (
//               <>
//                 {session.user.role === 'ADMIN' && (
//                   <Link
//                     href="/admin"
//                     className="text-gray-700 hover:text-gray-900 font-medium"
//                   >
//                     Admin Panel
//                   </Link>
//                 )}
//                 {(session.user.role === 'EDITOR' || session.user.role === 'WRITER') && (
//                   <Link
//                     href="/editor"
//                     className="text-gray-700 hover:text-gray-900 font-medium"
//                   >
//                     Editor Panel
//                   </Link>
//                 )}
//                 <button
//                   onClick={() => signOut()}
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
//                 >
//                   Sign Out
//                 </button>
//               </>
//             ) : (
//               <Link
//                 href="/login"
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
//               >
//                 Sign In
//               </Link>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={toggleMobileMenu}
//               className="text-gray-700 hover:text-gray-900 focus:outline-none"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 {mobileMenuOpen ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {mobileMenuOpen && (
//           <div className="md:hidden mt-4 space-y-2">
//             {categories.map((category) => (
//               <Link
//                 key={category.name}
//                 href={category.href}
//                 className="block text-gray-700 hover:text-gray-900 font-medium py-2"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 {category.name}
//               </Link>
//             ))}
//             {session ? (
//               <>
//                 {session.user.role === 'ADMIN' && (
//                   <Link
//                     href="/admin"
//                     className="block text-gray-700 hover:text-gray-900 font-medium py-2"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     Admin Panel
//                   </Link>
//                 )}
//                 {(session.user.role === 'EDITOR' || session.user.role === 'WRITER') && (
//                   <Link
//                     href="/editor"
//                     className="block text-gray-700 hover:text-gray-900 font-medium py-2"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     Editor Panel
//                   </Link>
//                 )}
//                 <button
//                   onClick={() => signOut()}
//                   className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-2"
//                 >
//                   Sign Out
//                 </button>
//               </>
//             ) : (
//               <Link
//                 href="/login"
//                 className="block text-indigo-600 hover:text-indigo-700 font-medium py-2"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Sign In
//               </Link>
//             )}
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;


'use client';

import { useState } from 'react';
import Link from 'next/link';

interface User {
  name?: string;
  email?: string;
  role: 'USER' | 'WRITER' | 'EDITOR' | 'ADMIN';
}

interface HeaderProps {
  user?: User | null;
  onSignOut?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const categories = [
    { name: 'Politics', href: '/category/politics' },
    { name: 'Business', href: '/category/business' },
    { name: 'Sports', href: '/category/sports' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'Entertainment', href: '/category/entertainment' },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Eastern Insight
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {(user.role === 'ADMIN') && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Admin Panel
                  </Link>
                )}
                {(user.role === 'EDITOR' || user.role === 'WRITER') && (
                  <Link
                    href="/editor"
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Editor Panel
                  </Link>
                )}
                <button
                  onClick={onSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                {(user.role === 'EDITOR' || user.role === 'WRITER') && (
                  <Link
                    href="/editor"
                    className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Editor Panel
                  </Link>
                )}
                <button
                  onClick={onSignOut}
                  className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block text-indigo-600 hover:text-indigo-700 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
