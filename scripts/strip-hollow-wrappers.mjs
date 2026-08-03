#!/usr/bin/env node
/**
 * Remove hollow layout wrappers left behind when the Party-building (党建)
 * entries were cut out of the mirrored markup.
 *
 * The cut removed each entry's contents but kept its <li class="p_level1Item">
 * shell. Those shells still participate in layout: the header and footer navs
 * are flex rows whose items are `flex-grow:1`, so an empty column silently
 * steals width and collapses its neighbours (Home and Contact Us were both
 * rendering at 0px).
 *
 *   node scripts/strip-hollow-wrappers.mjs [--dry]
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'content/html';
const DRY = process.argv.includes('--dry');

// Wrapper classes that occupy a slot in a flex/grid/carousel track.
const WRAPPER_CLASS = /(?:p_level1Item|p_level2Item|p_loopitem|swiper-slide)/;

/** Find the end index of the element opened at `openStart`. */
function elementEnd(html, tag, openStart) {
  const open = new RegExp(`<${tag}\\b`, 'gi');
  const close = new RegExp(`</${tag}\\s*>`, 'gi');
  let depth = 0;
  let i = openStart;
  while (i < html.length) {
    open.lastIndex = i;
    close.lastIndex = i;
    const o = open.exec(html);
    const c = close.exec(html);
    if (!c) return -1;
    if (o && o.index < c.index) {
      depth += 1;
      i = o.index + 1;
    } else {
      depth -= 1;
      i = c.index + 1;
      if (depth === 0) return c.index + c[0].length;
    }
  }
  return -1;
}

/** A wrapper is hollow when it renders nothing: no text, no media, no inputs. */
function isHollow(inner) {
  if (/<(?:img|input|svg|iframe|video|canvas|source|picture)\b/i.test(inner)) return false;
  // a background-image counts as visible content
  if (/style="[^"]*background(?:-image)?\s*:[^"]*url\(/i.test(inner)) return false;
  const text = inner.replace(/<[^>]+>/g, '').replace(/&nbsp;|\s/g, '');
  return text.length === 0;
}

let files = 0;
let removed = 0;

for (const name of readdirSync(DIR).filter((f) => f.endsWith('.html'))) {
  const path = join(DIR, name);
  let html = readFileSync(path, 'utf8');
  let changed = 0;

  for (const tag of ['li', 'div']) {
    const opener = new RegExp(`<${tag}\\b[^>]*class="([^"]*)"[^>]*>`, 'gi');
    let match;
    // Re-scan from scratch after each removal so indices stay valid.
    // eslint-disable-next-line no-cond-assign
    while ((match = opener.exec(html))) {
      if (!WRAPPER_CLASS.test(match[1])) continue;
      const end = elementEnd(html, tag, match.index);
      if (end < 0) continue;
      const inner = html.slice(match.index + match[0].length, end).replace(/<\/[^>]+>$/, '');
      if (!isHollow(inner)) continue;
      html = html.slice(0, match.index) + html.slice(end);
      changed += 1;
      opener.lastIndex = 0; // indices shifted
    }
  }

  if (changed) {
    files += 1;
    removed += changed;
    if (!DRY) writeFileSync(path, html);
    console.log(`${changed}  ${name}`);
  }
}

console.log(`\n${DRY ? '[dry run] ' : ''}removed ${removed} hollow wrapper(s) from ${files} file(s)`);
