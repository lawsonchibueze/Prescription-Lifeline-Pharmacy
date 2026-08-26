'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { formatNaira } from '@/lib/money';
import { QuantityStepper } from '@/components/quantity-stepper';
import { ArrowRightIcon, CapsuleIcon, CardIcon, CheckIcon, TrashIcon } from '@/components/icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
const DELIVERY_FEE_KOBO = 150_000; // ₦1,500 flat rate for the demo

const NIGERIAN_STATES = ['Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Enugu', 'Kaduna'];

type CheckoutStatus = 'idle' | 'submitting' | 'needs-account' | 'error' | 'success';

export default function CartPage() {
  const { items, subtotalKobo, updateQuantity, removeItem, clear } = useCart();
  const [status, setStatus] = useState<CheckoutStatus>('idle');
  const [form, setForm] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: NIGERIAN_STATES[0],
  });

  const hasItems = items.length > 0;
  const deliveryKobo = hasItems ? DELIVERY_FEE_KOBO : 0;
  const totalKobo = subtotalKobo + deliveryKobo;

  async function handleCheckout(event: FormEvent) {
    event.preventDefault();
    if (!hasItems) return;
    setStatus('submitting');

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      if (res.status === 401) {
        setStatus('needs-account');
        return;
      }
      if (!res.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
      clear();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-brand-green-light text-brand-green-dark">
          <CheckIcon className="size-6" />
        </div>
        <h1 className="font-display text-2xl font-extrabold">Order placed!</h1>
        <p className="mt-2 text-sm text-ink-soft">
          We&apos;ve received your order and a pharmacist will review it shortly.
        </p>
        <Link href="/products" className="mt-6 inline-block rounded-xl bg-brand-green px-6 py-3 text-sm font-bold text-white">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="px-6 pb-2 pt-8 sm:px-10">
        <h1 className="font-display text-2xl font-extrabold">Your Cart</h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          Review your items, then add shipping details to check out securely.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-7 px-6 py-7 sm:px-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="mb-3 text-sm font-bold">
              {items.length} item{items.length === 1 ? '' : 's'} in your cart
            </div>
            {hasItems ? (
              items.map((item) => (
                <div key={item.productId} className="grid grid-cols-[56px_1fr_auto_auto_auto] items-center gap-4 border-t border-line py-3.5 first:border-t-0 first:pt-0">
                  <Link href={`/products/${item.slug}`} className="flex size-14 items-center justify-center rounded-lg bg-brand-green-light">
                    <CapsuleIcon className="size-6 text-brand-green-dark" />
                  </Link>
                  <div className="min-w-0">
                    <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-bold hover:text-brand-green-dark">
                      {item.name}
                    </Link>
                    <div className="mt-1 text-xs text-ink-faint">{formatNaira(item.priceKobo)} each</div>
                  </div>
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    max={item.stock}
                    onChange={(q) => updateQuantity(item.productId, q)}
                  />
                  <div className="text-sm font-extrabold whitespace-nowrap">
                    {formatNaira(item.priceKobo * item.quantity)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="flex size-8 items-center justify-center rounded-lg text-ink-faint hover:bg-surface-hover hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-ink-faint">
                Your cart is empty —{' '}
                <Link href="/products" className="font-semibold text-brand-green-dark">
                  start shopping
                </Link>
                .
              </p>
            )}
          </div>

          <form onSubmit={handleCheckout} className="mt-5 rounded-2xl border border-line bg-surface p-5">
            <div className="mb-4 text-sm font-bold">Shipping Details</div>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label="Full Name">
                <input
                  required
                  value={form.shippingName}
                  onChange={(e) => setForm((f) => ({ ...f, shippingName: e.target.value }))}
                  placeholder="e.g. Adaeze Okafor"
                  className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-green"
                />
              </Field>
              <Field label="Phone Number">
                <input
                  required
                  value={form.shippingPhone}
                  onChange={(e) => setForm((f) => ({ ...f, shippingPhone: e.target.value }))}
                  placeholder="+234 8xx xxx xxxx"
                  className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-green"
                />
              </Field>
            </div>
            <div className="mt-3.5">
              <Field label="Delivery Address">
                <input
                  required
                  value={form.shippingAddress}
                  onChange={(e) => setForm((f) => ({ ...f, shippingAddress: e.target.value }))}
                  placeholder="Street address, house number"
                  className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-green"
                />
              </Field>
            </div>
            <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label="City">
                <input
                  required
                  value={form.shippingCity}
                  onChange={(e) => setForm((f) => ({ ...f, shippingCity: e.target.value }))}
                  placeholder="e.g. Ikeja"
                  className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-green"
                />
              </Field>
              <Field label="State">
                <select
                  value={form.shippingState}
                  onChange={(e) => setForm((f) => ({ ...f, shippingState: e.target.value }))}
                  className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-green"
                >
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>

            <button
              type="submit"
              disabled={!hasItems || status === 'submitting'}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green py-3.5 text-sm font-bold text-white hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:bg-ink-faint"
            >
              {status === 'submitting' ? 'Placing order…' : 'Pay with Flutterwave'}
              <ArrowRightIcon className="size-4" />
            </button>

            {status === 'needs-account' && (
              <p className="mt-3 rounded-lg bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Almost there!{' '}
                <Link href="/sign-in" className="font-bold underline">
                  Sign in
                </Link>{' '}
                or{' '}
                <Link href="/sign-up" className="font-bold underline">
                  create an account
                </Link>{' '}
                to complete checkout — your cart is saved in the meantime.
              </p>
            )}
            {status === 'error' && (
              <p className="mt-3 rounded-lg bg-red-50 px-3.5 py-2.5 text-xs leading-relaxed text-red-700 dark:bg-red-950 dark:text-red-300">
                Something went wrong reaching the server — make sure the API is running and try
                again.
              </p>
            )}
          </form>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-24">
          <div className="mb-4 text-sm font-bold">Order Summary</div>
          <Row label="Subtotal" value={formatNaira(subtotalKobo)} />
          <Row label="Delivery" value={formatNaira(deliveryKobo)} />
          <div className="mt-2 flex items-center justify-between border-t border-line pt-3.5 text-base font-extrabold">
            <span>Total</span>
            <span>{formatNaira(totalKobo)}</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-faint">
            <CardIcon className="size-3.5 text-brand-green-dark" />
            Payments secured &amp; encrypted
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm text-ink-soft">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
