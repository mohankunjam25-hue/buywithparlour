import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SellerDashboard } from './pages/Dashboard/SellerDashboard';
import { AddProduct } from './pages/Products/AddProduct';
import { StoreProfile } from './pages/Profile/StoreProfile';
import { SellerOnboarding } from './pages/Onboarding/SellerOnboarding';
import { SellerAuthGuard } from './components/SellerAuthGuard';

export function App() {
  const [isKycCompleted, setIsKycCompleted] = useState<boolean>(() => {
    return localStorage.getItem('seller_kyc_completed') === 'true';
  });

  const handleCompleteKyc = () => {
    localStorage.setItem('seller_kyc_completed', 'true');
    setIsKycCompleted(true);
  };

  return (
    <Router>
      <Routes>
        {/* Onboarding Wizard (Accessible when KYC is pending) */}
        <Route
          path="/onboarding"
          element={<SellerOnboarding onCompleteKyc={handleCompleteKyc} />}
        />

        {/* Protected Seller Studio Routes (Locked until KYC completed) */}
        <Route element={<SellerAuthGuard isKycCompleted={isKycCompleted} />}>
          <Route path="/" element={<SellerDashboard />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/profile" element={<StoreProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
