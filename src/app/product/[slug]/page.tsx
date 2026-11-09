import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_PRODUCTS } from "@/lib/demoData";
import { SITE_URL, getProductSchema, getBreadcrumbSchema } from "@/lib/seo";
import ProductClientView from "./ProductClientView";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product =
    DEMO_PRODUCTS.find((p) => p.slug === params.slug) || DEMO_PRODUCTS[0];

  if (!product) {
    return {
      title: "Product Not Found | ORGANICHY",
      description: "The requested nutrition product could not be found.",
    };
  }

  const title = `${product.title} | 100% Pure Peanut Butter | ORGANICHY`;
  const description =
    product.shortDescription ||
    `${product.title} slow-roasted in Moradabad, Uttar Pradesh. Zero palm oil, 100% natural Indian peanuts with high protein content. Order online with Free All-India shipping above ₹499.`;
  const canonicalUrl = `${SITE_URL}/product/${product.slug}`;
  const primaryImage =
    product.images[0]?.url || `${SITE_URL}/images/default-peanut-butter.jpg`;

  return {
    title,
    description,
    keywords: [
      product.title,
      "ORGANICHY Peanut Butter",
      "All Natural Peanut Butter Moradabad",
      "High Protein Spread",
      "Zero Palm Oil Peanut Butter",
      "Buy Peanut Butter Online India",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "ORGANICHY",
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 800,
          alt: `${product.title} Jar - ORGANICHY Pure Nutrition`,
        },
      ],
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImage],
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product =
    DEMO_PRODUCTS.find((p) => p.slug === params.slug) || DEMO_PRODUCTS[0];

  if (!product) {
    notFound();
  }

  const productJsonLd = getProductSchema(product);
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Shop All", item: "/shop" },
    { name: product.title, item: `/product/${product.slug}` },
  ]);

  return (
    <>
      {/* Product Structured Data (Rich Snippets in Google Search) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ProductClientView params={params} />
    </>
  );
}
