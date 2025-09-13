// app/api/auth/validate-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const runtime = 'nodejs';

// Define our custom JWT payload interface with proper typing
interface CustomJwtPayload extends JwtPayload {
  exp: number;
  iat: number;
  [key: string]: unknown; // Use unknown instead of any
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }
    
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      return NextResponse.json(
        { error: 'JWT_SECRET is not defined' },
        { status: 500 }
      );
    }
    
    try {
      // Verify and cast to our custom payload type
      const payload = jwt.verify(token, jwtSecret) as CustomJwtPayload;
      
      // Now we can safely access exp and iat as numbers
      const expiresAt = new Date(payload.exp * 1000).toISOString();
      const issuedAt = new Date(payload.iat * 1000).toISOString();
      
      return NextResponse.json({
        valid: true,
        payload,
        expiresAt,
        issuedAt
      });
    } catch (error) {
      const jwtError = error as Error;
      return NextResponse.json({
        valid: false,
        error: jwtError.message,
        errorType: jwtError.name
      });
    }
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate token' },
      { status: 500 }
    );
  }
}