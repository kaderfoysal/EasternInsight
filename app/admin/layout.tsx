// 'use client';

// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import AdminSidebar from '@/components/AdminSidebar';

// // Extend the session user type to include 'role'
// type SessionUser = {
//   name?: string | null;
//   email?: string | null;
//   image?: string | null;
//   role?: string | null;
// };

// type Session = {
//   user?: SessionUser;
// };

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { data: session, status } = useSession() as {
//     data: Session | null;
//     status: 'loading' | 'authenticated' | 'unauthenticated';
//   };
//   const router = useRouter();

//   useEffect(() => {
//     if (status === 'loading') return;

//     if (!session) {
//       router.push('/auth/signin');
//       return;
//     }

//     if (session.user?.role !== 'admin') {
//       router.push('/');
//       return;
//     }
//   }, [session, status, router]);

//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!session || session.user?.role !== 'admin') {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex">
//         <AdminSidebar />
//         <main className="flex-1 ml-64">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


// 2
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Menu, X } from 'lucide-react';

// Extend the session user type to include 'role'
type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type Session = {
  user?: SessionUser;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession() as {
    data: Session | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  };
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Fixed position for desktop, sliding for mobile */}
      <div className={`
        fixed top-16 pt-4 bottom-0 left-0 z-50 w-64 bg-[#00141a] text-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">অ্যাডমিন প্যানেল</h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}