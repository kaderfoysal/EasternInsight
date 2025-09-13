// /api/articles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../utils/db';

// Define a custom interface for our request with user property
interface CustomNextRequest extends NextRequest {
  user?: {
    id: string;
    role: string;
  };
}

// GET /api/articles/[id] - Get a specific article
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to get the id
    const { id } = await context.params;
    
    const article = await db.getArticleById(id);
    
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
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to get the id
    const { id } = await context.params;
    
    // Get user from request (added by middleware)
    const user = (request as CustomNextRequest).user;
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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
    
    // Update article
    const updatedArticle = await db.updateArticle(id, {
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
    
    if (!updatedArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id] - Delete an article
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to get the id
    const { id } = await context.params;
    
    // Get user from request (added by middleware)
    const user = (request as CustomNextRequest).user;
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Delete article
    const success = await db.deleteArticle(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}