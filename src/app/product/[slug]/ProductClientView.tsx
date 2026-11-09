"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_PRODUCTS } from "@/lib/demoData";
import ProductGallery from "@/components/ui/ProductGallery";
import ProductCard from "@/components/ui/ProductCard";
import { Tabs } from "@/components/ui/Tabs";
import { formatINR, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/lib/cartStore";
import {
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Sparkles,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductClientView({ params }: ProductPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState(
    DEMO_PRODUCTS.find((p) => p.slug === params.slug) || DEMO_PRODUCTS[0]
  );

  // Dynamic Database Load
  useEffect(() => {
    async function loadDynamicProduct() {
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setProduct(json.data);
        }
      } catch (e) {}
    }
    loadDynamicProduct();
  }, [params.slug]);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Pincode Serviceability State
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeResult, setPincodeResult] = useState<any | null>(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput.trim()) return;
    setCheckingPincode(true);
    setPincodeResult(null);

    try {
      const res = await fetch("/api/shipping/pincode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode: pincodeInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPincodeResult(data.data);
      } else {
        setPincodeResult({ isServiceable: false, message: data.error || "Invalid PIN code." });
      }
    } catch (e: any) {
      setPincodeResult({ isServiceable: false, message: "Failed to verify PIN code serviceability." });
    } finally {
      setCheckingPincode(false);
    }
  };

  const { addItem } = useCartStore();

  const currentVariant =
    product.variants[selectedVariantIndex] || product.variants[0];

  const primaryImage =
    product.images.find((img) => img.variantId === currentVariant?.id)?.url ||
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop";

  const discountPercent = calculateDiscount(
    currentVariant.price,
    currentVariant.compareAtPrice
  );

  const relatedProducts = DEMO_PRODUCTS.filter((p) => p.id !== product.id).slice(
    0,
    3
  );

  const handleAddToCart = () => {
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
      quantity,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
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
      quantity,
    });
    router.push("/checkout");
  };

  return (
    <div className="py-10 bg-brand-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-brand-charcoal-500 flex items-center gap-2">
          <Link href="/" className="hover:text-brand-green-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-green-900">
            Shop
          </Link>
          <span>/</span>
          <span className="font-bold text-brand-charcoal-900 truncate">
            {product.title}
          </span>
        </nav>

        {/* Product Details Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Product Gallery */}
          <div className="lg:col-span-7 sticky top-28">
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* Right Column: Information, Variants & Actions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Category & Badge */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-heading font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider border border-brand-mint-200">
                100% PURE PEANUT BUTTER
              </span>
              <span className="text-xs text-brand-charcoal-500 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-green-700" />
                Moradabad Roasted
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-900 tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Rating Stars & Verified Reviews */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="font-bold text-brand-charcoal-900">
                {product.rating.toFixed(1)} / 5.0
              </span>
              <span className="text-brand-charcoal-500">
                ({product.reviewCount} verified athlete reviews)
              </span>
            </div>

            {/* Price Block */}
            <div className="p-4 rounded-2xl bg-white border border-brand-cream-300 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-heading font-black text-3xl text-brand-green-900">
                  {formatINR(currentVariant.price)}
                </span>
                {currentVariant.compareAtPrice && (
                  <span className="text-sm text-brand-charcoal-400 line-through">
                    {formatINR(currentVariant.compareAtPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-black tracking-wide uppercase">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-brand-charcoal-500">
                Inclusive of all taxes. Free All-India delivery on orders above ₹499.
              </p>
            </div>

            {/* Short Description */}
            <p className="text-sm text-brand-charcoal-700 leading-relaxed">
              {product.description}
            </p>

            {/* Variant Switcher (Size / Weight) */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-heading font-bold text-brand-charcoal-900 block uppercase tracking-wider">
                Select Packaging Size:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((v, idx) => {
                  const isSelected = selectedVariantIndex === idx;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? "border-brand-green-900 bg-brand-green-900 text-brand-cream-100 shadow-sm"
                          : "border-brand-cream-300 bg-white text-brand-charcoal-800 hover:border-brand-mint-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-sm">
                          {v.weight}
                        </span>
                        {v.weight === "1kg" && (
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? "bg-brand-mint-400 text-brand-green-900"
                                : "bg-brand-mint-100 text-brand-green-900"
                            }`}
                          >
                            Best Value
                          </span>
                        )}
                      </div>
                      <span className="text-xs mt-1 font-semibold opacity-90">
                        {formatINR(v.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Action CTAs */}
            <div className="space-y-4 pt-3">
              <div className="flex items-center gap-4">
                <span className="text-xs font-heading font-bold text-brand-charcoal-900 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-brand-cream-300 rounded-full bg-white px-2 py-1 shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-brand-charcoal-600 hover:text-brand-green-900 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-bold text-brand-charcoal-900 min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-brand-charcoal-600 hover:text-brand-green-900 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart & Buy Now Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`py-4 px-6 rounded-full font-heading font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 border-2 ${
                    isAdded
                      ? "bg-brand-mint-500 border-brand-mint-500 text-white"
                      : "border-brand-green-900 bg-white text-brand-green-900 hover:bg-brand-cream-100"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdded ? "Added to Cart!" : "Add to Cart"}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-4 px-6 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-sm tracking-wide shadow-card hover:shadow-hover transition flex items-center justify-center gap-2"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Trust Bullet Strip */}
            <div className="pt-4 border-t border-brand-cream-200/80 grid grid-cols-2 gap-3 text-xs text-brand-charcoal-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-700 shrink-0" />
                <span>Zero Hydrogenated Palm Oil</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-green-700 shrink-0" />
                <span>30g Muscle Protein per 100g</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-green-700 shrink-0" />
                <span>Fast Pan-India Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-green-700 shrink-0" />
                <span>Roasted Fresh in Moradabad</span>
              </div>
            </div>

            {/* Indian Pincode Delivery & SLA Checker */}
            <div className="p-4 rounded-2xl bg-brand-cream-100 border border-brand-cream-300 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-brand-charcoal-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-green-800" />
                  <span>Check Delivery &amp; COD Availability</span>
                </span>
                <span className="text-[10px] text-brand-charcoal-500">
                  Dispatches from Moradabad, UP
                </span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code (e.g. 110001)"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 p-2 rounded-xl border border-brand-cream-300 bg-white text-xs font-mono font-bold text-brand-green-950 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
                <button
                  type="submit"
                  disabled={checkingPincode || pincodeInput.length !== 6}
                  className="px-4 py-2 rounded-xl bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-bold text-xs transition disabled:opacity-50 shrink-0"
                >
                  {checkingPincode ? "Checking..." : "Check"}
                </button>
              </form>

              {pincodeResult && (
                <div
                  className={`p-2.5 rounded-xl text-[11px] font-semibold border flex items-start gap-2 ${
                    pincodeResult.isServiceable
                      ? "bg-white border-brand-mint-300 text-brand-green-900"
                      : "bg-rose-50 border-rose-300 text-rose-800"
                  }`}
                >
                  {pincodeResult.isServiceable ? (
                    <CheckCircle className="w-3.5 h-3.5 text-brand-green-700 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span>{pincodeResult.message}</span>
                    {pincodeResult.isServiceable && (
                      <span className="block text-[10px] text-brand-charcoal-500 font-normal mt-0.5">
                        Free delivery on orders &ge; ₹499 • Courier: {pincodeResult.courierPartner}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Nutritional Breakdown, Ingredients & Directions Tabs */}
        <div className="p-8 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-card">
          <Tabs
            tabs={[
              {
                id: "nutrition",
                label: "Nutrition Facts (per 100g)",
                content: (
                  <div className="space-y-4 pt-2">
                    <p className="text-xs text-brand-charcoal-500">
                      Standard serving: 2 tablespoons (32g). Values are tested by certified independent laboratories.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {Object.entries(product.nutritionFacts || {}).map(([key, val]) => (
                        <div
                          key={key}
                          className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200"
                        >
                          <span className="text-[11px] text-brand-charcoal-500 uppercase tracking-wider block">
                            {key}
                          </span>
                          <span className="font-heading font-black text-xl text-brand-green-900 mt-1 block">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                id: "ingredients",
                label: "Ingredients & Sourcing",
                content: (
                  <div className="space-y-4 pt-2 text-sm text-brand-charcoal-700 leading-relaxed">
                    <div className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 space-y-2">
                      <span className="font-bold text-brand-green-900 block">
                        Full Ingredient List:
                      </span>
                      <p>{product.ingredients}</p>
                    </div>
                    <p>
                      <strong>Farm Origin:</strong> 100% Indian farm-grown runner peanuts sourced from premier certified growers in Gujarat and Maharashtra.
                    </p>
                    <p>
                      <strong>Purity Guarantee:</strong> Zero added palm oil, zero vanaspati, zero chemical emulsifiers, zero preservatives, and zero artificial flavoring agents.
                    </p>
                  </div>
                ),
              },
              {
                id: "benefits",
                label: "Core Health Benefits",
                content: (
                  <ul className="space-y-2.5 pt-2 text-sm text-brand-charcoal-700">
                    {product.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-brand-green-700 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ),
              },
            ]}
          />
        </div>

        {/* Customer Reviews Section */}
        <div className="p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-200 pb-6">
            <div>
              <h3 className="font-heading font-black text-2xl text-brand-green-900">
                Customer Reviews ({product.reviewCount})
              </h3>
              <p className="text-xs text-brand-charcoal-500 mt-1">
                Verified feedback from athletes, gym lovers, and nutritionists across India.
              </p>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-2.5 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 text-xs font-bold font-heading transition self-start sm:self-auto"
            >
              {showReviewForm ? "Close Form" : "Write a Review"}
            </button>
          </div>

          {/* Review Submission Form Toggle */}
          {showReviewForm && (
            <div className="p-6 rounded-2xl bg-brand-cream-50 border border-brand-cream-300 space-y-4">
              <h4 className="font-heading font-bold text-base text-brand-green-900">
                Submit Your Verified Review
              </h4>
              {reviewSubmitted ? (
                <div className="p-4 rounded-xl bg-brand-mint-100 text-brand-green-900 text-xs font-semibold">
                  ✓ Thank you! Your review has been submitted for moderation.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setReviewSubmitted(true);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      className="p-3 rounded-xl border border-brand-cream-300 bg-white"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email Address"
                      className="p-3 rounded-xl border border-brand-cream-300 bg-white"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Headline (e.g. Best natural crunch I've tried)"
                    className="w-full p-3 rounded-xl border border-brand-cream-300 bg-white"
                  />
                  <textarea
                    rows={3}
                    required
                    placeholder="Share your experience regarding texture, roasted aroma, and gym performance..."
                    className="w-full p-3 rounded-xl border border-brand-cream-300 bg-white"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-brand-green-900 text-brand-cream-100 font-bold"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Sample Verified Reviews */}
          <div className="space-y-4">
            {[
              {
                name: "Aryan Malhotra",
                role: "Gym Athlete, Delhi",
                rating: 5,
                title: "Incredible crunch with zero palm oil bloating",
                comment:
                  "I was tired of commercial brands with heavy stabilizers that slow down digestion. ORGANICHY Classic Crunchy gives me clean energy before my deadlifts. Delivered from Moradabad in 48 hours.",
                date: "2 days ago",
              },
              {
                name: "Dr. Sunita Rao",
                role: "Nutritionist, Pune",
                rating: 5,
                title: "Clean label, exactly as nutrition should be",
                comment:
                  "Zero sugar, zero emulsifiers, and true 30g protein yield. Outstanding texture and roasted smell upon opening the induction seal.",
                date: "1 week ago",
              },
            ].map((rev) => (
              <div
                key={rev.name}
                className="p-5 rounded-2xl bg-brand-cream-50/50 border border-brand-cream-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-brand-charcoal-400">
                    {rev.date}
                  </span>
                </div>
                <h5 className="font-heading font-bold text-sm text-brand-charcoal-900">
                  {rev.title}
                </h5>
                <p className="text-xs text-brand-charcoal-600 leading-relaxed">
                  {rev.comment}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-brand-green-800 font-semibold">
                  <span>{rev.name} ({rev.role})</span>
                  <span>•</span>
                  <span className="text-brand-mint-600 flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" />
                    Verified Purchase
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-2xl text-brand-green-900">
              You Might Also Like
            </h3>
            <Link
              href="/shop"
              className="text-xs font-bold text-brand-green-900 hover:text-brand-green-700 flex items-center gap-1"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

