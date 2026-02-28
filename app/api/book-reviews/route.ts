import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import BookReview from '@/lib/models/BookReview';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const slug = searchParams.get('slug');
    const reviewer = searchParams.get('reviewer');

    if (slug) {
      const review = await BookReview.findOne({ slug, published: true }).lean();
      if (!review) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json({ reviews: [review] });
    }

    const skip = (page - 1) * limit;
    
    // For editor pages, include both published and unpublished reviews
    const query: any = reviewer ? {} : { published: true };
    
    if (reviewer) {
      query.reviewer = reviewer;
    }

    const reviews = await BookReview.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await BookReview.countDocuments(query);

    return NextResponse.json({
      reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching book reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch book reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { title, content, image, slug, excerpt, authorName, published } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const review = new BookReview({
      title,
      content,
      image,
      slug,
      excerpt,
      authorName,
      reviewer: session.user.id,
      published: published !== undefined ? published : true,
    });

    await review.save();
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating book review:', error);
    return NextResponse.json({ error: 'Failed to create book review' }, { status: 500 });
  }
}
