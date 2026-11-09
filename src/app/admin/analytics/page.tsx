"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import { BarChart, RevenueAreaChart } from "@/components/admin/Charts";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Star,
  Award,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [salesView, setSalesView] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/analytics");
        const json = await res.json();
        if (json.success) {
          setAnalytics(json.data);
        }
      } catch (e) {
        console.error("Failed to load analytics:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 text-brand-charcoal-500">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-green-800" />
        <span className="font-heading font-bold text-sm">
          Generating Analytics &amp; Revenue Reports...
        </span>
      </div>
    );
  }

  const { summary, dailySales, weeklySales, monthlySales, bestSellers, customerGrowth, productPerformance } = analytics;

  // Active sales data based on view
  const activeSalesData =
    salesView === "daily"
      ? dailySales.map((d: any) => ({ label: `${d.day} (${d.date})`, value: d.revenue }))
      : salesView === "weekly"
      ? weeklySales.map((w: any) => ({ label: w.week, value: w.revenue }))
      : monthlySales.map((m: any) => ({ label: m.month, value: m.revenue }));

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-brand-green-800" />
            <span>ORGANICHY REVENUE INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 tracking-tight">
            Sales &amp; Product Analytics
          </h1>
          <p className="text-xs text-brand-charcoal-600 mt-1">
            Aggregated order revenue, customer growth trajectories and nutrition product sales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wide shadow-xs transition"
          >
            Review Orders
          </Link>
        </div>
      </div>

      {/* 2. Key Performance Metric Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-charcoal-500">
            Total Sales Revenue
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950">
            {formatINR(summary.totalRevenue)}
          </div>
          <span className="inline-block text-[10px] font-bold text-brand-green-800 bg-brand-mint-100 px-2 py-0.5 rounded-md">
            +18.4% Month-on-Month
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-charcoal-500">
            Average Order Value (AOV)
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950">
            {formatINR(summary.averageOrderValue)}
          </div>
          <span className="inline-block text-[10px] font-bold text-brand-green-800 bg-brand-mint-100 px-2 py-0.5 rounded-md">
            ~1.8 Jars Per Basket
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-charcoal-500">
            Total Jars Delivered
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950">
            {summary.totalUnitsSold.toLocaleString("en-IN")}
          </div>
          <span className="inline-block text-[10px] font-bold text-brand-charcoal-700 bg-brand-cream-200 px-2 py-0.5 rounded-md">
            From Moradabad Kitchen
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-charcoal-500">
            Repeat Customer Rate
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950">
            {customerGrowth.returningRate}
          </div>
          <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
            High Brand Loyalty
          </span>
        </div>
      </div>

      {/* 3. Sales Trend Charts (Daily / Weekly / Monthly Switcher) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-200 pb-4">
          <div>
            <h2 className="font-heading font-black text-lg text-brand-green-950">
              Sales Volume &amp; Revenue Trends
            </h2>
            <p className="text-xs text-brand-charcoal-500 mt-0.5">
              Compare daily, weekly, and monthly growth numbers.
            </p>
          </div>

          {/* Toggle Button Group */}
          <div className="inline-flex p-1 rounded-2xl bg-brand-cream-100 border border-brand-cream-300">
            {(["daily", "weekly", "monthly"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSalesView(mode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold capitalize transition ${
                  salesView === mode
                    ? "bg-brand-green-900 text-white shadow-xs"
                    : "text-brand-charcoal-600 hover:text-brand-green-950"
                }`}
              >
                {mode} Sales
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart rendering */}
        <BarChart data={activeSalesData} height={220} valuePrefix="₹" />
      </div>

      {/* 4. Split Grid: Best Selling Products & Customer Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Best Selling Products */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-brand-cream-200 pb-3">
            <div>
              <h3 className="font-heading font-black text-base text-brand-green-950 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-green-800" />
                <span>Best Selling Products</span>
              </h3>
              <p className="text-xs text-brand-charcoal-500 mt-0.5">
                Top revenue contributors in peanut butter &amp; nutrition
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {bestSellers.map((prod: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-brand-cream-50/80 border border-brand-cream-200 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-green-900 text-brand-mint-400 font-mono font-black text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <span className="font-heading font-bold text-xs text-brand-green-950 block">
                      {prod.title}
                    </span>
                    <span className="text-[10px] font-mono text-brand-charcoal-400">
                      SKU: {prod.sku} • {prod.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-heading font-black text-sm text-brand-green-950">
                    {formatINR(prod.revenue)}
                  </div>
                  <span className="text-[10px] font-bold text-brand-charcoal-500">
                    {prod.units} jars sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Customer Growth Metrics */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          <div className="border-b border-brand-cream-200 pb-3">
            <h3 className="font-heading font-black text-base text-brand-green-950 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-green-800" />
              <span>Customer Growth &amp; Retention</span>
            </h3>
            <p className="text-xs text-brand-charcoal-500 mt-0.5">
              Audience acquisition and lifetime value metrics
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-brand-mint-50/80 border border-brand-mint-200 flex items-center justify-between">
              <span className="font-heading font-bold text-brand-charcoal-700">
                New Registrations This Month
              </span>
              <span className="font-mono font-black text-base text-brand-green-950">
                +{customerGrowth.newThisMonth}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-brand-cream-50/80 border border-brand-cream-200 flex items-center justify-between">
              <span className="font-heading font-bold text-brand-charcoal-700">
                Storefront Cart Conversion
              </span>
              <span className="font-mono font-black text-base text-brand-green-950">
                {customerGrowth.cartConversionRate}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-brand-cream-50/80 border border-brand-cream-200 flex items-center justify-between">
              <span className="font-heading font-bold text-brand-charcoal-700">
                Total Registered Customer Base
              </span>
              <span className="font-mono font-black text-base text-brand-green-950">
                {customerGrowth.totalCustomers}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-brand-cream-50/80 border border-brand-cream-200 flex items-center justify-between">
              <span className="font-heading font-bold text-brand-charcoal-700">
                Average Customer LTV
              </span>
              <span className="font-mono font-black text-base text-brand-green-950">
                {formatINR(summary.averageOrderValue * 2.4)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Product Performance Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
        <div className="border-b border-brand-cream-200 pb-4">
          <h2 className="font-heading font-black text-lg text-brand-green-950">
            Catalog Product Performance
          </h2>
          <p className="text-xs text-brand-charcoal-500 mt-0.5">
            Conversion rates, customer reviews, stock remaining and sales revenue.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-charcoal-800">
            <thead>
              <tr className="border-b border-brand-cream-200 text-[10px] font-mono uppercase tracking-wider text-brand-charcoal-400">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Units Sold</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Conversion</th>
                <th className="py-3 px-4 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cream-100">
              {productPerformance.map((prod: any) => (
                <tr key={prod.id} className="hover:bg-brand-cream-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-heading font-bold text-brand-green-950">
                    {prod.title}
                  </td>
                  <td className="py-3.5 px-4 text-brand-charcoal-500">
                    {prod.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{prod.rating}</span>
                      <span className="text-[10px] text-brand-charcoal-400 font-normal">
                        ({prod.reviewsCount})
                      </span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-charcoal-900">
                    {prod.unitsSold}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-mono font-bold text-[11px] ${
                        prod.stockRemaining <= 15
                          ? "text-rose-600"
                          : "text-brand-green-800"
                      }`}
                    >
                      {prod.stockRemaining} jars
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand-charcoal-700">
                    {prod.conversionRate}
                  </td>
                  <td className="py-3.5 px-4 text-right font-heading font-bold text-brand-green-950">
                    {formatINR(prod.revenue)}
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

