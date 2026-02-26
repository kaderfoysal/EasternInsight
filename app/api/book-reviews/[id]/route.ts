import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import BookReview from '@/lib/models/BookReview';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const review = await BookReview.findById(params.id).lean();
    if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ review });
  } catch (error) {
    console.error('Error fetching book review:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { title, content, image, excerpt, authorName, published } = body;

    const review = await BookReview.findById(params.id);
    if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (title) review.title = title;
    if (content) review.content = content;
    if (image !== undefined) review.image = image;
    if (excerpt !== undefined) review.excerpt = excerpt;
    if (authorName !== undefined) review.authorName = authorName;
    if (published !== undefined) review.published = published;

    await review.save();
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error updating book review:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const review = await BookReview.findById(params.id);
    if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await BookReview.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting book review:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
