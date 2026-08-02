import type { Metadata } from 'next';
import { Card, PageHero } from '@/components/ui';
import { formatDate, news } from '@/lib/content';

export const metadata: Metadata = {
  title: 'News',
  description: 'Company news and industry updates from Hebei Huazeno Plastic Packaging Co., Ltd.',
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News"
        title="Company news"
        intro="Production milestones and updates from the plant."
        image={news.find((post) => post.image)?.image ?? null}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'News' }]}
      />
      <section className="container-page py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((post) => (
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
      </section>
    </>
  );
}
