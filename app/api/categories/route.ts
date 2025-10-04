// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import Category from '@/lib/models/Category';

// export async function GET(request: NextRequest) {
//   try {
//     await dbConnect();
//     const categories = await Category.find({}).sort({ name: 1 });
//     return NextResponse.json(categories);
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch categories' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();
//     const body = await request.json();
//     const { name, description } = body;

//     if (!name || name.trim() === '') {
//       return NextResponse.json(
//         { error: 'Category name is required' },
//         { status: 400 }
//       );
//     }

//     // Generate slug from name
//     const slug = name
//       .toLowerCase()
//       .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep letters, numbers, spaces, hyphens
//       .trim()
//       .replace(/\s+/g, '-') // Replace spaces with hyphens
//       .replace(/-+/g, '-'); // Remove consecutive hyphens

//     // Fallback if slug is empty
//     const finalSlug = slug || `category-${Date.now()}`;

//     // Create category with generated slug
//     const category = new Category({
//       name: name.trim(),
//       slug: finalSlug,
//       description: description ? description.trim() : undefined,
//     });

//     await category.save();
//     return NextResponse.json(category, { status: 201 });
//   } catch (error) {
//     console.error('Error creating category:', error);
    
//     // Handle duplicate key errors
//     if (error instanceof Error && (error as any).code === 11000) {
//       return NextResponse.json(
//         { error: 'Category with this name already exists' },
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: 'Failed to create category' },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';

// GET all categories ordered by serial
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ serial: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// Add this function at the top of the file
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// In the POST function, update the category creation part:
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, description, serial } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    if (!serial || serial < 1) {
      return NextResponse.json({ error: 'Serial number is required and must be >= 1' }, { status: 400 });
    }

    const slug = generateSlug(name) || `category-${Date.now()}`;

    const category = new Category({
      name: name.trim(),
      slug,
      description: description?.trim() || undefined,
      serial,
    });

    await category.save();
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Duplicate name or serial number' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// PUT update category
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { _id, name, description, serial } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    if (!serial || serial < 1) {
      return NextResponse.json({ error: 'Serial number is required and must be >= 1' }, { status: 400 });
    }

    const category = await Category.findByIdAndUpdate(
      _id,
      {
        name: name.trim(),
        description: description?.trim() || undefined,
        serial,
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Duplicate name or serial number' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const deleted = await Category.findByIdAndDelete(_id);
    if (!deleted) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
