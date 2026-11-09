"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  const [text, setText] = useState(
    "🌱 FREE All-India Delivery on orders over ₹499 | Handcrafted in Moradabad, UP"
  );
  const [coupon, setCoupon] = useState("ORGANICHY10");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    async function loadBanner() {
      try {
        const res = await fetch("/api/cms/sections?key=home_promo_banner");
        const data = await res.json();
        if (data.success && data.data) {
          const promo = data.data;
          if (promo.isActive === false) {
            setIsActive(false);
          }
          if (promo.metadata?.announcementBarText) {
            setText(promo.metadata.announcementBarText);
          }
          if (promo.metadata?.couponCode) {
            setCoupon(promo.metadata.couponCode);
          }
        }
      } catch (e) {
        // Fallback
      }
    }
    loadBanner();
  }, []);

  if (!isActive) return null;

  return (
    <aside
      aria-label="Announcement"
      className="bg-brand-green-950 text-brand-cream-100 text-xs py-2.5 px-4 text-center font-medium tracking-wide border-b border-brand-green-800"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <Sparkles className="w-3.5 h-3.5 text-brand-mint-400 animate-pulse shrink-0" />
        <span>{text}</span>
        {coupon && (
          <span className="hidden md:inline text-brand-mint-300 font-bold ml-2 bg-brand-green-900 px-2 py-0.5 rounded text-[11px] border border-brand-green-700">
            Use Code: {coupon}
          </span>
        )}
        <Link
          href="/shop"
          className="underline hover:text-brand-mint-300 font-semibold ml-2 transition-colors hidden sm:inline"
        >
          Order Fresh Roast &rarr;
        </Link>
      </div>
    </aside>
  );
}
