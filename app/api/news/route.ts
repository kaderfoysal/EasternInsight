// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import News from '@/lib/models/News';
// import Category from '@/lib/models/Category';

// // Helper function to generate slug from title
// function generateSlug(title: string): string {
//   let slug = title
//     .toString()
//     .trim()
//     .toLowerCase();
  
//   // Replace Bengali spaces with hyphens
//   slug = slug.replace(/[\s\u0964\u0965]+/g, '-');
  
//   // Remove special characters except hyphens, Bengali characters, and alphanumeric
//   slug = slug.replace(/[^a-z0-9\u0980-\u09FF-]/g, '');
  
//   // Replace multiple hyphens with a single hyphen
//   slug = slug.replace(/-+/g, '-');
  
//   // Remove leading and trailing hyphens
//   slug = slug.replace(/^-|-$/g, '');
  
//   // Fallback if slug is empty after processing
//   if (!slug) {
//     slug = `news-${Date.now()}`;
//   }
  
//   return slug;
// }

// export async function GET(request: NextRequest) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const category = searchParams.get('category');
//     const search = searchParams.get('search');
//     const featured = searchParams.get('featured');

//     const query: any = { published: true };

//     if (category) {
//       // Check if category is an ID or slug
//       if (category.match(/^[0-9a-fA-F]{24}$/)) {
//         // It's an ID
//         query.category = category;
//       } else {
//         // It's a slug
//         const categoryDoc = await Category.findOne({ slug: category });
//         if (categoryDoc) {
//           query.category = categoryDoc._id;
//         }
//       }
//     }

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { content: { $regex: search, $options: 'i' } },
//       ];
//     }

//     if (featured === 'true') {
//       query.featured = true;
//     }

//     const skip = (page - 1) * limit;

//     const news = await News.find(query)
//       .populate('category', 'name slug')
//       .populate('author', 'name')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await News.countDocuments(query);

//     return NextResponse.json({
//       news,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching news:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch news' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || !['admin', 'editor'].includes(session.user.role)) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     await dbConnect();

//     const body = await request.json();
//     const { title, content, category, image, featured, published } = body;

//     if (!title || !content || !category) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     const categoryDoc = await Category.findById(category);
//     if (!categoryDoc) {
//       return NextResponse.json(
//         { error: 'Category not found' },
//         { status: 400 }
//       );
//     }

//     // Generate slug from title
//     const slug = generateSlug(title);

//     const newNews = new News({
//       title,
//       content,
//       category: categoryDoc._id,
//       image: image || '',
//       featured: featured || false,
//       published: published || false,
//       author: session.user.id,
//       slug, // Explicitly set the generated slug
//     });

//     await newNews.save();

//     return NextResponse.json(newNews, { status: 201 });
//   } catch (error) {
//     console.error('Error creating news:', error);
//     return NextResponse.json(
//       { error: 'Failed to create news' },
//       { status: 500 }
//     );
//   }
// }

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

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');

    const query: any = { published: true };

    if (slug) {
      // If slug is provided, find by slug
      const newsItem = await News.findOne({ slug })
        .populate('category', 'name slug')
        .populate('author', 'name');
      
      if (!newsItem) {
        return NextResponse.json(
          { error: 'News not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ news: newsItem });
    }

    if (category) {
      // Check if category is an ID or slug
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        // It's an ID
        query.category = category;
      } else {
        // It's a slug
        const categoryDoc = await Category.findOne({ slug: category });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        }
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const skip = (page - 1) * limit;

    const news = await News.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort({ priority: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments(query);

    return NextResponse.json({
      news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
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
    const { title, subtitle, content, category, image, imageCaption, featured, published, slug, excerpt, priority } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, category' },
        { status: 400 }
      );
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return NextResponse.json(
        { error: `Category with ID ${category} not found` },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const newsSlug = slug || generateSlug(title);

    // Check if slug is unique
    const existingNews = await News.findOne({ slug: newsSlug });
    if (existingNews) {
      return NextResponse.json(
        { error: 'Slug already exists, please use a different title' },
        { status: 400 }
      );
    }

    // Generate excerpt if not provided
    const newsExcerpt = excerpt || generateExcerpt(content);

    const newNews = new News({
      title,
      subtitle: subtitle || '',
      content,
      category: categoryDoc._id,
      image: image || '',
      imageCaption: imageCaption || '',
      featured: featured || false,
      published: published || false,
      author: session.user.id,
      slug: newsSlug,
      excerpt: newsExcerpt,
      priority: typeof priority === 'number' ? priority : undefined,
    });

    await newNews.save();

    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
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
        { error: 'News ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, subtitle, content, category, image, imageCaption, featured, published, slug, excerpt, priority } = body;

    // Find the news article
    const news = await News.findById(id);
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
    if (subtitle !== undefined) news.subtitle = subtitle;
    if (content) news.content = content;
    if (category) news.category = category;
    if (image !== undefined) news.image = image;
    if (imageCaption !== undefined) news.imageCaption = imageCaption;
    if (featured !== undefined) news.featured = featured;
    if (published !== undefined) news.published = published;
    if (priority !== undefined) news.priority = priority;
    
    // Generate new slug if title changed and slug not explicitly provided
    if (title && !slug) {
      news.slug = generateSlug(title);
    } else if (slug) {
      // Check if new slug is unique
      const existingNews = await News.findOne({ slug, _id: { $ne: id } });
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
        { error: 'News ID is required' },
        { status: 400 }
      );
    }

    const news = await News.findById(id);
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

    await News.findByIdAndDelete(id);

    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}