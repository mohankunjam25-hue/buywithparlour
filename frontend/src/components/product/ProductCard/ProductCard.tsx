import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../../../types/index';
import { useCartStore } from '../../../store/cartStore';

import { useClickLock } from '../../../utils/clickGuard';

interface ProductCardProps {
  product: Product;
  badgeTag?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, badgeTag }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { isLocked, executeGuarded } = useClickLock(500);

  const currentPrice = product.discountPrice || product.price;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const displayBadge = badgeTag || (product.isBestSeller ? 'BESTSELLER' : null);

  return (
    <div className="bg-white rounded-[4px] overflow-hidden border border-[#EEEEEE] shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow flex flex-col justify-between group relative font-sans">
      {/* Top Left Promo Badge */}
      {displayBadge && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-[#2874F0] text-white font-bold text-[10px] px-2 py-0.5 rounded-[2px] uppercase tracking-wide">
            {displayBadge}
          </span>
        </div>
      )}

      <Link to={`/product/${product.slug}`} className="block relative">
        {/* Aspect 1:1 Clean Image Container as per Section 25 */}
        <div className="w-full aspect-square bg-white p-3 flex items-center justify-center overflow-hidden">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80'}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      </Link>

      {/* Card Info & Primary Actions (Section 13 & 14) */}
      <div className="p-3 pt-0 space-y-1.5">
        <div className="text-[11px] text-[#878787] font-medium uppercase tracking-wider">
          {product.brand}
        </div>
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="text-xs font-semibold text-[#212121] line-clamp-1 group-hover:text-[#2874F0] transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating Pill */}
        <div className="inline-flex items-center gap-1 bg-[#2E7D32] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
          <span>{product.rating || 4.4}</span>
          <Star className="w-2.5 h-2.5 fill-white" />
        </div>
        <span className="text-[11px] text-[#878787] ml-1.5">({product.reviewCount || 42})</span>

        {/* Price Typography as per Section 13 */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-[#212121]">₹{currentPrice}</span>
            {product.discountPrice && (
              <>
                <span className="text-xs text-[#878787] line-through">₹{product.price}</span>
                <span className="text-xs font-semibold text-[#2E7D32]">{discountPercent}% off</span>
              </>
            )}
          </div>

          <button
            type="button"
            disabled={isLocked}
            onClick={() => executeGuarded(() => addToCart(product))}
            className="bg-[#2874F0] hover:bg-[#1259c7] disabled:opacity-60 disabled:cursor-not-allowed text-white p-1.5 rounded-[2px] transition-all cursor-pointer shadow-2xs"
            title="Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
