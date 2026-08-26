'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ArrowRightIcon } from '@/components/icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function SignInPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/sign-in/email`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        setError(body?.message ?? 'Invalid email or password.');
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
      <h1 className="font-display text-2xl font-extrabold">Sign In</h1>
      <p className="mt-1.5 text-sm text-ink-soft">Welcome back to Prescription Lifeline Pharmacy.</p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
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
          {submitting ? 'Signing in…' : 'Sign In'}
          <ArrowRightIcon className="size-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        New here?{' '}
        <Link href="/sign-up" className="font-semibold text-brand-green-dark">
          Create an account
        </Link>
      </p>
    </div>
  );
}
