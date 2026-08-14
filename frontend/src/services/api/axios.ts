import axios from 'axios';
import { Product } from '../../types/index';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      try {
        const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const newToken = res.data.data.accessToken;
        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        setAccessToken(null);
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

// Dynamic API Service Methods
export const fetchProducts = async (params?: Record<string, unknown>) => {
  const response = await api.get('/products', { params });
  return response.data.data;
};

export const fetchProductBySlug = async (slug: string) => {
  const response = await api.get(`/products/${slug}`);
  return response.data.data.product as Product;
};

export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data.data.categories;
};

export const fetchProductFacets = async () => {
  const response = await api.get('/products/facets');
  return response.data.data.facets;
};

export const fetchSearchSuggestions = async (q: string) => {
  const response = await api.get('/products/suggestions', { params: { q } });
  return response.data.data;
};

export const createOrderApi = async (orderData: {
  items: Array<{ productId: string; quantity: number; variantSku?: string }>;
  shippingAddress: Record<string, string>;
  paymentMethod: string;
  couponCode?: string;
}) => {
  const response = await api.post('/orders', orderData);
  return response.data.data.order;
};

// Payment Gateway APIs
export const createPaymentOrderApi = async (amount: number, receipt?: string) => {
  const response = await api.post('/orders/payment/create-order', { amount, receipt });
  return response.data.data.paymentOrder;
};

export const verifyPaymentSignatureApi = async (payload: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) => {
  const response = await api.post('/orders/payment/verify', payload);
  return response.data;
};

// Customer Auth APIs
export const loginCustomerApi = async (credentials: { email: string; passwordHash: string }) => {
  const response = await api.post('/auth/login', credentials);
  const data = response.data.data;
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
};

export const registerCustomerApi = async (userData: {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
}) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const googleLoginApi = async (email: string, name?: string) => {
  const response = await api.post('/auth/google-login', { email, name });
  const data = response.data.data;
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
};
