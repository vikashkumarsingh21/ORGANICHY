"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ message: string; resetUrl?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process password reset request.");
      }

      setSuccessData(data);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 bg-brand-cream-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
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
            Reset Your Password
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal-500">
            Enter your registered email address and we&apos;ll generate a secure reset link.
          </p>
        </div>

        {/* Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successData ? (
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 rounded-full bg-brand-mint-100 text-brand-green-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-heading font-bold text-brand-green-900">
                  Reset Link Dispatched
                </h3>
                <p className="text-xs text-brand-charcoal-600 leading-relaxed">
                  {successData.message}
                </p>
              </div>

              {/* Developer helper showing the generated token link */}
              {successData.resetUrl && (
                <div className="p-4 rounded-2xl bg-brand-mint-50 border border-brand-mint-200 text-left space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-green-900">
                    <Sparkles className="w-3.5 h-3.5 text-brand-green-800" />
                    <span>Instant Testing Shortcut:</span>
                  </div>
                  <Link
                    href={successData.resetUrl}
                    className="block text-xs font-mono font-bold text-brand-green-800 hover:underline break-all bg-white p-2.5 rounded-xl border border-brand-mint-200"
                  >
                    Click here to open Reset Password Page &rarr;
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="w-full py-3 px-6 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-brand-green-900 hover:bg-brand-green-800 text-brand-cream-100 font-heading font-bold text-xs tracking-wider uppercase transition shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                <span>{loading ? "Generating Link..." : "Send Reset Instructions"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="text-xs font-heading font-bold text-brand-green-800 hover:text-brand-green-900 transition inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

