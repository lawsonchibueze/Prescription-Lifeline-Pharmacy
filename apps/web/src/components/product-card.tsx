import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/api';
import { formatNaira } from '@/lib/money';
import { getProductImage } from '@/lib/product-images';
import { AddToCartButton } from './add-to-cart-button';

export function ProductCard({ product, tint = 'green' }: { product: Product; tint?: 'green' | 'yellow' }) {
  const tintClass = tint === 'green' ? 'bg-brand-green-light' : 'bg-brand-yellow-light';
  const imageSrc = getProductImage(product);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-md">
      <Link href={`/products/${product.slug}`} className={`relative block h-[180px] overflow-hidden ${tintClass}`}>
        {product.requiresPrescription && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-brand-black px-2.5 py-1 text-[10.5px] font-bold text-white">
            Prescription
          </span>
        )}
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="text-[11.5px] font-bold uppercase tracking-wide text-ink-faint">
          {product.category?.name ?? 'Pharmacy'}
        </div>
        <Link href={`/products/${product.slug}`} className="min-h-[38px] text-sm font-bold leading-snug text-ink hover:text-brand-green-dark">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-1.5">
          <span className="text-base font-extrabold">{formatNaira(product.priceKobo)}</span>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
