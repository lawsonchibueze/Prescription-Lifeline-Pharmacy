'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ArrowRightIcon } from '@/components/icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function SignUpPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/sign-up/email`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        setError(body?.message ?? 'Could not create that account.');
        return;
      }
      await refresh();
      router.push('/account');
    } catch {
      setError('Could not reach the server — is the API running?');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-extrabold">Create Account</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Sign up to check out faster and track your orders.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-soft">Full Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-brand-green"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-soft">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-brand-green"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-soft">Password</span>
          <input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-brand-green"
          />
        </label>

        {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-xs text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-brand-green py-3 text-sm font-bold text-white hover:bg-brand-green-dark disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create Account'}
          <ArrowRightIcon className="size-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-semibold text-brand-green-dark">
          Sign in
        </Link>
      </p>
    </div>
  );
}
