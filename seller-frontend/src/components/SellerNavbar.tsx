import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Store,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  LayoutDashboard,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useSellerStore } from '../store/sellerStore';

export const SellerNavbar: React.FC = () => {
  const location = useLocation();
  const { profile, isMobileMenuOpen, setMobileMenuOpen } = useSellerStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Desktop & Mobile Header Bar */}
      <header className="h-14 bg-[#2874F0] text-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm font-sans">
        {/* Brand & Logo */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-[2px] hover:bg-[#1259c7] text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-[2px] bg-white text-[#2874F0] flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center text-sm sm:text-base font-bold tracking-tight text-white italic">
                <span>BuyWith</span>
                <span className="text-[#F7E200]">Seller</span>
              </div>
              <span className="text-[9px] text-white/80 font-medium tracking-wider uppercase block -mt-1 hidden sm:block">
                Merchant Operations
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1259c7] p-0.5 rounded-[2px] text-xs font-semibold">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-[2px] transition-colors ${
                isActive('/')
                  ? 'bg-white text-[#2874F0] font-bold'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/add-product"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-[2px] transition-colors ${
                isActive('/add-product')
                  ? 'bg-white text-[#2874F0] font-bold'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#F7E200]" />
              <span>List New Product</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-[2px] transition-colors ${
                isActive('/profile')
                  ? 'bg-white text-[#2874F0] font-bold'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#F7E200]" />
              <span>Store Profile</span>
            </Link>
          </nav>
        </div>

        {/* Right Side Actions & Dynamic Seller Profile */}
        <div className="flex items-center gap-3 text-xs">
          {/* Customer Marketplace Link ONLY (No Admin Access for Sellers) */}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white font-semibold px-2.5 py-1 rounded-[2px] transition-colors text-[11px]"
          >
            <span>Customer Store</span>
            <ExternalLink className="w-3 h-3 text-white/70" />
          </a>

          {/* Seller Account Pill */}
          <Link
            to="/profile"
            className="flex items-center gap-1.5 bg-white text-[#2874F0] hover:bg-slate-50 px-2.5 py-1 rounded-[2px] font-semibold text-xs transition-colors shadow-sm"
          >
            <div className="w-4 h-4 rounded-full bg-[#2874F0] text-white flex items-center justify-center font-bold text-[9px]">
              {profile.ownerName ? profile.ownerName.charAt(0).toUpperCase() : 'S'}
            </div>
            <span className="max-w-[120px] truncate hidden sm:inline">
              {profile.businessName || 'My Store'}
            </span>
            <span className="sm:hidden font-bold">Profile</span>
          </Link>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex font-sans animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#212121]/60"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-4 z-10 text-[#212121]">
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[2px] bg-[#2874F0] text-white flex items-center justify-center font-bold">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#212121] block">Seller Studio</span>
                    <span className="text-[10px] text-[#878787]">{profile.city || 'Jaipur Hub'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#878787] hover:text-[#212121] p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Seller Verified Badge */}
              <div className="bg-[#E8F5E9] border border-[#2E7D32]/20 p-2.5 rounded-[2px] flex items-center gap-2 text-xs text-[#2E7D32] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span className="truncate">{profile.businessName}</span>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 text-xs font-semibold">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[2px] transition-colors ${
                    isActive('/') ? 'bg-[#2874F0] text-white font-bold' : 'text-[#212121] hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard Overview</span>
                </Link>

                <Link
                  to="/add-product"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[2px] transition-colors ${
                    isActive('/add-product') ? 'bg-[#2874F0] text-white font-bold' : 'text-[#212121] hover:bg-slate-100'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-[#ED6C02]" />
                  <span>List New Product</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[2px] transition-colors ${
                    isActive('/profile') ? 'bg-[#2874F0] text-white font-bold' : 'text-[#212121] hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>Store Profile & KYC</span>
                </Link>
              </nav>

              {/* Customer Portal Link Only (Zero Admin Link) */}
              <div className="border-t border-[#EEEEEE] pt-3 space-y-1.5 text-xs">
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-[2px] hover:bg-slate-50 text-[#2874F0] font-semibold"
                >
                  <span>Customer Marketplace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-[#EEEEEE] pt-3 text-[11px] text-[#878787]">
              <span>Proprietor: <strong className="text-[#212121]">{profile.ownerName}</strong></span>
              <p className="mt-0.5">{profile.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] h-13 z-40 flex items-center justify-around text-xs font-semibold shadow-[0_-1px_4px_rgba(0,0,0,0.06)] font-sans">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 py-1 ${
            isActive('/') ? 'text-[#2874F0]' : 'text-[#878787] hover:text-[#212121]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px]">Dashboard</span>
        </Link>

        <Link
          to="/add-product"
          className={`flex flex-col items-center gap-0.5 py-1 ${
            isActive('/add-product') ? 'text-[#2874F0]' : 'text-[#878787] hover:text-[#212121]'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span className="text-[10px]">Add Product</span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center gap-0.5 py-1 ${
            isActive('/profile') ? 'text-[#2874F0]' : 'text-[#878787] hover:text-[#212121]'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px]">Account</span>
        </Link>
      </div>
    </>
  );
};
