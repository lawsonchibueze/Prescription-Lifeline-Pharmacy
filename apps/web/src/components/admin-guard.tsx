'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/auth-context';

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="px-6 py-16 text-center text-sm text-ink-faint sm:px-10">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-extrabold">Admin sign-in required</h1>
        <p className="mt-2 text-sm text-ink-soft">Sign in with an admin account to continue.</p>
        <Link href="/sign-in" className="mt-6 inline-block rounded-xl bg-brand-green px-6 py-3 text-sm font-bold text-white">
          Sign In
        </Link>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-extrabold">Not authorized</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {user.email} doesn&apos;t have admin access on this account.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-xl border border-line px-6 py-3 text-sm font-bold hover:bg-surface-hover">
          Back to storefront
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
