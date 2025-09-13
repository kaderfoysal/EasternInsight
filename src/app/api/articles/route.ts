// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/utils/db';
import { jwtVerify, JWTPayload } from 'jose';
import { TextEncoder } from 'util';
import { extractTokenFromHeader } from '@/utils/jwt-edge';

export const runtime = 'nodejs';

interface ArticleCreateBody {
  title: string;
  content: string;
  summary?: string;
  categoryId: string;
  featuredImage?: string;
  published?: boolean;
  featured?: boolean;
  latest?: boolean;
  latestFeatured?: boolean;
}

interface CustomJWTPayload extends JWTPayload {
  id: string;
  role: string;
}

// ------------------ GET /api/articles ------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
    const skip = (page - 1) * limit;
    
    // Build filter object with proper typing
    const filter: { categoryId?: string } = {};
    if (category) filter.categoryId = category;
    
    // Fetch articles
    const articles = await db.getArticles(filter, limit, skip);
    const total = await db.countArticles(filter);
    
    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ [API] GET /articles error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// ------------------ POST /api/articles ------------------
export async function POST(req: NextRequest) {
  try {
    // Extract token
    const token = extractTokenFromHeader(req.headers.get('Authorization') || '');
    if (!token) return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    
    const secret = process.env.JWT_SECRET;
    if (!secret) return NextResponse.json({ error: 'JWT_SECRET is not defined' }, { status: 500 });
    
    // Verify token using jose (Edge-safe)
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);
    let payload: CustomJWTPayload;
    
    try {
      const verified = await jwtVerify(token, secretKey);
      payload = verified.payload as CustomJWTPayload;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Only allow certain roles to create articles
    if (!['WRITER', 'EDITOR', 'ADMIN'].includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse request body
    const body: ArticleCreateBody = await req.json();
    const { title, content, categoryId } = body;
    
    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: 'Title, content, and categoryId are required' }, { status: 400 });
    }
    
    // Create article
    const article = await db.createArticle({
      title: body.title,
      content: body.content,
      summary: body.summary || '',
      categoryId: body.categoryId,
      authorId: payload.id,
      featuredImage: body.featuredImage || '',
      published: body.published || false,
      featured: body.featured || false,
      latest: body.latest || false,
      latestFeatured: body.latestFeatured || false,
      comments: [],
    });
    
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('❌ [API] POST /articles error:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}