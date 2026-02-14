import { create } from 'zustand';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: 'BUYER' | 'SELLER'
  ) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      const { user, tokens } = response;

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', tokens.accessToken);
        localStorage.setItem('refresh_token', tokens.refreshToken);
      }

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (
    name: string,
    email: string,
    password: string,
    role: 'BUYER' | 'SELLER'
  ) => {
    set({ isLoading: true });
    try {
      const response = await api.post<LoginResponse>('/auth/register', {
        name,
        email,
        password,
        role,
      });
      const { user, tokens } = response;

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', tokens.accessToken);
        localStorage.setItem('refresh_token', tokens.refreshToken);
      }

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    set({ user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null;

    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await api.get<User>('/auth/me');
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
}));
