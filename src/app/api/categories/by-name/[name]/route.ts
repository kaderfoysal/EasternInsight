import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../../utils/db';

// GET /api/categories/by-name/[name] - Get a specific category by name
export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    const categoryName = params.name;

    const category = await db.findCategoryByName(categoryName); // case-insensitive if DB supports
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const articleCount = await db.countArticles(category.name);

    return NextResponse.json({
      ...category,
      _count: { articles: articleCount }
    });
  } catch (error) {
    console.error('Error fetching category by name:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}