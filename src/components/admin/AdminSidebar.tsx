"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  ShoppingBag,
  Users,
  CreditCard,
  Truck,
  Tag,
  Star,
  BarChart3,
  Image as ImageIcon,
  LayoutTemplate,
  HelpCircle,
  Bell,
  Settings,
  Leaf,
  ExternalLink,
  X,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  collapsed?: boolean;
}

export const ADMIN_NAV_SECTIONS = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "CATALOG & INVENTORY",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Inventory", href: "/admin/inventory", icon: Layers },
    ],
  },
  {
    title: "SALES & FULFILLMENT",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
      { label: "Shipping", href: "/admin/shipping", icon: Truck },
      { label: "Coupons", href: "/admin/coupons", icon: Tag },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    title: "CONTENT & MARKETING",
    items: [
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      { label: "Website Content", href: "/admin/cms", icon: LayoutTemplate },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    title: "SETTINGS & SYSTEM",
    items: [
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar({
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-brand-cream-300 select-none">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-brand-cream-200 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-brand-green-900 text-brand-mint-400 flex items-center justify-center font-bold shadow-xs transition group-hover:bg-brand-green-800">
            <Leaf className="w-5 h-5 fill-brand-mint-400" />
          </div>
          <div>
            <div className="font-heading font-black text-lg text-brand-green-950 tracking-wider flex items-center gap-1.5">
              <span>ORGANICHY</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-brand-mint-200 text-brand-green-900 uppercase">
                HQ
              </span>
            </div>
            <p className="text-[10px] text-brand-charcoal-500 font-medium">
              Moradabad, UP • Admin Console
            </p>
          </div>
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1.5 rounded-xl hover:bg-brand-cream-100 text-brand-charcoal-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-brand-cream-300">
        {ADMIN_NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-mono font-bold tracking-wider text-brand-charcoal-400 uppercase">
              {section.title}
            </div>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isItemActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
                      active
                        ? "bg-brand-mint-100 text-brand-green-950 shadow-2xs border-r-4 border-brand-green-800"
                        : "text-brand-charcoal-600 hover:text-brand-green-950 hover:bg-brand-cream-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition ${
                          active
                            ? "text-brand-green-800"
                            : "text-brand-charcoal-400 group-hover:text-brand-green-800"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {active && (
                      <ChevronRight className="w-3.5 h-3.5 text-brand-green-800 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Store Link & Profile Footer */}
      <div className="p-3.5 border-t border-brand-cream-200 bg-brand-cream-50/60 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-brand-cream-300 hover:border-brand-mint-300 text-brand-green-950 text-xs font-heading font-bold shadow-2xs transition"
        >
          <span className="flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-brand-green-700" />
            <span>View Live Storefront</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-brand-charcoal-400" />
        </Link>

        <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-brand-charcoal-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-green-900 text-brand-mint-300 flex items-center justify-center font-bold text-[10px]">
              S
            </div>
            <div>
              <span className="font-bold text-brand-charcoal-900 block leading-tight">
                Sourav
              </span>
              <span className="text-[10px] text-brand-charcoal-500 leading-tight">
                Super Admin
              </span>
            </div>
          </div>

          <Link
            href="/api/auth/logout"
            className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-brand-charcoal-400 transition"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-brand-charcoal-900/50 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </div>
    </>
  );
}

