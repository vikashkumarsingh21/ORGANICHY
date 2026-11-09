import { ShieldCheck, Zap, Heart, Truck, Sparkles, Award } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function WhyChooseOrganichy() {
  const reasons = [
    {
      icon: Sparkles,
      title: "100% Indian Farm Peanuts",
      desc: "Sourced directly from premier non-GMO peanut farms in Saurashtra and Maharashtra. Clean, golden kernels with natural oils intact.",
      badge: "Pure Sourcing",
    },
    {
      icon: Zap,
      title: "30g Pure Plant Protein",
      desc: "Up to 30.2g protein per 100g. Complete natural amino acid profile for muscle recovery, strength training, and daily health.",
      badge: "High Yield",
    },
    {
      icon: ShieldCheck,
      title: "Zero Palm Oil & Hydrogenated Fats",
      desc: "Commercial brands add up to 15% palm oil to prevent oil separation. ORGANICHY never adds palm oil, trans fats, or stabilizers.",
      badge: "Clean Label",
    },
    {
      icon: Award,
      title: "Slow-Roasted in Moradabad",
      desc: "Slow golden roasting in small, monitored batches in Moradabad, UP. Preserves delicate micronutrients and brings out deep roasted flavor.",
      badge: "Crafted in UP",
    },
    {
      icon: Heart,
      title: "Zero Chemical Preservatives",
      desc: "Just 100% roasted peanuts and pure natural ingredients. No artificial food colors, synthetic flavoring, or high-fructose syrups.",
      badge: "100% Wholesome",
    },
    {
      icon: Truck,
      title: "Direct-to-Consumer Freshness",
      desc: "Skip months of sitting on supermarket shelves. Jars are ground, packed, and dispatched directly to your doorstep in 3 to 5 business days.",
      badge: "Fast Pan-India",
    },
  ];

  return (
    <section className="py-20 bg-brand-cream-50 border-b border-brand-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="THE ORGANICHY ADVANTAGE"
          title="Why India's Fitness Community Chooses Us"
          subtitle="We didn't cut corners to boost shelf-life. We crafted the cleanest, most delicious peanut butter your body deserves."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-7 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 hover:border-brand-mint-400 shadow-subtle hover:shadow-card transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-green-900 text-brand-mint-300 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-heading font-bold text-brand-green-800 bg-brand-mint-100 px-2.5 py-1 rounded-full border border-brand-mint-200">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-brand-charcoal-900 group-hover:text-brand-green-900 transition">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-charcoal-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-brand-cream-200/60 flex items-center gap-1.5 text-[11px] font-bold text-brand-green-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green-700" />
                  <span>Quality Assured Batch</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

