import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Opinion from '@/lib/models/Opinion';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const opinion = await Opinion.findById(params.id)
      .populate('author', 'name');
    
    if (!opinion) {
      return NextResponse.json(
        { error: 'Opinion not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ opinion });
  } catch (error) {
    console.error('Error fetching opinion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opinion' },
      { status: 500 }
    );
  }
}

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
    const { writerName, writerImage, title, subtitle, opinionImage, description, published } = body;

    const opinion = await Opinion.findById(params.id);
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

    // Update fields
    if (writerName) opinion.writerName = writerName;
    if (writerImage !== undefined) opinion.writerImage = writerImage;
    if (title) opinion.title = title;
    if (subtitle !== undefined) opinion.subtitle = subtitle;
    if (opinionImage !== undefined) opinion.opinionImage = opinionImage;
    if (description) opinion.description = description;
    if (published !== undefined) opinion.published = published;

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

    const opinion = await Opinion.findById(params.id);
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

    await Opinion.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Opinion deleted successfully' });
  } catch (error) {
    console.error('Error deleting opinion:', error);
    return NextResponse.json(
      { error: 'Failed to delete opinion' },
      { status: 500 }
    );
  }
}
