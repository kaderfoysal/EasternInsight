// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import db from '../../../../utils/db';

// Explicitly set runtime to Node.js
export const runtime = 'nodejs';

// Define a custom interface for our JWT payload
interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Get token from cookie first
    let token = request.cookies.get('auth-token')?.value;
    
    // 2. Fallback: check Authorization header
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove "Bearer " prefix
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      );
    }
    
    // 3. Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { error: 'JWT_SECRET is not defined' },
        { status: 500 }
      );
    }
    
    let payload;
    try {
      payload = jwt.verify(token, jwtSecret) as CustomJwtPayload;
    } catch (jwtError) {
      return NextResponse.json(
        {
          error: 'Invalid or expired token',
          details: (jwtError as Error).message,
        },
        { status: 401 }
      );
    }
    
    // 4. Get user from DB
    const user = await db.findUserById(payload.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Remove password before sending
    const { password, ...userWithoutPassword } = user;
    // Explicitly note that we're not using password
    void password;
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('❌ [DEBUG] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to get current user' },
      { status: 500 }
    );
  }
}