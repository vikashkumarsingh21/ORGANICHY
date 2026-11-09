export type ProductVariantType = {
  id: string;
  productId: string;
  name: string;
  weight: string;
  flavor: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  isActive: boolean;
  isDefault: boolean;
};

export type ProductImageType = {
  id: string;
  url: string;
  publicId?: string | null;
  altText?: string | null;
  displayOrder: number;
  isThumbnail: boolean;
  variantId?: string | null;
};

export type ProductType = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description: string;
  benefits: string[];
  ingredients?: string | null;
  nutritionFacts?: Record<string, string> | null;
  categoryId: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  variants: ProductVariantType[];
  images: ProductImageType[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
};

export type CartItemType = {
  productId: string;
  variantId: string;
  title: string;
  variantName: string;
  weight: string;
  flavor: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  quantity: number;
};

export type DynamicSectionImageType = {
  sectionKey: string;
  title?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  imageUrl: string;
};

