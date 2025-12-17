import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Admin, admins } from '@/mock/users';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: Admin | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      currentUser: null,
      login: (username: string, password: string) => {
        const user = admins.find(
          (u) => u.username === username && u.password === password
        );
        if (user) {
          set({ isAuthenticated: true, currentUser: user });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, currentUser: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
