import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import { Card, CalloutStrip, Gallery, SectionHeading } from '@/components/ui';
import { about, categories, home, news } from '@/lib/content';
import { formatDate } from '@/lib/content';
import { site } from '@/lib/site';

const stats = [
  { value: '2002', label: 'Founded' },
  { value: '110,000 m²', label: 'Built floor area' },
  { value: '700+', label: 'Employees' },
  { value: '1,300', label: 'Weaving machines' },
];

export default function HomePage() {
  const hero = home.slides[0]?.image ?? null;
  const latest = news.slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink-900 text-white">
        {hero ? (
          <Image
            src={hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
          />
        ) : null}
        <div className="container-page py-24 sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-300">
            Since {site.founded} · Daming County, Hebei
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            {site.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Flour bags, bran bags and woven fabric rolls produced on 1,300 looms — 500 million
            woven units a year for mills, feed plants and packers.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/products" className="btn-primary">
              Browse products
            </Link>
            <Link
              href="/contact"
              className="btn border border-white/25 text-white hover:border-white hover:bg-white/10"
            >
              Request a quote
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-ink-800/10 bg-white">
        <div className="container-page grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-ink-900 sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-ink-700/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading
          eyebrow="Our product"
          title="Woven polypropylene packaging, made to your spec"
          intro="Three core lines, printed to your artwork in the sizes and weights your filling line needs."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category.slug}
              href={`/products/${category.slug}`}
              image={category.image}
              title={category.name}
              meta={`${category.count} items`}
              body={
                category.slug === 'flour-bags'
                  ? 'Food-grade woven bags for flour mills, printed and stitched to order.'
                  : category.slug === 'bran-bags'
                    ? 'Hard-wearing sacks for bran, feed and other bulk agricultural products.'
                    : 'Circular-loom woven fabric supplied on rolls for converters.'
              }
            />
          ))}
        </div>
      </section>

      <section className="bg-ink-900/[0.03] py-20">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="About Huazeno"
                title={about.tagline}
                intro={about.paragraphs[0]}
              />
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/about" className="btn-primary">
                  Company profile
                </Link>
                <Link href="/about/factory" className="btn-ghost">
                  Factory tour
                </Link>
              </div>
            </div>
            {about.images[0] ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image
                  src={about.images[0]}
                  alt={about.title}
                  fill
                  sizes="(min-width: 1024px) 560px, 90vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {home.showcase.length ? (
        <section className="container-page py-20">
          <SectionHeading
            eyebrow="Inside the plant"
            title="Circular looms, fabric rolls, finished sacks"
            intro="A look at the workshops the orders run through."
          />
          <div className="mt-12">
            <Gallery
              items={home.showcase.slice(0, 6).map((item) => ({
                image: item.image,
                caption: item.caption,
              }))}
            />
          </div>
        </section>
      ) : null}

      {latest.length ? (
        <section className="bg-ink-900/[0.03] py-20">
          <div className="container-page">
            <SectionHeading eyebrow="News" title="More news from Huazeno" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((post) => (
                <Card
                  key={post.slug}
                  href={`/news/${post.slug}`}
                  image={post.image}
                  title={post.title}
                  body={post.summary}
                  meta={formatDate(post.date)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CalloutStrip>
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Tell us what you need packed.</h2>
          <p className="mt-2 text-white/80">
            Send sizes, print colours and quantities — we will come back with a quotation.
          </p>
        </div>
        <Link
          href="/contact"
          className="btn bg-white text-brand-700 hover:bg-brand-50"
        >
          Contact us
        </Link>
      </CalloutStrip>

      <section className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Get in touch" title="Send us a message" />
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-ink-900">Email</dt>
                <dd>
                  <a className="text-brand-600" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink-900">Phone</dt>
                <dd className="text-ink-700/80">{site.phones.join(' / ')}</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink-900">Address</dt>
                <dd className="text-ink-700/80">{site.address}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-3xl border border-ink-800/10 bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
