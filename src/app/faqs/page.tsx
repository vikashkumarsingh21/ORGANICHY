"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, HelpCircle, MessageCircle, ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function FaqsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      category: "PRODUCT",
      q: "Why is there natural oil floating on top of my peanut butter jar?",
      a: "Natural oil separation is nature's seal of 100% purity! Commercial brands add hydrogenated palm oil and chemical emulsifiers to unnaturally bind the oil and solids together. Because ORGANICHY contains only roasted peanuts with ZERO palm oil or hydrogenated fats, the natural heart-healthy peanut oil rises to the top over time. Simply give it a thorough stir with a spoon or butter knife upon opening.",
    },
    {
      category: "PRODUCT",
      q: "Does ORGANICHY add any palm oil, hydrogenated fats, or preservatives?",
      a: "Never. We enforce a strict zero-compromise policy. Zero palm oil, zero vanaspati, zero trans fats, and zero synthetic preservatives. Our Classic Crunchy and Pure Creamy variants contain only 100% slow-roasted Indian farm peanuts. Nothing else.",
    },
    {
      category: "NUTRITION",
      q: "How much protein is in each serving of ORGANICHY?",
      a: "ORGANICHY delivers up to 30.2g of pure plant protein per 100g. A standard athletic serving of 2 tablespoons (32g) provides ~10g of complete muscle-building protein, 200 clean calories, and 8g of monounsaturated fats.",
    },
    {
      category: "NUTRITION",
      q: "Is ORGANICHY suitable for diabetes or keto diets?",
      a: "Yes! Our Classic Crunchy and Pure Creamy variants contain 0g of added sugar, zero artificial sweeteners, and low net carbs. They are optimal for keto, low-carb athletic regimes, and diabetic meal plans.",
    },
    {
      category: "ROASTING",
      q: "Where is ORGANICHY manufactured and dispatched from?",
      a: "All our peanut butter is batch-roasted, stone-ground, and induction sealed in our dedicated quality facility in Moradabad, Uttar Pradesh, India. Every order is dispatched directly from our Moradabad facility straight to your address.",
    },
    {
      category: "ROASTING",
      q: "Where do you source your raw peanuts?",
      a: "We source strictly non-GMO high-grade runner peanuts from premier farming belts across Gujarat and Maharashtra, hand-screening them before they enter our Moradabad roasting roasters.",
    },
    {
      category: "SHIPPING",
      q: "How long does shipping take to my city in India?",
      a: "Orders are roasted and dispatched within 24 hours. Transit to Delhi-NCR and Western UP takes 24 to 48 hours. Metro cities (Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata) arrive within 3 to 4 business days. We provide real-time tracking numbers for every shipment.",
    },
    {
      category: "SHIPPING",
      q: "What is your free shipping policy?",
      a: "We offer 100% FREE All-India shipping on all orders valued above ₹499. For orders below ₹499, a nominal standard shipping fee of ₹49 applies.",
    },
    {
      category: "PAYMENTS",
      q: "Do you offer Cash on Delivery (COD) as well as online payments?",
      a: "Yes! We accept all Indian payment modes through the secure Razorpay gateway: UPI (Google Pay, PhonePe, Paytm), RuPay, Visa, Mastercard, NetBanking, and Wallets. We also provide Cash on Delivery (COD) across serviceable Indian pincodes with a small ₹40 logistics handling fee.",
    },
    {
      category: "STORAGE",
      q: "How should I store my peanut butter once opened?",
      a: "Store the jar in a cool, dry place away from direct heat. Once opened, you can keep it at room temperature for an easy, spreadable texture, or refrigerate it if you prefer a thicker, fudgy consistency.",
    },
  ];

  const filteredFaqs = faqData.filter((item) => {
    if (activeCategory !== "ALL" && item.category !== activeCategory)
      return false;
    if (
      searchQuery &&
      !item.q.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="py-12 bg-brand-cream-50 min-h-screen space-y-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200">
            <HelpCircle className="w-3.5 h-3.5 text-brand-green-800" />
            <span>KNOWLEDGE BASE & SUPPORT</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-brand-green-900 tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal-600 leading-relaxed max-w-xl mx-auto">
            Find immediate answers regarding our ingredients, roasting craft in Moradabad, delivery SLAs, and nutritional profiles.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-brand-charcoal-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search questions (e.g., oil separation, protein, shipping)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-brand-cream-300 bg-white text-xs sm:text-sm text-brand-charcoal-900 placeholder:text-brand-charcoal-400 focus:outline-none focus:ring-2 focus:ring-brand-mint-300 shadow-sm"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { label: "All Questions", value: "ALL" },
            { label: "Product & Purity", value: "PRODUCT" },
            { label: "Nutrition & Gym", value: "NUTRITION" },
            { label: "Roasting & Origin", value: "ROASTING" },
            { label: "Shipping & Orders", value: "SHIPPING" },
            { label: "Payments & COD", value: "PAYMENTS" },
            { label: "Storage & Life", value: "STORAGE" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setActiveCategory(cat.value);
                setOpenIndex(0);
              }}
              className={`px-4 py-2 rounded-full text-xs font-heading font-bold transition whitespace-nowrap border ${
                activeCategory === cat.value
                  ? "bg-brand-green-900 text-brand-cream-100 border-brand-green-900 shadow-xs"
                  : "bg-white text-brand-charcoal-700 border-brand-cream-300 hover:border-brand-mint-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-brand-cream-300 overflow-hidden bg-white shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-brand-cream-50 transition"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading font-bold text-sm sm:text-base text-brand-charcoal-900">
                      {faq.q}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-brand-cream-100 flex items-center justify-center shrink-0 text-brand-green-900 transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-brand-mint-100" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-brand-charcoal-600 leading-relaxed border-t border-brand-cream-200/80 bg-brand-cream-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-brand-cream-300 space-y-3">
              <p className="text-sm text-brand-charcoal-600 font-bold">
                No matching questions found for &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("ALL");
                }}
                className="text-xs font-bold text-brand-green-800 underline"
              >
                Clear Search & View All
              </button>
            </div>
          )}
        </div>

        {/* WhatsApp & Email Help Card */}
        <div className="p-8 rounded-3xl bg-brand-green-900 text-brand-cream-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-heading font-black text-xl text-white">
              Still have an unanswered question?
            </h4>
            <p className="text-xs text-brand-cream-200/80">
              Founder Sourav and our Moradabad team answer directly on WhatsApp.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-bold text-xs tracking-wide transition shadow-xs flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full border border-brand-cream-300 text-brand-cream-100 hover:bg-brand-green-800 font-heading font-bold text-xs transition"
            >
              Contact Form
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

