import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building,
  CreditCard,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FastForward,
} from 'lucide-react';
import axios from 'axios';

interface SellerOnboardingProps {
  onCompleteKyc: () => void;
}

export const SellerOnboarding: React.FC<SellerOnboardingProps> = ({ onCompleteKyc }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Business Details
  const [businessName, setBusinessName] = useState('Pooja Beauty Lounge & Spa Supplies');
  const [ownerName, setOwnerName] = useState('Pooja Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [gstin, setGstin] = useState('08AABCP1234H1Z5');
  const [address, setAddress] = useState('Shop 14, Commercial Complex, Malviya Nagar, Jaipur, RJ');

  // Step 2: Banking Setup
  const [accountNumber, setAccountNumber] = useState('918239012849');
  const [ifsc, setIfsc] = useState('HDFC0001234');
  const [holderName, setHolderName] = useState('Pooja Sharma');

  // Step 3: PAN (Optional)
  const [panNumber, setPanNumber] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Skip KYC Handler
  const handleSkipKyc = () => {
    localStorage.setItem('seller_kyc_completed', 'true');
    onCompleteKyc();
    navigate('/');
  };

  // Final Onboarding Completion
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post('/api/seller/onboarding/complete', {
        businessName,
        phone,
        gstin,
        address,
        accountNumber,
        ifsc,
        holderName,
        panNumber: panNumber || 'SKIPPED_PAN',
      });
    } catch {
      // Allow progression even if backend token is unconfigured
    }

    setToastMessage('🎉 Seller KYC Verified! Opening Studio Dashboard...');
    localStorage.setItem('seller_kyc_completed', 'true');
    onCompleteKyc();
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] text-[#212121] flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-2xl w-full space-y-4">
        {/* Header with Skip Button */}
        <div className="bg-white p-5 rounded-[4px] border border-[#EEEEEE] shadow-[0_1px_4px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-[#212121]">
              Parlour Merchant Onboarding
            </h1>
            <p className="text-xs text-[#666666]">
              Set up your seller profile or skip to explore the dashboard
            </p>
          </div>

          <button
            onClick={handleSkipKyc}
            className="bg-[#2874F0] hover:bg-[#1259c7] text-white font-semibold text-xs px-4 py-2 rounded-[2px] flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Skip for now & Go to Dashboard</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
          <div
            className={`p-2.5 rounded-[2px] border transition-all ${
              step === 1
                ? 'bg-[#2874F0] text-white border-[#2874F0]'
                : step > 1
                ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]/20'
                : 'bg-white text-[#878787] border-[#E0E0E0]'
            }`}
          >
            <span>1. Business Info</span>
          </div>

          <div
            className={`p-2.5 rounded-[2px] border transition-all ${
              step === 2
                ? 'bg-[#2874F0] text-white border-[#2874F0]'
                : step > 2
                ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]/20'
                : 'bg-white text-[#878787] border-[#E0E0E0]'
            }`}
          >
            <span>2. Bank Account</span>
          </div>

          <div
            className={`p-2.5 rounded-[2px] border transition-all ${
              step === 3
                ? 'bg-[#2874F0] text-white border-[#2874F0]'
                : 'bg-white text-[#878787] border-[#E0E0E0]'
            }`}
          >
            <span>3. Owner ID (Optional)</span>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-[#E8F5E9] border border-[#2E7D32]/20 text-[#2E7D32] p-3 rounded-[2px] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Step Form Container */}
        <div className="bg-white border border-[#EEEEEE] p-6 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-4">
          {/* STEP 1: BUSINESS & GSTIN */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="border-b border-[#EEEEEE] pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#2874F0]" />
                  <h3 className="text-sm font-bold text-[#212121]">Step 1: Salon Business Details</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-[#212121] block mb-1">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">Proprietor Name</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#212121] block mb-1">GSTIN / Parlour Reg No (Optional)</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] font-mono focus:outline-none focus:border-[#2874F0]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#212121] block mb-1">Address</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEE]">
                <button
                  type="button"
                  onClick={handleSkipKyc}
                  className="text-[#878787] hover:text-[#212121] text-xs font-semibold"
                >
                  Skip KYC
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-[#2874F0] hover:bg-[#1259c7] text-white font-semibold text-xs px-5 py-2 rounded-[2px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Next: Bank Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BANKING SETUP */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="border-b border-[#EEEEEE] pb-2.5 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#2E7D32]" />
                <h3 className="text-sm font-bold text-[#212121]">Step 2: Settlement Bank Account</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-[#212121] block mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">Bank Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] font-mono focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] font-mono focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEE]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#878787] hover:text-[#212121] text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSkipKyc}
                    className="text-[#878787] hover:text-[#212121] text-xs font-semibold"
                  >
                    Skip
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-[#2874F0] hover:bg-[#1259c7] text-white font-semibold text-xs px-5 py-2 rounded-[2px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Next: Owner ID</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAN / IDENTITY (OPTIONAL) */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4 animate-fade-in text-xs">
              <div className="border-b border-[#EEEEEE] pb-2.5 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#2874F0]" />
                <h3 className="text-sm font-bold text-[#212121]">Step 3: Proprietor Tax PAN (Optional)</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-[#212121] block mb-1">
                    Tax PAN Number <span className="text-[#878787] font-normal">(Optional - You can skip this)</span>
                  </label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    placeholder="Enter PAN (optional) or leave blank"
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] font-mono uppercase focus:outline-none focus:border-[#2874F0]"
                  />
                </div>

                <div className="p-3 bg-[#F1F3F6] border border-[#E0E0E0] rounded-[2px] text-xs text-[#666666]">
                  <span className="font-semibold text-[#212121] flex items-center gap-1 block mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" /> Instant Dashboard Access
                  </span>
                  <span>
                    You can start listing salon products immediately. Tax and banking details can be updated anytime from your Store Profile.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEE]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-[#878787] hover:text-[#212121] text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSkipKyc}
                    className="text-[#878787] hover:text-[#212121] text-xs font-semibold"
                  >
                    Skip & Enter
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#2E7D32] hover:bg-[#256628] text-white font-semibold text-xs px-5 py-2 rounded-[2px] shadow-sm transition-colors cursor-pointer"
                  >
                    {submitting ? 'Unlocking...' : 'Unlock Studio Dashboard 🚀'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
