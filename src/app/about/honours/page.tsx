import type { Metadata } from 'next';
import { Gallery, PageHero } from '@/components/ui';
import { honours } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Qualifications & Honours',
  description:
    'Licences, permits and awards held by Hebei Huazeno Plastic Packaging Co., Ltd.',
};

export default function HonoursPage() {
  return (
    <>
      <PageHero
        eyebrow="About Huazeno"
        title="Qualifications & Honours"
        intro="Operating licences, discharge permits and industry recognition."
        image={honours[0]?.image ?? null}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Qualifications & Honours' }]}
      />
      <section className="container-page py-20">
        <Gallery items={honours} />
        <p className="mt-10 text-sm text-ink-700/60">
          Certificate scans are issued in Chinese. Ask us for a translated copy of any document you
          need for import paperwork.
        </p>
      </section>
    </>
  );
}
