"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Truck,
  Printer,
  X,
  ExternalLink,
  Eye,
  Edit2,
  Calendar,
  CreditCard,
  MapPin,
  Tag,
  RotateCcw,
  AlertTriangle,
  User,
  FileText,
  Building,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface OrderItem {
  id: string;
  orderNumber: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED"
    | "REFUNDED";
  paymentMethod: "RAZORPAY" | "COD";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  grandTotal: number;
  shippingAddress: any;
  billingAddress?: any;
  customerNotes?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  items: Array<{
    id?: string;
    productId: string;
    title: string;
    variantName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }>;
  shipment?: {
    id?: string;
    trackingNumber?: string | null;
    courierPartner: string;
    status: string;
    trackingUrl?: string | null;
    estimatedDelivery?: string | null;
    shippedAt?: string | null;
    deliveredAt?: string | null;
    notes?: string | null;
  } | null;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modals State
  const [detailModalOrder, setDetailModalOrder] = useState<OrderItem | null>(null);
  const [fulfillModalOrder, setFulfillModalOrder] = useState<OrderItem | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<OrderItem | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<OrderItem | null>(null);

  // Fulfill Form State
  const [fulfillStatus, setFulfillStatus] = useState<string>("SHIPPED");
  const [fulfillCourier, setFulfillCourier] = useState<string>("Delhivery");
  const [fulfillAwb, setFulfillAwb] = useState<string>("");
  const [fulfillEstimatedDelivery, setFulfillEstimatedDelivery] = useState<string>("");
  const [fulfillNotes, setFulfillNotes] = useState<string>("");
  const [fulfillSubmitting, setFulfillSubmitting] = useState(false);

  // Cancel Form State
  const [cancelReason, setCancelReason] = useState("Customer requested cancellation");
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch admin orders", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFulfillModal = (order: OrderItem) => {
    setFulfillModalOrder(order);
    setFulfillStatus(order.status === "PENDING" ? "PROCESSING" : order.status);
    setFulfillCourier(order.shipment?.courierPartner || "Delhivery");
    setFulfillAwb(order.shipment?.trackingNumber || "");
    setFulfillEstimatedDelivery(
      order.shipment?.estimatedDelivery
        ? new Date(order.shipment.estimatedDelivery).toISOString().split("T")[0]
        : new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0]
    );
    setFulfillNotes(order.shipment?.notes || "Dispatched from Moradabad facility");
  };

  const handleGenerateAwb = () => {
    const random = Math.floor(10000000 + Math.random() * 90000000);
    let prefix = "DEL";
    if (fulfillCourier === "Blue Dart") prefix = "BLU";
    if (fulfillCourier === "DTDC") prefix = "DTD";
    if (fulfillCourier === "India Post") prefix = "IND";
    if (fulfillCourier === "Shiprocket") prefix = "SR";
    setFulfillAwb(`${prefix}-${random}`);
  };

  const handleUpdateFulfill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fulfillModalOrder) return;

    setFulfillSubmitting(true);
    setNotification(null);

    try {
      const res = await fetch(`/api/admin/orders/${fulfillModalOrder.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: fulfillStatus,
          courierPartner: fulfillCourier,
          trackingNumber: fulfillAwb.trim() || undefined,
          estimatedDelivery: fulfillEstimatedDelivery || undefined,
          shipmentNotes: fulfillNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update shipment status.");
      }

      setNotification({
        type: "success",
        message: data.message || `Order #${fulfillModalOrder.orderNumber} updated!`,
      });

      setFulfillModalOrder(null);
      fetchOrders();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setFulfillSubmitting(false);
    }
  };

  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalOrder) return;

    setCancelSubmitting(true);
    setNotification(null);

    try {
      const res = await fetch(`/api/admin/orders/${cancelModalOrder.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to cancel order.");
      }

      setNotification({
        type: "success",
        message: data.message || `Order #${cancelModalOrder.orderNumber} was cancelled.`,
      });

      setCancelModalOrder(null);
      fetchOrders();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setCancelSubmitting(false);
    }
  };

  // KPIs
  const totalOrdersCount = orders.length;
  const processingCount = orders.filter((o) => o.status === "PROCESSING" || o.status === "CONFIRMED").length;
  const inTransitCount = orders.filter((o) => o.status === "SHIPPED" || o.status === "OUT_FOR_DELIVERY").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchesPayment = paymentFilter === "ALL" || o.paymentStatus === paymentFilter;

    const term = search.toLowerCase();
    const customerName = o.user?.name || o.guestName || "";
    const customerEmail = o.user?.email || o.guestEmail || "";
    const phone = o.guestPhone || o.shippingAddress?.phoneNumber || "";
    const awb = o.shipment?.trackingNumber || "";

    const matchesSearch =
      !term ||
      o.orderNumber.toLowerCase().includes(term) ||
      customerName.toLowerCase().includes(term) ||
      customerEmail.toLowerCase().includes(term) ||
      phone.includes(term) ||
      awb.toLowerCase().includes(term);

    return matchesStatus && matchesPayment && matchesSearch;
  });

  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "PROCESSING":
        return "bg-indigo-100 text-indigo-900 border-indigo-300";
      case "SHIPPED":
        return "bg-sky-100 text-sky-900 border-sky-300";
      case "OUT_FOR_DELIVERY":
        return "bg-teal-100 text-teal-900 border-teal-300";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "CANCELLED":
        return "bg-rose-100 text-rose-900 border-rose-300";
      case "RETURNED":
        return "bg-orange-100 text-orange-900 border-orange-300";
      case "REFUNDED":
        return "bg-purple-100 text-purple-900 border-purple-300";
      default:
        return "bg-brand-cream-200 text-brand-charcoal-700 border-brand-cream-300";
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Fulfillment &amp; Dispatch
            </span>
            <span className="text-xs text-brand-charcoal-400">•</span>
            <span className="text-xs font-semibold text-brand-charcoal-500">
              Moradabad Central Facility
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 mt-1">
            Order Fulfillment Console
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal-600 mt-1">
            Manage customer orders across India, assign courier tracking numbers, print invoices, and update lifecycle statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/order-tracking"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-cream-300 hover:border-brand-green-800 bg-white text-brand-charcoal-700 hover:text-brand-green-900 text-xs font-bold transition shadow-2xs"
          >
            <span>Live Customer Tracking</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
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

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-charcoal-500 uppercase tracking-wider">
              Total Orders
            </span>
            <ShoppingBag className="w-4 h-4 text-brand-green-700" />
          </div>
          <div className="text-2xl font-heading font-black text-brand-green-950">
            {totalOrdersCount}
          </div>
          <p className="text-[11px] text-brand-charcoal-500">
            All-India Customer Purchases
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-charcoal-500 uppercase tracking-wider">
              Roasting &amp; Processing
            </span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-heading font-black text-indigo-900">
            {processingCount}
          </div>
          <p className="text-[11px] text-brand-charcoal-500">
            Awaiting packaging in Moradabad
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-charcoal-500 uppercase tracking-wider">
              In Transit / Dispatched
            </span>
            <Truck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-heading font-black text-sky-900">
            {inTransitCount}
          </div>
          <p className="text-[11px] text-brand-charcoal-500">
            With Delhivery / Blue Dart
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-charcoal-500 uppercase tracking-wider">
              Successfully Delivered
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-heading font-black text-emerald-900">
            {deliveredCount}
          </div>
          <p className="text-[11px] text-brand-charcoal-500">
            Completed delivery
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-brand-cream-300 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer, phone, or AWB..."
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
              <option value="ALL">All 9 Statuses</option>
              <option value="PENDING">1. Pending</option>
              <option value="CONFIRMED">2. Confirmed</option>
              <option value="PROCESSING">3. Processing</option>
              <option value="SHIPPED">4. Shipped</option>
              <option value="OUT_FOR_DELIVERY">5. Out for Delivery</option>
              <option value="DELIVERED">6. Delivered</option>
              <option value="CANCELLED">7. Cancelled</option>
              <option value="RETURNED">8. Returned</option>
              <option value="REFUNDED">9. Refunded</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-brand-charcoal-600">
            <span className="font-semibold">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="p-2 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-800 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
            >
              <option value="ALL">All Payments</option>
              <option value="PAID">Paid Only</option>
              <option value="PENDING">Pending Only (COD)</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white border border-brand-cream-300 shadow-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-brand-charcoal-500 space-y-2">
            <div className="w-8 h-8 border-2 border-brand-green-800 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading customer orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-brand-charcoal-500 space-y-2">
            <ShoppingBag className="w-8 h-8 text-brand-charcoal-400 mx-auto" />
            <p className="font-bold text-brand-charcoal-800">No matching orders found</p>
            <p>Try clearing your search or status filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-cream-100/70 border-b border-brand-cream-300 text-brand-charcoal-700 font-heading font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-5">Order #</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Order Items</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Shipment &amp; AWB</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-200">
                {filteredOrders.map((order) => {
                  const customerName = order.user?.name || order.guestName || "Guest Customer";
                  const customerEmail = order.user?.email || order.guestEmail || "No email";
                  const phone = order.guestPhone || order.shippingAddress?.phoneNumber || "N/A";
                  const courier = order.shipment?.courierPartner || "Delhivery";
                  const awb = order.shipment?.trackingNumber;

                  return (
                    <tr key={order.id} className="hover:bg-brand-cream-50/60 transition group">
                      {/* Order # */}
                      <td className="py-4 px-5">
                        <span className="font-mono font-black text-xs text-brand-green-950 block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-brand-charcoal-400 block mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="font-bold text-brand-charcoal-900">{customerName}</div>
                        <div className="text-[11px] text-brand-charcoal-500">{customerEmail}</div>
                        <div className="text-[10px] text-brand-charcoal-400 font-mono">{phone}</div>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="space-y-0.5">
                          {order.items.slice(0, 2).map((it, idx) => (
                            <div key={idx} className="line-clamp-1 text-[11px] text-brand-charcoal-800">
                              <span className="font-semibold">{it.quantity}&times;</span> {it.title} ({it.variantName})
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <span className="text-[10px] font-bold text-brand-green-800 block">
                              +{order.items.length - 2} more item(s)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4">
                        <span className="font-heading font-black text-sm text-brand-green-950 block">
                          {formatINR(order.grandTotal)}
                        </span>
                        <span className="text-[10px] text-brand-charcoal-400">
                          {order.paymentMethod === "COD" ? "COD Mode" : "Prepaid Online"}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            order.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : order.paymentStatus === "PENDING"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : "bg-purple-50 text-purple-800 border-purple-300"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Shipment */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="font-semibold text-brand-charcoal-900 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-brand-green-700 shrink-0" />
                          <span>{courier}</span>
                        </div>
                        {awb ? (
                          <span className="font-mono text-[10px] text-brand-green-800 block">
                            AWB: {awb}
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-600 block">
                            AWB Not Assigned
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setDetailModalOrder(order)}
                            className="p-1.5 rounded-lg hover:bg-brand-cream-200 text-brand-charcoal-700 transition"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenFulfillModal(order)}
                            className="p-1.5 rounded-lg hover:bg-brand-mint-100 text-brand-green-900 transition"
                            title="Update Shipment & Status"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setInvoiceModalOrder(order)}
                            className="p-1.5 rounded-lg hover:bg-brand-cream-200 text-brand-charcoal-700 transition"
                            title="Print Tax Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                            <button
                              onClick={() => {
                                setCancelModalOrder(order);
                                setCancelReason("Customer requested cancellation");
                              }}
                              className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-700 transition"
                              title="Cancel Order"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* 1. View Order Details Modal */}
      {detailModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-brand-cream-300 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase tracking-wider block">
                  Order Details
                </span>
                <h2 className="text-xl font-heading font-black text-brand-green-950 mt-0.5">
                  #{detailModalOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setDetailModalOrder(null)}
                className="p-2 rounded-full hover:bg-brand-cream-100 text-brand-charcoal-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Addresses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 space-y-1">
                <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase tracking-wider block">
                  Shipping Address
                </span>
                <p className="font-bold text-brand-charcoal-900">
                  {detailModalOrder.shippingAddress?.fullName}
                </p>
                <p className="text-brand-charcoal-600">
                  {detailModalOrder.shippingAddress?.street}
                  {detailModalOrder.shippingAddress?.landmark && `, ${detailModalOrder.shippingAddress.landmark}`}
                </p>
                <p className="text-brand-charcoal-600">
                  {detailModalOrder.shippingAddress?.city}, {detailModalOrder.shippingAddress?.state} -{" "}
                  {detailModalOrder.shippingAddress?.postalCode}
                </p>
                <p className="text-brand-charcoal-500 pt-1">
                  Phone: {detailModalOrder.shippingAddress?.phoneNumber}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 space-y-1">
                <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase tracking-wider block">
                  Customer &amp; Payment
                </span>
                <p className="font-bold text-brand-charcoal-900">
                  {detailModalOrder.user?.name || detailModalOrder.guestName}
                </p>
                <p className="text-brand-charcoal-600">
                  Email: {detailModalOrder.user?.email || detailModalOrder.guestEmail}
                </p>
                <p className="text-brand-charcoal-600">
                  Method: {detailModalOrder.paymentMethod === "RAZORPAY" ? "Online Razorpay" : "Cash on Delivery (COD)"}
                </p>
                <p className="text-brand-green-800 font-bold pt-1">
                  Status: {detailModalOrder.paymentStatus}
                </p>
              </div>
            </div>

            {/* Customer Delivery Notes */}
            {detailModalOrder.customerNotes && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-0.5">
                <span className="font-bold block flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  <span>Customer Delivery Instructions:</span>
                </span>
                <p className="italic">&ldquo;{detailModalOrder.customerNotes}&rdquo;</p>
              </div>
            )}

            {/* Items Table */}
            <div className="border border-brand-cream-300 rounded-2xl overflow-hidden divide-y divide-brand-cream-200 text-xs">
              <div className="bg-brand-cream-100 p-3 font-bold text-brand-charcoal-700 flex justify-between">
                <span>Product Item</span>
                <span>Qty &times; Price</span>
              </div>
              {detailModalOrder.items.map((it, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-brand-charcoal-900 block">{it.title}</span>
                    <span className="text-[11px] text-brand-charcoal-500">
                      Variant: {it.variantName} | SKU: {it.sku}
                    </span>
                  </div>
                  <span className="font-heading font-bold text-brand-green-950">
                    {it.quantity} &times; {formatINR(it.unitPrice)} = {formatINR(it.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculation Totals */}
            <div className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-brand-charcoal-600">
                <span>Subtotal</span>
                <span>{formatINR(detailModalOrder.subtotal)}</span>
              </div>
              {detailModalOrder.discountTotal > 0 && (
                <div className="flex justify-between text-brand-green-800 font-bold">
                  <span>Discount Applied</span>
                  <span>-{formatINR(detailModalOrder.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-charcoal-600">
                <span>Shipping Fee</span>
                <span>{detailModalOrder.shippingFee === 0 ? "FREE" : formatINR(detailModalOrder.shippingFee)}</span>
              </div>
              <div className="border-t border-brand-cream-300 pt-1.5 flex justify-between text-sm font-heading font-black text-brand-green-950">
                <span>Grand Total</span>
                <span>{formatINR(detailModalOrder.grandTotal)}</span>
              </div>
            </div>

            {/* Close */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDetailModalOrder(null)}
                className="px-5 py-2.5 rounded-full border border-brand-cream-300 hover:bg-brand-cream-100 text-brand-charcoal-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Fulfill / Update Shipping Modal */}
      {fulfillModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-brand-cream-300 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4">
              <div>
                <h2 className="text-xl font-heading font-black text-brand-green-950">
                  Update Shipment &amp; Status
                </h2>
                <p className="text-xs text-brand-charcoal-500">
                  Order #{fulfillModalOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setFulfillModalOrder(null)}
                className="p-2 rounded-full hover:bg-brand-cream-100 text-brand-charcoal-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateFulfill} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-800">
                  Order Status (9 Lifecycles) *
                </label>
                <select
                  value={fulfillStatus}
                  onChange={(e) => setFulfillStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs font-bold text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                >
                  <option value="PENDING">1. Pending (Order Placed)</option>
                  <option value="CONFIRMED">2. Confirmed (Verified Payment/COD)</option>
                  <option value="PROCESSING">3. Processing (Roasting &amp; Packaging)</option>
                  <option value="SHIPPED">4. Shipped (Dispatched from Moradabad)</option>
                  <option value="OUT_FOR_DELIVERY">5. Out for Delivery (Local Courier Agent)</option>
                  <option value="DELIVERED">6. Delivered (Handed to Customer)</option>
                  <option value="CANCELLED">7. Cancelled (Restock Inventory)</option>
                  <option value="RETURNED">8. Returned (Returned to Origin)</option>
                  <option value="REFUNDED">9. Refunded (Payment Reversal)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-charcoal-800">
                    Courier Partner *
                  </label>
                  <select
                    value={fulfillCourier}
                    onChange={(e) => setFulfillCourier(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs font-medium text-brand-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                  >
                    <option value="Delhivery">Delhivery Express</option>
                    <option value="Blue Dart">Blue Dart</option>
                    <option value="DTDC">DTDC Express</option>
                    <option value="India Post">India Post (Speed Post)</option>
                    <option value="Shiprocket">Shiprocket Multi-Carrier</option>
                    <option value="Manual Courier">Manual / Local Delivery</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-brand-charcoal-800">
                      AWB Tracking #
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateAwb}
                      className="text-[10px] font-bold text-brand-green-800 hover:underline"
                    >
                      Generate AWB
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. DEL-84920491"
                    value={fulfillAwb}
                    onChange={(e) => setFulfillAwb(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs font-mono font-bold text-brand-green-950 uppercase focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-800">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  value={fulfillEstimatedDelivery}
                  onChange={(e) => setFulfillEstimatedDelivery(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-800">
                  Shipment Activity Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dispatched from Moradabad induction sealing facility"
                  value={fulfillNotes}
                  onChange={(e) => setFulfillNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  Updating status automatically dispatches in-app, email, and WhatsApp notifications to the customer with their tracking link.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-cream-200">
                <button
                  type="button"
                  onClick={() => setFulfillModalOrder(null)}
                  className="px-5 py-2.5 rounded-full border border-brand-cream-300 hover:bg-brand-cream-100 text-brand-charcoal-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={fulfillSubmitting}
                  className="px-6 py-2.5 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide shadow-sm disabled:opacity-50"
                >
                  {fulfillSubmitting ? "Updating..." : "Save & Notify Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Professional Indian Tax Invoice / Packing Slip Modal */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 space-y-6 shadow-2xl border border-brand-cream-300 relative print:shadow-none print:border-none print:m-0 print:p-0">
            {/* Action Bar (Hidden during print) */}
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4 print:hidden">
              <span className="font-heading font-black text-sm text-brand-green-950">
                Tax Invoice Preview (Moradabad, UP)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setInvoiceModalOrder(null)}
                  className="p-1.5 rounded-full hover:bg-brand-cream-100 text-brand-charcoal-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Container */}
            <div className="space-y-6 text-xs text-brand-charcoal-800 font-sans">
              
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b border-brand-charcoal-300 pb-4">
                <div>
                  <h1 className="text-2xl font-heading font-black text-brand-green-950 tracking-wider">
                    ORGANICHY
                  </h1>
                  <p className="text-[11px] text-brand-charcoal-600 font-medium mt-0.5">
                    Pure Nutrition For Active Lifestyles
                  </p>
                  <p className="text-[10px] text-brand-charcoal-500 mt-1">
                    Founder: Sourav • Location: Moradabad, Uttar Pradesh, India - 244001
                  </p>
                  <p className="text-[10px] text-brand-charcoal-500">
                    FSSAI Central Reg: 12726999000123 • GSTIN: 09AABCO1234F1Z8
                  </p>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-green-900 bg-brand-mint-100 px-2.5 py-0.5 rounded-md">
                    TAX INVOICE
                  </span>
                  <p className="font-mono font-black text-sm text-brand-green-950 pt-1">
                    INV-{invoiceModalOrder.orderNumber}
                  </p>
                  <p className="text-[11px] text-brand-charcoal-500">
                    Date: {new Date(invoiceModalOrder.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Bill To & Ship To */}
              <div className="grid grid-cols-2 gap-6 text-[11px] border-b border-brand-charcoal-200 pb-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-brand-charcoal-900 uppercase tracking-wider block text-[10px]">
                    Billed To:
                  </span>
                  <p className="font-bold text-brand-charcoal-900">
                    {invoiceModalOrder.billingAddress?.fullName || invoiceModalOrder.shippingAddress?.fullName}
                  </p>
                  <p>
                    {invoiceModalOrder.billingAddress?.street || invoiceModalOrder.shippingAddress?.street}
                  </p>
                  <p>
                    {invoiceModalOrder.billingAddress?.city || invoiceModalOrder.shippingAddress?.city},{" "}
                    {invoiceModalOrder.billingAddress?.state || invoiceModalOrder.shippingAddress?.state} -{" "}
                    {invoiceModalOrder.billingAddress?.postalCode || invoiceModalOrder.shippingAddress?.postalCode}
                  </p>
                  <p>Phone: {invoiceModalOrder.shippingAddress?.phoneNumber}</p>
                </div>

                <div className="space-y-0.5 text-right">
                  <span className="font-bold text-brand-charcoal-900 uppercase tracking-wider block text-[10px]">
                    Shipped Via:
                  </span>
                  <p className="font-bold text-brand-green-950">
                    {invoiceModalOrder.shipment?.courierPartner || "Delhivery Express"}
                  </p>
                  <p className="font-mono text-[10px]">
                    AWB: {invoiceModalOrder.shipment?.trackingNumber || "Pending"}
                  </p>
                  <p>Payment: {invoiceModalOrder.paymentMethod} ({invoiceModalOrder.paymentStatus})</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-brand-charcoal-300 font-heading font-bold text-[10px] text-brand-charcoal-700 uppercase">
                    <th className="py-2">Item Description</th>
                    <th className="py-2">HSN Code</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-charcoal-200">
                  {invoiceModalOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5">
                        <span className="font-bold block">{it.title}</span>
                        <span className="text-[10px] text-brand-charcoal-500">
                          {it.variantName} (SKU: {it.sku})
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-[10px]">20081100</td>
                      <td className="py-2.5 text-center font-bold">{it.quantity}</td>
                      <td className="py-2.5 text-right">{formatINR(it.unitPrice)}</td>
                      <td className="py-2.5 text-right font-bold">{formatINR(it.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculation Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatINR(invoiceModalOrder.subtotal)}</span>
                  </div>
                  {invoiceModalOrder.discountTotal > 0 && (
                    <div className="flex justify-between text-brand-green-800 font-bold">
                      <span>Promo Discount</span>
                      <span>-{formatINR(invoiceModalOrder.discountTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span>{invoiceModalOrder.shippingFee === 0 ? "FREE" : formatINR(invoiceModalOrder.shippingFee)}</span>
                  </div>
                  <div className="border-t-2 border-brand-green-950 pt-2 flex justify-between text-sm font-heading font-black text-brand-green-950">
                    <span>Grand Total</span>
                    <span>{formatINR(invoiceModalOrder.grandTotal)}</span>
                  </div>
                  <p className="text-[9px] text-brand-charcoal-400 text-right">
                    *GST included at applicable statutory rates
                  </p>
                </div>
              </div>

              {/* Footer Note */}
              <div className="border-t border-brand-charcoal-200 pt-4 text-center text-[10px] text-brand-charcoal-500 space-y-1">
                <p className="font-semibold text-brand-green-950">
                  Thank you for supporting ORGANICHY • Pure Nutrition Handcrafted in Moradabad, Uttar Pradesh
                </p>
                <p>For any queries, contact customer care at care@organichy.com or WhatsApp +91 98765 43210</p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. Cancel Order Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-brand-cream-300 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-3">
              <h2 className="text-lg font-heading font-black text-brand-green-950 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Cancel Order #{cancelModalOrder.orderNumber}</span>
              </h2>
              <button
                onClick={() => setCancelModalOrder(null)}
                className="p-1.5 rounded-full hover:bg-brand-cream-100 text-brand-charcoal-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCancelOrder} className="space-y-4">
              <p className="text-xs text-brand-charcoal-600 leading-relaxed">
                Cancelling this order will automatically replenish the product quantities back to available inventory and send an alert notification to the customer.
              </p>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-charcoal-800">
                  Reason for Cancellation *
                </label>
                <textarea
                  required
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Customer requested cancellation before dispatch"
                  className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="px-5 py-2.5 rounded-full border border-brand-cream-300 hover:bg-brand-cream-100 text-brand-charcoal-700 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={cancelSubmitting}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-xs tracking-wide transition shadow-sm disabled:opacity-50"
                >
                  {cancelSubmitting ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

