import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { Card } from '@/components/ui';
import { catalogue, categoryBySlug, productBySlug, productsInCategory } from '@/lib/content';
import { site } from '@/lib/site';

type Params = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return catalogue.map((product) => ({
    category: product.categorySlug as string,
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.summary || site.description,
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductPage({ params }: Params) {
  const { category, slug } = await params;
  const product = productBySlug(slug);
  const parent = categoryBySlug(category);
  if (!product || !parent || product.categorySlug !== parent.slug) notFound();

  const related = productsInCategory(parent.slug)
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <section className="border-b border-ink-800/10">
        <div className="container-page py-10">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-ink-700/60">
            <Link className="hover:text-brand-600" href="/">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link className="hover:text-brand-600" href="/products">
              Products
            </Link>
            <span aria-hidden>/</span>
            <Link className="hover:text-brand-600" href={`/products/${parent.slug}`}>
              {parent.name}
            </Link>
          </nav>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-ink-800/5">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 560px, 90vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-ink-700/40">
                  Photo available on request
                </div>
              )}
            </div>
            {product.images.length > 1 ? (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image) => (
                  <div
                    key={image}
                    className="relative aspect-square overflow-hidden rounded-xl bg-ink-800/5"
                  >
                    <Image src={image} alt={product.title} fill sizes="120px" className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <p className="eyebrow">{parent.name}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              {product.title}
            </h1>
            {product.summary ? (
              <p className="mt-5 leading-relaxed text-ink-700/85">{product.summary}</p>
            ) : null}
            {product.description ? (
              <p className="mt-4 leading-relaxed text-ink-700/85">{product.description}</p>
            ) : null}

            <dl className="mt-8 grid gap-4 rounded-2xl bg-ink-900/[0.03] p-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-ink-900">Material</dt>
                <dd className="text-ink-700/80">Woven polypropylene (PP)</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink-900">Printing</dt>
                <dd className="text-ink-700/80">To your artwork, multi-colour</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink-900">Sizes</dt>
                <dd className="text-ink-700/80">Made to order</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink-900">Capacity</dt>
                <dd className="text-ink-700/80">500 million units a year</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="#enquiry" className="btn-primary">
                Enquire about this item
              </Link>
              <Link href={`/products/${parent.slug}`} className="btn-ghost">
                Back to {parent.name}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="enquiry" className="bg-ink-900/[0.03] py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow">Enquiry</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">
              Ask for a price on {product.title}
            </h2>
            <p className="mt-4 text-ink-700/80">
              Include the bag size, weight, print colours and monthly quantity. Enquiries reach{' '}
              {site.email} directly.
            </p>
          </div>
          <div className="rounded-3xl border border-ink-800/10 bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="container-page py-20">
          <h2 className="text-2xl font-bold text-ink-900">More {parent.name.toLowerCase()}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <Card
                key={item.slug}
                href={`/products/${parent.slug}/${item.slug}`}
                image={item.images[0] ?? null}
                title={item.title}
                ratio="aspect-square"
              />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
