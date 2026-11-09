"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Minus,
  Clock,
  History,
  FileText,
  Building2,
  ExternalLink,
  X,
  ShieldAlert,
} from "lucide-react";

interface InventoryRecord {
  id: string;
  variantId: string;
  stockQuantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  batchNumber?: string | null;
  warehouseLocation?: string | null;
  updatedAt?: string;
  variant: {
    id: string;
    name: string;
    sku: string;
    price: number;
    weight: string;
    flavor: string;
    product: {
      id: string;
      title: string;
      slug: string;
    };
  };
}

interface AdjustmentLog {
  id: string;
  action: string;
  createdAt: string;
  user?: { name: string; email: string };
  details?: any;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Quick Adjustment Modal State
  const [adjustingItem, setAdjustingItem] = useState<InventoryRecord | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [adjustBatch, setAdjustBatch] = useState<string>("BATCH-ORG-2026-11A");
  const [adjustReason, setAdjustReason] = useState<string>("Roastery fresh batch restock");
  const [submittingAdjust, setSubmittingAdjust] = useState(false);

  // History Drawer State
  const [showHistory, setShowHistory] = useState(false);
  const [adjustmentLogs, setAdjustmentLogs] = useState<AdjustmentLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      if (data.success && data.data) {
        setItems(data.data);
      }
    } catch (e) {
      console.error("Error loading inventory:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const loadHistoryLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/admin/inventory/adjustments");
      const data = await res.json();
      if (data.success) {
        setAdjustmentLogs(data.data);
      }
    } catch (e) {
    } finally {
      setLogsLoading(false);
    }
  };

  const handleOpenHistory = () => {
    setShowHistory(true);
    loadHistoryLogs();
  };

  const handleQuickAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;
    setSubmittingAdjust(true);
    setFeedback(null);

    const newStock = Math.max(0, adjustingItem.stockQuantity + adjustAmount);

    try {
      const res = await fetch(`/api/admin/inventory/${adjustingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockQuantity: newStock,
          batchNumber: adjustBatch,
          reason: adjustReason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setItems((prev) =>
        prev.map((it) =>
          it.id === adjustingItem.id
            ? { ...it, stockQuantity: newStock, batchNumber: adjustBatch }
            : it
        )
      );

      setFeedback({
        type: "success",
        text: `Stock for '${adjustingItem.variant.product.title} (${adjustingItem.variant.name})' updated to ${newStock} units.`,
      });
      setAdjustingItem(null);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to update stock" });
    } finally {
      setSubmittingAdjust(false);
    }
  };

  // Calculations
  const filteredItems = items.filter((it) => {
    const matchesSearch =
      !search ||
      it.variant.product.title.toLowerCase().includes(search.toLowerCase()) ||
      it.variant.sku.toLowerCase().includes(search.toLowerCase());

    const isLow = it.stockQuantity <= (it.lowStockThreshold || 15);
    if (filterLowStockOnly && !isLow) return false;

    return matchesSearch;
  });

  const totalStockUnits = items.reduce((sum, it) => sum + it.stockQuantity, 0);
  const totalValuationINR = items.reduce(
    (sum, it) => sum + it.stockQuantity * it.variant.price,
    0
  );
  const lowStockCount = items.filter(
    (it) => it.stockQuantity > 0 && it.stockQuantity <= (it.lowStockThreshold || 15)
  ).length;
  const outOfStockCount = items.filter((it) => it.stockQuantity <= 0).length;

  return (
    <div className="min-h-screen bg-brand-cream-50 text-brand-charcoal-900 pb-20">
      
      {/* Top Navbar */}
      <header className="bg-brand-charcoal-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-brand-green-800 text-brand-mint-300 flex items-center justify-center font-black text-xs">
              O
            </span>
            <div className="flex flex-col">
              <span className="font-heading font-black text-sm tracking-wide text-white">
                ORGANICHY HQ
              </span>
              <span className="text-[9px] text-brand-charcoal-400 uppercase tracking-widest font-mono">
                Inventory & Stock Management
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-xs font-heading font-bold">
            <Link
              href="/admin/products"
              className="px-3 py-1.5 rounded-full hover:bg-brand-charcoal-800 text-brand-charcoal-300 hover:text-white transition"
            >
              Catalog & Products
            </Link>
            <Link
              href="/admin/inventory"
              className="px-3 py-1.5 rounded-full bg-brand-green-800 text-brand-cream-100 transition"
            >
              Inventory Management
            </Link>
            <Link
              href="/admin/media"
              className="px-3 py-1.5 rounded-full hover:bg-brand-charcoal-800 text-brand-charcoal-300 hover:text-white transition"
            >
              Media Library
            </Link>
            <Link
              href="/admin/cms"
              className="px-3 py-1.5 rounded-full hover:bg-brand-charcoal-800 text-brand-charcoal-300 hover:text-white transition"
            >
              Website CMS
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenHistory}
              className="flex items-center gap-1.5 text-xs text-brand-mint-300 hover:text-white transition"
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Log</span>
            </button>
            <Link
              href="/account"
              className="text-xs px-3 py-1.5 rounded-full bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-brand-charcoal-200"
            >
              Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Title & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-heading font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
              REAL-TIME WAREHOUSE LOGISTICS
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-900 tracking-tight mt-1">
              Live Inventory & Stock Operations
            </h1>
            <p className="text-xs text-brand-charcoal-500">
              Moradabad Central Facility stock monitoring, batch allocation, low-stock threshold triggers, and inventory audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2.5 rounded-full border border-brand-cream-300 bg-white hover:border-brand-green-800 text-xs font-bold text-brand-charcoal-700 hover:text-brand-green-900 transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-brand-green-800" />
              <span>Inventory Report</span>
            </button>
            <button
              onClick={loadInventory}
              className="p-2.5 rounded-full border border-brand-cream-300 bg-white hover:bg-brand-cream-100 text-brand-charcoal-700 transition"
              title="Refresh Stock Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-3 animate-fadeIn ${
              feedback.type === "success"
                ? "bg-brand-mint-100 border border-brand-mint-200 text-brand-green-900"
                : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}
          >
            <span>{feedback.text}</span>
            <button onClick={() => setFeedback(null)} className="font-bold">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
            <span className="text-[10px] font-heading font-bold text-brand-charcoal-500 uppercase tracking-widest block">
              Total Units In Stock
            </span>
            <span className="text-2xl font-heading font-black text-brand-green-900 block">
              {totalStockUnits.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-brand-charcoal-500">Across all variant sizes</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
            <span className="text-[10px] font-heading font-bold text-brand-charcoal-500 uppercase tracking-widest block">
              Stock Valuation (MRP)
            </span>
            <span className="text-2xl font-heading font-black text-brand-green-900 block">
              {formatINR(totalValuationINR)}
            </span>
            <span className="text-[11px] text-brand-charcoal-500">Warehouse inventory value</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
            <span className="text-[10px] font-heading font-bold text-amber-600 uppercase tracking-widest block">
              Low Stock Warnings
            </span>
            <span className="text-2xl font-heading font-black text-amber-700 block">
              {lowStockCount}
            </span>
            <span className="text-[11px] text-brand-charcoal-500">&le; 15 units threshold</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-brand-cream-300 shadow-2xs space-y-1">
            <span className="text-[10px] font-heading font-bold text-rose-600 uppercase tracking-widest block">
              Out of Stock
            </span>
            <span className="text-2xl font-heading font-black text-rose-700 block">
              {outOfStockCount}
            </span>
            <span className="text-[11px] text-brand-charcoal-500">Requires roastery batch</span>
          </div>
        </div>

        {/* Low Stock Urgent Alert Bar */}
        {lowStockCount > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Attention Roastery:</strong> {lowStockCount} item(s) are below the reorder threshold (15 jars). Prepare roasting batch schedule.
              </span>
            </div>
            <button
              onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
              className="text-xs font-bold underline whitespace-nowrap text-amber-900 hover:text-amber-700"
            >
              {filterLowStockOnly ? "Show All Items" : "Filter Low Stock"}
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="p-4 rounded-2xl bg-white border border-brand-cream-300 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-brand-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by product name, SKU or size..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-brand-cream-300 focus:border-brand-green-800 outline-none bg-white"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-brand-charcoal-700">
            <input
              type="checkbox"
              checked={filterLowStockOnly}
              onChange={(e) => setFilterLowStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-brand-green-800"
            />
            <span>Show Low Stock Only (&le; 15 units)</span>
          </label>
        </div>

        {/* Inventory Table */}
        <div className="p-6 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-brand-cream-200 pb-3">
            <h3 className="font-heading font-black text-sm text-brand-green-900 uppercase tracking-wider">
              Variant Stock Levels ({filteredItems.length})
            </h3>
            <span className="text-xs text-brand-charcoal-500">
              Facility: Moradabad Central Roastery
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-brand-charcoal-500">
              Loading inventory levels...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Package className="w-8 h-8 text-brand-charcoal-400 mx-auto" />
              <p className="text-xs text-brand-charcoal-600">No inventory records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-cream-200 text-brand-charcoal-500 font-heading font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-2">Product & Flavor</th>
                    <th className="py-3 px-2">SKU</th>
                    <th className="py-3 px-2">Size / Weight</th>
                    <th className="py-3 px-2">Unit Price</th>
                    <th className="py-3 px-2">Stock Level</th>
                    <th className="py-3 px-2">Batch Number</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream-100">
                  {filteredItems.map((item) => {
                    const isOutOfStock = item.stockQuantity <= 0;
                    const isLowStock =
                      !isOutOfStock && item.stockQuantity <= (item.lowStockThreshold || 15);

                    return (
                      <tr key={item.id} className="hover:bg-brand-cream-50/50 transition">
                        <td className="py-3.5 px-2 font-bold text-brand-charcoal-900">
                          {item.variant.product.title}
                        </td>
                        <td className="py-3.5 px-2 font-mono text-[11px] text-brand-charcoal-600">
                          {item.variant.sku}
                        </td>
                        <td className="py-3.5 px-2 text-brand-charcoal-800">
                          {item.variant.weight} ({item.variant.flavor})
                        </td>
                        <td className="py-3.5 px-2 font-bold text-brand-green-900">
                          {formatINR(item.variant.price)}
                        </td>
                        <td className="py-3.5 px-2">
                          <span
                            className={`font-mono font-black text-sm ${
                              isOutOfStock
                                ? "text-rose-700"
                                : isLowStock
                                ? "text-amber-700"
                                : "text-brand-green-900"
                            }`}
                          >
                            {item.stockQuantity}
                          </span>{" "}
                          <span className="text-[10px] text-brand-charcoal-500">jars</span>
                        </td>
                        <td className="py-3.5 px-2 font-mono text-[11px] text-brand-charcoal-600">
                          {item.batchNumber || "BATCH-ORG-2026-11A"}
                        </td>
                        <td className="py-3.5 px-2">
                          {isOutOfStock ? (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase tracking-wider">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
                              Low Stock ({item.stockQuantity})
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <button
                            onClick={() => {
                              setAdjustingItem(item);
                              setAdjustAmount(25);
                              setAdjustBatch(item.batchNumber || "BATCH-ORG-2026-11A");
                            }}
                            className="px-3 py-1.5 rounded-xl border border-brand-cream-300 hover:border-brand-green-800 text-[11px] font-bold text-brand-green-900 hover:bg-white transition"
                          >
                            Adjust Stock &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* QUICK STOCK ADJUSTMENT MODAL */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-brand-cream-300 overflow-hidden">
            <div className="p-6 border-b border-brand-cream-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-heading font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  STOCK ADJUSTMENT
                </span>
                <h3 className="text-lg font-heading font-black text-brand-green-900 mt-1">
                  {adjustingItem.variant.product.title}
                </h3>
                <span className="text-xs text-brand-charcoal-500">
                  {adjustingItem.variant.name} • SKU: {adjustingItem.variant.sku}
                </span>
              </div>
              <button
                onClick={() => setAdjustingItem(null)}
                className="p-1 rounded-full hover:bg-brand-cream-100"
              >
                <X className="w-5 h-5 text-brand-charcoal-500" />
              </button>
            </div>

            <form onSubmit={handleQuickAdjust} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-brand-charcoal-500 block uppercase font-bold">
                    Current Stock
                  </span>
                  <span className="text-xl font-heading font-black text-brand-green-900">
                    {adjustingItem.stockQuantity} units
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-brand-charcoal-500 block uppercase font-bold">
                    New Computed Stock
                  </span>
                  <span className="text-xl font-heading font-black text-brand-green-800">
                    {Math.max(0, adjustingItem.stockQuantity + adjustAmount)} units
                  </span>
                </div>
              </div>

              {/* Adjustment Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-charcoal-800 block">
                  Add or Deduct Stock (+ / -)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    required
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(parseInt(e.target.value, 10) || 0)}
                    placeholder="+50 or -10"
                    className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs font-bold outline-none bg-white"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setAdjustAmount(10)}
                      className="px-2.5 py-1.5 rounded-lg border text-[11px] font-bold bg-brand-mint-50 text-brand-green-900"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustAmount(50)}
                      className="px-2.5 py-1.5 rounded-lg border text-[11px] font-bold bg-brand-mint-50 text-brand-green-900"
                    >
                      +50
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustAmount(-10)}
                      className="px-2.5 py-1.5 rounded-lg border text-[11px] font-bold bg-rose-50 text-rose-700"
                    >
                      -10
                    </button>
                  </div>
                </div>
              </div>

              {/* Batch Allocation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-charcoal-800 block">
                  Roastery Batch Number
                </label>
                <input
                  type="text"
                  required
                  value={adjustBatch}
                  onChange={(e) => setAdjustBatch(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs font-mono outline-none bg-white uppercase"
                />
              </div>

              {/* Reason / Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-charcoal-800 block">
                  Reason for Adjustment
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Roastery restock batch, lab sample deduction"
                  className="w-full p-2.5 rounded-xl border border-brand-cream-300 text-xs outline-none bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-brand-cream-200">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-4 py-2 rounded-full border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdjust}
                  className="px-6 py-2 rounded-full bg-brand-green-900 text-brand-cream-100 font-heading font-bold text-xs uppercase tracking-wider"
                >
                  {submittingAdjust ? "Updating..." : "Confirm Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT LOG HISTORY DRAWER */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-end animate-fadeIn">
          <div className="max-w-lg w-full h-full bg-white shadow-2xl border-l border-brand-cream-300 flex flex-col">
            <div className="p-6 border-b border-brand-cream-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-heading font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  IMMUTABLE LOGS
                </span>
                <h3 className="text-lg font-heading font-black text-brand-green-900 mt-1">
                  Stock Adjustment Audit Trail
                </h3>
              </div>
              <button onClick={() => setShowHistory(false)} className="p-2">
                <X className="w-5 h-5 text-brand-charcoal-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {logsLoading ? (
                <div className="py-12 text-center text-xs text-brand-charcoal-500">
                  Loading adjustment records...
                </div>
              ) : adjustmentLogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-brand-charcoal-500">
                  No adjustments recorded yet.
                </div>
              ) : (
                adjustmentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-green-900">{log.action}</span>
                      <span className="text-[10px] text-brand-charcoal-500">
                        {new Date(log.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-charcoal-700">
                      Operator: <strong>{log.user?.name || "Administrator"}</strong> ({log.user?.email || "admin@organichy.com"})
                    </p>
                    {log.details && (
                      <div className="p-2 rounded-xl bg-white border border-brand-cream-200 font-mono text-[10px] text-brand-charcoal-600">
                        {JSON.stringify(log.details)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-brand-cream-50 border-t border-brand-cream-200 text-right">
              <button
                onClick={() => setShowHistory(false)}
                className="px-5 py-2 rounded-full bg-brand-green-900 text-brand-cream-100 font-bold text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVENTORY REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-brand-cream-300 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-3">
              <div>
                <span className="text-[10px] font-heading font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  WAREHOUSE AUDIT
                </span>
                <h3 className="text-xl font-heading font-black text-brand-green-900 mt-1">
                  Inventory Valuation Report
                </h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="p-1">
                <X className="w-5 h-5 text-brand-charcoal-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-brand-cream-100">
                <span className="text-brand-charcoal-600">Report Generation Date</span>
                <span className="font-bold text-brand-charcoal-900">{new Date().toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-cream-100">
                <span className="text-brand-charcoal-600">Central Facility</span>
                <span className="font-bold text-brand-charcoal-900">Moradabad, Uttar Pradesh, India</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-cream-100">
                <span className="text-brand-charcoal-600">Total Unique SKUs</span>
                <span className="font-bold text-brand-charcoal-900">{items.length} SKUs</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-cream-100">
                <span className="text-brand-charcoal-600">Total Units in Stock</span>
                <span className="font-bold text-brand-green-900">{totalStockUnits} jars</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-cream-100">
                <span className="text-brand-charcoal-600">Total Asset Value (INR)</span>
                <span className="font-heading font-black text-brand-green-900 text-sm">
                  {formatINR(totalValuationINR)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-cream-100">
                <span className="text-brand-charcoal-600">Items Requiring Reorder</span>
                <span className="font-bold text-amber-700">{lowStockCount} items</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-full border border-brand-cream-300 text-xs font-bold text-brand-charcoal-700 hover:bg-brand-cream-100 transition"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="px-6 py-2.5 rounded-full bg-brand-green-900 text-brand-cream-100 text-xs font-bold uppercase tracking-wider"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

