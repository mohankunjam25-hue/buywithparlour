import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Store,
  ArrowUpRight,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AdminTab } from '../../components/Sidebar';

interface OverviewTabProps {
  pendingCount: number;
  catalogCount: number;
  sellersCount: number;
  setActiveTab: (tab: AdminTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  pendingCount,
  catalogCount,
  sellersCount,
  setActiveTab,
}) => {
  const recentActivities = [
    {
      id: '1',
      action: 'Product Submitted',
      detail: 'Organic Herbal Hair Spa Oil (200ml) submitted by Pooja Salon',
      time: '12 mins ago',
      type: 'pending',
    },
    {
      id: '2',
      action: 'Product Approved',
      detail: 'Vitamin C Face Serum (30ml) published to live store',
      time: '1 hour ago',
      type: 'approved',
    },
    {
      id: '3',
      action: 'New Parlour Seller Registered',
      detail: 'Aura Glamour Studio (New Delhi) completed KYC verification',
      time: '3 hours ago',
      type: 'seller',
    },
    {
      id: '4',
      action: 'Express Order Placed',
      detail: 'Order #BP-489201 confirmed via UPI (₹1,498)',
      time: '4 hours ago',
      type: 'order',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Governance Executive Suite
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            BuyWithParlour Multi-Vendor Operations Center
          </h2>
          <p className="text-xs text-blue-100 leading-relaxed">
            Manage product quality gate, audit seller compliance, track customer dispatches, and oversee platform transactions.
          </p>
        </div>

        {pendingCount > 0 ? (
          <button
            onClick={() => setActiveTab('queue')}
            className="z-10 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-6 py-3.5 rounded-2xl shadow-lg flex items-center gap-2 whitespace-nowrap transition-all active:scale-95 animate-pulse"
          >
            <span>Review {pendingCount} Pending Submissions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="z-10 bg-white/20 border border-white/30 text-white text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Moderation Queue 100% Clear</span>
          </div>
        )}
      </section>

      {/* KPI Metrics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Pending Queue */}
        <div
          onClick={() => setActiveTab('queue')}
          className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-amber-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Action Queue (Pending)</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{pendingCount}</span>
            <span className="text-[11px] text-amber-700 font-medium">Awaiting Audit</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span>Click to open Moderation Desk →</span>
          </div>
        </div>

        {/* Metric 2: Live Catalog */}
        <div
          onClick={() => setActiveTab('catalog')}
          className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-emerald-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Live Marketplace Catalog</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{catalogCount}</span>
            <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> Live
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            100% Quality & Formula Verified
          </div>
        </div>

        {/* Metric 3: Verified Sellers */}
        <div
          onClick={() => setActiveTab('sellers')}
          className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-blue-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Verified Parlour Sellers</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600">{sellersCount}</span>
            <span className="text-[11px] text-slate-500 font-medium">Active Partners</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Salon owners & verified suppliers
          </div>
        </div>

        {/* Metric 4: Platform GMV */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Platform GMV (Monthly)</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600">₹8,42,900</span>
            <span className="text-[11px] text-emerald-600 font-semibold">+18.4%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Settled directly via Gateway
          </div>
        </div>
      </section>

      {/* 2-Column Split: Recent Orders & Live Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audit Log Stream */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Real-Time Audit & Activity Log</span>
            </h3>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
              Live Stream
            </span>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        act.type === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : act.type === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : act.type === 'seller'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {act.action}
                    </span>
                    <span className="text-[11px] text-slate-400">{act.time}</span>
                  </div>
                  <p className="text-slate-800 font-medium truncate pt-1">{act.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations Shortcuts */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Quick Governance Actions</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3.5 text-xs">
            <button
              onClick={() => setActiveTab('queue')}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-amber-400 transition-all text-left space-y-1.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 block group-hover:text-amber-600 transition-colors">
                Audit Submissions
              </span>
              <p className="text-[11px] text-slate-500">Approve or reject seller items</p>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-blue-400 transition-all text-left space-y-1.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 block group-hover:text-blue-600 transition-colors">
                Dispatch Desk
              </span>
              <p className="text-[11px] text-slate-500">Update fulfillment status</p>
            </button>

            <button
              onClick={() => setActiveTab('sellers')}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-purple-400 transition-all text-left space-y-1.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 block group-hover:text-purple-600 transition-colors">
                Verify Parlours
              </span>
              <p className="text-[11px] text-slate-500">Manage seller KYC</p>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-emerald-400 transition-all text-left space-y-1.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 block group-hover:text-emerald-600 transition-colors">
                Launch Discount
              </span>
              <p className="text-[11px] text-slate-500">Create promo coupons</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
