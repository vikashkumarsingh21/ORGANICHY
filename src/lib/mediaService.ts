import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import {
  MEDIA_CATEGORIES,
  MediaCategory,
  MediaItemRecord,
  SiteSectionRecord,
} from "@/types/media";

export { MEDIA_CATEGORIES };
export type { MediaCategory, MediaItemRecord, SiteSectionRecord };

// In-memory persistent store for development or when database is connecting
const inMemoryMedia: MediaItemRecord[] = [
  {
    id: "media_hero_01",
    title: "100% Pure Slow Roasted Peanut Butter Jar (Classic)",
    publicId: "organichy_hero_peanut_butter_jar",
    secureUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1200&auto=format&fit=crop",
    width: 1200,
    height: 1200,
    format: "webp",
    bytes: 342190,
    folder: "Homepage Hero",
    altText: "ORGANICHY 100% Pure Slow Roasted Peanut Butter Jar in Moradabad",
    tags: ["peanut-butter", "hero", "moradabad", "natural"],
    createdAt: new Date("2026-11-01T10:00:00Z"),
    updatedAt: new Date("2026-11-01T10:00:00Z"),
  },
  {
    id: "media_crunch_02",
    title: "Crunchy Peanut Butter Roasted Texture Spread",
    publicId: "organichy_crunchy_texture_spread",
    secureUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1000&auto=format&fit=crop",
    width: 1000,
    height: 1000,
    format: "jpg",
    bytes: 289410,
    folder: "Product Images",
    altText: "Golden roasted crunchy peanut chunks and stone-ground butter",
    tags: ["texture", "crunchy", "roasted"],
    createdAt: new Date("2026-11-02T11:30:00Z"),
    updatedAt: new Date("2026-11-02T11:30:00Z"),
  },
  {
    id: "media_choco_03",
    title: "Dark Chocolate High Protein Peanut Butter Jar",
    publicId: "organichy_dark_chocolate_jar",
    secureUrl: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=1000&auto=format&fit=crop",
    width: 1000,
    height: 1000,
    format: "webp",
    bytes: 312000,
    folder: "Product Images",
    altText: "Dark chocolate and slow roasted peanuts blended for athletic fuel",
    tags: ["dark-chocolate", "product", "protein"],
    createdAt: new Date("2026-11-03T14:15:00Z"),
    updatedAt: new Date("2026-11-03T14:15:00Z"),
  },
  {
    id: "media_founder_04",
    title: "Sourav - Founder & Head of Quality in Moradabad",
    publicId: "organichy_founder_sourav",
    secureUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    width: 1000,
    height: 1250,
    format: "jpg",
    bytes: 420100,
    folder: "Our Story Images",
    altText: "Sourav, Founder of ORGANICHY in Moradabad, Uttar Pradesh",
    tags: ["founder", "sourav", "moradabad", "story"],
    createdAt: new Date("2026-11-04T09:00:00Z"),
    updatedAt: new Date("2026-11-04T09:00:00Z"),
  },
  {
    id: "media_promo_05",
    title: "Athlete Starter Bundle & 10% Discount Banner",
    publicId: "organichy_starter_bundle_banner",
    secureUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    width: 1200,
    height: 600,
    format: "webp",
    bytes: 275000,
    folder: "Promotional Banners",
    altText: "ORGANICHY Gym Nutrition Starter Bundle Banner",
    tags: ["banner", "promo", "discount"],
    createdAt: new Date("2026-11-05T16:20:00Z"),
    updatedAt: new Date("2026-11-05T16:20:00Z"),
  },
];

