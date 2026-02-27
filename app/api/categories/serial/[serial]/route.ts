import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';

export async function GET(
  request: NextRequest,
  { params }: { params: { serial: string } }
) {
  try {
    await dbConnect();
    
    // Try to parse as number first, if fails treat as string
    let serialValue;
    try {
      serialValue = parseInt(params.serial);
      if (isNaN(serialValue)) {
        serialValue = params.serial;
      }
    } catch {
      serialValue = params.serial;
    }
    
    console.log('Looking up category by serial:', serialValue);
    
    const category = await Category.findOne({ serial: serialValue });
    
    if (!category) {
      console.log('Category not found for serial:', serialValue);
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    console.log('Found category:', category.name, 'with serial:', category.serial);
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category by serial:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}
