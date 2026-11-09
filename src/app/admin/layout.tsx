"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on admin login page, render clean container without sidebar
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-brand-cream-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-brand-cream-50 flex font-sans text-brand-charcoal-900">
      {/* Responsive Left Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMobileMenuToggle={() => setMobileOpen(true)} />

        <main className="flex-1 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
