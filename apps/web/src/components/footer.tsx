import Image from 'next/image';
import Link from 'next/link';
import { CheckIcon, MailIcon, PhoneIcon } from './icons';

const SHOP_LINKS = [
  { label: 'Prescription Medicines', slug: 'prescription' },
  { label: 'Over-the-Counter', slug: 'over-the-counter' },
  { label: 'Vitamins & Supplements', slug: 'vitamins-supplements' },
  { label: 'Personal Care', slug: 'personal-care' },
  { label: 'Cosmetics', slug: 'cosmetics' },
];

const SERVICES = ['Telepharmacy', 'Health Counseling', 'Health Check', 'Home Delivery'];

export function Footer() {
  return (
    <footer className="bg-brand-footer px-6 pb-7 pt-12 text-white sm:px-10">
      <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-9 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3.5 flex items-center gap-3">
            <Image src="/logo.png" alt="Prescription Lifeline Pharmacy" width={40} height={40} className="rounded-full" />
            <span className="font-display text-base font-extrabold">
              Prescription Lifeline
              <br />
              Pharmacy
            </span>
          </div>
          <p className="max-w-xs text-[13.5px] leading-relaxed text-white/65">
            Genuine medicines and trusted health care, delivered across Nigeria — online pharmacy,
            telepharmacy and home delivery from a licensed team.
          </p>
          <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.08] px-3.5 py-2 text-xs font-semibold">
            <CheckIcon className="size-3.5 text-brand-yellow" />
            Licensed &amp; verified pharmacy
          </div>
        </div>

        <div>
          <div className="mb-4 text-xs font-bold uppercase tracking-wide text-brand-yellow">Shop</div>
          <div className="flex flex-col gap-2.5">
            {SHOP_LINKS.map((link) => (
              <Link
                key={link.slug}
                href={`/products?category=${link.slug}`}
                className="text-sm text-white/65 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 text-xs font-bold uppercase tracking-wide text-brand-yellow">Services</div>
          <div className="flex flex-col gap-2.5">
            {SERVICES.map((service) => (
              <span key={service} className="text-sm text-white/65">
                {service}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 text-xs font-bold uppercase tracking-wide text-brand-yellow">Talk to us</div>
          <div className="mb-3 flex items-start gap-2.5 text-sm text-white/65">
            <PhoneIcon className="mt-0.5 size-3.5 shrink-0 text-brand-yellow" />
            +234 702 664 8102
          </div>
          <div className="flex items-start gap-2.5 text-sm text-white/65">
            <MailIcon className="mt-0.5 size-3.5 shrink-0 text-brand-yellow" />
            prescriptionlifelinepharmacy@gmail.com
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Prescription Lifeline Pharmacy. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-white">About Us</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
