"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import { formatINR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Check,
  AlertCircle,
  Truck,
} from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscountTotal,
    getShippingFee,
    getGrandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const discountTotal = getDiscountTotal();
  const shippingFee = getShippingFee();
  const grandTotal = getGrandTotal();

  const freeShippingThreshold = BRAND.policies.freeShippingThreshold;
  const isFreeShipping = shippingFee === 0;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - (subtotal - discountTotal));
  const progressToFreeShipping = Math.min(
    100,
    ((subtotal - discountTotal) / freeShippingThreshold) * 100
  );

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponInput.trim(),
          subtotal,
          items: items.map((it) => ({ variantId: it.variantId, quantity: it.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid coupon code.");
      }

      applyCoupon(data.coupon);
      setCouponInput("");
    } catch (err: any) {
      setCouponError(err.message || "Failed to apply coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-brand-charcoal-900/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside
          aria-label="Shopping Cart Drawer"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col font-sans animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-cream-200 flex items-center justify-between bg-brand-cream-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-mint-100 flex items-center justify-center text-brand-green-900 font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-heading font-black text-brand-green-950">
                  Your Nutrition Cart
                </h2>
                <span className="text-[11px] text-brand-charcoal-500 block">
                  {items.length} {items.length === 1 ? "product" : "products"} selected
                </span>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-brand-cream-200 text-brand-charcoal-600 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-brand-mint-50/80 px-4 sm:px-5 py-3 border-b border-brand-mint-100 text-xs text-brand-green-950">
            {isFreeShipping ? (
              <div className="flex items-center gap-1.5 font-bold text-brand-green-800">
                <Truck className="w-4 h-4 text-brand-green-700" />
                <span>🎉 You qualify for <strong>FREE All-India Delivery!</strong></span>
              </div>
            ) : (
              <p>
                Add <strong>{formatINR(remainingForFreeShipping)}</strong> more to get{" "}
                <strong className="text-brand-green-800">FREE Express Shipping</strong>!
              </p>
            )}
            <div className="w-full bg-brand-mint-200/80 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-brand-green-700 h-full transition-all duration-300 rounded-full"
                style={{ width: `${isFreeShipping ? 100 : progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-brand-cream-100 flex items-center justify-center text-brand-charcoal-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-base text-brand-charcoal-900">
                  Your cart is empty
                </h3>
                <p className="text-xs text-brand-charcoal-500 max-w-xs leading-relaxed">
                  Discover our 100% natural slow-roasted peanut butter crafted fresh in Moradabad, UP.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-4 px-6 py-2.5 bg-brand-green-900 text-brand-cream-100 font-heading font-bold text-xs rounded-full hover:bg-brand-green-800 transition shadow-sm"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-3 p-3 rounded-2xl border border-brand-cream-200 bg-brand-cream-50/40 hover:bg-brand-cream-50 transition"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-brand-cream-200 shrink-0 border border-brand-cream-300">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-brand-charcoal-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-brand-charcoal-400 hover:text-rose-600 transition p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-brand-charcoal-500">
                        {item.variantName} ({item.weight})
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-brand-cream-300 rounded-full bg-white shadow-2xs">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="p-1 hover:text-brand-green-800 text-brand-charcoal-600 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-brand-charcoal-900 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="p-1 hover:text-brand-green-800 text-brand-charcoal-600 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <span className="text-xs font-heading font-black text-brand-green-950">
                          {formatINR(item.price * item.quantity)}
                        </span>
                        {item.compareAtPrice && (
                          <span className="text-[10px] text-brand-charcoal-400 line-through block">
                            {formatINR(item.compareAtPrice * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-brand-cream-300 bg-brand-cream-50 space-y-4">
              
              {/* Coupon Section */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-mint-100/70 border border-brand-mint-300 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-brand-green-800" />
                      <div>
                        <span className="font-mono font-black text-brand-green-950 block">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] text-brand-green-800">
                          {appliedCoupon.discountType === "FREE_SHIPPING"
                            ? "Free Express Shipping"
                            : `Saved ${formatINR(appliedCoupon.amountSaved)}`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] font-bold text-rose-700 hover:text-rose-900 px-2 py-1 rounded-md hover:bg-rose-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-brand-charcoal-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Coupon code (e.g. ORGANICHY10)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-brand-cream-300 bg-white text-xs font-mono font-bold text-brand-green-950 uppercase focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-3.5 py-2 rounded-xl bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs transition disabled:opacity-50"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{couponError}</span>
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-brand-charcoal-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brand-charcoal-900">
                    {formatINR(subtotal)}
                  </span>
                </div>

                {discountTotal > 0 && (
                  <div className="flex justify-between text-brand-green-800 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatINR(discountTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-brand-charcoal-600">
                  <span>Shipping</span>
                  <span>
                    {isFreeShipping ? (
                      <strong className="text-brand-green-700">FREE</strong>
                    ) : (
                      formatINR(shippingFee)
                    )}
                  </span>
                </div>

                <div className="border-t border-brand-cream-300 pt-2 flex justify-between text-sm sm:text-base font-heading font-black text-brand-green-950">
                  <span>Estimated Total</span>
                  <span>{formatINR(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTAs */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3.5 px-6 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-card hover:shadow-hover transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-between text-[11px] text-brand-charcoal-500 pt-1">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="font-bold text-brand-green-900 hover:underline"
                  >
                    View Full Cart Page &rarr;
                  </Link>
                  <span className="flex items-center gap-1 text-brand-charcoal-500">
                    <ShieldCheck className="w-3 h-3 text-brand-green-700" />
                    <span>SSL Secure Checkout</span>
                  </span>
                </div>
              </div>

            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
