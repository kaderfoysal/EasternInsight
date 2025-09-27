import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = req.nextUrl.pathname.startsWith('/admin');
    const isEditor = req.nextUrl.pathname.startsWith('/editor');

    if (isAdmin && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    if (isEditor && !['admin', 'editor'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdmin = req.nextUrl.pathname.startsWith('/admin');
        const isEditor = req.nextUrl.pathname.startsWith('/editor');
        
        if (isAdmin || isEditor) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/editor/:path*']
};
