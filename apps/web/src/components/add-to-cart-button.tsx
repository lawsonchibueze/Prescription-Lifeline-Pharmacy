'use client';

import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import type { Product } from '@/lib/api';
import { CartIcon, CheckIcon } from './icons';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: 'icon' | 'full';
}

export function AddToCartButton({ product, quantity = 1, variant = 'icon' }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function handleClick() {
    if (outOfStock) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceKobo: product.priceKobo,
        requiresPrescription: product.requiresPrescription,
        stock: product.stock,
      },
      quantity,
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={outOfStock}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-green px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:bg-ink-faint"
      >
        {justAdded ? (
          <>
            <CheckIcon className="size-4" /> Added to cart
          </>
        ) : outOfStock ? (
          'Out of stock'
        ) : (
          <>
            Add to Cart <CartIcon className="size-4" />
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={outOfStock}
      aria-label="Add to cart"
      className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-green text-white transition-colors hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:bg-ink-faint"
    >
      {justAdded ? <CheckIcon className="size-4" /> : <CartIcon className="size-4" />}
    </button>
  );
}
