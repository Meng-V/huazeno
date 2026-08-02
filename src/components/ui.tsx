import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{title}</h2>
      {intro ? <p className="mt-4 leading-relaxed text-ink-700/80">{intro}</p> : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  breadcrumb,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: string | null;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-white">
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35"
        />
      ) : null}
      <div className="container-page py-20 sm:py-24">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-300">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {intro ? <p className="mt-5 max-w-2xl text-white/70">{intro}</p> : null}
        {breadcrumb?.length ? (
          <nav className="mt-8 flex flex-wrap items-center gap-2 text-sm text-white/50">
            {breadcrumb.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden>/</span> : null}
                {crumb.href ? (
                  <Link className="transition hover:text-white" href={crumb.href}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/80">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
      </div>
    </section>
  );
}

export function Card({
  href,
  image,
  title,
  body,
  meta,
  ratio = 'aspect-[4/3]',
}: {
  href: string;
  image: string | null;
  title: string;
  body?: string;
  meta?: string;
  ratio?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-800/10 bg-white transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-ink-900/5"
    >
      <div className={`relative ${ratio} overflow-hidden bg-ink-800/5`}>
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-700/40">
            Photo on request
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {meta ? <p className="text-xs uppercase tracking-[0.18em] text-brand-600">{meta}</p> : null}
        <h3 className="mt-2 text-lg font-semibold text-ink-900 group-hover:text-brand-700">
          {title}
        </h3>
        {body ? <p className="mt-2 line-clamp-3 text-sm text-ink-700/75">{body}</p> : null}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
          Details
          <span aria-hidden className="transition group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export function Gallery({ items }: { items: { image: string; caption: string }[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <figure
          key={`${item.image}-${index}`}
          className="overflow-hidden rounded-2xl border border-ink-800/10 bg-white"
        >
          <div className="relative aspect-[4/3] bg-ink-800/5">
            <Image
              src={item.image}
              alt={item.caption || 'Huazeno'}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          {item.caption ? (
            <figcaption className="px-5 py-4 text-sm font-medium text-ink-700">
              {item.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

export function CalloutStrip({ children }: { children: ReactNode }) {
  return (
    <section className="bg-brand-600">
      <div className="container-page flex flex-col items-start justify-between gap-6 py-12 text-white sm:flex-row sm:items-center">
        {children}
      </div>
    </section>
  );
}
