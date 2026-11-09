import { Check, X, ShieldCheck, Zap, Heart, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function NutritionSection() {
  const macroBreakdown = [
    {
      metric: "30.2g",
      name: "Plant-Based Protein",
      desc: "Rich in branched-chain amino acids (BCAAs) and Arginine to stimulate muscle protein synthesis and support post-workout repair.",
      icon: Zap,
    },
    {
      metric: "48.6g",
      name: "Good Heart-Healthy Fats",
      desc: "Purely monounsaturated and polyunsaturated fats from naturally roasted peanuts. Zero trans fat. Zero hydrogenated oils.",
      icon: Heart,
    },
    {
      metric: "8.2g",
      name: "Dietary Satiety Fiber",
      desc: "Keeps you full for 3-4 hours, regulates healthy digestion, and prevents insulin spikes during intense training phases.",
      icon: Sparkles,
    },
    {
      metric: "0.0g",
      name: "Zero Added Palm Oil",
      desc: "Commercial brands hide palm oil under 'vegetable oil' to stop oil separation. ORGANICHY contains only 100% natural peanut oil.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-20 bg-brand-cream-50 border-b border-brand-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="MACRONUTRIENT EXCELLENCE"
          title="Clean Protein Built for Peak Athletic Fuel"
          subtitle="Understand what goes into your body. Here is the verified nutritional breakdown of ORGANICHY 100% All-Natural Peanut Butter."
        />

        {/* 4 Macro Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {macroBreakdown.map((macro) => {
            const Icon = macro.icon;
            return (
              <div
                key={macro.name}
                className="p-6 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-green-900 text-brand-mint-300 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-heading font-black text-3xl text-brand-green-900 block leading-tight">
                      {macro.metric}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-brand-charcoal-900 mt-1">
                      {macro.name}
                    </h4>
                  </div>
                  <p className="text-xs text-brand-charcoal-600 leading-relaxed">
                    {macro.desc}
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-brand-mint-600 font-bold uppercase tracking-wider">
                  Per 100g Serving
                </div>
              </div>
            );
          })}
        </div>

        {/* Standard Serving Guide */}
        <div className="mt-12 p-8 rounded-3xl bg-brand-cream-100/80 border border-brand-cream-300 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-brand-green-800 bg-brand-mint-200/60 px-3 py-1 rounded-full uppercase tracking-wider">
              GYM ATHLETE SERVING GUIDE
            </span>
            <h4 className="font-heading font-black text-2xl text-brand-green-900">
              The Standard 32g Spoon
            </h4>
            <p className="text-xs text-brand-charcoal-600 leading-relaxed">
              2 tablespoons (32g) provides 10g of clean protein and 200 kcal of sustained, slow-release energy for your workout.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-brand-cream-100/90 border border-brand-cream-300 text-center shadow-2xs">
              <span className="text-[10px] text-brand-charcoal-500 uppercase tracking-wider font-semibold block">Calories</span>
              <span className="font-heading font-black text-xl text-brand-green-900 mt-1 block">200 kcal</span>
              <span className="text-[10px] text-brand-charcoal-400">clean energy</span>
            </div>
            <div className="p-4 rounded-2xl bg-brand-cream-100/90 border border-brand-cream-300 text-center shadow-2xs">
              <span className="text-[10px] text-brand-charcoal-500 uppercase tracking-wider font-semibold block">Pure Protein</span>
              <span className="font-heading font-black text-xl text-brand-green-900 mt-1 block">9.7 g</span>
              <span className="text-[10px] text-brand-mint-600 font-bold">muscle repair</span>
            </div>
            <div className="p-4 rounded-2xl bg-brand-cream-100/90 border border-brand-cream-300 text-center shadow-2xs">
              <span className="text-[10px] text-brand-charcoal-500 uppercase tracking-wider font-semibold block">Carbs</span>
              <span className="font-heading font-black text-xl text-brand-green-900 mt-1 block">5.9 g</span>
              <span className="text-[10px] text-brand-charcoal-400">low glycemic</span>
            </div>
            <div className="p-4 rounded-2xl bg-brand-cream-100/90 border border-brand-cream-300 text-center shadow-2xs">
              <span className="text-[10px] text-brand-charcoal-500 uppercase tracking-wider font-semibold block">Dietary Fiber</span>
              <span className="font-heading font-black text-xl text-brand-green-900 mt-1 block">2.6 g</span>
              <span className="text-[10px] text-brand-charcoal-400">easy digestion</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

