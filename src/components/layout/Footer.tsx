import Link from "next/link";
import { BRAND, FOOTER_LINKS } from "@/lib/constants";
import { Leaf, MapPin, Mail, Phone, ShieldCheck } from "lucide-react";
import { CmsService } from "@/lib/cmsService";

export default async function Footer() {
  const footerSec = await CmsService.getSectionByKey("footer_content");
  const contactSec = await CmsService.getSectionByKey("contact_information");

  const brandTagline = footerSec?.title || "ORGANICHY Pure Nutrition";
  const brandParagraph =
    footerSec?.content ||
    `Founded by ${BRAND.founder} in ${BRAND.location}. ORGANICHY delivers 100% natural slow-roasted peanut butter made exclusively with high-grade Indian farm peanuts. Zero hydrogenated oil, zero preservatives, uncompromised nutrition.`;
  const copyrightText =
    footerSec?.metadata?.copyrightText ||
    `© ${new Date().getFullYear()} ORGANICHY Nutrition Private Limited. All Rights Reserved.`;

  const supportEmail = contactSec?.metadata?.email || BRAND.supportEmail;
  const supportPhone = contactSec?.metadata?.phone || BRAND.supportPhone;
  const facilityAddress =
    contactSec?.metadata?.address || "Crafted & Dispatched from Moradabad, Uttar Pradesh, India";

  return (
    <footer className="bg-brand-green-900 text-brand-cream-100 pt-16 pb-12 border-t border-brand-green-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-brand-green-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-mint-400 text-brand-green-900 flex items-center justify-center">
                <Leaf className="w-5 h-5 fill-brand-green-900" />
              </div>
              <span className="font-heading font-black text-2xl tracking-wider text-white">
                {brandTagline}
              </span>
            </div>
            <p className="text-xs text-brand-cream-200/80 leading-relaxed max-w-sm">
              {brandParagraph}
            </p>
            <div className="pt-2 space-y-2 text-xs text-brand-cream-200/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-mint-400 shrink-0" />
                <span>{facilityAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-mint-400 shrink-0" />
                <a href={`mailto:${supportEmail}`} className="hover:text-brand-mint-300">
                  {supportEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-mint-400 shrink-0" />
                <span>{supportPhone} (Mon - Sat, 9am - 7pm IST)</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-heading font-bold text-sm text-brand-mint-300 uppercase tracking-wider mb-4">
              Products
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-cream-200/80">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-heading font-bold text-sm text-brand-mint-300 uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-cream-200/80">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Trust */}
          <div>
            <h4 className="font-heading font-bold text-sm text-brand-mint-300 uppercase tracking-wider mb-4">
              Our Promise
            </h4>
            <div className="space-y-3 text-xs text-brand-cream-200/80">
              <div className="p-3 rounded-lg bg-brand-green-800/50 border border-brand-green-700/50 space-y-1">
                <span className="font-semibold text-brand-mint-300 block">🌿 100% Pure Peanuts</span>
                <p className="text-[11px] text-brand-cream-200/70">No fillers, no palm oil, no artificial flavors.</p>
              </div>
              <div className="p-3 rounded-lg bg-brand-green-800/50 border border-brand-green-700/50 space-y-1">
                <span className="font-semibold text-brand-mint-300 block">⚡ High Protein</span>
                <p className="text-[11px] text-brand-cream-200/70">Up to 30g pure plant protein per 100g serving.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-cream-300/60">
          <p>{copyrightText}</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-brand-mint-400" />
              100% Verified Secure Razorpay Gateway
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
