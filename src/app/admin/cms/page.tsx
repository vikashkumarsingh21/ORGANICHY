"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutTemplate,
  Check,
  RefreshCw,
  ExternalLink,
  ImageIcon,
  X,
  Sparkles,
  ArrowRight,
  Save,
  HelpCircle,
  FileText,
  Building,
  Layers,
  CheckCircle,
  Eye,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Globe,
  Share2,
  Phone,
  Mail,
  Search,
  Sliders,
  CheckSquare,
  Square,
  Smartphone,
  Monitor,
  AlertCircle,
  Info,
} from "lucide-react";
import { MediaItemRecord } from "@/types/media";
import { CmsSectionRecord, FaqItem, StoryMilestone } from "@/types/cms";

type CmsManagerTab =
  | "homepage"
  | "hero"
  | "promo"
  | "featured"
  | "about"
  | "story"
  | "faq"
  | "contact"
  | "footer"
  | "social"
  | "seo";

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<CmsManagerTab>("homepage");
  const [sections, setSections] = useState<CmsSectionRecord[]>([]);
  const [mediaList, setMediaList] = useState<MediaItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Media picker modal state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [targetImageField, setTargetImageField] = useState<{
    sectionKey: string;
    field?: string;
  } | null>(null);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaFolderFilter, setMediaFolderFilter] = useState("ALL");

  // Live preview modal state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Add section modal state
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSectionKey, setNewSectionKey] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionPage, setNewSectionPage] = useState("home");

  // 1. HERO SECTION FORM STATE
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroBadge, setHeroBadge] = useState("");
  const [heroCtaText, setHeroCtaText] = useState("");
  const [heroCtaLink, setHeroCtaLink] = useState("");
  const [heroSecCtaText, setHeroSecCtaText] = useState("");
  const [heroSecCtaLink, setHeroSecCtaLink] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroStat1Val, setHeroStat1Val] = useState("30g");
  const [heroStat1Label, setHeroStat1Label] = useState("Plant Protein / 100g");
  const [heroStat2Val, setHeroStat2Val] = useState("0%");
  const [heroStat2Label, setHeroStat2Label] = useState("Added Palm Oil");
  const [heroStat3Val, setHeroStat3Val] = useState("100%");
  const [heroStat3Label, setHeroStat3Label] = useState("Roasted Peanuts");
  const [heroReviewer, setHeroReviewer] = useState("Verified Gym Athlete");
  const [heroReviewQuote, setHeroReviewQuote] = useState("Best natural crunch and roasted aroma in India.");

  // 2. PROMOTIONAL BANNER STATE
  const [promoTitle, setPromoTitle] = useState("");
  const [promoSubtitle, setPromoSubtitle] = useState("");
  const [promoBadge, setPromoBadge] = useState("");
  const [promoCoupon, setPromoCoupon] = useState("");
  const [promoCtaText, setPromoCtaText] = useState("");
  const [promoCtaLink, setPromoCtaLink] = useState("");
  const [promoActive, setPromoActive] = useState(true);
  const [announcementText, setAnnouncementText] = useState("");

  // 3. FEATURED PRODUCTS STATE
  const [featuredTitle, setFeaturedTitle] = useState("");
  const [featuredSubtitle, setFeaturedSubtitle] = useState("");
  const [featuredBadge, setFeaturedBadge] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([
    "pb-crunchy-1kg",
    "pb-creamy-1kg",
    "pb-dark-choco-1kg",
    "pb-all-natural-pint",
  ]);

  // 4. ABOUT US CONTENT STATE
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutSubtitle, setAboutSubtitle] = useState("");
  const [aboutBadge, setAboutBadge] = useState("");
  const [aboutContent, setAboutContent] = useState("");
  const [aboutImageUrl, setAboutImageUrl] = useState("");
  const [aboutFacility, setAboutFacility] = useState("Moradabad, Uttar Pradesh, India");

  // 5. OUR STORY STATE
  const [storyTitle, setStoryTitle] = useState("");
  const [storySubtitle, setStorySubtitle] = useState("");
  const [storyBadge, setStoryBadge] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [storyQuote, setStoryQuote] = useState("");
  const [storyImageUrl, setStoryImageUrl] = useState("");
  const [storyMilestones, setStoryMilestones] = useState<StoryMilestone[]>([]);

  // 6. FAQ STATE
  const [faqTitle, setFaqTitle] = useState("");
  const [faqSubtitle, setFaqSubtitle] = useState("");
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [newFaqCat, setNewFaqCat] = useState("Purity");

  // 7. CONTACT INFO STATE
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWhatsApp, setContactWhatsApp] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [contactHours, setContactHours] = useState("");

  // 8. FOOTER STATE
  const [footerTitle, setFooterTitle] = useState("");
  const [footerContent, setFooterContent] = useState("");
  const [footerCopyright, setFooterCopyright] = useState("");
  const [footerDisclaimer, setFooterDisclaimer] = useState("");

  // 9. SOCIAL LINKS STATE
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialYouTube, setSocialYouTube] = useState("");
  const [socialWhatsApp, setSocialWhatsApp] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");

  // 10. SEO CONTENT STATE
  const [seoMetaTitle, setSeoMetaTitle] = useState("");
  const [seoMetaDesc, setSeoMetaDesc] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("");

  // Available catalog products for featured picker
  const AVAILABLE_PRODUCTS = [
    { id: "pb-crunchy-1kg", name: "100% Pure Crunchy Peanut Butter (1kg)" },
    { id: "pb-creamy-1kg", name: "100% Pure Creamy Peanut Butter (1kg)" },
    { id: "pb-dark-choco-1kg", name: "Dark Chocolate High Protein Peanut Butter (1kg)" },
    { id: "pb-all-natural-pint", name: "Moradabad Special Roast Pint (400g)" },
    { id: "pb-crunchy-350g", name: "Starter Crunchy Peanut Butter (350g)" },
    { id: "pb-creamy-350g", name: "Starter Creamy Peanut Butter (350g)" },
  ];

  // Fetch all CMS data & Media assets
  const fetchData = async () => {
    setLoading(true);
    try {
      const [secRes, medRes] = await Promise.all([
        fetch("/api/cms/sections"),
        fetch("/api/media"),
      ]);

      const secData = await secRes.json();
      const medData = await medRes.json();

      if (secData.success && Array.isArray(secData.data)) {
        setSections(secData.data);
        populateFormStates(secData.data);
      }
      if (medData.success && Array.isArray(medData.data)) {
        setMediaList(medData.data);
      }
    } catch (err: any) {
      setErrorMessage("Failed to load CMS data. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map fetched sections into individual tab states
  const populateFormStates = (list: CmsSectionRecord[]) => {
    // 1. Hero
    const hero = list.find((s) => s.sectionKey === "home_hero_banner");
    if (hero) {
      setHeroTitle(hero.title || "");
      setHeroSubtitle(hero.subtitle || "");
      setHeroBadge(hero.badgeText || "HANDCRAFTED IN MORADABAD, UTTAR PRADESH");
      setHeroCtaText(hero.ctaText || "Shop Now");
      setHeroCtaLink(hero.ctaLink || "/shop");
      setHeroSecCtaText(hero.secondaryCtaText || "Explore Products");
      setHeroSecCtaLink(hero.secondaryCtaLink || "/shop?category=peanut-butter");
      setHeroImageUrl(hero.mediaAsset?.secureUrl || hero.fallbackUrl || "");
      if (hero.metadata?.stats && Array.isArray(hero.metadata.stats)) {
        setHeroStat1Val(hero.metadata.stats[0]?.val || "30g");
        setHeroStat1Label(hero.metadata.stats[0]?.label || "Plant Protein / 100g");
        setHeroStat2Val(hero.metadata.stats[1]?.val || "0%");
        setHeroStat2Label(hero.metadata.stats[1]?.label || "Added Palm Oil");
        setHeroStat3Val(hero.metadata.stats[2]?.val || "100%");
        setHeroStat3Label(hero.metadata.stats[2]?.label || "Roasted Peanuts");
      }
      setHeroReviewQuote(hero.metadata?.reviewText || "Best natural crunch and roasted aroma in India.");
      setHeroReviewer(hero.metadata?.reviewer || "Verified Gym Athlete");
    }

    // 2. Promo
    const promo = list.find((s) => s.sectionKey === "home_promo_banner");
    if (promo) {
      setPromoTitle(promo.title || "");
      setPromoSubtitle(promo.subtitle || "");
      setPromoBadge(promo.badgeText || "SPECIAL ATHLETE WELCOME OFFER");
      setPromoCoupon(promo.metadata?.couponCode || "ORGANICHY10");
      setPromoCtaText(promo.ctaText || "Shop Fresh Roast");
      setPromoCtaLink(promo.ctaLink || "/shop");
      setPromoActive(promo.isActive);
      setAnnouncementText(
        promo.metadata?.announcementBarText ||
          "🌱 FREE All-India Shipping on orders above ₹499 | 100% Pure & Freshly Roasted in Moradabad"
      );
    }

    // 3. Featured Products
    const feat = list.find((s) => s.sectionKey === "home_featured_products");
    if (feat) {
      setFeaturedTitle(feat.title || "Featured Nutrition Lineup");
      setFeaturedSubtitle(feat.subtitle || "Batch-roasted in Moradabad with zero palm oil.");
      setFeaturedBadge(feat.badgeText || "SIGNATURE RANGE");
      if (feat.metadata?.featuredProductIds) {
        setSelectedProductIds(feat.metadata.featuredProductIds);
      }
    }

    // 4. About Us
    const about = list.find((s) => s.sectionKey === "about_content");
    if (about) {
      setAboutTitle(about.title || "");
      setAboutSubtitle(about.subtitle || "");
      setAboutBadge(about.badgeText || "ROOTED IN MORADABAD, UTTAR PRADESH");
      setAboutContent(about.content || "");
      setAboutImageUrl(about.mediaAsset?.secureUrl || about.fallbackUrl || "");
      setAboutFacility(about.metadata?.facilityLocation || "Moradabad, Uttar Pradesh, India");
    }

    // 5. Our Story
    const story = list.find((s) => s.sectionKey === "our_story_content");
    if (story) {
      setStoryTitle(story.title || "");
      setStorySubtitle(story.subtitle || "");
      setStoryBadge(story.badgeText || "OUR ORIGIN STORY");
      setStoryContent(story.content || "");
      setStoryQuote(story.metadata?.quote || "");
      setStoryImageUrl(story.mediaAsset?.secureUrl || story.fallbackUrl || "");
      if (story.metadata?.milestones) {
        setStoryMilestones(story.metadata.milestones);
      }
    }

    // 6. FAQ
    const faq = list.find((s) => s.sectionKey === "faq_section");
    if (faq) {
      setFaqTitle(faq.title || "Frequently Asked Questions");
      setFaqSubtitle(faq.subtitle || "Clear, honest answers about our roasting process.");
      if (faq.metadata?.faqs) {
        setFaqItems(faq.metadata.faqs);
      }
    }

    // 7. Contact
    const contact = list.find((s) => s.sectionKey === "contact_information");
    if (contact) {
      setContactEmail(contact.metadata?.email || "care@organichy.com");
      setContactPhone(contact.metadata?.phone || "+91 98765 43210");
      setContactWhatsApp(contact.metadata?.whatsapp || "+91 98765 43210");
      setContactAddress(
        contact.metadata?.address ||
          "ORGANICHY Roasting Facility, Industrial Area, Moradabad, Uttar Pradesh, India - 244001"
      );
      setContactHours(contact.metadata?.businessHours || "Monday – Saturday: 9:00 AM – 7:00 PM IST");
    }

    // 8. Footer
    const footer = list.find((s) => s.sectionKey === "footer_content");
    if (footer) {
      setFooterTitle(footer.title || "ORGANICHY Pure Nutrition");
      setFooterContent(footer.content || "");
      setFooterCopyright(footer.metadata?.copyrightText || "© 2026 ORGANICHY Nutrition Private Limited.");
      setFooterDisclaimer(
        footer.metadata?.disclaimerText ||
          "FSSAI Compliant. Batch roasted in Moradabad, UP. Product statements are not intended to diagnose, treat, or cure any medical condition."
      );
    }

    // 9. Social
    const social = list.find((s) => s.sectionKey === "social_media_links");
    if (social?.metadata) {
      setSocialInstagram(social.metadata.instagram || "https://instagram.com/organichy.official");
      setSocialFacebook(social.metadata.facebook || "https://facebook.com/organichy");
      setSocialYouTube(social.metadata.youtube || "https://youtube.com/@organichy");
      setSocialWhatsApp(social.metadata.whatsapp || "https://wa.me/919876543210");
      setSocialTwitter(social.metadata.twitter || "https://twitter.com/organichy");
    }

    // 10. SEO
    const seo = list.find((s) => s.sectionKey === "seo_metadata");
    if (seo?.metadata) {
      setSeoMetaTitle(seo.metadata.metaTitle || "");
      setSeoMetaDesc(seo.metadata.metaDescription || "");
      setSeoKeywords(seo.metadata.keywords || "");
      setSeoOgImage(seo.metadata.ogImage || "");
    }
  };

  // Helper to save any section via PUT /api/cms/sections
  const saveSection = async (payload: Partial<CmsSectionRecord> & { sectionKey: string }) => {
    setSaving(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/cms/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update section");

      setSuccessMessage(`Changes published to storefront for '${payload.sectionKey}'!`);
      fetchData();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save section changes");
    } finally {
      setSaving(false);
    }
  };

  // Toggle section visibility
  const handleToggleStatus = async (sectionKey: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/cms/sections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_status",
          sectionKey,
          isActive: !currentStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Section '${sectionKey}' is now ${!currentStatus ? "Published" : "Hidden"}`);
        fetchData();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (e) {
      setErrorMessage("Failed to toggle section visibility");
    }
  };

  // Move section order
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    const reorderPayload = newSections.map((sec, i) => ({
      sectionKey: sec.sectionKey,
      displayOrder: i + 1,
    }));

    try {
      const res = await fetch("/api/cms/sections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          reorder: reorderPayload,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Section display order updated successfully");
        fetchData();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (e) {
      setErrorMessage("Failed to reorder sections");
    }
  };

  // Add custom section
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionKey || !newSectionTitle) return;

    try {
      const res = await fetch("/api/cms/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: newSectionKey.trim().toLowerCase().replace(/\s+/g, "_"),
          title: newSectionTitle,
          page: newSectionPage,
          isActive: true,
          displayOrder: sections.length + 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddSectionOpen(false);
        setNewSectionKey("");
        setNewSectionTitle("");
        setSuccessMessage(`Custom section '${newSectionKey}' created successfully`);
        fetchData();
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(data.error || "Failed to create section");
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Failed to create section");
    }
  };

  // Open Media Picker for an image field
  const handleOpenMediaPicker = (sectionKey: string, field = "image") => {
    setTargetImageField({ sectionKey, field });
    setIsMediaModalOpen(true);
  };

  // Assign image selected from Media Library modal
  const handleSelectMediaItem = (item: MediaItemRecord) => {
    if (!targetImageField) return;

    if (targetImageField.sectionKey === "home_hero_banner") {
      setHeroImageUrl(item.secureUrl);
    } else if (targetImageField.sectionKey === "about_content") {
      setAboutImageUrl(item.secureUrl);
    } else if (targetImageField.sectionKey === "our_story_content") {
      setStoryImageUrl(item.secureUrl);
    } else if (targetImageField.sectionKey === "seo_metadata") {
      setSeoOgImage(item.secureUrl);
    }

    setIsMediaModalOpen(false);
    setTargetImageField(null);
    setSuccessMessage(`Selected image '${item.title}' attached. Click Save to publish.`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Milestone helpers for Our Story
  const handleAddMilestone = () => {
    setStoryMilestones([
      ...storyMilestones,
      { year: "2026 Milestone", title: "New Chapter", desc: "Batch roasted in Moradabad." },
    ]);
  };
  const handleRemoveMilestone = (index: number) => {
    setStoryMilestones(storyMilestones.filter((_, i) => i !== index));
  };
  const handleUpdateMilestone = (index: number, key: keyof StoryMilestone, val: string) => {
    const updated = [...storyMilestones];
    updated[index][key] = val;
    setStoryMilestones(updated);
  };

  // FAQ helpers
  const handleAddFaq = () => {
    if (!newFaqQ || !newFaqA) return;
    setFaqItems([...faqItems, { question: newFaqQ, answer: newFaqA, category: newFaqCat }]);
    setNewFaqQ("");
    setNewFaqA("");
  };
  const handleRemoveFaq = (index: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  // Filtered media items for picker modal
  const filteredMedia = mediaList.filter((m) => {
    const matchFolder = mediaFolderFilter === "ALL" || m.folder === mediaFolderFilter;
    const matchSearch =
      !mediaSearch ||
      m.title.toLowerCase().includes(mediaSearch.toLowerCase()) ||
      m.folder.toLowerCase().includes(mediaSearch.toLowerCase());
    return matchFolder && matchSearch;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* CMS Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-cream-300 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-xs font-bold tracking-wide border border-brand-mint-200 mb-2">
            <LayoutTemplate className="w-3.5 h-3.5 text-brand-green-800" />
            <span>ORGANICHY DYNAMIC CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-green-950 tracking-tight">
            Content Management System
          </h1>
          <p className="text-xs text-brand-charcoal-600 mt-1 max-w-2xl">
            Empower website administrators to customize homepage copy, hero photography, brand stories, FAQs, banners, and SEO without modifying source code.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-brand-cream-300 hover:border-brand-green-800 text-brand-green-950 text-xs font-bold font-heading flex items-center gap-1.5 shadow-2xs transition"
          >
            <Eye className="w-3.5 h-3.5 text-brand-green-800" />
            <span>Live Preview</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-2xl bg-brand-cream-100 hover:bg-brand-cream-200 text-brand-green-950 text-xs font-bold font-heading flex items-center gap-1.5 transition"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-charcoal-600" />
          </Link>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-white border border-brand-cream-300 hover:bg-brand-cream-100 text-brand-charcoal-700 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-2xs animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 11 CMS Manager Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-brand-cream-300 pb-2 scrollbar-thin">
        {[
          { id: "homepage", label: "1. Homepage Sections" },
          { id: "hero", label: "2. Hero Section" },
          { id: "promo", label: "3. Promotional Banners" },
          { id: "featured", label: "4. Featured Products" },
          { id: "about", label: "5. About Us Editor" },
          { id: "story", label: "6. Our Story Editor" },
          { id: "faq", label: "7. FAQ Manager" },
          { id: "contact", label: "8. Contact Information" },
          { id: "footer", label: "9. Footer Manager" },
          { id: "social", label: "10. Social Media Links" },
          { id: "seo", label: "11. SEO Content Manager" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CmsManagerTab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? "bg-brand-green-900 text-white shadow-xs"
                : "bg-white border border-brand-cream-300 text-brand-charcoal-700 hover:bg-brand-cream-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 1. HOMEPAGE SECTIONS MANAGER */}
      {/* ============================================================== */}
      {activeTab === "homepage" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-brand-cream-300 shadow-card">
            <div>
              <h2 className="font-heading font-black text-lg text-brand-green-950">
                Homepage Section Layout &amp; Reordering
              </h2>
              <p className="text-xs text-brand-charcoal-600 mt-0.5">
                Reorder sections, toggle live visibility, or jump directly into any section editor.
              </p>
            </div>
            <button
              onClick={() => setIsAddSectionOpen(true)}
              className="px-4 py-2 rounded-xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Section</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-brand-cream-300 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-cream-100 text-brand-charcoal-700 font-heading font-bold uppercase tracking-wider text-[11px] border-b border-brand-cream-200">
                  <tr>
                    <th className="px-5 py-3.5 w-16 text-center">Order</th>
                    <th className="px-5 py-3.5">Section Title &amp; Key</th>
                    <th className="px-5 py-3.5">Assigned Media</th>
                    <th className="px-5 py-3.5">Visibility Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream-200">
                  {sections.map((sec, idx) => (
                    <tr key={sec.id} className="hover:bg-brand-cream-50/60 transition">
                      {/* Order and Up/Down arrows */}
                      <td className="px-5 py-3.5 text-center font-bold">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-mono text-brand-charcoal-500">{idx + 1}</span>
                          <div className="flex flex-col">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveOrder(idx, "up")}
                              className="text-brand-charcoal-400 hover:text-brand-green-900 disabled:opacity-20 transition"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              disabled={idx === sections.length - 1}
                              onClick={() => handleMoveOrder(idx, "down")}
                              className="text-brand-charcoal-400 hover:text-brand-green-900 disabled:opacity-20 transition"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Section details */}
                      <td className="px-5 py-3.5">
                        <div className="font-heading font-bold text-brand-green-950 text-sm">
                          {sec.title || sec.sectionKey}
                        </div>
                        <div className="text-[11px] font-mono text-brand-charcoal-500">
                          Key: {sec.sectionKey} • Page: {sec.page || "home"}
                        </div>
                        {sec.subtitle && (
                          <div className="text-[11px] text-brand-charcoal-600 line-clamp-1 mt-0.5 max-w-md">
                            {sec.subtitle}
                          </div>
                        )}
                      </td>

                      {/* Media preview */}
                      <td className="px-5 py-3.5">
                        {sec.mediaAsset?.secureUrl || sec.fallbackUrl ? (
                          <div className="flex items-center gap-2">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-brand-cream-200 border border-brand-cream-300 shrink-0">
                              <Image
                                src={sec.mediaAsset?.secureUrl || sec.fallbackUrl || ""}
                                alt={sec.title || "Section image"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-[10px] text-brand-charcoal-600 line-clamp-1 max-w-[120px]">
                              {sec.mediaAsset?.title || "Custom URL"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-brand-charcoal-400 italic">No image</span>
                        )}
                      </td>

                      {/* Status toggle */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleToggleStatus(sec.sectionKey, sec.isActive)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border transition ${
                            sec.isActive
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {sec.isActive ? "● Published" : "○ Hidden"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            if (sec.sectionKey.includes("hero")) setActiveTab("hero");
                            else if (sec.sectionKey.includes("promo")) setActiveTab("promo");
                            else if (sec.sectionKey.includes("featured")) setActiveTab("featured");
                            else if (sec.sectionKey.includes("about")) setActiveTab("about");
                            else if (sec.sectionKey.includes("story")) setActiveTab("story");
                            else if (sec.sectionKey.includes("faq")) setActiveTab("faq");
                            else if (sec.sectionKey.includes("contact")) setActiveTab("contact");
                            else if (sec.sectionKey.includes("footer")) setActiveTab("footer");
                          }}
                          className="px-3 py-1.5 rounded-lg border border-brand-cream-300 hover:border-brand-green-800 text-brand-green-950 font-bold text-[11px] transition"
                        >
                          Edit Content
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. HERO SECTION MANAGER */}
      {/* ============================================================== */}
      {activeTab === "hero" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSection({
              sectionKey: "home_hero_banner",
              page: "home",
              title: heroTitle,
              subtitle: heroSubtitle,
              badgeText: heroBadge,
              ctaText: heroCtaText,
              ctaLink: heroCtaLink,
              secondaryCtaText: heroSecCtaText,
              secondaryCtaLink: heroSecCtaLink,
              fallbackUrl: heroImageUrl,
              metadata: {
                stats: [
                  { val: heroStat1Val, label: heroStat1Label },
                  { val: heroStat2Val, label: heroStat2Label },
                  { val: heroStat3Val, label: heroStat3Label },
                ],
                reviewText: heroReviewQuote,
                reviewer: heroReviewer,
              },
            });
          }}
          className="space-y-6"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4">
              <div>
                <h2 className="font-heading font-black text-lg text-brand-green-950">
                  Homepage Hero Section Manager
                </h2>
                <p className="text-brand-charcoal-600 mt-0.5">
                  Customize the first screen athletes and customers experience on ORGANICHY.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenMediaPicker("home_hero_banner")}
                className="px-4 py-2 rounded-xl bg-brand-cream-100 hover:bg-brand-cream-200 text-brand-green-950 font-bold flex items-center gap-1.5 transition"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Media Library Picker</span>
              </button>
            </div>

            {/* Badge & Headline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Top Micro-Badge Text</label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  placeholder="e.g. HANDCRAFTED IN MORADABAD, UTTAR PRADESH"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold text-brand-green-950 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Main Headline</label>
                <input
                  type="text"
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="e.g. 100% Pure Indian Slow-Roasted Peanut Butter"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold text-brand-green-950 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>
            </div>

            {/* Subtitle / Description */}
            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Hero Narrative &amp; Mission Description</label>
              <textarea
                rows={3}
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
            </div>

            {/* Hero Image Preview and URL */}
            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Hero Product Image URL</label>
              <div className="flex gap-4 items-center">
                {heroImageUrl && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-brand-cream-300 bg-brand-cream-100 shrink-0">
                    <Image src={heroImageUrl} alt="Hero preview" fill className="object-cover" />
                  </div>
                )}
                <input
                  type="url"
                  required
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Primary CTA Button</label>
                <input
                  type="text"
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-brand-cream-300 font-bold text-brand-green-950"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Primary CTA URL</label>
                <input
                  type="text"
                  value={heroCtaLink}
                  onChange={(e) => setHeroCtaLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-brand-cream-300 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Secondary Button</label>
                <input
                  type="text"
                  value={heroSecCtaText}
                  onChange={(e) => setHeroSecCtaText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-brand-cream-300 font-bold text-brand-green-950"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Secondary CTA URL</label>
                <input
                  type="text"
                  value={heroSecCtaLink}
                  onChange={(e) => setHeroSecCtaLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-brand-cream-300 font-mono"
                />
              </div>
            </div>

            {/* Micro Benefit Stats */}
            <div className="pt-3 border-t border-brand-cream-200">
              <h3 className="font-heading font-bold text-sm text-brand-green-900 mb-3">
                Key Nutritional Highlight Chips
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-brand-cream-100/60 rounded-2xl border border-brand-cream-200 space-y-1">
                  <label className="text-[10px] font-bold text-brand-charcoal-600 uppercase">Stat 1</label>
                  <input
                    type="text"
                    value={heroStat1Val}
                    onChange={(e) => setHeroStat1Val(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-brand-cream-300 font-black text-brand-green-900 text-xs mb-1"
                  />
                  <input
                    type="text"
                    value={heroStat1Label}
                    onChange={(e) => setHeroStat1Label(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-brand-cream-300 text-brand-charcoal-700 text-xs"
                  />
                </div>

                <div className="p-3 bg-brand-cream-100/60 rounded-2xl border border-brand-cream-200 space-y-1">
                  <label className="text-[10px] font-bold text-brand-charcoal-600 uppercase">Stat 2</label>
                  <input
                    type="text"
                    value={heroStat2Val}
                    onChange={(e) => setHeroStat2Val(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-brand-cream-300 font-black text-brand-green-900 text-xs mb-1"
                  />
                  <input
                    type="text"
                    value={heroStat2Label}
                    onChange={(e) => setHeroStat2Label(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-brand-cream-300 text-brand-charcoal-700 text-xs"
                  />
                </div>

                <div className="p-3 bg-brand-cream-100/60 rounded-2xl border border-brand-cream-200 space-y-1">
                  <label className="text-[10px] font-bold text-brand-charcoal-600 uppercase">Stat 3</label>
                  <input
                    type="text"
                    value={heroStat3Val}
                    onChange={(e) => setHeroStat3Val(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-brand-cream-300 font-black text-brand-green-900 text-xs mb-1"
                  />
                  <input
                    type="text"
                    value={heroStat3Label}
                    onChange={(e) => setHeroStat3Label(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-brand-cream-300 text-brand-charcoal-700 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs shadow-xs disabled:opacity-50 transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Publishing Changes..." : "Publish Hero Section"}</span>
          </button>
        </form>
      )}

      {/* ============================================================== */}
      {/* 3. PROMOTIONAL BANNERS MANAGER */}
      {/* ============================================================== */}
      {activeTab === "promo" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSection({
              sectionKey: "home_promo_banner",
              page: "home",
              title: promoTitle,
              subtitle: promoSubtitle,
              badgeText: promoBadge,
              ctaText: promoCtaText,
              ctaLink: promoCtaLink,
              isActive: promoActive,
              metadata: {
                couponCode: promoCoupon,
                announcementBarText: announcementText,
              },
            });
          }}
          className="space-y-6"
        >
          {/* Top Ticker Announcement Bar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4 text-xs">
            <h2 className="font-heading font-black text-lg text-brand-green-950 border-b border-brand-cream-200 pb-3">
              Storewide Top Announcement Bar
            </h2>
            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Announcement Ticker Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-brand-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-mint-300"
              />
              <p className="text-[11px] text-brand-charcoal-500">
                Shown prominently at the very top of all store pages (free shipping threshold &amp; Moradabad roast callout).
              </p>
            </div>
          </div>

          {/* Mid-page Promotional Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-3">
              <div>
                <h2 className="font-heading font-black text-lg text-brand-green-950">
                  Homepage Promotional Discount Banner
                </h2>
                <p className="text-brand-charcoal-600 mt-0.5">
                  High-converting callout with 1-click discount coupon copy and CTA button.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-brand-green-950">
                <input
                  type="checkbox"
                  checked={promoActive}
                  onChange={(e) => setPromoActive(e.target.checked)}
                  className="w-4 h-4 text-brand-green-800 rounded-sm focus:ring-brand-mint-300"
                />
                <span>Banner Active</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Banner Badge</label>
                <input
                  type="text"
                  value={promoBadge}
                  onChange={(e) => setPromoBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Banner Headline</label>
                <input
                  type="text"
                  required
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold text-brand-green-950"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Subtitle / Description</label>
              <textarea
                rows={2}
                value={promoSubtitle}
                onChange={(e) => setPromoSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Coupon Code</label>
                <input
                  type="text"
                  value={promoCoupon}
                  onChange={(e) => setPromoCoupon(e.target.value.toUpperCase())}
                  placeholder="e.g. ORGANICHY10"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono font-bold text-brand-green-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Button Text</label>
                <input
                  type="text"
                  value={promoCtaText}
                  onChange={(e) => setPromoCtaText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Button URL</label>
                <input
                  type="text"
                  value={promoCtaLink}
                  onChange={(e) => setPromoCtaLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs shadow-xs disabled:opacity-50 transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Publishing..." : "Publish Promotional Banners"}</span>
          </button>
        </form>
      )}

      {/* ============================================================== */}
      {/* 4. FEATURED PRODUCTS MANAGER */}
      {/* ============================================================== */}
      {activeTab === "featured" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSection({
              sectionKey: "home_featured_products",
              page: "home",
              title: featuredTitle,
              subtitle: featuredSubtitle,
              badgeText: featuredBadge,
              metadata: {
                featuredProductIds: selectedProductIds,
              },
            });
          }}
          className="space-y-6"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-5 text-xs">
            <h2 className="font-heading font-black text-lg text-brand-green-950 border-b border-brand-cream-200 pb-3">
              Homepage Featured Product Lineup
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Badge Text</label>
                <input
                  type="text"
                  value={featuredBadge}
                  onChange={(e) => setFeaturedBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Section Heading</label>
                <input
                  type="text"
                  value={featuredTitle}
                  onChange={(e) => setFeaturedTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold text-brand-green-950"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Section Subtitle</label>
              <input
                type="text"
                value={featuredSubtitle}
                onChange={(e) => setFeaturedSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300"
              />
            </div>

            {/* Product checkboxes */}
            <div className="pt-2">
              <label className="font-bold text-brand-charcoal-700 block mb-2">
                Select Featured Products to Display on Homepage ({selectedProductIds.length} Selected)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_PRODUCTS.map((prod) => {
                  const isChecked = selectedProductIds.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedProductIds(selectedProductIds.filter((id) => id !== prod.id));
                        } else {
                          setSelectedProductIds([...selectedProductIds, prod.id]);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                        isChecked
                          ? "bg-brand-mint-50/70 border-brand-mint-400 text-brand-green-950"
                          : "bg-white border-brand-cream-300 text-brand-charcoal-600 hover:bg-brand-cream-50"
                      }`}
                    >
                      <span className="font-bold">{prod.name}</span>
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-brand-green-800" />
                      ) : (
                        <Square className="w-4 h-4 text-brand-charcoal-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs shadow-xs disabled:opacity-50 transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Publishing..." : "Publish Featured Products"}</span>
          </button>
        </form>
      )}

      {/* ============================================================== */}
      {/* 5. ABOUT US CONTENT EDITOR */}
      {/* ============================================================== */}
      {activeTab === "about" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSection({
              sectionKey: "about_content",
              page: "about",
              title: aboutTitle,
              subtitle: aboutSubtitle,
              badgeText: aboutBadge,
              content: aboutContent,
              fallbackUrl: aboutImageUrl,
              metadata: {
                facilityLocation: aboutFacility,
                founder: "Sourav",
              },
            });
          }}
          className="space-y-6"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4">
              <div>
                <h2 className="font-heading font-black text-lg text-brand-green-950">
                  About Us Page &amp; Facility Narrative
                </h2>
                <p className="text-brand-charcoal-600 mt-0.5">
                  Share our Moradabad facility standards, pure ingredients philosophy, and transparency.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenMediaPicker("about_content")}
                className="px-4 py-2 rounded-xl bg-brand-cream-100 hover:bg-brand-cream-200 text-brand-green-950 font-bold flex items-center gap-1.5 transition"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Media Library Picker</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Badge Text</label>
                <input
                  type="text"
                  value={aboutBadge}
                  onChange={(e) => setAboutBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Headline</label>
                <input
                  type="text"
                  required
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold text-brand-green-950"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Subtitle</label>
              <input
                type="text"
                value={aboutSubtitle}
                onChange={(e) => setAboutSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Facility Location Callout</label>
              <input
                type="text"
                value={aboutFacility}
                onChange={(e) => setAboutFacility(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">About Narrative &amp; Mission</label>
              <textarea
                rows={6}
                required
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-brand-charcoal-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Facility Photography Image URL</label>
              <div className="flex gap-4 items-center">
                {aboutImageUrl && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-brand-cream-300 shrink-0">
                    <Image src={aboutImageUrl} alt="About preview" fill className="object-cover" />
                  </div>
                )}
                <input
                  type="url"
                  value={aboutImageUrl}
                  onChange={(e) => setAboutImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono text-brand-charcoal-900"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs shadow-xs disabled:opacity-50 transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Publishing..." : "Publish About Us Content"}</span>
          </button>
        </form>
      )}

      {/* ============================================================== */}
      {/* 6. OUR STORY EDITOR */}
      {/* ============================================================== */}
      {activeTab === "story" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSection({
              sectionKey: "our_story_content",
              page: "story",
              title: storyTitle,
              subtitle: storySubtitle,
              badgeText: storyBadge,
              content: storyContent,
              fallbackUrl: storyImageUrl,
              metadata: {
                quote: storyQuote,
                milestones: storyMilestones,
              },
            });
          }}
          className="space-y-6"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4">
              <div>
                <h2 className="font-heading font-black text-lg text-brand-green-950">
                  Our Story &amp; Founder Sourav&apos;s Journey
                </h2>
                <p className="text-brand-charcoal-600 mt-0.5">
                  The origin story from a home drum roaster in Moradabad to pan-India athletes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenMediaPicker("our_story_content")}
                className="px-4 py-2 rounded-xl bg-brand-cream-100 hover:bg-brand-cream-200 text-brand-green-950 font-bold flex items-center gap-1.5 transition"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Media Library Picker</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Badge Text</label>
                <input
                  type="text"
                  value={storyBadge}
                  onChange={(e) => setStoryBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Story Page Title</label>
                <input
                  type="text"
                  required
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold text-brand-green-950"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Founder Narrative</label>
              <textarea
                rows={5}
                required
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-brand-charcoal-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Founder Quote</label>
              <input
                type="text"
                value={storyQuote}
                onChange={(e) => setStoryQuote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 italic"
              />
            </div>

            {/* Milestones timeline editor */}
            <div className="pt-3 border-t border-brand-cream-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-sm text-brand-green-900">
                    Story Timeline Milestones
                  </h3>
                  <p className="text-[11px] text-brand-charcoal-500">
                    Interactive milestones displayed on the Our Story page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3 py-1.5 rounded-xl bg-brand-cream-100 hover:bg-brand-cream-200 text-brand-green-950 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {storyMilestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-300 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={m.year}
                        onChange={(e) => handleUpdateMilestone(idx, "year", e.target.value)}
                        placeholder="Phase / Year"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-brand-cream-300 font-bold text-xs"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => handleUpdateMilestone(idx, "title", e.target.value)}
                        placeholder="Milestone Title"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-brand-cream-300 font-bold text-xs"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={m.desc}
                        onChange={(e) => handleUpdateMilestone(idx, "desc", e.target.value)}
                        placeholder="Description..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-brand-cream-300 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(idx)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs shadow-xs disabled:opacity-50 transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Publishing..." : "Publish Our Story"}</span>
          </button>
        </form>
      )}

      {/* ============================================================== */}
      {/* 7. FAQ MANAGER */}
      {/* ============================================================== */}
      {activeTab === "faq" && (
        <div className="space-y-6">
          {/* Add New FAQ Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4 text-xs">
            <h2 className="font-heading font-black text-lg text-brand-green-950 border-b border-brand-cream-200 pb-3">
              Add New Frequently Asked Question
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-3 space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Question</label>
                <input
                  type="text"
                  value={newFaqQ}
                  onChange={(e) => setNewFaqQ(e.target.value)}
                  placeholder="e.g. Why does peanut butter separate naturally?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Category</label>
                <select
                  value={newFaqCat}
                  onChange={(e) => setNewFaqCat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold bg-white"
                >
                  <option value="Purity">Purity</option>
                  <option value="Ingredients">Ingredients</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Production">Production</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Storage">Storage</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Answer</label>
              <textarea
                rows={3}
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                placeholder="Detailed, honest explanation..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300"
              />
            </div>

            <button
              type="button"
              onClick={handleAddFaq}
              className="px-4 py-2 rounded-xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to FAQ List</span>
            </button>
          </div>

          {/* Existing FAQs List */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-3">
              <div>
                <h3 className="font-heading font-black text-base text-brand-green-950">
                  Active FAQs ({faqItems.length})
                </h3>
                <p className="text-brand-charcoal-600">Review, edit, or remove questions.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  saveSection({
                    sectionKey: "faq_section",
                    page: "faq",
                    title: faqTitle,
                    subtitle: faqSubtitle,
                    metadata: { faqs: faqItems },
                  });
                }}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All FAQs</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-brand-cream-50 border border-brand-cream-300 space-y-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <span className="px-2 py-0.5 rounded-full bg-brand-mint-200 text-brand-green-900 text-[10px] font-bold">
                        {item.category || "General"}
                      </span>
                      <h4 className="font-heading font-bold text-brand-green-950 text-sm">
                        {item.question}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-brand-charcoal-700 leading-relaxed text-xs">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. CONTACT INFORMATION MANAGER */}
      {/* ============================================================== */}
      {activeTab === "contact" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSection({
              sectionKey: "contact_information",
              page: "contact",
              metadata: {
                email: contactEmail,
                phone: contactPhone,
                whatsapp: contactWhatsApp,
                address: contactAddress,
                businessHours: contactHours,
              },
            });
          }}
          className="space-y-6"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-5 text-xs">
            <h2 className="font-heading font-black text-lg text-brand-green-950 border-b border-brand-cream-200 pb-3">
              Customer Support &amp; Moradabad Facility Contact Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Support Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Support Phone Number</label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">WhatsApp Helpline Number</label>
                <input
                  type="text"
                  required
                  value={contactWhatsApp}
                  onChange={(e) => setContactWhatsApp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Business Operating Hours</label>
                <input
                  type="text"
                  value={contactHours}
                  onChange={(e) => setContactHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">
                Official Moradabad Facility &amp; Dispatch Address
              </label>
              <textarea
                rows={2}
                required
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-brand-charcoal-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs shadow-xs disabled:opacity-50 transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Publishing..." : "Publish Contact Information"}</span>
          </button>
        </form>
      )}

      {/* ============================================================== */}
      {/* 9. FOOTER CONTENT MANAGER */}
      {/* ============================================================== */}
      {activeTab === "footer" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSection({
              sectionKey: "footer_content",
              page: "footer",
              title: footerTitle,
              content: footerContent,
              metadata: {
                copyrightText: footerCopyright,
                disclaimerText: footerDisclaimer,
              },
            });
          }}
          className="space-y-6"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-5 text-xs">
            <h2 className="font-heading font-black text-lg text-brand-green-950 border-b border-brand-cream-200 pb-3">
              Footer Brand Statement &amp; Legal Notices
            </h2>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Footer Brand Tagline</label>
              <input
                type="text"
                value={footerTitle}
                onChange={(e) => setFooterTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Brand Mission Paragraph</label>
              <textarea
                rows={3}
                value={footerContent}
                onChange={(e) => setFooterContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Copyright Line</label>
                <input
                  type="text"
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">FSSAI / Nutrition Disclaimer</label>
                <input
                  type="text"
                  value={footerDisclaimer}
                  onChange={(e) => setFooterDisclaimer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs shadow-xs disabled:opacity-50 transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Publishing..." : "Publish Footer Content"}</span>
          </button>
        </form>
      )}

      {/* ============================================================== */}
      {/* 10. SOCIAL MEDIA LINK MANAGER */}
      {/* ============================================================== */}
      {activeTab === "social" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSection({
              sectionKey: "social_media_links",
              page: "global",
              metadata: {
                instagram: socialInstagram,
                facebook: socialFacebook,
                youtube: socialYouTube,
                whatsapp: socialWhatsApp,
                twitter: socialTwitter,
              },
            });
          }}
          className="space-y-6"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-5 text-xs">
            <h2 className="font-heading font-black text-lg text-brand-green-950 border-b border-brand-cream-200 pb-3">
              Official Social Media &amp; Community Channels
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Instagram Profile URL</label>
                <input
                  type="url"
                  value={socialInstagram}
                  onChange={(e) => setSocialInstagram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">Facebook Page URL</label>
                <input
                  type="url"
                  value={socialFacebook}
                  onChange={(e) => setSocialFacebook(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">YouTube Channel URL</label>
                <input
                  type="url"
                  value={socialYouTube}
                  onChange={(e) => setSocialYouTube(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">WhatsApp Direct Chat Link</label>
                <input
                  type="url"
                  value={socialWhatsApp}
                  onChange={(e) => setSocialWhatsApp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-charcoal-700 block">X / Twitter Handle URL</label>
                <input
                  type="url"
                  value={socialTwitter}
                  onChange={(e) => setSocialTwitter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs shadow-xs disabled:opacity-50 transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Publishing..." : "Publish Social Media Links"}</span>
          </button>
        </form>
      )}

      {/* ============================================================== */}
      {/* 11. SEO CONTENT MANAGER */}
      {/* ============================================================== */}
      {activeTab === "seo" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveSection({
              sectionKey: "seo_metadata",
              page: "seo",
              metadata: {
                metaTitle: seoMetaTitle,
                metaDescription: seoMetaDesc,
                keywords: seoKeywords,
                ogImage: seoOgImage,
              },
            });
          }}
          className="space-y-6"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-cream-300 shadow-card space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-4">
              <div>
                <h2 className="font-heading font-black text-lg text-brand-green-950">
                  Global Storefront SEO &amp; Social Share Metadata
                </h2>
                <p className="text-brand-charcoal-600 mt-0.5">
                  Optimized for Google SERP snippet rankings, WhatsApp previews, and OpenGraph social shares.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenMediaPicker("seo_metadata")}
                className="px-4 py-2 rounded-xl bg-brand-cream-100 hover:bg-brand-cream-200 text-brand-green-950 font-bold flex items-center gap-1.5 transition"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Media Library Picker</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">
                Default Meta Title (Google Search Headline)
              </label>
              <input
                type="text"
                required
                value={seoMetaTitle}
                onChange={(e) => setSeoMetaTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-bold text-brand-green-950"
              />
              <span className="text-[10px] text-brand-charcoal-500">
                Recommended length: 50–60 characters. Current: {seoMetaTitle.length} chars.
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">
                Default Meta Description (Google SERP Snippet)
              </label>
              <textarea
                rows={3}
                required
                value={seoMetaDesc}
                onChange={(e) => setSeoMetaDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 text-brand-charcoal-900"
              />
              <span className="text-[10px] text-brand-charcoal-500">
                Recommended length: 140–160 characters. Current: {seoMetaDesc.length} chars.
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">
                Target SEO Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">
                OpenGraph Social Share Image URL (1200x630 recommended)
              </label>
              <div className="flex gap-4 items-center">
                {seoOgImage && (
                  <div className="relative w-20 h-12 rounded-xl overflow-hidden border border-brand-cream-300 shrink-0">
                    <Image src={seoOgImage} alt="OG Preview" fill className="object-cover" />
                  </div>
                )}
                <input
                  type="url"
                  value={seoOgImage}
                  onChange={(e) => setSeoOgImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-cream-300 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-brand-green-900 hover:bg-brand-green-800 text-white font-heading font-bold text-xs shadow-xs disabled:opacity-50 transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Publishing..." : "Publish SEO Metadata"}</span>
          </button>
        </form>
      )}

      {/* ============================================================== */}
      {/* MODAL: MEDIA LIBRARY IMAGE PICKER */}
      {/* ============================================================== */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-brand-cream-300 animate-scaleUp">
            {/* Modal Header */}
            <div className="p-6 border-b border-brand-cream-200 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-lg text-brand-green-950 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-brand-green-800" />
                  <span>Select Image from Media Library</span>
                </h3>
                <p className="text-xs text-brand-charcoal-600 mt-0.5">
                  Click on any uploaded asset to link it directly to &apos;{targetImageField?.sectionKey}&apos;.
                </p>
              </div>
              <button
                onClick={() => setIsMediaModalOpen(false)}
                className="p-2 rounded-xl hover:bg-brand-cream-100 text-brand-charcoal-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-3 bg-brand-cream-50 border-b border-brand-cream-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-brand-charcoal-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-brand-cream-300 text-xs bg-white"
                />
              </div>

              <select
                value={mediaFolderFilter}
                onChange={(e) => setMediaFolderFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-brand-cream-300 text-xs bg-white font-bold"
              >
                <option value="ALL">All Categories</option>
                <option value="Homepage Hero">Homepage Hero</option>
                <option value="Homepage Banners">Homepage Banners</option>
                <option value="Product Images">Product Images</option>
                <option value="About Us Images">About Us Images</option>
                <option value="Our Story Images">Our Story Images</option>
              </select>
            </div>

            {/* Assets Grid */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.length === 0 ? (
                <div className="col-span-full py-12 text-center text-xs text-brand-charcoal-500">
                  No images found. Upload new photos in the Media Library.
                </div>
              ) : (
                filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectMediaItem(item)}
                    className="group relative rounded-2xl overflow-hidden border-2 border-brand-cream-300 hover:border-brand-green-800 bg-brand-cream-100 aspect-square cursor-pointer transition shadow-2xs hover:shadow-card"
                  >
                    <Image src={item.secureUrl} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-brand-green-950/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2.5 text-white">
                      <span className="font-bold text-xs truncate">{item.title}</span>
                      <span className="text-[10px] text-brand-mint-300">{item.folder}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-brand-cream-50 border-t border-brand-cream-200 flex items-center justify-between text-xs">
              <Link
                href="/admin/media"
                target="_blank"
                className="font-bold text-brand-green-900 hover:underline flex items-center gap-1"
              >
                <span>Upload New Files to Media Library</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setIsMediaModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white border border-brand-cream-300 font-bold hover:bg-brand-cream-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: LIVE STOREFRONT PREVIEW */}
      {/* ============================================================== */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-brand-cream-300 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-brand-cream-100 border-b border-brand-cream-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-green-900" />
                <span className="font-heading font-black text-sm text-brand-green-950">
                  Storefront Live Content Preview
                </span>
              </div>

              {/* Device switcher */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-brand-cream-300">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    previewDevice === "desktop"
                      ? "bg-brand-green-900 text-white"
                      : "text-brand-charcoal-600 hover:bg-brand-cream-100"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    previewDevice === "mobile"
                      ? "bg-brand-green-900 text-white"
                      : "text-brand-charcoal-600 hover:bg-brand-cream-100"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>

              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-brand-cream-200 text-brand-charcoal-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Frame */}
            <div className="overflow-y-auto p-6 bg-brand-cream-50 flex-1 flex justify-center">
              <div
                className={`transition-all duration-300 ${
                  previewDevice === "mobile"
                    ? "w-[375px] border-4 border-brand-charcoal-800 rounded-3xl shadow-2xl overflow-hidden bg-white"
                    : "w-full max-w-4xl bg-white rounded-2xl shadow-card p-6"
                }`}
              >
                {/* Simulated Announcement Bar */}
                {announcementText && (
                  <div className="bg-brand-green-900 text-brand-cream-100 text-[11px] font-bold text-center py-2 px-3">
                    {announcementText}
                  </div>
                )}

                {/* Simulated Hero Section */}
                <div className="py-8 px-4 sm:px-6 space-y-6">
                  {heroBadge && (
                    <span className="inline-block px-3 py-1 rounded-full bg-brand-mint-100 text-brand-green-900 text-[10px] font-bold tracking-wide">
                      {heroBadge}
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-4xl font-heading font-black text-brand-green-950 leading-tight">
                    {heroTitle || "100% Pure Indian Slow-Roasted Peanut Butter"}
                  </h1>
                  <p className="text-xs sm:text-sm text-brand-charcoal-700 leading-relaxed">
                    {heroSubtitle}
                  </p>

                  <div className="flex gap-2">
                    <span className="px-5 py-2.5 rounded-full bg-brand-green-900 text-white text-xs font-bold">
                      {heroCtaText || "Shop Now"}
                    </span>
                    <span className="px-5 py-2.5 rounded-full border border-brand-green-900 text-brand-green-900 text-xs font-bold">
                      {heroSecCtaText || "Explore"}
                    </span>
                  </div>

                  {heroImageUrl && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-card border border-brand-cream-300">
                      <Image src={heroImageUrl} alt="Hero preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD CUSTOM SECTION */}
      {/* ============================================================== */}
      {isAddSectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleAddSection}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-cream-300 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-brand-cream-200 pb-3">
              <h3 className="font-heading font-black text-base text-brand-green-950">
                Create New Custom Section
              </h3>
              <button
                type="button"
                onClick={() => setIsAddSectionOpen(false)}
                className="p-1 rounded-lg text-brand-charcoal-500 hover:bg-brand-cream-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Section Identifier Key</label>
              <input
                type="text"
                required
                placeholder="e.g. home_festival_banner"
                value={newSectionKey}
                onChange={(e) => setNewSectionKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-brand-cream-300 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Section Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Diwali Nutrition Gift Hampers"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-brand-cream-300 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-charcoal-700 block">Target Page</label>
              <select
                value={newSectionPage}
                onChange={(e) => setNewSectionPage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-brand-cream-300 font-bold bg-white"
              >
                <option value="home">Homepage</option>
                <option value="about">About Us</option>
                <option value="story">Our Story</option>
                <option value="faq">FAQ</option>
                <option value="footer">Footer</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddSectionOpen(false)}
                className="px-4 py-2 rounded-xl border border-brand-cream-300 font-bold text-brand-charcoal-700 hover:bg-brand-cream-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-green-900 text-white font-bold hover:bg-brand-green-800"
              >
                Create Section
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
