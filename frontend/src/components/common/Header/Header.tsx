import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, LogOut, ArrowUpRight, Sparkles, Tag, PackageCheck } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { fetchSearchSuggestions } from '../../../services/api/axios';
import { AuthModal } from '../Auth/AuthModal';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{
    suggestions: any[];
    brands: string[];
    categories: any[];
  }>({ suggestions: [], brands: [], categories: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, logout, openAuthModal } = useAuthStore();

  // Fast Debounced Search Suggestions (<15ms)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions({ suggestions: [], brands: [], categories: [] });
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await fetchSearchSuggestions(searchQuery.trim());
        setSuggestions(data || { suggestions: [], brands: [], categories: [] });
        setShowDropdown(true);
      } catch {
        // Ignore network failure
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (text: string) => {
    setSearchQuery(text);
    setShowDropdown(false);
    navigate(`/shop?search=${encodeURIComponent(text)}`);
  };

  const handleSelectCategory = (slug: string) => {
    setShowDropdown(false);
    navigate(`/shop?category=${encodeURIComponent(slug)}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Modern High-End White Header */}
      <header className="bg-white text-[#212121] sticky top-0 z-50 shadow-[0_1px_4px_rgba(0,0,0,0.08)] border-b border-[#EEEEEE] font-sans">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4 sm:gap-6">
          {/* Brand Logo with BuyWithParlour */}
          <Link to="/" className="flex flex-col flex-shrink-0">
            <div className="flex items-center text-lg sm:text-xl font-black tracking-tight italic">
              <span className="text-[#212121]">BuyWith</span>
              <span className="text-[#2874F0]">Parlour</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#878787] font-semibold -mt-1">
              <span>Explore</span>
              <span className="text-[#2874F0] font-bold italic">Plus</span>
              <span className="text-[#ED6C02] font-bold text-[8px]">✦</span>
            </div>
          </Link>

          {/* Search Bar with Live Typeahead Auto-Suggestions Dropdown */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative flex items-center bg-[#F1F3F6] hover:bg-[#EBEEF2] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2874F0]/20 border border-[#E0E0E0] focus-within:border-[#2874F0] rounded-[2px] transition-all overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) setShowDropdown(true);
                  }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for beauty products, salon formulations, brands and more"
                  className="w-full h-9 px-4 text-xs sm:text-sm text-[#212121] placeholder:text-[#878787] bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-9 px-3.5 text-[#2874F0] hover:bg-[#E3F2FD] transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Floating Suggestions Dropdown */}
            {showDropdown &&
              (suggestions.suggestions.length > 0 ||
                suggestions.brands.length > 0 ||
                suggestions.categories.length > 0) && (
                <div className="absolute left-0 right-0 top-11 bg-white border border-[#E0E0E0] rounded-[4px] shadow-2xl z-50 text-[#212121] overflow-hidden animate-fade-in text-xs divide-y divide-[#EEEEEE]">
                  {/* Matching Categories & Brands Chips */}
                  {(suggestions.categories.length > 0 || suggestions.brands.length > 0) && (
                    <div className="p-2.5 bg-slate-50 space-y-1.5">
                      <span className="text-[10px] font-bold text-[#878787] uppercase tracking-wider block">
                        Quick Suggestions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {suggestions.categories.map((cat: any) => (
                          <button
                            key={cat.slug}
                            type="button"
                            onClick={() => handleSelectCategory(cat.slug)}
                            className="bg-white hover:bg-[#E3F2FD] hover:text-[#2874F0] border border-[#E0E0E0] rounded-[2px] px-2 py-0.5 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Tag className="w-3 h-3 text-[#2874F0]" />
                            <span>in {cat.name}</span>
                          </button>
                        ))}
                        {suggestions.brands.map((brand: string) => (
                          <button
                            key={brand}
                            type="button"
                            onClick={() => handleSelectSuggestion(brand)}
                            className="bg-white hover:bg-[#E3F2FD] hover:text-[#2874F0] border border-[#E0E0E0] rounded-[2px] px-2 py-0.5 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-[#ED6C02]" />
                            <span>Brand: {brand}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Product Titles */}
                  {suggestions.suggestions.length > 0 && (
                    <div className="py-1">
                      {suggestions.suggestions.map((item: any, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSuggestion(item.title)}
                          className="w-full text-left px-3.5 py-2 hover:bg-[#F1F3F6] flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 truncate max-w-md">
                            <Search className="w-3.5 h-3.5 text-[#878787] flex-shrink-0" />
                            <span className="truncate font-medium text-[#212121]">
                              {item.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {item.brand && (
                              <span className="text-[10px] text-[#878787] font-semibold bg-slate-100 px-1.5 py-0.5 rounded-[2px]">
                                {item.brand}
                              </span>
                            )}
                            <span className="font-bold text-[#2874F0] text-xs">
                              ₹{item.price}
                            </span>
                            <ArrowUpRight className="w-3 h-3 text-[#878787]" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Right Side Navigation Actions */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-[#212121]">
            {/* My Orders Link */}
            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#212121] hover:text-[#2874F0] transition-colors"
            >
              <PackageCheck className="w-4 h-4 text-[#2874F0]" />
              <span>Orders</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/profile"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#212121] hover:text-[#2874F0] transition-colors"
            >
              <Heart className="w-4 h-4 text-[#ED6C02]" />
              <span>Wishlist</span>
            </Link>

            {/* Cart Link with Badge */}
            <Link
              to="/cart"
              className="flex items-center gap-2 text-[#212121] hover:text-[#2874F0] transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-[#212121]" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#FF6161] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
            </Link>

            {/* Authentication Action Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 bg-[#F1F3F6] hover:bg-[#E3F2FD] text-[#212121] px-3 py-1.5 rounded-[2px] border border-[#E0E0E0] transition-colors text-xs font-bold"
                >
                  <span className="w-5 h-5 rounded-full bg-[#2874F0] text-white font-bold text-[10px] flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span className="max-w-[85px] truncate hidden md:inline">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="text-[#878787] hover:text-rose-600 p-1 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="bg-[#2874F0] hover:bg-[#1259c7] text-white font-bold px-5 py-1.5 rounded-[2px] transition-colors text-xs shadow-xs cursor-pointer tracking-wide uppercase"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Customer Login & Registration Modal */}
      <AuthModal />
    </>
  );
};
