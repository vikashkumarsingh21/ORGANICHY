import { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | ORGANICHY Legal & Data Protection",
  description: "Learn how ORGANICHY collects, processes, and protects your personal data in accordance with Indian IT & DPDP compliance guidelines.",
  alternates: {
    canonical: `${SITE_URL}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 bg-brand-cream-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="border-b border-brand-cream-300 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green-800" />
            <span>LEGAL & DATA PRIVACY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-brand-charcoal-500">
            Last Updated: November 2026 • Compliant with Indian Information Technology & DPDP Act guidelines
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-8 text-xs sm:text-sm text-brand-charcoal-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              1. Overview & Commitment
            </h2>
            <p>
              At <strong>ORGANICHY</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), founded by Sourav and operating from Moradabad, Uttar Pradesh, India, we are committed to safeguarding your personal data and ensuring transparent privacy practices. This policy outlines how we collect, process, and protect your information when you visit organichy.com or purchase our nutrition products.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Personal Identifiers:</strong> Name, delivery address, email address, and mobile phone number for order processing and courier delivery.</li>
              <li><strong>Payment Information:</strong> All payment transactions are processed through PCI-DSS Level 1 compliant gateway partners (such as Razorpay). We never view, collect, or store your credit/debit card numbers or bank credentials on our servers.</li>
              <li><strong>Technical Data:</strong> IP address, device type, browser metadata, and cookies used solely to maintain your shopping cart and analyze website performance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              3. Purpose of Processing
            </h2>
            <p>Your data is used strictly for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dispatching and delivering freshly roasted peanut butter batches to your address.</li>
              <li>Sending automated order confirmations, AWB tracking updates via SMS and WhatsApp.</li>
              <li>Providing dedicated customer support regarding products or nutritional inquiries.</li>
              <li>Sending opt-in newsletter discounts (you can unsubscribe anytime with one click).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              4. Data Sharing & Third Parties
            </h2>
            <p>
              We <strong>never sell, rent, or trade</strong> your personal information to third-party data brokers or marketing agencies. We only share necessary delivery details with trusted operational partners:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Courier Logistics Partners (e.g. Delhivery, India Post, Shiprocket) for physical package delivery.</li>
              <li>Payment Gateway Partners (Razorpay) for encrypted transaction validation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              5. Data Security
            </h2>
            <p>
              We implement industry-standard 256-bit SSL encryption, database firewalls, and restricted administrative credentials to protect all collected information against unauthorized access, loss, or alteration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              6. Grievance Officer & Contact
            </h2>
            <p>
              For any questions, data access requests, or privacy concerns, please contact our dedicated Data Officer:
            </p>
            <div className="p-4 rounded-xl bg-brand-cream-50 border border-brand-cream-200 text-xs">
              <p><strong>Grievance Officer:</strong> Sourav</p>
              <p><strong>Address:</strong> Moradabad, Uttar Pradesh, India</p>
              <p><strong>Email:</strong> <a href={`mailto:${BRAND.supportEmail}`} className="text-brand-green-800 underline">{BRAND.supportEmail}</a></p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

