import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Package,
  ShieldCheck,
  Plus,
  Trash2,
  Lock,
  CheckCircle2,
  Truck,
  Check,
  LogOut,
  AlertCircle,
  Sparkles,
  Loader2,
  ShoppingBag,
  Building,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api/axios';

type ProfileTab = 'orders' | 'addresses' | 'security';

export const CustomerProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  // Personal Info Form
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Address Manager
  const [addresses, setAddresses] = useState<any[]>(user?.addresses || []);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Delhi');
  const [newPincode, setNewPincode] = useState('');
  const [newAddressPhone, setNewAddressPhone] = useState('');
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  // Change Password Form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // If not logged in, redirect to home
  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Sync user state
  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setPhone(user.phone || '');
      setAddresses(user.addresses || []);
    }
  }, [user]);

  // Fetch Live Orders from MongoDB
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get('/orders');
      const list = res.data?.data?.orders || [];
      setOrders(list);
    } catch {
      // Fallback
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  // 1. Save Profile (Name, Phone)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileError('');
      setProfileSuccess('');

      await api.put('/users/profile', {
        name: fullName,
        phone: phone || undefined,
      });

      await checkAuth();
      setProfileSuccess('✨ Profile details updated successfully!');
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // 2. Add New Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAddressLoading(true);
      const res = await api.post('/users/addresses', {
        fullName: fullName || user?.name,
        phone: newAddressPhone || phone || '9876543210',
        street: newStreet,
        city: newCity,
        state: newState,
        pincode: newPincode,
        isDefault: isDefaultAddress,
      });

      setAddresses(res.data?.data?.addresses || []);
      await checkAuth();
      setShowAddressModal(false);
      setNewStreet('');
      setNewCity('');
      setNewPincode('');
      setNewAddressPhone('');
      setIsDefaultAddress(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add address');
    } finally {
      setAddressLoading(false);
    }
  };

  // 3. Delete Address
  const handleDeleteAddress = async (addrId: string) => {
    try {
      const res = await api.delete(`/users/addresses/${addrId}`);
      setAddresses(res.data?.data?.addresses || []);
      await checkAuth();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete address');
    }
  };

  // 4. Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPasswordLoading(true);
      setPasswordError('');
      setPasswordSuccess('');

      await api.put('/users/change-password', {
        oldPassword,
        newPassword,
      });

      setPasswordSuccess('🎉 Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // 5. Logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="py-6 max-w-7xl mx-auto space-y-5 font-sans pb-16">
      {/* 1. Header Profile Banner */}
      <section className="bg-white border border-[#EEEEEE] p-5 sm:p-6 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar Initials */}
          <div className="w-14 h-14 rounded-[4px] bg-[#2874F0] text-white flex items-center justify-center font-bold text-xl shadow-sm flex-shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-[#212121]">{user?.name || 'Customer Account'}</h1>
              <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded-[2px] flex items-center gap-1 border border-[#2E7D32]/20">
                <ShieldCheck className="w-3 h-3" /> VERIFIED BUYER
              </span>
            </div>

            <p className="text-xs text-[#878787]">
              {user?.email} {user?.phone && `• +91 ${user.phone}`}
            </p>

            <div className="flex items-center gap-1 text-[11px] text-[#2874F0] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BuyWithParlour Plus Member (Zero Delivery Fee on ₹1000+)</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-white border border-[#E0E0E0] hover:bg-slate-50 text-[#D32F2F] text-xs font-semibold px-4 py-2 rounded-[2px] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>LOGOUT</span>
        </button>
      </section>

      {/* 2. Main 2-Column Dashboard (Left Navigation, Right Content) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Navigation Sidebar */}
        <aside className="md:col-span-4 bg-white border border-[#EEEEEE] rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-[#EEEEEE] text-[10px] font-bold text-[#878787] uppercase tracking-wider">
            Account Navigation
          </div>

          <nav className="divide-y divide-[#EEEEEE] text-xs">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left p-3.5 flex items-center justify-between font-semibold transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#E3F2FD] text-[#2874F0] border-l-4 border-[#2874F0]'
                  : 'text-[#212121] hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>My Orders & Live Tracking</span>
              </span>
              <span className="bg-white px-2 py-0.5 rounded-[2px] text-[10px] font-bold border border-[#E0E0E0]">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left p-3.5 flex items-center justify-between font-semibold transition-colors cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-[#E3F2FD] text-[#2874F0] border-l-4 border-[#2874F0]'
                  : 'text-[#212121] hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Manage Saved Addresses</span>
              </span>
              <span className="bg-white px-2 py-0.5 rounded-[2px] text-[10px] font-bold border border-[#E0E0E0]">
                {addresses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left p-3.5 flex items-center justify-between font-semibold transition-colors cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#E3F2FD] text-[#2874F0] border-l-4 border-[#2874F0]'
                  : 'text-[#212121] hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Lock className="w-4 h-4" />
                <span>Personal Info & Security</span>
              </span>
            </button>
          </nav>
        </aside>

        {/* Right Main Content Panel */}
        <main className="md:col-span-8 space-y-4">
          {/* TAB 1: MY ORDERS & LIVE SHIPMENT TRACKER */}
          {activeTab === 'orders' && (
            <section className="space-y-3.5 animate-fade-in">
              <div className="flex items-center justify-between bg-white border border-[#EEEEEE] p-4 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
                <div>
                  <h2 className="text-sm font-bold text-[#212121] flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#2874F0]" />
                    <span>My Order History & Live Delivery Status</span>
                  </h2>
                  <p className="text-xs text-[#878787]">
                    Track active parcels, review formulation specs, and download invoices
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="bg-[#2874F0] hover:bg-[#1259c7] text-white text-xs font-semibold px-3 py-1.5 rounded-[2px] transition-colors"
                >
                  Shop More
                </Link>
              </div>

              {loadingOrders ? (
                <div className="bg-white border border-[#EEEEEE] p-8 rounded-[4px] flex items-center justify-center gap-2 text-[#2874F0]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs font-semibold">Fetching orders from MongoDB Atlas...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white border border-[#EEEEEE] p-10 rounded-[4px] text-center space-y-3 shadow-sm">
                  <ShoppingBag className="w-10 h-10 text-[#878787] mx-auto" />
                  <h3 className="text-sm font-bold text-[#212121]">No Orders Placed Yet</h3>
                  <p className="text-xs text-[#878787] max-w-sm mx-auto">
                    Explore our salon-grade skincare, hair spa treatments, and beauty supplies!
                  </p>
                  <Link
                    to="/shop"
                    className="inline-block bg-[#2874F0] text-white text-xs font-semibold px-6 py-2 rounded-[2px]"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                orders.map((ord: any) => {
                  const isDelivered = ord.orderStatus === 'DELIVERED';
                  const isShipped = ord.orderStatus === 'SHIPPED' || isDelivered;
                  const isPacked = ord.orderStatus === 'PACKED' || isShipped;

                  return (
                    <div
                      key={ord._id}
                      className="bg-white border border-[#EEEEEE] p-4 sm:p-5 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-4"
                    >
                      {/* Order Header Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEEEEE] pb-3 text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-[#212121]">
                            Order ID: <strong className="text-[#2874F0]">{ord.orderNumber}</strong>
                          </span>
                          <span className="text-[#878787] block text-[11px]">
                            Placed on {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="bg-[#E8F5E9] text-[#2E7D32] font-bold text-[10px] px-2 py-0.5 rounded-[2px] border border-[#2E7D32]/20 uppercase">
                            {ord.paymentMethod === 'ONLINE' ? 'ONLINE (PAID)' : 'CASH ON DELIVERY'}
                          </span>
                          <span className="font-bold text-sm text-[#212121]">₹{ord.totalAmount}</span>
                        </div>
                      </div>

                      {/* 4-Stage Visual Shipment Progress Tracker */}
                      <div className="bg-slate-50 border border-[#E0E0E0] p-3 rounded-[2px]">
                        <span className="text-[10px] font-bold text-[#878787] uppercase tracking-wider block mb-2">
                          Live Delivery Tracking:
                        </span>
                        <div className="flex items-center justify-between text-xs font-semibold gap-1">
                          {/* 1. Confirmed */}
                          <div className="flex items-center gap-1.5 text-[#2E7D32]">
                            <div className="w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-[10px] font-bold">
                              <Check className="w-3 h-3" />
                            </div>
                            <span className="hidden sm:inline text-[11px]">Confirmed</span>
                          </div>

                          <div className={`flex-1 h-[2px] ${isPacked ? 'bg-[#2E7D32]' : 'bg-[#E0E0E0]'}`} />

                          {/* 2. Packed */}
                          <div className={`flex items-center gap-1.5 ${isPacked ? 'text-[#2E7D32]' : 'text-[#878787]'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isPacked ? 'bg-[#2E7D32] text-white' : 'bg-slate-200 text-[#878787]'}`}>
                              {isPacked ? <Check className="w-3 h-3" /> : '2'}
                            </div>
                            <span className="hidden sm:inline text-[11px]">Packed</span>
                          </div>

                          <div className={`flex-1 h-[2px] ${isShipped ? 'bg-[#2E7D32]' : 'bg-[#E0E0E0]'}`} />

                          {/* 3. Shipped */}
                          <div className={`flex items-center gap-1.5 ${isShipped ? 'text-[#2E7D32]' : 'text-[#878787]'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isShipped ? 'bg-[#2E7D32] text-white' : 'bg-slate-200 text-[#878787]'}`}>
                              {isShipped ? <Truck className="w-3 h-3" /> : '3'}
                            </div>
                            <span className="hidden sm:inline text-[11px]">In Transit</span>
                          </div>

                          <div className={`flex-1 h-[2px] ${isDelivered ? 'bg-[#2E7D32]' : 'bg-[#E0E0E0]'}`} />

                          {/* 4. Delivered */}
                          <div className={`flex items-center gap-1.5 ${isDelivered ? 'text-[#2E7D32]' : 'text-[#878787]'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isDelivered ? 'bg-[#2E7D32] text-white' : 'bg-slate-200 text-[#878787]'}`}>
                              {isDelivered ? <Check className="w-3 h-3" /> : '4'}
                            </div>
                            <span className="hidden sm:inline text-[11px]">Delivered</span>
                          </div>
                        </div>
                      </div>

                      {/* Items in this Order */}
                      <div className="space-y-2 text-xs">
                        {ord.items?.map((it: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-[2px] transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-[2px] bg-slate-100 border border-[#E0E0E0] overflow-hidden flex-shrink-0">
                                <img
                                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=80"
                                  alt=""
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <span className="font-semibold text-[#212121] block truncate max-w-sm">
                                  {it.title || 'Beauty Parlour Product Item'}
                                </span>
                                <span className="text-[10px] text-[#878787]">
                                  Qty: {it.quantity || 1} • {it.variantSku || 'Standard Pack'}
                                </span>
                              </div>
                            </div>

                            <span className="font-bold text-[#212121]">₹{it.price || it.subtotal || 499}</span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address Snapshot */}
                      {ord.shippingAddress && (
                        <div className="text-[11px] text-[#878787] border-t border-[#EEEEEE] pt-2 flex items-center justify-between">
                          <span>
                            Delivery to: <strong className="text-[#212121]">{ord.shippingAddress.fullName || user?.name}</strong>,{' '}
                            {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.pincode}
                          </span>
                          <span className="text-[#2874F0] font-semibold">Delivery by Safe Express</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </section>
          )}

          {/* TAB 2: MANAGE SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <section className="bg-white border border-[#EEEEEE] p-5 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-4 animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
                <div>
                  <h2 className="text-sm font-bold text-[#212121]">Saved Delivery Addresses</h2>
                  <p className="text-xs text-[#878787]">Manage your home, clinic, or beauty parlour delivery points</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(true)}
                  className="bg-[#2874F0] hover:bg-[#1259c7] text-white font-semibold text-xs px-3.5 py-1.5 rounded-[2px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD NEW ADDRESS</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <MapPin className="w-8 h-8 text-[#878787] mx-auto" />
                  <p className="font-semibold text-[#212121]">No saved addresses found.</p>
                  <p className="text-[#878787]">Add your address for 1-click checkout experience!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {addresses.map((addr: any, idx: number) => (
                    <div
                      key={addr._id || addr.id || idx}
                      className="border border-[#E0E0E0] rounded-[4px] p-3.5 space-y-2 relative bg-white hover:border-[#2874F0] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#212121] flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-[#2874F0]" />
                          <span>{addr.fullName || user?.name}</span>
                        </span>
                        {addr.isDefault && (
                          <span className="bg-[#E8F5E9] text-[#2E7D32] text-[9px] font-bold px-1.5 py-0.5 rounded-[2px]">
                            DEFAULT
                          </span>
                        )}
                      </div>

                      <p className="text-[#666666] leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>

                      <div className="text-[11px] text-[#878787]">
                        Phone: <strong className="text-[#212121]">{addr.phone || user?.phone || '9876543210'}</strong>
                      </div>

                      <div className="pt-2 border-t border-[#EEEEEE] flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr._id || addr.id)}
                          className="text-[#D32F2F] hover:underline flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 3: PERSONAL INFO & ACCOUNT SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4 animate-fade-in text-xs">
              {/* Profile Details Form */}
              <section className="bg-white border border-[#EEEEEE] p-5 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-4">
                <div className="border-b border-[#EEEEEE] pb-2.5">
                  <h2 className="text-sm font-bold text-[#212121]">Personal Information</h2>
                  <p className="text-xs text-[#878787]">Update your account details and contact preferences</p>
                </div>

                {profileSuccess && (
                  <div className="bg-[#E8F5E9] border border-[#2E7D32]/20 text-[#2E7D32] p-2.5 rounded-[2px] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                {profileError && (
                  <div className="bg-[#FFEBEE] border border-[#D32F2F]/20 text-[#D32F2F] p-2.5 rounded-[2px] font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-3 max-w-md">
                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-slate-50 border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#878787] cursor-not-allowed"
                    />
                    <span className="text-[10px] text-[#878787] mt-0.5 block">Email cannot be changed directly</span>
                  </div>

                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">
                      Mobile Number <span className="text-[#878787] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-[#2874F0] hover:bg-[#1259c7] text-white font-semibold text-xs px-6 py-2 rounded-[2px] transition-colors cursor-pointer"
                  >
                    {savingProfile ? 'SAVING...' : 'SAVE CHANGES'}
                  </button>
                </form>
              </section>

              {/* Password & Security Form */}
              <section className="bg-white border border-[#EEEEEE] p-5 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-4">
                <div className="border-b border-[#EEEEEE] pb-2.5">
                  <h2 className="text-sm font-bold text-[#212121]">Account Password & Login Security</h2>
                  <p className="text-xs text-[#878787]">Change your account password securely</p>
                </div>

                {passwordSuccess && (
                  <div className="bg-[#E8F5E9] border border-[#2E7D32]/20 text-[#2E7D32] p-2.5 rounded-[2px] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="bg-[#FFEBEE] border border-[#D32F2F]/20 text-[#D32F2F] p-2.5 rounded-[2px] font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">Current Password *</label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#212121] block mb-1">New Password * (Min 6 characters)</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-[#2874F0] hover:bg-[#1259c7] text-white font-semibold text-xs px-6 py-2 rounded-[2px] transition-colors cursor-pointer"
                  >
                    {passwordLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                  </button>
                </form>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Address Creation Lightbox Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-[#212121]/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E0E0E0] rounded-[4px] max-w-md w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-2.5">
              <h3 className="text-sm font-bold text-[#212121]">Add New Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-[#878787] hover:text-[#212121] p-1">✕</button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="font-semibold text-[#212121] block mb-1">Flat / House No / Street Address *</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="e.g. Flat 302, Royal Residency"
                  className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#212121] block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Jaipur"
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#212121] block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    placeholder="e.g. Rajasthan"
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#212121] block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    placeholder="302001"
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#212121] block mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={newAddressPhone}
                    onChange={(e) => setNewAddressPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefaultAddress}
                  onChange={(e) => setIsDefaultAddress(e.target.checked)}
                  className="rounded text-[#2874F0]"
                />
                <span className="font-semibold text-[#212121]">Make this my default delivery address</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EEEEEE]">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-[#212121] text-xs font-semibold px-3 py-1.5 rounded-[2px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressLoading}
                  className="bg-[#2874F0] hover:bg-[#1259c7] text-white text-xs font-semibold px-4 py-1.5 rounded-[2px] cursor-pointer"
                >
                  {addressLoading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
