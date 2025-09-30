// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Users, LayoutGrid, Newspaper, Settings } from 'lucide-react';

// export default function AdminSidebar() {
//   const pathname = usePathname();

//   const navItems = [
//     { name: 'ড্যাশবোর্ড', href: '/admin', icon: LayoutGrid },
//     { name: 'খবর ব্যবস্থাপনা', href: '/admin/news', icon: Newspaper },
//     { name: 'সম্পাদক ব্যবস্থাপনা', href: '/admin#editors', icon: Users },
//     { name: 'বিভাগ ব্যবস্থাপনা', href: '/admin#categories', icon: Newspaper },
//     { name: 'সেটিংস', href: '/admin#settings', icon: Settings },
//   ];

//   return (
//     <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r shadow-sm py-28">
//       <div className="h-16 flex items-center px-6 border-b">
//         <Link href="/" className="text-xl font-semibold text-blue-600">
//           বাংলা সংবাদ
//         </Link>
//       </div>
//       <nav className="p-4 space-y-1">
//         {navItems.map((item) => {
//           const Icon = item.icon;
//           const active = pathname === item.href;
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                 active
//                   ? 'bg-blue-50 text-blue-700'
//                   : 'text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <Icon className="h-4 w-4" />
//               <span>{item.name}</span>
//             </Link>
//           );
//         })}
//         <div className="mt-6 p-3 text-xs text-gray-500">অ্যাডমিন প্যানেল</div>
//       </nav>
//     </aside>
//   );
// }

"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LayoutGrid, Newspaper, Settings } from 'lucide-react';

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'ড্যাশবোর্ড', href: '/admin', icon: LayoutGrid },
    { name: 'খবর ব্যবস্থাপনা', href: '/admin/news', icon: Newspaper },
    { name: 'সম্পাদক ব্যবস্থাপনা', href: '/admin/editors', icon: Users },
    { name: 'বিভাগ ব্যবস্থাপনা', href: '/admin/categories', icon: Newspaper },
    { name: 'সেটিংস', href: '/admin#settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop sidebar - fixed position */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 z-40">
        <div className="h-full flex flex-col bg-[#00141a] text-white">
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${active 
                        ? 'bg-blue-900 text-blue-100 shadow-inner' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-8 px-4 py-3 text-xs text-gray-500 border-t border-gray-800">
              অ্যাডমিন প্যানেল v1.0
            </div>
          </nav>
          
          {/* User info section */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-700 rounded-full p-2">
                <Users size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">অ্যাডমিন</p>
                <p className="text-xs text-gray-400">admin@banglasangbad.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar - absolute position */}
      <div className="lg:hidden h-full flex flex-col bg-[#00141a] text-white">
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${active 
                      ? 'bg-blue-900 text-blue-100 shadow-inner' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="mt-8 px-4 py-3 text-xs text-gray-500 border-t border-gray-800">
            অ্যাডমিন প্যানেল v1.0
          </div>
        </nav>
        
        {/* User info section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-700 rounded-full p-2">
              <Users size={18} />
            </div>
            <div>
              <p className="text-sm font-medium">অ্যাডমিন</p>
              <p className="text-xs text-gray-400">admin@banglasangbad.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}