import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../store/cartStore.js';

export const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getSubtotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const shippingFee = subtotal > 1000 || items.length === 0 ? 0 : 50;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'PARLOUR10') {
      setDiscount(Math.round(subtotal * 0.1));
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try PARLOUR10 for 10% off');
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-12 max-w-md mx-auto text-center space-y-4">
        <div className="bg-white p-8 rounded card-ecommerce space-y-4">
          <h2 className="text-lg font-bold text-textPrimary">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-textMuted">Explore our wide range of beauty products and salon supplies.</p>
          <Link to="/shop" className="btn-primary text-xs inline-flex">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Cart Items List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white p-4 rounded card-ecommerce flex items-center justify-between">
          <h1 className="text-lg font-bold text-textPrimary">My Cart ({items.length} Items)</h1>
          <span className="text-xs text-textMuted font-medium">Deliver to Pincode: 110001</span>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const price = item.product.discountPrice || item.product.price;
            return (
              <div key={item.product._id} className="bg-white p-4 rounded card-ecommerce flex gap-4 items-center">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-20 h-20 object-contain flex-shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <span className="text-xs text-textMuted font-semibold uppercase">{item.product.brand}</span>
                  <h3 className="text-sm font-semibold text-textPrimary line-clamp-1">{item.product.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-textPrimary">₹{price}</span>
                    {item.product.discountPrice && (
                      <span className="text-xs text-textMuted line-through">₹{item.product.price}</span>
                    )}
                  </div>
                  {item.variantSku && (
                    <span className="text-xs text-textMuted block">Variant SKU: {item.variantSku}</span>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 border border-borderSubtle rounded px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.variantSku)}
                    className="text-textMuted hover:text-primary"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-textPrimary px-1">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.variantSku)}
                    className="text-textMuted hover:text-primary"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.product._id, item.variantSku)}
                  className="text-error hover:text-red-700 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Price Details & Coupon Box */}
      <div className="space-y-4">
        {/* Coupon Section */}
        <div className="bg-white p-4 rounded card-ecommerce space-y-3">
          <h3 className="text-xs font-semibold text-textPrimary uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-promo" /> Apply Promo Code
          </h3>
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Try PARLOUR10"
              className="flex-1 border border-borderSubtle rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary uppercase"
            />
            <button type="submit" className="btn-secondary text-xs px-3 h-8">
              Apply
            </button>
          </form>
          {couponApplied && (
            <span className="text-xs text-success font-semibold block">Coupon PARLOUR10 Applied (10% Off)!</span>
          )}
        </div>

        {/* Order Price Summary */}
        <div className="bg-white p-4 rounded card-ecommerce space-y-3">
          <h2 className="text-sm font-bold text-textPrimary border-b border-borderLight pb-2 uppercase tracking-wider">
            Price Details
          </h2>

          <div className="space-y-2 text-xs text-textSecondary">
            <div className="flex justify-between">
              <span>Price ({items.length} items)</span>
              <span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>{shippingFee === 0 ? <span className="text-success font-semibold">FREE</span> : `₹${shippingFee}`}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-borderSubtle pt-3 flex justify-between items-baseline font-bold text-sm text-textPrimary">
            <span>Total Amount</span>
            <span className="text-base text-primary">₹{total}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full btn-promo font-bold text-sm h-11 uppercase tracking-wide mt-2"
          >
            Place Order
          </button>
        </div>

        {/* Security Tag */}
        <div className="flex items-center gap-2 text-xs text-textMuted justify-center pt-2">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Safe and Secure Payments. 100% Authentic Items.</span>
        </div>
      </div>
    </div>
  );
};
