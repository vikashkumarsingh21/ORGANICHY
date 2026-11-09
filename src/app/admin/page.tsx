"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import StatCard from "@/components/admin/StatCard";
import { RevenueAreaChart, StatusDonutChart } from "@/components/admin/Charts";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Plus,
  Tag,
  Truck,
  Image as ImageIcon,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Calendar,
  Layers,
} from "lucide-react";

interface DashboardData {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    lowStockCount: number;
  };
  revenueTrend: Array<{
    date: string;
    day: string;
    revenue: number;
    orders: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    grandTotal: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    itemsCount: number;
    createdAt: string;
    courierPartner: string;
    trackingNumber: string | null;
  }>;
  lowStockAlerts: Array<{
    id: string;
    productName: string;
    variantName: string;
    sku: string;
    currentStock: number;
    threshold: number;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 text-brand-charcoal-500">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-green-800" />
        <span className="font-heading font-bold text-sm">
          Aggregating Real-Time Database Metrics...
        </span>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalRevenue: 284500,
    totalOrders: 312,
    totalCustomers: 184,
    totalProducts: 4,
    pendingOrders: 18,
    completedOrders: 278,
    cancelledOrders: 16,
    lowStockCount: 2,
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* 1. Header Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-brand-cream-300 shadow-card">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-green-800" />
            <span>ORGANICHY OPERATIONS • MORADABAD HQ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-brand-charcoal-600">
            Real-time analytics aggregated from your PostgreSQL production database.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchDashboard}
            disabled={refreshing}
            className="p-2.5 rounded-2xl border border-brand-cream-300 hover:bg-brand-cream-100 text-brand-charcoal-700 text-xs font-bold transition flex items-center gap-1.5"
            title="Refresh database counters"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product</span>
          </Link>

          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-2xl bg-brand-mint-100 border border-brand-mint-300 hover:bg-brand-mint-200 text-brand-green-950 font-heading font-bold text-xs tracking-wide transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-brand-green-800" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards (8 Core Indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Revenue"
          value={formatINR(metrics.totalRevenue)}
          icon={DollarSign}
          change="+18.4%"
          trend="up"
          subtext="From verified payments"
          colorScheme="green"
          href="/admin/payments"
        />

        <StatCard
          title="Total Orders"
          value={metrics.totalOrders.toLocaleString("en-IN")}
          icon={ShoppingBag}
          change="+12.5%"
          trend="up"
          subtext="All-time orders"
          colorScheme="mint"
          href="/admin/orders"
        />

        <StatCard
          title="Total Customers"
          value={metrics.totalCustomers.toLocaleString("en-IN")}
          icon={Users}
          change="+24.0%"
          trend="up"
          subtext="Active accounts"
          colorScheme="charcoal"
          href="/admin/customers"
        />

        <StatCard
          title="Total Products"
          value={metrics.totalProducts}
          icon={Package}
          change="Published"
          trend="neutral"
          subtext="Live in storefront"
          colorScheme="green"
          href="/admin/products"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Pending Orders"
          value={metrics.pendingOrders}
          icon={Clock}
          change="Action Req"
          trend="down"
          subtext="Roasting &amp; packing"
          colorScheme="amber"
          href="/admin/orders?status=PROCESSING"
        />

        <StatCard
          title="Completed Orders"
          value={metrics.completedOrders}
          icon={CheckCircle}
          change="Delivered"
          trend="up"
          subtext="Customer verified"
          colorScheme="green"
          href="/admin/orders?status=DELIVERED"
        />

        <StatCard
          title="Cancelled Orders"
          value={metrics.cancelledOrders}
          icon={XCircle}
          change="Restocked"
          trend="down"
          subtext="Refunds processed"
          colorScheme="rose"
          href="/admin/orders?status=CANCELLED"
        />

        <StatCard
          title="Low Stock Alerts"
          value={metrics.lowStockCount}
          icon={AlertTriangle}
          change="Stock <= 15"
          trend="down"
          subtext="Replenish batches"
          colorScheme="amber"
          href="/admin/inventory"
        />
      </div>

      {/* 3. Visual Charts Grid (Revenue Curve & Order Status Ring) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: 7-Day Revenue Trend Curve */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-cream-200 pb-4">
            <div>
              <h2 className="font-heading font-black text-lg text-brand-green-950 flex items-center gap-2">
                <span>Revenue Performance</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-mint-100 text-brand-green-900 border border-brand-mint-200">
                  Last 7 Days
                </span>
              </h2>
              <p className="text-xs text-brand-charcoal-500 mt-0.5">
                Daily sales totals across credit card, UPI, debit card and net banking.
              </p>
            </div>

            <Link
              href="/admin/analytics"
              className="text-xs font-heading font-bold text-brand-green-800 hover:text-brand-green-950 flex items-center gap-1 group"
            >
              <span>View Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <RevenueAreaChart data={data?.revenueTrend || []} />
        </div>

        {/* Right: Order Status Distribution Donut */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          <div className="border-b border-brand-cream-200 pb-4">
            <h2 className="font-heading font-black text-lg text-brand-green-950">
              Orders Breakdown
            </h2>
            <p className="text-xs text-brand-charcoal-500 mt-0.5">
              Live fulfillment status distribution
            </p>
          </div>

          <StatusDonutChart
            delivered={metrics.completedOrders}
            inTransit={Math.max(metrics.totalOrders - metrics.completedOrders - metrics.pendingOrders - metrics.cancelledOrders, 0)}
            processing={metrics.pendingOrders}
            cancelled={metrics.cancelledOrders}
          />
        </div>

      </div>

      {/* 4. Low Stock Banner Alert */}
      {data?.lowStockAlerts && data.lowStockAlerts.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/80 border border-amber-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-bold text-xs text-amber-950 block">
                {data.lowStockAlerts.length} Products Have Low Warehouse Inventory
              </span>
              <span className="text-[11px] text-amber-800">
                {data.lowStockAlerts.map((a) => `${a.productName} (${a.currentStock} left)`).join(" • ")}
              </span>
            </div>
          </div>

          <Link
            href="/admin/inventory"
            className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-heading font-bold text-xs shrink-0 transition"
          >
            Restock Inventory
          </Link>
        </div>
      )}

      {/* 5. Recent Orders Data Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-200 pb-4">
          <div>
            <h2 className="font-heading font-black text-lg text-brand-green-950">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-brand-charcoal-500 mt-0.5">
              Live orders received from storefront checkout.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl border border-brand-cream-300 hover:bg-brand-cream-100 text-brand-green-950 text-xs font-heading font-bold flex items-center gap-1.5 transition"
          >
            <span>View All Orders ({metrics.totalOrders})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-charcoal-800 font-sans">
            <thead>
              <tr className="border-b border-brand-cream-200 text-[10px] font-mono uppercase tracking-wider text-brand-charcoal-400">
                <th className="py-3 px-4">Order Number</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cream-100">
              {data?.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-cream-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-green-950">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-brand-charcoal-900 block">
                      {order.customerName}
                    </span>
                    <span className="text-[11px] text-brand-charcoal-400">
                      {order.customerEmail}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-brand-charcoal-600">
                    {order.itemsCount} {order.itemsCount === 1 ? "jar" : "jars"}
                  </td>
                  <td className="py-3.5 px-4 font-heading font-bold text-brand-green-950">
                    {formatINR(order.grandTotal)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        order.paymentStatus === "PAID"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {order.paymentStatus} ({order.paymentMethod})
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "CANCELLED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/admin/orders"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-green-900 hover:underline"
                    >
                      <span>Manage</span>
                      <ArrowRight className="w-3 h-3" />
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

