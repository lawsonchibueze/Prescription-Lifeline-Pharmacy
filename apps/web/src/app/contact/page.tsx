import type { Metadata } from 'next';
import { ChatIcon, MailIcon, PhoneIcon, TruckIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Contact Us — Prescription Lifeline Pharmacy',
  description: 'Reach Prescription Lifeline Pharmacy by phone or email — we’re here to help.',
};

export default function ContactPage() {
  return (
    <div className="px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-extrabold">Get in touch</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
          Questions about an order, a medicine, or want to speak with a pharmacist? Reach us
          directly — we&apos;re happy to help.
        </p>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <a
            href="tel:+2347026648102"
            className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-md"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-light text-brand-green-dark">
              <PhoneIcon className="size-5" />
            </span>
            <div>
              <div className="text-sm font-bold">Call Us</div>
              <div className="mt-1 text-sm text-ink-soft">+234 702 664 8102</div>
            </div>
          </a>

          <a
            href="mailto:prescriptionlifelinepharmacy@gmail.com"
            className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-md"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-yellow-light text-[#8a7d10] dark:text-[#e8d874]">
              <MailIcon className="size-5" />
            </span>
            <div>
              <div className="text-sm font-bold">Email Us</div>
              <div className="mt-1 text-sm text-ink-soft">prescriptionlifelinepharmacy@gmail.com</div>
            </div>
          </a>

          <div className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-md">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-light text-brand-green-dark">
              <ChatIcon className="size-5" />
            </span>
            <div>
              <div className="text-sm font-bold">Telepharmacy</div>
              <p className="mt-1 text-sm text-ink-soft">
                Free consultation with a licensed pharmacist on every order.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-md">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-yellow-light text-[#8a7d10] dark:text-[#e8d874]">
              <TruckIcon className="size-5" />
            </span>
            <div>
              <div className="text-sm font-bold">Delivery Areas</div>
              <p className="mt-1 text-sm text-ink-soft">Same-day in Lagos, 24–72 hrs nationwide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
