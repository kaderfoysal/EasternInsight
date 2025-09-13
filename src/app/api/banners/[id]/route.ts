// /api/banners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../utils/db';

// Define a custom interface for our request with user property
interface CustomNextRequest extends NextRequest {
  user?: {
    id: string;
    role: string;
  };
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Await the params to get the id
  const { id } = await context.params;
  
  const banner = await db.getBannerById(id);
  if (!banner) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
  return NextResponse.json(banner);
}

export async function PUT(request: CustomNextRequest, context: { params: Promise<{ id: string }> }) {
  // Await the params to get the id
  const { id } = await context.params;
  
  const user = request.user;
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  
  const banner = await db.getBannerById(id);
  if (!banner) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
  
  const data = await request.json();
  const updatedBanner = await db.updateBanner(id, data);
  return NextResponse.json(updatedBanner);
}

export async function DELETE(request: CustomNextRequest, context: { params: Promise<{ id: string }> }) {
  // Await the params to get the id
  const { id } = await context.params;
  
  const user = request.user;
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  
  const banner = await db.getBannerById(id);
  if (!banner) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
  
  await db.deleteBanner(id);
  return NextResponse.json({ success: true });
}