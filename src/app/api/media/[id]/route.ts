import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/media/[id] - Serve media blob
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const rows = await query<RowDataPacket[]>(
      'SELECT data, mime_type FROM blog_media WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const media = rows[0];
    const buffer = media.data as Buffer;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': media.mime_type,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving media:', error);
    return NextResponse.json({ error: 'Failed to serve media' }, { status: 500 });
  }
}

// DELETE /api/media/[id] - Delete media
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const isAdmin = await verifySession(token);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await query('DELETE FROM blog_media WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
