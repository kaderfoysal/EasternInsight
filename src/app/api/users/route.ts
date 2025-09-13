// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '../../../utils/db';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Explicitly set runtime to Node.js
export const runtime = 'nodejs';

// Define our custom JWT payload interface
interface CustomJwtPayload extends JwtPayload {
  role: string;
}

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ error: 'JWT_SECRET is not defined' }, { status: 500 });
    }
    
    let payload: CustomJwtPayload;
    try {
      payload = jwt.verify(token, jwtSecret) as CustomJwtPayload;
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    // Check if user has permission to view all users
    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const users = await db.getAllUsers();
    // Remove passwords before sending
    const usersWithoutPasswords = users.map(user => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    });
    
    console.log('✅ [DEBUG] Users fetched successfully:', usersWithoutPasswords.length);
    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    console.error('❌ [DEBUG] Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json().catch(() => null);
    if (!requestBody) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    
    const { name, email, password, role, image, bio } = requestBody;
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }
    
    const cleanedImage = image?.trim().replace(/`/g, '');
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }
    
    const newUser = await db.createUser({
      name,
      email,
      password,
      role: role || 'USER',
      image: cleanedImage,
      bio,
    });
    
    // Remove password from the response
    const { password: removedPassword, ...userWithoutPassword } = newUser;
    // Explicitly note that we're not using removedPassword
    void removedPassword;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: unknown) {
    console.error('❌ [DEBUG] Error creating user:', error);
    return NextResponse.json(
      {
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}