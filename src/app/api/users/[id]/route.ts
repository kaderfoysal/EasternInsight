import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../utils/db';

// Define a custom interface for our request with user property
interface CustomNextRequest extends NextRequest {
  user?: {
    _id: string;
    role: string;
  };
}

// GET /api/users/[id] - Get a specific user
export async function GET(request: CustomNextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get user from request (added by middleware)
    const user = request.user;
    
    // Await the params to get the id
    const { id } = await params;
    
    // Check if user has permission to view this user
    if (!user || (user.role !== 'ADMIN' && user._id !== id)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const requestedUser = await db.findUserById(id);
    
    if (!requestedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = requestedUser;
    // Explicitly note that we're not using password
    void password;
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(request: CustomNextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get user from request (added by middleware)
    const user = request.user;
    
    // Await the params to get the id
    const { id } = await params;
    
    // Check if user has permission to update this user
    if (!user || (user.role !== 'ADMIN' && user._id !== id)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { name, email, role, image, bio } = await request.json();
    
    // Get the user to update
    const userToUpdate = await db.findUserById(id);
    
    if (!userToUpdate) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== userToUpdate.email) {
      const existingUser = await db.findUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update user
    const updatedUser = await db.updateUser(id, {
      name,
      email,
      role,
      image,
      bio
    });
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    // Explicitly note that we're not using password
    void password;
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(request: CustomNextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get user from request (added by middleware)
    const user = request.user;
    
    // Await the params to get the id
    const { id } = await params;
    
    // Check if user has permission to delete this user
    if (!user || (user.role !== 'ADMIN' && user._id !== id)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Get the user to delete
    const userToDelete = await db.findUserById(id);
    
    if (!userToDelete) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Delete user
    const success = await db.deleteUser(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}