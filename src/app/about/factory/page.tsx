import type { Metadata } from 'next';
import { Gallery, PageHero } from '@/components/ui';
import { factory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Factory Tour',
  description:
    'Circular looms, extrusion, printing and warehousing at the Huazeno plant in Daming County, Hebei.',
};

export default function FactoryPage() {
  return (
    <>
      <PageHero
        eyebrow="About Huazeno"
        title="Factory Tour"
        intro="110,000 m² of workshops, 1,300 sets of plastic-weaving equipment."
        image={factory[0]?.image ?? null}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Factory Tour' }]}
      />
      <section className="container-page py-20">
        <Gallery items={factory} />
      </section>
    </>
  );
}
