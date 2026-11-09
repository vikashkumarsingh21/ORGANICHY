"use client";

import { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
  };

  return (
    <section className="py-16 bg-brand-green-900 text-brand-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green-800 text-brand-mint-300 text-xs font-semibold tracking-wider uppercase border border-brand-green-700">
          <span>JOIN THE ORGANICHY CLUB</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">
          Get 10% Off Your First Batch
        </h2>

        <p className="text-sm text-brand-cream-200/80 max-w-xl mx-auto">
          Subscribe for fresh roast notifications, exclusive athlete discounts, and clean nutrition insights straight from Sourav and our Moradabad facility.
        </p>

        {subscribed ? (
          <div className="p-4 rounded-xl bg-brand-green-800 border border-brand-mint-400/30 text-brand-mint-300 text-sm font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
            <Check className="w-5 h-5 text-brand-mint-400" />
            <span>Welcome! Use code <strong>ORGANICHY10</strong> at checkout for 10% OFF.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <div className="relative w-full">
              <Mail className="w-5 h-5 text-brand-charcoal-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white text-brand-charcoal-900 placeholder:text-brand-charcoal-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mint-400 shadow-card"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-brand-mint-400 hover:bg-brand-mint-300 text-brand-green-900 font-heading font-bold text-sm tracking-wide transition shadow-card whitespace-nowrap flex items-center justify-center gap-2"
            >
              <span>Claim 10% Off</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

