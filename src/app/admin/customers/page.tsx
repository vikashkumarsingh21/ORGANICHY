"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import {
  Users,
  Search,
  Filter,
  ShoppingBag,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
  UserCheck,
} from "lucide-react";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  joinedAt: string;
  status: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = async (searchQuery = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers?search=${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      if (json.success) {
        setCustomers(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(search);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(search);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200 mb-2">
            <Users className="w-3.5 h-3.5 text-brand-green-800" />
            <span>CUSTOMER ACCOUNTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-brand-charcoal-600 mt-1">
            Registered gym enthusiasts, athletes and families across India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-2xl bg-brand-cream-100 border border-brand-cream-300 hover:bg-brand-cream-200 text-brand-green-950 font-heading font-bold text-xs transition"
          >
            Review Orders
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-brand-cream-300 shadow-card">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, email, phone or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-brand-cream-300 text-xs text-brand-charcoal-900 placeholder:text-brand-charcoal-400 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs shadow-xs transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-charcoal-800">
            <thead>
              <tr className="border-b border-brand-cream-200 text-[10px] font-mono uppercase tracking-wider text-brand-charcoal-400">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cream-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-brand-cream-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-green-900 text-brand-mint-400 font-heading font-black text-xs flex items-center justify-center shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-heading font-bold text-brand-green-950 block">
                          {c.name}
                        </span>
                        <span className="text-[11px] text-brand-charcoal-400">
                          {c.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-brand-charcoal-600">
                    {c.phone}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-brand-charcoal-800 block">
                      {c.city}
                    </span>
                    <span className="text-[11px] text-brand-charcoal-400">
                      {c.state}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-brand-green-900 bg-brand-mint-100 px-2 py-0.5 rounded-md">
                      {c.totalOrders} {c.totalOrders === 1 ? "order" : "orders"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-heading font-black text-brand-green-950">
                    {formatINR(c.totalSpent)}
                  </td>
                  <td className="py-3.5 px-4 text-brand-charcoal-500 text-[11px]">
                    {new Date(c.joinedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
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

