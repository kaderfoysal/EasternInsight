// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyTokenEdge, extractTokenFromHeader } from './utils/jwt-edge';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Define public paths that don't require authentication
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/api/auth/login',
    '/api/auth/register',
    '/api/users',
  ];

  const isPublicPath = publicPaths.some(
    (p) => path === p || path.startsWith(p + '/')
  );

  // 2. Skip auth for static files
  const isStaticPath = ['/_next', '/favicon.ico'].some((p) =>
    path.startsWith(p)
  );

  if (isPublicPath || isStaticPath) {
    return NextResponse.next();
  }

  let token: string | undefined = request.cookies.get('auth-token')?.value;

  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = extractTokenFromHeader(authHeader) || undefined; // normalize null → undefined
    }
  }
  // 4. If no token → redirect/deny
  if (!token) {
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 5. Verify token
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const user = await verifyTokenEdge(token, jwtSecret);
  if (!user) {
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 6. Role-based access
  if (path.startsWith('/admin') && user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (
    path.startsWith('/editor') &&
    !['ADMIN', 'EDITOR', 'WRITER'].includes(user.role)
  ) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // 7. Attach user info to API requests
  if (path.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user', JSON.stringify(user));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
