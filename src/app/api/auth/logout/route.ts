// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

// This can use Edge runtime as it doesn't need jsonwebtoken
export async function POST() {
  try {
    console.log('🔍 [DEBUG] Logout API called');
    
    // Create response and clear cookie
    const response = NextResponse.json({ success: true });
    
    // Clear the cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });
    
    console.log('✅ [DEBUG] Logout successful, cookie cleared');
    return response;
  } catch (error) {
    console.error('❌ [DEBUG] Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}