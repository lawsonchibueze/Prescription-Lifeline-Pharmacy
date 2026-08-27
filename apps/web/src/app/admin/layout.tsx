import Link from 'next/link';
import { AdminGuard } from '@/components/admin-guard';

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <AdminGuard>
      <div className="px-6 pt-6 sm:px-10">
        <div className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-green-dark dark:text-brand-green">
          Admin
        </div>
        <h1 className="font-display text-2xl font-extrabold">Pharmacy Admin</h1>
        <nav className="mt-5 flex gap-1 border-b border-line">
          <Link
            href="/admin/products"
            className="rounded-t-lg px-4 py-2.5 text-sm font-bold text-ink-soft hover:bg-surface-hover"
          >
            Products
          </Link>
          <Link
            href="/admin/categories"
            className="rounded-t-lg px-4 py-2.5 text-sm font-bold text-ink-soft hover:bg-surface-hover"
          >
            Categories
          </Link>
        </nav>
      </div>
      {children}
    </AdminGuard>
  );
}
