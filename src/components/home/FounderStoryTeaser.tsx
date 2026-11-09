import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants";
import { ArrowRight, Quote, Heart, MapPin, CheckCircle2 } from "lucide-react";

export default function FounderStoryTeaser() {
  return (
    <section className="py-20 bg-brand-cream-100/50 border-y border-brand-cream-300/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] min-h-[420px] sm:min-h-[480px] rounded-3xl overflow-hidden shadow-elevated border-4 border-brand-cream-200 bg-brand-cream-200">
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop"
                alt="Sourav - Founder of ORGANICHY in Moradabad"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-brand-cream-100">
                <div className="flex items-center gap-2 text-brand-mint-400 text-xs font-bold mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Moradabad, Uttar Pradesh</span>
                </div>
                <h3 className="font-heading font-black text-xl text-white">
                  Sourav
                </h3>
                <p className="text-xs text-brand-cream-200/90">
                  Founder & Head of Quality, ORGANICHY
                </p>
              </div>
            </div>

            {/* Overlapping Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -right-5 bg-brand-cream-50 p-4 rounded-2xl shadow-card border border-brand-cream-300 items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-green-900 text-brand-mint-300 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-brand-mint-400 text-brand-mint-400" />
              </div>
              <div>
                <span className="font-heading font-bold text-xs text-brand-green-900 block">
                  100% Honest Nutrition
                </span>
                <span className="text-[10px] text-brand-charcoal-500">
                  Zero hidden hydrogenated oils
                </span>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide">
              <span>OUR STORY & ROOTS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-900 tracking-tight leading-tight">
              "We didn't just want another peanut butter. We wanted honest nutrition for our people."
            </h2>

            <div className="relative pl-6 border-l-2 border-brand-mint-400 italic text-brand-charcoal-700 text-sm sm:text-base leading-relaxed">
              <Quote className="w-8 h-8 text-brand-mint-300 absolute -top-3 -left-3 -z-10 opacity-60" />
              "As a fitness enthusiast in Moradabad, I was tired of reading commercial nutrition labels filled with hydrogenated palm oil, refined sugar syrups, and chemical preservatives. ORGANICHY was born to bring 100% natural, farm-fresh roasted peanut butter back to active Indians who care about their body."
            </div>

            <div className="space-y-3 pt-2 text-sm text-brand-charcoal-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-brand-green-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Sourcing:</strong> Sourced directly from premier peanut farms across Gujarat and Maharashtra.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-brand-green-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Batch-Controlled Roasting:</strong> Slow-roasted in small batches to preserve natural micronutrients and antioxidants.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-brand-green-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Moradabad Facility:</strong> State-of-the-art hygiene standards with lab testing for pure protein yield.
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/our-story"
                className="inline-flex items-center gap-2 text-sm font-heading font-bold text-brand-green-900 hover:text-brand-green-700 transition group"
              >
                <span>Read the Complete ORGANICHY Journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

