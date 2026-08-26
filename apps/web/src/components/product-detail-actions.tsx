'use client';

import { useState } from 'react';
import type { Product } from '@/lib/api';
import { QuantityStepper } from './quantity-stepper';
import { AddToCartButton } from './add-to-cart-button';

export function ProductDetailActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center gap-3.5">
      <QuantityStepper value={quantity} max={Math.max(1, product.stock)} onChange={setQuantity} />
      <AddToCartButton product={product} quantity={quantity} variant="full" />
    </div>
  );
}
