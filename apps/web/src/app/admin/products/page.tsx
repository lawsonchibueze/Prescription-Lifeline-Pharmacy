'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatNaira } from '@/lib/money';
import type { Product } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch(`${API_URL}/admin/products?limit=100`, { credentials: 'include' });
      if (!res.ok) {
        setError(`Could not load products (${res.status})`);
        return;
      }
      const data = (await res.json()) as { items: Product[] };
      setProducts(data.items);
    } catch {
      setError('Could not reach the API — make sure it is running.');
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void load();
  }, []);

  async function handleDeactivate(product: Product) {
    if (!confirm(`Deactivate "${product.name}"? It will be hidden from the storefront.`)) return;
    setBusyId(product.id);
    try {
      const res = await fetch(`${API_URL}/admin/products/${product.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="px-6 py-8 sm:px-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold">All Products</h2>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-brand-green px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark"
        >
          + New Product
        </Link>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}

      {products === null && !error ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : products && products.length === 0 ? (
        <p className="text-sm text-ink-faint">No products yet.</p>
      ) : (
        products && (
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-hover text-xs font-bold uppercase tracking-wide text-ink-faint">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-line">
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3 text-ink-soft">{p.category?.name ?? '—'}</td>
                    <td className="px-4 py-3">{formatNaira(p.priceKobo)}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          p.isActive
                            ? 'bg-brand-green-light text-brand-green-dark'
                            : 'bg-surface-hover text-ink-faint'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold hover:bg-surface-hover"
                        >
                          Edit
                        </Link>
                        {p.isActive && (
                          <button
                            type="button"
                            disabled={busyId === p.id}
                            onClick={() => handleDeactivate(p)}
                            className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
