import React, { useState } from 'react';
import { TicketPercent, Plus, CheckCircle2, Trash2, Calendar, Tag } from 'lucide-react';

interface CouponItem {
  id: string;
  code: string;
  discountPercentage: number;
  minOrderValue: number;
  maxDiscountCap: number;
  validUntil: string;
  usageCount: number;
  status: 'ACTIVE' | 'EXPIRED';
}

export const CouponsTab: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponItem[]>([
    {
      id: '1',
      code: 'PARLOUR10',
      discountPercentage: 10,
      minOrderValue: 999,
      maxDiscountCap: 200,
      validUntil: '31 Dec 2026',
      usageCount: 142,
      status: 'ACTIVE',
    },
    {
      id: '2',
      code: 'BEAUTY20',
      discountPercentage: 20,
      minOrderValue: 1499,
      maxDiscountCap: 500,
      validUntil: '30 Sep 2026',
      usageCount: 89,
      status: 'ACTIVE',
    },
    {
      id: '3',
      code: 'FESTIVE50',
      discountPercentage: 50,
      minOrderValue: 2999,
      maxDiscountCap: 1000,
      validUntil: '15 Aug 2026',
      usageCount: 310,
      status: 'ACTIVE',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('15');
  const [minOrder, setMinOrder] = useState('999');
  const [toastMessage, setToastMessage] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const created: CouponItem = {
      id: Date.now().toString(),
      code: newCode.trim().toUpperCase(),
      discountPercentage: Number(discountPercent),
      minOrderValue: Number(minOrder),
      maxDiscountCap: Number(discountPercent) * 20,
      validUntil: '31 Dec 2026',
      usageCount: 0,
      status: 'ACTIVE',
    };

    setCoupons([created, ...coupons]);
    setShowCreateModal(false);
    setNewCode('');
    setToastMessage(`Coupon ${created.code} successfully launched live!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
    setToastMessage('Coupon removed from platform.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Coupons Main Card */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TicketPercent className="w-5 h-5 text-emerald-600" />
              <span>Promotional Coupons & Festival Discounts Studio</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Create and manage checkout discount promo codes for beauty parlour customers
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Promo Code</span>
          </button>
        </div>

        {/* Coupons List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 hover:border-emerald-400 transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="bg-emerald-100 text-emerald-800 font-black text-sm px-3 py-1 rounded-xl border border-emerald-200 tracking-wider">
                  {coupon.code}
                </span>
                <button
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-2xl font-black text-slate-900">{coupon.discountPercentage}% OFF</span>
                <p className="text-xs text-slate-500">
                  Min order: ₹{coupon.minOrderValue} • Max cap: ₹{coupon.maxDiscountCap}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Expires: {coupon.validUntil}</span>
                </div>
                <span className="font-bold text-blue-600">{coupon.usageCount} Redeemed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Tag className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Create New Promo Code</h3>
                <p className="text-xs text-slate-500">Set discount percentage and minimum order rule</p>
              </div>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. MONSOON25"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 uppercase tracking-wider font-bold focus:outline-none focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount % *</label>
                  <input
                    type="number"
                    required
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="15"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Order Value (₹) *</label>
                  <input
                    type="number"
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    placeholder="999"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20"
                >
                  Launch Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
