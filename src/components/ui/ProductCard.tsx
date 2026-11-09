"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Check, Eye } from "lucide-react";
import { ProductType } from "@/types";
import { formatINR, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/lib/cartStore";

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();

  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const primaryImage =
    product.images.find((img) => img.variantId === currentVariant?.id)?.url ||
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop";

  const discountPercent = calculateDiscount(
    currentVariant.price,
    currentVariant.compareAtPrice
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      variantId: currentVariant.id,
      title: product.title,
      variantName: currentVariant.name,
      weight: currentVariant.weight,
      flavor: currentVariant.flavor,
      price: currentVariant.price,
      compareAtPrice: currentVariant.compareAtPrice,
      image: primaryImage,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group rounded-2xl bg-brand-cream-100/90 border border-brand-cream-300 hover:border-brand-mint-400/80 shadow-subtle hover:shadow-hover transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Link */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block w-full aspect-square overflow-hidden bg-brand-cream-200/80"
      >
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Stack */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="px-2.5 py-1 rounded-full bg-brand-green-900 text-brand-cream-100 text-[10px] font-bold tracking-wider uppercase shadow">
              Best Seller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase shadow">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Floating Nutrition Highlight */}
        <div className="absolute bottom-3 left-3 right-3 bg-brand-cream-50/95 backdrop-blur-xs py-1.5 px-3 rounded-lg text-[11px] font-semibold text-brand-green-900 flex items-center justify-between shadow-xs border border-brand-cream-300">
          <span className="flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green-600 inline-block" />
            30g Protein/100g
          </span>
          <span className="text-brand-charcoal-500 font-normal">0% Palm Oil</span>
        </div>
      </Link>

      {/* Product Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Reviews Rating */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-bold text-brand-charcoal-900">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-brand-charcoal-500">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-heading font-bold text-base text-brand-charcoal-900 group-hover:text-brand-green-800 transition line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-xs text-brand-charcoal-500 line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Variant Selectors (Weight / Packaging) */}
        {product.variants.length > 1 && (
          <div className="space-y-1">
            <span className="text-[10px] text-brand-charcoal-400 uppercase tracking-wider font-semibold">
              Select Size:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariantIndex(idx);
                  }}
                  className={`text-[11px] px-3 py-1 rounded-md font-semibold transition border ${
                    selectedVariantIndex === idx
                      ? "bg-brand-green-900 text-brand-cream-100 border-brand-green-900"
                      : "bg-brand-cream-50 text-brand-charcoal-700 border-brand-cream-300 hover:border-brand-mint-400"
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Action Block */}
        <div className="pt-3 border-t border-brand-cream-200/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-xl text-brand-green-900">
                {formatINR(currentVariant.price)}
              </span>
              {currentVariant.compareAtPrice && (
                <span className="text-xs text-brand-charcoal-400 line-through">
                  {formatINR(currentVariant.compareAtPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-brand-mint-600 font-bold bg-brand-mint-50 px-2 py-0.5 rounded">
              Fresh Batch
            </span>
          </div>

          {/* Action Buttons: Add to Cart & View Details */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href={`/product/${product.slug}`}
              className="py-2.5 px-3 rounded-full border border-brand-cream-300 hover:border-brand-green-800 text-brand-charcoal-700 hover:text-brand-green-900 font-heading font-bold text-xs tracking-wide transition flex items-center justify-center gap-1.5 bg-brand-cream-50/60 hover:bg-brand-cream-100"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </Link>

            <button
              onClick={handleAddToCart}
              className={`py-2.5 px-3 rounded-full font-heading font-bold text-xs tracking-wide transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
                isAdded
                  ? "bg-brand-mint-500 text-white"
                  : "bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100"
              }`}
              aria-label={`Add ${product.title} to cart`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
