// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '../../../../utils/db';
import { generateToken } from '../../../../utils/jwt';

// Explicitly set runtime to Node.js to use jsonwebtoken
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Login API called');
    
    const { email, password } = await req.json();
    console.log('🔍 [DEBUG] Login attempt for email:', email);
    
    // Validate input
    if (!email || !password) {
      console.log('❌ [DEBUG] Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await db.findUserByEmail(email);
    console.log('🔍 [DEBUG] User found:', !!user);
    
    if (!user) {
      console.log('❌ [DEBUG] User not found');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('🔍 [DEBUG] Password match:', passwordMatch);
    
    if (!passwordMatch) {
      console.log('❌ [DEBUG] Password does not match');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const tokenPayload = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    
    console.log('🔍 [DEBUG] Generating token with payload:', tokenPayload);
    const token = generateToken(tokenPayload);
    
    // Create response and set cookie
    const response = NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });

    // Set cookie with token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });
    
    console.log('✅ [DEBUG] Login successful, token generated and cookie set');
    return response;
  } catch (error) {
    console.error('❌ [DEBUG] Login error:', error);
    
    // More detailed error handling
    if (error instanceof Error) {
      console.error('❌ [DEBUG] Error name:', error.name);
      console.error('❌ [DEBUG] Error message:', error.message);
      console.error('❌ [DEBUG] Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}