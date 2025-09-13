import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../../utils/db';

// GET /api/categories/by-name/[name] - Get a specific category by name
export async function GET(request: NextRequest, context: { params: Promise<{ name: string }> }) {
  try {
    // Await the params to get the name
    const { name } = await context.params;
    
    const categoryName = name;
    const category = await db.findCategoryByName(categoryName); // case-insensitive if DB supports
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Create a proper filter object with categoryId
    const articleCount = await db.countArticles({ categoryId: category._id });
    
    return NextResponse.json({
      ...category,
      _count: { articles: articleCount }
    });
  } catch (error) {
    console.error('Error fetching category by name:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}