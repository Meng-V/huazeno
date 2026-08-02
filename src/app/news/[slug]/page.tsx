import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { formatDate, neighbouringPosts, news, postBySlug } from '@/lib/content';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return news.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: post.image ? { images: [post.image] } : undefined,
  };
}

export default async function NewsPost({ params }: Params) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const { previous, next } = neighbouringPosts(slug);

  return (
    <article className="container-page max-w-3xl py-16">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-ink-700/60">
        <Link className="hover:text-brand-600" href="/">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link className="hover:text-brand-600" href="/news">
          News
        </Link>
      </nav>

      <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-ink-900 sm:text-4xl">
        {post.title}
      </h1>
      {post.date ? (
        <p className="mt-4 text-sm text-ink-700/60">{formatDate(post.date)}</p>
      ) : null}

      {post.image ? (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl bg-ink-800/5">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 1024px) 768px, 90vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div
        className="prose-basic mt-10 text-base"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      <div className="mt-16 grid gap-4 border-t border-ink-800/10 pt-8 sm:grid-cols-2">
        {previous ? (
          <Link href={`/news/${previous.slug}`} className="group">
            <span className="text-xs uppercase tracking-[0.2em] text-ink-700/50">Previous</span>
            <p className="mt-2 font-semibold text-ink-900 group-hover:text-brand-600">
              {previous.title}
            </p>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/news/${next.slug}`} className="group sm:text-right">
            <span className="text-xs uppercase tracking-[0.2em] text-ink-700/50">Next</span>
            <p className="mt-2 font-semibold text-ink-900 group-hover:text-brand-600">
              {next.title}
            </p>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
