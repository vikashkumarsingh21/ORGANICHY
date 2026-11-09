import { BRAND } from "@/lib/constants";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://organichy.com";

/**
 * Generate Organization JSON-LD Schema
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    legalName: "ORGANICHY Pure Nutrition",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: BRAND.description,
    founder: {
      "@type": "Person",
      name: BRAND.founder,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Central Roasting Facility, Civil Lines",
      addressLocality: "Moradabad",
      addressRegion: "Uttar Pradesh",
      postalCode: "244001",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: BRAND.supportPhone,
        contactType: "Customer Support",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    sameAs: [
      BRAND.socials.instagram,
      BRAND.socials.facebook,
      BRAND.socials.youtube,
    ],
  };
}

/**
 * Generate WebSite JSON-LD Schema with SearchAction
 */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.name,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate Product JSON-LD Schema
 */
export function getProductSchema(product: {
  id?: string;
  title: string;
  slug: string;
  description: string;
  images?: Array<{ url: string }> | string[];
  variants?: Array<{
    price: number;
    salePrice?: number | null;
    sku?: string;
    stock?: number;
  }>;
  rating?: number;
  reviewCount?: number;
  ingredients?: string | null;
}) {
  const images = (product.images || []).map((img) =>
    typeof img === "string" ? img : img.url
  );

  const primaryVariant = product.variants?.[0];
  const price = primaryVariant?.salePrice || primaryVariant?.price || 499;
  const sku = primaryVariant?.sku || `ORG-PB-${product.slug.toUpperCase()}`;
  const inStock = (primaryVariant?.stock ?? 100) > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: images.length > 0 ? images : [`${SITE_URL}/images/default-peanut-butter.jpg`],
    description: product.description,
    sku: sku,
    brand: {
      "@type": "Brand",
      name: BRAND.name,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: BRAND.name,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: price >= 499 ? 0 : 49,
          currency: "INR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "d",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewCount || 124,
      bestRating: "5",
      worstRating: "1",
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD Schema
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; item: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: crumb.item.startsWith("http") ? crumb.item : `${SITE_URL}${crumb.item}`,
    })),
  };
}

