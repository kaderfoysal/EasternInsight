import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../utils/db';

// Define a custom interface for our request with user property
interface CustomNextRequest extends NextRequest {
  user?: {
    id: string;
    role: string;
  };
}

// GET /api/categories/[id] - Get a specific category
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to get the id
    const { id } = await context.params;
    
    const category = await db.getCategoryById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Get articles for this category - pass filter, limit, and skip as separate parameters
    const articles = await db.getArticles(
      { categoryId: category._id }, // Filter
      10, // Limit
      0  // Skip
    );
    
    return NextResponse.json({
      ...category,
      articles,
      _count: {
        articles: await db.countArticles({ categoryId: category._id })
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(request: CustomNextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to get the id
    const { id } = await context.params;
    
    // Get user from request (added by middleware)
    const user = request.user;
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Only admins can update categories' },
        { status: 403 }
      );
    }
    
    const { name, description } = await request.json();
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    // Check if category exists
    const category = await db.getCategoryById(id);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check if new name already exists (if name is being changed)
    if (name !== category.name) {
      const existingCategory = await db.findCategoryByName(name);
      if (existingCategory) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update category
    const updatedCategory = await db.updateCategory(id, {
      name,
      description: description || ''
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(request: CustomNextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to get the id
    const { id } = await context.params;
    
    // Get user from request (added by middleware)
    const user = request.user;
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Only admins can delete categories' },
        { status: 403 }
      );
    }
    
    // Check if category exists
    const category = await db.getCategoryById(id);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check if category has articles
    const articleCount = await db.countArticles({ categoryId: category._id });
    if (articleCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with articles' },
        { status: 400 }
      );
    }
    
    // Delete category
    await db.deleteCategory(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}