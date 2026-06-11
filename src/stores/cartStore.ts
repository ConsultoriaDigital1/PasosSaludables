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

function trackAddToCart(product: Product) {
  if (typeof window === 'undefined') return;

  try {
    const uid = () =>
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

    let visitorId = window.localStorage.getItem('pss-visitor-id');
    if (!visitorId) {
      visitorId = uid();
      window.localStorage.setItem('pss-visitor-id', visitorId);
    }

    let sessionId = window.sessionStorage.getItem('pss-session-id');
    if (!sessionId) {
      sessionId = uid();
      window.sessionStorage.setItem('pss-session-id', sessionId);
    }

    void fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        type: 'add_to_cart',
        visitorId,
        sessionId,
        path: window.location.pathname,
        referrer: '',
        productId: product.id,
        productName: product.name
      })
    }).catch(() => {});
  } catch {
    // El tracking nunca debe romper el carrito.
  }
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

        trackAddToCart(product);

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
