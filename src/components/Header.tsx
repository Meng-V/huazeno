'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav, site } from '@/lib/site';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition ${
        scrolled ? 'border-ink-800/10 bg-white/95 backdrop-blur' : 'border-transparent bg-white'
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-2xl font-black tracking-tight text-ink-900">
            HUA<span className="text-brand-600">ZENO</span>
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink-700/60">
            Plastic Packaging
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive(item.href)
                    ? 'text-brand-600'
                    : 'text-ink-700 hover:bg-ink-800/5 hover:text-ink-900'
                }`}
              >
                {item.label}
              </Link>
              {item.children ? (
                <div className="invisible absolute left-1/2 top-full w-60 -translate-x-1/2 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <div className="overflow-hidden rounded-2xl border border-ink-800/10 bg-white p-2 shadow-xl shadow-ink-900/5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-xl px-4 py-2.5 text-sm text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${site.phones[0].replace(/-/g, '')}`}
            className="text-sm font-semibold text-ink-900"
          >
            {site.phones[0]}
          </a>
          <Link href="/contact" className="btn-primary !px-5 !py-2.5">
            Get a quote
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-800/15 lg:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 bg-ink-900 transition ${
                open ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-5 bg-ink-900 transition ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 bg-ink-900 transition ${
                open ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-ink-800/10 bg-white lg:hidden">
          <div className="container-page space-y-1 py-4">
            {nav.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-3 py-2.5 text-base font-semibold text-ink-900"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="ml-3 border-l border-ink-800/10 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-ink-700"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <Link href="/contact" className="btn-primary mt-3 w-full">
              Get a quote
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
