import { Check, X, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function NutritionComparison() {
  const comparisonData = [
    {
      feature: "Core Ingredients",
      organichy: "100% Indian Farm Roasted Peanuts Only",
      commercial: "Peanuts, Palm Oil, Sugar, Emulsifiers, Preservatives",
      highlight: true,
    },
    {
      feature: "Pure Protein per 100g",
      organichy: "30g Pure Muscle-Building Protein",
      commercial: "18g - 23g (Diluted with fillers)",
      highlight: true,
    },
    {
      feature: "Hydrogenated Palm Oil",
      organichy: "0% ZERO (Pure Natural Peanut Oil Only)",
      commercial: "Up to 15% added to prevent oil separation",
      highlight: true,
    },
    {
      feature: "Added Refined Sugar",
      organichy: "0g in Classic & Natural variants",
      commercial: "6g - 14g high fructose / refined sugars",
      highlight: false,
    },
    {
      feature: "Production & Freshness",
      organichy: "Crafted in weekly batches in Moradabad",
      commercial: "6-12 months old sitting in warehouses",
      highlight: false,
    },
    {
      feature: "Digestibility for Fitness",
      organichy: "Light on stomach, rich in dietary fiber",
      commercial: "Heavy, sluggish digestion from palm oils",
      highlight: false,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="THE ORGANICHY STANDARD"
          title="See The Difference Before You Buy"
          subtitle="Flip the jar and look at the ingredient list. Here is how ORGANICHY compares to standard supermarket peanut butters."
        />

        <div className="mt-10 overflow-hidden rounded-2xl border border-brand-cream-300 shadow-card bg-brand-cream-50/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-cream-300">
                  <th className="p-4 sm:p-5 text-xs font-heading font-bold text-brand-charcoal-500 uppercase tracking-wider w-1/3">
                    Nutrition & Quality Factors
                  </th>
                  <th className="p-4 sm:p-5 text-sm sm:text-base font-heading font-black text-brand-green-900 bg-brand-mint-100/70 border-x border-brand-mint-200 w-1/3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-brand-green-800" />
                      <span>ORGANICHY</span>
                    </div>
                  </th>
                  <th className="p-4 sm:p-5 text-xs sm:text-sm font-heading font-bold text-brand-charcoal-600 w-1/3">
                    Standard Commercial Brands
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-300/70 text-xs sm:text-sm">
                {comparisonData.map((row) => (
                  <tr
                    key={row.feature}
                    className="hover:bg-white/80 transition-colors"
                  >
                    <td className="p-4 sm:p-5 font-semibold text-brand-charcoal-900">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 bg-brand-mint-50/50 border-x border-brand-mint-200/80 font-bold text-brand-green-900">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-brand-green-700 shrink-0 mt-0.5" />
                        <span>{row.organichy}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-brand-charcoal-600">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{row.commercial}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

