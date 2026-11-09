"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Copy, Check, ArrowRight, ShieldCheck } from "lucide-react";

export default function PromotionalBanner() {
  const [copied, setCopied] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [title, setTitle] = useState("Fuel Your Fitness Journey. Enjoy 10% Off Your First Order.");
  const [subtitle, setSubtitle] = useState(
    "Order directly from our Moradabad facility. Experience 100% natural slow-roasted peanut butter with zero palm oil. Free shipping on orders over ₹499 across all Indian states."
  );
  const [badgeText, setBadgeText] = useState("SPECIAL ATHLETE WELCOME OFFER");
  const [couponCode, setCouponCode] = useState("ORGANICHY10");
  const [ctaText, setCtaText] = useState("Shop Fresh Roast");
  const [ctaLink, setCtaLink] = useState("/shop");

  useEffect(() => {
    async function loadPromo() {
      try {
        const res = await fetch("/api/cms/sections?key=home_promo_banner");
        const data = await res.json();
        if (data.success && data.data) {
          const promo = data.data;
          setIsActive(promo.isActive !== false);
          if (promo.title) setTitle(promo.title);
          if (promo.subtitle) setSubtitle(promo.subtitle);
          if (promo.badgeText) setBadgeText(promo.badgeText);
          if (promo.ctaText) setCtaText(promo.ctaText);
          if (promo.ctaLink) setCtaLink(promo.ctaLink);
          if (promo.metadata?.couponCode) setCouponCode(promo.metadata.couponCode);
        }
      } catch (e) {
        // Fallback defaults
      }
    }
    loadPromo();
  }, []);

  if (!isActive) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 bg-brand-cream-100/70 border-b border-brand-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-green-950 bg-gradient-to-r from-brand-green-950 via-brand-green-900 to-brand-green-800 text-brand-cream-100 p-8 sm:p-12 shadow-elevated border-2 border-brand-green-700">
          
          {/* Subtle ambient light */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-mint-400/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-brand-gold-500/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Text & Pitch */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green-800 text-brand-mint-300 text-xs font-bold tracking-wider uppercase border border-brand-green-700">
                <Sparkles className="w-3.5 h-3.5 text-brand-mint-400" />
                <span>{badgeText}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight leading-tight">
                {title}
              </h2>

              <p className="text-sm sm:text-base text-brand-cream-200/90 max-w-xl leading-relaxed">
                {subtitle}
              </p>

              <div className="flex items-center gap-2 text-xs text-brand-mint-300 pt-1">
                <ShieldCheck className="w-4 h-4 text-brand-mint-400 shrink-0" />
                <span>Applicable on all Crunchy, Creamy &amp; Dark Chocolate jars</span>
              </div>
            </div>

            {/* Coupon & Action Trigger */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-4">
              <div className="w-full sm:w-auto bg-brand-green-800/80 backdrop-blur-md p-4 rounded-2xl border border-brand-green-700 space-y-2">
                <span className="text-[10px] text-brand-cream-300 uppercase tracking-widest font-bold block">
                  Click to Copy Promo Code:
                </span>
                
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 bg-brand-green-950 rounded-xl border border-brand-mint-500/40 font-mono font-black text-base text-brand-mint-300 tracking-wider">
                    {couponCode}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2.5 rounded-xl bg-brand-mint-400 text-brand-green-950 hover:bg-brand-mint-300 transition shadow-xs font-bold text-xs flex items-center gap-1"
                    title="Copy coupon"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <Link
                href={ctaLink}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-mint-400 hover:bg-brand-mint-300 text-brand-green-950 font-heading font-black text-sm tracking-wide shadow-card hover:shadow-hover transition flex items-center justify-center gap-2"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
