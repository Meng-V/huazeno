import Link from 'next/link';

export default function NotFound() {
  return (
    <section
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '120px 20px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#333',
      }}
    >
      <p style={{ color: '#ef2123', letterSpacing: 2, margin: 0 }}>404</p>
      <h1 style={{ fontSize: 32, margin: '12px 0 16px' }}>Page not found</h1>
      <p style={{ lineHeight: 1.8, margin: 0 }}>
        That page has moved or never existed. Try the product range, or get in touch and we will
        point you to it.
      </p>
      <p style={{ marginTop: 32 }}>
        <Link href="/" style={{ color: '#ef2123', marginRight: 24 }}>
          Back home
        </Link>
        <Link href="/products" style={{ color: '#ef2123' }}>
          Products
        </Link>
      </p>
    </section>
  );
}
