import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, CheckCircle, Heart, Quote } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="py-20 bg-brand-cream-100/70 border-b border-brand-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] min-h-[420px] sm:min-h-[480px] rounded-3xl overflow-hidden shadow-elevated border-4 border-brand-cream-200 bg-brand-cream-200">
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop"
                alt="Sourav - Founder of ORGANICHY in Moradabad"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-brand-cream-100">
                <div className="flex items-center gap-1.5 text-brand-mint-300 text-xs font-bold mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Moradabad, Uttar Pradesh, India</span>
                </div>
                <h3 className="font-heading font-black text-2xl text-white">
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
                  Zero hidden hydrogenated palm oil
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200">
              <span>OUR STORY & ROOTS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-900 tracking-tight leading-tight">
              &ldquo;We didn&apos;t build ORGANICHY to sell a product. We built it to fix honest nutrition in India.&rdquo;
            </h2>

            <div className="relative pl-6 border-l-2 border-brand-mint-400 italic text-brand-charcoal-700 text-sm sm:text-base leading-relaxed">
              <Quote className="w-8 h-8 text-brand-mint-300 absolute -top-3 -left-3 -z-10 opacity-60" />
              &ldquo;As a dedicated fitness enthusiast in Moradabad, I was consistently frustrated reading commercial nutrition labels. Supermarket peanut butters were loaded with hydrogenated palm oil, refined syrups, and synthetic emulsifiers. I knew our Indian athletes and health-conscious families deserved pure, honest fuel.&rdquo;
            </div>

            <p className="text-sm text-brand-charcoal-700 leading-relaxed">
              Sourav started by roasting small 5kg batches in Moradabad using handpicked peanuts from Gujarat. Perfecting the slow-roast temperature curve unlocked a naturally sweet, aromatic crunch with zero additives. Today, ORGANICHY proudly dispatches fresh batches across all 28 states and union territories.
            </p>

            <div className="space-y-3 pt-1 text-sm text-brand-charcoal-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-brand-green-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Proudly Homegrown:</strong> Rooted in Moradabad, Uttar Pradesh, championing Indian farm sourcing.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-brand-green-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Batch Traceability:</strong> You can trace every single jar back to its roast batch and lab report.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-brand-green-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Future Vision:</strong> Expanding into clean whey protein, oats, and protein bars with the exact same purity guarantee.
                </span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/our-story"
                className="inline-flex items-center gap-2 text-sm font-heading font-bold text-brand-green-900 hover:text-brand-green-700 transition group"
              >
                <span>Read the Complete Moradabad Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

