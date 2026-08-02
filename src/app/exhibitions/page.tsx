import Link from 'next/link';
import type { Metadata } from 'next';
import { Gallery, PageHero, SectionHeading } from '@/components/ui';
import { exhibition } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Exhibitions',
  description: 'Where to meet Huazeno Plastic Packaging in person.',
};

export default function ExhibitionsPage() {
  const [start, end] = exhibition.dates.split(',');

  return (
    <>
      <PageHero
        eyebrow="Exhibitions"
        title={exhibition.title}
        intro={
          start
            ? `${start}${end ? ` – ${end}` : ''}${exhibition.location ? ` · ${exhibition.location}` : ''}`
            : exhibition.location
        }
        image={exhibition.images[2] ?? exhibition.images[0] ?? null}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Exhibitions' }]}
      />

      <section className="container-page py-20">
        <SectionHeading
          eyebrow="Meet us"
          title="Come and see the bags in person"
          intro="Samples of every line are on the stand — flour bags, bran bags and fabric rolls. Book a slot and we will keep time free for you."
        />
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/contact" className="btn-primary">
            Book a meeting
          </Link>
          <Link href="/products" className="btn-ghost">
            See what we will bring
          </Link>
        </div>

        <div className="mt-14">
          <Gallery
            items={exhibition.images.slice(0, 9).map((image) => ({ image, caption: '' }))}
          />
        </div>
      </section>
    </>
  );
}
