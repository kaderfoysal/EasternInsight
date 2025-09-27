import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import News from '@/lib/models/News';
import Category from '@/lib/models/Category';

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
    slug = `news-${Date.now()}`;
  }
  
  return slug;
}

// Helper function to generate excerpt from content
function generateExcerpt(content: string, maxLength = 300): string {
  try {
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    
    // If the text is longer than maxLength, truncate it and add ellipsis
    if (plainText.length > maxLength) {
      // Reserve 3 characters for the ellipsis
      return plainText.substring(0, maxLength - 3) + '...';
    } else {
      return plainText;
    }
  } catch (error) {
    console.error('Error generating excerpt:', error);
    return '';
  }
}

// GET a specific news article by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const news = await News.findById(params.id)
      .populate('category', 'name slug')  // Ensure slug is included
      .populate('author', 'name');        // Ensure name is included
    
    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// PUT to update a specific news article by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { title, content, category, image, featured, published, slug, excerpt } = body;

    // Find the news article
    const news = await News.findById(params.id);
    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or an admin
    if (session.user.role !== 'admin' && news.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own news articles' },
        { status: 403 }
      );
    }

    // Validate category if provided
    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        );
      }
    }

    // Update fields if provided
    if (title) news.title = title;
    if (content) news.content = content;
    if (category) news.category = category;
    if (image !== undefined) news.image = image;
    if (featured !== undefined) news.featured = featured;
    if (published !== undefined) news.published = published;
    
    // Generate new slug if title changed and slug not explicitly provided
    if (title && !slug) {
      news.slug = generateSlug(title);
    } else if (slug) {
      // Check if new slug is unique
      const existingNews = await News.findOne({ slug, _id: { $ne: params.id } });
      if (existingNews) {
        return NextResponse.json(
          { error: 'Slug already exists, please use a different slug' },
          { status: 400 }
        );
      }
      news.slug = slug;
    }
    
    // Generate excerpt if content changed and excerpt not explicitly provided
    if (content && !excerpt) {
      news.excerpt = generateExcerpt(content);
    } else if (excerpt) {
      news.excerpt = excerpt;
    }

    await news.save();

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

// DELETE a specific news article by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const news = await News.findById(params.id);
    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or an admin
    if (session.user.role !== 'admin' && news.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own news articles' },
        { status: 403 }
      );
    }

    await News.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}