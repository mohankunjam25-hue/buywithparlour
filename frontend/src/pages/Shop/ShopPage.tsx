import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import { Product } from '../../types/index';
import { fetchProducts, fetchCategories, fetchProductFacets } from '../../services/api/axios';
import {
  Filter,
  SlidersHorizontal,
  Loader2,
  X,
  Check,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // URL Query Parameters
  const selectedCategory = searchParams.get('category') || '';
  const searchKeyword = searchParams.get('search') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const minRatingParam = searchParams.get('minRating') || '';
  const selectedSort = searchParams.get('sort') || 'newest';

  // Local filter states
  const [priceMin, setPriceMin] = useState(minPriceParam);
  const [priceMax, setPriceMax] = useState(maxPriceParam);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 1. Fetch Dynamic Facets & Categories from Database (Zero Hardcode)
  useEffect(() => {
    const loadFacets = async () => {
      try {
        const [catData, facetData] = await Promise.all([
          fetchCategories(),
          fetchProductFacets(),
        ]);
        setCategories(catData || []);
        if (facetData?.brands) {
          setAvailableBrands(facetData.brands);
        }
      } catch (err) {
        console.error('Error loading filter facets:', err);
      }
    };
    loadFacets();
  }, []);

  // 2. Fetch Filtered Products on Query Param Change
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const prodData = await fetchProducts({
          search: searchKeyword || undefined,
          category: selectedCategory || undefined,
          brand: selectedBrand || undefined,
          minPrice: minPriceParam ? Number(minPriceParam) : undefined,
          maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
          inStock: inStockParam ? true : undefined,
          minRating: minRatingParam ? Number(minRatingParam) : undefined,
          sort: selectedSort,
        });
        setProducts(prodData.products || []);
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [
    selectedCategory,
    searchKeyword,
    selectedBrand,
    minPriceParam,
    maxPriceParam,
    inStockParam,
    minRatingParam,
    selectedSort,
  ]);

  // Helper to update query params
  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleBrandToggle = (brand: string) => {
    const activeList = selectedBrand ? selectedBrand.split(',') : [];
    const index = activeList.indexOf(brand);
    if (index > -1) {
      activeList.splice(index, 1);
    } else {
      activeList.push(brand);
    }
    updateFilter('brand', activeList.length > 0 ? activeList.join(',') : null);
  };

  const handleApplyPrice = () => {
    const newParams = new URLSearchParams(searchParams);
    if (priceMin) newParams.set('minPrice', priceMin);
    else newParams.delete('minPrice');

    if (priceMax) newParams.set('maxPrice', priceMax);
    else newParams.delete('maxPrice');

    setSearchParams(newParams);
  };

  const handleClearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (searchKeyword) newParams.set('search', searchKeyword);
    setPriceMin('');
    setPriceMax('');
    setSearchParams(newParams);
  };

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedBrand ? selectedBrand.split(',').length : 0) +
    (minPriceParam || maxPriceParam ? 1 : 0) +
    (inStockParam ? 1 : 0) +
    (minRatingParam ? 1 : 0);

  return (
    <div className="py-5 space-y-4 max-w-7xl mx-auto font-sans">
      {/* 1. Top Results & Sorting Bar */}
      <div className="bg-white p-4 rounded-[4px] border border-[#EEEEEE] shadow-[0_1px_4px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#212121]">
            {searchKeyword
              ? `Search Results for "${searchKeyword}"`
              : selectedCategory
              ? `Category: ${selectedCategory.toUpperCase()}`
              : 'All Certified Beauty & Salon Supplies'}
          </h1>
          <p className="text-xs text-[#878787] mt-0.5">
            Showing <strong className="text-[#2874F0]">{products.length} products</strong> matching your active filters
          </p>
        </div>

        {/* Controls: Mobile Filter Toggle & Sort Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden bg-slate-100 text-[#212121] text-xs font-semibold px-3 py-1.5 rounded-[2px] border border-[#E0E0E0] flex items-center gap-1.5 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-[#2874F0]" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#212121]">
            <SlidersHorizontal className="w-4 h-4 text-[#878787]" />
            <span className="font-semibold text-[#878787] hidden sm:inline">Sort By:</span>
            <select
              value={selectedSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="border border-[#E0E0E0] bg-white rounded-[2px] px-2.5 py-1.5 text-xs text-[#212121] font-semibold focus:outline-none focus:border-[#2874F0] cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="popular">Popularity</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Active Filter Pills Ribbon */}
      {activeFiltersCount > 0 && (
        <div className="bg-white p-3 rounded-[4px] border border-[#EEEEEE] shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] font-bold text-[#878787] uppercase tracking-wider">
            Active Filters ({activeFiltersCount}):
          </span>

          {selectedCategory && (
            <span className="bg-[#E3F2FD] text-[#2874F0] font-semibold px-2 py-0.5 rounded-[2px] flex items-center gap-1">
              <span>Category: {selectedCategory}</span>
              <button onClick={() => updateFilter('category', null)} className="hover:text-[#D32F2F]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedBrand &&
            selectedBrand.split(',').map((b) => (
              <span key={b} className="bg-[#E3F2FD] text-[#2874F0] font-semibold px-2 py-0.5 rounded-[2px] flex items-center gap-1">
                <span>Brand: {b}</span>
                <button onClick={() => handleBrandToggle(b)} className="hover:text-[#D32F2F]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

          {(minPriceParam || maxPriceParam) && (
            <span className="bg-[#E3F2FD] text-[#2874F0] font-semibold px-2 py-0.5 rounded-[2px] flex items-center gap-1">
              <span>Price: ₹{minPriceParam || '0'} - ₹{maxPriceParam || 'Max'}</span>
              <button
                onClick={() => {
                  setPriceMin('');
                  setPriceMax('');
                  const newP = new URLSearchParams(searchParams);
                  newP.delete('minPrice');
                  newP.delete('maxPrice');
                  setSearchParams(newP);
                }}
                className="hover:text-[#D32F2F]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockParam && (
            <span className="bg-[#E8F5E9] text-[#2E7D32] font-semibold px-2 py-0.5 rounded-[2px] flex items-center gap-1">
              <span>In Stock Only</span>
              <button onClick={() => updateFilter('inStock', null)} className="hover:text-[#D32F2F]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {minRatingParam && (
            <span className="bg-[#FFF3E0] text-[#ED6C02] font-semibold px-2 py-0.5 rounded-[2px] flex items-center gap-1">
              <span>{minRatingParam}★ & Above</span>
              <button onClick={() => updateFilter('minRating', null)} className="hover:text-[#D32F2F]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleClearAllFilters}
            className="text-[#D32F2F] hover:underline font-bold text-xs ml-auto flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>CLEAR ALL</span>
          </button>
        </div>
      )}

      {/* 3. Main 2-Column Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Filter Sidebar */}
        <aside
          className={`md:col-span-3 bg-white p-4 sm:p-5 rounded-[4px] border border-[#EEEEEE] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-5 text-xs text-[#212121] ${
            showMobileFilters ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-2.5">
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#878787] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#2874F0]" />
              <span>Filters</span>
            </h2>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearAllFilters}
                className="text-[#2874F0] hover:underline font-semibold text-[11px] cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-[#212121] uppercase tracking-wider">Categories</h3>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => updateFilter('category', null)}
                className={`w-full text-left px-2 py-1 rounded-[2px] flex items-center justify-between transition-colors cursor-pointer ${
                  !selectedCategory
                    ? 'bg-[#E3F2FD] text-[#2874F0] font-bold'
                    : 'text-[#666666] hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                {!selectedCategory && <Check className="w-3 h-3 text-[#2874F0]" />}
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`w-full text-left px-2 py-1 rounded-[2px] flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-[#E3F2FD] text-[#2874F0] font-bold'
                      : 'text-[#666666] hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === cat.slug && <Check className="w-3 h-3 text-[#2874F0]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 border-t border-[#EEEEEE] pt-3">
            <h3 className="font-bold text-xs text-[#212121] uppercase tracking-wider">Price (₹)</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min"
                className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-1.5 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
              />
              <span className="text-[#878787]">to</span>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Max"
                className="w-full bg-white border border-[#E0E0E0] rounded-[2px] p-1.5 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyPrice}
              className="w-full bg-slate-100 hover:bg-[#2874F0] hover:text-white text-[#212121] font-semibold py-1 rounded-[2px] border border-[#E0E0E0] transition-colors cursor-pointer text-center text-xs"
            >
              Apply Price
            </button>
          </div>

          {/* Dynamic Brands Filter */}
          {availableBrands.length > 0 && (
            <div className="space-y-2 border-t border-[#EEEEEE] pt-3">
              <h3 className="font-bold text-xs text-[#212121] uppercase tracking-wider">Brands</h3>
              <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                {availableBrands.map((brand) => {
                  const isChecked = selectedBrand.split(',').includes(brand);
                  return (
                    <label
                      key={brand}
                      className="flex items-center gap-2 cursor-pointer p-1 rounded-[2px] hover:bg-slate-50 text-[#666666] hover:text-[#212121]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleBrandToggle(brand)}
                        className="rounded text-[#2874F0] focus:ring-[#2874F0]"
                      />
                      <span className={`text-xs ${isChecked ? 'font-bold text-[#2874F0]' : ''}`}>
                        {brand}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Availability Filter */}
          <div className="border-t border-[#EEEEEE] pt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockParam}
                onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : null)}
                className="rounded text-[#2874F0]"
              />
              <span className="font-bold text-xs text-[#212121]">In Stock Only</span>
            </label>
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-2 border-t border-[#EEEEEE] pt-3">
            <h3 className="font-bold text-xs text-[#212121] uppercase tracking-wider">Customer Rating</h3>
            <div className="space-y-1">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  type="button"
                  onClick={() =>
                    updateFilter('minRating', minRatingParam === String(stars) ? null : String(stars))
                  }
                  className={`w-full text-left px-2 py-1 rounded-[2px] flex items-center justify-between transition-colors cursor-pointer ${
                    minRatingParam === String(stars)
                      ? 'bg-[#FFF3E0] text-[#ED6C02] font-bold'
                      : 'text-[#666666] hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>{stars}★ & Above</span>
                  </span>
                  {minRatingParam === String(stars) && <Check className="w-3 h-3 text-[#ED6C02]" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Products Grid */}
        <main className="md:col-span-9 space-y-4">
          {loading ? (
            <div className="bg-white border border-[#EEEEEE] p-12 rounded-[4px] flex items-center justify-center gap-2 text-[#2874F0] shadow-sm">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-semibold">Applying dynamic database filters...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-[#EEEEEE] p-12 rounded-[4px] text-center space-y-3 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-[#878787] mx-auto" />
              <h3 className="text-sm font-bold text-[#212121]">No Products Matched Your Criteria</h3>
              <p className="text-xs text-[#878787] max-w-sm mx-auto">
                Try removing some filters or search for another term like <em>"serum"</em>, <em>"shampoo"</em>, or <em>"facial kit"</em>.
              </p>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="bg-[#2874F0] hover:bg-[#1259c7] text-white text-xs font-semibold px-4 py-2 rounded-[2px] transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
