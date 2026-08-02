import Image from 'next/image';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { PageHero } from '@/components/ui';
import { contact, factory } from '@/lib/content';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Contact Hebei Huazeno Plastic Packaging Co., Ltd. — ${site.email}`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the sales team"
        intro="Send your specification and we will come back with a quotation, usually within one business day."
        image={factory[1]?.image ?? null}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]}
      />

      <section className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-8">
            <div>
              <p className="eyebrow">Contact details</p>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="font-semibold text-ink-900">Email</dt>
                  <dd>
                    <a className="text-brand-600 hover:underline" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-900">Phone</dt>
                  <dd className="space-y-1 text-ink-700/80">
                    {contact.phones.map((phone) => (
                      <p key={phone}>
                        <a className="hover:text-brand-600" href={`tel:${phone.replace(/-/g, '')}`}>
                          {phone}
                        </a>
                      </p>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-900">Address</dt>
                  <dd className="text-ink-700/80">{site.address}</dd>
                </div>
              </dl>
            </div>

            {contact.qr ? (
              <div className="rounded-2xl border border-ink-800/10 p-6">
                <p className="text-sm font-semibold text-ink-900">WeChat</p>
                <Image
                  src={contact.qr}
                  alt="Huazeno WeChat QR code"
                  width={148}
                  height={148}
                  className="mt-4 rounded-xl"
                />
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-ink-800/10 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-ink-900">Send us a message</h2>
            <p className="mt-2 text-sm text-ink-700/70">
              Fields marked * are required. Your message goes straight to {site.email}.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
