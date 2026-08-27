'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories, type Category, type Product } from '@/lib/api';
import { ProductForm } from '@/components/admin/product-form';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function EditProductPage({ params }: PageProps<'/admin/products/[id]/edit'>) {
  const { id } = use(params);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    void getCategories().then(setCategories);
    fetch(`${API_URL}/admin/products?limit=100`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: { items: Product[] }) => {
        setProduct(data.items.find((p) => p.id === id) ?? null);
      });
  }, [id]);

  return (
    <div className="px-6 py-8 sm:px-10">
      <Link href="/admin/products" className="mb-4 inline-block text-sm font-semibold text-ink-soft hover:text-ink">
        ← Back to products
      </Link>
      <h2 className="mb-6 text-lg font-bold">Edit Product</h2>

      {categories === null || product === undefined ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : product === null ? (
        <p className="text-sm text-ink-faint">Product not found.</p>
      ) : (
        <div className="max-w-xl">
          <ProductForm categories={categories} initial={product} />
        </div>
      )}
    </div>
  );
}
