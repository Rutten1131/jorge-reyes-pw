import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

interface Params {
  params: Promise<{ slug: string }>;
}

// GET /api/media/post-gallery/[slug] - Get all media for a post
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    // Get post ID
    const postRows = await query<RowDataPacket[]>(
      'SELECT id, image_mime FROM blog_posts WHERE slug = ?',
      [slug]
    );

    if (postRows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const postId = postRows[0].id;
    const hasFeatured = !!postRows[0].image_mime;

    // Get all media (without blob data, just metadata)
    let mediaRows: RowDataPacket[];
    let hasVideoUrlCol = true;
    try {
      mediaRows = await query<RowDataPacket[]>(
        'SELECT id, mime_type, filename, sort_order, video_url FROM blog_media WHERE post_id = ? ORDER BY sort_order ASC, id ASC',
        [postId]
      );
    } catch {
      hasVideoUrlCol = false;
      mediaRows = await query<RowDataPacket[]>(
        'SELECT id, mime_type, filename, sort_order FROM blog_media WHERE post_id = ? ORDER BY sort_order ASC, id ASC',
        [postId]
      );
    }

    const media = mediaRows.map((row) => ({
      id: row.id,
      url: `/api/media/${row.id}`,
      mimeType: row.mime_type,
      filename: row.filename,
      sortOrder: row.sort_order,
      isVideo: row.mime_type?.startsWith('video/') || (hasVideoUrlCol && !!row.video_url),
      isImage: row.mime_type?.startsWith('image/'),
      videoUrl: hasVideoUrlCol ? (row.video_url || null) : null,
    }));

    return NextResponse.json({ media, hasFeatured });
  } catch (error) {
    console.error('Error fetching post gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}
