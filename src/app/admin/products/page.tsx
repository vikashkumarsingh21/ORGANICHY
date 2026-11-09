"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Layers,
  Tag,
  DollarSign,
  BarChart2,
  Image as ImageIcon,
  X,
  ExternalLink,
  Building2,
  LogOut,
  FolderPlus,
} from "lucide-react";

interface VariantItem {
  id?: string;
  name: string;
  weight: string;
  flavor: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  isDefault?: boolean;
}

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description: string;
  ingredients?: string | null;
  benefits?: string[];
  nutritionFacts?: any;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  isFeatured: boolean;
  isBestSeller: boolean;
  rating?: number;
  reviewCount?: number;
  variants: Array<VariantItem & { inventory?: { stockQuantity: number } }>;
  images: Array<{ id?: string; url: string; altText?: string; isThumbnail?: boolean }>;
}

interface ProductFormData {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  ingredients: string;
  categoryId: string;
  status: "ACTIVE" | "DRAFT";
  isFeatured: boolean;
  isBestSeller: boolean;
  benefits: string[];
  nutritionFacts: any;
  images: Array<{ url: string; altText?: string }>;
  variants: Array<{
    name: string;
    weight: string;
    flavor: string;
    sku: string;
    price: number;
    compareAtPrice?: number | null;
    stock: number;
    isDefault?: boolean;
  }>;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Category Form
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");

