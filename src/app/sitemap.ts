import type { MetadataRoute } from 'next';
import { catalogue, categories, news } from '@/lib/content';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/about',
    '/about/honours',
    '/about/culture',
    '/about/factory',
    '/about/network',
    '/products',
    '/news',
    '/exhibitions',
    '/contact',
  ];

  return [
    ...staticRoutes.map((path) => ({ url: `${site.url}${path}`, changeFrequency: 'monthly' as const })),
    ...categories.map((category) => ({ url: `${site.url}/products/${category.slug}` })),
    ...catalogue.map((product) => ({
      url: `${site.url}/products/${product.categorySlug}/${product.slug}`,
    })),
    ...news.map((post) => ({ url: `${site.url}/news/${post.slug}` })),
  ];
}
