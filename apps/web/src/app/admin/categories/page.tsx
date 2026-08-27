'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { getCategories, type Category } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setCategories(await getCategories());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void load();
  }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/categories`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug: slugify(name), description: description || undefined }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
        setError(Array.isArray(data?.message) ? data.message.join(', ') : (data?.message ?? 'Could not create category.'));
        return;
      }
      setName('');
      setDescription('');
      await load();
    } catch {
      setError('Could not reach the API — make sure it is running.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(category: Category) {
    if (!confirm(`Delete "${category.name}"? This only works if it has no products.`)) return;
    setBusyId(category.id);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/categories/${category.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        setError(data?.message ?? `Could not delete "${category.name}" — it may still have products.`);
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_320px]">
      <div>
        <h2 className="mb-6 text-lg font-bold">All Categories</h2>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}
        {categories === null ? (
          <p className="text-sm text-ink-faint">Loading…</p>
        ) : (
          <div className="flex flex-col gap-3">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4">
                <div>
                  <div className="text-sm font-bold">{c.name}</div>
                  <div className="text-xs text-ink-faint">
                    /{c.slug} · {c._count?.products ?? 0} product{c._count?.products === 1 ? '' : 's'}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={busyId === c.id}
                  onClick={() => handleDelete(c)}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-6 text-lg font-bold">New Category</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-ink-soft">Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-line bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-green"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-ink-soft">Description (optional)</span>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-line bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-brand-green"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-brand-green py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create Category'}
          </button>
        </form>
      </div>
    </div>
  );
}
