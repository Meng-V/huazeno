import type { Metadata } from 'next';
import LegacyRuntime from '@/components/LegacyRuntime';
import { site } from '@/lib/site';
import './legacy.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.legalName}|Flour Bags|Bran Bags manufacturer`,
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <LegacyRuntime />
      </body>
    </html>
  );
}
