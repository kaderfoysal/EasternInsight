// /api/banners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '../../../utils/db';

// Define a custom interface for our request with user property
interface CustomNextRequest extends NextRequest {
  user?: {
    id: string;
    role: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    // Create a proper filter object based on the active parameter
    const filter = active === 'true' ? { isActive: true } : {};
    
    const banners = await db.getBanners(filter);
    return NextResponse.json(banners);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: CustomNextRequest) {
  try {
    const user = request.user;
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    
    const { title, description, imageUrl, linkUrl, linkText, isActive, order } = await request.json();
    if (!title || !imageUrl) return NextResponse.json({ error: 'Title and image required' }, { status: 400 });
    
    const banner = await db.createBanner({ title, description, imageUrl, linkUrl, linkText, isActive, order });
    return NextResponse.json(banner, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}