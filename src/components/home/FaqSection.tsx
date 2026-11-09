"use client";

import { useState, useEffect } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BRAND } from "@/lib/constants";

interface FaqEntry {
  q?: string;
  question?: string;
  a?: string;
  answer?: string;
  category?: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [badgeText, setBadgeText] = useState("FREQUENTLY ASKED QUESTIONS");
  const [title, setTitle] = useState("Everything You Need to Know");
  const [subtitle, setSubtitle] = useState(
    "Clear, honest answers about our roasting process, ingredients, storage, and pan-India shipping."
  );
  const [faqs, setFaqs] = useState<FaqEntry[]>([
    {
      q: "Why is there natural oil floating on top of my peanut butter jar?",
      a: "Natural oil separation is the ultimate proof of purity! Commercial brands add hydrogenated palm oil and chemical emulsifiers to artificially prevent oil from separating. Because ORGANICHY contains 100% pure roasted peanuts and ZERO palm oil, the natural heart-healthy peanut oil rises to the top over time. Simply give it a good stir with a butter knife or spoon before your first use, and enjoy the authentic creamy texture.",
    },
    {
      q: "Does ORGANICHY contain any palm oil, hydrogenated fats, or preservatives?",
      a: "Absolutely NOT. We have a strict zero-tolerance policy. Zero palm oil, zero vanaspati, zero trans fats, and zero synthetic preservatives. Our Classic Crunchy and Pure Creamy variants contain only one single ingredient: 100% slow-roasted Indian farm peanuts.",
    },
    {
      q: "How much protein is in each serving?",
      a: "ORGANICHY provides up to 30.2g of pure plant protein per 100g. A standard athletic serving of 2 tablespoons (32g) provides approximately 10g of complete plant protein, 200 clean calories, and 8g of healthy monounsaturated fats to fuel your workouts.",
    },
    {
      q: "Where is ORGANICHY manufactured and dispatched from?",
      a: "All our peanut butter is batch-roasted, stone-ground, and induction sealed in our dedicated quality facility in Moradabad, Uttar Pradesh, India. Every order is dispatched directly from our Moradabad facility straight to your address.",
    },
    {
      q: "How long does shipping take to my city?",
      a: "Orders are roasted and dispatched within 24 hours. Transit time to Delhi-NCR and Western UP is 24 to 48 hours. Metro cities (Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata) typically arrive within 3 to 4 business days. We provide real-time tracking numbers for every shipment.",
    },
    {
      q: "How should I store my peanut butter?",
      a: "Store the sealed jar in a cool, dry place away from direct sunlight. Once opened, you can keep it at room temperature for an easy-to-spread texture, or store it in the refrigerator if you prefer a firmer, thicker consistency.",
    },
  ]);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch("/api/cms/sections?key=faq_section");
        const data = await res.json();
        if (data.success && data.data) {
          const sec = data.data;
          if (sec.title) setTitle(sec.title);
          if (sec.subtitle) setSubtitle(sec.subtitle);
          if (sec.badgeText) setBadgeText(sec.badgeText);
          if (sec.metadata?.faqs && Array.isArray(sec.metadata.faqs) && sec.metadata.faqs.length > 0) {
            setFaqs(sec.metadata.faqs);
          }
        }
      } catch (e) {
        // Fallback default FAQs remain active
      }
    }
    loadFaqs();
  }, []);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-brand-cream-50 border-b border-brand-cream-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge={badgeText}
          title={title}
          subtitle={subtitle}
        />

        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const questionText = faq.q || faq.question || "";
            const answerText = faq.a || faq.answer || "";
            return (
              <div
                key={idx}
                className="rounded-2xl border border-brand-cream-300 overflow-hidden bg-brand-cream-100/90 transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 font-heading font-bold text-brand-green-950 text-base hover:text-brand-green-800 transition"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-green-700 shrink-0" />
                    <span>{questionText}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-charcoal-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-brand-charcoal-700 leading-relaxed border-t border-brand-cream-300 mt-1 bg-brand-cream-50/80">
                    <p className="mt-3">{answerText}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Support Note */}
        <div className="mt-12 p-6 rounded-2xl bg-brand-cream-100/90 border border-brand-cream-300 text-center space-y-2">
          <p className="text-sm font-heading font-bold text-brand-green-900">
            Have a question we haven&apos;t covered here?
          </p>
          <p className="text-xs text-brand-charcoal-600">
            Chat directly with Sourav and our Moradabad support team via WhatsApp or email.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-brand-green-900 hover:text-brand-green-700 underline"
            >
              <MessageCircle className="w-3.5 h-3.5 text-brand-green-700" />
              <span>WhatsApp Helpline</span>
            </a>
            <span className="text-brand-charcoal-400">•</span>
            <a
              href={`mailto:${BRAND.supportEmail}`}
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-brand-green-900 hover:text-brand-green-700 underline"
            >
              <span>{BRAND.supportEmail}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
