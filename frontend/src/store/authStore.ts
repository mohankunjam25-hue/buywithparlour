import { create } from 'zustand';
import axios from 'axios';
import { api, setAccessToken } from '../services/api/axios';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';
  addresses?: Array<{
    id?: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }>;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authRedirectPath: string | null;

  openAuthModal: (redirectPath?: string) => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  loginWithGoogle: (email: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAuthModalOpen: false,
  authRedirectPath: null,

  openAuthModal: (redirectPath?: string) =>
    set({ isAuthModalOpen: true, authRedirectPath: redirectPath || null }),

  closeAuthModal: () => set({ isAuthModalOpen: false, authRedirectPath: null }),

  // 1. Email & Password Login
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });
      const { user, accessToken } = response.data.data;
      setAccessToken(accessToken);
      set({ user, isAuthenticated: true, isAuthModalOpen: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // 2. Email, Name & Password Register (Phone is Optional)
  register: async (name: string, email: string, password: string, phone?: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone?.trim() || undefined,
      });
      const { user, accessToken } = response.data.data;
      setAccessToken(accessToken);
      set({ user, isAuthenticated: true, isAuthModalOpen: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // 3. Google 1-Click OAuth Login
  loginWithGoogle: async (email: string, name?: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/google-login', {
        email: email.trim().toLowerCase(),
        name,
      });
      const { user, accessToken } = response.data.data;
      setAccessToken(accessToken);
      set({ user, isAuthenticated: true, isAuthModalOpen: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // 4. Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      setAccessToken(null);
      set({ user: null, isAuthenticated: false, isLoading: false, authRedirectPath: null });
    }
  },

  // 5. Silent Auth Session Recovery from HttpOnly Cookie
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const refreshRes = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
      const newToken = refreshRes.data?.data?.accessToken;
      if (newToken) {
        setAccessToken(newToken);
        const profileRes = await api.get('/auth/me');
        const user = profileRes.data?.data?.user;
        set({ user, isAuthenticated: true, isLoading: false });
        return;
      }
    } catch {
      // Cookie does not exist or expired
    }
    setAccessToken(null);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
