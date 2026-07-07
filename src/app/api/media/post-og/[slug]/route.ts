import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

interface Params {
  params: Promise<{ slug: string }>;
}

// GET /api/media/post-og/[slug] - Serve post OG image
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    const rows = await query<RowDataPacket[]>(
      'SELECT og_image_data, og_image_mime FROM blog_posts WHERE slug = ?',
      [slug]
    );

    if (rows.length === 0 || !rows[0].og_image_data) {
      return NextResponse.json({ error: 'OG Image not found' }, { status: 404 });
    }

    const post = rows[0];
    const buffer = post.og_image_data as Buffer;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': post.og_image_mime || 'image/webp',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error serving OG image:', error);
    return NextResponse.json({ error: 'Failed to serve OG image' }, { status: 500 });
  }
}
