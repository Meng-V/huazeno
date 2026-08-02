import Image from 'next/image';
import type { Metadata } from 'next';
import { PageHero } from '@/components/ui';
import { culture, factory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Corporate Culture',
  description: 'The values, mission and philosophy behind Huazeno Plastic Packaging.',
};

export default function CulturePage() {
  return (
    <>
      <PageHero
        eyebrow="About Huazeno"
        title="Corporate Culture"
        intro="Integrity at the core, customers first."
        image={factory[3]?.image ?? null}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Corporate Culture' }]}
      />
      <section className="container-page py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {culture.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-ink-800/10 bg-white p-8 transition hover:border-brand-200 hover:shadow-lg hover:shadow-ink-900/5"
            >
              {item.icon ? (
                <Image
                  src={item.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              ) : null}
              <h2 className="mt-5 text-lg font-semibold text-ink-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700/80">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
