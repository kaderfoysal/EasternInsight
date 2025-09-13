import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define a custom interface for our JWT payload
interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
  name?: string;
  email?: string;
}

/**
 * Authentication middleware for API routes
 * @param req Next.js request object
 * @returns Response object or null to continue
 */
export async function authMiddleware(req: NextRequest) {
  // Skip authentication for login, register, and user creation routes
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/users'
  ];
  
  if (publicPaths.includes(req.nextUrl.pathname)) {
    return null;
  }
  
  // Get token from header
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization token is required' },
      { status: 401 }
    );
  }
  
  const token = authHeader.substring(7); // Remove "Bearer " prefix
  
  // Verify token
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return NextResponse.json(
      { error: 'JWT_SECRET is not defined' },
      { status: 500 }
    );
  }
  
  try {
    const user = jwt.verify(token, jwtSecret) as CustomJwtPayload;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Add user to request headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('user', JSON.stringify(user));
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * Check if user has required role
 * @param req Request with user
 * @param roles Allowed roles
 * @returns Boolean indicating if user has required role
 */
export function hasRole(req: NextRequest, roles: string[]) {
  // Get user from headers
  const userHeader = req.headers.get('user');
  
  if (!userHeader) {
    return false;
  }
  
  try {
    const user = JSON.parse(userHeader) as CustomJwtPayload;
    
    if (!user || !user.role) {
      return false;
    }
    
    return roles.includes(user.role);
  } catch (error) {
    console.error('Error parsing user from header:', error);
    return false;
  }
}

/**
 * Get current user from request
 * @param req Request with user
 * @returns User object or null
 */
export function getCurrentUser(req: NextRequest): CustomJwtPayload | null {
  const userHeader = req.headers.get('user');
  
  if (!userHeader) {
    return null;
  }
  
  try {
    return JSON.parse(userHeader) as CustomJwtPayload;
  } catch (error) {
    console.error('Error parsing user from header:', error);
    return null;
  }
}