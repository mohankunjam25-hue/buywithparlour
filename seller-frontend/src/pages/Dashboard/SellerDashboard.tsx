import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Package,
  AlertCircle,
  Loader2,
  FileEdit,
  Trash2,
  Layers,
  RotateCcw,
} from 'lucide-react';
import axios from 'axios';
import { SellerNavbar } from '../../components/SellerNavbar';
import { useSellerStore } from '../../store/sellerStore';
import api from '../../services/api';

type QCTabFilter = 'ALL' | 'LIVE' | 'IN_QC' | 'QC_FAILED' | 'DRAFT';

interface ProductItem {
  _id: string;
  title: string;
  brand: string;
  sku?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  approvalStatus: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  isPublished: boolean;
  slug?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useSellerStore();
  const [activeTab, setActiveTab] = useState<QCTabFilter>('ALL');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/seller/products');
      setProducts(res.data?.data?.products || []);
    } catch {
      // Keep existing
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
    const interval = setInterval(fetchSellerProducts, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/seller/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Status Filter Counts
  const allCount = products.length;
  const liveCount = products.filter((p) => p.approvalStatus === 'APPROVED').length;
  const inQcCount = products.filter((p) => p.approvalStatus === 'PENDING').length;
  const qcFailedCount = products.filter((p) => p.approvalStatus === 'REJECTED').length;
  const draftCount = products.filter((p) => p.approvalStatus === 'DRAFT').length;

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'LIVE') return p.approvalStatus === 'APPROVED';
    if (activeTab === 'IN_QC') return p.approvalStatus === 'PENDING';
    if (activeTab === 'QC_FAILED') return p.approvalStatus === 'REJECTED';
    if (activeTab === 'DRAFT') return p.approvalStatus === 'DRAFT';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F1F3F6] text-[#212121] flex flex-col font-sans pb-16 md:pb-8">
      <SellerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Dynamic Welcome Header Card */}
        <section className="bg-[#2874F0] p-5 sm:p-6 rounded-[4px] text-white shadow-[0_1px_4px_rgba(0,0,0,0.12)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                {profile.businessName || 'Seller Studio'}
              </h1>
            </div>
            <p className="text-xs text-white/90 max-w-xl">
              Proprietor: <strong>{profile.ownerName}</strong> • Flipkart QC Pipeline & Listing Management Desk
            </p>
          </div>

          <Link
            to="/add-product"
            className="bg-white hover:bg-slate-100 text-[#2874F0] font-semibold text-xs px-5 py-2 rounded-[2px] shadow-sm flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#2874F0]" />
            <span>LIST NEW PRODUCT</span>
          </Link>
        </section>

        {/* Responsive KPI Metrics Grid (1 col mobile, 2 col tablet, 4 col desktop) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white border border-[#EEEEEE] p-4 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#878787]">Total Listed Items</span>
              <Package className="w-4 h-4 text-[#2874F0]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#212121]">{allCount}</span>
              <span className="text-[11px] text-[#878787]">Products</span>
            </div>
          </div>

          <div className="bg-white border border-[#EEEEEE] p-4 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#878787]">Live on Marketplace</span>
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#2E7D32]">{liveCount}</span>
              <span className="text-[11px] text-[#2E7D32] font-semibold">Active (QC Passed)</span>
            </div>
          </div>

          <div className="bg-white border border-[#EEEEEE] p-4 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#878787]">Under QC Audit</span>
              <Clock className="w-4 h-4 text-[#ED6C02]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#ED6C02]">{inQcCount}</span>
              <span className="text-[11px] text-[#ED6C02]">In Moderation</span>
            </div>
          </div>

          <div className="bg-white border border-[#EEEEEE] p-4 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#878787]">Action Required</span>
              <XCircle className="w-4 h-4 text-[#D32F2F]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#D32F2F]">{qcFailedCount}</span>
              <span className="text-[11px] text-[#D32F2F]">QC Failed</span>
            </div>
          </div>
        </section>

        {/* Flipkart QC Status Tabs & Product Catalog */}
        <section className="bg-white border border-[#EEEEEE] rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Status Tabs Bar */}
          <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-[#EEEEEE] overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-2 rounded-[2px] whitespace-nowrap transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-white text-[#2874F0] font-bold shadow-sm border border-[#E0E0E0]'
                  : 'text-[#878787] hover:text-[#212121]'
              }`}
            >
              All Listings ({allCount})
            </button>

            <button
              onClick={() => setActiveTab('LIVE')}
              className={`px-3 py-2 rounded-[2px] whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'LIVE'
                  ? 'bg-white text-[#2E7D32] font-bold shadow-sm border border-[#E0E0E0]'
                  : 'text-[#878787] hover:text-[#212121]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Live Active ({liveCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('IN_QC')}
              className={`px-3 py-2 rounded-[2px] whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'IN_QC'
                  ? 'bg-white text-[#ED6C02] font-bold shadow-sm border border-[#E0E0E0]'
                  : 'text-[#878787] hover:text-[#212121]'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#ED6C02]" />
              <span>Under QC Audit ({inQcCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('QC_FAILED')}
              className={`px-3 py-2 rounded-[2px] whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'QC_FAILED'
                  ? 'bg-white text-[#D32F2F] font-bold shadow-sm border border-[#E0E0E0]'
                  : 'text-[#878787] hover:text-[#212121]'
              }`}
            >
              <XCircle className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>QC Failed / Needs Edit ({qcFailedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('DRAFT')}
              className={`px-3 py-2 rounded-[2px] whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'DRAFT'
                  ? 'bg-white text-[#212121] font-bold shadow-sm border border-[#E0E0E0]'
                  : 'text-[#878787] hover:text-[#212121]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#878787]" />
              <span>Drafts ({draftCount})</span>
            </button>
          </div>

          {/* Table Body */}
          <div className="p-4 sm:p-5 space-y-3.5">
            {loading ? (
              <div className="p-8 flex items-center justify-center gap-2 text-[#2874F0]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs font-semibold">Loading catalog from database...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Package className="w-8 h-8 text-[#878787] mx-auto" />
                <p className="text-xs font-semibold text-[#878787]">No listings found in this tab.</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#E0E0E0] text-[#878787] font-semibold uppercase tracking-wider">
                      <th className="p-2.5">Product & SKU</th>
                      <th className="p-2.5">Brand</th>
                      <th className="p-2.5">Price</th>
                      <th className="p-2.5">Stock</th>
                      <th className="p-2.5">QC Status</th>
                      <th className="p-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEEEEE] text-[#212121]">
                    {filteredProducts.map((prod) => (
                      <tr key={prod._id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5">
                          <div className="flex items-center gap-2.5">
                            {prod.images && prod.images[0] && (
                              <img
                                src={prod.images[0]}
                                alt=""
                                className="w-9 h-9 rounded-[2px] object-contain border border-[#E0E0E0] p-0.5 flex-shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <strong className="font-semibold block truncate max-w-xs">{prod.title}</strong>
                              <span className="text-[10px] text-[#878787] font-mono">{prod.sku || 'SKU-STANDARD'}</span>
                            </div>
                          </div>

                          {prod.rejectionReason && (
                            <div className="text-[11px] text-[#D32F2F] flex items-start gap-1 mt-1.5 bg-[#FFEBEE] p-2 rounded-[2px] border border-[#D32F2F]/20">
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                              <div>
                                <strong className="block font-bold">Auditor Feedback:</strong>
                                <span>{prod.rejectionReason}</span>
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="p-2.5 text-[#666666]">{prod.brand}</td>

                        <td className="p-2.5">
                          <span className="font-bold text-[#212121]">₹{prod.discountPrice || prod.price}</span>
                          {prod.discountPrice && (
                            <span className="text-[#878787] line-through text-[11px] ml-1">₹{prod.price}</span>
                          )}
                        </td>

                        <td className="p-2.5 font-medium">{prod.stock} units</td>

                        <td className="p-2.5">
                          {prod.approvalStatus === 'APPROVED' && (
                            <span className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                              <CheckCircle2 className="w-3 h-3" /> QC PASSED (LIVE)
                            </span>
                          )}
                          {prod.approvalStatus === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 bg-[#FFF3E0] text-[#ED6C02] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                              <Clock className="w-3 h-3" /> UNDER QC AUDIT
                            </span>
                          )}
                          {prod.approvalStatus === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1 bg-[#FFEBEE] text-[#D32F2F] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                              <XCircle className="w-3 h-3" /> QC FAILED
                            </span>
                          )}
                          {prod.approvalStatus === 'DRAFT' && (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-[#878787] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                              <Layers className="w-3 h-3" /> DRAFT
                            </span>
                          )}
                        </td>

                        <td className="p-2.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {prod.approvalStatus === 'APPROVED' && (
                              <a
                                href="http://localhost:5173/shop"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2874F0] hover:underline"
                              >
                                <span>View Store</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}

                            {prod.approvalStatus === 'REJECTED' && (
                              <button
                                onClick={() => navigate(`/add-product?editId=${prod._id}`)}
                                className="bg-[#2874F0] hover:bg-[#1259c7] text-white text-[11px] font-bold px-2.5 py-1 rounded-[2px] flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Fix & Resubmit</span>
                              </button>
                            )}

                            {prod.approvalStatus === 'DRAFT' && (
                              <button
                                onClick={() => navigate(`/add-product?editId=${prod._id}`)}
                                className="bg-slate-100 hover:bg-slate-200 text-[#212121] text-[11px] font-semibold px-2 py-1 rounded-[2px] flex items-center gap-1 cursor-pointer"
                              >
                                <FileEdit className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                            )}

                            <button
                              onClick={() => setDeleteConfirmId(prod._id)}
                              title="Delete listing"
                              className="text-[#878787] hover:text-[#D32F2F] p-1 rounded-[2px] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-[#212121]/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E0E0E0] rounded-[4px] max-w-sm w-full p-5 space-y-3.5 shadow-xl">
            <div className="flex items-center gap-2 text-[#D32F2F]">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-sm font-bold">Delete Product Listing?</h3>
            </div>
            <p className="text-xs text-[#666666]">
              Are you sure you want to permanently delete this listing from your seller catalog?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EEEEEE]">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="bg-slate-100 hover:bg-slate-200 text-[#212121] text-xs font-semibold px-3 py-1.5 rounded-[2px]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="bg-[#D32F2F] hover:bg-[#b71c1c] text-white text-xs font-semibold px-4 py-1.5 rounded-[2px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
