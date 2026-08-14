import React from 'react';
import { Search, ExternalLink, Bell } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  pendingCount,
}) => {
  return (
    <header className="h-14 border-b border-[#E0E0E0] bg-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-[0_1px_4px_rgba(0,0,0,0.08)] font-sans">
      {/* Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, products, sellers, or coupons..."
            className="w-full bg-slate-50 border border-[#E0E0E0] rounded-[2px] pl-9 pr-3 py-1.5 text-xs text-[#212121] placeholder:text-[#878787] focus:outline-none focus:bg-white focus:border-[#2874F0] transition-colors"
          />
        </div>
      </div>

      {/* Right Side Portals Links & Actions */}
      <div className="flex items-center gap-3 text-xs">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-[#2874F0] font-semibold px-3 py-1.5 rounded-[2px] border border-[#E0E0E0] transition-colors"
        >
          <span>Customer Store</span>
          <ExternalLink className="w-3 h-3 text-[#878787]" />
        </a>

        <a
          href="http://localhost:5175"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-[#212121] font-semibold px-3 py-1.5 rounded-[2px] border border-[#E0E0E0] transition-colors"
        >
          <span>Seller Studio</span>
          <ExternalLink className="w-3 h-3 text-[#878787]" />
        </a>

        {/* Pending Notification Bell */}
        <div className="relative p-1.5 rounded-[2px] bg-slate-100 border border-[#E0E0E0] text-[#666666] hover:text-[#212121] cursor-pointer transition-colors">
          <Bell className="w-4 h-4" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ED6C02] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </div>

        {/* Super Admin Status Pill */}
        <div className="flex items-center gap-1 bg-[#E8F5E9] border border-[#2E7D32]/20 px-2.5 py-1 rounded-[2px]">
          <span className="text-[11px] font-bold text-[#2E7D32]">Quality Gate Live</span>
        </div>
      </div>
    </header>
  );
};
