import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero, SectionHeading } from '@/components/ui';
import { about, factory } from '@/lib/content';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Company Profile',
  description: about.paragraphs[0] ?? site.description,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Huazeno"
        title={about.title}
        intro={about.tagline}
        image={about.images[0] ?? factory[0]?.image ?? null}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Company Profile' }]}
      />

      <section className="container-page py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <div className="prose-basic">
            <SectionHeading eyebrow="Who we are" title="Woven packaging at industrial scale" />
            <div className="mt-8">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary">
                See the product range
              </Link>
              <Link href="/about/honours" className="btn-ghost">
                Qualifications &amp; honours
              </Link>
            </div>
          </div>

          <aside className="space-y-6">
            {factory.slice(0, 2).map((item) => (
              <div key={item.image} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={item.image}
                  alt={item.caption || 'Huazeno factory'}
                  fill
                  sizes="(min-width: 1024px) 380px, 90vw"
                  className="object-cover"
                />
              </div>
            ))}
            <div className="rounded-2xl bg-ink-900 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.2em] text-brand-300">At a glance</p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                <li>Founded {site.founded}, registered capital RMB 50 million</li>
                <li>240-mu site, 110,000 m² of built floor area</li>
                <li>700+ staff, 60 degree-holding managers and technicians</li>
                <li>1,300 sets of plastic-weaving equipment</li>
                <li>500 million woven units produced and sold each year</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
