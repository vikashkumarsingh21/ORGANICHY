export const MEDIA_CATEGORIES = [
  "Brand Logo",
  "Homepage Hero",
  "Homepage Banners",
  "Promotional Banners",
  "Product Images",
  "Product Galleries",
  "About Us Images",
  "Our Story Images",
  "Category Banners",
  "Blog Images",
  "Other Website Images",
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];

export interface MediaItemRecord {
  id: string;
  title: string;
  publicId: string;
  secureUrl: string;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
  folder: string;
  altText?: string | null;
  tags: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SiteSectionRecord {
  id: string;
  sectionKey: string;
  page?: string;
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  badgeText?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaLink?: string | null;
  mediaItemId?: string | null;
  mediaAssetId?: string | null;
  fallbackUrl?: string | null;
  metadata?: any;
  isActive: boolean;
  displayOrder: number;
  updatedAt: Date | string;
  mediaItem?: MediaItemRecord | null;
  mediaAsset?: MediaItemRecord | null;
}

