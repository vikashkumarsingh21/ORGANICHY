"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/utils";
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  Truck,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Eye,
  CheckCircle2,
  X,
  CreditCard,
  Building,
} from "lucide-react";

interface AddressItem {
  id: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface OrderItemSummary {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  grandTotal: number;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  shippingAddress: any;
  shipment?: {
    trackingNumber: string;
    courierPartner: string;
    status: string;
  };
  items: Array<{
    title: string;
    variantName: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }>;
}

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "PROFILE" | "ORDERS" | "ADDRESSES" | "TRACKING" | "SETTINGS"
  >("ORDERS");

  // User Profile State
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Profile Form State
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<OrderItemSummary[]>([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderItemSummary | null>(null);

  // Addresses State
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phoneNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "Uttar Pradesh",
    postalCode: "",
    isDefault: false,
  });

  // Tracking Tab State
  const [trackingQuery, setTrackingQuery] = useState("");
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Fetch Session and Initial Data
  useEffect(() => {
    async function loadSessionData() {
      setLoading(true);
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();

        if (!authRes.ok || !authData.authenticated) {
          // If not authenticated, redirect to login
          router.push("/login?redirect=/account");
          return;
        }

        setUser(authData.user);
        setNameInput(authData.user.name || "");
        setPhoneInput(authData.user.phone || "");

        // Load Addresses
        const addrRes = await fetch("/api/customer/addresses");
        const addrData = await addrRes.json();
        if (addrData.success && addrData.data) {
          setAddresses(addrData.data);
        }

        // Load Orders
        const ordersRes = await fetch("/api/customer/orders");
        const ordersData = await ordersRes.json();
        if (ordersData.success && ordersData.data) {
          setOrders(ordersData.data);
        }
      } catch (err) {
        console.error("Account data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSessionData();
  }, [router]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      router.push("/login");
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput, phone: phoneInput }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setUser((prev) => (prev ? { ...prev, name: nameInput, phone: phoneInput } : null));
      setFeedbackMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setFeedbackMessage({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Save / Edit Address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    try {
      const url = editingAddressId
        ? `/api/customer/addresses/${editingAddressId}`
        : "/api/customer/addresses";
      const method = editingAddressId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      // Refresh list
      const updatedList = await (await fetch("/api/customer/addresses")).json();
      if (updatedList.success) setAddresses(updatedList.data);

      setShowAddressModal(false);
      setEditingAddressId(null);
      setAddressForm({
        fullName: "",
        phoneNumber: "",
        street: "",
        landmark: "",
        city: "",
        state: "Uttar Pradesh",
        postalCode: "",
        isDefault: false,
      });
      setFeedbackMessage({ type: "success", text: "Address saved successfully!" });
    } catch (err: any) {
      setFeedbackMessage({ type: "error", text: err.message || "Failed to save address." });
    }
  };

  // Handle Delete Address
  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/customer/addresses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (e) {}
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setFeedbackMessage(null);

    if (newPassword !== confirmPassword) {
      setFeedbackMessage({ type: "error", text: "New passwords do not match." });
      setSavingPassword(false);
      return;
    }

    try {
      const res = await fetch("/api/customer/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFeedbackMessage({ type: "success", text: "Password changed successfully!" });
    } catch (err: any) {
      setFeedbackMessage({ type: "error", text: err.message || "Failed to change password." });
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle Live Tracking Search
  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery) return;
    setTrackingLoading(true);
    setTrackingResult(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(trackingQuery)}/track`);
      const data = await res.json();
      if (data.success && data.data) {
        setTrackingResult(data.data);
      } else {
        setTrackingResult({ notFound: true, orderNumber: trackingQuery });
      }
    } catch (e) {
      setTrackingResult({ notFound: true, orderNumber: trackingQuery });
    } finally {
      setTrackingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 bg-brand-cream-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-brand-green-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-heading font-bold text-brand-green-900 tracking-wider uppercase">
            Loading Customer Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-brand-cream-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-heading font-bold text-brand-green-800 bg-brand-mint-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {user?.role === "ADMIN" ? "ADMINISTRATOR DASHBOARD" : "VERIFIED CUSTOMER"}
              </span>
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin/media"
                  className="text-[10px] font-heading font-bold text-white bg-brand-green-900 px-2.5 py-1 rounded-full uppercase tracking-wider hover:bg-brand-green-800 transition"
                >
                  Admin CMS &rarr;
                </Link>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-900 tracking-tight mt-1.5">
              My Account
            </h1>
            <p className="text-xs sm:text-sm text-brand-charcoal-500">
              Welcome back, <strong>{user?.name}</strong> ({user?.email})
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-cream-300 hover:border-rose-300 text-xs font-bold text-brand-charcoal-700 hover:text-rose-600 transition bg-white shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedbackMessage && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-3 animate-fadeIn ${
              feedbackMessage.type === "success"
                ? "bg-brand-mint-100 border border-brand-mint-200 text-brand-green-900"
                : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-brand-green-800 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-xs font-bold hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Tabs (Sidebar) */}
          <aside className="md:col-span-4 p-3 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-1.5 sticky top-24">
            {[
              { id: "ORDERS", label: "My Orders & History", icon: Package, badge: orders.length },
              { id: "ADDRESSES", label: "Saved Addresses", icon: MapPin, badge: addresses.length },
              { id: "TRACKING", label: "Track Shipment", icon: Truck },
              { id: "PROFILE", label: "Profile Information", icon: User },
              { id: "SETTINGS", label: "Security & Settings", icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition ${
                    isActive
                      ? "bg-brand-green-900 text-brand-cream-100 shadow-sm"
                      : "hover:bg-brand-cream-100 text-brand-charcoal-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-brand-mint-300" : "text-brand-green-800"}`} />
                    <span className="font-heading font-bold text-xs tracking-wide">{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-brand-green-800 text-brand-cream-100"
                          : "bg-brand-cream-200 text-brand-charcoal-700"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-2 border-t border-brand-cream-200 px-2">
              <div className="p-3 rounded-2xl bg-brand-mint-50 border border-brand-mint-100 text-[11px] text-brand-green-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xs text-brand-green-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green-800" />
                  <span>ORGANICHY Guarantee</span>
                </span>
                <p className="text-[10px] text-brand-charcoal-600 leading-relaxed">
                  Stone-ground slow roasted in Moradabad, UP. All shipments include verified temperature-protected packaging.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="md:col-span-8 space-y-6">
            
            {/* TAB 1: MY ORDERS */}
            {activeTab === "ORDERS" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-heading font-black text-brand-green-900">
                      My Order History
                    </h2>
                    <p className="text-xs text-brand-charcoal-500">
                      Review all past orders, dispatch statuses, and download tax invoices.
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    className="text-xs font-bold text-brand-green-800 hover:text-brand-green-900 underline flex items-center gap-1"
                  >
                    <span>Order More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-white border border-brand-cream-300 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-brand-cream-100 text-brand-charcoal-400 flex items-center justify-center mx-auto">
                      <Package className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-heading font-bold text-brand-green-900">
                        No Orders Yet
                      </h3>
                      <p className="text-xs text-brand-charcoal-500 max-w-sm mx-auto">
                        You have not placed any orders yet. Discover our fresh batches of stone-ground peanut butter!
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-green-900 text-brand-cream-100 font-heading font-bold text-xs uppercase tracking-wider hover:bg-brand-green-800 transition"
                    >
                      <span>Explore Shop</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id || ord.orderNumber}
                        className="p-6 rounded-3xl bg-white border border-brand-cream-300 shadow-card hover:border-brand-mint-300 transition space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-cream-200 pb-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-brand-charcoal-500 uppercase tracking-widest block">
                              Order Reference
                            </span>
                            <span className="text-sm font-mono font-black text-brand-green-900">
                              {ord.orderNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-brand-charcoal-500 block">Date Placed</span>
                            <span className="text-xs font-bold text-brand-charcoal-800">
                              {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-brand-charcoal-500 block">Total Amount</span>
                            <span className="text-xs font-heading font-black text-brand-green-900">
                              {formatINR(ord.grandTotal)}
                            </span>
                          </div>
                          <div>
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                ord.status === "DELIVERED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : ord.status === "SHIPPED"
                                  ? "bg-blue-100 text-blue-800"
                                  : ord.status === "CANCELLED"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="space-y-2">
                          {ord.items?.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs text-brand-charcoal-700">
                              <span>
                                {item.title} ({item.variantName}) &times; {item.quantity}
                              </span>
                              <span className="font-bold text-brand-charcoal-900">
                                {formatINR(item.total || item.unitPrice * item.quantity)}
                              </span>
                            </div>
                          ))}
                          {(ord.items?.length || 0) > 2 && (
                            <span className="text-[11px] text-brand-charcoal-500 italic block">
                              + {(ord.items?.length || 0) - 2} more item(s)
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-brand-cream-100">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="text-xs font-bold text-brand-green-800 hover:text-brand-green-900 underline"
                          >
                            View Order Details
                          </button>

                          <Link
                            href={`/order-tracking?orderId=${ord.orderNumber}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-charcoal-700 hover:text-brand-green-900 transition"
                          >
                            <Truck className="w-3.5 h-3.5 text-brand-green-800" />
                            <span>Track Package</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MY ADDRESSES */}
            {activeTab === "ADDRESSES" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-heading font-black text-brand-green-900">
                      Saved Shipping Addresses
                    </h2>
                    <p className="text-xs text-brand-charcoal-500">
                      Manage delivery addresses for seamless 1-click checkout.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingAddressId(null);
                      setAddressForm({
                        fullName: user?.name || "",
                        phoneNumber: user?.phone || "",
                        street: "",
                        landmark: "",
                        city: "Moradabad",
                        state: "Uttar Pradesh",
                        postalCode: "",
                        isDefault: addresses.length === 0,
                      });
                      setShowAddressModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs uppercase tracking-wider transition shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white border border-brand-cream-300 text-center space-y-3">
                    <MapPin className="w-8 h-8 text-brand-charcoal-400 mx-auto" />
                    <p className="text-xs text-brand-charcoal-600">
                      You haven&apos;t saved any shipping addresses yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-6 rounded-3xl bg-white border transition relative space-y-3 ${
                          addr.isDefault
                            ? "border-brand-green-800 shadow-card"
                            : "border-brand-cream-300 shadow-2xs hover:border-brand-cream-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs text-brand-charcoal-900">
                            {addr.fullName}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-mint-100 text-brand-green-900">
                              DEFAULT
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-brand-charcoal-600 leading-relaxed">
                          {addr.street}
                          {addr.landmark ? `, ${addr.landmark}` : ""}
                          <br />
                          {addr.city}, {addr.state} - {addr.postalCode}
                          <br />
                          {addr.country}
                        </p>

                        <p className="text-xs text-brand-charcoal-700 font-bold">
                          📱 {addr.phoneNumber}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-brand-cream-200">
                          <button
                            onClick={() => {
                              setEditingAddressId(addr.id);
                              setAddressForm({
                                fullName: addr.fullName,
                                phoneNumber: addr.phoneNumber,
                                street: addr.street,
                                landmark: addr.landmark || "",
                                city: addr.city,
                                state: addr.state,
                                postalCode: addr.postalCode,
                                isDefault: addr.isDefault,
                              });
                              setShowAddressModal(true);
                            }}
                            className="text-xs font-bold text-brand-charcoal-600 hover:text-brand-green-900 transition flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 transition flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: LIVE TRACKING */}
            {activeTab === "TRACKING" && (
              <div className="p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-black text-brand-green-900">
                    Track Your Shipment
                  </h2>
                  <p className="text-xs text-brand-charcoal-500">
                    Enter any ORGANICHY order number to view real-time Delhivery roasting & dispatch status.
                  </p>
                </div>

                <form onSubmit={handleTrackSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={trackingQuery}
                    onChange={(e) => setTrackingQuery(e.target.value)}
                    placeholder="e.g. ORG-202611-1001"
                    className="flex-1 px-4 py-3 rounded-2xl border border-brand-cream-300 focus:border-brand-green-700 text-xs font-mono outline-none bg-white uppercase"
                  />
                  <button
                    type="submit"
                    disabled={trackingLoading || !trackingQuery}
                    className="px-6 py-3 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs uppercase tracking-wider transition disabled:opacity-50"
                  >
                    {trackingLoading ? "Tracking..." : "Track"}
                  </button>
                </form>

                {trackingResult && (
                  <div className="p-6 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 space-y-4">
                    {trackingResult.notFound ? (
                      <p className="text-xs text-rose-600 font-bold">
                        No shipment record found for &quot;{trackingResult.orderNumber}&quot;. Please verify the order number.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-brand-cream-200 pb-3">
                          <div>
                            <span className="text-[10px] text-brand-charcoal-500 block uppercase tracking-wider font-bold">
                              Status
                            </span>
                            <span className="text-sm font-heading font-black text-brand-green-900">
                              {trackingResult.status}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-brand-charcoal-500 block uppercase tracking-wider font-bold">
                              Courier Partner
                            </span>
                            <span className="text-xs font-bold text-brand-charcoal-800">
                              {trackingResult.shipment?.courierPartner || "Delhivery Surface"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-brand-charcoal-500 block uppercase tracking-wider font-bold">
                              Tracking AWB
                            </span>
                            <span className="text-xs font-mono font-bold text-brand-green-800">
                              {trackingResult.shipment?.trackingNumber || "DEL-PENDING"}
                            </span>
                          </div>
                        </div>

                        {/* Milestone Visual Progress */}
                        <div className="grid grid-cols-4 gap-2 text-center pt-2">
                          {[
                            { label: "Confirmed", done: true },
                            { label: "Roasting & Pack", done: trackingResult.status !== "PENDING" },
                            { label: "Dispatched", done: trackingResult.status === "SHIPPED" || trackingResult.status === "DELIVERED" },
                            { label: "Delivered", done: trackingResult.status === "DELIVERED" },
                          ].map((step, idx) => (
                            <div key={idx} className="space-y-1">
                              <div
                                className={`h-2 rounded-full ${
                                  step.done ? "bg-brand-green-800" : "bg-brand-cream-300"
                                }`}
                              />
                              <span className="text-[10px] font-heading font-bold text-brand-charcoal-700 block">
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PROFILE INFORMATION */}
            {activeTab === "PROFILE" && (
              <div className="p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-black text-brand-green-900">
                    Profile Information
                  </h2>
                  <p className="text-xs text-brand-charcoal-500">
                    Update your personal profile and primary contact phone number.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-brand-cream-300 focus:border-brand-green-700 text-xs outline-none bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                      Email Address (Permanent)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="w-full px-4 py-3 rounded-2xl border border-brand-cream-200 bg-brand-cream-100 text-xs text-brand-charcoal-500 outline-none cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                      Phone Number (10 digits)
                    </label>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full px-4 py-3 rounded-2xl border border-brand-cream-300 focus:border-brand-green-700 text-xs outline-none bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-3 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs uppercase tracking-wider transition disabled:opacity-60"
                  >
                    {savingProfile ? "Saving..." : "Save Profile Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 5: SECURITY & SETTINGS */}
            {activeTab === "SETTINGS" && (
              <div className="space-y-6">
                
                {/* Change Password Card */}
                <div className="p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
                  <div>
                    <h2 className="text-xl font-heading font-black text-brand-green-900">
                      Security & Password
                    </h2>
                    <p className="text-xs text-brand-charcoal-500">
                      Change your password regularly to protect your account.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                    <div className="space-y-1.5">
                      <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-2xl border border-brand-cream-300 focus:border-brand-green-700 text-xs outline-none bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                        New Password (min 6 characters)
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-2xl border border-brand-cream-300 focus:border-brand-green-700 text-xs outline-none bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-2xl border border-brand-cream-300 focus:border-brand-green-700 text-xs outline-none bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="px-6 py-3 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs uppercase tracking-wider transition disabled:opacity-60"
                    >
                      {savingPassword ? "Updating Password..." : "Update Password"}
                    </button>
                  </form>
                </div>

                {/* Session Management & Danger Zone */}
                <div className="p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4">
                  <h3 className="text-base font-heading font-bold text-brand-green-900">
                    Session & Privacy Control
                  </h3>
                  <p className="text-xs text-brand-charcoal-600 leading-relaxed">
                    Signed in as <strong>{user?.email}</strong>. Session authentication is protected with HTTP-only cookies and cryptographically signed JWTs.
                  </p>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 rounded-full border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out of Account</span>
                  </button>
                </div>

              </div>
            )}

          </main>
        </div>

        {/* ORDER DETAILS MODAL */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-brand-cream-300 overflow-hidden max-h-[90vh] flex flex-col">
              
              <div className="p-6 border-b border-brand-cream-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-heading font-bold text-brand-green-800 bg-brand-mint-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    ORDER BREAKDOWN
                  </span>
                  <h3 className="text-xl font-heading font-black text-brand-green-900 mt-1">
                    {selectedOrderDetails.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-2 rounded-full hover:bg-brand-cream-100 text-brand-charcoal-500 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Status and Milestones */}
                <div className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase block">
                      Fulfillment Status
                    </span>
                    <span className="text-sm font-heading font-black text-brand-green-900">
                      {selectedOrderDetails.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-charcoal-500 uppercase block">
                      Payment
                    </span>
                    <span className="text-xs font-bold text-brand-charcoal-800">
                      {selectedOrderDetails.paymentMethod} ({selectedOrderDetails.paymentStatus})
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <h4 className="text-xs font-heading font-bold text-brand-charcoal-700 uppercase tracking-wider">
                    Ordered Products ({selectedOrderDetails.items?.length})
                  </h4>
                  <div className="space-y-2 border-t border-brand-cream-200 pt-2">
                    {selectedOrderDetails.items?.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-brand-cream-100">
                        <div>
                          <span className="font-bold text-brand-charcoal-900 block">{it.title}</span>
                          <span className="text-[11px] text-brand-charcoal-500">{it.variantName} &times; {it.quantity}</span>
                        </div>
                        <span className="font-bold text-brand-green-900">
                          {formatINR(it.total || it.unitPrice * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-brand-charcoal-600">
                    <span>Subtotal</span>
                    <span>{formatINR(selectedOrderDetails.subtotal || selectedOrderDetails.grandTotal)}</span>
                  </div>
                  {selectedOrderDetails.discountTotal > 0 && (
                    <div className="flex justify-between text-brand-green-800 font-bold">
                      <span>Promotional Discount</span>
                      <span>-{formatINR(selectedOrderDetails.discountTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-charcoal-600">
                    <span>Shipping & Handling</span>
                    <span>{selectedOrderDetails.shippingFee === 0 ? "FREE" : formatINR(selectedOrderDetails.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-heading font-black text-brand-green-900 border-t border-brand-cream-300 pt-2 mt-2">
                    <span>Grand Total (INR)</span>
                    <span>{formatINR(selectedOrderDetails.grandTotal)}</span>
                  </div>
                </div>

              </div>

              <div className="p-4 bg-brand-cream-50 border-t border-brand-cream-200 text-right">
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-6 py-2.5 rounded-full bg-brand-green-900 text-brand-cream-100 font-heading font-bold text-xs uppercase"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ADDRESS CREATE/EDIT MODAL */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 bg-brand-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-brand-cream-300 overflow-hidden">
              <div className="p-6 border-b border-brand-cream-200 flex items-center justify-between">
                <h3 className="text-xl font-heading font-black text-brand-green-900">
                  {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
                </h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="p-2 rounded-full hover:bg-brand-cream-100 text-brand-charcoal-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-4 py-2.5 rounded-2xl border border-brand-cream-300 text-xs outline-none bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                    10-Digit Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phoneNumber}
                    onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                    placeholder="98765 43210"
                    className="w-full px-4 py-2.5 rounded-2xl border border-brand-cream-300 text-xs outline-none bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                    Flat / House No. & Street
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    placeholder="e.g. Flat 402, Greenfield Apts, Civil Lines"
                    className="w-full px-4 py-2.5 rounded-2xl border border-brand-cream-300 text-xs outline-none bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder="e.g. Moradabad"
                      className="w-full px-4 py-2.5 rounded-2xl border border-brand-cream-300 text-xs outline-none bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                      PIN Code (6 digits)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      placeholder="244001"
                      className="w-full px-4 py-2.5 rounded-2xl border border-brand-cream-300 text-xs outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="def"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-green-800"
                  />
                  <label htmlFor="def" className="text-xs text-brand-charcoal-700 cursor-pointer">
                    Set as default delivery address
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-5 py-2.5 rounded-full border border-brand-cream-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-brand-green-900 text-brand-cream-100 text-xs font-bold uppercase tracking-wider"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
