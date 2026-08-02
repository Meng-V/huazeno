import aboutJson from '@content/about.json';
import categoriesJson from '@content/categories.json';
import contactJson from '@content/contact.json';
import cultureJson from '@content/culture.json';
import exhibitionJson from '@content/exhibition.json';
import factoryJson from '@content/factory.json';
import homeJson from '@content/home.json';
import honoursJson from '@content/honours.json';
import newsJson from '@content/news.json';
import productsJson from '@content/products.json';

export type Product = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  categoryId: string | null;
  categorySlug: string | null;
  images: string[];
  description: string;
  certificate: boolean;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  count: number;
  image: string | null;
};

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string;
  image: string | null;
};

export type GalleryItem = { image: string; caption: string };

export const products = productsJson as Product[];
export const categories = categoriesJson as Category[];
export const news = newsJson as NewsPost[];
export const honours = honoursJson as GalleryItem[];
export const factory = factoryJson as GalleryItem[];
export const culture = cultureJson as { title: string; body: string; icon: string | null }[];
export const home = homeJson as {
  slides: { image: string; alt: string }[];
  stats: { value: string; unit: string; label: string }[];
  showcase: { caption: string; image: string; productId: string | null }[];
};
export const about = aboutJson as {
  title: string;
  tagline: string;
  paragraphs: string[];
  images: string[];
};
export const contact = contactJson as {
  email: string;
  phones: string[];
  address: string;
  qr: string | null;
};
export const exhibition = exhibitionJson as {
  title: string;
  dates: string;
  location: string;
  images: string[];
};

export const catalogue = products.filter((p) => p.categorySlug && !p.certificate);

export function categoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug) ?? null;
}

export function productsInCategory(slug: string) {
  return catalogue.filter((p) => p.categorySlug === slug);
}

export function productBySlug(slug: string) {
  return products.find((p) => p.slug === slug) ?? null;
}

export function postBySlug(slug: string) {
  return news.find((p) => p.slug === slug) ?? null;
}

export function neighbouringPosts(slug: string) {
  const index = news.findIndex((p) => p.slug === slug);
  return {
    previous: index > 0 ? news[index - 1] : null,
    next: index >= 0 && index < news.length - 1 ? news[index + 1] : null,
  };
}

/** Product photos are recycled as generic factory imagery where a page needs one. */
export function firstImage(product: Product) {
  return product.images[0] ?? null;
}

export function formatDate(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
