// app/api/auth/validate-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

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
      const payload = jwt.verify(token, jwtSecret);
      
      return NextResponse.json({
        valid: true,
        payload,
        expiresAt: new Date((payload as any).exp * 1000).toISOString(),
        issuedAt: new Date((payload as any).iat * 1000).toISOString()
      });
    } catch (error) {
      return NextResponse.json({
        valid: false,
        error: (error as Error).message,
        errorType: (error as Error).name
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to validate token' },
      { status: 500 }
    );
  }
}