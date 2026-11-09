"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === "unauthorized_role"
      ? "Access Denied: Your account does not have administrator privileges."
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Administrative authentication failed.");
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail("admin@organichy.com");
    setPassword("OrganichyAdmin@2026");
    setErrorMessage(null);
  };

  return (
    <div className="py-14 sm:py-20 bg-brand-charcoal-900 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green-950 border border-brand-green-800 text-brand-mint-300 text-[11px] font-heading font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>ORGANICHY HQ • MORADABAD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Administrator Console
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal-400">
            Secure backend login for inventory, media, orders, and CMS management.
          </p>
        </div>

        {/* Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-brand-charcoal-800 border border-brand-charcoal-700 shadow-2xl space-y-6">
          
          <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span className="leading-relaxed">
              Administrative Access Only. All administrative actions and logins are logged into immutable audit records.
            </span>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold text-brand-charcoal-300 block">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-charcoal-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@organichy.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-brand-charcoal-600 bg-brand-charcoal-900 focus:border-brand-mint-400 focus:ring-2 focus:ring-brand-mint-900/50 text-xs text-white placeholder:text-brand-charcoal-500 outline-none transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold text-brand-charcoal-300 block">
                Administrative Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-charcoal-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-brand-charcoal-600 bg-brand-charcoal-900 focus:border-brand-mint-400 focus:ring-2 focus:ring-brand-mint-900/50 text-xs text-white placeholder:text-brand-charcoal-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-charcoal-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-brand-green-600 hover:bg-brand-green-500 text-white font-heading font-bold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? "Authenticating..." : "Enter Admin Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill (Development / Staging Only) */}
          {(process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ENABLE_DEMO_CREDENTIALS === "true") && (
            <div className="pt-3 border-t border-brand-charcoal-700 text-center">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-xs text-brand-mint-400 hover:text-brand-mint-300 font-bold underline transition"
              >
                Fill Founder Credentials (Sourav)
              </button>
            </div>
          )}

          <div className="text-center pt-1">
            <Link
              href="/login"
              className="text-xs text-brand-charcoal-400 hover:text-white transition"
            >
              Are you a customer? Go to Customer Login &rarr;
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-charcoal-900 flex items-center justify-center text-white">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}

