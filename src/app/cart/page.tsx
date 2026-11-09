"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";
import { formatINR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  AlertCircle,
  Truck,
  Sparkles,
  FileText,
  RotateCcw,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getDiscountTotal,
    getShippingFee,
    getGrandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    orderNotes,
    setOrderNotes,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const subtotal = getSubtotal();
  const discountTotal = getDiscountTotal();
  const shippingFee = getShippingFee();
  const grandTotal = getGrandTotal();

  const freeShippingThreshold = BRAND.policies.freeShippingThreshold;
  const isFreeShipping = shippingFee === 0;
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - (subtotal - discountTotal)
  );
  const progressToFreeShipping = Math.min(
    100,
    ((subtotal - discountTotal) / freeShippingThreshold) * 100
  );

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) return;

    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          subtotal,
          items: items.map((it) => ({ variantId: it.variantId, quantity: it.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to validate coupon code.");
      }

      applyCoupon(data.coupon);
      setCouponSuccess(data.message || `Coupon ${data.coupon.code} applied!`);
      setCouponCode("");
    } catch (err: any) {
      setCouponError(err.message || "Invalid coupon code.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess("");
    setCouponError("");
  };

  return (
    <div className="py-12 bg-brand-cream-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-brand-cream-300 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Shopping Cart
              </span>
              <span className="text-xs text-brand-charcoal-400">•</span>
              <span className="text-xs text-brand-charcoal-500 font-semibold">
                Moradabad Roastery
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-950 tracking-tight mt-1">
              Your Nutrition Cart
            </h1>
            <p className="text-xs sm:text-sm text-brand-charcoal-600 mt-0.5">
              Review your slow-roasted peanut butter jars before secure checkout.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cart</span>
              </button>
            )}
            <Link
              href="/shop"
              className="text-xs font-heading font-bold text-brand-green-900 hover:text-brand-green-700 underline"
            >
              Continue Shopping &rarr;
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="p-16 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 text-center space-y-4 max-w-lg mx-auto shadow-subtle">
            <div className="w-20 h-20 rounded-full bg-brand-cream-100 flex items-center justify-center mx-auto text-brand-charcoal-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-heading font-black text-xl text-brand-charcoal-900">
              Your cart is currently empty
            </h2>
            <p className="text-xs text-brand-charcoal-500 max-w-sm mx-auto leading-relaxed">
              Explore our 100% natural slow-roasted peanut butters crafted with zero palm oil in Moradabad.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide transition shadow-card"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Split Grid: Items & Order Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Free Shipping Progress Meter */}
              <div className="p-4 sm:p-5 rounded-2xl bg-brand-mint-50 border border-brand-mint-200 text-xs text-brand-green-950 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-green-700" />
                    <span>
                      {isFreeShipping ? (
                        <span className="text-brand-green-800">
                          🎉 You have unlocked <strong>FREE All-India Delivery!</strong>
                        </span>
                      ) : (
                        <span>
                          Add <strong>{formatINR(remainingForFreeShipping)}</strong> more to unlock <strong>FREE Delivery</strong>!
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-brand-green-800">
                    {isFreeShipping ? "100%" : `${Math.round(progressToFreeShipping)}%`}
                  </span>
                </div>
                <div className="w-full bg-brand-mint-200/80 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-green-700 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${isFreeShipping ? 100 : progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-card overflow-hidden divide-y divide-brand-cream-200">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-brand-cream-50/40 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-brand-cream-100 border border-brand-cream-300 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-heading font-black text-sm sm:text-base text-brand-charcoal-900">
                          {item.title}
                        </h3>
                        <p className="text-xs text-brand-charcoal-500 mt-0.5">
                          Size: <strong>{item.weight}</strong> • Flavor: {item.flavor}
                        </p>
                        <span className="text-xs font-bold text-brand-green-900 mt-1 block">
                          {formatINR(item.price)} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-cream-200">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-brand-cream-300 rounded-full bg-brand-cream-50 px-2 py-1 shadow-2xs">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="p-1 hover:text-brand-green-800 text-brand-charcoal-600 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-brand-charcoal-900 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="p-1 hover:text-brand-green-800 text-brand-charcoal-600 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[90px]">
                        <span className="font-heading font-black text-base text-brand-green-950 block">
                          {formatINR(item.price * item.quantity)}
                        </span>
                        {item.compareAtPrice && (
                          <span className="text-xs text-brand-charcoal-400 line-through">
                            {formatINR(item.compareAtPrice * item.quantity)}
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-brand-charcoal-400 hover:text-rose-600 transition p-1"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Notes / Instructions Box */}
              <div className="p-5 sm:p-6 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-card space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-green-800" />
                  <label htmlFor="orderNotes" className="text-xs font-heading font-bold text-brand-charcoal-900">
                    Order Notes / Delivery Instructions (Optional)
                  </label>
                </div>
                <p className="text-[11px] text-brand-charcoal-500">
                  Special requests for delivery partners or packaging preferences (e.g., leave package at door, call before delivery).
                </p>
                <textarea
                  id="orderNotes"
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Please hand over to apartment security guard or deliver after 5 PM."
                  className="w-full p-3 rounded-2xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 bg-brand-cream-50/50"
                />
              </div>

            </div>

            {/* Right Order Summary Column */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Order Summary Box */}
              <div className="p-6 sm:p-8 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-card space-y-6 sticky top-28">
                <h3 className="font-heading font-black text-lg text-brand-charcoal-900 border-b border-brand-cream-200 pb-3">
                  Order Summary
                </h3>

                {/* Subtotals Breakdown */}
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between text-brand-charcoal-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-brand-charcoal-900">
                      {formatINR(subtotal)}
                    </span>
                  </div>

                  {discountTotal > 0 && (
                    <div className="flex justify-between text-brand-green-800 font-bold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Promo ({appliedCoupon?.code})</span>
                      </span>
                      <span>-{formatINR(discountTotal)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-brand-charcoal-600">
                    <span>Shipping</span>
                    <span>
                      {isFreeShipping ? (
                        <span className="text-brand-green-700 font-bold">FREE</span>
                      ) : (
                        formatINR(shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="border-t border-brand-cream-200 pt-3 flex justify-between text-base font-heading font-black text-brand-green-950">
                    <span>Grand Total</span>
                    <span>{formatINR(grandTotal)}</span>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="space-y-2 pt-2 border-t border-brand-cream-200">
                  <span className="text-[11px] font-heading font-bold text-brand-charcoal-700 block uppercase tracking-wider">
                    Discount Coupon
                  </span>

                  {appliedCoupon ? (
                    <div className="p-3 rounded-2xl bg-brand-mint-100/70 border border-brand-mint-300 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-brand-green-800 font-bold" />
                          <span className="font-mono font-black text-xs text-brand-green-950">
                            {appliedCoupon.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-green-800">
                          {appliedCoupon.discountType === "FREE_SHIPPING"
                            ? "Free delivery unlocked"
                            : `Saved ${formatINR(appliedCoupon.amountSaved)}`}
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs font-bold text-rose-700 hover:text-rose-900 px-2 py-1 rounded-md hover:bg-rose-50 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleApplyCoupon();
                      }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="e.g. ORGANICHY10"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                        />
                        <button
                          type="submit"
                          disabled={couponLoading || !couponCode.trim()}
                          className="px-4 py-2.5 rounded-xl bg-brand-cream-200 hover:bg-brand-cream-300 text-brand-green-950 font-heading font-bold text-xs transition disabled:opacity-50"
                        >
                          {couponLoading ? "..." : "Apply"}
                        </button>
                      </div>

                      {couponSuccess && (
                        <p className="text-[11px] text-brand-green-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>{couponSuccess}</span>
                        </p>
                      )}

                      {couponError && (
                        <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{couponError}</span>
                        </p>
                      )}
                    </form>
                  )}

                  {/* Quick-Apply Promo Chips */}
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase tracking-wider block">
                      Available Offers:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon("ORGANICHY10")}
                        className="px-2.5 py-1 rounded-lg bg-brand-cream-100 hover:bg-brand-mint-100 border border-brand-cream-300 text-[10px] font-mono font-bold text-brand-green-900 transition"
                      >
                        ORGANICHY10 (10% OFF)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon("FREESHIP")}
                        className="px-2.5 py-1 rounded-lg bg-brand-cream-100 hover:bg-brand-mint-100 border border-brand-cream-300 text-[10px] font-mono font-bold text-brand-green-900 transition"
                      >
                        FREESHIP (Free Delivery)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon("SOURAV100")}
                        className="px-2.5 py-1 rounded-lg bg-brand-cream-100 hover:bg-brand-mint-100 border border-brand-cream-300 text-[10px] font-mono font-bold text-brand-green-900 transition"
                      >
                        SOURAV100 (₹100 OFF)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-3 pt-2">
                  <Link
                    href="/checkout"
                    className="w-full py-4 px-6 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-sm tracking-wide shadow-card hover:shadow-hover transition flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-charcoal-500 text-center">
                    <ShieldCheck className="w-4 h-4 text-brand-green-700" />
                    <span>Razorpay SSL 256-bit encryption • COD available</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
