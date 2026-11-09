"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  _count?: {
    products: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description, imageUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", message: `Category '${name}' created successfully.` });
        setShowAddModal(false);
        setName("");
        setSlug("");
        setDescription("");
        setImageUrl("");
        fetchCategories();
      } else {
        setNotification({ type: "error", message: data.error || "Failed to create category." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Network error." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200 mb-2">
            <FolderTree className="w-3.5 h-3.5 text-brand-green-800" />
            <span>CATALOG TAXONOMY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 tracking-tight">
            Product Categories
          </h1>
          <p className="text-xs text-brand-charcoal-600 mt-1">
            Organize peanut butter, oats, clean protein and future nutrition lines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {notification.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={cat.id || idx}
            className="p-6 rounded-3xl bg-white border border-brand-cream-300 shadow-card hover:shadow-card-hover transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-brand-charcoal-400 uppercase tracking-wider">
                  Slug: {cat.slug}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-mint-100 text-brand-green-900">
                  {cat._count?.products || 0} Products
                </span>
              </div>

              <div>
                <h3 className="font-heading font-black text-lg text-brand-green-950">
                  {cat.name}
                </h3>
                <p className="text-xs text-brand-charcoal-500 mt-1 line-clamp-2">
                  {cat.description || "Nutrition catalog department for ORGANICHY."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-brand-cream-200 text-xs">
              <Link
                href={`/admin/products?category=${cat.slug}`}
                className="font-bold text-brand-green-800 hover:text-brand-green-950 flex items-center gap-1"
              >
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-brand-cream-300">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-3">
              <h3 className="font-heading font-black text-lg text-brand-green-950">
                Create New Category
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-brand-cream-100 text-brand-charcoal-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whey Protein Isolate"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">URL Slug *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. whey-protein-isolate"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs font-mono text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Description</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe the product range..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-cream-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-brand-cream-300 text-brand-charcoal-600 font-bold hover:bg-brand-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold shadow-xs disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

