import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-900">Page not found</h1>
      <p className="mt-4 max-w-md text-ink-700/80">
        That page has moved or never existed. Try the product range or get in touch and we will
        point you to it.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="btn-primary">
          Back home
        </Link>
        <Link href="/products" className="btn-ghost">
          Products
        </Link>
      </div>
    </section>
  );
}
