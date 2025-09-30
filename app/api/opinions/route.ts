import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Opinion from '@/lib/models/Opinion';

// Helper function to generate slug from title
function generateSlug(title: string): string {
  let slug = title
    .toString()
    .trim()
    .toLowerCase();
  
  // Replace Bengali spaces with hyphens
  slug = slug.replace(/[\s\u0964\u0965]+/g, '-');
  
  // Remove special characters except hyphens, Bengali characters, and alphanumeric
  slug = slug.replace(/[^a-z0-9\u0980-\u09FF-]/g, '');
  
  // Replace multiple hyphens with a single hyphen
  slug = slug.replace(/-+/g, '-');
  
  // Remove leading and trailing hyphens
  slug = slug.replace(/^-|-$/g, '');
  
  // Fallback if slug is empty after processing
  if (!slug) {
    slug = `opinion-${Date.now()}`;
  }
  
  return slug;
}

// Helper function to generate excerpt from description
function generateExcerpt(description: string, maxLength = 300): string {
  try {
    const plainText = description.replace(/<[^>]*>/g, ''); // Remove HTML tags
    
    // If the text is longer than maxLength, truncate it and add ellipsis
    if (plainText.length > maxLength) {
      return plainText.substring(0, maxLength - 3) + '...';
    } else {
      return plainText;
    }
  } catch (error) {
    console.error('Error generating excerpt:', error);
    return '';
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Opinions API called');
    await dbConnect();
    console.log('DB connected');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');

    console.log('Query params:', { page, limit, search, slug });

    const query: any = { published: true };

    if (slug) {
      // If slug is provided, find by slug
      const opinion = await Opinion.findOne({ slug })
        .populate('author', 'name');
      
      if (!opinion) {
        return NextResponse.json(
          { error: 'Opinion not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ opinion });
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { writerName: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const opinions = await Opinion.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Opinion.countDocuments(query);

    console.log('Found opinions:', opinions.length, 'Total:', total);

    return NextResponse.json({
      opinions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching opinions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opinions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { writerName, writerImage, title, subtitle, opinionImage, description, published, slug, excerpt } = body;

    if (!writerName || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: writerName, title, description' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const opinionSlug = slug || generateSlug(title);

    // Check if slug is unique
    const existingOpinion = await Opinion.findOne({ slug: opinionSlug });
    if (existingOpinion) {
      return NextResponse.json(
        { error: 'Slug already exists, please use a different title' },
        { status: 400 }
      );
    }

    // Generate excerpt if not provided
    const opinionExcerpt = excerpt || generateExcerpt(description);

    const newOpinion = new Opinion({
      writerName,
      writerImage: writerImage || '',
      title,
      subtitle: subtitle || '',
      opinionImage: opinionImage || '',
      description,
      published: published || false,
      author: session.user.id,
      slug: opinionSlug,
      excerpt: opinionExcerpt,
    });

    await newOpinion.save();

    return NextResponse.json(newOpinion, { status: 201 });
  } catch (error) {
    console.error('Error creating opinion:', error);
    return NextResponse.json(
      { error: 'Failed to create opinion' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Opinion ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { writerName, writerImage, title, subtitle, opinionImage, description, published, slug, excerpt } = body;

    // Find the opinion
    const opinion = await Opinion.findById(id);
    if (!opinion) {
      return NextResponse.json(
        { error: 'Opinion not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or an admin
    if (session.user.role !== 'admin' && opinion.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own opinions' },
        { status: 403 }
      );
    }

    // Update fields if provided
    if (writerName) opinion.writerName = writerName;
    if (writerImage !== undefined) opinion.writerImage = writerImage;
    if (title) opinion.title = title;
    if (subtitle !== undefined) opinion.subtitle = subtitle;
    if (opinionImage !== undefined) opinion.opinionImage = opinionImage;
    if (description) opinion.description = description;
    if (published !== undefined) opinion.published = published;
    
    // Generate new slug if title changed and slug not explicitly provided
    if (title && !slug) {
      opinion.slug = generateSlug(title);
    } else if (slug) {
      // Check if new slug is unique
      const existingOpinion = await Opinion.findOne({ slug, _id: { $ne: id } });
      if (existingOpinion) {
        return NextResponse.json(
          { error: 'Slug already exists, please use a different slug' },
          { status: 400 }
        );
      }
      opinion.slug = slug;
    }
    
    // Generate excerpt if description changed and excerpt not explicitly provided
    if (description && !excerpt) {
      opinion.excerpt = generateExcerpt(description);
    } else if (excerpt) {
      opinion.excerpt = excerpt;
    }

    await opinion.save();

    return NextResponse.json(opinion);
  } catch (error) {
    console.error('Error updating opinion:', error);
    return NextResponse.json(
      { error: 'Failed to update opinion' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Opinion ID is required' },
        { status: 400 }
      );
    }

    const opinion = await Opinion.findById(id);
    if (!opinion) {
      return NextResponse.json(
        { error: 'Opinion not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or an admin
    if (session.user.role !== 'admin' && opinion.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own opinions' },
        { status: 403 }
      );
    }

    await Opinion.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Opinion deleted successfully' });
  } catch (error) {
    console.error('Error deleting opinion:', error);
    return NextResponse.json(
      { error: 'Failed to delete opinion' },
      { status: 500 }
    );
  }
}
