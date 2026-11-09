"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Building2,
  Mail,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Globe,
  Share2,
  Bell,
  RefreshCw,
  Server,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [storeName, setStoreName] = useState("ORGANICHY");
  const [tagline, setTagline] = useState("Pure Nutrition for Active Lifestyles");
  const [founderName, setFounderName] = useState("Sourav");
  const [founderLocation, setFounderLocation] = useState("Moradabad, Uttar Pradesh, India");
  const [supportEmail, setSupportEmail] = useState("care@organichy.com");
  const [supportPhone, setSupportPhone] = useState("+91 98765 43210");
  const [whatsappNumber, setWhatsappNumber] = useState("+91 98765 43210");
  const [announcementText, setAnnouncementText] = useState("🌱 FREE All-India Shipping on orders above ₹499 | 100% Pure & Freshly Roasted");
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(true);

  // Socials
  const [instagram, setInstagram] = useState("https://instagram.com/organichy.official");
  const [facebook, setFacebook] = useState("https://facebook.com/organichy");
  const [youtube, setYoutube] = useState("https://youtube.com/@organichy");

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setStoreName(d.storeName || "ORGANICHY");
          setTagline(d.tagline || "");
          setFounderName(d.founderName || "Sourav");
          setFounderLocation(d.founderLocation || "Moradabad, Uttar Pradesh, India");
          setSupportEmail(d.supportEmail || "care@organichy.com");
          setSupportPhone(d.supportPhone || "+91 98765 43210");
          setWhatsappNumber(d.whatsappNumber || "+91 98765 43210");
          setAnnouncementText(d.announcementText || "");
          setIsAnnouncementActive(d.isAnnouncementActive ?? true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          tagline,
          founderName,
          founderLocation,
          supportEmail,
          supportPhone,
          whatsappNumber,
          announcementText,
          isAnnouncementActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", message: "Storefront & brand settings saved successfully." });
      } else {
        setNotification({ type: "error", message: data.error || "Failed to save settings." });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Network error." });
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 text-brand-charcoal-500">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-green-800" />
        <span className="font-heading font-bold text-sm">Loading Store Configuration...</span>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200 mb-2">
            <Settings className="w-3.5 h-3.5 text-brand-green-800" />
            <span>GLOBAL CONFIGURATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 tracking-tight">
            Store &amp; Brand Settings
          </h1>
          <p className="text-xs text-brand-charcoal-600 mt-1">
            Manage contact channels, announcement bar, founder profile and API status.
          </p>
        </div>
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

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* 1. Brand Identity */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          <div className="border-b border-brand-cream-200 pb-4">
            <h2 className="font-heading font-black text-lg text-brand-green-950 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-green-800" />
              <span>Brand Identity &amp; Origin</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Brand / Store Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs font-bold text-brand-green-950 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Brand Tagline</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Founder</label>
              <input
                type="text"
                required
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Headquarters Facility</label>
              <input
                type="text"
                required
                value={founderLocation}
                onChange={(e) => setFounderLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>
          </div>
        </div>

        {/* 2. Customer Contact & Social Channels */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          <div className="border-b border-brand-cream-200 pb-4">
            <h2 className="font-heading font-black text-lg text-brand-green-950 flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-green-800" />
              <span>Contact Channels &amp; Social Links</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Support Email</label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Support Phone</label>
              <input
                type="text"
                required
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">WhatsApp Support</label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2 border-t border-brand-cream-200">
            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Instagram Profile</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Facebook Page</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">YouTube Channel</label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>
          </div>
        </div>

        {/* 3. Announcement Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4">
            <div>
              <h2 className="font-heading font-black text-lg text-brand-green-950 flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-green-800" />
                <span>Storefront Announcement Bar</span>
              </h2>
              <p className="text-xs text-brand-charcoal-500 mt-0.5">
                Top ticker displayed across all website customer pages.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-brand-green-950">
              <input
                type="checkbox"
                checked={isAnnouncementActive}
                onChange={(e) => setIsAnnouncementActive(e.target.checked)}
                className="w-4 h-4 text-brand-green-800 rounded-sm focus:ring-brand-mint-300"
              />
              <span>Active</span>
            </label>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-brand-charcoal-700 block">Announcement Banner Text</label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
            />
          </div>
        </div>

        {/* 4. Statutory & Regulatory */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4">
          <div className="border-b border-brand-cream-200 pb-4">
            <h2 className="font-heading font-black text-lg text-brand-green-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-green-800" />
              <span>Statutory &amp; Food Safety Compliance</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200">
              <span className="font-bold text-brand-charcoal-600 text-[10px] uppercase tracking-wider block">
                FSSAI Central Registration
              </span>
              <span className="font-mono font-bold text-sm text-brand-green-950 block mt-1">
                12726999000123
              </span>
              <span className="text-[10px] text-brand-charcoal-500">
                Authorized Food Business Operator (Moradabad Hub)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200">
              <span className="font-bold text-brand-charcoal-600 text-[10px] uppercase tracking-wider block">
                GSTIN Identification
              </span>
              <span className="font-mono font-bold text-sm text-brand-green-950 block mt-1">
                09AABCO1234F1Z8
              </span>
              <span className="text-[10px] text-brand-charcoal-500">
                Uttar Pradesh Commercial Tax Division
              </span>
            </div>
          </div>
        </div>

        {/* 5. System Health & Infrastructure */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4">
          <div className="border-b border-brand-cream-200 pb-4">
            <h2 className="font-heading font-black text-lg text-brand-green-950 flex items-center gap-2">
              <Server className="w-4 h-4 text-brand-green-800" />
              <span>Connected Infrastructure &amp; APIs</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900 block">PostgreSQL (Prisma)</span>
              <span className="text-[10px] text-emerald-700">Connected &amp; Migrated</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900 block">Cloudinary Media</span>
              <span className="text-[10px] text-emerald-700">Connected</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900 block">Razorpay Payments</span>
              <span className="text-[10px] text-emerald-700">Test / Live Webhooks</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900 block">Delhivery / Logistics</span>
              <span className="text-[10px] text-emerald-700">Active Moradabad Hub</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs tracking-wide shadow-sm disabled:opacity-50 transition"
          >
            {saving ? "Saving Changes..." : "Save All Settings"}
          </button>
        </div>

      </form>

    </div>
  );
}

