import type { MetadataRoute } from 'next';
import { allPages } from '@/lib/pages';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return allPages
    .filter((page) => !page.route.startsWith('/search'))
    .map((page) => ({
      url: `${site.url}${page.route === '/' ? '' : page.route}`,
      changeFrequency: 'monthly' as const,
      priority: page.route === '/' ? 1 : 0.7,
    }));
}
