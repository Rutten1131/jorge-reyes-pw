import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

// POST /api/media - Upload media for a post
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const isAdmin = await verifySession(token);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postId, slug, dataBase64, mimeType, filename, sortOrder, videoUrl } = body;

    if ((!postId && !slug) || (!dataBase64 && !videoUrl)) {
      return NextResponse.json(
        { error: 'postId/slug required, plus either dataBase64 or videoUrl' },
        { status: 400 }
      );
    }

    let finalPostId = postId;
    if (!finalPostId && slug) {
      const rows = await query<RowDataPacket[]>(
        'SELECT id FROM blog_posts WHERE slug = ?',
        [slug]
      );
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Post not found by slug' }, { status: 404 });
      }
      finalPostId = rows[0].id;
    }

    let result;
    if (videoUrl) {
      // Linked video (YouTube, Vimeo, etc.) — no blob data
      result = await query<RowDataPacket[]>(
        'INSERT INTO blog_media (post_id, mime_type, filename, video_url, sort_order) VALUES (?, ?, ?, ?, ?)',
        [finalPostId, 'video/external', filename || videoUrl, videoUrl, sortOrder || 0]
      );
    } else {
      const buffer = Buffer.from(dataBase64, 'base64');
      result = await query<RowDataPacket[]>(
        'INSERT INTO blog_media (post_id, data, mime_type, filename, sort_order) VALUES (?, ?, ?, ?, ?)',
        [finalPostId, buffer, mimeType, filename || 'file', sortOrder || 0]
      );
    }

    const insertResult = result as unknown as { insertId: number };

    return NextResponse.json({
      success: true,
      id: insertResult.insertId,
      url: `/api/media/${insertResult.insertId}`,
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    );
  }
}
