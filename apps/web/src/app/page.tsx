import Image from 'next/image';
import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/api';
import { CategoryTile } from '@/components/category-tile';
import { ProductCard } from '@/components/product-card';
import {
  ArrowRightIcon,
  CardIcon,
  ChatIcon,
  HeartPulseIcon,
  ShieldIcon,
  TruckIcon,
  UsersIcon,
} from '@/components/icons';

const SERVICES = [
  { label: 'Telepharmacy', icon: ChatIcon },
  { label: 'Health Counseling', icon: UsersIcon },
  { label: 'Health Check', icon: HeartPulseIcon },
  { label: 'Home Delivery', icon: TruckIcon },
];

// The marquee track is two identical halves back to back (see the
// .animate-marquee -50% keyframe) — each half repeats SERVICES a couple of
// times so the strip stays full-width instead of visibly running out.
const SERVICES_HALF = [...SERVICES, ...SERVICES];
const SERVICES_TRACK = [...SERVICES_HALF, ...SERVICES_HALF];

// Always render fresh — the catalog changes server-side and this is a demo
// storefront, not a marketing page that benefits from static caching.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getProducts({ limit: 8 }),
  ]);

  return (
    <>
      <section className="relative min-h-[540px] overflow-hidden bg-brand-green-light sm:min-h-[580px] lg:min-h-[620px]">
        <Image
          src="/images/hero/pharmacist-delivery.png"
          alt="A Prescription Lifeline pharmacist preparing a medicine delivery"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(253,253,251,0.98)_0%,rgba(253,253,251,0.94)_38%,rgba(253,253,251,0.42)_62%,rgba(253,253,251,0.04)_100%)] dark:bg-[linear-gradient(90deg,rgba(20,23,26,0.98)_0%,rgba(20,23,26,0.94)_38%,rgba(20,23,26,0.42)_62%,rgba(20,23,26,0.04)_100%)]" />
        <div className="relative flex min-h-[540px] items-center px-6 py-14 sm:min-h-[580px] sm:px-10 lg:min-h-[620px]">
          <div className="max-w-xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/95 px-3.5 py-1.5 text-xs font-bold text-brand-green-dark shadow-sm dark:text-brand-green">
              <ShieldIcon className="size-3.5" />
              Licensed pharmacists, real medicines
            </span>
            <h1 className="max-w-xl font-display text-4xl font-extrabold leading-[1.1] text-ink sm:text-5xl">
              Genuine medicines, delivered fast across Nigeria
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
              Order prescriptions, OTC medicines, vitamins and personal care from a licensed
              pharmacy team — with telepharmacy support whenever you need to speak to a pharmacist.
            </p>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-green-dark"
              >
                Shop Medicines <ArrowRightIcon className="size-4" />
              </Link>
              <a
                href="mailto:prescriptionlifelinepharmacy@gmail.com?subject=Prescription%20Upload"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-6 py-3.5 text-sm font-bold text-ink hover:bg-surface-hover"
              >
                Upload a Prescription
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-4 pt-12 sm:px-10">
        <div className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-green-dark dark:text-brand-green">
          Shop by category
        </div>
        <h2 className="font-display text-2xl font-extrabold">Everything your household needs</h2>
        {categories.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category, i) => (
              <CategoryTile
                key={category.id}
                slug={category.slug}
                name={category.name}
                tint={i % 2 === 0 ? 'green' : 'yellow'}
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-ink-faint">
            Categories will appear here once the API is reachable.
          </p>
        )}
      </section>

      <section className="px-6 py-8 sm:px-10">
        <div className="overflow-hidden rounded-2xl bg-brand-black py-7">
          <div className="animate-marquee flex w-max gap-16 px-8">
            {SERVICES_TRACK.map(({ label, icon: Icon }, i) => (
              <div key={i} className="flex shrink-0 items-center gap-3 text-white">
                <Icon className="size-6 shrink-0 text-brand-yellow" />
                <span className="whitespace-nowrap text-sm font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 sm:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-green-dark dark:text-brand-green">
              Popular right now
            </div>
            <h2 className="font-display text-2xl font-extrabold">Featured products</h2>
          </div>
          <Link
            href="/products"
            className="rounded-xl border border-line px-5 py-2.5 text-sm font-bold text-ink hover:bg-surface-hover"
          >
            View all
          </Link>
        </div>
        {featured.items.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.items.map((product, i) => (
              <ProductCard key={product.id} product={product} tint={i % 2 === 0 ? 'green' : 'yellow'} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-faint">
            No products yet — run <code>pnpm --filter api prisma:seed</code> and make sure the API
            is running.
          </p>
        )}
      </section>

      <section className="grid grid-cols-1 gap-6 bg-brand-black px-6 py-11 text-white sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
        <TrustItem icon={ShieldIcon} title="Licensed Pharmacy" body="Every order is checked by a registered pharmacist." />
        <TrustItem icon={TruckIcon} title="Fast Delivery" body="Same-day delivery in Lagos, nationwide in 24-72 hrs." />
        <TrustItem icon={CardIcon} title="Secure Payment" body="Pay safely by card, bank transfer or USSD." />
        <TrustItem icon={ChatIcon} title="Talk to a Pharmacist" body="Free telepharmacy counseling on every order." />
      </section>
    </>
  );
}

function TrustItem({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof ShieldIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <Icon className="mt-0.5 size-6 shrink-0 text-brand-yellow" />
      <div>
        <div className="text-sm font-bold">{title}</div>
        <div className="mt-1 text-xs leading-relaxed text-white/60">{body}</div>
      </div>
    </div>
  );
}
