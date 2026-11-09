"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import {
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Search,
  Settings,
  RefreshCw,
  Building,
  Layers,
} from "lucide-react";

export default function AdminShippingPage() {
  const [shippingData, setShippingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Edit config state
  const [freeThreshold, setFreeThreshold] = useState(499);
  const [standardFee, setStandardFee] = useState(49);
  const [codFee, setCodFee] = useState(40);
  const [isCodEnabled, setIsCodEnabled] = useState(true);

  // Pincode test
  const [testPincode, setTestPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<any | null>(null);
  const [testingPincode, setTestingPincode] = useState(false);

  const fetchShippingData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/shipping");
      const json = await res.json();
      if (json.success) {
        setShippingData(json.data);
        setFreeThreshold(json.data.config.freeShippingThreshold);
        setStandardFee(json.data.config.standardShippingFee);
        setCodFee(json.data.config.codFee);
        setIsCodEnabled(json.data.config.isCodEnabled);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingData();
  }, []);

  const handleSaveRules = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/shipping", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freeShippingThreshold: Number(freeThreshold),
          standardShippingFee: Number(standardFee),
          codFee: Number(codFee),
          isCodEnabled,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", message: "Shipping charge rules saved successfully." });
        fetchShippingData();
      } else {
        setNotification({ type: "error", message: data.error || "Failed to update." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Network error." });
    } finally {
      setUpdating(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleTestPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (testPincode.length !== 6) return;
    setTestingPincode(true);
    try {
      const res = await fetch("/api/shipping/pincode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode: testPincode, orderTotal: 599 }),
      });
      const json = await res.json();
      setPincodeResult(json);
    } catch (e) {
      console.error(e);
    } finally {
      setTestingPincode(false);
    }
  };

  if (loading || !shippingData) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 text-brand-charcoal-500">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-green-800" />
        <span className="font-heading font-bold text-sm">
          Loading Logistics &amp; Carrier Setup...
        </span>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200 mb-2">
            <Truck className="w-3.5 h-3.5 text-brand-green-800" />
            <span>LOGISTICS ARCHITECTURE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 tracking-tight">
            Shipping &amp; Fulfillment
          </h1>
          <p className="text-xs text-brand-charcoal-600 mt-1">
            Configure delivery fees, free shipping rules and monitor All-India couriers from Moradabad hub.
          </p>
        </div>

        <Link
          href="/order-tracking"
          target="_blank"
          className="px-4 py-2.5 rounded-2xl bg-brand-cream-100 border border-brand-cream-300 hover:bg-brand-cream-200 text-brand-green-950 font-heading font-bold text-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Customer Tracking Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
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

      {/* Grid: Shipping Fee Rules & Pincode Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Shipping Configuration Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          <div className="border-b border-brand-cream-200 pb-4">
            <h2 className="font-heading font-black text-lg text-brand-green-950">
              Shipping Charge Rules &amp; Policies
            </h2>
            <p className="text-xs text-brand-charcoal-500 mt-0.5">
              These rules dynamically calculate shipping charges during customer cart and checkout.
            </p>
          </div>

          <form onSubmit={handleSaveRules} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">
                  Free Shipping Minimum (₹)
                </label>
                <input
                  type="number"
                  required
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono font-bold text-brand-green-950 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
                <span className="text-[10px] text-brand-charcoal-400 block">
                  Orders $\ge$ this amount qualify for ₹0 shipping.
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">
                  Standard Flat Shipping Fee (₹)
                </label>
                <input
                  type="number"
                  required
                  value={standardFee}
                  onChange={(e) => setStandardFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono font-bold text-brand-green-950 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
                <span className="text-[10px] text-brand-charcoal-400 block">
                  Charged on orders below the free threshold.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">
                  COD Handling Charge (₹)
                </label>
                <input
                  type="number"
                  required
                  value={codFee}
                  onChange={(e) => setCodFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono font-bold text-brand-green-950 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">
                  Cash on Delivery (COD) Status
                </label>
                <select
                  value={isCodEnabled ? "true" : "false"}
                  onChange={(e) => setIsCodEnabled(e.target.value === "true")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold text-brand-green-950 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                >
                  <option value="true">Enabled (Accept COD)</option>
                  <option value="false">Disabled (Prepaid Only)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-brand-cream-100/70 border border-brand-cream-300 text-brand-charcoal-600 text-[11px] space-y-1">
              <span className="font-bold text-brand-green-950 block">
                Dispatch Origin Facility:
              </span>
              <span>{shippingData.config.originHub}</span>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs shadow-xs disabled:opacity-50 transition"
            >
              {updating ? "Saving Changes..." : "Save Shipping Policies"}
            </button>
          </form>
        </div>

        {/* Right: Pincode Serviceability Tester */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          <div className="border-b border-brand-cream-200 pb-4">
            <h2 className="font-heading font-black text-lg text-brand-green-950 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-green-800" />
              <span>PIN Code SLA Tester</span>
            </h2>
            <p className="text-xs text-brand-charcoal-500 mt-0.5">
              Verify serviceability &amp; SLA from Moradabad hub.
            </p>
          </div>

          <form onSubmit={handleTestPincode} className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={6}
                required
                placeholder="Enter 6-digit PIN code (e.g. 560103)"
                value={testPincode}
                onChange={(e) => setTestPincode(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs font-mono font-bold text-brand-green-950 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
              <button
                type="submit"
                disabled={testingPincode || testPincode.length !== 6}
                className="px-4 py-2.5 rounded-xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs shrink-0 disabled:opacity-50"
              >
                {testingPincode ? "Checking..." : "Verify"}
              </button>
            </div>
          </form>

          {pincodeResult && (
            <div className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-300 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-brand-green-950">
                  PIN: {testPincode}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {pincodeResult.serviceable ? "Serviceable" : "Unserviceable"}
                </span>
              </div>
              <p className="text-brand-charcoal-700">
                {pincodeResult.message}
              </p>
              {pincodeResult.estimatedDays && (
                <div className="text-[11px] text-brand-charcoal-500 pt-1 border-t border-brand-cream-200">
                  Transit SLA: <strong>{pincodeResult.estimatedDays}</strong> from Moradabad Hub.
                </div>
              )}
            </div>
          )}

          {/* Active Logistics Partners */}
          <div className="space-y-2 pt-2 border-t border-brand-cream-200">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-charcoal-400 block">
              Active Courier Carriers
            </span>
            <div className="flex flex-wrap gap-2">
              {shippingData.metrics.activeCarriers.map((carrier: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-brand-mint-50 border border-brand-mint-200 text-brand-green-950 text-xs font-bold"
                >
                  {carrier}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Recent Manifested Parcels */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4">
          <div>
            <h2 className="font-heading font-black text-lg text-brand-green-950">
              Recent Dispatches &amp; Manifests
            </h2>
            <p className="text-xs text-brand-charcoal-500 mt-0.5">
              Live tracking numbers generated for fulfilled orders.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-bold text-brand-green-800 hover:underline"
          >
            Fulfill Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-charcoal-800">
            <thead>
              <tr className="border-b border-brand-cream-200 text-[10px] font-mono uppercase tracking-wider text-brand-charcoal-400">
                <th className="py-3 px-4">Tracking AWB</th>
                <th className="py-3 px-4">Courier Partner</th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Shipment Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cream-100">
              {shippingData.recentShipments.map((shp: any) => (
                <tr key={shp.id} className="hover:bg-brand-cream-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-green-950">
                    {shp.trackingNumber || "PENDING"}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand-charcoal-800">
                    {shp.courierPartner}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-brand-charcoal-600">
                    {shp.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 text-brand-charcoal-700">
                    {shp.recipientCity}, {shp.recipientState}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        shp.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {shp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/order-tracking?orderId=${shp.orderNumber}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 font-bold text-brand-green-800 hover:underline"
                    >
                      <span>Track</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

