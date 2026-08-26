'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceKobo: number;
  quantity: number;
  requiresPrescription: boolean;
  stock: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotalKobo: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'plp-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load whatever was in localStorage after mount — reading it during the
  // initial render would desync from the server-rendered (empty) markup.
  // This one-time post-mount sync from an external store is the documented
  // exception to "don't setState in an effect" (unlike deriving state from
  // props/other state, which the lint rule is really guarding against).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // Corrupt/blocked storage — just start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full/blocked — cart still works for this tab session.
    }
  }, [items, hydrated]);

  const addItem: CartContextValue['addItem'] = (item, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.productId === item.productId);
      if (existing) {
        const nextQuantity = Math.min(existing.quantity + quantity, existing.stock);
        return current.map((i) =>
          i.productId === item.productId ? { ...i, quantity: nextQuantity } : i,
        );
      }
      return [...current, { ...item, quantity: Math.min(quantity, item.stock) }];
    });
  };

  const updateQuantity: CartContextValue['updateQuantity'] = (productId, quantity) => {
    setItems((current) =>
      current
        .map((i) =>
          i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const removeItem: CartContextValue['removeItem'] = (productId) => {
    setItems((current) => current.filter((i) => i.productId !== productId));
  };

  const clear = () => setItems([]);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotalKobo = useMemo(
    () => items.reduce((sum, i) => sum + i.priceKobo * i.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotalKobo, addItem, updateQuantity, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