  // Product Form State
  const [form, setForm] = useState<ProductFormData>({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    ingredients: "",
    categoryId: "cat-pb",
    status: "ACTIVE",
    isFeatured: false,
    isBestSeller: false,
    benefits: ["30g Plant-Based Protein per 100g", "Zero Palm Oil & Zero Added Sugar"],
    nutritionFacts: {
      Energy: "624 kcal",
      Protein: "30.2 g",
      Carbohydrates: "18.5 g",
      Fats: "48.6 g",
      Fiber: "8.2 g",
    },
    images: [
      { url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop", altText: "ORGANICHY Jar" },
    ],
    variants: [
      {
        name: "1kg Classic Crunchy",
        weight: "1kg",
        flavor: "Crunchy",
        sku: "ORG-PB-CRU-1000",
        price: 499,
        compareAtPrice: 649,
        stock: 100,
        isDefault: true,
      },
    ],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/admin/products?status=${selectedStatus}&category=${selectedCategory}&search=${encodeURIComponent(searchQuery)}`),
        fetch("/api/admin/categories"),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success) setProducts(prodData.data);
      if (catData.success) setCategories(catData.data);
    } catch (e) {
      console.error("Failed to load admin products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  // Toggle Publish / Unpublish
  const handleTogglePublish = async (product: ProductItem) => {
    const newStatus = product.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
        );
        setFeedback({
          type: "success",
          text: `Product '${product.title}' is now ${newStatus === "ACTIVE" ? "Published" : "Unpublished"}.`,
        });
      }
    } catch (e) {}
  };

  // Archive / Delete
  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to archive '${title}'? It will be removed from customer view.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setFeedback({ type: "success", text: `Product '${title}' archived successfully.` });
      }
    } catch (e) {}
  };

  // Open Edit Modal
  const handleEditClick = (p: ProductItem) => {
    setEditingProductId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDescription || "",
      description: p.description,
      ingredients: p.ingredients || "",
      categoryId: p.categoryId,
      status: p.status === "ARCHIVED" ? "DRAFT" : p.status,
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      benefits: p.benefits?.length ? p.benefits : ["100% Roasted Indian Peanuts", "Pure Natural Protein"],
      nutritionFacts: p.nutritionFacts || {
        Energy: "620 kcal",
        Protein: "30g",
        Carbohydrates: "18g",
        Fats: "48g",
      },
      images: p.images?.length
        ? p.images.map((img) => ({ url: img.url, altText: img.altText || p.title }))
        : [{ url: "", altText: p.title }],
      variants: p.variants?.length
        ? p.variants.map((v) => ({
            name: v.name,
            weight: v.weight,
            flavor: v.flavor,
            sku: v.sku,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stock: v.stock,
            isDefault: v.isDefault,
          }))
        : [
            { name: "1kg", weight: "1kg", flavor: "Natural", sku: "ORG-NEW", price: 499, stock: 100 },
          ],
    });
    setShowProductModal(true);
  };

  // Handle Save Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      const url = editingProductId
        ? `/api/admin/products/${editingProductId}`
        : "/api/admin/products";
      const method = editingProductId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setShowProductModal(false);
      setEditingProductId(null);
      setFeedback({ type: "success", text: "Product saved successfully!" });
      loadData();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save product" });
    }
  };

  // Handle Add Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName, slug: catSlug, description: catDesc }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setCategories((prev) => [...prev, data.data]);
      setShowCategoryModal(false);
      setCatName("");
      setCatSlug("");
      setCatDesc("");
      setFeedback({ type: "success", text: `Category created successfully!` });
    } catch (err: any) {
      alert(err.message || "Failed to create category");
    }
  };

  // Variant helper: add row
  const handleAddVariantRow = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: "500g Classic Crunchy",
          weight: "500g",
          flavor: "Crunchy",
          sku: `ORG-PB-${Math.floor(100 + Math.random() * 900)}`,
          price: 289,
          compareAtPrice: 375,
          stock: 100,
        },
      ],
    }));
  };

  return (
    <div className="min-h-screen bg-brand-cream-50 text-brand-charcoal-900 pb-20">
      
      {/* Top Admin Navbar */}
      <header className="bg-brand-charcoal-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-brand-green-800 text-brand-mint-300 flex items-center justify-center font-black text-xs">
              O
            </span>
            <div className="flex flex-col">
              <span className="font-heading font-black text-sm tracking-wide text-white">
                ORGANICHY HQ
              </span>
              <span className="text-[9px] text-brand-charcoal-400 uppercase tracking-widest font-mono">
                Store Administrator Portal
              </span>
            </div>
          </div>

          {/* Admin Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-heading font-bold">
            <Link
              href="/admin/products"
              className="px-3 py-1.5 rounded-full bg-brand-green-800 text-brand-cream-100 transition"
            >
              Catalog & Products
            </Link>
            <Link
              href="/admin/inventory"
              className="px-3 py-1.5 rounded-full hover:bg-brand-charcoal-800 text-brand-charcoal-300 hover:text-white transition"
            >
              Inventory Management
            </Link>
            <Link
              href="/admin/media"
              className="px-3 py-1.5 rounded-full hover:bg-brand-charcoal-800 text-brand-charcoal-300 hover:text-white transition"
            >
              Media Library
            </Link>
            <Link
              href="/admin/cms"
              className="px-3 py-1.5 rounded-full hover:bg-brand-charcoal-800 text-brand-charcoal-300 hover:text-white transition"
            >
              Website CMS
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-xs text-brand-charcoal-300 hover:text-brand-mint-300 transition"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/account"
              className="text-xs px-3 py-1.5 rounded-full bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-brand-charcoal-200"
            >
              Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-heading font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
              CATALOG ENGINE
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-900 tracking-tight mt-1">
              Product Catalog Management
            </h1>
            <p className="text-xs text-brand-charcoal-500">
              Add new nutrition products, edit nutritional facts, upload images, manage variants, and update pricing.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2.5 rounded-full border border-brand-cream-300 bg-white hover:border-brand-green-800 text-xs font-bold text-brand-charcoal-700 hover:text-brand-green-900 transition flex items-center gap-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Category</span>
            </button>

            <button
              onClick={() => {
                setEditingProductId(null);
                setForm({
                  title: "",
                  slug: "",
                  shortDescription: "",
                  description: "",
                  ingredients: "100% Slow-Roasted Peanuts.",
                  categoryId: categories[0]?.id || "cat-pb",
                  status: "ACTIVE",
                  isFeatured: true,
                  isBestSeller: false,
                  benefits: ["30g Pure Protein", "Zero Added Sugar & Zero Palm Oil"],
                  nutritionFacts: {
                    Energy: "624 kcal",
                    Protein: "30.2 g",
                    Carbohydrates: "18.5 g",
                    Fats: "48.6 g",
                  },
                  images: [{ url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop", altText: "ORGANICHY Jar" }],
                  variants: [
                    {
                      name: "1kg Classic Crunchy",
                      weight: "1kg",
                      flavor: "Crunchy",
                      sku: `ORG-PB-${Date.now().toString().slice(-4)}`,
                      price: 499,
                      compareAtPrice: 649,
                      stock: 100,
                      isDefault: true,
                    },
                  ],
                });
                setShowProductModal(true);
              }}
              className="px-5 py-2.5 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-3 animate-fadeIn ${
              feedback.type === "success"
                ? "bg-brand-mint-100 border border-brand-mint-200 text-brand-green-900"
                : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}
          >
            <span>{feedback.text}</span>
            <button onClick={() => setFeedback(null)} className="font-bold">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filters & Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-brand-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title or slug..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-brand-cream-300 focus:border-brand-green-800 outline-none bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-green-900 text-brand-cream-100 text-xs font-bold"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-brand-cream-300 text-xs font-medium text-brand-charcoal-700 bg-white outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-brand-cream-300 text-xs font-medium text-brand-charcoal-700 bg-white outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Published (Active)</option>
              <option value="DRAFT">Unpublished (Draft)</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Product Catalog Table */}
        <div className="p-6 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-brand-cream-200 pb-3">
            <h3 className="font-heading font-black text-sm text-brand-green-900 uppercase tracking-wider">
              Product List ({products.length})
            </h3>
            <span className="text-xs text-brand-charcoal-500">
              Live database items synced
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-brand-charcoal-500">
              Loading products from database...
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Package className="w-8 h-8 text-brand-charcoal-400 mx-auto" />
              <p className="text-xs text-brand-charcoal-600">No products match your search or filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-brand-cream-200">
              {products.map((p) => {
                const totalStock = p.variants?.reduce(
                  (acc, v) => acc + (v.inventory?.stockQuantity ?? v.stock ?? 0),
                  0
                );
                const minPrice = Math.min(...(p.variants?.map((v) => v.price) || [0]));
                const maxPrice = Math.max(...(p.variants?.map((v) => v.price) || [0]));

                return (
                  <div
                    key={p.id}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-brand-cream-50/50 rounded-2xl px-3 transition"
                  >
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-brand-cream-100 border border-brand-cream-200 relative shrink-0">
                        {p.images?.[0]?.url ? (
                          <Image
                            src={p.images[0].url}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-charcoal-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Title & Category */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-brand-charcoal-900">
                            {p.title}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              p.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800"
                                : p.status === "DRAFT"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-brand-charcoal-200 text-brand-charcoal-700"
                            }`}
                          >
                            {p.status}
                          </span>
                          {p.isFeatured && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand-mint-100 text-brand-green-900">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-brand-charcoal-500">
                          <span className="font-mono text-[11px] text-brand-green-800">
                            /{p.slug}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-brand-charcoal-700">
                            Category: {p.category?.name || "Peanut Butter"}
                          </span>
                          <span>•</span>
                          <span>{p.variants?.length || 0} variant(s)</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="flex items-center gap-6 justify-between md:justify-end">
                      <div className="text-right">
                        <span className="text-[10px] text-brand-charcoal-500 uppercase block font-bold">
                          Price Range
                        </span>
                        <span className="text-xs font-heading font-black text-brand-green-900">
                          {minPrice === maxPrice
                            ? formatINR(minPrice)
                            : `${formatINR(minPrice)} - ${formatINR(maxPrice)}`}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-brand-charcoal-500 uppercase block font-bold">
                          Total Stock
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            totalStock <= 15 ? "text-rose-600 font-black" : "text-brand-charcoal-800"
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          title={p.status === "ACTIVE" ? "Unpublish Product" : "Publish Product"}
                          className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                            p.status === "ACTIVE"
                              ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {p.status === "ACTIVE" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span className="hidden sm:inline">
                            {p.status === "ACTIVE" ? "Unpublish" : "Publish"}
                          </span>
                        </button>

                        <button
                          onClick={() => handleEditClick(p)}
                          className="p-2 rounded-xl border border-brand-cream-300 text-brand-charcoal-700 hover:text-brand-green-900 hover:bg-white transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="p-2 rounded-xl border border-brand-cream-300 text-rose-600 hover:bg-rose-50 transition"
                          title="Archive Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* PRODUCT CREATE / EDIT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-brand-cream-300 overflow-hidden max-h-[92vh] flex flex-col">
            
            <div className="p-6 border-b border-brand-cream-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-heading font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  {editingProductId ? "EDIT PRODUCT" : "NEW NUTRITION PRODUCT"}
                </span>
                <h3 className="text-xl font-heading font-black text-brand-green-900 mt-1">
                  {editingProductId ? `Edit: ${form.title}` : "Add Product to ORGANICHY Catalog"}
                </h3>
              </div>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-2 rounded-full hover:bg-brand-cream-100 text-brand-charcoal-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6">
              
              {/* Section 1: General Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-heading font-black text-brand-green-900 uppercase tracking-wider border-b border-brand-cream-200 pb-2">
                  1. General Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-charcoal-800">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm({
                          ...form,
                          title: val,
                          slug: editingProductId ? form.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        });
                      }}
                      placeholder="e.g. 100% Pure Dark Chocolate Peanut Butter"
                      className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs outline-none bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-charcoal-800">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="dark-chocolate-peanut-butter"
                      className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs font-mono outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-charcoal-800">Category *</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs outline-none bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-charcoal-800">Catalog Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs outline-none bg-white"
                    >
                      <option value="ACTIVE">Published (Live in Store)</option>
                      <option value="DRAFT">Draft (Hidden from Store)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">Short Summary Description</label>
                  <input
                    type="text"
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    placeholder="Slow-roasted peanuts with dark cocoa and 26g plant protein."
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs outline-none bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">Full Product Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Handcrafted in Moradabad using slow golden roasting..."
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs outline-none bg-white"
                  />
                </div>
              </div>

              {/* Section 2: Product Variants & Pricing */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-brand-cream-200 pb-2">
                  <h4 className="text-xs font-heading font-black text-brand-green-900 uppercase tracking-wider">
                    2. Product Variants, SKU & Pricing
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="text-xs font-bold text-brand-green-800 hover:text-brand-green-900 underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Size Variant</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {form.variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 grid grid-cols-2 sm:grid-cols-6 gap-2 items-center text-xs"
                    >
                      <div className="col-span-2">
                        <label className="text-[10px] text-brand-charcoal-500 block">Variant Name</label>
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => {
                            const newV = [...form.variants];
                            newV[idx].name = e.target.value;
                            setForm({ ...form, variants: newV });
                          }}
                          className="w-full p-1.5 rounded-lg border border-brand-cream-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-brand-charcoal-500 block">Weight</label>
                        <input
                          type="text"
                          value={v.weight}
                          onChange={(e) => {
                            const newV = [...form.variants];
                            newV[idx].weight = e.target.value;
                            setForm({ ...form, variants: newV });
                          }}
                          className="w-full p-1.5 rounded-lg border border-brand-cream-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-brand-charcoal-500 block">Sale Price (₹)</label>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => {
                            const newV = [...form.variants];
                            newV[idx].price = parseFloat(e.target.value) || 0;
                            setForm({ ...form, variants: newV });
                          }}
                          className="w-full p-1.5 rounded-lg border border-brand-cream-300 text-xs bg-white font-bold text-brand-green-900"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-brand-charcoal-500 block">MRP (₹)</label>
                        <input
                          type="number"
                          value={v.compareAtPrice || ""}
                          onChange={(e) => {
                            const newV = [...form.variants];
                            newV[idx].compareAtPrice = e.target.value ? parseFloat(e.target.value) : null;
                            setForm({ ...form, variants: newV });
                          }}
                          className="w-full p-1.5 rounded-lg border border-brand-cream-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-brand-charcoal-500 block">Stock Qty</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => {
                            const newV = [...form.variants];
                            newV[idx].stock = parseInt(e.target.value, 10) || 0;
                            setForm({ ...form, variants: newV });
                          }}
                          className="w-full p-1.5 rounded-lg border border-brand-cream-300 text-xs bg-white font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Ingredients & Nutrition */}
              <div className="space-y-4">
                <h4 className="text-xs font-heading font-black text-brand-green-900 uppercase tracking-wider border-b border-brand-cream-200 pb-2">
                  3. Nutrition & Ingredients (Owner-Approved)
                </h4>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">Ingredients Statement *</label>
                  <input
                    type="text"
                    required
                    value={form.ingredients}
                    onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                    placeholder="100% Slow-Roasted Indian Farm Peanuts. Zero Added Sugar."
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs outline-none bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-brand-charcoal-600 font-bold block">Protein (per 100g)</label>
                    <input
                      type="text"
                      value={form.nutritionFacts?.Protein || "30g"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          nutritionFacts: { ...form.nutritionFacts, Protein: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-xl border border-brand-cream-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-brand-charcoal-600 font-bold block">Energy (Calories)</label>
                    <input
                      type="text"
                      value={form.nutritionFacts?.Energy || "620 kcal"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          nutritionFacts: { ...form.nutritionFacts, Energy: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-xl border border-brand-cream-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-brand-charcoal-600 font-bold block">Healthy Fats</label>
                    <input
                      type="text"
                      value={form.nutritionFacts?.Fats || "48g"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          nutritionFacts: { ...form.nutritionFacts, Fats: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-xl border border-brand-cream-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-brand-charcoal-600 font-bold block">Carbohydrates</label>
                    <input
                      type="text"
                      value={form.nutritionFacts?.Carbohydrates || "18g"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          nutritionFacts: { ...form.nutritionFacts, Carbohydrates: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-xl border border-brand-cream-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Images */}
              <div className="space-y-4">
                <h4 className="text-xs font-heading font-black text-brand-green-900 uppercase tracking-wider border-b border-brand-cream-200 pb-2">
                  4. Product Photography
                </h4>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-charcoal-800">Image URL (Cloudinary / CDN)</label>
                  <input
                    type="url"
                    value={form.images[0]?.url || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        images: [{ url: e.target.value, altText: form.title }],
                      })
                    }
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs outline-none bg-white"
                  />
                  <p className="text-[11px] text-brand-charcoal-500">
                    Tip: Upload and manage high-resolution photos in the{" "}
                    <Link href="/admin/media" className="font-bold text-brand-green-800 underline">
                      Media Library
                    </Link>{" "}
                    and copy URLs here.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-cream-200">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 rounded-full border border-brand-cream-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-brand-green-900 text-brand-cream-100 font-heading font-bold text-xs uppercase tracking-wider"
                >
                  {editingProductId ? "Save Changes" : "Publish to Catalog"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CATEGORY CREATE MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-brand-cream-300 overflow-hidden">
            <div className="p-6 border-b border-brand-cream-200 flex items-center justify-between">
              <h3 className="text-lg font-heading font-black text-brand-green-900">
                Add Nutrition Category
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="p-1">
                <X className="w-5 h-5 text-brand-charcoal-500" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-800">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }}
                  placeholder="e.g. Mass Gainers"
                  className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs outline-none bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-800">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="mass-gainers"
                  className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs font-mono outline-none bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-800">Description</label>
                <input
                  type="text"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="High-calorie athletic fuel for serious bodybuilders."
                  className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs outline-none bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-full border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-brand-green-900 text-brand-cream-100 text-xs font-bold uppercase"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

