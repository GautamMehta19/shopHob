import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,

      login: async (email: string, password: string) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          const { access_token, user } = response.data;
          
          set({ user, token: access_token });
          localStorage.setItem('token', access_token);
        } catch (error) {
          throw error;
        }
      },

      register: async (userData: any) => {
        try {
          const response = await api.post('/auth/register', userData);
          const { access_token, user } = response.data;
          
          set({ user, token: access_token });
          localStorage.setItem('token', access_token);
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
      },

      checkAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ token });
        }
        set({ isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

// Initialize auth check
useAuthStore.getState().checkAuth();