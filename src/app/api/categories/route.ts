import { NextRequest, NextResponse } from 'next/server';
import db from '../../../utils/db';

// Define a custom interface for our request with user property
interface CustomNextRequest extends NextRequest {
  user?: {
    id: string;
    role: string;
  };
}

// GET /api/categories - Get all categories (open)
export async function GET() {
  try {
    const categories = await db.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category (admin only)
export async function POST(request: CustomNextRequest) {
  try {
    // Now we can access the user property without any TypeScript directives
    const user = request.user;
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Only admins can create categories' },
        { status: 403 }
      );
    }
    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    const existingCategory = await db.findCategoryByName(name);
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      );
    }
    const category = await db.createCategory({
      name,
      description: description || ''
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}