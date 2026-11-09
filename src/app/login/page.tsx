"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to log in. Please check your credentials.");
      }

      // Successful login
      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (type: "customer" | "admin") => {
    if (type === "customer") {
      setEmail("vikram.athlete@gmail.com");
      setPassword("Password@123");
    } else {
      setEmail("admin@organichy.com");
      setPassword("OrganichyAdmin@2026");
    }
    setErrorMessage(null);
  };

  return (
    <div className="py-14 sm:py-20 bg-brand-cream-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-heading font-black text-brand-green-900 tracking-tight"
          >
            <span className="w-8 h-8 rounded-full bg-brand-green-900 text-brand-cream-100 flex items-center justify-center text-xs font-black">
              O
            </span>
            <span>ORGANICHY</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal-500">
            Sign in to access your orders, saved addresses, and athletic rewards.
          </p>
        </div>

        {/* Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-brand-cream-300 focus:border-brand-green-700 focus:ring-2 focus:ring-brand-mint-100 text-xs text-brand-charcoal-900 placeholder:text-brand-charcoal-400 outline-none transition bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-bold text-brand-green-800 hover:text-brand-green-900 underline transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-brand-cream-300 focus:border-brand-green-700 focus:ring-2 focus:ring-brand-mint-100 text-xs text-brand-charcoal-900 placeholder:text-brand-charcoal-400 outline-none transition bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-charcoal-400 hover:text-brand-charcoal-700 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-brand-cream-300 text-brand-green-800 focus:ring-brand-mint-200"
                />
                <span className="text-xs text-brand-charcoal-600 font-medium">Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wider uppercase transition shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for Pair Testing (Development / Staging Only) */}
          {(process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ENABLE_DEMO_CREDENTIALS === "true") && (
            <div className="pt-4 border-t border-brand-cream-200 space-y-2">
              <span className="text-[10px] font-heading font-bold text-brand-charcoal-500 uppercase tracking-widest block text-center">
                Developer &amp; Testing Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill("customer")}
                  className="p-2 text-[11px] rounded-xl bg-brand-mint-50 hover:bg-brand-mint-100 text-brand-green-900 font-bold transition border border-brand-mint-200 text-center"
                >
                  Fill Customer Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill("admin")}
                  className="p-2 text-[11px] rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold transition border border-amber-200 text-center"
                >
                  Fill Admin Demo
                </button>
              </div>
            </div>
          )}

          {/* Separate Admin Portal Link */}
          <div className="text-center pt-2">
            <Link
              href="/admin/login"
              className="text-[11px] font-bold text-brand-charcoal-500 hover:text-brand-green-900 transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-green-800" />
              <span>Are you an administrator? Sign in here</span>
            </Link>
          </div>
        </div>

        {/* Footer Register Link */}
        <div className="text-center">
          <p className="text-xs text-brand-charcoal-600">
            Don&apos;t have an account yet?{" "}
            <Link
              href={`/register${redirectUrl !== "/account" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="font-heading font-bold text-brand-green-900 hover:underline"
            >
              Create Free Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream-50 flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

