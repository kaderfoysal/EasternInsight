// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../utils/db';
import { generateToken } from '../../../../utils/jwt';

// Explicitly set runtime to Node.js
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Register API called');
    
    const { name, email, password } = await req.json();
    console.log('🔍 [DEBUG] Registration attempt for email:', email);
    
    // Validate input
    if (!name || !email || !password) {
      console.log('❌ [DEBUG] Missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      console.log('❌ [DEBUG] User with this email already exists');
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create new user
    console.log('🔍 [DEBUG] Creating new user');
    const newUser = await db.createUser({
      name,
      email,
      password, // Password will be hashed in createUser
      role: 'USER' // Default role
    });
    
    console.log('✅ [DEBUG] User created successfully');
    
    // Generate JWT token
    const tokenPayload = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    };
    
    const token = generateToken(tokenPayload);
    
    // Create response and set cookie
    const response = NextResponse.json({
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
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
    
    console.log('✅ [DEBUG] Registration successful, token generated and cookie set');
    return response;
  } catch (error) {
    console.error('❌ [DEBUG] Registration error:', error);
    
    return NextResponse.json(
      { 
        error: 'Registration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}