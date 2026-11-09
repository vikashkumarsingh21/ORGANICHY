"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImageType } from "@/types";
import { Sparkles, ShieldCheck } from "lucide-react";

interface ProductGalleryProps {
  images: ProductImageType[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [
    {
      id: "fallback",
      url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1000&auto=format&fit=crop",
      altText: title,
      displayOrder: 1,
      isThumbnail: true,
    },
  ];

  const activeImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnail Bar (Horizontal on mobile/tablet, vertical on desktop) */}
      {displayImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar py-1 lg:w-20 shrink-0">
          {displayImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === idx
                  ? "border-brand-green-800 ring-2 ring-brand-mint-300 shadow-sm"
                  : "border-brand-cream-300 hover:border-brand-mint-400 opacity-75 hover:opacity-100"
              }`}
              aria-label={`View product image ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${title} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Showcase */}
      <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden border-2 border-brand-cream-300 bg-brand-cream-100 shadow-card group">
        <Image
          src={activeImage.url}
          alt={activeImage.altText || title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
        />

        {/* Brand Authenticity Floating Pill */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-brand-cream-50/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xs text-xs font-bold text-brand-green-900 border border-brand-cream-300">
          <Sparkles className="w-3.5 h-3.5 text-brand-mint-500 fill-brand-mint-400" />
          <span>Slow Roasted in Moradabad</span>
        </div>

        {/* Quality Guarantee Pill */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-brand-green-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold text-brand-cream-100 border border-brand-green-700 shadow">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-mint-400" />
          <span>Zero Hydrogenated Palm Oil</span>
        </div>
      </div>
    </div>
  );
}

