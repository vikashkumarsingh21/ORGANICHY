import { Star, CheckCircle, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function Testimonials() {
  const reviews = [
    {
      name: "Rohit Verma",
      role: "Competitive Powerlifter, Delhi",
      rating: 5,
      title: "Best natural crunch in India — no fake sweetness",
      comment:
        "Most commercial brands add palm oil which makes my stomach feel heavy before heavy squats. ORGANICHY Classic Crunchy gives me clean, slow-burning fuel. Delivered from Moradabad to Delhi in under 48 hours!",
      product: "Classic Crunchy 1kg",
    },
    {
      name: "Ananya Sharma",
      role: "Marathon Runner & Nutritionist, Bengaluru",
      rating: 5,
      title: "Lab report numbers match the label",
      comment:
        "As a sports nutritionist, I look directly at trans fats and pure protein yield. ORGANICHY delivers 30g pure plant protein without emulsifiers. I recommend it to all my fitness clients.",
      product: "100% All-Natural Creamy 1kg",
    },
    {
      name: "Dr. Vikram Sethi",
      role: "Calisthenics Coach, Lucknow",
      rating: 5,
      title: "Dark Chocolate Peanut Butter is pure gold",
      comment:
        "The dark chocolate variant uses honest cocoa and zero palm oil. Satisfies my sweet cravings while hitting my daily 150g protein goal. Sourav and his team have built an exceptional brand.",
      product: "Dark Chocolate Peanut Butter 1kg",
    },
  ];

  return (
    <section className="py-20 bg-brand-cream-100/60 border-t border-brand-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="ATHLETE REVIEWS"
          title="Loved by India's Fitness Community"
          subtitle="Real reviews from athletes, lifters, and health-conscious customers across India."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="p-6 rounded-2xl bg-white border border-brand-cream-300 shadow-card flex flex-col justify-between space-y-4 hover:border-brand-mint-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-brand-green-800 bg-brand-mint-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-brand-green-700" />
                    Verified Buyer
                  </span>
                </div>

                <h4 className="font-heading font-bold text-base text-brand-charcoal-900">
                  "{rev.title}"
                </h4>

                <p className="text-xs sm:text-sm text-brand-charcoal-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-brand-cream-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-heading font-bold text-sm text-brand-green-900">
                      {rev.name}
                    </h5>
                    <p className="text-[11px] text-brand-charcoal-500">
                      {rev.role}
                    </p>
                  </div>
                  <span className="text-[10px] text-brand-charcoal-500 bg-brand-cream-100 px-2 py-1 rounded">
                    {rev.product}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

