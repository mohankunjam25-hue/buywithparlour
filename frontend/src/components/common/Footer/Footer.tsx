import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headset,
  Store,
  Lock,
  ExternalLink,
  Award,
  MapPin,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#172337] text-white mt-14 font-sans text-xs border-t-2 border-[#2874F0]">
      {/* 1. Value Proposition Trust Pillars (Top Ribbon) */}
      <div className="border-b border-[#2A374A] bg-[#121C2B] py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-left">
            <div className="w-11 h-11 rounded-[4px] bg-[#2874F0]/20 border border-[#2874F0]/40 flex items-center justify-center text-[#2874F0] flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">100% Authentic</h4>
              <p className="text-[11px] text-gray-400">Directly from certified cosmetic labs</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-left">
            <div className="w-11 h-11 rounded-[4px] bg-[#2874F0]/20 border border-[#2874F0]/40 flex items-center justify-center text-[#2874F0] flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">Express Delivery</h4>
              <p className="text-[11px] text-gray-400">Free courier dispatch on orders ₹1000+</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-left">
            <div className="w-11 h-11 rounded-[4px] bg-[#2874F0]/20 border border-[#2874F0]/40 flex items-center justify-center text-[#2874F0] flex-shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">7 Days Return</h4>
              <p className="text-[11px] text-gray-400">Hassle-free replacement for salons</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-left">
            <div className="w-11 h-11 rounded-[4px] bg-[#2874F0]/20 border border-[#2874F0]/40 flex items-center justify-center text-[#2874F0] flex-shrink-0">
              <Headset className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">24x7 Help Desk</h4>
              <p className="text-[11px] text-gray-400">Dedicated assistance for buyers</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Footer Columns (Flipkart / Nykaa Standard) */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-[#2A374A]">
        {/* Column 1: About Us */}
        <div className="space-y-3">
          <h5 className="font-bold text-[11px] text-[#878787] uppercase tracking-wider">
            ABOUT BUYWITHPARLOUR
          </h5>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                Contact Us & Support
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About Our Platform
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                BuyWithParlour Stories
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                Wholesale Commercial Supply
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                Corporate Information
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Customer Assistance & Order Desk */}
        <div className="space-y-3">
          <h5 className="font-bold text-[11px] text-[#878787] uppercase tracking-wider">
            CUSTOMER HELP
          </h5>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>
              <Link to="/profile" className="hover:text-[#F7E200] font-semibold transition-colors flex items-center gap-1">
                <span>Track Active Orders (Delhivery)</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-white transition-colors">
                Saved Delivery Addresses
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-white transition-colors">
                Sabhi Beauty Categories
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                Payment Modes & Razorpay
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                Cancellations & Returns
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Consumer Policy & Security */}
        <div className="space-y-3">
          <h5 className="font-bold text-[11px] text-[#878787] uppercase tracking-wider">
            CONSUMER POLICY
          </h5>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-[#34D399] transition-colors flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3 text-[#34D399]" />
                <span>Zero Leakage Security</span>
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition-colors">
                Salon Replacement Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition-colors">
                GST Invoice Compliance
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Parlour Merchant & Seller Desk (Make Money With Us) */}
        <div className="space-y-3 border-l md:border-l border-[#2A374A] md:pl-6 col-span-2 sm:col-span-1">
          <h5 className="font-bold text-[11px] text-[#F7E200] uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#F7E200]" />
            <span>MAKE MONEY WITH US</span>
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="http://localhost:5175/login"
                target="_blank"
                rel="noreferrer"
                className="text-[#F7E200] hover:underline font-bold flex items-center gap-1 transition-colors"
              >
                <span>Sell on BuyWithParlour (Merchant Hub)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="http://localhost:5175/onboarding"
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Seller Onboarding & GST Verification
              </a>
            </li>
            <li>
              <Link to="/shop" className="text-gray-300 hover:text-white transition-colors">
                Salon Bulk Supply Margin Deals
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                Merchant Success Guidelines
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Registered Office & Commercial Legal Entity */}
        <div className="space-y-3 border-t md:border-t-0 md:border-l border-[#2A374A] pt-6 md:pt-0 md:pl-6 col-span-2 md:col-span-1">
          <h5 className="font-bold text-[11px] text-[#878787] uppercase tracking-wider">
            REGISTERED OFFICE
          </h5>
          <div className="text-xs text-gray-400 space-y-1.5 leading-relaxed">
            <p className="text-white font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2874F0] flex-shrink-0" />
              <span>BuyWithParlour Pvt. Ltd.</span>
            </p>
            <p>
              Salon Tech Innovation Park, Commercial Ring Road, New Delhi, Delhi - 110001
            </p>
            <p className="text-[11px] text-gray-400">
              CIN: <strong className="text-gray-300 font-mono">U74999DL2026PTC392810</strong>
            </p>
            <p className="text-[11px] text-gray-400">
              GSTIN: <strong className="text-gray-300 font-mono">07AAACB1234F1Z5</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Payment Methods & Security Seals Strip */}
      <div className="bg-[#121C2B] py-4 border-b border-[#2A374A]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Payment Method Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-[11px] font-bold text-[#878787] uppercase tracking-wider mr-1">
              Payment Methods:
            </span>
            <span className="bg-white/10 text-gray-300 text-[10px] font-bold px-2 py-1 rounded-[2px] border border-white/10">
              UPI (GPay / PhonePe / Paytm)
            </span>
            <span className="bg-white/10 text-gray-300 text-[10px] font-bold px-2 py-1 rounded-[2px] border border-white/10">
              Credit / Debit Cards
            </span>
            <span className="bg-white/10 text-gray-300 text-[10px] font-bold px-2 py-1 rounded-[2px] border border-white/10">
              Net Banking
            </span>
            <span className="bg-[#2E7D32]/20 text-[#34D399] text-[10px] font-bold px-2 py-1 rounded-[2px] border border-[#2E7D32]/30">
              Cash on Delivery (COD)
            </span>
          </div>

          {/* Security & Logistics Badges */}
          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#34D399]" />
              <span>256-Bit SSL Encrypted Payments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#F7E200]" />
              <span>Razorpay Verified Gateway</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Copyright & Indian Marketplace Standard Ribbon */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span>© 2026 BuyWithParlour E-Commerce Platform. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <span>Designed with Flipkart-standard beauty & salon merchant architecture.</span>
        </div>
      </div>
    </footer>
  );
};
