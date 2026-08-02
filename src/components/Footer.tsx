import Image from 'next/image';
import Link from 'next/link';
import { contact } from '@/lib/content';
import { nav, site } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink-900 text-white/80">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.2fr_repeat(2,1fr)_auto]">
        <div>
          <span className="text-2xl font-black tracking-tight text-white">
            HUA<span className="text-brand-400">ZENO</span>
          </span>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">{site.description}</p>
          <div className="mt-6 space-y-1 text-sm">
            <p className="text-white/60">{site.address}</p>
            {site.phones.map((phone) => (
              <p key={phone}>
                <a className="hover:text-white" href={`tel:${phone.replace(/-/g, '')}`}>
                  {phone}
                </a>
              </p>
            ))}
            <p>
              <a className="hover:text-white" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          </div>
        </div>

        {nav
          .filter((item) => item.children)
          .map((item) => (
            <div key={item.href}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                {item.label}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {item.children?.map((child) => (
                  <li key={child.href}>
                    <Link className="text-white/60 transition hover:text-white" href={child.href}>
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        {contact.qr ? (
          <div className="text-sm">
            <p className="font-semibold uppercase tracking-[0.18em] text-white">WeChat</p>
            <Image
              src={contact.qr}
              alt="Huazeno WeChat QR code"
              width={132}
              height={132}
              className="mt-4 rounded-xl bg-white p-2"
            />
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p>Flour bags · Bran bags · Woven fabric rolls · Since {site.founded}</p>
        </div>
      </div>
    </footer>
  );
}
