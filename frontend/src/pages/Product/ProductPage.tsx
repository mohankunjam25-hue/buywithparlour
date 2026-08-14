import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { Product } from '../../types/index';
import { fetchProductBySlug } from '../../services/api/axios';
import { useClickLock } from '../../utils/clickGuard';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { isLocked: isActionLocked, executeGuarded } = useClickLock(600);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetchProductBySlug(slug)
        .then((prod) => {
          setProduct(prod);
          setSelectedImageIndex(0);
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0].sku);
          }
        })
        .catch((err) => {
          console.error('Error fetching product details:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#2874F0] gap-2">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-semibold">Loading salon product details from database...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center text-gray-500 text-sm space-y-3">
        <p>Product not found.</p>
        <Link to="/shop" className="text-[#2874F0] font-semibold hover:underline">
          Return to Beauty Shop
        </Link>
      </div>
    );
  }

  // Multi-Photo Array (Ensure at least 1 image exists)
  const imageList =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'];

  const currentImage = imageList[selectedImageIndex] || imageList[0];

  const currentPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product, 1, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, 1, selectedVariant);
    if (!isAuthenticated) {
      openAuthModal('/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % imageList.length);
  };

  return (
    <div className="py-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* 1. Main Product Showcase Grid */}
      <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-[#EEEEEE] shadow-[0_1px_4px_rgba(0,0,0,0.08)] grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Multi-Photo Studio Gallery (Flipkart / Amazon Standard) */}
        <div className="md:col-span-5 flex flex-col-reverse sm:flex-row gap-3">
          {/* Vertical / Horizontal Thumbnail Strip */}
          {imageList.length > 1 && (
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[460px] no-scrollbar py-1 flex-shrink-0">
              {imageList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => setSelectedImageIndex(idx)}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[4px] border-2 bg-white overflow-hidden p-1 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#2874F0] shadow-sm scale-105'
                      : 'border-[#E0E0E0] hover:border-[#2874F0]/60 opacity-80 hover:opacity-100'
                  }`}
                  title={`View angle ${idx + 1}`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large High-Resolution Viewing Stage */}
          <div className="relative flex-1 bg-white border border-[#E0E0E0] rounded-[4px] overflow-hidden flex items-center justify-center min-h-[340px] sm:min-h-[440px] group">
            <img
              src={currentImage}
              alt={product.title}
              onClick={() => setIsZoomModalOpen(true)}
              className="w-full h-full max-h-[420px] object-contain p-4 transition-transform duration-300 hover:scale-105 cursor-zoom-in"
            />

            {/* Left Chevron for cycling angles */}
            {imageList.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#212121] shadow-md border border-[#E0E0E0] flex items-center justify-center transition-all opacity-70 hover:opacity-100 cursor-pointer"
                title="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Right Chevron for cycling angles */}
            {imageList.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#212121] shadow-md border border-[#E0E0E0] flex items-center justify-center transition-all opacity-70 hover:opacity-100 cursor-pointer"
                title="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Lightbox Zoom Button */}
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(true)}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-[#212121] p-1.5 rounded-[2px] shadow-sm border border-[#E0E0E0] flex items-center gap-1 text-[10px] font-semibold transition-all opacity-80 hover:opacity-100 cursor-pointer"
              title="Click to view full resolution"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#2874F0]" />
              <span className="hidden sm:inline">Zoom</span>
            </button>

            {/* Photo Counter Pill */}
            {imageList.length > 1 && (
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                {selectedImageIndex + 1} / {imageList.length} Photos
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Product Metadata, Pricing & Buy Actions */}
        <div className="md:col-span-7 space-y-4 text-xs">
          {/* Brand & Title */}
          <div className="border-b border-[#EEEEEE] pb-3 space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#E3F2FD] text-[#2874F0] text-[10px] font-bold px-2 py-0.5 rounded-[2px] uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-[#878787] text-[11px]">Salon Certified Formulation</span>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-[#212121] leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 bg-[#2E7D32] text-white font-bold text-[11px] px-2 py-0.5 rounded-[2px]">
                {product.rating || 4.8} <Star className="w-3 h-3 fill-white" />
              </span>
              <span className="text-xs text-[#878787] font-semibold">
                {product.reviewCount || 142} Ratings & Certified Reviews
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#212121]">
                ₹{currentPrice}
              </span>
              {originalPrice && (
                <span className="text-sm text-[#878787] line-through">₹{originalPrice}</span>
              )}
              {discountPercent && (
                <span className="text-sm text-[#2E7D32] font-bold">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#2E7D32] font-semibold">
              Inclusive of all GST & salon commercial taxes
            </p>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="pt-1 space-y-2">
              <label className="text-xs font-bold text-[#212121] uppercase tracking-wider block">
                Available Pack Variants:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.sku}
                    type="button"
                    onClick={() => setSelectedVariant(v.sku)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-all cursor-pointer ${
                      selectedVariant === v.sku
                        ? 'border-[#2874F0] bg-[#E3F2FD] text-[#2874F0] font-bold shadow-xs'
                        : 'border-[#E0E0E0] text-[#212121] hover:border-[#2874F0]'
                    }`}
                  >
                    {v.name} • ₹{v.discountPrice || v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability */}
          <div className="pt-1 text-xs">
            <span className="font-bold text-[#2E7D32] flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>In Stock ({product.stock} units ready for immediate dispatch)</span>
            </span>
          </div>

          {/* Primary Buy / Cart Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              disabled={isActionLocked}
              onClick={() => executeGuarded(handleAddToCart)}
              className="flex-1 bg-[#FF9F00] hover:bg-[#e68f00] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold h-11 rounded-[2px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer uppercase tracking-wider"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isActionLocked}
              onClick={() => executeGuarded(handleBuyNow)}
              className="flex-1 bg-[#FB641B] hover:bg-[#e0540f] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold h-11 rounded-[2px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer uppercase tracking-wider"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="border-t border-[#EEEEEE] pt-3 space-y-2 text-xs text-[#666666]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2874F0]" />
              <span>100% Certified Brand Authenticity & Tamper-Proof Packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2874F0]" />
              <span>Free Express Delivery by Delhivery Logistics on orders above ₹1,000</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#2874F0]" />
              <span>7 Days Hassle-Free Salon Replacement Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Product Formulation, Highlights & Ingredients Card */}
      <div className="bg-white p-6 rounded-[4px] border border-[#EEEEEE] shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-4 text-xs">
        <h2 className="text-sm font-bold text-[#212121] uppercase tracking-wider border-b border-[#EEEEEE] pb-2">
          Product Details & Formulation Highlights
        </h2>

        <p className="text-xs text-[#666666] leading-relaxed">{product.description}</p>

        {product.highlights && product.highlights.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <h3 className="font-bold text-xs text-[#212121]">Key Highlights:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#666666]">
              {product.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#2874F0] flex-shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.ingredients && (
          <div className="pt-2">
            <h3 className="font-bold text-xs text-[#212121] mb-1">Ingredients:</h3>
            <p className="text-xs text-[#878787] leading-relaxed bg-[#F1F3F6] p-3 rounded-[2px] border border-[#E0E0E0]">
              {product.ingredients}
            </p>
          </div>
        )}

        {product.howToUse && (
          <div className="pt-2">
            <h3 className="font-bold text-xs text-[#212121] mb-1">How To Use (Professional Application):</h3>
            <p className="text-xs text-[#666666] leading-relaxed">{product.howToUse}</p>
          </div>
        )}
      </div>

      {/* 3. Fullscreen Multi-Photo Lightbox Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 bg-[#212121]/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[4px] max-w-4xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-2">
              <div className="space-y-0.5">
                <span className="font-bold text-sm text-[#212121]">{product.title}</span>
                <span className="text-[11px] text-[#878787] block">
                  High-Resolution Studio Photo ({selectedImageIndex + 1} of {imageList.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="p-1 text-[#878787] hover:text-[#212121] rounded-[2px] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Center Image with Chevrons */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[380px] bg-[#FAFAFA] rounded-[2px] p-2">
              <img
                src={currentImage}
                alt=""
                className="w-full h-full max-h-[60vh] object-contain"
              />

              {imageList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#212121] shadow-lg flex items-center justify-center cursor-pointer border border-[#E0E0E0]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#212121] shadow-lg flex items-center justify-center cursor-pointer border border-[#E0E0E0]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnail Strip in Lightbox */}
            {imageList.length > 1 && (
              <div className="flex justify-center gap-2 overflow-x-auto py-1">
                {imageList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-14 h-14 rounded-[2px] border-2 bg-white overflow-hidden p-0.5 cursor-pointer ${
                      selectedImageIndex === i
                        ? 'border-[#2874F0] shadow-sm'
                        : 'border-[#E0E0E0] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
