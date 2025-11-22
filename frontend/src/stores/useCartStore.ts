import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Game } from '@/types/api';

interface CartItem {
  game: Game;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: number) => void;
  updateQuantity: (gameId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemsCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (game) => {
        const { items } = get();
        const existingItem = items.find((item) => item.game.id === game.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.game.id === game.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { game, quantity: 1 }] });
        }
      },

      removeFromCart: (gameId) => {
        set({
          items: get().items.filter((item) => item.game.id !== gameId),
        });
      },

      updateQuantity: (gameId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(gameId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.game.id === gameId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.game.price * item.quantity,
          0
        );
      },

      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
