'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Category, Product } from '@/lib/api';
import { ImageUploader } from './image-uploader';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function ProductForm({ categories, initial }: { categories: Category[]; initial?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(initial?.description ?? '');
  const [priceNaira, setPriceNaira] = useState(initial ? String(initial.priceKobo / 100) : '');
  const [stock, setStock] = useState(initial ? String(initial.stock) : '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? '');
  const [requiresPrescription, setRequiresPrescription] = useState(initial?.requiresPrescription ?? false);
  const [imageUrl, setImageUrl] = useState(initial?.images[0] ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const body = {
      name,
      slug,
      description,
      priceNaira: Number(priceNaira),
      stock: Number(stock),
      categoryId,
      requiresPrescription,
      images: imageUrl.trim() ? [imageUrl.trim()] : [],
    };

    try {
      const res = await fetch(
        isEdit ? `${API_URL}/admin/products/${initial!.id}` : `${API_URL}/admin/products`,
        {
          method: isEdit ? 'PATCH' : 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
        const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
        setError(message ?? `Request failed (${res.status})`);
        return;
      }
      router.push('/admin/products');
      router.refresh();
    } catch {
      setError('Could not reach the API — make sure it is running.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
      {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}

      <Field label="Product Name">
        <input
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="w-full rounded-lg border border-line bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-green"
        />
      </Field>

      <Field label="URL Slug">
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="w-full rounded-lg border border-line bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-green"
        />
      </Field>

      <Field label="Description">
        <textarea
          required
          minLength={10}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-line bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-green"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₦)">
          <input
            required
            type="number"
            min={1}
            value={priceNaira}
            onChange={(e) => setPriceNaira(e.target.value)}
            className="w-full rounded-lg border border-line bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-green"
          />
        </Field>
        <Field label="Stock">
          <input
            required
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full rounded-lg border border-line bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-green"
          />
        </Field>
      </div>

      <Field label="Category">
        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-line bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-green"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Product Photo (optional)">
        <ImageUploader value={imageUrl} onChange={setImageUrl} />
      </Field>

      <label className="flex items-center gap-2.5 text-sm font-semibold">
        <input
          type="checkbox"
          checked={requiresPrescription}
          onChange={(e) => setRequiresPrescription(e.target.checked)}
          className="size-4 accent-brand-green"
        />
        Requires a prescription
      </label>

      <button
        type="submit"
        disabled={submitting || categories.length === 0}
        className="mt-2 rounded-xl bg-brand-green py-3 text-sm font-bold text-white hover:bg-brand-green-dark disabled:opacity-60"
      >
        {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
