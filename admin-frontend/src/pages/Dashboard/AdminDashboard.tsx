import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Check,
  Eye,
  Loader2,
} from 'lucide-react';
import axios from 'axios';
import { Sidebar, AdminTab } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import api from '../../services/api';
import { OverviewTab } from './OverviewTab';
import { OrdersTab } from './OrdersTab';
import { CouponsTab } from './CouponsTab';
import { SettingsTab } from './SettingsTab';

interface ProductItem {
  _id: string;
  title: string;
  brand: string;
  sku?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  description: string;
  highlights?: string[];
  ingredients?: string;
  howToUse?: string;
  hsnCode?: string;
  category?: { name: string; slug?: string };
  seller?: { name: string; businessName?: string; location?: string; verified?: boolean };
  images: string[];
  submittedAt?: string;
  createdAt?: string;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductPreview, setSelectedProductPreview] = useState<ProductItem | null>(null);

  const [pendingProducts, setPendingProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvedProductsCount, setApprovedProductsCount] = useState(148);
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const quickRejectionTags = [
    'Missing Formulation / Ingredients List',
    'Low Resolution Product Image',
    'Inaccurate Title or Category Formatting',
    'Pricing MRP Discrepancy',
    'Incomplete Highlights / Features',
  ];

  const fetchModerationQueue = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/products/pending');
      const items = res.data?.data?.products || [];
      setPendingProducts(items);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationQueue();
    const interval = setInterval(fetchModerationQueue, 4000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleApprove = async (productId: string) => {
    try {
      await api.patch(`/admin/products/${productId}/approve`);
      setPendingProducts((prev) => prev.filter((p) => p._id !== productId));
      setApprovedProductsCount((prev) => prev + 1);
      setSelectedProductPreview(null);
      setActionSuccess('✨ Product QC PASSED & Published live to Customer Marketplace!');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleReject = async (productId: string) => {
    const reason = rejectionReason.trim() || 'Product details do not satisfy marketplace quality standards.';
    try {
      await api.patch(`/admin/products/${productId}/reject`, { rejectionReason: reason });
      setPendingProducts((prev) => prev.filter((p) => p._id !== productId));
      setRejectionModalId(null);
      setRejectionReason('');
      setSelectedProductPreview(null);
      setActionSuccess('🚫 Product QC FAILED. Feedback dispatched to Seller Partner for resubmission.');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] text-[#212121] flex font-sans">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingProducts.length}
      />

      {/* 2. Main Executive Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pendingCount={pendingProducts.length}
        />

        {/* Content Body */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Toast Notice */}
          {actionSuccess && (
            <div className="bg-[#E8F5E9] border border-[#2E7D32]/20 text-[#2E7D32] p-3 rounded-[2px] text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <OverviewTab
              pendingCount={pendingProducts.length}
              catalogCount={approvedProductsCount}
              sellersCount={28}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 2: MODERATION QUEUE (FLIPKART QC GATE) */}
          {activeTab === 'queue' && (
            <section className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0E0E0] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#212121] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#ED6C02]" />
                    <span>Flipkart Quality Check (QC) Moderation Gate</span>
                  </h3>
                  <p className="text-xs text-[#878787]">
                    Inspect photography, formulation safety, pricing integrity, and seller parameters
                  </p>
                </div>

                <span className="bg-[#FFF3E0] text-[#ED6C02] text-xs font-bold px-2.5 py-1 rounded-[2px] border border-[#ED6C02]/20">
                  UNDER QC REVIEW ({pendingProducts.length})
                </span>
              </div>

              {loading && pendingProducts.length === 0 ? (
                <div className="bg-white border border-[#EEEEEE] p-10 rounded-[4px] flex items-center justify-center gap-2 text-[#2874F0] shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs font-semibold">Loading moderation queue...</span>
                </div>
              ) : pendingProducts.length === 0 ? (
                <div className="bg-white border border-[#EEEEEE] p-10 rounded-[4px] text-center space-y-2 shadow-sm">
                  <div className="w-12 h-12 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-[#212121]">QC Moderation Queue is Clear</h4>
                  <p className="text-xs text-[#878787] max-w-md mx-auto">
                    Every seller-submitted product has been audited. New listings will arrive here in real time.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pendingProducts.map((prod) => (
                    <div
                      key={prod._id}
                      className="bg-white border border-[#EEEEEE] p-4 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                    >
                      {/* Product Visual & Specs */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div
                          onClick={() => setSelectedProductPreview(prod)}
                          className="w-20 h-20 rounded-[2px] bg-slate-50 border border-[#E0E0E0] overflow-hidden flex-shrink-0 cursor-pointer relative group"
                        >
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=60'}
                            alt={prod.title}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        <div className="space-y-1 flex-1 min-w-0 text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-[#2874F0] text-white font-bold text-[10px] px-2 py-0.5 rounded-[2px] uppercase">
                              {prod.brand}
                            </span>
                            <span className="text-[#878787] font-semibold">
                              {prod.category?.name || 'Beauty & Personal Care'}
                            </span>
                            <span className="text-[#878787] font-mono text-[10px]">
                              SKU: {prod.sku || 'N/A'}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#212121] truncate">{prod.title}</h4>
                          <p className="text-xs text-[#666666] line-clamp-1">
                            {prod.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                            <div>
                              <span className="text-[#878787]">Price: </span>
                              <strong className="text-[#212121]">₹{prod.discountPrice || prod.price}</strong>
                              {prod.discountPrice && (
                                <span className="text-[#878787] line-through text-[11px] ml-1">₹{prod.price}</span>
                              )}
                            </div>

                            <div>
                              <span className="text-[#878787]">Stock: </span>
                              <strong className="text-[#212121]">{prod.stock} units</strong>
                            </div>

                            <div>
                              <span className="text-[#878787]">Seller: </span>
                              <strong className="text-[#2874F0]">{prod.seller?.businessName || prod.seller?.name || 'Verified Partner'}</strong>
                            </div>

                            <div>
                              <span className="text-[#878787]">Photos: </span>
                              <strong className="text-[#212121]">{prod.images?.length || 1} Images</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* QC Action Buttons */}
                      <div className="flex flex-row lg:flex-col items-stretch gap-2 flex-shrink-0 w-full lg:w-44">
                        <button
                          onClick={() => setSelectedProductPreview(prod)}
                          className="bg-slate-100 hover:bg-slate-200 text-[#212121] font-semibold text-xs py-1.5 px-3 rounded-[2px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Listing</span>
                        </button>

                        <button
                          onClick={() => handleApprove(prod._id)}
                          className="flex-1 bg-[#2E7D32] hover:bg-[#256628] text-white font-semibold text-xs py-2 px-3 rounded-[2px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>QC Pass & Publish</span>
                        </button>

                        <button
                          onClick={() => setRejectionModalId(prod._id)}
                          className="flex-1 bg-[#FFEBEE] hover:bg-rose-100 text-[#D32F2F] font-semibold text-xs py-1.5 px-3 rounded-[2px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>QC Fail (Feedback)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 3: MARKETPLACE CATALOG */}
          {activeTab === 'catalog' && (
            <section className="bg-white border border-[#EEEEEE] p-5 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEEEEE] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#212121]">Live Marketplace Catalog</h3>
                  <p className="text-xs text-[#878787]">
                    Synchronized with Customer Marketplace on Port 5173
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-[2px]">
                  {approvedProductsCount} Approved & Published
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E0E0E0] text-[#878787] font-semibold uppercase tracking-wider">
                      <th className="p-2.5">Product Name</th>
                      <th className="p-2.5">Brand</th>
                      <th className="p-2.5">Price</th>
                      <th className="p-2.5">Stock</th>
                      <th className="p-2.5">Rating</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEEEEE] text-[#212121]">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold">Vitamin C Face Serum with Hyaluronic Acid (30ml)</td>
                      <td className="p-2.5 text-[#666666]">GlowSkin Pro</td>
                      <td className="p-2.5 font-bold">₹499</td>
                      <td className="p-2.5">50 units</td>
                      <td className="p-2.5 font-semibold text-[#2E7D32]">4.8 ★</td>
                      <td className="p-2.5 text-right">
                        <span className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                          <Check className="w-3 h-3" /> QC PASSED (LIVE)
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold">Organic Herbal Hair Spa Oil (200ml)</td>
                      <td className="p-2.5 text-[#666666]">NatureRoots Organic</td>
                      <td className="p-2.5 font-bold">₹499</td>
                      <td className="p-2.5">45 units</td>
                      <td className="p-2.5 font-semibold text-[#2E7D32]">4.9 ★</td>
                      <td className="p-2.5 text-right">
                        <span className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                          <Check className="w-3 h-3" /> QC PASSED (LIVE)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 4: SELLERS */}
          {activeTab === 'sellers' && (
            <section className="bg-white border border-[#EEEEEE] p-5 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#212121]">Registered Parlour Sellers</h3>
                  <p className="text-xs text-[#878787]">Merchant KYC verification and listing rights</p>
                </div>
                <span className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-[2px]">
                  28 Verified Active Sellers
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E0E0E0] text-[#878787] font-semibold uppercase tracking-wider">
                      <th className="p-2.5">Business Name</th>
                      <th className="p-2.5">Proprietor</th>
                      <th className="p-2.5">City</th>
                      <th className="p-2.5">Listed Items</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEEEEE] text-[#212121]">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold">Pooja Beauty Lounge & Spa Supplies</td>
                      <td className="p-2.5">Pooja Sharma</td>
                      <td className="p-2.5 text-[#666666]">Jaipur, RJ</td>
                      <td className="p-2.5 font-semibold">12 Products</td>
                      <td className="p-2.5 text-right">
                        <span className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                          <Check className="w-3 h-3" /> VERIFIED SELLER
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 5: ORDERS */}
          {activeTab === 'orders' && <OrdersTab />}

          {/* TAB 6: COUPONS */}
          {activeTab === 'coupons' && <CouponsTab />}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>

      {/* QC Full Inspection Lightbox Modal */}
      {selectedProductPreview && (
        <div className="fixed inset-0 bg-[#212121]/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E0E0E0] rounded-[4px] max-w-2xl w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-2.5">
              <div>
                <span className="bg-[#2874F0] text-white font-bold text-[10px] px-2 py-0.5 rounded-[2px] uppercase">
                  {selectedProductPreview.brand}
                </span>
                <h3 className="text-base font-bold text-[#212121] mt-1">{selectedProductPreview.title}</h3>
                <span className="text-[11px] text-[#878787] font-mono">SKU: {selectedProductPreview.sku || 'N/A'} • HSN: {selectedProductPreview.hsnCode || '33049900'}</span>
              </div>
              <button
                onClick={() => setSelectedProductPreview(null)}
                className="text-[#878787] hover:text-[#212121] text-xs font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {/* Photo Inspection Gallery */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#878787] uppercase tracking-wider block">
                Submitted Photography ({selectedProductPreview.images?.length || 1} Photos)
              </span>
              <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-50 border border-[#E0E0E0] rounded-[2px]">
                {selectedProductPreview.images?.map((img, i) => (
                  <div key={i} className="w-20 h-20 rounded-[2px] bg-white border border-[#E0E0E0] p-1 flex-shrink-0 overflow-hidden relative">
                    <img src={img} alt="Angle" className="w-full h-full object-contain" />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-[#2874F0] text-white text-[8px] font-bold px-1 rounded-[2px]">COVER</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights & Formulation Specs */}
            <div className="space-y-3 text-xs border-t border-[#EEEEEE] pt-3">
              <div>
                <span className="font-bold text-[#212121] block mb-1">Key Highlights:</span>
                <ul className="list-disc list-inside text-[#666666] space-y-0.5">
                  {selectedProductPreview.highlights?.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>

              {selectedProductPreview.ingredients && (
                <div>
                  <span className="font-bold text-[#212121] block mb-0.5">Formulation Ingredients:</span>
                  <p className="text-[#666666] bg-slate-50 p-2 rounded-[2px] border border-[#E0E0E0]">{selectedProductPreview.ingredients}</p>
                </div>
              )}

              <div>
                <span className="font-bold text-[#212121] block mb-0.5">Full Description:</span>
                <p className="text-[#666666]">{selectedProductPreview.description}</p>
              </div>

              <div className="flex items-baseline gap-2 pt-1 border-t border-[#EEEEEE]">
                <span className="font-bold text-[#212121]">Selling Price:</span>
                <span className="text-base font-bold text-[#2E7D32]">₹{selectedProductPreview.discountPrice || selectedProductPreview.price}</span>
                {selectedProductPreview.discountPrice && (
                  <span className="text-xs text-[#878787] line-through">₹{selectedProductPreview.price}</span>
                )}
                <span className="text-[#878787] ml-4">Stock: <strong>{selectedProductPreview.stock} units</strong></span>
              </div>
            </div>

            {/* QC Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EEEEEE]">
              <button
                onClick={() => {
                  setRejectionModalId(selectedProductPreview._id);
                  setSelectedProductPreview(null);
                }}
                className="bg-[#FFEBEE] hover:bg-rose-100 text-[#D32F2F] text-xs font-semibold px-4 py-2 rounded-[2px] cursor-pointer"
              >
                QC Fail (Send Feedback)
              </button>
              <button
                onClick={() => handleApprove(selectedProductPreview._id)}
                className="bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-semibold px-6 py-2 rounded-[2px] cursor-pointer"
              >
                QC Pass & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QC Rejection Feedback Modal */}
      {rejectionModalId && (
        <div className="fixed inset-0 bg-[#212121]/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E0E0E0] rounded-[4px] max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#D32F2F] border-b border-[#EEEEEE] pb-2.5">
              <XCircle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-[#212121]">QC Fail Product Submission</h3>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#878787] uppercase tracking-wider block">
                Quick Reason Tags:
              </span>
              <div className="flex flex-wrap gap-1">
                {quickRejectionTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setRejectionReason(tag)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-[#212121] px-2 py-0.5 rounded-[2px] border border-[#E0E0E0] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#212121] block mb-1">Auditor Feedback Note *</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain what the seller needs to rectify..."
                className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-2 text-xs text-[#212121] focus:outline-none focus:border-[#D32F2F]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EEEEEE]">
              <button
                onClick={() => setRejectionModalId(null)}
                className="bg-slate-100 hover:bg-slate-200 text-[#212121] text-xs font-semibold px-3 py-1.5 rounded-[2px]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectionModalId)}
                className="bg-[#D32F2F] hover:bg-[#b71c1c] text-white text-xs font-semibold px-4 py-1.5 rounded-[2px] cursor-pointer"
              >
                Confirm QC Failure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
