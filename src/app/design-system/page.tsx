"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SectionHeading } from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import ProductGallery from "@/components/ui/ProductGallery";
import { Tabs } from "@/components/ui/Tabs";
import { DEMO_PRODUCTS } from "@/lib/demoData";
import {
  Sparkles,
  ShieldCheck,
  Flame,
  Search,
  Mail,
  Check,
  ShoppingBag,
  ArrowRight,
  Leaf,
} from "lucide-react";

export default function DesignSystemPage() {
  const [emailInput, setEmailInput] = useState("");
  const sampleProduct = DEMO_PRODUCTS[0];

  const colorPalette = [
    {
      group: "Natural Green (Primary)",
      colors: [
        { name: "Forest 900", hex: "#182B14", usage: "Primary Buttons, Main Headings, Footer BG" },
        { name: "Forest 800", hex: "#233D1E", usage: "Hover States, Dark Accents" },
        { name: "Forest 700", hex: "#2E4F26", usage: "Card Borders, Sub-Headings" },
        { name: "Forest 500", hex: "#528445", usage: "Natural Iconography, Accents" },
      ],
    },
    {
      group: "Mint Green (Secondary & Refreshing)",
      colors: [
        { name: "Mint 500", hex: "#4EA887", usage: "Secondary Buttons, Success Indicators" },
        { name: "Mint 400", hex: "#72C4A5", usage: "Cart Badges, Attention Highlights" },
        { name: "Mint 200", hex: "#C7EBD9", usage: "Hover Backgrounds, Progress Bars" },
        { name: "Mint 100", hex: "#E3F5EC", usage: "Pill Backgrounds, Notification Tints" },
      ],
    },
    {
      group: "Warm Neutrals (Cream & Light Beige)",
      colors: [
        { name: "Cream 50", hex: "#FDFCF9", usage: "Website Body Background" },
        { name: "Cream 100", hex: "#FAF8F3", usage: "Section Background Alt, Card Fill" },
        { name: "Cream 200", hex: "#F5F1E8", usage: "Delicate Card Borders, Dividers" },
        { name: "Beige 100", hex: "#F4EFE6", usage: "Contrasting Feature Blocks" },
      ],
    },
    {
      group: "High-Contrast Charcoal & Warm Accent",
      colors: [
        { name: "Charcoal 900", hex: "#18201B", usage: "Body Copy (Far softer than pure #000)" },
        { name: "Charcoal 600", hex: "#536459", usage: "Secondary Metadata, Descriptions" },
        { name: "Charcoal 400", hex: "#9AA9A0", usage: "Disabled States, Form Placeholders" },
        { name: "Peanut Gold 500", hex: "#D49B2E", usage: "Star Ratings, Special Discount Badges" },
      ],
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      
      {/* Header */}
      <div className="border-b border-brand-cream-300 pb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide">
          <Leaf className="w-3.5 h-3.5 fill-brand-green-800" />
          <span>ORGANICHY DESIGN SYSTEM SPECIFICATION</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-black text-brand-green-900">
          Visual Identity & Design Tokens
        </h1>
        <p className="text-base text-brand-charcoal-600 max-w-3xl leading-relaxed">
          Crafted for a modern, premium, Indian organic nutrition brand. Emphasizes natural vitality, 100% wholesome purity, authentic peanut butter textures, and clear visual hierarchy without generic AI templates.
        </p>
      </div>

      {/* 1. Color Palette */}
      <section className="space-y-6">
        <SectionHeading
          badge="FOUNDATION"
          title="1. Color System & Harmonies"
          subtitle="A palette of deep natural greens, energizing mints, and warm organic creams designed for calm readability and appetite appeal."
          centered={false}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {colorPalette.map((group) => (
            <div
              key={group.group}
              className="p-5 rounded-2xl bg-white border border-brand-cream-300 shadow-card space-y-4"
            >
              <h3 className="font-heading font-bold text-sm text-brand-green-900 border-b border-brand-cream-200 pb-2">
                {group.group}
              </h3>
              <div className="space-y-3">
                {group.colors.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl shadow-xs shrink-0 border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-brand-charcoal-900 truncate">
                          {c.name}
                        </span>
                        <code className="text-[10px] text-brand-charcoal-500 font-mono">
                          {c.hex}
                        </code>
                      </div>
                      <p className="text-[10px] text-brand-charcoal-500 truncate">
                        {c.usage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Scale */}
      <section className="space-y-6">
        <SectionHeading
          badge="TYPOGRAPHY"
          title="2. Modern Clean Typography"
          subtitle="Display headings powered by Outfit for confident, athletic authority; body text powered by Inter for effortless legibility across all screen sizes."
          centered={false}
        />

        <div className="p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-8">
          <div className="border-b border-brand-cream-200 pb-6 space-y-2">
            <span className="text-xs font-mono text-brand-mint-600 font-bold uppercase">
              Display H1 — Outfit 56px / SemiBold / Tracking Tight
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-brand-green-900 tracking-tight leading-tight">
              100% Pure Slow-Roasted Peanut Butter
            </h1>
          </div>

          <div className="border-b border-brand-cream-200 pb-6 space-y-2">
            <span className="text-xs font-mono text-brand-mint-600 font-bold uppercase">
              Section Title H2 — Outfit 36px / Bold
            </span>
            <h2 className="text-3xl font-heading font-black text-brand-green-900 tracking-tight">
              Clean Nutrition Handcrafted in Moradabad
            </h2>
          </div>

          <div className="border-b border-brand-cream-200 pb-6 space-y-2">
            <span className="text-xs font-mono text-brand-mint-600 font-bold uppercase">
              Card Heading H3 — Outfit 20px / Bold
            </span>
            <h3 className="text-xl font-heading font-bold text-brand-green-900">
              Classic Crunchy 1kg (30g Plant Protein)
            </h3>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-brand-mint-600 font-bold uppercase">
              Body Copy & Paragraphs — Inter 15px / Regular / Leading 1.6
            </span>
            <p className="text-base text-brand-charcoal-700 leading-relaxed max-w-3xl">
              ORGANICHY began in Moradabad, Uttar Pradesh when founder Sourav set out to create an honest peanut butter with zero hydrogenated palm oil, zero chemical emulsifiers, and zero preservatives. Every jar is slow-roasted in small batches to preserve natural micronutrients and deliver honest fuel to gym lovers across India.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Buttons & Interactive States */}
      <section className="space-y-6">
        <SectionHeading
          badge="COMPONENTS"
          title="3. Button System & Action Triggers"
          subtitle="Tactile buttons with subtle micro-scale feedback on active press and distinct semantic hierarchy."
          centered={false}
        />

        <div className="p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="lg">
              <span>Primary Button (Large)</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="primary" size="md">
              <ShoppingBag className="w-4 h-4" />
              <span>Primary (Medium)</span>
            </Button>
            <Button variant="secondary" size="md">
              <Sparkles className="w-4 h-4" />
              <span>Secondary Mint</span>
            </Button>
            <Button variant="outline" size="md">
              <span>Outline Forest</span>
            </Button>
            <Button variant="ghost" size="md">
              <span>Ghost Action</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-brand-cream-200">
            <Button variant="primary" size="sm">
              <span>Small Size</span>
            </Button>
            <Button variant="primary" size="md" isLoading>
              <span>Processing Order...</span>
            </Button>
            <Button variant="primary" size="md" disabled>
              <span>Disabled State</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Form Inputs & Controls */}
      <section className="space-y-6">
        <SectionHeading
          badge="FORMS & DATA ENTRY"
          title="4. Form Inputs, Selects & Feedback"
          subtitle="Clean input fields with accessible focus rings, floating labels, hint captions, and explicit validation styling."
          centered={false}
        />

        <div className="p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Full Name (for delivery)"
            placeholder="e.g. Sourav Sharma"
            hint="Enter your legal name as on shipping address"
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="care@organichy.com"
            leftIcon={<Mail className="w-4 h-4" />}
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />

          <Input
            label="Phone Number"
            placeholder="+91 98765 43210"
            error="Please enter a valid 10-digit Indian mobile number"
          />

          <Select
            label="Select Packaging Size"
            options={[
              { label: "1kg Jar (Best Value — Save ₹150)", value: "1000g" },
              { label: "500g Trial Jar", value: "500g" },
              { label: "250g On-The-Go Pouch", value: "250g" },
            ]}
          />

          <Select
            label="Shipping State (India)"
            options={[
              { label: "Uttar Pradesh", value: "UP" },
              { label: "Delhi-NCR", value: "DL" },
              { label: "Maharashtra", value: "MH" },
              { label: "Karnataka", value: "KA" },
              { label: "All Other States", value: "OTHER" },
            ]}
          />

          <Input
            label="Coupon Code"
            placeholder="ORGANICHY10"
            rightIcon={
              <button className="text-xs font-bold text-brand-green-800 hover:underline">
                Apply
              </button>
            }
          />
        </div>
      </section>

      {/* 5. Product Card & Visual Showcase */}
      <section className="space-y-6">
        <SectionHeading
          badge="PRODUCT DISPLAY"
          title="5. High-Converting Product Card"
          subtitle="Designed specifically for food and nutrition with instant weight selector, discount badge, star ratings, and 1-click cart addition."
          centered={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard product={sampleProduct} />
          
          {/* Card Features Callout */}
          <div className="sm:col-span-1 lg:col-span-2 p-6 rounded-2xl bg-brand-cream-100 border border-brand-cream-300 flex flex-col justify-center space-y-4">
            <h4 className="font-heading font-black text-xl text-brand-green-900">
              Product Card Architecture Highlights
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-charcoal-700">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-brand-green-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Instant Weight Switcher:</strong> Customers toggle 500g or 1kg directly on the card without needing a full page reload.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-brand-green-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Visual Nutrition Pill:</strong> Highlights "30g Protein/100g" and "0 Trans Fat" at first glance.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-brand-green-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Dynamic Price & Strikethrough:</strong> Automatically computes the discount percentage and strikethrough MRP.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-brand-green-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Flyout Cart Sync:</strong> Adding to cart triggers state updates across navbar and slides in the cart drawer.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Product Image Gallery Component */}
      <section className="space-y-6">
        <SectionHeading
          badge="GALLERY"
          title="6. Product Photography Gallery"
          subtitle="High-definition zoom presentation with responsive vertical/horizontal thumbnail tracks and authenticity badges."
          centered={false}
        />

        <div className="p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card max-w-3xl">
          <ProductGallery
            images={sampleProduct.images}
            title={sampleProduct.title}
          />
        </div>
      </section>

      {/* 7. Nutrition Tabs Showcase */}
      <section className="space-y-6">
        <SectionHeading
          badge="DETAILS"
          title="7. Tabbed Nutrition & Sourcing Component"
          subtitle="Organizes dense nutritional facts, lab tests, and ingredients cleanly."
          centered={false}
        />

        <div className="p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card">
          <Tabs
            tabs={[
              {
                id: "nutrition",
                label: "Nutrition Facts (per 100g)",
                content: (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    {Object.entries(sampleProduct.nutritionFacts || {}).map(([key, val]) => (
                      <div key={key} className="p-4 rounded-xl bg-brand-cream-50 border border-brand-cream-200">
                        <span className="text-[11px] text-brand-charcoal-500 uppercase tracking-wide block">
                          {key}
                        </span>
                        <span className="font-heading font-black text-lg text-brand-green-900 mt-0.5 block">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "ingredients",
                label: "Ingredients & Sourcing",
                content: (
                  <div className="space-y-3 pt-2 text-sm text-brand-charcoal-700">
                    <p>
                      <strong>Ingredients:</strong> {sampleProduct.ingredients}
                    </p>
                    <p>
                      <strong>Sourcing Origin:</strong> Handpicked non-GMO runner peanuts sourced directly from premier certified farms across Gujarat and Maharashtra, then slow-roasted in Moradabad, Uttar Pradesh, India.
                    </p>
                  </div>
                ),
              },
              {
                id: "how-to-use",
                label: "Athlete Usage Guidelines",
                content: (
                  <div className="space-y-2 pt-2 text-sm text-brand-charcoal-700">
                    <p>• <strong>Pre-Workout:</strong> 1-2 tablespoons (32g) with banana or whole-grain toast 45 minutes before training for sustained complex energy.</p>
                    <p>• <strong>Post-Workout:</strong> Blend into whey protein shakes or oatmeal for recovery and muscle protein synthesis.</p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

    </div>
  );
}