const inMemorySections: Record<string, SiteSectionRecord> = {
  home_hero_banner: {
    id: "sec_hero",
    sectionKey: "home_hero_banner",
    title: "Homepage Hero Peanut Butter Showcase",
    subtitle: "100% Pure Indian Slow-Roasted Peanut Butter",
    ctaText: "Shop Fresh Batch",
    ctaLink: "/shop",
    mediaItemId: "media_hero_01",
    fallbackUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1200&auto=format&fit=crop",
    isActive: true,
    displayOrder: 1,
    updatedAt: new Date(),
  },
  home_promo_banner: {
    id: "sec_promo",
    sectionKey: "home_promo_banner",
    title: "Special Welcome Promo Banner",
    subtitle: "Enjoy 10% Off Your First Order with Code ORGANICHY10",
    ctaText: "Shop Fresh Roast",
    ctaLink: "/shop",
    mediaItemId: "media_promo_05",
    fallbackUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    isActive: true,
    displayOrder: 2,
    updatedAt: new Date(),
  },
  our_story_founder: {
    id: "sec_story",
    sectionKey: "our_story_founder",
    title: "Our Story Founder Spotlight",
    subtitle: "Sourav - Founder of ORGANICHY in Moradabad",
    ctaText: "Read Story",
    ctaLink: "/our-story",
    mediaItemId: "media_founder_04",
    fallbackUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    isActive: true,
    displayOrder: 3,
    updatedAt: new Date(),
  },
  about_facility_image: {
    id: "sec_about",
    sectionKey: "about_facility_image",
    title: "About Us Facility Spotlight",
    subtitle: "Moradabad Production Facility & Hygiene Standards",
    ctaText: "Our Quality Standards",
    ctaLink: "/about#facility",
    mediaItemId: "media_hero_01",
    fallbackUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    isActive: true,
    displayOrder: 4,
    updatedAt: new Date(),
  },
  category_peanut_butter: {
    id: "sec_cat_pb",
    sectionKey: "category_peanut_butter",
    title: "Peanut Butter Category Banner",
    subtitle: "Stone-Ground in Small Weekly Batches",
    ctaText: "Shop Peanut Butter",
    ctaLink: "/shop?category=peanut-butter",
    mediaItemId: "media_crunch_02",
    fallbackUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1000&auto=format&fit=crop",
    isActive: true,
    displayOrder: 5,
    updatedAt: new Date(),
  },
};

/**
 * Service to manage all media library operations on the server
 */
