import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/api';
import { formatNaira } from '@/lib/money';
import { getProductImage } from '@/lib/product-images';
import { ProductCard } from '@/components/product-card';
import { ProductDetailActions } from '@/components/product-detail-actions';
import { AlertIcon, CheckIcon, TruckIcon } from '@/components/icons';

export default async function ProductPage({ params }: PageProps<'/products/[slug]'>) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedResult = product.category
    ? await getProducts({ category: product.category.slug, limit: 5 })
    : { items: [] };
  const related = relatedResult.items.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div>
      <div className="px-6 pt-6 text-xs text-ink-faint sm:px-10">
        <Link href="/" className="hover:text-ink">Home</Link> /{' '}
        {product.category && (
          <>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-ink">
              {product.category.name}
            </Link>{' '}
            /{' '}
          </>
        )}
        <span className="font-semibold text-ink">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-12 px-6 pb-3 pt-6 sm:px-10 lg:grid-cols-2">
        <div className="relative h-[320px] overflow-hidden rounded-2xl bg-brand-green-light sm:h-[380px]">
          <Image
            src={getProductImage(product)}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-green-dark dark:text-brand-green">
            {product.category?.name ?? 'Pharmacy'}
          </div>
          <h1 className="font-display text-2xl font-extrabold leading-snug sm:text-3xl">{product.name}</h1>

          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                product.stock > 0
                  ? 'bg-brand-green-light text-brand-green-dark'
                  : 'bg-surface-hover text-ink-faint'
              }`}
            >
              <CheckIcon className="size-3" />
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="mt-5 text-3xl font-extrabold">{formatNaira(product.priceKobo)}</div>

          {product.requiresPrescription && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 dark:border-amber-900 dark:bg-amber-950">
              <AlertIcon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="text-sm font-bold">Prescription required</div>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                  A licensed pharmacist will verify your prescription before this order ships.
                </p>
                <a
                  href="mailto:prescriptionlifelinepharmacy@gmail.com?subject=Prescription%20Upload"
                  className="mt-2.5 inline-block rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-bold text-white"
                >
                  Upload Prescription
                </a>
              </div>
            </div>
          )}

          <div className="mt-6">
            <ProductDetailActions product={product} />
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-ink-soft">
            <TruckIcon className="size-4 text-brand-green-dark" />
            Estimated delivery in 24–48 hrs to Lagos, Abuja &amp; Port Harcourt
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 border-t border-line px-6 py-10 sm:px-10 lg:grid-cols-2">
        <div>
          <div className="mb-2.5 text-xs font-bold uppercase tracking-wide">About this product</div>
          <p className="text-sm leading-relaxed text-ink-soft">{product.description}</p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-line px-6 py-10 sm:px-10">
          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-green-dark dark:text-brand-green">
            You may also need
          </div>
          <h2 className="mb-6 font-display text-xl font-extrabold">Related products</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} tint={i % 2 === 0 ? 'green' : 'yellow'} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
