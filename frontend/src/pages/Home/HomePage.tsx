import React, { useEffect, useState } from 'react';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import { MarketingHeroSlider } from '../../components/home/MarketingHeroSlider';
import { OrderTrackingModal } from '../../components/common/OrderTracking/OrderTrackingModal';
import { Product } from '../../types/index';
import { fetchProducts, fetchCategories } from '../../services/api/axios';
import { Package, ArrowRight, Loader2 } from 'lucide-react';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [prodData, catData] = await Promise.all([
          fetchProducts({ category: activeCategorySlug || undefined }),
          fetchCategories(),
        ]);
        setProducts(prodData.products || []);
        setCategories(catData || []);
      } catch (error) {
        console.error('Error fetching dynamic homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeCategorySlug]);

  return (
    <div className="py-5 space-y-5 max-w-7xl mx-auto font-sans">
      {/* 1. Marketing Hero Slider & Carousel */}
      <MarketingHeroSlider />

      {/* 2. Secondary Order Tracker Banner (1-Click Interactive Modal) */}
      <section className="bg-white border border-[#EEEEEE] p-4 rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-[2px] bg-[#2874F0] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-[#212121]">
              Track Your Active Orders & Courier Status
            </h3>
            <button
              type="button"
              onClick={() => setIsTrackingModalOpen(true)}
              className="text-xs text-[#2874F0] font-semibold hover:underline block mt-0.5 text-left cursor-pointer"
            >
              Click here to view live tracking, shipping specs & delivery timelines ➔
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsTrackingModalOpen(true)}
          className="bg-[#2874F0] hover:bg-[#1259c7] text-white text-xs font-semibold px-4 py-2 rounded-[2px] transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm cursor-pointer"
        >
          <span>View Live Tracker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />

      {/* 3. Dynamic Category Filter Pills from Database */}
      <section className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveCategorySlug('')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategorySlug === ''
              ? 'bg-primary text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Sabhi Products
        </button>
        {categories.map((cat) => {
          const isActive = activeCategorySlug === cat.slug;
          return (
            <button
              key={cat._id}
              onClick={() => setActiveCategorySlug(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </section>

      {/* 4. Dynamic Product Cards Grid from Database */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-primary gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Loading products from database...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-8 rounded-xl text-center text-gray-500 text-sm">
          No products found in this category.
        </div>
      ) : (
        <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product, idx) => {
            const badgeTags = ['BESTSELLER', 'PURE ORGANIC', 'ROYAL CLASSIC', 'PREMIUM CARE'];
            return (
              <ProductCard
                key={product._id}
                product={product}
                badgeTag={badgeTags[idx % badgeTags.length]}
              />
            );
          })}
        </section>
      )}
    </div>
  );
};
