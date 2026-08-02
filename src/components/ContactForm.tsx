'use client';

import { useState } from 'react';

type Status = { kind: 'idle' | 'sending' | 'success' | 'error'; message?: string };

const inputClass =
  'w-full rounded-xl border border-ink-800/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10';

export default function ContactForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setErrors({});
    setStatus({ kind: 'sending' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, page: window.location.href }),
      });
      const body = await response.json().catch(() => ({}));

      if (response.ok && body.ok) {
        form.reset();
        setStatus({
          kind: 'success',
          message: 'Thank you — your enquiry has been sent. We usually reply within one business day.',
        });
        return;
      }

      setErrors(body.errors ?? {});
      setStatus({
        kind: 'error',
        message: body.error ?? 'The message could not be sent. Please email admin@huazeno.com.',
      });
    } catch {
      setStatus({
        kind: 'error',
        message: 'Network error. Please try again, or email admin@huazeno.com.',
      });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
        <Field label="Name *" name="name" error={errors.name}>
          <input name="name" autoComplete="name" className={inputClass} placeholder="Your name" />
        </Field>
        <Field label="Email *" name="email" error={errors.email}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="you@company.com"
          />
        </Field>
        <Field label="Phone / WhatsApp" name="phone" error={errors.phone}>
          <input name="phone" autoComplete="tel" className={inputClass} placeholder="Optional" />
        </Field>
        <Field label="Company" name="company" error={errors.company}>
          <input
            name="company"
            autoComplete="organization"
            className={inputClass}
            placeholder="Optional"
          />
        </Field>
      </div>

      <Field label="Enquiry *" name="message" error={errors.message}>
        <textarea
          name="message"
          rows={compact ? 3 : 5}
          className={inputClass}
          placeholder="Product, size, print colours, quantity, destination port …"
        />
      </Field>

      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Sending…' : 'Send enquiry'}
        </button>
        {status.message ? (
          <p
            role="status"
            aria-live="polite"
            className={`text-sm ${
              status.kind === 'success' ? 'text-green-700' : 'text-brand-700'
            }`}
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block" htmlFor={name}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink-700/70">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-brand-700">{error}</span> : null}
    </label>
  );
}
