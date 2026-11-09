"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify both fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please accept the Terms & Conditions to proceed.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to register account.");
      }

      // Automatically logged in and session cookie set
      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setName("Aarav Sharma");
    setEmail(`aarav.gym${randomSuffix}@gmail.com`);
    setPhone("9876543210");
    setPassword("OrganichyFit@2026");
    setConfirmPassword("OrganichyFit@2026");
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
            Create Customer Account
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal-500">
            Join the ORGANICHY athletic community for 10% off your first batch.
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
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-brand-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-brand-cream-300 focus:border-brand-green-700 focus:ring-2 focus:ring-brand-mint-100 text-xs text-brand-charcoal-900 placeholder:text-brand-charcoal-400 outline-none transition bg-white"
                />
              </div>
            </div>

            {/* Email Address */}
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
                  placeholder="athlete@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-brand-cream-300 focus:border-brand-green-700 focus:ring-2 focus:ring-brand-mint-100 text-xs text-brand-charcoal-900 placeholder:text-brand-charcoal-400 outline-none transition bg-white"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                Mobile Number (India)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-brand-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-brand-cream-300 focus:border-brand-green-700 focus:ring-2 focus:ring-brand-mint-100 text-xs text-brand-charcoal-900 placeholder:text-brand-charcoal-400 outline-none transition bg-white"
                />
              </div>
              <span className="text-[10px] text-brand-charcoal-500 block">
                Used for SMS order tracking and courier delivery updates.
              </span>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-bold text-brand-charcoal-700 block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-brand-cream-300 focus:border-brand-green-700 focus:ring-2 focus:ring-brand-mint-100 text-xs text-brand-charcoal-900 placeholder:text-brand-charcoal-400 outline-none transition bg-white"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-brand-cream-300 text-brand-green-800 focus:ring-brand-mint-200"
              />
              <label htmlFor="agree" className="text-xs text-brand-charcoal-600 leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link href="/terms-and-conditions" className="font-bold text-brand-green-800 hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="font-bold text-brand-green-800 hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wider uppercase transition shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              <span>{loading ? "Creating Account..." : "Register & Start Shopping"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-xs text-brand-green-800 hover:text-brand-green-900 font-bold underline transition"
            >
              ✨ Auto-Fill Sample Customer Details
            </button>
          </div>

        </div>

        {/* Footer Login Link */}
        <div className="text-center">
          <p className="text-xs text-brand-charcoal-600">
            Already have an account?{" "}
            <Link
              href={`/login${redirectUrl !== "/account" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="font-heading font-bold text-brand-green-900 hover:underline"
            >
              Sign In Instead
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream-50 flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

