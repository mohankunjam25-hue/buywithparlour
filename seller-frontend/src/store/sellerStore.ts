import { create } from 'zustand';
import axios from 'axios';

export interface SellerProfileData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  gstin: string;
  panNumber?: string;
  bankAccount: string;
  ifsc: string;
  holderName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isVerified: boolean;
  memberSince?: string;
}

interface SellerStoreState {
  profile: SellerProfileData;
  isLoading: boolean;
  isMobileMenuOpen: boolean;

  setMobileMenuOpen: (open: boolean) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<SellerProfileData>) => Promise<void>;
}

const DEFAULT_PROFILE: SellerProfileData = {
  businessName: 'Pooja Beauty Lounge & Spa Supplies',
  ownerName: 'Pooja Sharma',
  email: 'pooja.seller@buywithparlour.com',
  phone: '+91 98765 43210',
  gstin: '08AABCP1234H1Z5',
  panNumber: 'ABCDE1234F',
  bankAccount: 'HDFC Bank •••••• 4892',
  ifsc: 'HDFC0001234',
  holderName: 'Pooja Sharma',
  address: 'Shop 14, Commercial Complex, Malviya Nagar',
  city: 'Jaipur',
  state: 'Rajasthan',
  pincode: '302017',
  isVerified: true,
  memberSince: 'August 2026',
};

export const useSellerStore = create<SellerStoreState>((set, get) => ({
  profile: (() => {
    try {
      const saved = localStorage.getItem('seller_profile_data');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  })(),
  isLoading: false,
  isMobileMenuOpen: false,

  setMobileMenuOpen: (open: boolean) => set({ isMobileMenuOpen: open }),

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get('/api/seller/profile');
      if (res.data?.data?.seller) {
        const fetched = res.data.data.seller;
        set({ profile: fetched, isLoading: false });
        localStorage.setItem('seller_profile_data', JSON.stringify(fetched));
        return;
      }
    } catch {
      // Keep persistent local state
    }
    set({ isLoading: false });
  },

  updateProfile: async (data: Partial<SellerProfileData>) => {
    set({ isLoading: true });
    const current = get().profile;
    const updated: SellerProfileData = { ...current, ...data };
    try {
      await axios.patch('/api/seller/profile', updated);
    } catch {
      // Persist locally
    }
    set({ profile: updated, isLoading: false });
    localStorage.setItem('seller_profile_data', JSON.stringify(updated));
  },
}));
