"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Filter,
  Search,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  User,
} from "lucide-react";

interface ReviewItem {
  id: string;
  productTitle: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  status: "APPROVED" | "PENDING" | "REJECTED";
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchReviews = async (status = statusFilter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?status=${status}`);
      const json = await res.json();
      if (json.success) {
        setReviews(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(statusFilter);
  }, [statusFilter]);

  const handleUpdateStatus = async (reviewId: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", message: `Review marked as ${status}.` });
        fetchReviews();
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to update review." });
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this customer review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", message: "Review deleted." });
        fetchReviews();
      }
    } catch (err: any) {
      setNotification({ type: "error", message: "Failed to delete review." });
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
            <Star className="w-3.5 h-3.5 fill-brand-green-800 text-brand-green-800" />
            <span>COMMUNITY FEEDBACK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 tracking-tight">
            Customer Reviews Moderation
          </h1>
          <p className="text-xs text-brand-charcoal-600 mt-1">
            Approve verified customer ratings and testimonials before publishing on the storefront.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 rounded-2xl bg-white border border-brand-cream-300 self-start sm:self-auto">
          {["ALL", "APPROVED", "PENDING"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition ${
                statusFilter === st
                  ? "bg-brand-green-900 text-white shadow-2xs"
                  : "text-brand-charcoal-600 hover:text-brand-green-950"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
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

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl bg-white border border-brand-cream-300 shadow-card hover:shadow-card-hover transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-brand-charcoal-400 uppercase tracking-wider">
                  {rev.productTitle}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    rev.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {rev.status}
                </span>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rev.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-brand-cream-300"
                    }`}
                  />
                ))}
                {rev.isVerified && (
                  <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand-green-800 bg-brand-mint-100 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-brand-green-700" />
                    <span>Verified Buyer</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-heading font-black text-sm text-brand-green-950">
                  {rev.title}
                </h3>
                <p className="text-xs text-brand-charcoal-600 mt-1 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-brand-cream-200 text-xs">
              <div>
                <span className="font-bold text-brand-charcoal-900 block">
                  {rev.userName}
                </span>
                <span className="text-[10px] text-brand-charcoal-400">
                  {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {rev.status !== "APPROVED" && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, "APPROVED")}
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold transition flex items-center gap-1"
                    title="Approve Review"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                )}
                {rev.status !== "REJECTED" && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, "REJECTED")}
                    className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold transition flex items-center gap-1"
                    title="Reject Review"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-2 rounded-xl hover:bg-rose-50 text-rose-600 transition"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

