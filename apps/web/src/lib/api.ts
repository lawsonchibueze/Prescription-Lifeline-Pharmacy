const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  priceKobo: number;
  stock: number;
  requiresPrescription: boolean;
  isActive: boolean;
  categoryId: string;
  category?: Category;
}

export interface ProductList {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) {
      console.error(`API ${path} responded ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    // Backend not reachable (e.g. Docker/API not running) — surfaced as
    // empty data rather than a hard crash so the site still renders.
    console.error(`API ${path} failed:`, error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  return (await apiFetch<Category[]>('/categories')) ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return apiFetch<Category>(`/categories/${slug}`);
}

export async function getProducts(params: {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<ProductList> {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.category) search.set('category', params.category);
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  const query = search.toString();

  const result = await apiFetch<ProductList>(`/products${query ? `?${query}` : ''}`);
  return result ?? { items: [], page: 1, limit: params.limit ?? 20, total: 0, totalPages: 1 };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return apiFetch<Product>(`/products/${slug}`);
}
