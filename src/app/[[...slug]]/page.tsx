import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageBody, pageByRoute, routeSegments } from '@/lib/pages';

type Params = { params: Promise<{ slug?: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routeSegments();
}

function routeFrom(slug: string[] | undefined) {
  return `/${(slug ?? []).join('/')}`.replace(/\/+$/, '') || '/';
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = pageByRoute(routeFrom(slug));
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.description || undefined,
    keywords: entry.keywords || undefined,
    alternates: { canonical: entry.route },
  };
}

export default async function LegacyPage({ params }: Params) {
  const { slug } = await params;
  const entry = pageByRoute(routeFrom(slug));
  if (!entry) notFound();

  return (
    <>
      {entry.stylesheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="default" />
      ))}
      <div className="main" dangerouslySetInnerHTML={{ __html: pageBody(entry) }} />
    </>
  );
}
