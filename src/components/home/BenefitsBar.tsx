import { ShieldCheck, Truck, Zap, Sparkles, MapPin } from "lucide-react";

export default function BenefitsBar() {
  const benefits = [
    {
      icon: Sparkles,
      title: "100% Roasted Peanuts",
      desc: "Slow-roasted to golden perfection",
    },
    {
      icon: Zap,
      title: "30g Pure Protein",
      desc: "Optimal plant-based muscle fuel",
    },
    {
      icon: ShieldCheck,
      title: "Zero Preservatives",
      desc: "No hydrogenated oils or palm oil",
    },
    {
      icon: Truck,
      title: "Pan-India Fast Dispatch",
      desc: "Direct from our facility in 24 hrs",
    },
    {
      icon: MapPin,
      title: "Moradabad, UP",
      desc: "Proudly Indian homegrown brand",
    },
  ];

  return (
    <section className="bg-brand-cream-100/90 border-b border-brand-cream-300 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="flex items-center gap-3 p-2 rounded-xl"
              >
                <div className="w-10 h-10 rounded-full bg-brand-mint-200/60 text-brand-green-900 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-green-800" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-charcoal-900 leading-tight">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-brand-charcoal-500 mt-0.5">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

