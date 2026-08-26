import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/api';
import { ProductCard } from '@/components/product-card';
import { SearchIcon } from '@/components/icons';

const PAGE_SIZE = 12;

export default async function ProductsPage({ searchParams }: PageProps<'/products'>) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const page = Number(typeof params.page === 'string' ? params.page : '1') || 1;

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({ q, category, page, limit: PAGE_SIZE }),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);
  const title = activeCategory?.name ?? (q ? `Search: “${q}”` : 'All Products');

  function pageHref(nextPage: number) {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (category) sp.set('category', category);
    sp.set('page', String(nextPage));
    return `/products?${sp.toString()}`;
  }

  return (
    <div>
      <div className="border-b border-line px-6 pb-6 pt-6 sm:px-10">
        <div className="mb-1 text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link> / <span className="font-semibold text-ink">{title}</span>
        </div>
        <h1 className="font-display text-2xl font-extrabold">{title}</h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          {result.total} product{result.total === 1 ? '' : 's'}
          {activeCategory?.description ? ` — ${activeCategory.description}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-col gap-2">
          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-faint">Category</div>
          <Link
            href="/products"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              !category ? 'bg-brand-green-light text-brand-green-dark' : 'text-ink-soft hover:bg-surface-hover'
            }`}
          >
            All Categories
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                category === c.slug ? 'bg-brand-green-light text-brand-green-dark' : 'text-ink-soft hover:bg-surface-hover'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </aside>

        <div>
          <form action="/products" method="GET" className="relative mb-6 max-w-md lg:hidden">
            {category && <input type="hidden" name="category" value={category} />}
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search products…"
              className="w-full rounded-lg border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-green"
            />
          </form>

          {result.items.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {result.items.map((product, i) => (
                <ProductCard key={product.id} product={product} tint={i % 2 === 0 ? 'green' : 'yellow'} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-faint">No products found. Try a different search or category.</p>
          )}

          {result.totalPages > 1 && (
            <div className="mt-9 flex items-center justify-center gap-2">
              <Link
                href={pageHref(Math.max(1, page - 1))}
                aria-disabled={page <= 1}
                className={`rounded-lg border border-line px-3.5 py-2 text-sm font-bold ${
                  page <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-surface-hover'
                }`}
              >
                Prev
              </Link>
              <span className="px-3 text-sm font-semibold text-ink-soft">
                Page {result.page} of {result.totalPages}
              </span>
              <Link
                href={pageHref(Math.min(result.totalPages, page + 1))}
                aria-disabled={page >= result.totalPages}
                className={`rounded-lg border border-line px-3.5 py-2 text-sm font-bold ${
                  page >= result.totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-surface-hover'
                }`}
              >
                Next
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
