"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import {
  Truck,
  Search,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Calendar,
  CreditCard,
  Building,
} from "lucide-react";

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any | null>(null);

  useEffect(() => {
    if (initialOrderId) {
      fetchOrderTracking(initialOrderId);
    }
  }, [initialOrderId]);

  const fetchOrderTracking = async (num: string) => {
    if (!num.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(num.trim())}/track`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "No order found matching this reference number.");
      }

      setOrderData(data.data);
    } catch (err: any) {
      setError(err.message || "Failed to locate order. Please check the order number.");
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderTracking(orderIdInput);
  };

  // Determine stage progression (1 to 5)
  const getStageIndex = (status: string) => {
    switch (status) {
      case "PENDING":
        return 1;
      case "CONFIRMED":
      case "PROCESSING":
        return 2;
      case "SHIPPED":
        return 3;
      case "OUT_FOR_DELIVERY":
        return 4;
      case "DELIVERED":
        return 5;
      case "CANCELLED":
      case "RETURNED":
      case "REFUNDED":
        return 0;
      default:
        return 2;
    }
  };

  const currentStage = orderData ? getStageIndex(orderData.status) : 0;

  return (
    <div className="py-12 bg-brand-cream-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 bg-brand-mint-100 text-brand-green-900 px-3.5 py-1 rounded-full text-xs font-heading font-bold">
            <Truck className="w-3.5 h-3.5 text-brand-green-800" />
            <span>All-India Express Logistics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-950">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal-600">
            Follow your fresh nutrition batch from our Moradabad facility directly to your doorstep.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto bg-white p-3 sm:p-4 rounded-3xl border border-brand-cream-300 shadow-card">
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-brand-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter Order # (e.g. ORG-202611-1001)"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-brand-cream-300 text-xs font-mono font-bold text-brand-green-950 uppercase placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>{loading ? "Searching..." : "Track Order"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tracking Details Card */}
        {orderData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Overview Header Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-200 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase tracking-wider block">
                    Order Reference
                  </span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <h2 className="text-xl sm:text-2xl font-mono font-black text-brand-green-950">
                      {orderData.orderNumber}
                    </h2>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        orderData.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : orderData.status === "SHIPPED" || orderData.status === "OUT_FOR_DELIVERY"
                          ? "bg-blue-100 text-blue-800"
                          : orderData.status === "CANCELLED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {orderData.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-brand-charcoal-500 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Placed on{" "}
                      {new Date(orderData.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase tracking-wider block">
                    Total Order Value
                  </span>
                  <div className="text-xl font-heading font-black text-brand-green-950">
                    {formatINR(orderData.grandTotal)}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      orderData.paymentStatus === "PAID"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    Payment: {orderData.paymentStatus} ({orderData.paymentMethod})
                  </span>
                </div>
              </div>

              {/* 5-Stage Visual Progress Bar */}
              {orderData.status !== "CANCELLED" && orderData.status !== "REFUNDED" ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-5 text-center text-[10px] sm:text-xs font-heading font-bold text-brand-charcoal-700">
                    <div className={currentStage >= 1 ? "text-brand-green-900" : "text-brand-charcoal-400"}>
                      1. Placed
                    </div>
                    <div className={currentStage >= 2 ? "text-brand-green-900" : "text-brand-charcoal-400"}>
                      2. Roasted &amp; Packed
                    </div>
                    <div className={currentStage >= 3 ? "text-brand-green-900" : "text-brand-charcoal-400"}>
                      3. Dispatched
                    </div>
                    <div className={currentStage >= 4 ? "text-brand-green-900" : "text-brand-charcoal-400"}>
                      4. Out for Delivery
                    </div>
                    <div className={currentStage >= 5 ? "text-brand-green-900" : "text-brand-charcoal-400"}>
                      5. Delivered
                    </div>
                  </div>

                  <div className="w-full bg-brand-cream-200 h-2.5 rounded-full overflow-hidden relative">
                    <div
                      className="bg-brand-green-700 h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${
                          currentStage === 1
                            ? 20
                            : currentStage === 2
                            ? 40
                            : currentStage === 3
                            ? 60
                            : currentStage === 4
                            ? 85
                            : 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>This order has been cancelled. Any payments made have been refunded to the source account.</span>
                </div>
              )}

              {/* Shipment Details Pill Box */}
              {orderData.shipment && (
                <div className="p-4 rounded-2xl bg-brand-cream-100 border border-brand-cream-300 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase tracking-wider block">
                      Courier Partner
                    </span>
                    <span className="font-heading font-bold text-brand-green-950 block mt-0.5">
                      {orderData.shipment.courierPartner}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase tracking-wider block">
                      AWB Tracking Number
                    </span>
                    <span className="font-mono font-bold text-brand-green-950 block mt-0.5">
                      {orderData.shipment.trackingNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase tracking-wider block">
                      Direct Courier Link
                    </span>
                    {orderData.shipment.trackingUrl ? (
                      <a
                        href={orderData.shipment.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-brand-green-900 hover:underline mt-0.5"
                      >
                        <span>Open on {orderData.shipment.courierPartner}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-brand-charcoal-500">Tracking assigned</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Split Content: Detailed Activity Timeline & Items in Parcel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left: Tracking Event Log */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
                <h3 className="font-heading font-black text-base text-brand-green-950 border-b border-brand-cream-200 pb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-green-800" />
                  <span>Shipment Activity Log</span>
                </h3>

                <div className="space-y-6 pl-2">
                  {orderData.shipment?.events?.map((ev: any, idx: number) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-brand-mint-300 last:border-transparent space-y-1">
                      <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-brand-green-800 ring-4 ring-brand-mint-100" />
                      <div className="text-xs font-bold text-brand-charcoal-900">
                        {ev.activity}
                      </div>
                      <div className="text-[11px] text-brand-charcoal-500 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-green-700" />
                          <span>{ev.location}</span>
                        </span>
                        <span>•</span>
                        <span>{ev.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Items in Order */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-5">
                <h3 className="font-heading font-black text-base text-brand-green-950 border-b border-brand-cream-200 pb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-brand-green-800" />
                  <span>Items in this Parcel ({orderData.items.length})</span>
                </h3>

                <div className="space-y-3 divide-y divide-brand-cream-200">
                  {orderData.items.map((it: any, idx: number) => (
                    <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-cream-100 border border-brand-cream-300 shrink-0">
                          <Image src={it.image} alt={it.title} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-brand-charcoal-900 block line-clamp-1">
                            {it.title}
                          </span>
                          <span className="text-[11px] text-brand-charcoal-500">
                            {it.variantName} &times; {it.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-brand-green-950">
                        {formatINR(it.unitPrice * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                {orderData.shippingAddress && (
                  <div className="p-3.5 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 text-xs space-y-1 mt-4">
                    <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase tracking-wider block">
                      Delivery Address:
                    </span>
                    <p className="font-semibold text-brand-charcoal-900">
                      {orderData.shippingAddress.fullName}
                    </p>
                    <p className="text-[11px] text-brand-charcoal-600">
                      {orderData.shippingAddress.street}, {orderData.shippingAddress.city},{" "}
                      {orderData.shippingAddress.state} - {orderData.shippingAddress.postalCode}
                    </p>
                  </div>
                )}

                {/* Need Support Box */}
                <div className="pt-2 text-center">
                  <a
                    href={`https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20ORGANICHY,%20I%20have%20a%20query%20about%20my%20order%20${orderData.orderNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs tracking-wide transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Courier Support</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center font-sans text-xs text-brand-charcoal-500">
          Loading order tracking...
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}
