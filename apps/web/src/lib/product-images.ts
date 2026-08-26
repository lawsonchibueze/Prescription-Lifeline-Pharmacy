import type { Product } from './api';

const CATEGORY_IMAGES: Record<string, string> = {
  prescription: '/images/products/vitamins-medicines.png',
  'over-the-counter': '/images/products/otc-essentials.png',
  'vitamins-supplements': '/images/products/vitamins-medicines.png',
  'personal-care': '/images/products/home-health-care.png',
  cosmetics: '/images/products/home-health-care.png',
};

export function getProductImage(product: Product): string {
  return product.images[0] ?? CATEGORY_IMAGES[product.category?.slug ?? ''] ?? '/logo.png';
}
