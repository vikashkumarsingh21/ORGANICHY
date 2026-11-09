import { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import { Truck, MapPin, ShieldCheck, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Pan-India Logistics | ORGANICHY",
  description: "Read ORGANICHY shipping rates, free delivery thresholds above ₹499, dispatch SLA from Moradabad, and third-party courier transit estimates across India.",
  alternates: {
    canonical: `${SITE_URL}/shipping-policy`,
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="py-12 bg-brand-cream-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="border-b border-brand-cream-300 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200">
            <Truck className="w-3.5 h-3.5 text-brand-green-800" />
            <span>DISPATCH & DELIVERY STANDARDS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-900 tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-brand-charcoal-500">
            Dispatched fresh from Moradabad, Uttar Pradesh to all 28 Indian States & 8 Union Territories
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-8 text-xs sm:text-sm text-brand-charcoal-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              1. Roasting & Dispatch Timeline
            </h2>
            <p>
              To ensure peak freshness and nutritional vitality, ORGANICHY roasts peanut butter in monitored weekly batches. Orders placed before 1:00 PM IST (Monday through Saturday) are typically packed and dispatched from our <strong>Moradabad facility</strong> within <strong>24 to 48 hours</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              2. Shipping Charges & Free Delivery Threshold
            </h2>
            <div className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span>Orders above ₹{BRAND.policies.freeShippingThreshold}:</span>
                <strong className="text-brand-green-800 font-bold">FREE Pan-India Delivery</strong>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Orders below ₹{BRAND.policies.freeShippingThreshold}:</span>
                <span className="font-semibold">₹{BRAND.policies.standardShippingFee} flat shipping fee</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Cash on Delivery (COD) Handling Surcharge:</span>
                <span className="font-semibold">₹{BRAND.policies.codFee} courier partner fee</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              3. Estimated Delivery Transit Times
            </h2>
            <p>
              Once your parcel leaves our Moradabad facility, estimated delivery times vary by destination zone:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Delhi-NCR & Western Uttar Pradesh:</strong> 24 to 48 hours (estimated).</li>
              <li><strong>Tier-1 Metro Cities (Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune):</strong> 3 to 4 business days (estimated).</li>
              <li><strong>Rest of India (Tier-2/3 Cities & Rural Districts):</strong> 4 to 6 business days (estimated).</li>
              <li><strong>North-East India, Jammu & Kashmir, Island Territories:</strong> 5 to 7 business days (estimated).</li>
            </ul>
            <p className="text-[11px] text-brand-charcoal-500 italic pt-1">
              * Non-guaranteed notice: Delivery timelines are estimates calculated by our logistics partners and may occasionally vary due to weather conditions, transit hub backlogs, festivals, or local government restrictions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              4. Shock-Absorbent Secure Packaging
            </h2>
            <p>
              Nutritional jars require extra transit protection. Every ORGANICHY jar is:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hermetically induction sealed to prevent any natural peanut oil leakage during transport.</li>
              <li>Enclosed in customized, recyclable shock-cushioned outer boxes designed to withstand rough road conditions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              5. Order Tracking Updates
            </h2>
            <p>
              As soon as your package is scanned by our courier partner (Delhivery / India Post), you will receive an SMS and WhatsApp message containing your live AWB Tracking Number. You can also monitor real-time shipment status on our <a href="/order-tracking" className="text-brand-green-900 font-bold underline">Order Tracking Page</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-base text-brand-green-900">
              6. Damaged or Tampered Shipments
            </h2>
            <p>
              If your package arrives with an opened seal or visibly damaged box, please take a photo/video and notify our Moradabad support team via WhatsApp within 48 hours. We will initiate an immediate replacement at zero cost to you.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}

