import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Card, PageHero } from '@/components/ui';
import { categories, categoryBySlug, productsInCategory } from '@/lib/content';

type Params = { params: Promise<{ category: string }> };

const blurbs: Record<string, string> = {
  'flour-bags':
    'Food-grade woven polypropylene sacks for flour mills — laminated or plain, printed to your artwork, stitched to your filling line.',
  'bran-bags':
    'Hard-wearing sacks for bran, feed and other bulk agricultural goods, built to survive repeated handling.',
  'fabric-rolls':
    'Circular-loom woven fabric supplied on rolls, in the width, mesh and weight your converting line needs.',
};

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const found = categoryBySlug(category);
  if (!found) return {};
  return { title: found.name, description: blurbs[found.slug] };
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const found = categoryBySlug(category);
  if (!found) notFound();

  const items = productsInCategory(found.slug);

  return (
    <>
      <PageHero
        eyebrow="Our product"
        title={found.name}
        intro={blurbs[found.slug]}
        image={found.image}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: found.name },
        ]}
      />
      <section className="container-page py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => (
            <Card
              key={product.slug}
              href={`/products/${found.slug}/${product.slug}`}
              image={product.images[0] ?? null}
              title={product.title}
              body={product.summary}
              ratio="aspect-square"
            />
          ))}
        </div>
      </section>
    </>
  );
}
