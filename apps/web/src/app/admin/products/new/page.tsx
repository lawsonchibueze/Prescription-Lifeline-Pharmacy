'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories, type Category } from '@/lib/api';
import { ProductForm } from '@/components/admin/product-form';

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    void getCategories().then(setCategories);
  }, []);

  return (
    <div className="px-6 py-8 sm:px-10">
      <Link href="/admin/products" className="mb-4 inline-block text-sm font-semibold text-ink-soft hover:text-ink">
        ← Back to products
      </Link>
      <h2 className="mb-6 text-lg font-bold">New Product</h2>

      {categories === null ? (
        <p className="text-sm text-ink-faint">Loading categories…</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-ink-faint">
          Create a category first —{' '}
          <Link href="/admin/categories" className="font-semibold text-brand-green-dark">
            go to Categories
          </Link>
          .
        </p>
      ) : (
        <div className="max-w-xl">
          <ProductForm categories={categories} />
        </div>
      )}
    </div>
  );
}
