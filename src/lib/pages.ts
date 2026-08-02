import fs from 'node:fs';
import path from 'node:path';
import routes from '../../content/routes.json';

export type PageEntry = {
  route: string;
  key: string;
  source: string;
  title: string;
  description: string;
  keywords: string;
  stylesheets: string[];
};

const HTML_DIR = path.join(process.cwd(), 'content', 'html');

export const allPages = routes as PageEntry[];

export function pageByRoute(route: string): PageEntry | undefined {
  const normalised = route === '' ? '/' : route.replace(/\/+$/, '') || '/';
  return allPages.find((page) => page.route === normalised);
}

export function pageBody(entry: PageEntry): string {
  return fs.readFileSync(path.join(HTML_DIR, `${entry.key}.html`), 'utf8');
}

export function routeSegments(): { slug?: string[] }[] {
  return allPages.map((page) =>
    page.route === '/' ? { slug: [] } : { slug: page.route.slice(1).split('/') },
  );
}
