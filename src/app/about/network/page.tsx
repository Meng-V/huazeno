import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero, SectionHeading } from '@/components/ui';
import { about, factory } from '@/lib/content';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Sales Network',
  description:
    'Huazeno supplies flour mills, feed plants and packers across China and overseas markets.',
};

const reach = [
  {
    title: 'Domestic mills and feed plants',
    body: 'Direct supply to flour mills, bran and feed producers across northern and central China.',
  },
  {
    title: 'Export orders',
    body: 'Woven bags and fabric rolls shipped to overseas buyers, printed to their own artwork and language.',
  },
  {
    title: 'Converters and traders',
    body: 'Circular-loom fabric supplied on rolls to converters who cut, print and stitch in their own plants.',
  },
];

export default function NetworkPage() {
  return (
    <>
      <PageHero
        eyebrow="About Huazeno"
        title="Sales Network"
        intro="500 million woven units a year, delivered to mills, packers and converters."
        image={factory[6]?.image ?? null}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Sales Network' }]}
      />
      <section className="container-page py-20">
        <SectionHeading
          eyebrow="Where our bags go"
          title="One plant, three routes to market"
          intro={about.paragraphs[0]}
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {reach.map((item) => (
            <article key={item.title} className="rounded-2xl bg-ink-900/[0.03] p-8">
              <h2 className="text-lg font-semibold text-ink-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700/80">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 rounded-3xl border border-ink-800/10 p-8">
          <p className="text-lg font-semibold text-ink-900">
            Looking for a supplier in your market?
          </p>
          <p className="mt-2 max-w-2xl text-sm text-ink-700/80">
            Tell us the destination port, bag size and monthly volume and we will quote delivered
            prices. Enquiries in English go to {site.email}.
          </p>
          <Link href="/contact" className="btn-primary mt-6">
            Contact the sales team
          </Link>
        </div>
      </section>
    </>
  );
}
