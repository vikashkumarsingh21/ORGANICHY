import { Star, CheckCircle, Quote, Award } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function CustomerTestimonials() {
  const reviews = [
    {
      name: "Rohit Verma",
      role: "Competitive Powerlifter, Delhi-NCR",
      rating: 5,
      title: "Cleanest crunch on heavy squat days — zero sluggish feeling",
      comment:
        "Commercial peanut butters have palm oil that sits heavily in the stomach. ORGANICHY Classic Crunchy gives me clean, slow-burning fuel without any bloating. Arrived in Delhi from Moradabad in less than 36 hours!",
      product: "Classic Crunchy 1kg",
    },
    {
      name: "Ananya Sharma",
      role: "Sports Nutritionist & Runner, Bengaluru",
      rating: 5,
      title: "Lab numbers match the nutrition label perfectly",
      comment:
        "As a sports nutritionist, I inspect the protein yield and trans fat reports. ORGANICHY delivers 30g pure plant protein without stabilizers. I recommend it to all my fitness clients who want honest food.",
      product: "100% All-Natural Creamy 1kg",
    },
    {
      name: "Dr. Vikram Sethi",
      role: "Calisthenics Coach, Lucknow",
      rating: 5,
      title: "Dark Chocolate variant satisfies sweet cravings with zero guilt",
      comment:
        "The dark cocoa blend is incredible. It satisfies my sweet tooth while helping me hit my daily 150g protein target. Sourav and his Moradabad team have raised the bar for Indian nutrition brands.",
      product: "Dark Chocolate Peanut Butter 1kg",
    },
    {
      name: "Meera Patel",
      role: "CrossFit Trainer, Ahmedabad",
      rating: 5,
      title: "Natural oil separation proves there are no emulsifiers",
      comment:
        "When I opened the jar and saw natural peanut oil at the top, I knew this was authentic. Just a quick stir and it has the most divine roasted aroma. Pure Gujarati peanuts roasted to perfection.",
      product: "100% All-Natural Crunchy 1kg",
    },
  ];

  return (
    <section className="py-20 bg-brand-cream-50 border-b border-brand-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="ATHLETE REVIEWS"
          title="Loved by India's Fitness Community"
          subtitle="Real reviews from athletes, lifters, and health-conscious customers across India who switched to pure nutrition."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="p-6 rounded-3xl bg-brand-cream-100/90 border border-brand-cream-300 shadow-card flex flex-col justify-between space-y-4 hover:border-brand-mint-400 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-brand-green-800 bg-brand-mint-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-brand-mint-200">
                    <CheckCircle className="w-3 h-3 text-brand-green-700" />
                    Verified Buyer
                  </span>
                </div>

                <h4 className="font-heading font-bold text-sm text-brand-charcoal-900 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h4>

                <p className="text-xs text-brand-charcoal-600 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-brand-cream-200 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-heading font-bold text-xs text-brand-green-900">
                    {rev.name}
                  </h5>
                  <span className="text-[9px] text-brand-charcoal-500 bg-brand-cream-100 px-2 py-0.5 rounded">
                    {rev.product}
                  </span>
                </div>
                <p className="text-[10px] text-brand-charcoal-500">
                  {rev.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate Ratings Strip */}
        <div className="mt-12 p-6 rounded-3xl bg-brand-cream-100/70 border border-brand-cream-300 flex flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <span className="font-heading font-black text-3xl text-brand-green-900 block">4.9 / 5</span>
            <span className="text-xs text-brand-charcoal-500 font-semibold">Average Product Rating</span>
          </div>
          <div className="h-8 w-px bg-brand-cream-300 hidden sm:block" />
          <div>
            <span className="font-heading font-black text-3xl text-brand-green-900 block">50,000+</span>
            <span className="text-xs text-brand-charcoal-500 font-semibold">Jars Roasted & Dispatched</span>
          </div>
          <div className="h-8 w-px bg-brand-cream-300 hidden sm:block" />
          <div>
            <span className="font-heading font-black text-3xl text-brand-green-900 block">98.4%</span>
            <span className="text-xs text-brand-charcoal-500 font-semibold">Repeat Customer Rate</span>
          </div>
        </div>

      </div>
    </section>
  );
}

