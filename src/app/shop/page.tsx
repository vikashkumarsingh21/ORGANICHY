"use client";

import { useState, useMemo, useEffect } from "react";
import { DEMO_PRODUCTS } from "@/lib/demoData";
import { ProductType } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { Search, SlidersHorizontal, X, Sparkles, Filter, Layers } from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState<ProductType[]>(DEMO_PRODUCTS);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState<string>("ALL");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("FEATURED");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dynamic Database Loading
  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products?limit=50"),
          fetch("/api/categories"),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodData.success && Array.isArray(prodData.data) && prodData.data.length > 0) {
          setProducts(prodData.data);
        }
        if (catData.success && Array.isArray(catData.data) && catData.data.length > 0) {
          setCategories(catData.data);
        }
      } catch (e) {
        // Fallback to static verified catalog
      } finally {
        setLoading(false);
      }
    }

    fetchCatalog();
  }, []);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== "ALL") {
        if (product.category?.slug !== selectedCategory && (product as any).categoryId !== selectedCategory) {
          return false;
        }
      }

      // Search filter
      if (
        searchQuery &&
        !product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Flavor/Texture filter
      if (selectedFlavor !== "ALL") {
        const matchesFlavor = product.variants.some((v) =>
          v.flavor.toLowerCase().includes(selectedFlavor.toLowerCase())
        );
        if (!matchesFlavor) return false;
      }

      // Price filter (based on default variant price)
      const minPrice = product.variants[0]?.price || 0;
      if (selectedPriceRange === "UNDER_350" && minPrice >= 350) return false;
      if (
        selectedPriceRange === "350_500" &&
        (minPrice < 350 || minPrice > 500)
      )
        return false;
      if (selectedPriceRange === "ABOVE_500" && minPrice <= 500) return false;

      // In Stock filter
      if (inStockOnly) {
        const hasStock = product.variants.some((v) => v.stock > 0);
        if (!hasStock) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.variants[0]?.price || 0;
      const priceB = b.variants[0]?.price || 0;

      if (sortBy === "PRICE_LOW_HIGH") return priceA - priceB;
      if (sortBy === "PRICE_HIGH_LOW") return priceB - priceA;
      if (sortBy === "RATING") return b.rating - a.rating;
      // Default: Featured
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, selectedFlavor, selectedPriceRange, sortBy, inStockOnly]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedFlavor("ALL");
    setSelectedPriceRange("ALL");
    setSortBy("FEATURED");
    setInStockOnly(false);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedFlavor !== "ALL" ||
    selectedPriceRange !== "ALL" ||
    inStockOnly;

  return (
    <div className="py-10 bg-brand-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Shop Header */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-green-950 via-brand-green-900 to-brand-green-800 text-brand-cream-100 shadow-card border border-brand-green-700 relative overflow-hidden">
          {/* Ambient organic glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-brand-mint-400/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-56 h-56 rounded-full bg-brand-green-600/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green-800/90 text-brand-mint-300 text-xs font-bold tracking-wider uppercase border border-brand-green-700">
                <Sparkles className="w-3.5 h-3.5 text-brand-mint-400" />
                <span>100% PURE INDIAN NUTRITION</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight leading-tight">
                All Nutrition Products
              </h1>
              <p className="text-xs sm:text-sm text-brand-cream-200/90 leading-relaxed max-w-xl">
                Explore our slow-roasted, stone-ground peanut butters handcrafted in Moradabad, Uttar Pradesh. Zero palm oil, zero chemical emulsifiers, and up to 30g pure plant protein per 100g.
              </p>
            </div>

            <div className="md:col-span-4 flex md:justify-end">
              <div className="bg-brand-green-900/80 border border-brand-green-700/80 p-4 rounded-2xl backdrop-blur-xs space-y-2">
                <div className="text-[11px] font-bold text-brand-mint-300 uppercase tracking-wider">
                  Moradabad Fresh Dispatch
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-cream-100">
                  <span className="w-2 h-2 rounded-full bg-brand-mint-400 inline-block animate-pulse" />
                  <span>Batch #PB-2026-N08 In Stock</span>
                </div>
                <div className="text-[11px] text-brand-cream-300/80 pt-1 border-t border-brand-green-800">
                  Free delivery on orders over ₹499
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Category Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-2 rounded-full text-xs font-heading font-bold transition whitespace-nowrap ${
              selectedCategory === "ALL"
                ? "bg-brand-green-900 text-brand-cream-100 shadow-sm"
                : "bg-brand-cream-100 text-brand-charcoal-700 border border-brand-cream-300 hover:border-brand-green-800 hover:bg-brand-cream-200"
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-heading font-bold transition whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? "bg-brand-green-900 text-brand-cream-100 shadow-sm"
                  : "bg-brand-cream-100 text-brand-charcoal-700 border border-brand-cream-300 hover:border-brand-green-800 hover:bg-brand-cream-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search, Filter Toggle & Sort Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-subtle">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-brand-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by flavor, protein, texture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-cream-300 bg-brand-cream-50/50 text-xs text-brand-charcoal-900 placeholder:text-brand-charcoal-400 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-charcoal-400 hover:text-brand-charcoal-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-cream-300 text-xs font-bold text-brand-charcoal-800 bg-brand-cream-50"
            >
              <Filter className="w-4 h-4 text-brand-green-800" />
              <span>Filters {hasActiveFilters && "• Active"}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-charcoal-500 font-semibold hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-brand-cream-300 bg-white text-xs font-semibold text-brand-charcoal-800 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 cursor-pointer"
              >
                <option value="FEATURED">Featured First</option>
                <option value="PRICE_LOW_HIGH">Price: Low to High</option>
                <option value="PRICE_HIGH_LOW">Price: High to Low</option>
                <option value="RATING">Highest Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block md:col-span-3 space-y-6">
            <div className="p-6 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-card space-y-6 sticky top-28">
              <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-green-900" />
                  <h3 className="font-heading font-black text-sm text-brand-charcoal-900">
                    Filter Catalog
                  </h3>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-brand-mint-600 hover:text-brand-green-800 font-bold transition"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Texture & Flavor Filter */}
              <div className="space-y-3">
                <label className="text-xs font-heading font-bold text-brand-charcoal-900 block">
                  Texture & Flavor
                </label>
                <div className="space-y-1.5">
                  {[
                    { label: "All Textures", value: "ALL" },
                    { label: "Crunchy (Chunks)", value: "Crunchy" },
                    { label: "Smooth Creamy", value: "Creamy" },
                    { label: "Dark Chocolate", value: "Chocolate" },
                    { label: "Raw Honey Blend", value: "Honey" },
                  ].map((flv) => (
                    <button
                      key={flv.value}
                      onClick={() => setSelectedFlavor(flv.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                        selectedFlavor === flv.value
                          ? "bg-brand-green-900 text-brand-cream-100"
                          : "text-brand-charcoal-700 hover:bg-brand-cream-100"
                      }`}
                    >
                      <span>{flv.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3 pt-4 border-t border-brand-cream-200">
                <label className="text-xs font-heading font-bold text-brand-charcoal-900 block">
                  Price Range
                </label>
                <div className="space-y-1.5">
                  {[
                    { label: "All Prices", value: "ALL" },
                    { label: "Under ₹350 (Trial Jars)", value: "UNDER_350" },
                    { label: "₹350 - ₹500 (Standard)", value: "350_500" },
                    { label: "Above ₹500 (1kg Value Packs)", value: "ABOVE_500" },
                  ].map((pr) => (
                    <button
                      key={pr.value}
                      onClick={() => setSelectedPriceRange(pr.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                        selectedPriceRange === pr.value
                          ? "bg-brand-green-900 text-brand-cream-100"
                          : "text-brand-charcoal-700 hover:bg-brand-cream-100"
                      }`}
                    >
                      <span>{pr.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only Checkbox */}
              <div className="pt-4 border-t border-brand-cream-200">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-green-900 focus:ring-brand-mint-400 border-brand-cream-300 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-brand-charcoal-800">
                    In Stock Jars Only
                  </span>
                </label>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="md:col-span-9 space-y-6">
            
            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-brand-charcoal-500 font-semibold">
                  Active Filters:
                </span>
                {selectedFlavor !== "ALL" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold border border-brand-mint-200">
                    Texture: {selectedFlavor}
                    <button onClick={() => setSelectedFlavor("ALL")}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedPriceRange !== "ALL" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold border border-brand-mint-200">
                    Price: {selectedPriceRange}
                    <button onClick={() => setSelectedPriceRange("ALL")}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold border border-brand-mint-200">
                    &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery("")}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-600 hover:underline font-bold ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="text-xs text-brand-charcoal-500 font-semibold">
              Showing {filteredProducts.length} of {DEMO_PRODUCTS.length} nutrition products
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white border border-brand-cream-300 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-cream-100 flex items-center justify-center mx-auto text-brand-charcoal-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-lg text-brand-charcoal-900">
                  No products matched your criteria
                </h3>
                <p className="text-xs text-brand-charcoal-500 max-w-sm mx-auto">
                  Try clearing some filters or searching for terms like &ldquo;crunchy&rdquo;, &ldquo;creamy&rdquo;, or &ldquo;chocolate&rdquo;.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-full bg-brand-green-900 text-brand-cream-100 text-xs font-bold hover:bg-brand-green-800 transition shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
}

