import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import { CmsService } from "@/lib/cmsService";
import {
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About ORGANICHY | Pure Nutrition Born in Moradabad, India",
  description:
    "Learn about ORGANICHY and our founder Sourav. Discover our clean nutrition mission: zero palm oil, 100% slow-roasted Indian farm peanuts, and uncompromising quality standards from Moradabad, Uttar Pradesh.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About ORGANICHY | Pure Nutrition Born in Moradabad",
    description: "Founded by Sourav in Moradabad. 100% natural, slow-roasted, high-protein peanut butter.",
    url: `${SITE_URL}/about`,
  },
};

export default async function AboutPage() {
  const section = await CmsService.getSectionByKey("about_content");
  const heroImage = await CmsService.getSectionImageUrl(
    "about_content",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
  );

  const title = section?.title || "Crafted with Transparency in the Heart of Moradabad";
  const subtitle = section?.subtitle || "Clean, honest, high-protein nutrition for India's athletes and health-conscious families.";
  const badgeText = section?.badgeText || "ROOTED IN MORADABAD, UTTAR PRADESH";
  const content =
    section?.content ||
    `Founded by ${BRAND.founder} in ${BRAND.location}, ORGANICHY was born out of frustration with commercial supermarket peanut butters loaded with cheap hydrogenated palm oils, chemical emulsifiers, and hidden sugars. We source single-origin, export-grade peanuts and slow-roast them to perfection in our dedicated Moradabad facility. Every batch is stone-ground, induction sealed, and dispatched fresh.`;
  const facilityLocation = section?.metadata?.facilityLocation || BRAND.location;

  return (
    <div className="py-12 bg-brand-cream-50 min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200">
            <MapPin className="w-3.5 h-3.5 text-brand-green-800" />
            <span>{badgeText}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-brand-green-900 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-base text-brand-charcoal-700 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* Founder & Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center p-8 sm:p-12 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-card">
          <div className="lg:col-span-5 relative aspect-square min-h-[320px] rounded-3xl overflow-hidden shadow-elevated border-4 border-brand-cream-200 bg-brand-cream-200">
            <Image
              src={heroImage}
              alt="Sourav - Founder of ORGANICHY"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-brand-cream-100">
              <span className="text-xs text-brand-mint-400 font-bold block">
                Founder &amp; Head of Quality
              </span>
              <h3 className="font-heading font-black text-xl text-white">
                {BRAND.founder}
              </h3>
              <p className="text-[11px] text-brand-cream-200/80">
                {facilityLocation}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold text-brand-mint-600 uppercase tracking-widest">
              OUR MISSION &amp; VALUES
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-900 tracking-tight">
              Honest Nutrition for Active Lifestyles
            </h2>
            <div className="text-sm text-brand-charcoal-700 leading-relaxed space-y-3">
              <p>{content}</p>
              <p>
                ORGANICHY sources premier runner peanuts directly from Indian farming belts in Saurashtra and Maharashtra. Slow-roasted in small batches in our Moradabad facility, our peanut butter provides authentic plant protein that fuels peak workouts without the digestive sluggishness caused by trans fats.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-brand-cream-200/60 border border-brand-cream-300">
                <span className="font-heading font-black text-lg text-brand-green-900 block">
                  100%
                </span>
                <span className="text-xs text-brand-charcoal-600 font-semibold">
                  Indian Farm Peanuts
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-brand-cream-200/60 border border-brand-cream-300">
                <span className="font-heading font-black text-lg text-brand-green-900 block">
                  0%
                </span>
                <span className="text-xs text-brand-charcoal-600 font-semibold">
                  Added Palm Oil
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Moradabad Facility & Quality Standards */}
        <div id="facility" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-heading font-black text-brand-green-900">
              The Moradabad Production Facility
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal-600">
              Our state-of-the-art facility in {facilityLocation} operates under rigorous hygiene and temperature-controlled standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-mint-100 flex items-center justify-center text-brand-green-900">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-brand-charcoal-900">
                FSSAI &amp; Hygiene Audited
              </h4>
              <p className="text-xs text-brand-charcoal-600 leading-relaxed">
                Cleanroom processing, sterile food-grade equipment, and induction heat sealing to maintain freshness across long-distance transit.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-mint-100 flex items-center justify-center text-brand-green-900">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-brand-charcoal-900">
                Weekly Small-Batch Roasts
              </h4>
              <p className="text-xs text-brand-charcoal-600 leading-relaxed">
                We roast weekly based on incoming demand. Your jar hasn&apos;t sat in warehouse storage for six months like retail brands.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-mint-100 flex items-center justify-center text-brand-green-900">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-brand-charcoal-900">
                Independent NABL Lab Tests
              </h4>
              <p className="text-xs text-brand-charcoal-600 leading-relaxed">
                Every batch is analyzed for pure protein yield (30g/100g), zero aflatoxins, and absolute zero chemical residue.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="p-8 sm:p-10 rounded-3xl bg-brand-green-900 text-brand-cream-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading font-black text-2xl text-white">
              Ready to Taste Honest Indian Nutrition?
            </h3>
            <p className="text-xs text-brand-cream-200/80">
              Order fresh peanut butter dispatched directly from our Moradabad facility.
            </p>
          </div>
          <Link
            href="/shop"
            className="px-8 py-3.5 rounded-full bg-brand-mint-400 hover:bg-brand-mint-300 text-brand-green-950 font-heading font-bold text-xs tracking-wide transition shadow-xs flex items-center gap-2 whitespace-nowrap"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
