import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAIL_TO = process.env.MAIL_TO ?? 'admin@huazeno.com';
const MAIL_FROM = process.env.MAIL_FROM ?? process.env.SMTP_USER ?? MAIL_TO;

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: (process.env.SMTP_SECURE ?? 'true') === 'true',
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
});

function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
}

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

function clean(value: unknown, max: number) {
  return String(value ?? '').trim().slice(0, max);
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] as string,
  );
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many messages from this address. Please try again later.' },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields, humans do not.
  if (clean(payload.website, 100)) return NextResponse.json({ ok: true });

  const data = {
    name: clean(payload.name, 100),
    email: clean(payload.email, 200),
    phone: clean(payload.phone, 60),
    company: clean(payload.company, 150),
    message: clean(payload.message, 5000),
    page: clean(payload.page, 300),
  };

  const errors: Record<string, string> = {};
  if (!data.name) errors.name = 'Please enter your name.';
  if (!data.email) errors.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email))
    errors.email = 'That email address does not look valid.';
  if (data.message.length < 5) errors.message = 'Please tell us a little more.';

  if (Object.keys(errors).length) {
    return NextResponse.json(
      { ok: false, error: 'Please check the highlighted fields.', errors },
      { status: 422 },
    );
  }

  const rows: [string, string][] = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone || '—'],
    ['Company', data.company || '—'],
    ['Sent from', data.page || '—'],
    ['IP', ip],
  ];

  try {
    await transporter.sendMail({
      from: { name: 'Huazeno website', address: MAIL_FROM },
      to: MAIL_TO,
      replyTo: { name: data.name, address: data.email },
      subject: `Website enquiry from ${data.name}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMessage:\n${data.message}\n`,
      html:
        '<table cellpadding="6" style="border-collapse:collapse;font:14px/1.5 Arial,sans-serif">' +
        rows
          .map(
            ([key, value]) =>
              `<tr><td style="background:#f5f5f5;font-weight:bold">${escapeHtml(key)}</td><td>${escapeHtml(value)}</td></tr>`,
          )
          .join('') +
        '</table>' +
        `<p style="font:14px/1.6 Arial,sans-serif;white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] send failed:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'We could not send your message right now. Please email admin@huazeno.com directly.',
      },
      { status: 502 },
    );
  }
}
