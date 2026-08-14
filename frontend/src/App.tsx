import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthStore } from './store/authStore';
import { Header } from './components/common/Header/Header.tsx';
import { Navbar } from './components/common/Navbar/Navbar.tsx';
import { Footer } from './components/common/Footer/Footer.tsx';
import { HomePage } from './pages/Home/HomePage.tsx';
import { ShopPage } from './pages/Shop/ShopPage.tsx';
import { ProductPage } from './pages/Product/ProductPage.tsx';
import { CartPage } from './pages/Cart/CartPage.tsx';
import { CheckoutPage } from './pages/Checkout/CheckoutPage.tsx';
import { CustomerProfilePage } from './pages/Profile/CustomerProfilePage.tsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '543472696041-1jmb4fud17ca7ucvoqnknmi9ohe02g0o.apps.googleusercontent.com';

export const App: React.FC = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div className="min-h-screen flex flex-col bg-surface-page">
          <Header />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<CustomerProfilePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
