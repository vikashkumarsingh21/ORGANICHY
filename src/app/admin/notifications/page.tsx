"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  CreditCard,
  Truck,
  Sparkles,
  Send,
  Plus,
  RefreshCw,
  ExternalLink,
  Check,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("BROADCAST");
  const [linkUrl, setLinkUrl] = useState("/shop");
  const [broadcasting, setBroadcasting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      fetchNotifications();
    } catch (e) {}
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcasting(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, type, linkUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage("Announcement broadcasted successfully to all customer dashboards.");
        setTitle("");
        setMessage("");
        fetchNotifications();
      }
    } catch (e) {
      setStatusMessage("Failed to send broadcast.");
    } finally {
      setBroadcasting(false);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200 mb-2">
            <Bell className="w-3.5 h-3.5 text-brand-green-800" />
            <span>DISPATCH &amp; ALERTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs text-brand-charcoal-600 mt-1">
            System operational alerts, stock depletion warnings and broadcast announcements.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2.5 rounded-2xl bg-brand-cream-100 border border-brand-cream-300 hover:bg-brand-cream-200 text-brand-green-950 font-heading font-bold text-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Check className="w-4 h-4 text-brand-green-700" />
          <span>Mark All Read</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Active Alerts Stream */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4">
          <div className="border-b border-brand-cream-200 pb-3">
            <h2 className="font-heading font-black text-base text-brand-green-950">
              System &amp; Order Alerts
            </h2>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                  notif.isRead
                    ? "bg-brand-cream-50/50 border-brand-cream-200 text-brand-charcoal-700"
                    : "bg-brand-mint-50/50 border-brand-mint-200 text-brand-green-950 font-medium"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-cream-200 text-brand-charcoal-700 uppercase">
                      {notif.type}
                    </span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-green-700" />
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-xs text-brand-green-950">
                    {notif.title}
                  </h3>
                  <p className="text-[11px] text-brand-charcoal-600">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-brand-charcoal-400 block pt-1">
                    {new Date(notif.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {notif.linkUrl && (
                  <Link
                    href={notif.linkUrl}
                    className="p-2 rounded-xl hover:bg-white text-brand-green-800 transition shrink-0"
                    title="Open Resource"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Broadcast Announcement Composer */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          <div className="border-b border-brand-cream-200 pb-3">
            <h2 className="font-heading font-black text-base text-brand-green-950 flex items-center gap-2">
              <Send className="w-4 h-4 text-brand-green-800" />
              <span>Broadcast Announcement</span>
            </h2>
            <p className="text-xs text-brand-charcoal-500 mt-0.5">
              Send notifications to customer dashboards &amp; banners.
            </p>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Announcement Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Fresh Batch Roasted Today!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Message Content *</label>
              <textarea
                rows={3}
                required
                placeholder="Write update for customer accounts..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Action Link (Optional)</label>
              <input
                type="text"
                placeholder="/shop or /product/all-natural-creamy-peanut-butter"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-xs font-mono text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>

            <button
              type="submit"
              disabled={broadcasting}
              className="w-full py-3 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs tracking-wide shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{broadcasting ? "Broadcasting..." : "Broadcast to Customers"}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

