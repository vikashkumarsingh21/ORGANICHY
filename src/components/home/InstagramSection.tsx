import Image from "next/image";
import { Instagram, Heart, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function InstagramSection() {
  const posts = [
    {
      id: "ig-1",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
      caption: "Fueling the heavy lifting sessions. 30g pure plant protein straight from Moradabad.",
      likes: "1.2k",
      comments: "84",
    },
    {
      id: "ig-2",
      image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=600&auto=format&fit=crop",
      caption: "Zero palm oil. Just 100% slow-roasted golden peanuts. That natural crunch hit different.",
      likes: "940",
      comments: "52",
    },
    {
      id: "ig-3",
      image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=600&auto=format&fit=crop",
      caption: "Dark chocolate high-protein peanut butter spread on sourdough. Guilt-free morning power.",
      likes: "1.8k",
      comments: "126",
    },
    {
      id: "ig-4",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
      caption: "Athlete verified. Slow roasted in small monitored batches for peak nutrient density.",
      likes: "2.1k",
      comments: "148",
    },
  ];

  return (
    <section className="py-20 bg-brand-cream-50/60 border-b border-brand-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide mb-3 border border-brand-mint-200">
              <Instagram className="w-3.5 h-3.5 text-brand-green-800" />
              <span>JOIN #TEAMORGANICHY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-brand-green-900 tracking-tight leading-tight">
              Fueling India&apos;s Daily Hustle
            </h2>
            <p className="text-sm text-brand-charcoal-600 mt-2 max-w-xl">
              Tag <strong className="text-brand-green-900">@organichy.official</strong> on Instagram to get featured on our athlete wall.
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-brand-cream-300 hover:border-brand-green-800 text-brand-green-900 font-heading font-bold text-xs tracking-wide transition shadow-2xs self-start sm:self-end"
          >
            <Instagram className="w-4 h-4 text-brand-green-800" />
            <span>Follow @organichy.official</span>
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square rounded-3xl overflow-hidden bg-brand-cream-200 shadow-card border-2 border-white"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-brand-green-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-between text-brand-cream-100">
                <div className="flex justify-end">
                  <Instagram className="w-5 h-5 text-brand-mint-300" />
                </div>
                <p className="text-xs line-clamp-3 leading-relaxed">
                  {post.caption}
                </p>
                <div className="flex items-center gap-4 text-xs font-bold pt-2 border-t border-brand-green-800 text-brand-mint-300">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    {post.comments}
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

