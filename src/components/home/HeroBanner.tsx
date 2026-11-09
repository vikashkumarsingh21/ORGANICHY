"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Sparkles, Check, Flame } from "lucide-react";

interface HeroBannerProps {
  customBannerUrl?: string;
}

const PRIMARY_HERO_IMAGE =
  "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1200&auto=format&fit=crop";
const SECONDARY_HERO_IMAGE =
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop";

export default function HeroBanner({ customBannerUrl }: HeroBannerProps) {
  const [bannerImage, setBannerImage] = useState<string>(
    customBannerUrl || PRIMARY_HERO_IMAGE
  );
  const [imageError, setImageError] = useState(false);
  const [badgeText, setBadgeText] = useState("HANDCRAFTED IN MORADABAD, UTTAR PRADESH");
  const [title, setTitle] = useState("100% Pure Indian Slow-Roasted Peanut Butter");
  const [subtitle, setSubtitle] = useState(
    "Born from a fitness lover's quest in Moradabad. ORGANICHY crafts pure, stone-ground peanut butter using only premier slow-roasted Indian farm peanuts. Zero hydrogenated palm oil, zero chemical preservatives, and up to 30g of pure muscle-building protein per 100g."
  );
  const [ctaText, setCtaText] = useState("Shop Now");
  const [ctaLink, setCtaLink] = useState("/shop");
  const [secondaryCtaText, setSecondaryCtaText] = useState("Explore Products");
  const [secondaryCtaLink, setSecondaryCtaLink] = useState("/shop?category=peanut-butter");
  const [stats, setStats] = useState([
    { val: "30g", label: "Plant Protein / 100g" },
    { val: "0%", label: "Added Palm Oil" },
    { val: "100%", label: "Roasted Peanuts" },
  ]);
  const [reviewQuote, setReviewQuote] = useState("Best natural crunch and roasted aroma in India.");
  const [reviewer, setReviewer] = useState("Verified Gym Athlete");

  // Dynamically load active content and image assigned by admin in CMS
  useEffect(() => {
    async function loadDynamicBanner() {
      try {
        const res = await fetch("/api/cms/sections?key=home_hero_banner");
        const data = await res.json();
        if (data.success && data.data) {
          const heroSec = data.data;
          if (heroSec.title) setTitle(heroSec.title);
          if (heroSec.subtitle) setSubtitle(heroSec.subtitle);
          if (heroSec.badgeText) setBadgeText(heroSec.badgeText);
          if (heroSec.ctaText) setCtaText(heroSec.ctaText);
          if (heroSec.ctaLink) setCtaLink(heroSec.ctaLink);
          if (heroSec.secondaryCtaText) setSecondaryCtaText(heroSec.secondaryCtaText);
          if (heroSec.secondaryCtaLink) setSecondaryCtaLink(heroSec.secondaryCtaLink);

          if (heroSec.mediaAsset?.secureUrl) {
            setBannerImage(heroSec.mediaAsset.secureUrl);
          } else if (heroSec.mediaItem?.secureUrl) {
            setBannerImage(heroSec.mediaItem.secureUrl);
          } else if (heroSec.fallbackUrl) {
            setBannerImage(heroSec.fallbackUrl);
          }

          if (heroSec.metadata?.stats && Array.isArray(heroSec.metadata.stats)) {
            setStats(heroSec.metadata.stats);
          }
          if (heroSec.metadata?.reviewText) {
            setReviewQuote(heroSec.metadata.reviewText);
          }
          if (heroSec.metadata?.reviewer) {
            setReviewer(heroSec.metadata.reviewer);
          }
        }
      } catch (e) {
        // Fallback defaults remain safely active
      }
    }
    loadDynamicBanner();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-cream-100 via-brand-cream-50 to-brand-cream-100/80 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-brand-cream-200">
      {/* Delicate background ambient shapes */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-brand-mint-200/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-brand-cream-300/40 blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-mint-100 border border-brand-mint-300/70 text-brand-green-900 text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-mint-600 fill-brand-mint-500" />
              <span>{badgeText}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-brand-green-900 tracking-tight leading-[1.12]">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-brand-charcoal-700 leading-relaxed max-w-xl font-normal">
              {subtitle}
            </p>

            {/* Benefit Micro-Badges */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-1 max-w-lg">
              {stats.map((stat, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-brand-cream-100/90 border border-brand-cream-300/80 shadow-xs flex flex-col justify-center">
                  <span className="font-heading font-black text-lg text-brand-green-900 leading-none">
                    {stat.val}
                  </span>
                  <span className="text-[11px] font-semibold text-brand-charcoal-600 mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href={ctaLink}
                className="px-8 py-4 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-sm tracking-wide shadow-card hover:shadow-hover transition-all flex items-center gap-2 group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={secondaryCtaLink}
                className="px-7 py-4 rounded-full border-2 border-brand-green-900 text-brand-green-900 hover:bg-brand-cream-200/80 font-heading font-bold text-sm tracking-wide transition"
              >
                {secondaryCtaText}
              </Link>
            </div>

            {/* Bottom Shipping Notice */}
            <div className="pt-2 flex items-center gap-2 text-xs text-brand-charcoal-600">
              <Truck className="w-4 h-4 text-brand-green-700" />
              <span>Ships across all Indian pincodes | <strong className="text-brand-green-900">FREE delivery</strong> above ₹499</span>
            </div>
          </div>

          {/* Right Product Showcase Hero Visual */}
          <div className="lg:col-span-5 relative w-full">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Product Hero Frame with guaranteed height & aspect ratio */}
              <div className="relative aspect-[4/5] min-h-[440px] sm:min-h-[500px] lg:min-h-[520px] w-full rounded-3xl overflow-hidden border-4 border-brand-cream-200 shadow-elevated bg-gradient-to-br from-brand-cream-200 via-brand-cream-100 to-brand-cream-300">
                <Image
                  src={imageError ? SECONDARY_HERO_IMAGE : bannerImage}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center hover:scale-105 transition-transform duration-700"
                  onError={() => {
                    if (!imageError) setImageError(true);
                  }}
                />

                {/* Floating Athlete Review Pill */}
                <div className="absolute top-4 right-4 bg-brand-cream-50/95 backdrop-blur-md p-3.5 rounded-2xl shadow-card border border-brand-cream-300/80 max-w-[190px] space-y-1 z-10">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <span>★★★★★</span>
                    <span className="text-[10px] text-brand-charcoal-700 ml-1">4.9/5</span>
                  </div>
                  <p className="text-[11px] font-bold text-brand-green-900 leading-tight">
                    &ldquo;{reviewQuote}&rdquo;
                  </p>
                  <p className="text-[10px] text-brand-charcoal-500 flex items-center gap-1">
                    <Check className="w-3 h-3 text-brand-green-700" />
                    {reviewer}
                  </p>
                </div>

                {/* Floating Batch Freshness Pill Top-Left */}
                <div className="absolute top-4 left-4 bg-brand-green-900/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-card border border-brand-green-700 text-brand-mint-300 text-[10px] font-bold flex items-center gap-1 z-10">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Fresh Batch Ground</span>
                </div>

                {/* Bottom Highlight Strip */}
                <div className="absolute bottom-4 left-4 right-4 bg-brand-green-950/95 backdrop-blur-md p-3.5 rounded-2xl text-brand-cream-100 flex items-center justify-between border border-brand-green-800 z-10">
                  <div>
                    <span className="text-[10px] text-brand-mint-300 uppercase tracking-widest font-bold block">
                      Moradabad Roasted
                    </span>
                    <span className="text-xs font-bold text-white">
                      100% Indian Farm Peanuts
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-brand-mint-400 text-brand-green-950 font-black">
                    Zero Palm Oil
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

