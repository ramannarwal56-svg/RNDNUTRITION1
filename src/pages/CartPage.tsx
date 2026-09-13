import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    cartSubtotal, 
    navigate, 
    settings,
    showToast,
    user,
    openAuthModal
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Cart summary calculated from server
  const [calcSummary, setCalcSummary] = useState({
    subtotal: cartSubtotal,
    discount: 0,
    shippingCharge: cartSubtotal >= (settings.freeShippingThreshold || 999) ? 0 : 99,
    taxAmount: Math.round(cartSubtotal * 0.18),
    totalAmount: cartSubtotal >= (settings.freeShippingThreshold || 999) ? cartSubtotal : cartSubtotal + 99
  });

  useEffect(() => {
    recalculateCart();
  }, [cart, appliedCoupon]);

  const recalculateCart = async () => {
    if (cart.length === 0) return;
    try {
      const payload = {
        items: cart.map(i => ({
          productId: i.productId,
          selectedFlavour: i.selectedFlavour,
          selectedSize: i.selectedSize,
          quantity: i.quantity
        })),
        couponCode: appliedCoupon?.code
      };

      const res = await fetch('/api/cart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setCalcSummary({
          subtotal: data.subtotal,
          discount: data.discount,
          shippingCharge: data.shippingCharge,
          taxAmount: data.taxAmount,
          totalAmount: data.totalAmount
        });
      }
    } catch (e) {
      console.warn("Recalculate cart error:", e);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          cartAmount: cartSubtotal
        })
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data);
        showToast(`Coupon ${data.code} applied! Saved ₹${data.discountAmount}`, 'success');
      } else {
        setCouponError(data.error || "Invalid coupon code");
      }
    } catch {
      setCouponError("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    showToast("Coupon removed", "info");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-neutral-800 flex items-center justify-center text-[#D4AF37]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black uppercase text-white font-display">Your Cart is Empty</h2>
          <p className="text-xs text-neutral-400">
            Fuel your fitness journey with authentic sports nutrition directly from Gohana, Haryana.
          </p>
          <button
            onClick={() => navigate('shop')}
            className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all shadow-lg"
          >
            Explore Supplement Catalog
          </button>
        </div>
      </div>
    );
  }

  const freeShippingNeeded = Math.max(0, (settings.freeShippingThreshold || 999) - cartSubtotal);

  return (
    <div id="rnd-cart-page" className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
              Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Review your authentic RND sports nutrition order before proceeding to checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              {freeShippingNeeded === 0 ? (
                <span className="text-emerald-400 font-bold">You unlocked FREE India-wide shipping!</span>
              ) : (
                <span>Add ₹{freeShippingNeeded} more to qualify for <strong>FREE India Shipping</strong></span>
              )}
            </span>
            <span className="text-neutral-400 text-[11px]">Threshold: ₹{settings.freeShippingThreshold || 999}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
            <div 
              className="h-full bg-[#D4AF37] transition-all duration-500" 
              style={{ width: `${Math.min(100, (cartSubtotal / (settings.freeShippingThreshold || 999)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Main Grid: Items List (Left) + Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item, index) => (
              <div
                key={`${item.productId}-${item.selectedFlavour}-${item.selectedSize}-${index}`}
                className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Image & Title */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={item.product?.images[0] || './images/rnd_whey_protein_1789192519698.jpg'}
                    alt={item.product?.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-neutral-950 p-2 flex-shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <h3 
                      onClick={() => navigate('product', { id: item.product?.slug || item.productId })}
                      className="text-sm font-bold text-white hover:text-[#D4AF37] cursor-pointer truncate"
                    >
                      {item.product?.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                      <span className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-300">
                        {item.selectedFlavour}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-300">
                        {item.selectedSize}
                      </span>
                    </div>
                    <div className="text-xs font-black text-[#D4AF37]">
                      ₹{item.price.toLocaleString('en-IN')} each
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  {/* Stepper */}
                  <div className="flex items-center bg-neutral-950 border border-neutral-700 rounded-xl p-1">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.selectedFlavour, item.selectedSize)}
                      className="p-1.5 text-neutral-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.selectedFlavour, item.selectedSize)}
                      className="p-1.5 text-neutral-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[80px]">
                    <div className="text-sm font-black text-white font-display">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => removeFromCart(item.productId, item.selectedFlavour, item.selectedSize)}
                    className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Quick coupon banner suggestions */}
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
              <span>Available Coupon: Use code <strong className="text-[#D4AF37]">RNDFIRST10</strong> for 10% off</span>
              <button
                onClick={() => setCouponCode('RNDFIRST10')}
                className="text-xs text-[#D4AF37] font-bold hover:underline"
              >
                Copy Code
              </button>
            </div>
          </div>

          {/* Cart Calculation & Checkout Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-between text-xs text-emerald-300">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span>Applied: <strong>{appliedCoupon.code}</strong> (-₹{appliedCoupon.discountAmount})</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-neutral-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter promo coupon code"
                      className="flex-1 bg-neutral-950 text-white text-xs px-3 py-2.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && (
                  <div className="text-[11px] text-red-400">{couponError}</div>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2.5 text-xs text-neutral-300 pt-2 border-t border-neutral-800">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span>₹{calcSummary.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {calcSummary.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{calcSummary.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping (India Express)</span>
                  <span>{calcSummary.shippingCharge === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${calcSummary.shippingCharge}`}</span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>Estimated GST (18% Incl.)</span>
                  <span>₹{calcSummary.taxAmount.toLocaleString('en-IN')}</span>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between text-base font-black text-white pt-3 border-t border-neutral-800 font-display">
                  <span>Grand Total</span>
                  <span className="text-[#D4AF37]">₹{calcSummary.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={() => {
                  if (!user) {
                    openAuthModal();
                  } else {
                    navigate('checkout', { coupon: appliedCoupon?.code || '' });
                  }
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-500 hover:brightness-110 text-neutral-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges */}
              <div className="pt-2 text-[11px] text-neutral-400 space-y-1.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>100% Authentic Indian Sports Nutrition</span>
                </div>
                <div>UPI Instant, Cards, Net Banking &amp; COD Supported</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
