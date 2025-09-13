import { NextRequest, NextResponse } from 'next/server';
import db from '../../../utils/db';
import { verifyToken, extractTokenFromHeader } from '../../../utils/jwt';

// Define a Writer type for clarity
interface WriterResponse {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  _count: {
    articles: number;
  };
}

// GET /api/writers - Get all writers (public)
export async function GET(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(request.headers.get('authorization') ?? undefined);
    
    // Verify the token if provided
    if (token) {
      const payload = verifyToken(token);
      if (!payload) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }
    
    // Get all users
    const allUsers = await db.getAllUsers();
    
    // Filter writers and editors, then fetch article counts
    const writers: WriterResponse[] = await Promise.all(
      allUsers
        .filter((user) => ['WRITER', 'EDITOR'].includes(user.role))
        .map(async (user) => {
          const articleCount = await db
            .getArticles({ authorId: user._id }) // Changed from user.id to user._id
            .then((articles) => articles.length);
            
          return {
            id: user._id, // Changed from user.id to user._id
            name: user.name ?? null,   // ✅ normalize undefined → null
            image: user.image ?? null, // ✅ normalize undefined → null
            bio: user.bio ?? null,     // ✅ normalize undefined → null
            _count: {
              articles: articleCount,
            },
          };
        })
    );
    
    // Sort alphabetically by name
    writers.sort((a, b) => {
      if (!a.name) return 1;
      if (!b.name) return -1;
      return a.name.localeCompare(b.name);
    });
    
    return NextResponse.json(writers);
  } catch (error) {
    console.error('Error fetching writers:', error);
    return NextResponse.json({ error: 'Failed to fetch writers' }, { status: 500 });
  }
}