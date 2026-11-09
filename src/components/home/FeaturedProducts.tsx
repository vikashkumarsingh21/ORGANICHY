"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { DEMO_PRODUCTS } from "@/lib/demoData";
import ProductCard from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function FeaturedProducts() {
  const [badgeText, setBadgeText] = useState("SIGNATURE RANGE");
  const [title, setTitle] = useState("Featured Nutrition Lineup");
  const [subtitle, setSubtitle] = useState(
    "Batch-roasted in Moradabad with zero palm oil. Select your favorite texture and size."
  );
  const [products, setProducts] = useState(DEMO_PRODUCTS.filter((p) => p.isFeatured));
  const [upcomingCategories, setUpcomingCategories] = useState([
    { name: "High Protein Oats", badge: "Formulating" },
    { name: "Clean Whey Protein", badge: "R&D Phase" },
    { name: "Plant Nutrition Bars", badge: "Lab Testing" },
    { name: "Clean Mass Gainers", badge: "Formulating" },
  ]);

  useEffect(() => {
    async function loadFeaturedCms() {
      try {
        const res = await fetch("/api/cms/sections?key=home_featured_products");
        const data = await res.json();
        if (data.success && data.data) {
          const feat = data.data;
          if (feat.title) setTitle(feat.title);
          if (feat.subtitle) setSubtitle(feat.subtitle);
          if (feat.badgeText) setBadgeText(feat.badgeText);

          if (feat.metadata?.featuredProductIds && Array.isArray(feat.metadata.featuredProductIds)) {
            const selected = DEMO_PRODUCTS.filter((p) =>
              feat.metadata.featuredProductIds.includes(p.id)
            );
            if (selected.length > 0) setProducts(selected);
          }
          if (feat.metadata?.upcomingCategories && Array.isArray(feat.metadata.upcomingCategories)) {
            setUpcomingCategories(feat.metadata.upcomingCategories);
          }
        }
      } catch (e) {
        // Fallback default
      }
    }
    loadFeaturedCms();
  }, []);

  return (
    <section className="py-20 bg-brand-cream-50 border-b border-brand-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <SectionHeading
            badge={badgeText}
            title={title}
            subtitle={subtitle}
            centered={false}
            className="mb-0"
          />
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-heading font-bold text-brand-green-900 hover:text-brand-green-700 transition group self-start md:self-end"
          >
            <span>View All Nutrition Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Future Product Categories Teaser */}
        <div className="mt-16 p-8 rounded-3xl bg-brand-cream-200/50 border border-brand-cream-300">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-bold text-brand-green-800 bg-brand-mint-200/70 px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-green-800" />
              EXPANDING INDIA&apos;S CLEANEST NUTRITION LINE
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-brand-green-900">
              Future Nutrition Categories in Formulation
            </h3>
            <p className="text-xs sm:text-sm text-brand-charcoal-600">
              High Protein Rolled Oats, Pure Whey Isolates, and Clean Nutrition Bars are currently in R&D and lab testing at our Moradabad facility.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {upcomingCategories.map((cat) => (
              <div
                key={cat.name}
                className="p-4 bg-brand-cream-100/90 rounded-2xl text-center border border-brand-cream-300 shadow-2xs space-y-1"
              >
                <span className="text-xs font-heading font-bold text-brand-charcoal-800 block">
                  {cat.name}
                </span>
                <span className="text-[10px] text-brand-mint-600 font-bold bg-brand-mint-50 px-2 py-0.5 rounded-full inline-block">
                  {cat.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
