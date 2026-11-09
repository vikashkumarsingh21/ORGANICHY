"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  Search,
  Truck,
  Leaf,
} from "lucide-react";
import { NAVIGATION_LINKS } from "@/lib/constants";
import { useCartStore } from "@/lib/cartStore";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-40 bg-brand-cream-50/95 backdrop-blur-md border-b border-brand-cream-300 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-charcoal-700 hover:text-brand-green-900 hover:bg-brand-cream-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-brand-green-900 flex items-center justify-center text-brand-mint-300 shadow-subtle group-hover:bg-brand-green-800 transition">
                <Leaf className="w-5 h-5 fill-brand-mint-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl tracking-wider text-brand-green-900 leading-none">
                  ORGANICHY
                </span>
                <span className="text-[9px] uppercase tracking-widest text-brand-mint-600 font-bold mt-0.5">
                  Pure Indian Nutrition
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAVIGATION_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-brand-green-700 relative py-1 ${
                    isActive
                      ? "text-brand-green-900 font-semibold"
                      : "text-brand-charcoal-700"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Order Tracking */}
            <Link
              href="/order-tracking"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-brand-charcoal-600 hover:text-brand-green-800 transition py-1.5 px-3 rounded-full border border-brand-cream-300 hover:border-brand-mint-400 hover:bg-brand-mint-50"
              title="Track Order"
            >
              <Truck className="w-3.5 h-3.5 text-brand-green-700" />
              <span>Track Order</span>
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="p-2 text-brand-charcoal-700 hover:text-brand-green-800 hover:bg-brand-cream-100 rounded-full transition"
              title="My Account"
              aria-label="My Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Button with Count Badge */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 bg-brand-green-900 text-brand-cream-100 rounded-full hover:bg-brand-green-800 transition shadow-subtle flex items-center justify-center group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-mint-400 text-brand-green-900 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-cream-300 bg-brand-cream-50 px-4 pt-3 pb-6 space-y-2 shadow-card">
          {NAVIGATION_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition ${
                  isActive
                    ? "bg-brand-green-900 text-brand-cream-100"
                    : "text-brand-charcoal-800 hover:bg-brand-cream-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-brand-cream-300">
            <Link
              href="/order-tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-brand-green-800 font-medium"
            >
              <Truck className="w-4 h-4" />
              Track Your Shipment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

