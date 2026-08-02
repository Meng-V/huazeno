import type { Metadata } from 'next';
import { Card, PageHero, SectionHeading } from '@/components/ui';
import { catalogue, categories } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Flour bags, bran bags and woven fabric rolls from Hebei Huazeno Plastic Packaging Co., Ltd.',
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our product"
        title="Products"
        intro="Woven polypropylene packaging produced on 1,300 looms, printed and stitched to your specification."
        image={categories[0]?.image ?? null}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
      />

      <section className="container-page py-20">
        <SectionHeading eyebrow="Categories" title="Three core lines" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category.slug}
              href={`/products/${category.slug}`}
              image={category.image}
              title={category.name}
              meta={`${category.count} items`}
            />
          ))}
        </div>
      </section>

      <section className="container-page pb-24">
        <SectionHeading eyebrow="Full catalogue" title="Every item we photograph" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {catalogue.map((product) => (
            <Card
              key={product.slug}
              href={`/products/${product.categorySlug}/${product.slug}`}
              image={product.images[0] ?? null}
              title={product.title}
              meta={categories.find((c) => c.slug === product.categorySlug)?.name}
              ratio="aspect-square"
            />
          ))}
        </div>
      </section>
    </>
  );
}
