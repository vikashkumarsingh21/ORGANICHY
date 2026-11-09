import { prisma } from "@/lib/prisma";
import { CmsSectionRecord } from "@/types/cms";
import { MediaItemRecord } from "@/types/media";

// In-memory fallback dataset covering all 11 CMS sections with rich Moradabad/ORGANICHY defaults
const defaultCmsSections: Record<string, CmsSectionRecord> = {
  home_hero_banner: {
    id: "sec_hero_banner",
    sectionKey: "home_hero_banner",
    page: "home",
    title: "100% Pure Indian Slow-Roasted Peanut Butter",
    subtitle:
      "Born from a fitness lover's quest in Moradabad. ORGANICHY crafts pure, stone-ground peanut butter using only premier slow-roasted Indian farm peanuts. Zero hydrogenated palm oil, zero chemical preservatives, and up to 30g of pure muscle-building protein per 100g.",
    badgeText: "HANDCRAFTED IN MORADABAD, UTTAR PRADESH",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    secondaryCtaText: "Explore Products",
    secondaryCtaLink: "/shop?category=peanut-butter",
    fallbackUrl:
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1200&auto=format&fit=crop",
    metadata: {
      stats: [
        { val: "30g", label: "Plant Protein / 100g" },
        { val: "0%", label: "Added Palm Oil" },
        { val: "100%", label: "Roasted Peanuts" },
      ],
      reviewText: "Best natural crunch and roasted aroma in India.",
      reviewer: "Verified Gym Athlete",
    },
    isActive: true,
    displayOrder: 1,
    updatedAt: new Date().toISOString(),
  },

  home_promo_banner: {
    id: "sec_promo_banner",
    sectionKey: "home_promo_banner",
    page: "home",
    title: "Fuel Your Fitness Journey. Enjoy 10% Off Your First Order.",
    subtitle:
      "Order directly from our Moradabad facility. Experience 100% natural slow-roasted peanut butter with zero palm oil. Free shipping on orders over ₹499 across all Indian states.",
    badgeText: "SPECIAL ATHLETE WELCOME OFFER",
    ctaText: "Shop Fresh Roast",
    ctaLink: "/shop",
    metadata: {
      couponCode: "ORGANICHY10",
      subHighlight: "Applicable on all Crunchy, Creamy & Dark Chocolate jars",
      announcementBarText:
        "🌱 FREE All-India Shipping on orders above ₹499 | 100% Pure & Freshly Roasted in Moradabad",
    },
    isActive: true,
    displayOrder: 2,
    updatedAt: new Date().toISOString(),
  },

  home_featured_products: {
    id: "sec_featured_products",
    sectionKey: "home_featured_products",
    page: "home",
    title: "Featured Nutrition Lineup",
    subtitle:
      "Batch-roasted in Moradabad with zero palm oil. Select your favorite texture and size.",
    badgeText: "SIGNATURE RANGE",
    ctaText: "View All Nutrition Products",
    ctaLink: "/shop",
    metadata: {
      featuredProductIds: [
        "pb-crunchy-1kg",
        "pb-creamy-1kg",
        "pb-dark-choco-1kg",
        "pb-all-natural-pint",
      ],
      upcomingCategories: [
        { name: "High Protein Oats", badge: "Formulating" },
        { name: "Clean Whey Protein", badge: "R&D Phase" },
        { name: "Plant Nutrition Bars", badge: "Lab Testing" },
        { name: "Clean Mass Gainers", badge: "Formulating" },
      ],
    },
    isActive: true,
    displayOrder: 3,
    updatedAt: new Date().toISOString(),
  },

  home_why_choose: {
    id: "sec_why_choose",
    sectionKey: "home_why_choose",
    page: "home",
    title: "Why Athletes Choose ORGANICHY",
    subtitle:
      "Pure transparency, single-origin sourcing, and uncompromising production standards.",
    badgeText: "THE ORGANICHY STANDARD",
    metadata: {
      features: [
        {
          title: "Zero Palm Oil Ever",
          desc: "No cheap hydrogenated fillers or trans fats.",
        },
        {
          title: "Moradabad Roasted",
          desc: "Slow drum-roasted in small batches for natural sweetness.",
        },
        {
          title: "30g Plant Protein",
          desc: "Pure high-density nutrition for maximum gym recovery.",
        },
        {
          title: "Pan-India Fast Dispatch",
          desc: "Dispatched direct within 24 hours to all pincodes.",
        },
      ],
    },
    isActive: true,
    displayOrder: 4,
    updatedAt: new Date().toISOString(),
  },

  about_content: {
    id: "sec_about_content",
    sectionKey: "about_content",
    page: "about",
    title: "Crafted with Transparency in the Heart of Moradabad",
    subtitle:
      "Clean, honest, high-protein nutrition for India's athletes and health-conscious families.",
    badgeText: "ROOTED IN MORADABAD, UTTAR PRADESH",
    content:
      "Founded by Sourav in Moradabad, ORGANICHY was born out of frustration with commercial supermarket peanut butters loaded with cheap hydrogenated palm oils, chemical emulsifiers, and hidden sugars. We source single-origin, export-grade peanuts and slow-roast them to perfection in our dedicated Moradabad facility. Every batch is stone-ground, induction sealed, and dispatched fresh.",
    fallbackUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    metadata: {
      facilityLocation: "Moradabad, Uttar Pradesh, India",
      founder: "Sourav",
      commitments: [
        "100% Indian Farm Peanuts",
        "Zero Palm Oil or Hydrogenated Fats",
        "No Artificial Flavors or Preservatives",
        "Lab Tested for Purity & Aflatoxins",
      ],
    },
    isActive: true,
    displayOrder: 1,
    updatedAt: new Date().toISOString(),
  },

  our_story_content: {
    id: "sec_our_story",
    sectionKey: "our_story_content",
    page: "story",
    title: "The ORGANICHY Journey from Moradabad to Pan-India",
    subtitle:
      "How a lifter's frustration transformed into India's cleanest peanut butter brand.",
    badgeText: "OUR ORIGIN STORY",
    content:
      "Founder Sourav was training heavily in Moradabad, UP. Looking for clean plant protein, he flipped over common supermarket peanut butter jars to discover they were 15% hydrogenated palm oil and loaded with sugar. He refused to consume fillers and began roasting raw Gujarati peanuts in small 5kg batches at home. Today, ORGANICHY operates a state-of-the-art facility in Moradabad, delivering clean nutrition across all Indian states.",
    fallbackUrl:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop",
    metadata: {
      quote:
        "When you respect what goes into your body, you perform at an entirely different level. That philosophy drives every single batch we roast.",
      author: "Sourav, Founder of ORGANICHY",
      milestones: [
        {
          year: "The Spark",
          title: "Frustration in the Gym",
          desc: "Founder Sourav was training heavily in Moradabad, UP. Refusing supermarket palm-oil spreads, he searched for 100% pure peanut butter.",
        },
        {
          year: "The First Batch",
          title: "Slow Roasting in Moradabad",
          desc: "Sourav began roasting raw Gujarati peanuts in small 5kg batches at home with zero additives.",
        },
        {
          year: "The Community",
          title: "Local Athletes Take Notice",
          desc: "Local lifters and gym owners in Moradabad tried the batch and immediately demanded regular jars.",
        },
        {
          year: "The Vision",
          title: "ORGANICHY Goes Pan-India",
          desc: "ORGANICHY established a dedicated roasting facility in Moradabad, shipping to athletes nationwide.",
        },
      ],
    },
    isActive: true,
    displayOrder: 2,
    updatedAt: new Date().toISOString(),
  },

  faq_section: {
    id: "sec_faq_section",
    sectionKey: "faq_section",
    page: "faq",
    title: "Frequently Asked Questions",
    subtitle:
      "Clear, honest answers about our roasting process, ingredients, storage, and pan-India shipping.",
    badgeText: "FREQUENTLY ASKED QUESTIONS",
    metadata: {
      faqs: [
        {
          q: "Why is there natural oil floating on top of my peanut butter jar?",
          a: "Natural oil separation is the ultimate proof of purity! Commercial brands add hydrogenated palm oil and chemical emulsifiers to artificially prevent oil from separating. Because ORGANICHY contains 100% pure roasted peanuts and ZERO palm oil, the natural heart-healthy peanut oil rises to the top over time. Simply give it a good stir before your first use.",
          category: "Purity",
        },
        {
          q: "Does ORGANICHY contain any palm oil, hydrogenated fats, or preservatives?",
          a: "Absolutely NOT. We have a strict zero-tolerance policy. Zero palm oil, zero vanaspati, zero trans fats, and zero synthetic preservatives. Our Classic Crunchy and Pure Creamy variants contain only one single ingredient: 100% slow-roasted Indian farm peanuts.",
          category: "Ingredients",
        },
        {
          q: "How much protein is in each serving?",
          a: "ORGANICHY provides up to 30.2g of pure plant protein per 100g. A standard athletic serving of 2 tablespoons (32g) provides approximately 10g of complete plant protein.",
          category: "Nutrition",
        },
        {
          q: "Where is ORGANICHY manufactured and dispatched from?",
          a: "All our peanut butter is batch-roasted, stone-ground, and induction sealed in our dedicated quality facility in Moradabad, Uttar Pradesh, India.",
          category: "Production",
        },
        {
          q: "How long does shipping take to my city?",
          a: "Orders are roasted and dispatched within 24 hours. Transit time to Delhi-NCR and Western UP is 24 to 48 hours. Metro cities arrive in 3 to 4 business days.",
          category: "Shipping",
        },
        {
          q: "How should I store my peanut butter?",
          a: "Store the sealed jar in a cool, dry place away from direct sunlight. Once opened, you can keep it at room temperature for an easy spread, or refrigerate for a firmer texture.",
          category: "Storage",
        },
      ],
    },
    isActive: true,
    displayOrder: 1,
    updatedAt: new Date().toISOString(),
  },

  contact_information: {
    id: "sec_contact_info",
    sectionKey: "contact_information",
    page: "contact",
    title: "Contact ORGANICHY",
    subtitle:
      "Have questions about our slow-roasting process, shipping, or wholesale orders? Connect with Sourav and our Moradabad team.",
    badgeText: "WE ARE HERE TO HELP",
    metadata: {
      email: "care@organichy.com",
      phone: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
      address:
        "ORGANICHY Roasting Facility, Industrial Area, Moradabad, Uttar Pradesh, India - 244001",
      businessHours: "Monday – Saturday: 9:00 AM – 7:00 PM IST",
    },
    isActive: true,
    displayOrder: 1,
    updatedAt: new Date().toISOString(),
  },

  footer_content: {
    id: "sec_footer_content",
    sectionKey: "footer_content",
    page: "footer",
    title: "ORGANICHY Pure Nutrition",
    content:
      "Founded by Sourav in Moradabad. ORGANICHY delivers 100% natural slow-roasted peanut butter made exclusively with high-grade Indian farm peanuts. Zero hydrogenated oil, zero preservatives, uncompromised nutrition.",
    metadata: {
      copyrightText:
        "© 2026 ORGANICHY Nutrition Private Limited. All rights reserved.",
      disclaimerText:
        "FSSAI Compliant. Batch roasted in Moradabad, UP. Product statements are not intended to diagnose, treat, or cure any medical condition.",
      facilityAddress: "Moradabad, Uttar Pradesh, India - 244001",
    },
    isActive: true,
    displayOrder: 1,
    updatedAt: new Date().toISOString(),
  },

  social_media_links: {
    id: "sec_social_links",
    sectionKey: "social_media_links",
    page: "global",
    title: "Official Social Media Channels",
    metadata: {
      instagram: "https://instagram.com/organichy.official",
      facebook: "https://facebook.com/organichy",
      youtube: "https://youtube.com/@organichy",
      whatsapp:
        "https://wa.me/919876543210?text=Hi%20ORGANICHY%2C%20I%20have%20an%20inquiry%20about%20your%20products",
      twitter: "https://twitter.com/organichy",
    },
    isActive: true,
    displayOrder: 1,
    updatedAt: new Date().toISOString(),
  },

  seo_metadata: {
    id: "sec_seo_meta",
    sectionKey: "seo_metadata",
    page: "seo",
    title: "Global SEO & OpenGraph Configuration",
    metadata: {
      metaTitle:
        "ORGANICHY | 100% Pure Indian Peanut Butter & Nutrition | Moradabad",
      metaDescription:
        "Order pure, slow-roasted Indian peanut butter with zero palm oil. Handcrafted in Moradabad, UP. Up to 30g protein per 100g. Free all-India shipping above ₹499.",
      keywords:
        "peanut butter, clean nutrition, zero palm oil, pure roasted peanuts, gym protein, Moradabad nutrition, Indian fitness",
      ogImage:
        "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1200&auto=format&fit=crop",
      canonicalUrl: "https://organichy.com",
    },
    isActive: true,
    displayOrder: 1,
    updatedAt: new Date().toISOString(),
  },
};

