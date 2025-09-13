// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '../../../utils/db';   

// Explicitly set runtime to Node.js
export const runtime = 'nodejs';

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { error: 'JWT_SECRET is not defined' },
        { status: 500 }
      );
    }

    const payload = jwt.verify(token, jwtSecret) as any;
    
    // Check if user has permission to view all users
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const users = await db.getAllUsers();
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    console.log('✅ [DEBUG] Users fetched successfully:', usersWithoutPasswords.length);
    
    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    console.error('❌ [DEBUG] Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (e) {
      console.error('❌ [DEBUG] Error parsing request body:', e);
      return NextResponse.json(
        { error: 'Invalid request body - JSON parsing failed' },
        { status: 400 }
      );
    }
    
    const { name, email, password, role, image, bio } = requestBody;
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    console.log('🔍 [DEBUG] Creating user with data:', { name, email, role });
    
    // Clean up image URL if it contains backticks or extra spaces
    const cleanedImage = image ? image.replace(/`|\s+/g, '').trim() : undefined;
    
    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create user
    const newUser = await db.createUser({
      name,
      email,
      password,
      role: role || 'USER',
      image: cleanedImage,
      bio
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    console.log('✅ [DEBUG] User created successfully');
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (dbError: unknown) {
    console.error('❌ [DEBUG] Database operation failed:', dbError);
    return NextResponse.json(
      { error: 'Database operation failed', details: dbError instanceof Error ? dbError.message : String(dbError) },
      { status: 500 }
    );
  } catch (error: unknown) {
    console.error('❌ [DEBUG] Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}