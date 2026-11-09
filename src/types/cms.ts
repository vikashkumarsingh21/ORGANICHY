import { MediaItemRecord } from "./media";

export type CmsPageIdentifier =
  | "home"
  | "about"
  | "story"
  | "faq"
  | "contact"
  | "footer"
  | "seo"
  | "global";

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  category?: string;
}

export interface StoryMilestone {
  year: string;
  title: string;
  desc: string;
}

export interface SocialLinksPayload {
  instagram: string;
  facebook: string;
  youtube: string;
  whatsapp: string;
  twitter?: string;
}

export interface SeoPayload {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface CmsSectionRecord {
  id: string;
  sectionKey: string;
  page: string;
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  badgeText?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaLink?: string | null;
  mediaAssetId?: string | null;
  mediaItemId?: string | null;
  fallbackUrl?: string | null;
  metadata?: any;
  isActive: boolean;
  displayOrder: number;
  createdAt?: Date | string;
  updatedAt: Date | string;
  mediaAsset?: MediaItemRecord | null;
  mediaItem?: MediaItemRecord | null;
}

