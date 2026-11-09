"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  Leaf,
  ChevronRight,
  ShieldCheck,
  User,
  LogOut,
} from "lucide-react";

interface AdminHeaderProps {
  onMobileMenuToggle: () => void;
}

export default function AdminHeader({ onMobileMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // Generate breadcrumb title
  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 1) return "Dashboard Overview";
    const sub = segments[1];
    return sub.charAt(0).toUpperCase() + sub.slice(1).replace(/-/g, " ");
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-brand-cream-300 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 select-none">
      
      {/* Left: Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl border border-brand-cream-300 text-brand-charcoal-700 hover:bg-brand-cream-100 transition"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Path */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-heading font-medium text-brand-charcoal-500">
          <Link href="/admin" className="hover:text-brand-green-900 transition flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-brand-green-700" />
            <span>Admin</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-brand-cream-400" />
          <span className="font-bold text-brand-green-950">
            {getPageTitle()}
          </span>
        </div>

        <div className="sm:hidden font-heading font-bold text-sm text-brand-green-950">
          {getPageTitle()}
        </div>
      </div>

      {/* Right: Quick Search, Notifications, Store Link & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Quick Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 text-brand-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders, SKU, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-full bg-brand-cream-100/70 border border-brand-cream-300 text-xs text-brand-charcoal-900 placeholder:text-brand-charcoal-400 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
          />
        </div>

        {/* Live Storefront Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-cream-100 border border-brand-cream-300 hover:bg-brand-cream-200 text-brand-green-950 text-xs font-heading font-bold transition shadow-2xs"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 text-brand-charcoal-500" />
        </Link>

        {/* Notifications Icon Button */}
        <div className="relative">
          <Link
            href="/admin/notifications"
            className="p-2 rounded-full border border-brand-cream-300 hover:bg-brand-cream-100 text-brand-charcoal-600 transition relative flex items-center justify-center"
            title="Notifications Center"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-green-700 ring-2 ring-white" />
          </Link>
        </div>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-brand-cream-300">
          <div className="w-8 h-8 rounded-full bg-brand-green-950 text-brand-mint-300 flex items-center justify-center font-bold text-xs shadow-2xs">
            S
          </div>
          <div className="hidden xl:block text-left text-xs">
            <span className="font-heading font-black text-brand-green-950 block leading-none">
              Sourav
            </span>
            <span className="text-[10px] text-brand-charcoal-500 block leading-tight mt-0.5">
              Founder &amp; Super Admin
            </span>
          </div>
        </div>

      </div>

    </header>
  );
}

