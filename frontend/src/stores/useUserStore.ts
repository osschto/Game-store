import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/api';

interface UserStore {
  currentUser: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,

      setUser: (user) => {
        set({ currentUser: user });
      },

      logout: () => {
        set({ currentUser: null });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
