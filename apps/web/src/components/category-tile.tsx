import Link from 'next/link';
import {
  ChatIcon,
  HeartPulseIcon,
  LipstickIcon,
  PackageIcon,
  PrescriptionIcon,
  DropletIcon,
  SunIcon,
  TruckIcon,
  UsersIcon,
} from './icons';

const ICON_BY_SLUG: Record<string, typeof PrescriptionIcon> = {
  prescription: PrescriptionIcon,
  'over-the-counter': PackageIcon,
  'vitamins-supplements': SunIcon,
  'personal-care': DropletIcon,
  cosmetics: LipstickIcon,
  telepharmacy: ChatIcon,
  'health-counseling': UsersIcon,
  'health-check': HeartPulseIcon,
  'home-delivery': TruckIcon,
};

export function CategoryTile({
  slug,
  name,
  tint = 'green',
}: {
  slug: string;
  name: string;
  tint?: 'green' | 'yellow';
}) {
  const Icon = ICON_BY_SLUG[slug] ?? PackageIcon;
  const tintClass =
    tint === 'green'
      ? 'bg-brand-green-light text-brand-green-dark'
      : 'bg-brand-yellow-light text-[#8a7d10] dark:text-[#e8d874]';

  return (
    <Link
      href={`/products?category=${slug}`}
      className="flex flex-col items-start gap-3.5 rounded-2xl border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-md"
    >
      <span className={`flex size-11 items-center justify-center rounded-xl ${tintClass}`}>
        <Icon className="size-6" />
      </span>
      <span className="text-sm font-bold leading-snug text-ink">{name}</span>
    </Link>
  );
}
