// /api/banners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../utils/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const banner = await db.getBannerById(params.id);
  if (!banner) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
  return NextResponse.json(banner);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = (request as any).user;
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const banner = await db.getBannerById(params.id);
  if (!banner) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });

  const data = await request.json();
  const updatedBanner = await db.updateBanner(params.id, data);
  return NextResponse.json(updatedBanner);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = (request as any).user;
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const banner = await db.getBannerById(params.id);
  if (!banner) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });

  await db.deleteBanner(params.id);
  return NextResponse.json({ success: true });
}
