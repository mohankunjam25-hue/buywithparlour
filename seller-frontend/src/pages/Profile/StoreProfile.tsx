import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Building,
  CreditCard,
  Phone,
  MapPin,
  FileCheck,
  Mail,
  User,
  Save,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SellerNavbar } from '../../components/SellerNavbar';
import { useSellerStore } from '../../store/sellerStore';

export const StoreProfile: React.FC = () => {
  const { profile, updateProfile, fetchProfile, isLoading } = useSellerStore();
  const [activeTab, setActiveTab] = useState<'business' | 'bank' | 'compliance'>('business');

  // Form State bound to live Store Profile
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [ownerName, setOwnerName] = useState(profile.ownerName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [gstin, setGstin] = useState(profile.gstin);
  const [panNumber, setPanNumber] = useState(profile.panNumber || '');
  const [bankAccount, setBankAccount] = useState(profile.bankAccount);
  const [ifsc, setIfsc] = useState(profile.ifsc);
  const [holderName, setHolderName] = useState(profile.holderName);
  const [address, setAddress] = useState(profile.address);
  const [city, setCity] = useState(profile.city);
  const [state, setState] = useState(profile.state);
  const [pincode, setPincode] = useState(profile.pincode);

  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    setBusinessName(profile.businessName);
    setOwnerName(profile.ownerName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setGstin(profile.gstin);
    setPanNumber(profile.panNumber || '');
    setBankAccount(profile.bankAccount);
    setIfsc(profile.ifsc);
    setHolderName(profile.holderName);
    setAddress(profile.address);
    setCity(profile.city);
    setState(profile.state);
    setPincode(profile.pincode);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      businessName,
      ownerName,
      email,
      phone,
      gstin,
      panNumber,
      bankAccount,
      ifsc,
      holderName,
      address,
      city,
      state,
      pincode,
    });
    setToastMessage('✨ Merchant Store Profile & Settlement Details saved successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] text-[#212121] flex flex-col font-sans pb-16 md:pb-8">
      <SellerNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Toast Notice */}
        {toastMessage && (
          <div className="bg-[#E8F5E9] border border-[#2E7D32]/20 text-[#2E7D32] p-3 rounded-[2px] text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Profile Summary Header Card */}
        <div className="bg-white border border-[#EEEEEE] p-5 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[2px] bg-[#2874F0] text-white flex items-center justify-center font-bold text-lg">
              {profile.businessName ? profile.businessName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-[#212121]">
                  {profile.businessName || 'Seller Store'}
                </h1>
                <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded-[2px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#2E7D32]" /> VERIFIED MERCHANT
                </span>
              </div>
              <p className="text-xs text-[#666666] mt-0.5">
                Proprietor: <strong className="text-[#212121]">{profile.ownerName}</strong> • {profile.city}, {profile.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#878787] bg-slate-50 px-3 py-1.5 rounded-[2px] border border-[#E0E0E0]">
            <Clock className="w-3.5 h-3.5 text-[#2874F0]" />
            <span>Partner Since: <strong className="text-[#212121]">{profile.memberSince || '2026'}</strong></span>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
          {/* Left Tabs Navigation */}
          <div className="bg-white border border-[#EEEEEE] p-2 sm:p-3 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] flex flex-row lg:flex-col gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('business')}
              className={`flex-1 lg:w-full flex items-center gap-2 px-3 py-2.5 rounded-[2px] text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'business'
                  ? 'bg-[#2874F0] text-white font-bold'
                  : 'text-[#212121] hover:bg-slate-50'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Business Info</span>
            </button>

            <button
              onClick={() => setActiveTab('bank')}
              className={`flex-1 lg:w-full flex items-center gap-2 px-3 py-2.5 rounded-[2px] text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'bank'
                  ? 'bg-[#2874F0] text-white font-bold'
                  : 'text-[#212121] hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Bank & Payouts</span>
            </button>

            <button
              onClick={() => setActiveTab('compliance')}
              className={`flex-1 lg:w-full flex items-center gap-2 px-3 py-2.5 rounded-[2px] text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'compliance'
                  ? 'bg-[#2874F0] text-white font-bold'
                  : 'text-[#212121] hover:bg-slate-50'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Tax & KYC</span>
            </button>
          </div>

          {/* Right Form Body */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSave}
              className="bg-white border border-[#EEEEEE] p-5 sm:p-6 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-5"
            >
              {/* TAB 1: BUSINESS INFO */}
              {activeTab === 'business' && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div className="border-b border-[#EEEEEE] pb-2.5">
                    <h2 className="text-sm font-bold text-[#212121]">Business & Store Profile</h2>
                    <p className="text-xs text-[#878787]">Public salon information displayed on marketplace listings</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="font-semibold text-[#212121] block mb-1">Parlour / Business Name</label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full bg-white border border-[#E0E0E0] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-[#212121] block mb-1">Proprietor Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full bg-white border border-[#E0E0E0] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-[#212121] block mb-1">Merchant Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-[#E0E0E0] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-[#212121] block mb-1">Contact Phone</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white border border-[#E0E0E0] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-[#212121] block mb-1">Salon / Operating Address</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#878787] absolute left-3 top-2.5" />
                        <textarea
                          rows={2}
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-white border border-[#E0E0E0] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-[#212121] block mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#212121] block mb-1">State / Pincode</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                        />
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BANKING & PAYOUTS */}
              {activeTab === 'bank' && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div className="border-b border-[#EEEEEE] pb-2.5">
                    <h2 className="text-sm font-bold text-[#212121]">Settlement Bank Account & Direct Payouts</h2>
                    <p className="text-xs text-[#878787]">Weekly direct account transfers for customer orders</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="font-semibold text-[#212121] block mb-1">Account Holder Name</label>
                      <input
                        type="text"
                        required
                        value={holderName}
                        onChange={(e) => setHolderName(e.target.value)}
                        className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#212121] block mb-1">Bank Account Number</label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          className="w-full bg-white border border-[#E0E0E0] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#212121] font-mono focus:outline-none focus:border-[#2874F0]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-[#212121] block mb-1">IFSC Code</label>
                      <input
                        type="text"
                        required
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value)}
                        className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] font-mono uppercase focus:outline-none focus:border-[#2874F0]"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#F1F3F6] border border-[#E0E0E0] rounded-[2px] text-xs text-[#666666] space-y-1">
                    <span className="font-semibold text-[#212121] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#2874F0]" /> Automated Weekly Settlement
                    </span>
                    <p>
                      Sales revenue is settled directly into this bank account every Monday after standard 48-hour delivery confirmation.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: TAX & COMPLIANCE */}
              {activeTab === 'compliance' && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div className="border-b border-[#EEEEEE] pb-2.5">
                    <h2 className="text-sm font-bold text-[#212121]">Tax Compliance & Identification</h2>
                    <p className="text-xs text-[#878787]">Merchant regulatory records</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="font-semibold text-[#212121] block mb-1">GSTIN / Business Reg No</label>
                      <div className="relative">
                        <FileCheck className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value)}
                          className="w-full bg-white border border-[#E0E0E0] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#212121] font-mono uppercase focus:outline-none focus:border-[#2874F0]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-[#212121] block mb-1">Tax PAN (Optional)</label>
                      <input
                        type="text"
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value)}
                        placeholder="Optional"
                        className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] font-mono uppercase focus:outline-none focus:border-[#2874F0]"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#E8F5E9] border border-[#2E7D32]/20 rounded-[2px] flex items-center gap-2 text-xs text-[#2E7D32]">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>Your merchant profile is in good standing and approved for marketplace catalog listing.</span>
                  </div>
                </div>
              )}

              {/* Submit / Save Button */}
              <div className="flex items-center justify-end pt-3 border-t border-[#EEEEEE]">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#2874F0] hover:bg-[#1259c7] text-white font-semibold text-xs px-6 py-2 rounded-[2px] flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Saving...' : 'SAVE CHANGES'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
