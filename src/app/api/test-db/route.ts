import { NextResponse } from 'next/server';
import db from '../../../utils/db';

export async function GET() {
  try {
    const users = await db.getAllUsers();
    const userCount = users.length;
    
    return NextResponse.json({ 
      status: 'Database connection successful', 
      userCount 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      status: 'Database operation failed', 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}