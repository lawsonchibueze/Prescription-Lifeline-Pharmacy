'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { ThemeToggle } from './theme-toggle';
import { CartIcon, MailIcon, PhoneIcon, SearchIcon, ShieldIcon, UserIcon } from './icons';

const NAV_LINKS = [
  { label: 'Prescription', slug: 'prescription' },
  { label: 'OTC', slug: 'over-the-counter' },
  { label: 'Vitamins', slug: 'vitamins-supplements' },
  { label: 'Personal Care', slug: 'personal-care' },
  { label: 'Cosmetics', slug: 'cosmetics' },
];

export function Header() {
  const { itemCount } = useCart();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-surface">
      <div className="hidden items-center justify-between gap-6 bg-brand-green px-10 py-2 text-xs font-medium text-white sm:flex">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 opacity-95">
            <PhoneIcon className="size-3.5" />
            +234 702 664 8102
          </span>
          <span className="flex items-center gap-1.5 opacity-95">
            <MailIcon className="size-3.5" />
            prescriptionlifelinepharmacy@gmail.com
          </span>
        </div>
        {/* Always sits on the yellow chip, so text stays literal ink-on-yellow in both themes. */}
        <span className="flex items-center gap-1.5 rounded-full bg-brand-yellow px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-black">
          <ShieldIcon className="size-3" />
          Licensed Nigerian Pharmacy
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-line px-4 py-3 sm:gap-8 sm:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image src="/logo.png" alt="Prescription Lifeline Pharmacy" width={44} height={44} className="rounded-full" />
          <span className="font-display text-base font-extrabold leading-tight text-ink">
            Prescription Lifeline
            <span className="block text-[11px] font-bold uppercase tracking-wide text-brand-green-dark dark:text-brand-green">
              Pharmacy
            </span>
          </span>
        </Link>

        <form action="/products" method="GET" className="relative order-3 w-full max-w-md sm:order-none sm:flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            name="q"
            placeholder="Search medicines, vitamins, supplies…"
            className="w-full rounded-lg border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-green"
          />
        </form>

        <nav className="hidden shrink-0 gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.slug}
              href={`/products?category=${link.slug}`}
              className="text-sm font-semibold text-ink-soft transition-colors hover:text-brand-green-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Link
            href="/account"
            className="flex size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-surface-hover"
            aria-label="Account"
          >
            <UserIcon className="size-5" />
          </Link>
          <Link
            href="/cart"
            className="relative flex size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-surface-hover"
          >
            <CartIcon className="size-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-[17px] items-center justify-center rounded-full bg-brand-yellow-dark text-[10px] font-extrabold text-brand-black">
                {itemCount}
              </span>
            )}
          </Link>
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="whitespace-nowrap rounded-lg border border-line px-4 py-2.5 text-sm font-bold text-ink-soft hover:bg-surface-hover"
            >
              Admin
            </Link>
          )}
          {user ? (
            <Link
              href="/account"
              className="whitespace-nowrap rounded-lg bg-brand-green-light px-4 py-2.5 text-sm font-bold text-brand-green-dark hover:bg-brand-green/20"
            >
              {user.name.split(' ')[0]}
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="whitespace-nowrap rounded-lg bg-brand-green px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
