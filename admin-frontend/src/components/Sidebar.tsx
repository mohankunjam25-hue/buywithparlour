import React from 'react';
import {
  Clock,
  Layers,
  Store,
  TrendingUp,
  ShoppingBag,
  TicketPercent,
  Settings,
  ShieldCheck,
  Activity,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'queue'
  | 'catalog'
  | 'sellers'
  | 'orders'
  | 'coupons'
  | 'settings';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
}) => {
  const menuItems = [
    { id: 'overview' as AdminTab, label: 'Executive Overview', icon: TrendingUp },
    {
      id: 'queue' as AdminTab,
      label: 'Moderation Queue',
      icon: Clock,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    { id: 'catalog' as AdminTab, label: 'Marketplace Catalog', icon: Layers },
    { id: 'sellers' as AdminTab, label: 'Parlour Sellers', icon: Store },
    { id: 'orders' as AdminTab, label: 'Orders & Dispatch', icon: ShoppingBag },
    { id: 'coupons' as AdminTab, label: 'Coupons & Offers', icon: TicketPercent },
    { id: 'settings' as AdminTab, label: 'System & DB Health', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-white border-r border-[#E0E0E0] flex flex-col justify-between p-3 flex-shrink-0 select-none shadow-[0_1px_4px_rgba(0,0,0,0.08)] font-sans">
      <div className="space-y-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 border-b border-[#EEEEEE] pb-3">
          <div className="w-8 h-8 rounded-[2px] bg-[#2874F0] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1 font-bold text-[#212121] text-base tracking-tight">
              <span>BuyWith</span>
              <span className="text-[#2874F0]">Admin</span>
            </div>
            <span className="text-[10px] text-[#878787] font-semibold tracking-wider uppercase block -mt-1">
              Quality Assurance
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <span className="px-2 text-[10px] font-bold text-[#878787] uppercase tracking-wider block mb-1">
            Navigation Menu
          </span>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[2px] text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2874F0] text-white font-bold'
                      : 'text-[#212121] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-[#ED6C02] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[2px]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer & System Status */}
      <div className="border-t border-[#EEEEEE] pt-3 space-y-2 px-1 text-xs">
        <div className="flex items-center justify-between bg-[#E8F5E9] p-2 rounded-[2px] border border-[#2E7D32]/20">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span className="text-[11px] text-[#2E7D32] font-bold">MongoDB Atlas</span>
          </div>
          <span className="text-[10px] bg-[#2E7D32] text-white font-bold px-1.5 py-0.5 rounded-[2px]">
            Active
          </span>
        </div>

        <div className="p-2 rounded-[2px] bg-slate-50 border border-[#E0E0E0] text-[11px] text-[#666666] flex items-center gap-2">
          <div className="w-6 h-6 rounded-[2px] bg-[#2874F0] text-white flex items-center justify-center font-bold text-[10px]">
            SA
          </div>
          <div className="truncate">
            <span className="font-bold text-[#212121] block text-xs truncate">Super Admin</span>
            <span className="text-[10px] text-[#878787] truncate">admin@buywithparlour.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
