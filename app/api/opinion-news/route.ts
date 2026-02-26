import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import News from '@/lib/models/News';
import Category from '@/lib/models/Category';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '4');

    // Find category with serial == 3 (মতামত)
    const opinionCategory = await Category.findOne({
      $or: [{ serial: 3 }, { slug: 'মতামত' }],
    }).lean();
    if (!opinionCategory) {
      return NextResponse.json({ news: [] });
    }

    const news = await News.find({
      published: true,
      category: opinionCategory._id,
    })
      .populate('category', 'name slug serial')
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    console.log('opinion-news api', {
      categoryId: opinionCategory._id.toString(),
      count: news.length,
      slugs: news.map((n: any) => n.slug),
    });

    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching opinion news:', error);
    return NextResponse.json({ error: 'Failed to fetch opinion news' }, { status: 500 });
  }
}
