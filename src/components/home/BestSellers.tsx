"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { DEMO_PRODUCTS } from "@/lib/demoData";
import ProductCard from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function BestSellers() {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const bestSellerProducts = DEMO_PRODUCTS.filter((p) => p.isBestSeller);

  const filteredProducts =
    activeFilter === "ALL"
      ? bestSellerProducts
      : bestSellerProducts.filter((p) =>
          p.title.toLowerCase().includes(activeFilter.toLowerCase())
        );

  return (
    <section className="py-20 bg-brand-cream-100/60 border-b border-brand-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide mb-3 border border-brand-mint-200">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>COMMUNITY FAVORITES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-900 tracking-tight leading-tight">
              Best Sellers of the Season
            </h2>
            <p className="text-sm text-brand-charcoal-600 mt-2 max-w-xl">
              Hand-picked by thousands of Indian lifters, fitness enthusiasts, and athletes. Freshly ground in small batches with zero hydrogenated fats.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-heading font-bold text-brand-green-900 hover:text-brand-green-700 transition group self-start md:self-end"
          >
            <span>See Complete Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6">
          {[
            { label: "All Bestsellers", value: "ALL" },
            { label: "Crunchy Texture", value: "crunchy" },
            { label: "Creamy Texture", value: "creamy" },
            { label: "Dark Chocolate", value: "chocolate" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 rounded-full text-xs font-heading font-bold transition whitespace-nowrap border ${
                activeFilter === tab.value
                  ? "bg-brand-green-900 text-brand-cream-100 border-brand-green-900 shadow-xs"
                  : "bg-brand-cream-100 text-brand-charcoal-700 border-brand-cream-300 hover:border-brand-mint-400 hover:bg-brand-cream-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Freshness Assurance Box */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-brand-cream-100/90 border border-brand-cream-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-mint-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-brand-green-800" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-charcoal-900">
                Fresh Batch Guarantee
              </h4>
              <p className="text-xs text-brand-charcoal-500">
                Every jar dispatched is roasted within 7 days of your order from our Moradabad facility.
              </p>
            </div>
          </div>
          <span className="text-xs font-heading font-bold text-brand-green-800 bg-brand-cream-100 px-3 py-1.5 rounded-full border border-brand-cream-300 shrink-0">
            Current Batch: Batch #PB-2026-N08
          </span>
        </div>

      </div>
    </section>
  );
}

