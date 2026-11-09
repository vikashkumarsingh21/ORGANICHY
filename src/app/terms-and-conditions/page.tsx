import { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Legal Service Agreement | ORGANICHY",
  description: "Terms and conditions governing the use of organichy.com, ordering nutrition products, payment security, user obligations, and Moradabad jurisdiction.",
  alternates: {
    canonical: `${SITE_URL}/terms-and-conditions`,
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="py-12 bg-brand-cream-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="border-b border-brand-cream-300 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green-800" />
            <span>TERMS OF SERVICE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-brand-charcoal-500">
            Governing the use of organichy.com and purchases across India
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-8 text-xs sm:text-sm text-brand-charcoal-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              1. Introduction & Acceptance
            </h2>
            <p>
              Welcome to <strong>organichy.com</strong>. This website is owned and operated by <strong>ORGANICHY</strong>, founded by Sourav and based in Moradabad, Uttar Pradesh, India. By accessing our platform, registering an account, or placing an order, you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              2. Products & Nutritional Claims
            </h2>
            <p>
              We strive to display our peanut butter and nutrition products as accurately as possible. All nutritional facts (such as protein yield, fiber, and calories) are derived from certified NABL-accredited laboratory test reports. However, naturally sourced agricultural products may exhibit slight variations in roasted color, natural oil texture, and crunch density depending on seasonal harvests.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              3. Food Allergy Warning
            </h2>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <strong className="block font-bold">ALLERGEN ADVISORY:</strong>
              <p>
                All products manufactured by ORGANICHY contain <strong>peanuts</strong> and are produced in a facility that processes nuts. If you have a diagnosed peanut or tree nut allergy, do not consume these products.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              4. Pricing, Taxes & Razorpay Payments
            </h2>
            <p>
              All prices displayed on organichy.com are in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST). We reserve the right to revise prices or cancel orders in the event of clear typographical errors. Payments are securely processed through Razorpay; we do not store customer financial credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              5. Intellectual Property
            </h2>
            <p>
              All brand marks, logos, packaging graphics, website photography, copy, and code are the exclusive intellectual property of ORGANICHY and Sourav. Unauthorized reproduction or commercial use is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              6. Governing Law & Jurisdiction
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to these terms or transactions on this website shall be subject to the exclusive jurisdiction of the competent courts in <strong>Moradabad, Uttar Pradesh, India</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              7. Customer Care Contact
            </h2>
            <p>
              For grievances, legal notices, or customer assistance, reach us at:
            </p>
            <div className="p-4 rounded-xl bg-brand-cream-50 border border-brand-cream-200 text-xs">
              <p><strong>Brand:</strong> ORGANICHY (Founder: Sourav)</p>
              <p><strong>Location:</strong> Moradabad, Uttar Pradesh, India</p>
              <p><strong>Email:</strong> {BRAND.supportEmail}</p>
              <p><strong>WhatsApp Support:</strong> {BRAND.supportPhone}</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}

