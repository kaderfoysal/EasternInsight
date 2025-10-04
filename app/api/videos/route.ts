import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Video from '@/lib/models/Video';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    // If ID is provided, return single video
    if (id) {
      const video = await Video.findById(id).populate('author', 'name');
      
      if (!video) {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ video });
    }

    const query: any = { published: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const videos = await Video.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments(query);

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
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
    const { title, description, youtubeUrl, image, category, published } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      );
    }

    if (!youtubeUrl && !image) {
      return NextResponse.json(
        { error: 'Either YouTube URL or image is required' },
        { status: 400 }
      );
    }

    const newVideo = new Video({
      title,
      description: description || '',
      youtubeUrl: youtubeUrl || undefined,
      image: image || undefined,
      category: category || '',
      published: published !== undefined ? published : true,
      author: session.user.id,
    });

    await newVideo.save();

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
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
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, youtubeUrl, image, category, published } = body;

    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or an admin
    if (session.user.role !== 'admin' && video.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own videos' },
        { status: 403 }
      );
    }

    // Update fields if provided
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (youtubeUrl !== undefined) video.youtubeUrl = youtubeUrl;
    if (image !== undefined) video.image = image;
    if (category !== undefined) video.category = category;
    if (published !== undefined) video.published = published;

    await video.save();

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
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
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or an admin
    if (session.user.role !== 'admin' && video.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own videos' },
        { status: 403 }
      );
    }

    await Video.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
