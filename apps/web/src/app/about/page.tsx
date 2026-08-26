import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon, ChatIcon, HeartPulseIcon, ShieldIcon, TruckIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'About Us — Prescription Lifeline Pharmacy',
  description: 'A licensed Nigerian pharmacy bringing genuine medicines and pharmacist-led care online.',
};

const VALUES = [
  {
    icon: ShieldIcon,
    title: 'Licensed & Verified',
    body: 'Every order is reviewed by a registered pharmacist before it leaves our shelves — genuine medicines, no shortcuts.',
  },
  {
    icon: TruckIcon,
    title: 'Fast, Reliable Delivery',
    body: 'Same-day delivery across Lagos and 24–72 hour delivery nationwide, so your household never has to wait.',
  },
  {
    icon: ChatIcon,
    title: 'Telepharmacy, Always On',
    body: 'Talk to a pharmacist by phone or chat whenever you have a question about a medicine or a prescription.',
  },
  {
    icon: HeartPulseIcon,
    title: 'Whole-Family Care',
    body: 'From prescriptions to vitamins, personal care and health checks — one trusted pharmacy for everyone at home.',
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-brand-green-light px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-bold text-brand-green-dark">
            <ShieldIcon className="size-3.5" />
            Licensed Nigerian Pharmacy
          </span>
          <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Genuine medicines and trusted health care, delivered
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Prescription Lifeline Pharmacy exists to make it simple to get real medicines,
            pharmacist guidance and everyday health essentials — without the wait or the
            guesswork. Online pharmacy, telepharmacy and home delivery, from a team that takes
            your health as seriously as you do.
          </p>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-md"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-light text-brand-green-dark">
                <Icon className="size-6" />
              </span>
              <div>
                <div className="text-sm font-bold">{title}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-black px-6 py-14 text-center text-white sm:px-10">
        <h2 className="font-display text-2xl font-extrabold">Ready when you are</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/65">
          Browse the catalog or reach out to a pharmacist directly — we&apos;re here for whatever
          your household needs.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3.5">
          <Link href="/products" className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-6 py-3 text-sm font-bold text-white hover:bg-brand-green-dark">
            Shop Now <ArrowRightIcon className="size-4" />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/5">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
