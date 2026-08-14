import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface SellerAuthGuardProps {
  isKycCompleted: boolean;
}

export const SellerAuthGuard: React.FC<SellerAuthGuardProps> = ({ isKycCompleted }) => {
  if (!isKycCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};
