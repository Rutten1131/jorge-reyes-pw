import { query } from './db';
import type { RowDataPacket } from 'mysql2';

export type BlogPost = {
  slug: string;
  metadata: {
    title?: string;
    date?: string;
    excerpt?: string;
    category?: string;
    image?: string;
    author?: string;
    status?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    ogImage?: string;
    [key: string]: unknown;
  };
  content: string;
};

interface PostRow extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  status: string;
  image_data: Buffer | null;
  image_mime: string | null;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image_data: Buffer | null;
  og_image_mime: string | null;
  created_at: Date;
  updated_at: Date;
}

function rowToPost(row: PostRow): BlogPost {
  return {
    slug: row.slug,
    metadata: {
      title: row.title,
      date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : undefined,
      excerpt: row.excerpt || undefined,
      category: row.category || 'Artículo',
      author: row.author || 'Jorge Reyes',
      status: row.status || 'draft',
      // Serve images via API endpoint instead of inline base64
      image: row.image_data ? `/api/media/post-image/${row.slug}` : '/images/og-jorge-reyes.webp',
      seoTitle: row.seo_title || undefined,
      seoDescription: row.seo_description || undefined,
      seoKeywords: row.seo_keywords || undefined,
      ogImage: row.og_image_data ? `/api/media/post-og/${row.slug}` : undefined,
    },
    content: row.content || '',
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await query<PostRow[]>(
      'SELECT * FROM blog_posts WHERE status = ? ORDER BY created_at DESC',
      ['published']
    );
    return rows.map(rowToPost);
  } catch (error) {
    console.error('Error fetching blog posts from DB:', error);
    return [];
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await query<PostRow[]>(
      'SELECT * FROM blog_posts ORDER BY created_at DESC'
    );
    return rows.map(rowToPost);
  } catch (error) {
    console.error('Error fetching all blog posts from DB:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const rows = await query<PostRow[]>(
      'SELECT * FROM blog_posts WHERE slug = ?',
      [slug]
    );
    if (rows.length === 0) return null;
    return rowToPost(rows[0]);
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}
