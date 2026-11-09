"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import {
  Tag,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Percent,
  Copy,
  Check,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Gift,
  ArrowRight,
  Power,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface CouponItem {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue?: number | null;
  startDate: string;
  endDate: string;
  usageLimit?: number | null;
  usageCount: number;
  isActive: boolean;
  createdAt?: string;
  _count?: { orders: number };
}

interface CouponFormData {
  id?: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number | "";
  startDate: string;
  endDate: string;
  usageLimit: number | "";
  isActive: boolean;
}

const INITIAL_FORM: CouponFormData = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: 10,
  minOrderValue: 299,
  maxDiscountValue: 200,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  usageLimit: 1000,
  isActive: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live Coupon Simulator Tester State
  const [testCode, setTestCode] = useState("ORGANICHY10");
  const [testSubtotal, setTestSubtotal] = useState(599);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [testingCoupon, setTestingCoupon] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCoupons(data.data);
      }
    } catch (e) {
      console.error("Failed to load coupons", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenCreateModal = () => {
    setFormData(INITIAL_FORM);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: CouponItem) => {
    setFormData({
      id: c.id,
      code: c.code,
      description: c.description || "",
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderValue: c.minOrderValue,
      maxDiscountValue: c.maxDiscountValue ?? "",
      startDate: new Date(c.startDate).toISOString().split("T")[0],
      endDate: new Date(c.endDate).toISOString().split("T")[0],
      usageLimit: c.usageLimit ?? "",
      isActive: c.isActive,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (coupon: CouponItem) => {
    const updatedStatus = !coupon.isActive;
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, isActive: updatedStatus } : c))
        );
        setNotification({
          type: "success",
          message: `Coupon '${coupon.code}' is now ${updatedStatus ? "Active" : "Inactive"}.`,
        });
      } else {
        throw new Error(data.error || "Failed to update status");
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    }
  };

  const handleDelete = async (coupon: CouponItem) => {
    if (!confirm(`Are you sure you want to delete coupon '${coupon.code}'?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
        setNotification({
          type: "success",
          message: `Coupon '${coupon.code}' was deleted.`,
        });
      } else {
        throw new Error(data.error || "Failed to delete coupon");
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    const payload = {
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim() || undefined,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue) || 0,
      maxDiscountValue: formData.maxDiscountValue !== "" ? Number(formData.maxDiscountValue) : undefined,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      usageLimit: formData.usageLimit !== "" ? Number(formData.usageLimit) : undefined,
      isActive: formData.isActive,
    };

    try {
      const url = isEditing
        ? `/api/admin/coupons/${formData.id}`
        : "/api/admin/coupons";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save coupon");
      }

      setNotification({
        type: "success",
        message: data.message || "Coupon saved successfully!",
      });

      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestingCoupon(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: testCode,
          subtotal: Number(testSubtotal),
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setTestingCoupon(false);
    }
  };

  // KPI Calculations
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  // Filtered List
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && c.isActive) ||
      (statusFilter === "INACTIVE" && !c.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Discounts &amp; Campaigns
            </span>
            <span className="text-xs text-brand-charcoal-400">•</span>
            <span className="text-xs font-semibold text-brand-charcoal-500">
              Moradabad Headquarters
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 mt-1">
            Discount Coupon Console
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal-600 mt-1">
            Create and monitor promotional promo codes, percentage discounts, flat cashbacks and free delivery campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide shadow-sm hover:shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Coupon</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-medium border ${
            notification.type === "success"
              ? "bg-brand-mint-50 border-brand-mint-300 text-brand-green-900"
              : "bg-rose-50 border-rose-300 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-brand-green-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-brand-charcoal-400 hover:text-brand-charcoal-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-charcoal-500 uppercase tracking-wider">
              Total Coupons
            </span>
            <Tag className="w-4 h-4 text-brand-green-700" />
          </div>
          <div className="text-2xl font-heading font-black text-brand-green-950">
            {totalCoupons}
          </div>
          <p className="text-[11px] text-brand-charcoal-500">
            {activeCoupons} currently published &amp; active
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-charcoal-500 uppercase tracking-wider">
              Active Campaigns
            </span>
            <CheckCircle className="w-4 h-4 text-brand-mint-600" />
          </div>
          <div className="text-2xl font-heading font-black text-brand-green-900">
            {activeCoupons}
          </div>
          <p className="text-[11px] text-brand-charcoal-500">
            Redeemable in Cart &amp; Checkout
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-charcoal-500 uppercase tracking-wider">
              Total Redemptions
            </span>
            <TrendingUp className="w-4 h-4 text-brand-green-800" />
          </div>
          <div className="text-2xl font-heading font-black text-brand-green-950">
            {totalRedemptions}
          </div>
          <p className="text-[11px] text-brand-charcoal-500">
            Used by customers across India
          </p>
        </div>
      </div>

      {/* Live Coupon Simulator / Tester for Admin */}
      <div className="p-5 sm:p-6 rounded-3xl bg-brand-cream-100 border border-brand-cream-300 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-heading font-bold text-brand-green-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-green-700" />
              <span>Real-Time Coupon Engine Simulator</span>
            </h3>
            <p className="text-xs text-brand-charcoal-600">
              Test coupon calculation logic, minimum spend gates and maximum discount caps before sharing with customers.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-white px-2.5 py-1 rounded-full text-brand-green-900 border border-brand-cream-300 font-bold self-start sm:self-auto">
            POST /api/coupons/validate
          </span>
        </div>

        <form onSubmit={handleTestCoupon} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-brand-charcoal-700">Coupon Code</label>
            <input
              type="text"
              value={testCode}
              onChange={(e) => setTestCode(e.target.value.toUpperCase())}
              placeholder="e.g. ORGANICHY10"
              className="w-full p-2.5 rounded-xl border border-brand-cream-300 bg-white text-xs font-mono font-bold text-brand-green-950 uppercase focus:outline-none focus:ring-2 focus:ring-brand-mint-400"
            />
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-brand-charcoal-700">Test Subtotal Amount (₹)</label>
            <input
              type="number"
              value={testSubtotal}
              onChange={(e) => setTestSubtotal(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-brand-cream-300 bg-white text-xs font-bold text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-400"
            />
          </div>

          <div className="sm:col-span-4">
            <button
              type="submit"
              disabled={testingCoupon}
              className="w-full p-2.5 rounded-xl bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{testingCoupon ? "Testing..." : "Simulate Calculation"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {testResult && (
          <div
            className={`p-3.5 rounded-2xl text-xs border ${
              testResult.success
                ? "bg-white border-brand-mint-300 text-brand-green-900"
                : "bg-white border-rose-300 text-rose-800"
            }`}
          >
            {testResult.success ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-green-700 shrink-0" />
                  <span className="font-bold">{testResult.message}</span>
                </div>
                <div className="flex items-center gap-3 font-mono font-bold text-xs">
                  <span>Discount: {formatINR(testResult.coupon?.amountSaved || 0)}</span>
                  <span>Type: {testResult.coupon?.discountType}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{testResult.error}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-brand-cream-300 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupon code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-brand-charcoal-500 font-semibold whitespace-nowrap">
            Filter Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-800 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="rounded-3xl bg-white border border-brand-cream-300 shadow-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-brand-charcoal-500 space-y-2">
            <div className="w-8 h-8 border-2 border-brand-green-800 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading coupon campaigns...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="py-16 text-center text-xs text-brand-charcoal-500 space-y-2">
            <Tag className="w-8 h-8 text-brand-charcoal-400 mx-auto" />
            <p className="font-bold text-brand-charcoal-800">No coupons found</p>
            <p>Try modifying your search or create a new coupon code above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-cream-100/70 border-b border-brand-cream-300 text-brand-charcoal-700 font-heading font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-5">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount Type &amp; Value</th>
                  <th className="py-3.5 px-4">Min. Spend / Max. Cap</th>
                  <th className="py-3.5 px-4">Validity Window</th>
                  <th className="py-3.5 px-4">Usage &amp; Limits</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-200">
                {filteredCoupons.map((coupon) => {
                  const now = new Date();
                  const isExpired = new Date(coupon.endDate) < now;
                  const isExceeded = coupon.usageLimit ? (coupon.usageCount || 0) >= coupon.usageLimit : false;

                  return (
                    <tr
                      key={coupon.id}
                      className="hover:bg-brand-cream-50/60 transition group"
                    >
                      {/* Code */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-brand-green-950 bg-brand-cream-100 px-2.5 py-1 rounded-lg border border-brand-cream-300">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopy(coupon.code)}
                            className="text-brand-charcoal-400 hover:text-brand-green-800 transition p-1"
                            title="Copy Coupon Code"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-3.5 h-3.5 text-brand-green-700" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="text-[11px] text-brand-charcoal-500 mt-1 max-w-xs line-clamp-1">
                            {coupon.description}
                          </p>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            coupon.discountType === "PERCENTAGE"
                              ? "bg-brand-mint-100 text-brand-green-900 border border-brand-mint-200"
                              : coupon.discountType === "FIXED"
                              ? "bg-amber-100 text-amber-900 border border-amber-200"
                              : "bg-blue-100 text-blue-900 border border-blue-200"
                          }`}
                        >
                          {coupon.discountType === "PERCENTAGE" && `${coupon.discountValue}% OFF`}
                          {coupon.discountType === "FIXED" && `₹${coupon.discountValue} FLAT OFF`}
                          {coupon.discountType === "FREE_SHIPPING" && "FREE DELIVERY"}
                        </span>
                      </td>

                      {/* Spend Conditions */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="text-brand-charcoal-800 font-medium">
                          Min: {coupon.minOrderValue > 0 ? formatINR(coupon.minOrderValue) : "No minimum"}
                        </div>
                        {coupon.maxDiscountValue ? (
                          <div className="text-[10px] text-brand-charcoal-500">
                            Max Cap: {formatINR(coupon.maxDiscountValue)}
                          </div>
                        ) : null}
                      </td>

                      {/* Validity Window */}
                      <td className="py-4 px-4 text-brand-charcoal-600">
                        <div className="text-[11px]">
                          {new Date(coupon.startDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}{" "}
                          –{" "}
                          {new Date(coupon.endDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        {isExpired && (
                          <span className="text-[10px] font-bold text-rose-600">
                            Expired
                          </span>
                        )}
                      </td>

                      {/* Usage */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="font-semibold text-brand-charcoal-900">
                          {coupon.usageCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : "uses"}
                        </div>
                        {coupon.usageLimit && (
                          <div className="w-24 bg-brand-cream-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-brand-green-700 h-full rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (coupon.usageCount / coupon.usageLimit) * 100
                                )}%`,
                              }}
                            />
                          </div>
                        )}
                        {isExceeded && (
                          <span className="text-[10px] font-bold text-amber-600">
                            Limit reached
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(coupon)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition ${
                            coupon.isActive && !isExpired && !isExceeded
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-brand-cream-200 text-brand-charcoal-600 hover:bg-brand-cream-300"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              coupon.isActive && !isExpired && !isExceeded
                                ? "bg-emerald-600"
                                : "bg-brand-charcoal-400"
                            }`}
                          />
                          <span>{coupon.isActive ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(coupon)}
                            className="p-1.5 rounded-lg hover:bg-brand-cream-200 text-brand-charcoal-700 transition"
                            title="Edit Coupon"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon)}
                            className="p-1.5 rounded-lg hover:bg-rose-100 text-brand-charcoal-700 hover:text-rose-700 transition"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-brand-cream-300 relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4">
              <div>
                <h2 className="text-xl font-heading font-black text-brand-green-950">
                  {isEditing ? "Edit Coupon Campaign" : "Create New Coupon"}
                </h2>
                <p className="text-xs text-brand-charcoal-500">
                  Configure promotion rules, discount logic, and redemption caps.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-brand-cream-100 text-brand-charcoal-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SOURAV50"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "") })
                    }
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs font-mono font-bold text-brand-green-950 uppercase focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as any,
                        discountValue: e.target.value === "FREE_SHIPPING" ? 49 : formData.discountValue,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                  >
                    <option value="PERCENTAGE">Percentage (%) Discount</option>
                    <option value="FIXED">Flat Fixed Amount (₹) Off</option>
                    <option value="FREE_SHIPPING">Free All-India Shipping</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-800">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10% off for Gym Enthusiasts & Fitness Lovers"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    {formData.discountType === "PERCENTAGE"
                      ? "Percentage (%) *"
                      : formData.discountType === "FIXED"
                      ? "Flat Amount (₹) *"
                      : "Delivery Fee Saved (₹)"}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={formData.discountType === "PERCENTAGE" ? 100 : 10000}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    disabled={formData.discountType === "FREE_SHIPPING"}
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs font-bold text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 disabled:bg-brand-cream-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Min. Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs font-bold text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Optional"
                    disabled={formData.discountType !== "PERCENTAGE"}
                    value={formData.maxDiscountValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDiscountValue: e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs font-bold text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 disabled:bg-brand-cream-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Redemption Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="Unlimited"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usageLimit: e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="modalIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-brand-cream-400 text-brand-green-900 focus:ring-brand-mint-400 w-4 h-4"
                />
                <label htmlFor="modalIsActive" className="text-xs font-bold text-brand-charcoal-800 cursor-pointer">
                  Activate this coupon immediately for customer checkout
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-cream-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-brand-cream-300 hover:bg-brand-cream-100 text-brand-charcoal-700 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? "Saving Coupon..." : isEditing ? "Save Changes" : "Create Coupon"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

