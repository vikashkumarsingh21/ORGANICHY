"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
} from "lucide-react";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form
  const [category, setCategory] = useState("Product & Ingredients");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faqs");
      const json = await res.json();
      if (json.success) {
        setFaqs(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, question, answer }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", message: "FAQ added successfully." });
        setShowAddModal(false);
        setQuestion("");
        setAnswer("");
        fetchFaqs();
      } else {
        setNotification({ type: "error", message: data.error || "Failed to add FAQ." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Network error." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this FAQ?")) return;
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", message: "FAQ deleted." });
        fetchFaqs();
      }
    } catch (err) {
      setNotification({ type: "error", message: "Failed to delete FAQ." });
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-brand-green-800" />
            <span>KNOWLEDGE BASE MANAGER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-brand-charcoal-600 mt-1">
            Manage product transparency, natural oil separation explanations, and delivery queries.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

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

      {/* FAQs List */}
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="p-6 rounded-3xl bg-white border border-brand-cream-300 shadow-card hover:shadow-card-hover transition space-y-3"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-mint-100 text-brand-green-900 uppercase">
                {faq.category}
              </span>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-1.5 rounded-lg hover:bg-rose-50 text-brand-charcoal-400 hover:text-rose-600 transition"
                title="Delete FAQ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-heading font-black text-sm text-brand-green-950">
              {faq.question}
            </h3>

            <p className="text-xs text-brand-charcoal-600 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Add FAQ Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-brand-cream-300">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-3">
              <h3 className="font-heading font-black text-lg text-brand-green-950">
                Add Knowledge Base FAQ
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-brand-cream-100 text-brand-charcoal-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFaq} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs font-bold text-brand-green-950 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                >
                  <option value="Product & Ingredients">Product &amp; Ingredients</option>
                  <option value="Shipping & Delivery">Shipping &amp; Delivery</option>
                  <option value="Storage & Shelf Life">Storage &amp; Shelf Life</option>
                  <option value="Orders & Payments">Orders &amp; Payments</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Is there any added palm oil?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Answer *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write clear, accurate answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
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
                  {submitting ? "Saving..." : "Add FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

