import { CheckCircle2, Flame, Sparkles, ShieldCheck, Microscope } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function ProductQuality() {
  const processSteps = [
    {
      step: "01",
      title: "Hand-Grading & Sifting",
      desc: "Every batch of raw Indian peanuts is screened to reject broken, undersized, or shriveled kernels. Only prime whole nuts enter the roaster.",
      highlight: "Grade-A Kernels Only",
    },
    {
      step: "02",
      title: "Slow Golden Drum Roasting",
      desc: "Roasting takes place at gentle, monitored temperatures. This develops deep nutty aromatics while preserving delicate natural antioxidants.",
      highlight: "Zero Scorching",
    },
    {
      step: "03",
      title: "Blanching & De-Skinning",
      desc: "Peanut skins are aerated and gently removed to eliminate tannins and bitterness, resulting in an exceptionally smooth, sweet palate finish.",
      highlight: "Clean Sweet Aroma",
    },
    {
      step: "04",
      title: "Cold Stone-Milling",
      desc: "Peanuts are stone-ground slowly to release their natural oils. No hydrogenated palm oil or chemical stabilizers are ever introduced.",
      highlight: "100% Pure Natural Oil",
    },
    {
      step: "05",
      title: "NABL Lab Testing & Induction Sealing",
      desc: "Every batch is verified for protein density, zero aflatoxins, and zero moisture before being hermetically induction sealed in food-grade jars.",
      highlight: "Induction Fresh Seal",
    },
  ];

  return (
    <section className="py-20 bg-brand-cream-50/80 border-b border-brand-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="UNCOMPROMISING QUALITY"
          title="From Farm to Spoon: The Moradabad Standard"
          subtitle="How Sourav and our team in Moradabad transform 100% Indian farm peanuts into the purest jar of fuel you will ever taste."
        />

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-14">
          {processSteps.map((s, idx) => (
            <div
              key={s.step}
              className="relative p-6 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-card flex flex-col justify-between space-y-4 hover:border-brand-mint-400 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-2xl text-brand-mint-600/80">
                    {s.step}
                  </span>
                  <span className="text-[10px] font-heading font-bold text-brand-green-800 bg-brand-mint-100 px-2 py-0.5 rounded-full">
                    {s.highlight}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-brand-charcoal-900 leading-snug">
                  {s.title}
                </h3>

                <p className="text-xs text-brand-charcoal-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-brand-cream-200 flex items-center gap-1 text-[11px] font-bold text-brand-green-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-green-700" />
                <span>Verified Step {idx + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lab Certification Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-brand-green-900 text-brand-cream-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-green-800 text-brand-mint-300 flex items-center justify-center shrink-0 border border-brand-green-700">
              <Microscope className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-black text-lg text-white">
                Laboratory Certified Nutritional Purity
              </h4>
              <p className="text-xs text-brand-cream-200/80 max-w-xl">
                Every production run undergoes strict quality testing in NABL-accredited food labs. Zero aflatoxins, zero heavy metals, and guaranteed 30g+ protein yield per 100g.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-full bg-brand-green-800 text-xs font-bold text-brand-mint-300 border border-brand-green-700">
              FSSAI Standard Compliant
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

