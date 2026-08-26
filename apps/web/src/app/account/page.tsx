'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { formatNaira } from '@/lib/money';
import { CapsuleIcon } from '@/components/icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface OrderItem {
  id: string;
  quantity: number;
  unitPriceKobo: number;
  product: { name: string; slug: string };
}

interface Order {
  id: string;
  status: string;
  totalKobo: number;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  PAID: 'bg-brand-green-light text-brand-green-dark',
  PROCESSING: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  SHIPPED: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  DELIVERED: 'bg-brand-green-light text-brand-green-dark',
  CANCELLED: 'bg-surface-hover text-ink-faint',
  REFUNDED: 'bg-surface-hover text-ink-faint',
};

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/orders`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Order[]) => setOrders(data))
      .catch(() => setOrders([]));
  }, [user]);

  if (loading) {
    return <div className="px-6 py-16 text-center text-sm text-ink-faint sm:px-10">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-extrabold">Sign in to view your account</h1>
        <p className="mt-2 text-sm text-ink-soft">Track your orders and manage your details.</p>
        <Link href="/sign-in" className="mt-6 inline-block rounded-xl bg-brand-green px-6 py-3 text-sm font-bold text-white">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 sm:px-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold">My Account</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {user.name} · {user.email}
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            router.push('/');
          }}
          className="rounded-lg border border-line px-4 py-2 text-sm font-bold hover:bg-surface-hover"
        >
          Sign Out
        </button>
      </div>

      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink-faint">Order History</h2>

      {orders === null ? (
        <p className="text-sm text-ink-faint">Loading your orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-ink-faint">
          No orders yet —{' '}
          <Link href="/products" className="font-semibold text-brand-green-dark">
            start shopping
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-md"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold">Order #{order.id.slice(-8).toUpperCase()}</div>
                  <div className="text-xs text-ink-faint">
                    {new Date(order.createdAt).toLocaleDateString('en-NG', {
                      dateStyle: 'medium',
                    })}
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[order.status] ?? 'bg-surface-hover text-ink-faint'}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex flex-col gap-2 border-t border-line pt-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <CapsuleIcon className="size-4 shrink-0 text-brand-green-dark" />
                    <span className="flex-1 text-ink-soft">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">{formatNaira(item.unitPriceKobo * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm font-extrabold">
                <span>Total</span>
                <span>{formatNaira(order.totalKobo)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
