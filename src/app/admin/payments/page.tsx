"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  X,
  Banknote,
  Smartphone,
  Landmark,
  Wallet,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

interface PaymentRecord {
  id: string;
  orderId: string;
  method: "RAZORPAY" | "COD";
  status: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  amount: number;
  currency: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  refundId?: string | null;
  failureReason?: string | null;
  createdAt: string;
  rawMetadata?: any;
  order: {
    id?: string;
    orderNumber: string;
    guestName?: string | null;
    guestEmail?: string | null;
    guestPhone?: string | null;
    user?: {
      id: string;
      name: string;
      email: string;
    } | null;
  };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Refund Modal State
  const [refundModalPayment, setRefundModalPayment] = useState<PaymentRecord | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState<string>("");
  const [refundSubmitting, setRefundSubmitting] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPayments(data.data);
      }
    } catch (e) {
      console.error("Failed to load payments", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenRefundModal = (payment: PaymentRecord) => {
    setRefundModalPayment(payment);
    setRefundAmount(payment.amount);
    setRefundReason("Customer requested cancellation / refund");
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModalPayment) return;

    setRefundSubmitting(true);
    setNotification(null);

    try {
      const res = await fetch("/api/admin/payments/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: refundModalPayment.id,
          amount: Number(refundAmount),
          reason: refundReason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process refund.");
      }

      setNotification({
        type: "success",
        message: data.message || "Refund issued successfully.",
      });

      setRefundModalPayment(null);
      fetchPayments();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setRefundSubmitting(false);
    }
  };

  // KPIs
  const totalRevenue = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);
  const successfulCount = payments.filter((p) => p.status === "PAID").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;
  const refundedCount = payments.filter((p) => p.status === "REFUNDED").length;

  // Filtered Payments
  const filteredPayments = payments.filter((p) => {
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchesMethod = methodFilter === "ALL" || p.method === methodFilter;

    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      p.razorpayPaymentId?.toLowerCase().includes(term) ||
      p.order.orderNumber.toLowerCase().includes(term) ||
      p.order.guestName?.toLowerCase().includes(term) ||
      p.order.user?.name.toLowerCase().includes(term) ||
      p.order.guestEmail?.toLowerCase().includes(term) ||
      p.order.user?.email.toLowerCase().includes(term);

    return matchesStatus && matchesMethod && matchesSearch;
  });

  const getMethodIcon = (p: PaymentRecord) => {
    if (p.method === "COD") {
      return <Banknote className="w-3.5 h-3.5 text-amber-700" />;
    }
    const subMethod = p.rawMetadata?.method;
    if (subMethod === "upi") return <Smartphone className="w-3.5 h-3.5 text-blue-700" />;
    if (subMethod === "netbanking") return <Landmark className="w-3.5 h-3.5 text-indigo-700" />;
    if (subMethod === "wallet") return <Wallet className="w-3.5 h-3.5 text-emerald-700" />;
    return <CreditCard className="w-3.5 h-3.5 text-brand-green-800" />;
  };

  const getMethodLabel = (p: PaymentRecord) => {
    if (p.method === "COD") return "Cash on Delivery (COD)";
    const subMethod = p.rawMetadata?.method;
    if (subMethod === "upi") return "Razorpay UPI";
    if (subMethod === "netbanking") return "Net Banking";
    if (subMethod === "wallet") return "Digital Wallet";
    if (subMethod === "card") return "Debit / Credit Card";
    return "Razorpay Online";
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Payments &amp; Gateway
            </span>
            <span className="text-xs text-brand-charcoal-400">•</span>
            <span className="text-xs font-semibold text-brand-charcoal-500">
              Razorpay Secured
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 mt-1">
            Payment Transactions Console
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal-600 mt-1">
            Real-time audit log of UPI, Card, NetBanking, and COD payments with refund management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-brand-cream-300 text-xs shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-brand-charcoal-700">Gateway Status:</span>
            <span className="font-mono font-bold text-brand-green-900">
              {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_live_")
                ? "Live Production"
                : "Sandbox Test Mode"}
            </span>
          </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-charcoal-500 uppercase tracking-wider">
              Settled Revenue
            </span>
            <TrendingUp className="w-4 h-4 text-brand-green-700" />
          </div>
          <div className="text-2xl font-heading font-black text-brand-green-950">
            {formatINR(totalRevenue)}
          </div>
          <p className="text-[11px] text-brand-charcoal-500">
            From {successfulCount} verified orders
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-charcoal-500 uppercase tracking-wider">
              Successful Payments
            </span>
            <CheckCircle className="w-4 h-4 text-brand-mint-600" />
          </div>
          <div className="text-2xl font-heading font-black text-brand-green-900">
            {successfulCount}
          </div>
          <p className="text-[11px] text-brand-charcoal-500">
            Cryptographically verified
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-charcoal-500 uppercase tracking-wider">
              Pending / COD
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-heading font-black text-amber-700">
            {pendingCount}
          </div>
          <p className="text-[11px] text-brand-charcoal-500">
            Awaiting parcel delivery or payment
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-charcoal-500 uppercase tracking-wider">
              Refunded
            </span>
            <RotateCcw className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-heading font-black text-purple-800">
            {refundedCount}
          </div>
          <p className="text-[11px] text-brand-charcoal-500">
            Processed via Razorpay gateway
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-brand-cream-300 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search payment ID, order #, or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-brand-charcoal-600">
            <span className="font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-800 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">Paid Only</option>
              <option value="PENDING">Pending Only</option>
              <option value="FAILED">Failed Only</option>
              <option value="REFUNDED">Refunded Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-brand-charcoal-600">
            <span className="font-semibold">Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="p-2 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-800 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
            >
              <option value="ALL">All Methods</option>
              <option value="RAZORPAY">Razorpay (Online)</option>
              <option value="COD">Cash on Delivery (COD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-3xl bg-white border border-brand-cream-300 shadow-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-brand-charcoal-500 space-y-2">
            <div className="w-8 h-8 border-2 border-brand-green-800 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading payment transactions...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-16 text-center text-xs text-brand-charcoal-500 space-y-2">
            <CreditCard className="w-8 h-8 text-brand-charcoal-400 mx-auto" />
            <p className="font-bold text-brand-charcoal-800">No transactions found</p>
            <p>Try modifying your search or filter options.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-cream-100/70 border-b border-brand-cream-300 text-brand-charcoal-700 font-heading font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-5">Payment ID</th>
                  <th className="py-3.5 px-4">Order Reference</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Transaction Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-200">
                {filteredPayments.map((p) => {
                  const paymentId = p.razorpayPaymentId || p.id;
                  const customerName = p.order.user?.name || p.order.guestName || "Guest Customer";
                  const customerEmail = p.order.user?.email || p.order.guestEmail || "No email";

                  return (
                    <tr key={p.id} className="hover:bg-brand-cream-50/60 transition group">
                      {/* Payment ID */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-brand-green-950 bg-brand-cream-100 px-2 py-0.5 rounded border border-brand-cream-300">
                            {paymentId}
                          </span>
                          <button
                            onClick={() => handleCopy(paymentId)}
                            className="text-brand-charcoal-400 hover:text-brand-green-800 transition p-1"
                            title="Copy Payment ID"
                          >
                            {copiedId === paymentId ? (
                              <Check className="w-3.5 h-3.5 text-brand-green-700" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {p.refundId && (
                          <span className="text-[10px] font-mono text-purple-700 block mt-1">
                            Refund: {p.refundId}
                          </span>
                        )}
                        {p.failureReason && (
                          <span className="text-[10px] text-rose-600 block mt-1 max-w-xs line-clamp-1" title={p.failureReason}>
                            {p.failureReason}
                          </span>
                        )}
                      </td>

                      {/* Order Reference */}
                      <td className="py-4 px-4">
                        <Link
                          href={`/order-tracking?orderId=${p.order.orderNumber}`}
                          className="font-mono font-black text-brand-green-900 hover:underline flex items-center gap-1"
                        >
                          <span>{p.order.orderNumber}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="font-bold text-brand-charcoal-900">{customerName}</div>
                        <div className="text-[11px] text-brand-charcoal-500">{customerEmail}</div>
                      </td>

                      {/* Method */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-cream-100 border border-brand-cream-300 text-[11px] font-semibold text-brand-charcoal-800">
                          {getMethodIcon(p)}
                          <span>{getMethodLabel(p)}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4">
                        <span className="font-heading font-black text-sm text-brand-green-950">
                          {formatINR(p.amount)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            p.status === "PAID"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : p.status === "PENDING"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : p.status === "REFUNDED"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.status === "PAID"
                                ? "bg-emerald-600"
                                : p.status === "PENDING"
                                ? "bg-amber-600"
                                : p.status === "REFUNDED"
                                ? "bg-purple-600"
                                : "bg-rose-600"
                            }`}
                          />
                          <span>{p.status}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-brand-charcoal-600">
                        <div className="text-[11px]">
                          {new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-[10px] text-brand-charcoal-400">
                          {new Date(p.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        {p.status === "PAID" && (
                          <button
                            onClick={() => handleOpenRefundModal(p)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-brand-cream-300 hover:border-purple-300 bg-white hover:bg-purple-50 text-brand-charcoal-700 hover:text-purple-800 text-xs font-semibold transition"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Refund</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {refundModalPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-brand-cream-300 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4">
              <div>
                <h2 className="text-xl font-heading font-black text-brand-green-950">
                  Issue Customer Refund
                </h2>
                <p className="text-xs text-brand-charcoal-500">
                  Order #{refundModalPayment.order.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setRefundModalPayment(null)}
                className="p-2 rounded-full hover:bg-brand-cream-100 text-brand-charcoal-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-brand-cream-100 border border-brand-cream-200 text-xs space-y-1">
                <div className="flex justify-between text-brand-charcoal-600">
                  <span>Customer:</span>
                  <span className="font-bold text-brand-charcoal-900">
                    {refundModalPayment.order.user?.name || refundModalPayment.order.guestName}
                  </span>
                </div>
                <div className="flex justify-between text-brand-charcoal-600">
                  <span>Payment Gateway ID:</span>
                  <span className="font-mono font-bold text-brand-green-950">
                    {refundModalPayment.razorpayPaymentId || refundModalPayment.id}
                  </span>
                </div>
                <div className="flex justify-between text-brand-charcoal-600">
                  <span>Original Paid Amount:</span>
                  <span className="font-bold text-brand-green-950">
                    {formatINR(refundModalPayment.amount)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-800">
                  Refund Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={refundModalPayment.amount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs font-bold text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-800">
                  Refund Reason / Internal Notes *
                </label>
                <textarea
                  required
                  rows={2}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Customer cancelled before dispatch / package damaged in transit"
                  className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Processing this refund will automatically credit the customer&apos;s original payment method via Razorpay within 5–7 banking days.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-cream-200">
                <button
                  type="button"
                  onClick={() => setRefundModalPayment(null)}
                  className="px-5 py-2.5 rounded-full border border-brand-cream-300 hover:bg-brand-cream-100 text-brand-charcoal-700 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={refundSubmitting}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-xs tracking-wide transition shadow-sm disabled:opacity-50"
                >
                  {refundSubmitting ? "Processing Refund..." : `Confirm Refund (${formatINR(refundAmount)})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

