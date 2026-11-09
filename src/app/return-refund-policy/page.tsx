import { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import { RefreshCw, ShieldCheck, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Return & Refund Policy | FSSAI Compliance | ORGANICHY",
  description: "Review ORGANICHY return, replacement and refund rules for peanut butter and food nutrition products, transit damages, and refund processing timelines.",
  alternates: {
    canonical: `${SITE_URL}/return-refund-policy`,
  },
};

export default function ReturnRefundPolicyPage() {
  return (
    <div className="py-12 bg-brand-cream-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="border-b border-brand-cream-300 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200">
            <RefreshCw className="w-3.5 h-3.5 text-brand-green-800" />
            <span>CUSTOMER SATISFACTION GUARANTEE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-900 tracking-tight">
            Return & Refund Policy
          </h1>
          <p className="text-xs text-brand-charcoal-500">
            Fair, transparent guidelines for food & nutrition safety in India
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-8 text-xs sm:text-sm text-brand-charcoal-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              1. Food Safety & Return Eligibility
            </h2>
            <p>
              Due to strict Indian food safety regulations (FSSAI) and hygiene standards, edible nutrition items (such as peanut butter jars) <strong>cannot be returned once the protective induction seal has been opened or consumed</strong>, unless there is a verified quality defect or transit damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              2. Free 7-Day Replacement Policy
            </h2>
            <p>
              We provide a <strong>100% Free Replacement</strong> under the following conditions within <strong>7 days of delivery</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The jar arrived broken, cracked, or leaking during courier transit.</li>
              <li>The inner protective induction seal was tampered with upon initial unboxing.</li>
              <li>You received an incorrect variant, weight, or flavor compared to your order confirmation.</li>
              <li>There is a verified manufacturing defect or seal irregularity.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              3. How to Request a Replacement
            </h2>
            <p>
              Our process is simple and hassle-free:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Take a clear photo or short unboxing video showing the damaged jar and outer shipping label.</li>
              <li>Send the media along with your Order Number (e.g. <code>ORG-202611-XXXX</code>) to our WhatsApp support line at <strong>{BRAND.supportPhone}</strong> or email <strong>{BRAND.supportEmail}</strong>.</li>
              <li>Our Moradabad quality team will verify your claim within 12 hours and dispatch a brand new fresh replacement jar with priority tracking at zero cost.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              4. Refund Policy & Timelines
            </h2>
            <p>
              If an order is cancelled prior to courier dispatch from our Moradabad facility, or if a replacement cannot be fulfilled due to stock shortages, an immediate full refund will be processed:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Prepaid Orders (UPI, Cards, NetBanking via Razorpay):</strong> Refunded directly to your original bank account or card within 3 to 5 business days.</li>
              <li><strong>Cash on Delivery (COD) Orders:</strong> If an approved refund is required for a COD purchase, funds are transferred via secure UPI or direct NEFT bank transfer upon receiving your verified bank details.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              5. Natural Oil Separation is NOT a Defect
            </h2>
            <p>
              Please note: <strong>Natural peanut oil floating on top of the jar is not a defect or spoilage</strong>. Because ORGANICHY does not add chemical emulsifiers or hydrogenated palm oil, natural nut oils separate. A quick stir with a spoon will restore the rich, creamy texture.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}