// Global memory store for live mutations when DB is offline
const memoryCmsSections: Record<string, CmsSectionRecord> = { ...defaultCmsSections };

export const CmsService = {
  /**
   * Get all sections, optionally filtered by page
   */
  async getAllSections(page?: string): Promise<CmsSectionRecord[]> {
    try {
      const whereClause = page && page !== "all" ? { page } : {};
      const dbSections = await prisma.websiteSection.findMany({
        where: whereClause,
        include: { mediaAsset: true },
        orderBy: { displayOrder: "asc" },
      });

      if (dbSections && dbSections.length > 0) {
        return dbSections.map((s) => ({
          ...s,
          mediaItemId: s.mediaAssetId || s.id,
          mediaItem: s.mediaAsset as any,
          mediaAsset: s.mediaAsset as any,
          metadata: s.metadata as Record<string, any>,
        }));
      }
    } catch (e) {
      // Graceful fallback to memory store
    }

    let list = Object.values(memoryCmsSections);
    if (page && page !== "all") {
      list = list.filter((s) => s.page === page);
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  /**
   * Get a single section by unique sectionKey
   */
  async getSectionByKey(sectionKey: string): Promise<CmsSectionRecord | null> {
    try {
      const dbSec = await prisma.websiteSection.findUnique({
        where: { sectionKey },
        include: { mediaAsset: true },
      });
      if (dbSec) {
        return {
          ...dbSec,
          mediaItemId: dbSec.mediaAssetId || dbSec.id,
          mediaItem: dbSec.mediaAsset as any,
          mediaAsset: dbSec.mediaAsset as any,
          metadata: dbSec.metadata as Record<string, any>,
        };
      }
    } catch (e) {
      // Graceful fallback
    }

    return memoryCmsSections[sectionKey] || defaultCmsSections[sectionKey] || null;
  },

  /**
   * Upsert a CMS section with content, headings, buttons, media, and metadata
   */
  async upsertSection(data: Partial<CmsSectionRecord> & { sectionKey: string }): Promise<CmsSectionRecord> {
    const { sectionKey, page = "home", title, subtitle, content, badgeText, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, mediaAssetId, fallbackUrl, metadata, isActive = true, displayOrder = 0 } = data;

    try {
      const saved = await prisma.websiteSection.upsert({
        where: { sectionKey },
        update: {
          page,
          title,
          subtitle,
          content,
          badgeText,
          ctaText,
          ctaLink,
          secondaryCtaText,
          secondaryCtaLink,
          mediaAssetId: mediaAssetId || null,
          fallbackUrl: fallbackUrl || null,
          metadata: metadata || undefined,
          isActive: isActive !== undefined ? isActive : true,
          displayOrder: displayOrder !== undefined ? displayOrder : 0,
          updatedAt: new Date(),
        },
        create: {
          sectionKey,
          page,
          title,
          subtitle,
          content,
          badgeText,
          ctaText,
          ctaLink,
          secondaryCtaText,
          secondaryCtaLink,
          mediaAssetId: mediaAssetId || null,
          fallbackUrl: fallbackUrl || null,
          metadata: metadata || undefined,
          isActive: isActive !== undefined ? isActive : true,
          displayOrder: displayOrder !== undefined ? displayOrder : 0,
          updatedAt: new Date(),
        },
        include: { mediaAsset: true },
      });

      const formatted: CmsSectionRecord = {
        ...saved,
        mediaItemId: saved.mediaAssetId || saved.id,
        mediaItem: saved.mediaAsset as any,
        mediaAsset: saved.mediaAsset as any,
        metadata: saved.metadata as Record<string, any>,
      };

      // Also sync memory store
      memoryCmsSections[sectionKey] = formatted;
      return formatted;
    } catch (e) {
      // Fallback in-memory mutation
    }

    const existing = memoryCmsSections[sectionKey] || defaultCmsSections[sectionKey];
    const updated: CmsSectionRecord = {
      id: existing ? existing.id : `sec_${Date.now()}`,
      sectionKey,
      page: page || (existing ? existing.page : "home"),
      title: title !== undefined ? title : existing?.title,
      subtitle: subtitle !== undefined ? subtitle : existing?.subtitle,
      content: content !== undefined ? content : existing?.content,
      badgeText: badgeText !== undefined ? badgeText : existing?.badgeText,
      ctaText: ctaText !== undefined ? ctaText : existing?.ctaText,
      ctaLink: ctaLink !== undefined ? ctaLink : existing?.ctaLink,
      secondaryCtaText: secondaryCtaText !== undefined ? secondaryCtaText : existing?.secondaryCtaText,
      secondaryCtaLink: secondaryCtaLink !== undefined ? secondaryCtaLink : existing?.secondaryCtaLink,
      mediaAssetId: mediaAssetId !== undefined ? mediaAssetId : existing?.mediaAssetId,
      mediaItemId: mediaAssetId !== undefined ? mediaAssetId : existing?.mediaItemId,
      fallbackUrl: fallbackUrl !== undefined ? fallbackUrl : existing?.fallbackUrl,
      metadata: metadata !== undefined ? metadata : existing?.metadata,
      isActive: isActive !== undefined ? isActive : (existing ? existing.isActive : true),
      displayOrder: displayOrder !== undefined ? displayOrder : (existing ? existing.displayOrder : 0),
      updatedAt: new Date().toISOString(),
    };

    memoryCmsSections[sectionKey] = updated;
    return updated;
  },

  /**
   * Reorder sections by order array
   */
  async reorderSections(orders: { sectionKey: string; displayOrder: number }[]): Promise<boolean> {
    try {
      for (const item of orders) {
        await prisma.websiteSection.updateMany({
          where: { sectionKey: item.sectionKey },
          data: { displayOrder: item.displayOrder },
        });
      }
    } catch (e) {
      // Fallback
    }

    orders.forEach((item) => {
      if (memoryCmsSections[item.sectionKey]) {
        memoryCmsSections[item.sectionKey].displayOrder = item.displayOrder;
      }
    });

    return true;
  },

  /**
   * Toggle section visibility (published / unpublished)
   */
  async toggleSectionStatus(sectionKey: string, isActive: boolean): Promise<boolean> {
    try {
      await prisma.websiteSection.update({
        where: { sectionKey },
        data: { isActive },
      });
    } catch (e) {
      // Fallback
    }

    if (memoryCmsSections[sectionKey]) {
      memoryCmsSections[sectionKey].isActive = isActive;
    }
    return true;
  },

  /**
   * Delete custom section
   */
  async deleteSection(sectionKey: string): Promise<boolean> {
    try {
      await prisma.websiteSection.delete({
        where: { sectionKey },
      });
    } catch (e) {
      // Fallback
    }

    delete memoryCmsSections[sectionKey];
    return true;
  },

  /**
   * Get section image URL with priority: MediaAsset.secureUrl > fallbackUrl > defaultFallback
   */
  async getSectionImageUrl(sectionKey: string, defaultFallback: string): Promise<string> {
    const sec = await this.getSectionByKey(sectionKey);
    if (sec?.mediaAsset?.secureUrl) return sec.mediaAsset.secureUrl;
    if (sec?.mediaItem?.secureUrl) return sec.mediaItem.secureUrl;
    if (sec?.fallbackUrl) return sec.fallbackUrl;
    return defaultFallback;
  },
};

