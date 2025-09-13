import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../utils/db';
import jwt from 'jsonwebtoken';

// GET /api/articles/[id] - Get a specific article
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const article = await db.getArticleById(params.id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[id] - Update an article
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    
    // Verify token and get user info
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const payload = jwt.verify(token, jwtSecret) as any;
    const userId = payload.id;
    const userRole = payload.role;
    
    // Get the article to check ownership
    const article = await db.getArticleById(params.id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // Check if user has permission to update this article
    if (article.authorId !== userId && userRole !== 'ADMIN' && userRole !== 'EDITOR') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }
    
    const { 
      title, 
      content, 
      summary, 
      categoryId, 
      featuredImage, 
      published,
      featured,
      latest,
      latestFeatured
    } = await request.json();
    
    // Update article with new fields
    const updatedArticle = await db.updateArticle(params.id, {
      title,
      content,
      summary,
      categoryId,
      featuredImage,
      published,
      featured,
      latest,
      latestFeatured
    });
    
    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id] - Delete an article
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    
    // Verify token and get user info
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const payload = jwt.verify(token, jwtSecret) as any;
    const userId = payload.id;
    const userRole = payload.role;
    
    // Get the article to check ownership
    const article = await db.getArticleById(params.id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // Check if user has permission to delete this article
    if (article.authorId !== userId && userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }
    
    // Delete article
    await db.deleteArticle(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}