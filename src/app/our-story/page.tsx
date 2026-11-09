import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import { CmsService } from "@/lib/cmsService";
import {
  Quote,
  Heart,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Story | The ORGANICHY Journey from Moradabad to Pan-India",
  description:
    "Discover how founder Sourav started ORGANICHY in Moradabad to eliminate palm oil and artificial additives from Indian peanut butter. Pure, honest nutrition for athletes.",
  alternates: {
    canonical: `${SITE_URL}/our-story`,
  },
  openGraph: {
    title: "Our Story | The ORGANICHY Journey",
    description: "From a 5kg home roaster in Moradabad to delivering clean, slow-roasted nutrition across India.",
    url: `${SITE_URL}/our-story`,
  },
};

export default async function OurStoryPage() {
  const section = await CmsService.getSectionByKey("our_story_content");
  const storyImage = await CmsService.getSectionImageUrl(
    "our_story_content",
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop"
  );

  const title = section?.title || "Our Story & Moradabad Roots";
  const subtitle =
    section?.subtitle ||
    "How a fitness lover in Moradabad, Uttar Pradesh set out to challenge commercial shortcuts and build India's cleanest nutrition brand.";
  const badgeText = section?.badgeText || "THE FOUNDER'S JOURNEY";
  const content =
    section?.content ||
    "Founder Sourav was training heavily in Moradabad, UP. Looking for clean plant protein, he flipped over common supermarket peanut butter jars to discover they were 15% hydrogenated palm oil and loaded with sugar. He refused to consume fillers and began roasting raw Gujarati peanuts in small 5kg batches at home. Today, ORGANICHY operates a dedicated roasting facility in Moradabad, delivering clean nutrition across all Indian states.";
  const quote =
    section?.metadata?.quote ||
    "If I wouldn't put it in my own body before a heavy squat session, I will never put it in an ORGANICHY jar. That is my promise to every athlete in India.";

  const milestones = section?.metadata?.milestones || [
    {
      year: "The Spark",
      title: "Frustration in the Gym",
      desc: "Founder Sourav was training heavily in Moradabad, UP. Looking for clean plant protein, he flipped over common supermarket peanut butter jars to discover they were 15% hydrogenated palm oil and loaded with sugar. He refused to consume fillers.",
    },
    {
      year: "The First Batch",
      title: "Slow Roasting in Moradabad",
      desc: "Sourav began roasting raw Gujarati peanuts in small 5kg batches at home. By controlling drum roast temperature and stone-grinding, he unlocked an intensely aromatic, naturally sweet spread with zero additives.",
    },
    {
      year: "The Community",
      title: "Local Athletes Take Notice",
      desc: "Local lifters and gym owners in Moradabad and Western UP tried the batch and immediately asked to buy regular jars. Clean energy with zero post-workout bloat became an instant community hit.",
    },
    {
      year: "The Vision",
      title: "ORGANICHY Goes Pan-India",
      desc: "ORGANICHY established a dedicated roasting and hygienic production facility in Moradabad, partnering with India's leading courier networks to deliver fresh batches straight to athletes across all 28 Indian states.",
    },
  ];

  return (
    <div className="py-12 bg-brand-cream-50 min-h-screen space-y-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Story Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200">
            <Heart className="w-3.5 h-3.5 text-brand-green-800 fill-brand-mint-400" />
            <span>{badgeText}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-brand-green-900 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-base text-brand-charcoal-600 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Founder Quote Spotlight */}
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-green-950 via-brand-green-900 to-brand-green-950 text-brand-cream-100 border-2 border-brand-green-700 shadow-elevated space-y-6">
          <Quote className="w-12 h-12 text-brand-mint-400 opacity-70" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black text-white leading-snug">
            &ldquo;{quote}&rdquo;
          </h2>
          <div className="flex items-center gap-4 pt-4 border-t border-brand-green-800">
            <div className="w-12 h-12 rounded-full bg-brand-green-800 text-brand-mint-300 border border-brand-mint-400/40 flex items-center justify-center font-heading font-black text-lg">
              S
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">
                {BRAND.founder}
              </h4>
              <p className="text-xs text-brand-mint-300/80">
                Founder of ORGANICHY • {BRAND.location}
              </p>
            </div>
          </div>
        </div>

        {/* Story Photography */}
        {storyImage && (
          <div className="relative aspect-video min-h-[360px] rounded-3xl overflow-hidden shadow-card border-4 border-brand-cream-200 bg-brand-cream-200">
            <Image src={storyImage} alt="ORGANICHY Story" fill className="object-cover" />
          </div>
        )}

        {/* Narrative Chapters */}
        <div className="space-y-8 text-sm sm:text-base text-brand-charcoal-700 leading-relaxed bg-brand-cream-100/90 p-8 sm:p-10 rounded-3xl border border-brand-cream-300 shadow-card">
          <p>{content}</p>
          <p>
            When natural peanut oil separates from peanuts, that is nature&apos;s proof that there are <strong>zero artificial emulsifiers</strong>. Commercial brands fear this natural separation, so they add palm oil to keep it permanently emulsified. Sourav chose the harder, honest path: educate Indian athletes on the reality of nutrition.
          </p>
        </div>

        {/* Timeline Milestones */}
        <div className="space-y-8">
          <h3 className="font-heading font-black text-2xl text-brand-green-900 text-center">
            Key Milestones in the Journey
          </h3>

          <div className="space-y-6">
            {milestones.map((m: any, idx: number) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-xs flex flex-col sm:flex-row gap-4 items-start hover:border-brand-mint-400 transition"
              >
                <div className="px-3.5 py-1.5 rounded-full bg-brand-green-900 text-brand-mint-300 font-bold text-xs shrink-0 border border-brand-green-700">
                  {m.year}
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-base text-brand-green-900">
                    {m.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-brand-charcoal-600 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-brand-green-900 text-brand-cream-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading font-black text-2xl text-white">
              Taste the Moradabad Roast
            </h3>
            <p className="text-xs text-brand-cream-200/80">
              100% natural, slow-roasted peanut butter with zero palm oil.
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