export const MediaService = {
  async getAll(params?: { folder?: string; search?: string }) {
    try {
      const where: any = {};
      if (params?.folder && params.folder !== "ALL") {
        where.folder = params.folder;
      }
      if (params?.search) {
        where.OR = [
          { title: { contains: params.search, mode: "insensitive" } },
          { altText: { contains: params.search, mode: "insensitive" } },
        ];
      }

      const items = await prisma.mediaAsset.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      if (items && items.length > 0) return items;
    } catch (e) {}

    let results = [...inMemoryMedia];
    if (params?.folder && params.folder !== "ALL") {
      results = results.filter((item) => item.folder === params.folder);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.altText && item.altText.toLowerCase().includes(q)) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getById(id: string) {
    try {
      const item = await prisma.mediaAsset.findUnique({ where: { id } });
      if (item) return item;
    } catch (e) {}

    return inMemoryMedia.find((m) => m.id === id) || null;
  },

  async create(data: {
    title: string;
    publicId: string;
    secureUrl: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
    folder?: string;
    altText?: string;
    tags?: string[];
  }) {
    const folder = data.folder || "Other Website Images";
    const newRecord: MediaItemRecord = {
      id: `media_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      title: data.title,
      publicId: data.publicId,
      secureUrl: data.secureUrl,
      width: data.width || 800,
      height: data.height || 800,
      format: data.format || "webp",
      bytes: data.bytes || 150000,
      folder,
      altText: data.altText || data.title,
      tags: data.tags || ["organichy"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const created = await prisma.mediaAsset.create({
        data: {
          title: newRecord.title,
          publicId: newRecord.publicId,
          secureUrl: newRecord.secureUrl,
          width: newRecord.width,
          height: newRecord.height,
          format: newRecord.format,
          bytes: newRecord.bytes,
          folder: newRecord.folder,
          altText: newRecord.altText,
          tags: newRecord.tags,
        },
      });
      return created;
    } catch (e) {}

    inMemoryMedia.unshift(newRecord);
    return newRecord;
  },

  async update(
    id: string,
    data: { title?: string; altText?: string; folder?: string; tags?: string[] }
  ) {
    try {
      const updated = await prisma.mediaAsset.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
      return updated;
    } catch (e) {}

    const index = inMemoryMedia.findIndex((m) => m.id === id);
    if (index > -1) {
      inMemoryMedia[index] = {
        ...inMemoryMedia[index],
        ...data,
        updatedAt: new Date(),
      };
      return inMemoryMedia[index];
    }
    return null;
  },

  async checkUsage(id: string): Promise<{ inUse: boolean; locations: string[] }> {
    const locations: string[] = [];

    try {
      const sections = await prisma.websiteSection.findMany({
        where: { mediaAssetId: id },
      });
      sections.forEach((sec) => locations.push(`Section: ${sec.sectionKey}`));
    } catch (e) {
      Object.values(inMemorySections).forEach((sec) => {
        if (sec.mediaItemId === id) locations.push(`Section: ${sec.sectionKey}`);
      });
    }

    try {
      const item = await this.getById(id);
      if (item?.secureUrl) {
        const productImages = await prisma.productImage.findMany({
          where: { url: item.secureUrl },
          include: { product: true },
        });
        productImages.forEach((pi) =>
          locations.push(`Product: ${pi.product.title}`)
        );
      }
    } catch (e) {}

    return {
      inUse: locations.length > 0,
      locations,
    };
  },

  async delete(id: string, force: boolean = false) {
    const usage = await this.checkUsage(id);
    if (usage.inUse && !force) {
      throw new Error(
        `Cannot delete image because it is currently assigned to: ${usage.locations.join(
          ", "
        )}. Unassign it first or use force delete.`
      );
    }

    const item = await this.getById(id);
    if (!item) return false;

    await deleteFromCloudinary(item.publicId);

    try {
      await prisma.mediaAsset.delete({ where: { id } });
    } catch (e) {}

    const idx = inMemoryMedia.findIndex((m) => m.id === id);
    if (idx > -1) {
      inMemoryMedia.splice(idx, 1);
    }
    return true;
  },

  async replace(id: string, fileBuffer: Buffer | string) {
    const existing = await this.getById(id);
    if (!existing) throw new Error("Media asset not found");

    const uploadResult = await uploadToCloudinary(fileBuffer, {
      folder: existing.folder,
      tags: existing.tags,
    });

    return await this.update(id, {
      ...existing,
      // @ts-ignore
      secureUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    });
  },

  async getAllSections(): Promise<SiteSectionRecord[]> {
    try {
      const sections = await prisma.websiteSection.findMany({
        include: { mediaAsset: true },
        orderBy: { displayOrder: "asc" },
      });
      if (sections && sections.length > 0) {
        return sections.map((sec) => ({
          ...sec,
          mediaItemId: sec.mediaAssetId || sec.id,
          mediaItem: sec.mediaAsset as any,
          metadata: sec.metadata as any,
        }));
      }
    } catch (e) {}

    const list = Object.values(inMemorySections).map((sec) => {
      const mediaItem = sec.mediaItemId
        ? inMemoryMedia.find((m) => m.id === sec.mediaItemId) || null
        : null;
      return {
        ...sec,
        mediaItem,
      };
    });
    return list;
  },

  async assignSectionMedia(
    sectionKey: string,
    mediaItemId: string,
    customUrl?: string
  ) {
    try {
      const updated = await prisma.websiteSection.upsert({
        where: { sectionKey },
        update: {
          mediaAssetId: mediaItemId,
          fallbackUrl: customUrl || null,
          updatedAt: new Date(),
        },
        create: {
          sectionKey,
          mediaAssetId: mediaItemId,
          fallbackUrl: customUrl || null,
          updatedAt: new Date(),
        },
        include: { mediaAsset: true },
      });
      return updated;
    } catch (e) {}

    if (inMemorySections[sectionKey]) {
      inMemorySections[sectionKey].mediaItemId = mediaItemId;
      if (customUrl) inMemorySections[sectionKey].fallbackUrl = customUrl;
      inMemorySections[sectionKey].updatedAt = new Date();
      return inMemorySections[sectionKey];
    } else {
      inMemorySections[sectionKey] = {
        id: `sec_${Date.now()}`,
        sectionKey,
        title: sectionKey,
        mediaItemId,
        fallbackUrl: customUrl || null,
        isActive: true,
        displayOrder: 99,
        updatedAt: new Date(),
      };
      return inMemorySections[sectionKey];
    }
  },

  async getSectionImageUrl(
    sectionKey: string,
    defaultFallback: string
  ): Promise<string> {
    try {
      const section = await prisma.websiteSection.findUnique({
        where: { sectionKey },
        include: { mediaAsset: true },
      });
      if (section?.mediaAsset?.secureUrl) return section.mediaAsset.secureUrl;
      if (section?.fallbackUrl) return section.fallbackUrl;
    } catch (e) {}

    const memorySec = inMemorySections[sectionKey];
    if (memorySec) {
      if (memorySec.mediaItemId) {
        const item = inMemoryMedia.find((m) => m.id === memorySec.mediaItemId);
        if (item?.secureUrl) return item.secureUrl;
      }
      if (memorySec.fallbackUrl) return memorySec.fallbackUrl;
    }

    return defaultFallback;
  },
};
