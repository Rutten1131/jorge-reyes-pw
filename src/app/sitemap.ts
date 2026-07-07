import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.jorgereyesjaramillo.com';
  const posts = await getBlogPosts();
  
  const publishedPosts = posts.filter(post => post.metadata.status === 'published');

  const blogUrls = publishedPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.date ? new Date(post.metadata.date) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: post.metadata.category === 'Artículo' ? 0.7 : 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/plan-2026`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre-jorge`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogUrls,
  ];
}