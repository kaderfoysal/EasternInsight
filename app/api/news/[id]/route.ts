import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import News from '@/lib/models/News';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Category from '@/lib/models/Category';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const news = await News.findById(params.id).lean();
    if (!news) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching news item:', error);
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
    const { title, subtitle, content, category, image, imageCaption, featured, published, slug, excerpt, priority, authorNameForOpinion } = body;

    const news = await News.findById(params.id);
    if (!news) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (session.user.role !== 'admin' && news.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) return NextResponse.json({ error: 'Category not found' }, { status: 400 });
      news.category = categoryDoc._id;
    }

    if (title) news.title = title;
    if (subtitle !== undefined) news.subtitle = subtitle;
    if (content) news.content = content;
    if (image !== undefined) news.image = image;
    if (imageCaption !== undefined) news.imageCaption = imageCaption;
    if (featured !== undefined) news.featured = featured;
    if (published !== undefined) news.published = published;
    if (priority !== undefined) news.priority = priority;
    if (authorNameForOpinion !== undefined) news.authorNameForOpinion = authorNameForOpinion?.trim() || undefined;
    if (slug) news.slug = slug;
    if (excerpt) news.excerpt = excerpt;

    await news.save();
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const news = await News.findById(params.id);
    if (!news) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (session.user.role !== 'admin' && news.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await News.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
