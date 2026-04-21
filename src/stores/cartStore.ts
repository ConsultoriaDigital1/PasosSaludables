import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem, Product } from '../types';

interface CartStore extends Cart {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

function calculateTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (product, quantity = 1) => {
        if (quantity <= 0) {
          return;
        }

        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);

          if (existing) {
            const items = state.items.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + quantity, product.stockQuantity || item.quantity + quantity)
                  }
                : item
            );

            return {
              items,
              total: calculateTotal(items)
            };
          }

          const items = [...state.items, { product, quantity: Math.min(quantity, Math.max(product.stockQuantity, 1)) }];

          return {
            items,
            total: calculateTotal(items)
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const items = state.items.filter((item) => item.product.id !== productId);

          return {
            items,
            total: calculateTotal(items)
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const items = state.items.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity: Math.min(quantity, Math.max(item.product.stockQuantity, 1))
                }
              : item
          );

          return {
            items,
            total: calculateTotal(items)
          };
        });
      },

      clearCart: () => set({ items: [], total: 0 }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
    }),
    {
      name: 'pss-cart'
    }
  )
);
